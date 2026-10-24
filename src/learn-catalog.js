/** Catálogo compartido: navegación de Etapa D, sin ejecutar código del alumno. */
export const CATALOG = Object.freeze([
  { id:'html', name:'HTML', tag:'HTML', ext:'.html', color:'#fb875c', summary:'Estructura de páginas y contenido.', type:'web', icon:'<>', code:'<main>\n  <h1>Hola, BadDev</h1>\n  <p>Mi primera página.</p>\n</main>', concepts:['Etiquetas y atributos','Estructura del documento','Formularios y enlaces'], note:'HTML describe el contenido; CSS lo presenta y JavaScript le da comportamiento.' },
  { id:'css', name:'CSS', tag:'CSS', ext:'.css', color:'#68aaff', summary:'Diseño, estilos y disposición de elementos.', type:'web', icon:'{ }', code:'h1 {\n  color: #ff1744;\n  font-size: 2rem;\n}', concepts:['Selectores y propiedades','Modelo de caja','Diseño adaptable'], note:'CSS se aplica a elementos HTML mediante selectores y reglas.' },
  { id:'js', name:'JavaScript', tag:'JS', ext:'.js', color:'#e5c660', summary:'Lógica e interactividad para la web.', type:'web', icon:'JS', code:'const nombre = "BadDev";\nconsole.log(`Hola, ${nombre}`);', concepts:['Variables y funciones','Condiciones y bucles','DOM y eventos'], note:'JavaScript puede ejecutarse dentro de la vista previa aislada del navegador.' },
  { id:'ts', name:'TypeScript', tag:'TS', ext:'.ts', color:'#52b7ff', summary:'JavaScript con tipos y mejores herramientas.', icon:'TS', code:'function saludar(nombre: string): string {\n  return `Hola, ${nombre}`;\n}\nconsole.log(saludar("BadDev"));', concepts:['Tipos explícitos','Interfaces y funciones','Transpilación a JavaScript'], note:'TypeScript necesita transformarse en JavaScript; BadDev ofrece esa vista previa con limitaciones.' },
  { id:'py', name:'Python', tag:'PY', ext:'.py', color:'#8ecc65', summary:'Lógica clara, automatización y datos.', icon:'PY', code:'def saludar(nombre):\n    return f"Hola, {nombre}"\n\nprint(saludar("BadDev"))', concepts:['Indentación por bloques','Variables y funciones','Listas y ciclos'], note:'BadDev permite editar Python; su ejecución no está disponible todavía. print() muestra texto en la consola de Python.' },
  { id:'php', name:'PHP', tag:'PHP', ext:'.php', color:'#b5a7f8', summary:'Procesamiento web del lado del servidor.', icon:'PHP', code:'<?php\n$nombre = "BadDev";\necho "Hola, " . $nombre;\n?>', concepts:['Variables con $','Condiciones y funciones','Servidor y respuestas HTTP'], note:'BadDev permite editar PHP; no incluye un servidor PHP para ejecutarlo.' },
  { id:'json', name:'JSON', tag:'JSON', ext:'.json', color:'#e9b661', summary:'Representa e intercambia datos estructurados.', icon:'{ }', code:'{\n  "nombre": "BadDev",\n  "version": 1.2,\n  "activo": true\n}', concepts:['Objetos y arreglos','Tipos de valores','Sintaxis estricta'], note:'JSON es un formato de datos, no un lenguaje ejecutable. BadDev puede validarlo y mostrarlo.' },
  { id:'md', name:'Markdown', tag:'MD', ext:'.md', color:'#a0d6ff', summary:'Escribe documentación simple y ordenada.', icon:'MD', code:'# Mi proyecto\n\n**Objetivo:** aprender Markdown.\n\n- Editar archivos\n- Documentar código', concepts:['Títulos y párrafos','Enlaces y listas','Bloques de código'], note:'Markdown se transforma en un documento legible en la vista previa; no ejecuta scripts.' },
  { id:'sql', name:'SQL', tag:'SQL', ext:'.sql', color:'#e99c6a', summary:'Consulta y organiza información en tablas.', icon:'SQL', code:'SELECT nombre, edad\nFROM usuarios\nWHERE edad >= 18;', concepts:['Tablas y columnas','SELECT y WHERE','INSERT y UPDATE'], note:'Para ejecutar SQL necesitas una base de datos. BadDev ofrece edición, no un motor SQL.' },
  { id:'scss', name:'SCSS', tag:'SCSS', ext:'.scss', color:'#e779ae', summary:'CSS con variables y reglas anidadas.', icon:'SCSS', code:'$acento: #ff1744;\n\n.card {\n  border: 1px solid $acento;\n  &:hover { color: $acento; }\n}', concepts:['Variables','Anidación','Compilación a CSS'], note:'SCSS debe compilarse a CSS para usarlo en una página; todavía no hay compilador SCSS en BadDev.' },
  { id:'xml', name:'XML', tag:'XML', ext:'.xml', color:'#79cbbc', summary:'Documentos estructurados con etiquetas.', icon:'XML', code:'<?xml version="1.0"?>\n<proyecto>\n  <nombre>BadDev</nombre>\n</proyecto>', concepts:['Elementos anidados','Atributos','Etiquetas bien cerradas'], note:'XML sirve para representar datos; BadDev puede revisar si está bien formado.' },
  { id:'yaml', name:'YAML', tag:'YAML', ext:'.yaml', color:'#f08b75', summary:'Configuraciones legibles por personas.', icon:'YAML', code:'proyecto: BadDev\nactivo: true\nlenguajes:\n  - HTML\n  - Python', concepts:['Claves y valores','Listas con guiones','Indentación con espacios'], note:'YAML sirve para configurar y guardar datos, no para ejecutar código. BadDev puede validarlo.' }
]);

const BY_ID = new Map(CATALOG.map(item => [item.id, item]));
export function languageInfo(id) { return BY_ID.get(id) || null; }
export function validLanguageId(id) { return BY_ID.has(id); }
export const BASE_LESSON_IDS = Object.freeze({
  html:['inicio','archivos','atajos','algoritmos','html','depuracion'],
  css:['inicio','archivos','atajos','algoritmos','css','depuracion'],
  js:['inicio','archivos','atajos','algoritmos','variables','condiciones','bucles','funciones','dom','depuracion','miniproyecto']
});
export const BASE_MANUAL_IDS = Object.freeze({
  html:['empezar','atajos','html'],
  css:['empezar','atajos','css'],
  js:['empezar','atajos','js','errores']
});
export function languageForLessonId(lessonId) {
  if (lessonId === 'html') return 'html';
  if (lessonId === 'css') return 'css';
  if (lessonId) return 'js';
  return null;
}

export function languageUrl(mode, lang, anchor = '') {
  const page = mode === 'manual' ? 'manual.html' : 'lessons.html';
  const suffix = anchor ? `#${encodeURIComponent(anchor)}` : '';
  return `./${page}?lang=${encodeURIComponent(lang)}${suffix}`;
}
