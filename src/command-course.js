// BadDev V 1.4 — Fase 2: curso «Aprender comandos» para Lecciones y Manual de Learn.
// Los textos de cada comando salen de COMMAND_DOCS (la misma fuente que usa «ayuda» en la terminal),
// así lecciones, manual y terminal nunca se contradicen.
import { COMMAND_DOCS } from './terminal-commands.js';

export const COMMAND_TRACK = Object.freeze({
  id: 'cmd', name: 'Comandos', tag: 'CMD', ext: '>_', color: '#4ade80', icon: '>_',
  summary: 'Aprende los comandos de la terminal de BadDev y los de CMD en Windows.',
  note: 'BadDev tiene dos terminales: BADDEV (comandos propios, en la web y el .exe) y CMD REAL (comandos de Windows, solo en el .exe). Aquí aprendes ambas.',
  concepts: ['Comandos propios de BadDev', 'Moverte por carpetas y archivos', 'Buscar y leer archivos', 'Comandos reales de Windows', 'Git, npm, Node y Python desde la terminal'],
  code: 'ayuda\nls\nbuscar background\nvista index.html'
});

const docById = new Map(COMMAND_DOCS.map(doc => [doc.id, doc]));
const docs = (ids) => ids.map(id => docById.get(id)).filter(Boolean);
const fact = (doc) => `${doc.name}: ${doc.summary}`;
const usage = (doc) => `${doc.syntax} — ${doc.summary}`;

// Definición de las lecciones. Cada una referencia ids de COMMAND_DOCS.
const UNITS = [
  {
    group: 'Terminal de BadDev', title: 'Tu terminal en BadDev', time: '5 min', ids: ['ayuda', 'limpiar', 'salir'],
    subtitle: 'Cómo abrirla, qué pestañas tiene y cómo pedir ayuda.',
    paragraphs: [
      'Abre la terminal con Ver → Terminal, con el botón Terminal de la barra superior o con Ctrl + `. Tiene dos pestañas: BADDEV (comandos propios que funcionan en la web y en el .exe) y CMD REAL (comandos de Windows, solo en el .exe).',
      'Empieza siempre por «ayuda»: lista todos los comandos. Con «ayuda <comando>» ves qué hace, cómo se escribe y un ejemplo. También explica comandos de Windows: prueba «ayuda dir».'
    ],
    tips: ['Tab completa nombres de comandos y de archivos.', 'Flecha arriba repite el comando anterior; Ctrl + L limpia la pantalla.', 'Ctrl + ` abre y cierra la terminal sin usar el ratón.'],
    example: ['ayuda', 'ayuda buscar', 'limpiar'],
    exampleNote: '«ayuda» lista los comandos, «ayuda buscar» explica uno y «limpiar» deja la pantalla vacía.',
    challenge: { question: '¿Qué comando te explica cómo se usa «buscar»?', choices: ['ayuda buscar', 'buscar ayuda', 'explicar buscar'], answer: 0, hint: 'La palabra que pide ayuda va primero.', explanation: '«ayuda <comando>» muestra qué hace, su uso y un ejemplo.' }
  },
  {
    group: 'Terminal de BadDev', title: 'Moverte por tu proyecto', time: '6 min', ids: ['ls', 'tree', 'cd', 'pwd'],
    subtitle: 'Ver carpetas y archivos sin salir del editor.',
    paragraphs: [
      'La terminal BADDEV trabaja sobre el proyecto abierto en BadDev, no sobre tus archivos de Windows. «ls» lista lo que hay en la carpeta actual y «cd» entra en una carpeta del proyecto.',
      '«tree» dibuja todo el proyecto de una vez, útil para comprobar cómo está organizado, por ejemplo la carpeta de imágenes. Las imágenes aparecen con el icono 🖼.'
    ],
    tips: ['«cd ..» sube una carpeta y «cd /» vuelve a la raíz del proyecto.', '«pwd» te dice en qué carpeta estás.', 'Si no sabes cómo se llama un archivo, usa «ls» o «tree» y copia el nombre con Tab.'],
    example: ['ls', 'ls images', 'cd images', 'pwd', 'cd ..', 'tree'],
    exampleNote: 'Entras a images, confirmas dónde estás, subes y miras el árbol completo.',
    challenge: { question: '¿Qué comando dibuja todas las carpetas y archivos del proyecto de una vez?', choices: ['tree', 'pwd', 'cd'], answer: 0, hint: 'Piensa en un árbol con ramas.', explanation: '«tree» recorre el proyecto completo; «pwd» solo dice dónde estás y «cd» cambia de carpeta.' }
  },
  {
    group: 'Terminal de BadDev', title: 'Leer y buscar en tus archivos', time: '6 min', ids: ['cat', 'head', 'wc', 'buscar'],
    subtitle: 'Mirar el contenido sin abrir el editor.',
    paragraphs: [
      '«cat» muestra un archivo con sus números de línea; «head» muestra solo las primeras; «wc» cuenta líneas, palabras y caracteres.',
      '«buscar» recorre todos los archivos del proyecto y te dice en cuáles aparece un texto, con archivo y línea. No distingue mayúsculas.'
    ],
    tips: ['Si el nombre del archivo es único, no hace falta escribir la carpeta.', 'Para editarlo usa «abrir»; «cat» solo lo muestra.', 'Para buscar frases escribe todas las palabras: buscar color de fondo.'],
    example: ['cat index.html', 'head style.css 5', 'wc script.js', 'buscar background'],
    exampleNote: 'Lees un archivo, ves sus 5 primeras líneas, lo mides y buscas una palabra en todo el proyecto.',
    challenge: { question: 'Quieres saber en qué archivos aparece la palabra «background». ¿Qué usas?', choices: ['buscar background', 'cat background', 'wc background'], answer: 0, hint: 'Necesitas recorrer todos los archivos, no uno solo.', explanation: '«buscar» revisa todo el proyecto; «cat» y «wc» trabajan con un archivo concreto.' }
  },
  {
    group: 'Terminal de BadDev', title: 'Actuar sobre el editor', time: '7 min', ids: ['abrir', 'nuevo', 'vista', 'python', 'guardar', 'zip'],
    subtitle: 'Abrir, crear, previsualizar, ejecutar y exportar desde la terminal.',
    paragraphs: [
      'Los comandos propios de BadDev no solo leen: también mueven el editor. «abrir» abre un archivo en una pestaña, «nuevo» crea uno con su plantilla y «vista» abre la vista previa de una página.',
      '«python» ejecuta un archivo .py con el motor de BadDev, «guardar» equivale a Ctrl + S y «zip» descarga el proyecto completo con sus imágenes.'
    ],
    tips: ['«nuevo pages/contacto.html» crea también la carpeta virtual pages.', 'Un archivo nuevo existe en BadDev hasta que lo guardes o exportes.', '«vista» sin nombre abre la vista previa del archivo actual.'],
    example: ['abrir index.html', 'nuevo pages/contacto.html', 'vista elmenucatalogo.html', 'python hola.py', 'guardar', 'zip'],
    exampleNote: 'Un flujo de trabajo completo sin tocar el ratón.',
    challenge: { question: '¿Qué comando abre la vista previa de una página concreta?', choices: ['vista pagina.html', 'abrir pagina.html', 'zip pagina.html'], answer: 0, hint: '«abrir» te lleva al editor, no a la vista previa.', explanation: '«vista» abre la vista previa; «abrir» abre el archivo en el editor y «zip» exporta el proyecto.' }
  },
  {
    group: 'Terminal de BadDev', title: 'Imágenes, temas y datos del proyecto', time: '4 min', ids: ['imagenes', 'tema', 'proyecto', 'version'],
    subtitle: 'Comprobar qué detectó BadDev y cambiar su apariencia.',
    paragraphs: [
      'Si abres una carpeta de proyecto que contiene imágenes, BadDev las detecta y las muestra en la vista previa. «imagenes» las lista con su tamaño para que compruebes que no falta ninguna.',
      '«proyecto» resume el nombre, la cantidad de archivos e imágenes y el tema; «tema» cambia entre los cinco temas; «version» dice qué versión de BadDev usas.'
    ],
    tips: ['Cada imagen puede pesar hasta 3 MB y el total hasta 25 MB.', 'Los temas son demon, inferno, toxic, angelical y slayer.', 'Las imágenes de internet (https) también se ven en la vista previa; las de tu carpeta no necesitan conexión.'],
    example: ['imagenes', 'tema toxic', 'proyecto', 'version'],
    exampleNote: 'Listas las imágenes, cambias de tema y revisas el resumen del proyecto.',
    challenge: { question: '¿Qué comando lista las imágenes detectadas en tu carpeta de proyecto?', choices: ['imagenes', 'fotos', 'ls --img'], answer: 0, hint: 'Es una palabra, sin opciones.', explanation: '«imagenes» muestra cada imagen con su tamaño y el total.' }
  },
  {
    group: 'CMD real (Windows)', title: 'CMD real: dónde estoy y qué hay', time: '7 min', ids: ['w-dir', 'w-cd', 'w-cls', 'w-type'],
    subtitle: 'Los primeros comandos de la terminal de Windows.',
    paragraphs: [
      'La pestaña CMD REAL ejecuta comandos de Windows de verdad, sobre tus carpetas reales y con tus permisos. Elige tu carpeta de trabajo con el botón ▣ y el prompt mostrará la ruta donde estás.',
      '«dir» lista lo que hay, «cd» cambia de carpeta, «type» muestra un archivo y «cls» limpia la pantalla. Para cambiar de disco usa «cd /d D:\\» o escribe «D:».'
    ],
    tips: ['Si una carpeta tiene espacios, ponla entre comillas: cd "Mis Proyectos".', '«dir /b» muestra solo los nombres, más limpio para leer.', 'La pestaña BADDEV también entiende «dir», pero lista el proyecto de BadDev, no Windows.'],
    example: ['dir', 'dir /b', 'cd Documents\\BadDev', 'type package.json', 'cls'],
    exampleNote: 'Listas, entras a una carpeta, lees un archivo y limpias.',
    challenge: { question: '¿Cómo cambias a la carpeta D:\\Proyectos aunque estés en el disco C:?', choices: ['cd /d D:\\Proyectos', 'cd D:Proyectos', 'dir D:\\Proyectos'], answer: 0, hint: 'Hay una opción que permite cambiar de disco.', explanation: '/d le dice a «cd» que cambie también de unidad. «dir» solo lista y la segunda opción tiene mal la ruta.' }
  },
  {
    group: 'CMD real (Windows)', title: 'CMD real: crear, copiar y borrar con cuidado', time: '8 min', ids: ['w-mkdir', 'w-copy', 'w-move', 'w-ren', 'w-del', 'w-rmdir'],
    subtitle: 'Gestionar archivos reales, sabiendo que no hay papelera.',
    paragraphs: [
      '«mkdir» crea carpetas, «copy» copia archivos, «move» los mueve y «ren» cambia su nombre. Son seguros mientras revises los nombres antes de pulsar Enter.',
      '«del» y «rmdir» borran de forma definitiva: no pasan por la papelera de Windows. Con «rmdir /s» se borra la carpeta y todo lo que contiene.'
    ],
    tips: ['Antes de borrar, ejecuta «dir» para confirmar que estás en la carpeta correcta.', 'Haz una copia con «copy» antes de tocar algo importante.', 'En BadDev la terminal real avisa con ⚠ en «ayuda del» y «ayuda rmdir».'],
    example: ['mkdir images', 'copy index.html respaldo.html', 'move foto.png images', 'ren viejo.html menu.html', 'dir'],
    exampleNote: 'Operaciones seguras; termina con «dir» para comprobar el resultado.',
    challenge: { question: 'Antes de usar «del» o «rmdir /s», ¿qué conviene hacer?', choices: ['Revisar con dir que estás en la carpeta correcta', 'Nada: tienen papelera de reciclaje', 'Escribir cls para limpiar'], answer: 0, hint: 'El borrado de CMD es definitivo.', explanation: 'CMD no usa la papelera; confirmar la carpeta con «dir» evita borrar lo que no querías.' }
  },
  {
    group: 'CMD real (Windows)', title: 'CMD real: buscar y diagnosticar', time: '8 min', ids: ['w-findstr', 'w-where', 'w-set', 'w-whoami', 'w-tasklist', 'w-taskkill', 'w-ipconfig', 'w-ping'],
    subtitle: 'Encontrar texto, comprobar programas y revisar la red.',
    paragraphs: [
      '«findstr» busca texto dentro de archivos reales (con /s recorre subcarpetas y con /i ignora mayúsculas). «where» te dice dónde está instalado un programa y sirve para comprobar si Node o Git están instalados.',
      '«ping» comprueba la conexión, «ipconfig» muestra tu red, «tasklist» lista los programas abiertos y «taskkill» cierra uno. Con «taskkill /f» puedes perder trabajo sin guardar.'
    ],
    tips: ['Si «where node» no responde nada, Node.js no está instalado o no está en el PATH.', '«ping -n 2 sitio» envía solo 2 pruebas en vez de 4.', 'Usa Ctrl + C para detener un comando que tarda demasiado.'],
    example: ['findstr /s /i "background" *.css', 'where node', 'ping -n 2 google.com', 'tasklist'],
    exampleNote: 'Buscas en todos los CSS, compruebas Node, pruebas la red y listas procesos.',
    challenge: { question: '¿Qué comando te dice si Node.js está instalado y dónde?', choices: ['where node', 'dir node', 'set node'], answer: 0, hint: 'Busca la ubicación de un programa.', explanation: '«where» localiza programas instalados; «dir» y «set» no buscan programas.' }
  },
  {
    group: 'CMD real (Windows)', title: 'CMD real: Node, npm, Git y Python', time: '8 min', ids: ['w-node', 'w-npm', 'w-git', 'w-python', 'w-code'],
    subtitle: 'Las herramientas de programador que sí vas a usar a diario.',
    paragraphs: [
      'Con CMD REAL puedes ejecutar los mismos comandos que usas para trabajar en BadDev: «npm install» y «npm run dev» para arrancar el proyecto, «node archivo.js» para probar JavaScript y «python archivo.py» para Python instalado en Windows.',
      '«git status» muestra qué archivos cambiaste y es seguro. Después vienen «git add .», «git commit -m "mensaje"» y «git push» para subir tu trabajo a GitHub. «start .» abre la carpeta actual en el Explorador.'
    ],
    tips: ['Primero elige tu carpeta de proyecto con el botón ▣.', 'Los asistentes interactivos (como npm init) no funcionan aquí; usa npm init -y.', 'Comprueba versiones con node -v, npm -v, git --version y python --version.'],
    example: ['node -v', 'npm run dev', 'git status', 'python --version', 'start .'],
    exampleNote: 'Verificas herramientas, arrancas el proyecto y revisas Git.',
    challenge: { question: '¿Qué comando de Git es seguro para ver qué archivos cambiaste?', choices: ['git status', 'git push', 'git commit'], answer: 0, hint: 'Solo informa; no sube ni guarda nada.', explanation: '«git status» solo muestra el estado. «push» sube y «commit» guarda un punto en la historia.' }
  },
  {
    group: 'Cierra el círculo', title: 'BadDev vs CMD: equivalencias', time: '5 min', ids: ['ls', 'cat', 'limpiar', 'buscar', 'tree'],
    subtitle: 'Cuál comando usar en cada pestaña.',
    paragraphs: [
      'Muchos comandos de BadDev tienen un equivalente en CMD. La diferencia es dónde trabajan: los de BADDEV actúan sobre el proyecto abierto en el editor; los de CMD REAL actúan sobre las carpetas reales de Windows.',
      'Por eso «dir» existe en las dos pestañas: en BADDEV lista el proyecto y en CMD REAL lista tu carpeta de Windows. Elige la pestaña según lo que quieras tocar.'
    ],
    tips: ['Proyecto en el editor → pestaña BADDEV.', 'Archivos de tu equipo, Git, npm, Node → pestaña CMD REAL.', 'En la web (sin .exe) solo existe la pestaña BADDEV completa.'],
    example: ['BADDEV      CMD REAL', 'ls / dir     dir', 'cat          type', 'limpiar      cls', 'buscar       findstr', 'tree         tree'],
    exampleNote: 'La misma idea, escrita para cada terminal.',
    challenge: { question: 'En CMD REAL quieres listar los archivos de la carpeta actual. ¿Qué escribes?', choices: ['dir', 'ls images', 'imagenes'], answer: 0, hint: 'Es un comando clásico de Windows.', explanation: '«dir» es el comando de Windows. «imagenes» y «ls» son comandos de BadDev que no existen en CMD.' }
  }
];

export const COMMAND_LESSONS = Object.freeze(UNITS.map((unit, index) => {
  const unitDocs = docs(unit.ids);
  const code = unit.example.join('\n');
  const answerText = unit.challenge.choices[unit.challenge.answer];
  return {
    id: `c-cmd-${index + 1}`, languageId: 'cmd', group: unit.group, title: unit.title, subtitle: unit.subtitle, time: unit.time,
    objective: unit.paragraphs[0].split('. ')[0].replace(/\.$/, '') + '.',
    paragraphs: unit.paragraphs, tips: unit.tips,
    example: { language: 'text', code, note: unit.exampleNote },
    challenge: { type: 'choice', ...unit.challenge },
    solution: { code, why: unit.challenge.explanation, answer: answerText },
    summary: unitDocs.slice(0, 6).map(fact)
  };
}));

export const COMMAND_MANUAL = Object.freeze(UNITS.map((unit, index) => ({
  id: `m-cmd-${index + 1}`, group: unit.group, title: unit.title, subtitle: unit.subtitle,
  theory: unit.paragraphs,
  bullets: docs(unit.ids).map(usage),
  example: { language: 'text', code: unit.example.join('\n') },
  bestPractices: unit.tips,
  commonMistakes: docs(unit.ids).filter(doc => doc.notes).map(doc => `${doc.name}: ${doc.notes.replace(/^⚠\s*/, '')}`).slice(0, 4)
})));

export const COMMAND_LESSON_IDS = Object.freeze(COMMAND_LESSONS.map(lesson => lesson.id));
export function commandLessonById(id) { return COMMAND_LESSONS.find(lesson => lesson.id === id) || null; }
