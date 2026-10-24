// Prettier 3 standalone se carga bajo demanda: el editor principal arranca ligero.
// No se cambian los plugins del formateador anterior; se amplía su selección por extensión.
import { extensionOf } from './languages.js';
import { validateJSON, validateYAML } from './diagnostics.js';

export const FORMAT_PARSERS = Object.freeze({
  html:'html', htm:'html', css:'css', js:'babel', mjs:'babel', ts:'typescript',
  json:'json', md:'markdown', scss:'scss', yaml:'yaml', yml:'yaml'
});
const pluginLoaders = {
  html: () => import('prettier/plugins/html'),
  css: () => import('prettier/plugins/postcss'),
  babel: () => import('prettier/plugins/babel'),
  estree: () => import('prettier/plugins/estree'),
  typescript: () => import('prettier/plugins/typescript'),
  markdown: () => import('prettier/plugins/markdown'),
  yaml: () => import('prettier/plugins/yaml')
};
const pluginCache = new Map();
let prettierPromise;
const pluginFor = key => {
  if (!pluginCache.has(key)) pluginCache.set(key, pluginLoaders[key]());
  return pluginCache.get(key);
};
export async function formatCode(filename, content, options = {}) {
  const ext = extensionOf(filename);
  const parser = FORMAT_PARSERS[ext];
  if (!parser) throw new Error('No hay formateador para este lenguaje. En la Etapa B se admiten HTML, CSS, JS, TS, JSON, Markdown, SCSS y YAML.');
  if (ext === 'json') {
    const result = validateJSON(content);
    if (!result.ok) throw new Error(`Corrige el JSON antes de formatear: ${result.diagnostics[0].message}`);
  }
  if (['yaml','yml'].includes(ext)) {
    const result = await validateYAML(content);
    if (!result.ok) throw new Error(`Corrige el YAML antes de formatear: ${result.diagnostics[0].message}`);
  }
  const groups = {
    html:['html'], css:['css'], scss:['css'], babel:['babel','estree'],
    json:['babel','estree'], typescript:['typescript','estree'], markdown:['markdown'], yaml:['yaml']
  };
  prettierPromise ||= import('prettier/standalone');
  const [prettier, ...plugins] = await Promise.all([prettierPromise, ...groups[parser].map(pluginFor)]);
  return prettier.format(String(content), {
    parser, plugins, tabWidth: options.tabWidth === 4 ? 4 : 2,
    printWidth: 90, singleQuote: true
  });
}
