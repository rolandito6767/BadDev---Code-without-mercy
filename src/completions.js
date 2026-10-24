import { snippetCompletion } from '@codemirror/autocomplete';
import { extensionOf } from './files.js';

// Plantillas CodeMirror reales: Tab recorre los campos $1, $2, ...
const htmlSnippets = [
  ['html', '<!DOCTYPE html>\n<html lang="es">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${1:Mi página}</title>\n</head>\n<body>\n  ${2:Contenido}\n</body>\n</html>', 'Documento HTML'],
  ['div', '<div class="${1:clase}">\n  ${2:Contenido}\n</div>', 'Contenedor'],
  ['a', '<a href="${1:#}">${2:Enlace}</a>', 'Enlace'],
  ['img', '<img src="${1:imagen.png}" alt="${2:Descripción}">', 'Imagen'],
  ['button', '<button type="button">${1:Botón}</button>', 'Botón'],
  ['section', '<section>\n  ${1:Contenido}\n</section>', 'Sección'],
  ['form', '<form>\n  ${1:Contenido}\n</form>', 'Formulario'],
  ['input', '<input type="${1:text}" name="${2:nombre}">', 'Campo'],
  ['linkcss', '<link rel="stylesheet" href="${1:style.css}">', 'Enlazar CSS'],
  ['scriptjs', '<script src="${1:script.js}"></script>', 'Enlazar JavaScript'],
  ['ul', '<ul>\n  <li>${1:Elemento}</li>\n</ul>', 'Lista']
];
const cssSnippets = [
  ['flex', 'display: flex;\njustify-content: ${1:center};\nalign-items: ${2:center};', 'Diseño flexbox'],
  ['grid', 'display: grid;\ngrid-template-columns: repeat(${1:3}, 1fr);\ngap: ${2:16px};', 'Diseño en cuadrícula'],
  ['media', '@media (max-width: ${1:768px}) {\n  ${2:/* Estilos */}\n}', 'Media query'],
  ['hover', '&:hover {\n  ${1:color: #ff1744;}\n}', 'Estado hover (para CSS anidado)'],
  ['transition', 'transition: ${1:all} ${2:180ms} ease;', 'Transición suave'],
  ['shadow', 'box-shadow: 0 0 ${1:16px} rgba(217, 11, 43, ${2:0.25});', 'Resplandor rojo'],
  ['root', ':root {\n  --color-principal: ${1:#d90b2b};\n}', 'Variables CSS']
];
const jsSnippets = [
  ['log', 'console.log(${1:valor});', 'Imprimir en consola'],
  ['fn', 'function ${1:nombre}(${2:argumentos}) {\n  ${3:// Código}\n}', 'Función'],
  ['arrow', 'const ${1:nombre} = (${2:argumentos}) => {\n  ${3:// Código}\n};', 'Función flecha'],
  ['if', 'if (${1:condicion}) {\n  ${2:// Código}\n}', 'Condición'],
  ['for', 'for (let ${1:i} = 0; ${1} < ${2:10}; ${1}++) {\n  ${3:// Código}\n}', 'Bucle for'],
  ['query', 'document.querySelector("${1:.clase}")', 'Buscar elemento HTML'],
  ['listen', 'document.querySelector("${1:#id}").addEventListener("${2:click}", () => {\n  ${3:// Código}\n});', 'Escuchar evento'],
  ['async', 'async function ${1:nombre}() {\n  ${2:// Código}\n}', 'Función asíncrona']
];


// Nuevas plantillas cortas; se añaden a las opciones nativas del parser, sin sustituirlas.
const languageSnippets = {
  py: [
    ['def', 'def ${1:nombre}(${2:argumentos}):\n    ${3:pass}', 'Función Python'],
    ['if', 'if ${1:condicion}:\n    ${2:pass}', 'Condición Python'],
    ['for', 'for ${1:elemento} in ${2:elementos}:\n    ${3:pass}', 'Bucle Python'],
    ['class', 'class ${1:Nombre}:\n    def __init__(self):\n        ${2:pass}', 'Clase Python']
  ],
  php: [
    ['echo', 'echo ${1:$valor};', 'Imprimir'],
    ['if', 'if (${1:$condicion}) {\n    ${2:// código}\n}', 'Condición PHP'],
    ['function', 'function ${1:nombre}(${2:$dato}) {\n    ${3:return $dato;}\n}', 'Función PHP']
  ],
  json: [
    ['object', '{\n  "${1:clave}": ${2:null}\n}', 'Objeto JSON'],
    ['array', '[\n  ${1:null}\n]', 'Lista JSON']
  ],
  md: [
    ['heading', '# ${1:Título}', 'Título Markdown'],
    ['link', '[${1:texto}](${2:https://ejemplo.com})', 'Enlace Markdown'],
    ['code', '```' + '${1:js}' + '\n${2:código}\n```', 'Bloque de código'],
    ['table', '| ${1:Columna} | ${2:Valor} |\n| --- | --- |\n| ${3:Dato} | ${4:Dato} |', 'Tabla Markdown']
  ],
  sql: [
    ['select', 'SELECT ${1:columna}\nFROM ${2:tabla}\nWHERE ${3:condicion};', 'Consulta SELECT'],
    ['insert', 'INSERT INTO ${1:tabla} (${2:columna}) VALUES (${3:valor});', 'INSERT SQL'],
    ['update', 'UPDATE ${1:tabla}\nSET ${2:campo} = ${3:valor}\nWHERE ${4:id = 1};', 'UPDATE SQL']
  ],
  scss: [
    ['mixin', '@mixin ${1:nombre} {\n  ${2:display: flex;}\n}', 'Mixin SCSS'],
    ['include', '@include ${1:nombre};', 'Usar mixin'],
    ['nest', '.${1:clase} {\n  &:hover {\n    ${2:color: red;}\n  }\n}', 'Selector anidado']
  ],
  xml: [
    ['node', '<${1:elemento}>${2:contenido}</${1}>', 'Elemento XML'],
    ['header', '<?xml version="1.0" encoding="UTF-8"?>', 'Declaración XML']
  ],
  yaml: [
    ['object', '${1:clave}:\n  ${2:subclave}: ${3:valor}', 'Mapa YAML'],
    ['list', '${1:lista}:\n  - ${2:primero}\n  - ${3:segundo}', 'Lista YAML']
  ]
};

export function completionSourceFor(name) {
  const ext = extensionOf(name);
  const list = ['html', 'htm'].includes(ext) ? htmlSnippets : ext === 'css' ? cssSnippets : ['js', 'mjs', 'ts'].includes(ext) ? jsSnippets : ['yaml','yml'].includes(ext) ? languageSnippets.yaml : languageSnippets[ext] ?? [];
  if (!list.length) return () => null;
  const options = list.map(([label, template, detail]) => snippetCompletion(template, { label, detail, type: 'keyword', boost: 60 }));
  const snippets = (context) => {
    const match = context.matchBefore(/[\w-]*/);
    if (!match || (!context.explicit && match.from === match.to)) return null;
    if (['html', 'htm'].includes(ext) && context.state.sliceDoc(Math.max(0, match.from - 1), match.from) === '<') return null;
    return { from: match.from, options, validFor: /^[\w-]*$/ };
  };
  // Una fuente adicional por lenguaje. No sustituye el autocompletado original de CodeMirror.
  return snippets;
}
