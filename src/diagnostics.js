// Etapa B: validación sintáctica, no ejecución. Los documentos se analizan en memoria.
import { extensionOf } from './languages.js';

const labelFor = (ext) => ext === 'json' ? 'JSON' : ext === 'xml' ? 'XML' : 'YAML';
const diagnostic = (message, line = 1, column = 1, severity = 'error') => ({
  message: String(message).trim().slice(0, 850),
  line: Math.max(1, Number(line) || 1),
  column: Math.max(1, Number(column) || 1),
  severity
});
const report = (language, diagnostics, message = '') => ({
  language, ok: !diagnostics.some(item => item.severity === 'error'), diagnostics,
  message: message || (diagnostics.length ? 'Revisa las observaciones.' : `${language}: sintaxis válida.`)
});

export function locationAt(source, offset) {
  const before = String(source).slice(0, Math.max(0, Math.min(source.length, Number(offset) || 0)));
  const rows = before.split(/\n/);
  return { line: rows.length, column: rows.at(-1).length + 1 };
}

export function validateJSON(content) {
  const source = String(content);
  try {
    JSON.parse(source);
    return report('JSON', []);
  } catch (error) {
    const message = String(error.message || error);
    let location = { line: 1, column: 1 };
    const position = message.match(/\bposition\s+(\d+)/i);
    const rowColumn = message.match(/\bline\s+(\d+)\s+column\s+(\d+)/i);
    if (position) location = locationAt(source, Number(position[1]));
    if (rowColumn) location = { line: Number(rowColumn[1]), column: Number(rowColumn[2]) };
    if (!position && !rowColumn) {
      // Algunas versiones de Chrome/Node omiten la posición; localizar el token ofensivo cuando se conoce.
      const unexpected = message.match(/^Unexpected token '([^']+)'/);
      const offset = unexpected ? source.lastIndexOf(unexpected[1]) : -1;
      location = locationAt(source, offset >= 0 ? offset : source.length);
    }
    return report('JSON', [diagnostic(message, location.line, location.column)]);
  }
}

// DOMParser XML aplica las reglas de XML del navegador. No evalúa scripts ni inyecta HTML.
// La dependencia del parser se inyecta para que el módulo pueda probarse también en Node.
export function validateXML(content, Parser = globalThis.DOMParser) {
  if (!Parser) throw new Error('La validación de XML requiere un navegador compatible con DOMParser.');
  const source = String(content);
  if (!source.trim()) return report('XML', [diagnostic('El documento XML está vacío.')]);
  try {
    const doc = new Parser().parseFromString(source, 'application/xml');
    const parserErrors = Array.from(doc.getElementsByTagName('parsererror'));
    // Los navegadores incluyen parsererror con distintos namespaces; Chrome también.
    if (doc.documentElement?.localName === 'parsererror' && !parserErrors.includes(doc.documentElement)) {
      parserErrors.push(doc.documentElement);
    }
    const errors = parserErrors.map(element => {
      const message = String(element.textContent || 'Documento XML mal formado.').trim();
      const line = message.match(/\bline\s*(?:number)?\s*[:=]?\s*(\d+)/i);
      const column = message.match(/\bcolumn\s*(?:number)?\s*[:=]?\s*(\d+)/i);
      return diagnostic(message, line?.[1], column?.[1]);
    });
    if (!doc.documentElement && !errors.length) errors.push(diagnostic('No se encontró un elemento raíz.'));
    return report('XML', errors);
  } catch (error) {
    return report('XML', [diagnostic(error.message || 'No se pudo leer el XML.')]);
  }
}

// parseDocument es preferible a convertir YAML en objetos JS: mantiene información de ubicación,
// detecta claves duplicadas y evita evaluar etiquetas o ejecutar código de la entrada.
export async function validateYAML(content, loadParser = () => import('yaml')) {
  const source = String(content);
  const { parseDocument } = await loadParser();
  const doc = parseDocument(source, { uniqueKeys: true, prettyErrors: true, version: '1.2' });
  const mapError = (error, severity) => {
    const location = error.linePos?.[0] || locationAt(source, error.pos?.[0] || 0);
    return diagnostic(error.message, location.line, location.col ?? location.column, severity);
  };
  const problems = doc.errors.map(error => mapError(error, 'error'));
  const warnings = doc.warnings.map(error => mapError(error, 'warning'));
  return report('YAML', [...problems, ...warnings], problems.length ? 'YAML: se encontraron errores.' : warnings.length ? 'YAML válido con advertencias.' : 'YAML: sintaxis válida.');
}

export const VALIDATABLE_EXTENSIONS = Object.freeze(['json', 'xml', 'yaml', 'yml']);
export function canValidate(filename) { return VALIDATABLE_EXTENSIONS.includes(extensionOf(filename)); }
export async function validateDocument(filename, content, options = {}) {
  const ext = extensionOf(filename);
  if (ext === 'json') return validateJSON(content);
  if (ext === 'xml') return validateXML(content, options.Parser);
  if (['yaml','yml'].includes(ext)) return validateYAML(content, options.loadYaml);
  return { language: labelFor(ext), ok: null, diagnostics: [], message: 'La comprobación de sintaxis está disponible para JSON, XML y YAML en esta etapa.' };
}
