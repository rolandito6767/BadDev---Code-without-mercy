import { extensionOf, validFilename } from './files.js';
import { SUPPORTED_EXTENSIONS } from './languages.js';
import { isImageName, MAX_IMAGE_BYTES } from './image-types.js';

export const PROJECT_TYPES = new Set(SUPPORTED_EXTENSIONS);
export const MAX_PROJECT_FILES = 250;
export const MAX_FILE_BYTES = 5_000_000;

export function validProjectPath(path) {
  if (typeof path !== 'string' || path.length > 240 || path.startsWith('/') || path.includes('\\')) return false;
  const segments = path.split('/');
  return segments.length >= 1 && segments.length <= 12 && segments.every(validFilename) && !segments.some(s => s === '.' || s === '..');
}

export function normalizedProjectPath(raw) {
  if (typeof raw !== 'string') return null;
  let value;
  try { value = decodeURIComponent(raw.trim().replace(/\\/g, '/').split(/[?#]/, 1)[0]); }
  catch { return null; }
  if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(value) || /^(?:data|blob|javascript):/i.test(value)) return null;
  const result = [];
  for (const section of value.replace(/^\/+/, '').split('/')) {
    if (!section || section === '.') continue;
    if (section === '..') { if (!result.length) return null; result.pop(); }
    else result.push(section);
  }
  return result.join('/');
}

export function resolveProjectReference(htmlPath, reference) {
  if (typeof reference !== 'string') return null;
  const ref = reference.trim();
  if (!ref || /^(?:https?:|\/\/|data:|blob:|javascript:|mailto:|#)/i.test(ref)) return null;
  const base = ref.startsWith('/') ? '' : htmlPath.split('/').slice(0, -1).join('/');
  return normalizedProjectPath(base ? `${base}/${ref}` : ref);
}

export function createStarterProject() {
  return [
    { name: 'index.html', content: `<!DOCTYPE html>\n<html lang="es">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>Mi proyecto BadDev</title>\n  <link rel="stylesheet" href="style.css" />\n</head>\n<body>\n  <main class="card">\n    <span class="eyebrow">MI PRIMER PROYECTO</span>\n    <h1>¡Hola desde BadDev! 🔥</h1>\n    <p>Edita los tres archivos y pulsa Vista previa.</p>\n    <button id="demo-button">Haz clic aquí</button>\n  </main>\n  <script src="script.js"></script>\n</body>\n</html>\n` },
    { name: 'style.css', content: `:root { font-family: system-ui, sans-serif; color-scheme: dark; }\n* { box-sizing: border-box; }\nbody { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #090909; color: #f5f5f5; }\n.card { max-width: 520px; padding: 40px; border: 1px solid #4b1724; border-radius: 16px; background: #141014; text-align: center; }\n.eyebrow { color: #ff637d; font-size: 11px; letter-spacing: 2px; }\nh1 { margin: 20px 0 10px; }\np { color: #999; line-height: 1.7; }\nbutton { background: #d90b2b; color: white; padding: 12px 18px; border: 0; border-radius: 8px; cursor: pointer; }\nbutton:hover { background: #ff1744; box-shadow: 0 0 20px #ff174455; }\n` },
    { name: 'script.js', content: `document.querySelector('#demo-button').addEventListener('click', () => {\n  document.querySelector('#demo-button').textContent = '¡Funciona! 🔥';\n  console.log('Botón funcionando');\n});\n` }
  ];
}

export async function readDirectory(dirHandle, maxFiles = MAX_PROJECT_FILES) {
  const results = [];
  const warnings = [];
  const images = []; // V 1.3: imágenes [{ name, bytes }] para la vista previa
  async function visit(folder, prefix = '', depth = 0) {
    if (depth > 10) { warnings.push(`Se omitió ${prefix}: demasiadas subcarpetas.`); return; }
    for await (const [name, handle] of folder.entries()) {
      if (name.startsWith('.') || name === 'node_modules' || name === 'dist') continue;
      const path = prefix ? `${prefix}/${name}` : name;
      if (handle.kind === 'directory') { await visit(handle, path, depth + 1); continue; }
      if (handle.kind === 'file' && isImageName(name) && validProjectPath(path)) {
        try {
          const diskImage = await handle.getFile();
          if (diskImage.size > MAX_IMAGE_BYTES) warnings.push(`${path}: la imagen supera 3 MB y no se mostrará.`);
          else images.push({ name: path, bytes: new Uint8Array(await diskImage.arrayBuffer()) });
        } catch (error) { warnings.push(`No se pudo leer la imagen ${path}: ${error.message}`); }
        continue;
      }
      if (handle.kind !== 'file' || !validProjectPath(path) || !PROJECT_TYPES.has(extensionOf(name))) continue;
      if (results.length >= maxFiles) { warnings.push(`Límite de ${maxFiles} archivos alcanzado.`); return; }
      try {
        const diskFile = await handle.getFile();
        if (diskFile.size > MAX_FILE_BYTES) { warnings.push(`${path}: supera 5 MB.`); continue; }
        results.push({ name: path, content: await diskFile.text(), handle });
      } catch (error) { warnings.push(`No se pudo leer ${path}: ${error.message}`); }
    }
  }
  await visit(dirHandle);
  results.sort((a, b) => a.name.localeCompare(b.name, 'es'));
  return { files: results, warnings, images };
}

export async function projectFileHandle(root, path, create = true) {
  if (!validProjectPath(path)) throw new Error('Ruta no válida dentro del proyecto.');
  const parts = path.split('/');
  let dir = root;
  for (const segment of parts.slice(0, -1)) dir = await dir.getDirectoryHandle(segment, { create });
  return dir.getFileHandle(parts.at(-1), { create });
}

export async function writeProjectFile(root, file, snapshot = file.content) {
  const handle = await projectFileHandle(root, file.name);
  const writer = await handle.createWritable();
  try { await writer.write(snapshot); }
  finally { await writer.close(); }
  return handle;
}
