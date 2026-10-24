// CodeMirror 6: los nuevos modos se cargan solo al abrir un archivo que los usa.
// No se ejecuta el código escrito aquí: únicamente se configura sintaxis e indentación.
import { html, htmlLanguage } from '@codemirror/lang-html';
import { css, cssLanguage } from '@codemirror/lang-css';
import { javascript, javascriptLanguage } from '@codemirror/lang-javascript';
import { completeAnyWord } from '@codemirror/autocomplete';
import { extensionOf } from './languages.js';
import { completionSourceFor } from './completions.js';

const loaders = {
  py: () => import('@codemirror/lang-python').then(m => m.python()),
  php: () => import('@codemirror/lang-php').then(m => m.php()),
  json: () => import('@codemirror/lang-json').then(m => m.json()),
  md: () => import('@codemirror/lang-markdown').then(m => m.markdown()),
  sql: () => import('@codemirror/lang-sql').then(m => m.sql()),
  scss: () => import('@codemirror/lang-sass').then(m => m.sass()),
  xml: () => import('@codemirror/lang-xml').then(m => m.xml()),
  yaml: () => import('@codemirror/lang-yaml').then(m => m.yaml())
};
const loaded = new Map();
const inflight = new Map();

export function cachedLanguageSupport(name) {
  const ext = extensionOf(name);
  if (['html', 'htm'].includes(ext)) return html();
  if (ext === 'css') return css();
  if (['js', 'mjs'].includes(ext)) return javascript();
  if (ext === 'ts') return javascript({ typescript: true });
  return loaded.get(ext) ?? [];
}

export async function loadLanguageSupport(name) {
  const ext = extensionOf(name);
  if (!loaders[ext]) return cachedLanguageSupport(name);
  if (loaded.has(ext)) return loaded.get(ext);
  if (!inflight.has(ext)) {
    const request = loaders[ext]().then(support => {
      loaded.set(ext, support);
      inflight.delete(ext);
      return support;
    }).catch(error => {
      inflight.delete(ext);
      throw error;
    });
    inflight.set(ext, request);
  }
  return inflight.get(ext);
}

export function completionExtensionsFor(name, support = cachedLanguageSupport(name)) {
  const ext = extensionOf(name);
  const baseLanguage = ['html','htm'].includes(ext) ? htmlLanguage : ext === 'css' ? cssLanguage
    : ['js','mjs','ts'].includes(ext) ? javascriptLanguage : support?.language;
  if (!baseLanguage) return [];
  const sources = [];
  // Snippets de Etapa B para los 12 lenguajes; se suman a las sugerencias originales.
  if (['html','htm','css','js','mjs','ts','py','php','json','md','sql','scss','xml','yaml','yml'].includes(ext)) {
    sources.push(baseLanguage.data.of({ autocomplete: completionSourceFor(name) }));
  }
  sources.push(baseLanguage.data.of({ autocomplete: completeAnyWord }));
  return sources;
}
