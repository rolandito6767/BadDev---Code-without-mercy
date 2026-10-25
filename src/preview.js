import { resolveProjectReference } from './project.js';
import { getAssets, createImageResolver, inlineCssImages, inlineHtmlImages } from './assets.js';

const MAX_PREVIEW_BYTES = 7_000_000;
const MAX_IMAGE_PREVIEW_CHARS = 24_000_000; // imágenes incrustadas (base64), aparte del límite del código
// Scripts are intentionally permitted *only* in the opaque-origin sandbox iframe.
const CSP = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob: https:; font-src data:; connect-src 'none'; media-src data: blob:; frame-src 'none'; object-src 'none'; form-action 'none'; base-uri 'none'";
const PREVIEW_EXTENSIONS = new Set(['html', 'htm', 'md', 'json', 'ts']);
const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
const safeScript = (code) => code.replace(/<\/script/gi, '<\\/script');
const extOf = (name = '') => name.split('.').pop()?.toLowerCase() ?? '';

function isPreviewable(file) {
  return PREVIEW_EXTENSIONS.has(extOf(file?.name || ''));
}

function previewKind(name = '') {
  const ext = extOf(name);
  if (['html', 'htm'].includes(ext)) return 'html';
  if (ext === 'md') return 'markdown';
  if (ext === 'json') return 'json';
  if (ext === 'ts') return 'typescript';
  return 'unknown';
}

function previewBadge(name = '') {
  const kind = previewKind(name);
  if (kind === 'markdown') return 'MARKDOWN';
  if (kind === 'typescript') return 'TYPESCRIPT';
  return kind.toUpperCase();
}

export function selectPreviewEntry(files, preferred = '', fallback = '') {
  const previewables = files.filter(isPreviewable);
  if (preferred && previewables.some(f => f.name === preferred)) return preferred;
  if (fallback && previewables.some(f => f.name === fallback)) return fallback;
  return previewables.find(f => f.name === 'index.html')?.name
    ?? previewables.find(f => /\.html?$/i.test(f.name))?.name
    ?? previewables[0]?.name
    ?? null;
}

export function previewableFiles(files) {
  return files.filter(isPreviewable);
}

async function loadTypeScript() {
  const tsModule = await import('typescript');
  return tsModule.default || tsModule;
}

async function transpileTypeScript(source, filename, options = {}) {
  const ts = await loadTypeScript();
  const compilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: options.moduleKind ?? ts.ModuleKind.None,
    strict: false,
    removeComments: false
  };
  const result = ts.transpileModule(source, {
    compilerOptions,
    fileName: filename,
    reportDiagnostics: true
  });
  const warnings = [];
  for (const diagnostic of result.diagnostics || []) {
    const text = ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ');
    const line = diagnostic.file && typeof diagnostic.start === 'number'
      ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1
      : null;
    warnings.push(`${filename}${line ? `:${line}` : ''} — ${text}`);
  }
  if (/\b(?:import|export)\b/.test(source)) warnings.push(`${filename}: la vista previa TypeScript no resuelve imports entre módulos; se ejecuta como script único.`);
  return { code: result.outputText, warnings };
}


// V 1.3.1 — Los enlaces de la página previsualizada NO deben navegar dentro del iframe (cargarían la propia
// pantalla de BadDev). Se interceptan y BadDev abre el archivo enlazado del proyecto en la vista previa.
function navigationGuard(session) {
  return `(() => {
    const token = ${JSON.stringify(session)};
    const send = (payload) => { try { parent.postMessage({ baddevPreview: token, type: 'navigate', ...payload }, '*'); } catch (_) {} };
    const isExternal = (href) => /^(?:[a-z][a-z\\d+.-]*:|\\/\\/)/i.test(href.trim());
    document.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (!href || /^javascript:/i.test(href)) return;
      event.preventDefault();
      if (href.startsWith('#')) {
        // En un iframe srcdoc, un #ancla recargaría la página de BadDev: se desplaza a mano.
        let id = href.slice(1);
        try { id = decodeURIComponent(id); } catch (_) {}
        const target = id ? (document.getElementById(id) || document.getElementsByName(id)[0]) : null;
        if (target) target.scrollIntoView(); else if (!id || id === 'top') window.scrollTo(0, 0);
        return;
      }
      send({ href, external: isExternal(href) });
    });
    // window.open('pagina.html') también se redirige al archivo del proyecto (sin abrir ventanas).
    window.open = (url) => { const href = String(url || ''); if (href) send({ href, external: isExternal(href) }); return null; };
    try {
      if (window.navigation && typeof window.navigation.addEventListener === 'function') {
        window.navigation.addEventListener('navigate', (event) => {
          if (!event.cancelable || event.hashChange || event.downloadRequest || (event.destination && event.destination.sameDocument)) return;
          const dest = new URL(event.destination.url);
          const base = new URL('.', document.baseURI);
          event.preventDefault();
          if (dest.origin === base.origin && dest.pathname.startsWith(base.pathname)) {
            send({ href: decodeURIComponent(dest.pathname.slice(base.pathname.length)), external: false });
          } else send({ href: dest.href, external: true });
        });
      }
    } catch (_) {}
  })();`;
}

function previewShell({ title, kicker, bodyClass = '', content, script = '', session = 'baddev-preview', styles = '', captureConsole = true }) {
  const reporter = `(() => {
    const token = ${JSON.stringify(session)};
    const report = (type, message) => {
      try { parent.postMessage({ baddevPreview: token, type, message: String(message).slice(0, 800) }, '*'); } catch (_) {}
    };
    ${captureConsole ? `const originalLog = console.log.bind(console);
    const originalWarn = console.warn.bind(console);
    console.warn = (...args) => { try { parent.postMessage({baddevPreview:token,type:'warn',message:args.map(v => typeof v === 'string' ? v : JSON.stringify(v)).join(' ').slice(0,800)}, '*'); } catch (_) {} originalWarn(...args); };
    console.log = (...args) => { try { parent.postMessage({baddevPreview:token,type:'log',message:args.map(v => typeof v === 'string' ? v : JSON.stringify(v)).join(' ').slice(0,800)}, '*'); } catch (_) {} originalLog(...args); };` : ''}
    window.addEventListener('error', e => report('error', e.message || 'Error de JavaScript'));
    window.addEventListener('unhandledrejection', e => report('error', e.reason?.message || e.reason || 'Promesa rechazada'));
    window.addEventListener('securitypolicyviolation', e => report('error', 'Recurso bloqueado por seguridad: ' + e.violatedDirective));
  })();`;
  return `<!doctype html><html lang="es"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta http-equiv="Content-Security-Policy" content="${CSP}"/><title>${escapeHtml(title)}</title><style>
  :root{color-scheme:dark;--bg:#090909;--panel:#121214;--card:#17171b;--line:#2a2a31;--text:#f5f5f5;--muted:#a4a4ab;--accent:#ff1744;--accent-soft:#ff5d7f;}
  *{box-sizing:border-box}html,body{margin:0;min-height:100%;background:radial-gradient(circle at top,#2b0d1660,transparent 35%),var(--bg);color:var(--text);font:14px/1.7 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;overflow-wrap:anywhere}
  body{padding:28px}main{max-width:980px;margin:0 auto;background:linear-gradient(180deg,#17171b,#111114);border:1px solid var(--line);border-radius:20px;box-shadow:0 24px 60px #0008;overflow:hidden}
  header{padding:22px 24px;border-bottom:1px solid var(--line);background:linear-gradient(180deg,#1d1418,#151518)}
  header small{display:flex;align-items:center;gap:10px;font-size:10px;letter-spacing:2px;font-weight:800;color:var(--accent-soft)}
  header small::before{content:'';width:18px;height:1px;background:var(--accent)}
  h1{margin:14px 0 4px;font-size:clamp(24px,4vw,38px);line-height:1.12;letter-spacing:-1px}
  .preview-sub{margin:0;color:var(--muted);font-size:13px}
  .preview-body{padding:24px}
  .markdown-body h1,.markdown-body h2,.markdown-body h3{line-height:1.2;margin:1.2em 0 .45em;letter-spacing:-.02em}.markdown-body h1:first-child,.markdown-body h2:first-child,.markdown-body h3:first-child{margin-top:0}
  .markdown-body p,.markdown-body ul,.markdown-body ol,.markdown-body blockquote,.markdown-body pre{margin:0 0 16px}
  .markdown-body ul,.markdown-body ol{padding-left:22px}.markdown-body li+li{margin-top:7px}.markdown-body a{color:#8ed9ff}.markdown-body strong{color:#fff}.markdown-body em{color:#ffd3dc}
  .markdown-body code{font:13px/1.5 Consolas,monospace;background:#24171b;border:1px solid #40222b;border-radius:6px;padding:2px 6px;color:#ffc9d5}
  .markdown-body pre{padding:14px 16px;background:#0f1014;border:1px solid #2a2d36;border-radius:14px;overflow:auto}.markdown-body pre code{background:transparent;border:0;padding:0;color:#f1f1f1}
  .markdown-body blockquote{padding:12px 16px;border-left:3px solid var(--accent);background:#1c1317;color:#d6b6bf;border-radius:12px}
  .kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:0 0 22px}.kv-card{padding:14px 16px;background:#141419;border:1px solid var(--line);border-radius:14px}.kv-card strong{display:block;color:#ffb1c0;font-size:11px;letter-spacing:1px;margin-bottom:6px}.kv-card span{font-size:18px;font-weight:700}
  .json-viewer{margin:0;background:#0f1014;border:1px solid #292d38;border-radius:16px;padding:16px 18px;overflow:auto;white-space:pre;tab-size:2;font:13px/1.55 Consolas,monospace}.json-viewer .key{color:#8ed9ff}.json-viewer .string{color:#ffd08a}.json-viewer .number{color:#b7ffb0}.json-viewer .boolean{color:#ff97c7}.json-viewer .null{color:#9ca3af}
  .ts-runner{display:grid;gap:18px}.ts-note{padding:14px 16px;background:#15151b;border:1px solid var(--line);border-radius:14px;color:#cacad2}.ts-output{display:grid;gap:18px;grid-template-columns:1.1fr .9fr}.ts-stage,.ts-code{min-width:0;padding:18px;border-radius:16px;border:1px solid var(--line);background:#121318}.ts-stage #app{min-height:180px}.ts-code pre{margin:0;overflow:auto;font:12px/1.55 Consolas,monospace;color:#dce9ff;white-space:pre}.ts-label{display:flex;align-items:center;gap:8px;color:#ff9caf;font-size:10px;letter-spacing:1.8px;font-weight:800;margin-bottom:12px}.ts-label::before{content:'';width:14px;height:1px;background:var(--accent)}
  @media(max-width:820px){body{padding:14px}header,.preview-body{padding:18px}.ts-output{grid-template-columns:1fr}}
  ${styles}
  </style><script>${safeScript(reporter + navigationGuard(session))}</script></head><body class="${bodyClass}"><main><header><small>${escapeHtml(kicker)}</small><h1>${escapeHtml(title)}</h1><p class="preview-sub">Vista previa generada en memoria por BadDev. No se ejecutan conexiones externas.</p></header><section class="preview-body">${content}</section></main>${script ? `<script>${safeScript(script)}</script>` : ''}</body></html>`;
}

function renderMarkdownInline(text, resolveImage = null) {
  const images = [];
  const withTokens = text.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (match, alt, src) => {
    images.push({ alt, src });
    return `\u0000IMG${images.length - 1}\u0000`;
  });
  const html = escapeHtml(withTokens)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>');
  return html.replace(/\u0000IMG(\d+)\u0000/g, (match, index) => {
    const { alt, src } = images[Number(index)];
    const uri = resolveImage ? resolveImage(src) : null;
    return uri
      ? `<img class="md-img" src="${uri}" alt="${escapeHtml(alt)}" loading="lazy"/>`
      : `<span class="md-img-missing">🖼 ${escapeHtml(alt || 'Imagen')} <small>(no encontrada: ${escapeHtml(src)})</small></span>`;
  });
}

function renderMarkdown(markdown = '', resolveImage = null) {
  const lines = markdown.replace(/\r/g, '').split('\n');
  const out = [];
  let paragraph = [];
  let list = null;
  let code = null;
  const flushParagraph = () => {
    if (!paragraph.length) return;
    out.push(`<p>${renderMarkdownInline(paragraph.join(' '), resolveImage)}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    out.push(`<${list.type}>${list.items.map(item => `<li>${renderMarkdownInline(item, resolveImage)}</li>`).join('')}</${list.type}>`);
    list = null;
  };
  const flushCode = () => {
    if (!code) return;
    out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
    code = null;
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('```')) {
      flushParagraph(); flushList();
      if (code) flushCode();
      else code = [];
      continue;
    }
    if (code) { code.push(raw); continue; }
    const trimmed = line.trim();
    if (!trimmed) { flushParagraph(); flushList(); continue; }
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph(); flushList();
      out.push(`<h${heading[1].length}>${renderMarkdownInline(heading[2], resolveImage)}</h${heading[1].length}>`);
      continue;
    }
    const quote = trimmed.match(/^>\s?(.*)$/);
    if (quote) {
      flushParagraph(); flushList();
      out.push(`<blockquote>${renderMarkdownInline(quote[1], resolveImage)}</blockquote>`);
      continue;
    }
    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      if (!list || list.type !== 'ul') { flushList(); list = { type: 'ul', items: [] }; }
      list.items.push(unordered[1]);
      continue;
    }
    const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      if (!list || list.type !== 'ol') { flushList(); list = { type: 'ol', items: [] }; }
      list.items.push(ordered[1]);
      continue;
    }
    paragraph.push(trimmed);
  }
  flushParagraph(); flushList(); flushCode();
  return out.join('');
}

function highlightJson(prettyJson) {
  return escapeHtml(prettyJson).replace(/("(?:\\.|[^"\\])*"\s*:)|("(?:\\.|[^"\\])*")|\b(true|false)\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?/g, (match, keyPart, stringPart, booleanPart) => {
    if (keyPart) return `<span class="key">${keyPart}</span>`;
    if (stringPart) return `<span class="string">${stringPart}</span>`;
    if (booleanPart) return `<span class="boolean">${booleanPart}</span>`;
    if (match === 'null') return '<span class="null">null</span>';
    return `<span class="number">${match}</span>`;
  });
}

function countJsonNodes(value) {
  let total = 1;
  if (Array.isArray(value)) for (const item of value) total += countJsonNodes(item);
  else if (value && typeof value === 'object') for (const item of Object.values(value)) total += countJsonNodes(item);
  return total;
}

async function buildMarkdownPreview(file, session, options = {}) {
  const stats = { chars: 0, missing: new Set(), used: new Set() };
  const resolveImage = createImageResolver(options.assets ?? getAssets(), file.name, stats);
  const warnings = [];
  const body = renderMarkdown(file.content, resolveImage);
  if (stats.chars > MAX_IMAGE_PREVIEW_CHARS) throw new Error('Las imágenes de la vista previa superan el límite de 24 MB.');
  for (const ref of stats.missing) warnings.push(`No se encontró la imagen: ${ref}`);
  const html = previewShell({
    title: file.name,
    kicker: `BADDEV / ${previewBadge(file.name)}`,
    bodyClass: 'markdown-body',
    session,
    captureConsole: false,
    styles: '.md-img{max-width:100%;height:auto;border-radius:12px;border:1px solid var(--line)}.md-img-missing{color:var(--muted)}',
    content: body
  });
  return { html, warnings, loads: [...stats.used] };
}

async function buildJsonPreview(file, session) {
  const data = JSON.parse(file.content);
  const pretty = JSON.stringify(data, null, 2);
  const top = Array.isArray(data) ? 'Arreglo' : data === null ? 'Valor nulo' : typeof data === 'object' ? 'Objeto' : typeof data;
  const size = new TextEncoder().encode(file.content).length;
  const rootItems = Array.isArray(data) ? data.length : data && typeof data === 'object' ? Object.keys(data).length : 1;
  const html = previewShell({
    title: file.name,
    kicker: `BADDEV / ${previewBadge(file.name)}`,
    session,
    captureConsole: false,
    content: `<div class="kv-grid"><div class="kv-card"><strong>TIPO RAÍZ</strong><span>${escapeHtml(top)}</span></div><div class="kv-card"><strong>ELEMENTOS</strong><span>${rootItems}</span></div><div class="kv-card"><strong>NODOS TOTALES</strong><span>${countJsonNodes(data)}</span></div><div class="kv-card"><strong>TAMAÑO</strong><span>${size} B</span></div></div><pre class="json-viewer">${highlightJson(pretty)}</pre>`
  });
  return { html, warnings: [], loads: [] };
}

async function buildTypeScriptPreview(file, session) {
  const { code, warnings } = await transpileTypeScript(file.content, file.name);
  const html = previewShell({
    title: file.name,
    kicker: `BADDEV / ${previewBadge(file.name)}`,
    bodyClass: 'ts-runner',
    session,
    content: `<div class="ts-note">BadDev transpila este archivo TypeScript en memoria y ejecuta el resultado en un entorno aislado. Es ideal para ejemplos y scripts sin backend.</div><div class="ts-output"><div class="ts-stage"><div class="ts-label">SALIDA</div><div id="app"></div></div><div class="ts-code"><div class="ts-label">JAVASCRIPT GENERADO</div><pre>${escapeHtml(code)}</pre></div></div>`,
    script: code
  });
  return { html, warnings, loads: [file.name] };
}

async function buildHtmlPreview(files, entry = 'index.html', session = 'baddev-preview', options = {}) {
  const fileMap = new Map(files.map(f => [f.name.toLowerCase(), f]));
  const htmlFile = fileMap.get(entry.toLowerCase());
  if (!htmlFile || !/\.html?$/i.test(htmlFile.name)) throw new Error('Necesitas un archivo HTML para la vista previa.');
  if (htmlFile.content.length > MAX_PREVIEW_BYTES) throw new Error('HTML demasiado grande para la vista previa.');
  const documentHtml = new DOMParser().parseFromString(htmlFile.content, 'text/html');
  const warnings = [];
  documentHtml.querySelectorAll('base').forEach(node => { node.remove(); warnings.push('La etiqueta <base> no se utiliza en la vista previa.'); });

  const assets = options.assets ?? getAssets();
  const imageStats = { chars: 0, missing: new Set(), used: new Set() };
  let bytes = htmlFile.content.length;
  const loads = [];
  for (const element of [...documentHtml.querySelectorAll('link[rel~="stylesheet"][href], script[src]')]) {
    const original = element.getAttribute(element.localName === 'link' ? 'href' : 'src');
    const path = resolveProjectReference(htmlFile.name, original);
    const match = path ? fileMap.get(path.toLowerCase()) : null;
    const expected = element.localName === 'link' ? /\.css$/i : /\.(?:m?js|ts)$/i;
    if (!match || !expected.test(match.name)) {
      warnings.push(`No se encontró un recurso local compatible: ${original}`);
      element.remove();
      continue;
    }
    bytes += match.content.length;
    if (bytes > MAX_PREVIEW_BYTES) throw new Error('Proyecto demasiado grande para generar la vista previa (máx. 7 MB).');
    loads.push(match.name);
    if (element.localName === 'link') {
      const style = documentHtml.createElement('style');
      style.dataset.baddevFile = match.name;
      style.textContent = assets.size ? inlineCssImages(match.content, createImageResolver(assets, match.name, imageStats)) : match.content;
      element.replaceWith(style);
    } else {
      const script = documentHtml.createElement('script');
      script.dataset.baddevFile = match.name;
      let code = match.content;
      if (/\.ts$/i.test(match.name)) {
        const tsResult = await transpileTypeScript(match.content, match.name);
        code = tsResult.code;
        warnings.push(...tsResult.warnings);
      }
      if (element.hasAttribute('type') && element.getAttribute('type') === 'module') {
        warnings.push(`El script ${match.name} se ejecuta como JavaScript clásico; imports ES modules no están soportados.`);
      }
      script.textContent = safeScript(code);
      element.replaceWith(script);
    }
  }
  if (assets.size || documentHtml.querySelector('img[src], [style*="url("]')) {
    inlineHtmlImages(documentHtml, htmlFile.name, assets, warnings, imageStats);
  }
  if (imageStats.chars > MAX_IMAGE_PREVIEW_CHARS) throw new Error('Las imágenes de la vista previa superan el límite de 24 MB.');
  loads.push(...imageStats.used);
  const head = documentHtml.head;
  const policy = documentHtml.createElement('meta');
  policy.setAttribute('http-equiv', 'Content-Security-Policy');
  policy.setAttribute('content', CSP);
  head.prepend(policy);
  const charset = documentHtml.createElement('meta');
  charset.setAttribute('charset', 'UTF-8');
  head.prepend(charset);

  const reporter = documentHtml.createElement('script');
  reporter.textContent = `(() => {
    const token = ${JSON.stringify(session)};
    const report = (message) => {
      try { parent.postMessage({ baddevPreview: token, type: 'error', message: String(message).slice(0, 800) }, '*'); } catch (_) {}
    };
    ${options.captureConsole ? `const originalLog = console.log.bind(console);
    const originalWarn = console.warn.bind(console);
    console.warn = (...args) => { try { parent.postMessage({baddevPreview:token,type:'warn',message:args.map(v => String(v)).join(' ').slice(0,800)}, '*'); } catch (_) {} originalWarn(...args); };
    console.log = (...args) => {
      try { parent.postMessage({ baddevPreview: token, type: 'log', message: args.map(v => typeof v === 'string' ? v : JSON.stringify(v)).join(' ').slice(0,800) }, '*'); } catch (_) {}
      originalLog(...args);
    };` : ''}
    window.addEventListener('error', (e) => { report(e.message || 'Error de JavaScript'); });
    window.addEventListener('unhandledrejection', (e) => { report(e.reason?.message || e.reason || 'Promesa rechazada'); });
    window.addEventListener('securitypolicyviolation', (e) => { report('Recurso bloqueado por seguridad: ' + e.violatedDirective); });
  })();`;
  reporter.textContent += navigationGuard(session);
  policy.after(reporter);
  const output = `<!doctype html>\n${documentHtml.documentElement.outerHTML}`;
  if (output.length - imageStats.chars > MAX_PREVIEW_BYTES * 1.3) throw new Error('El resultado de la vista previa supera el límite.');
  return { html: output, warnings: [...new Set(warnings)], loads };
}

export async function buildPreview(files, entry = 'index.html', session = 'baddev-preview', options = {}) {
  const fileMap = new Map(files.map(f => [f.name.toLowerCase(), f]));
  const target = fileMap.get(entry.toLowerCase());
  if (!target) throw new Error('El archivo seleccionado ya no existe.');
  const kind = previewKind(target.name);
  if (kind === 'html') return buildHtmlPreview(files, entry, session, options);
  if (kind === 'markdown') return buildMarkdownPreview(target, session, options);
  if (kind === 'json') return buildJsonPreview(target, session);
  if (kind === 'typescript') return buildTypeScriptPreview(target, session);
  throw new Error('La vista previa disponible en esta etapa admite HTML, Markdown, JSON y TypeScript.');
}

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function openDetachedPreview(html) {
  const outer = `<!doctype html><html lang="es"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>BadDev · Vista previa</title><style>html,body{margin:0;width:100%;height:100%;background:#101010;color:#ddd;font:12px system-ui}header{height:42px;display:flex;align-items:center;padding:0 14px;background:#151515;border-bottom:1px solid #363036}b{color:#ff1744}iframe{height:calc(100% - 43px);width:100%;border:0;background:white}</style></head><body><header><b>BADDEV</b> &nbsp; / &nbsp; VISTA PREVIA AISLADA</header><iframe title="Vista previa aislada" sandbox="allow-scripts" referrerpolicy="no-referrer" srcdoc="${escapeAttribute(html)}"></iframe></body></html>`;
  const url = URL.createObjectURL(new Blob([outer], { type: 'text/html;charset=utf-8' }));
  const popup = window.open('about:blank', '_blank');
  if (popup) {
    try { popup.opener = null; popup.location.replace(url); }
    catch { popup.location.href = url; }
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return Boolean(popup);
}
