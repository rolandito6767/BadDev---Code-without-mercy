// Catálogo único de lenguajes. Etapa A: edición, no ejecución de runtimes.
// El modo "text" conserva la compatibilidad anterior con archivos .txt.
export const LANGUAGE_TYPES = Object.freeze([
  { key: 'html', label: 'HTML', extensions: ['html', 'htm'], filename: 'index.html', badge: '<>', badgeColor: 'html' },
  { key: 'css', label: 'CSS', extensions: ['css'], filename: 'style.css', badge: '#', badgeColor: 'css' },
  { key: 'js', label: 'JavaScript', extensions: ['js', 'mjs'], filename: 'script.js', badge: 'JS', badgeColor: 'js' },
  { key: 'ts', label: 'TypeScript', extensions: ['ts'], filename: 'main.ts', badge: 'TS', badgeColor: 'ts' },
  { key: 'py', label: 'Python', extensions: ['py'], filename: 'main.py', badge: 'PY', badgeColor: 'py' },
  { key: 'php', label: 'PHP', extensions: ['php'], filename: 'index.php', badge: 'PHP', badgeColor: 'php' },
  { key: 'json', label: 'JSON', extensions: ['json'], filename: 'datos.json', badge: '{}', badgeColor: 'json' },
  { key: 'md', label: 'Markdown', extensions: ['md'], filename: 'README.md', badge: 'MD', badgeColor: 'md' },
  { key: 'sql', label: 'SQL', extensions: ['sql'], filename: 'consulta.sql', badge: 'DB', badgeColor: 'sql' },
  { key: 'scss', label: 'SCSS', extensions: ['scss'], filename: 'style.scss', badge: 'S#', badgeColor: 'scss' },
  { key: 'xml', label: 'XML', extensions: ['xml'], filename: 'datos.xml', badge: '</>', badgeColor: 'xml' },
  { key: 'yaml', label: 'YAML', extensions: ['yaml', 'yml'], filename: 'config.yaml', badge: 'YM', badgeColor: 'yaml' },
  { key: 'txt', label: 'Texto', extensions: ['txt'], filename: 'notas.txt', badge: 'TXT', badgeColor: 'text' }
]);

export const SUPPORTED_EXTENSIONS = Object.freeze(LANGUAGE_TYPES.flatMap(type => type.extensions));
export const EXTENSION_LABELS = Object.freeze(Object.fromEntries(
  LANGUAGE_TYPES.flatMap(type => type.extensions.map(ext => [ext, type.label]))
));
export function extensionOf(name) { return String(name).split('/').at(-1).split('.').at(-1).toLowerCase(); }
export function languageForType(key) { return LANGUAGE_TYPES.find(type => type.key === key) ?? null; }
export function languageForFile(name) { return LANGUAGE_TYPES.find(type => type.extensions.includes(extensionOf(name))) ?? null; }
export function fileLanguage(name) { return languageForFile(name)?.label ?? 'Texto'; }
export function supportedFileName(name) { return SUPPORTED_EXTENSIONS.includes(extensionOf(name)); }
export function pickerExtensions() { return SUPPORTED_EXTENSIONS.map(ext => `.${ext}`); }
// Python usa 4 espacios como indentación recomendada. Los demás respetan preferencias.
export function indentSizeForFile(name, preferred = 2) { return extensionOf(name) === 'py' ? 4 : preferred; }

export const STARTER_CODE = Object.freeze({
  html: `<!DOCTYPE html>\n<html lang="es">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Mi página</title>\n</head>\n<body>\n  <h1>¡Hola, BadDev!</h1>\n</body>\n</html>\n`,
  css: `/* Mis estilos */\nbody {\n  margin: 0;\n  font-family: system-ui, sans-serif;\n}\n`,
  js: `// Mi JavaScript\nconsole.log('¡Hola, BadDev!');\n`,
  ts: `// TypeScript: tipos explícitos\ninterface Persona {\n  nombre: string;\n  edad: number;\n}\n\nconst persona: Persona = { nombre: 'BadDev', edad: 1 };\nconsole.log(persona.nombre);\n`,
  py: `# Python: pulsa ▶ Python para ejecutar este ejemplo\ndef saludar(nombre):\n    return f"Hola, {nombre}"\n\nprint(saludar("BadDev"))\n`,
  php: `<?php\n// PHP: requiere servidor PHP para ejecutarse.\n$nombre = "BadDev";\necho "Hola, " . $nombre;\n`,
  json: `{\n  "proyecto": "BadDev",\n  "version": "1.2",\n  "activo": true\n}\n`,
  md: `# Mi documento\n\nEscribe tus notas en **Markdown**.\n\n- Primer punto\n- Segundo punto\n`,
  sql: `-- SQL: consulta de ejemplo (no se ejecuta en BadDev)\nSELECT nombre, edad\nFROM personas\nWHERE edad >= 18;\n`,
  scss: `// SCSS: requiere compilación externa a CSS\n$acento: #d90b2b;\n\n.card {\n  color: $acento;\n  &:hover { opacity: .9; }\n}\n`,
  xml: `<?xml version="1.0" encoding="UTF-8"?>\n<proyecto>\n  <nombre>BadDev</nombre>\n</proyecto>\n`,
  yaml: `# YAML: configuración de ejemplo\nproyecto: BadDev\nversion: "1.2"\nlenguajes:\n  - HTML\n  - Python\n`,
  txt: `Mis notas en BadDev\n`
});
