// BadDev V 1.4 — Terminal: comandos propios de BadDev y documentación de los comandos reales de Windows.
// Este módulo es puro (sin DOM): recibe un "contexto" con las acciones del editor y devuelve líneas de salida.
// La misma documentación (COMMAND_DOCS) la usa la terminal (comando "ayuda") y las lecciones de Learn.

export const THEME_LABELS = Object.freeze({
  demon: 'Demon Red', purple: 'Inferno Purple', green: 'Toxic Green', angel: 'Angelical Water', slayer: 'Dev Slayer'
});
const THEME_ALIASES = Object.freeze({
  demon: 'demon', red: 'demon', rojo: 'demon', purple: 'purple', inferno: 'purple', morado: 'purple',
  green: 'green', toxic: 'green', verde: 'green', angel: 'angel', angelical: 'angel', water: 'angel', celeste: 'angel',
  slayer: 'slayer', dev: 'slayer', naranja: 'slayer'
});

// scope: 'baddev' = comandos propios (funcionan en web y en el .exe) · 'cmd' = comandos reales de Windows (solo pestaña CMD REAL).
export const COMMAND_DOCS = Object.freeze([
  // ----- Comandos propios de BadDev -----
  { id: 'ayuda', scope: 'baddev', name: 'ayuda', aliases: ['help', '?'], summary: 'Muestra todos los comandos o explica uno en detalle.', syntax: 'ayuda [comando]', example: 'ayuda buscar', notes: 'También explica comandos reales de Windows: prueba «ayuda dir».' },
  { id: 'ls', scope: 'baddev', name: 'ls', aliases: ['dir', 'll', 'listar'], summary: 'Lista los archivos y carpetas del proyecto en la carpeta actual.', syntax: 'ls [ruta]', example: 'ls images', notes: 'Las imágenes aparecen con 🖼. No muestra tus archivos de Windows: solo el proyecto abierto en BadDev.' },
  { id: 'tree', scope: 'baddev', name: 'tree', aliases: ['arbol', 'árbol'], summary: 'Dibuja el árbol completo de carpetas y archivos del proyecto.', syntax: 'tree [ruta]', example: 'tree', notes: 'Útil para comprobar cómo está organizado el proyecto, por ejemplo la carpeta de imágenes.' },
  { id: 'cd', scope: 'baddev', name: 'cd', aliases: [], summary: 'Cambia la carpeta actual dentro del proyecto.', syntax: 'cd <carpeta> · cd .. · cd /', example: 'cd images', notes: 'Es una carpeta virtual del proyecto de BadDev; no cambia carpetas de Windows (para eso está CMD REAL).' },
  { id: 'pwd', scope: 'baddev', name: 'pwd', aliases: [], summary: 'Muestra la carpeta actual del proyecto.', syntax: 'pwd', example: 'pwd', notes: '' },
  { id: 'cat', scope: 'baddev', name: 'cat', aliases: ['type', 'mostrar'], summary: 'Muestra el contenido de un archivo de texto del proyecto.', syntax: 'cat <archivo>', example: 'cat index.html', notes: 'Muestra hasta 400 líneas. Para editarlo usa «abrir».' },
  { id: 'head', scope: 'baddev', name: 'head', aliases: ['primeras'], summary: 'Muestra las primeras líneas de un archivo.', syntax: 'head <archivo> [líneas]', example: 'head style.css 5', notes: 'Por defecto muestra 10 líneas.' },
  { id: 'wc', scope: 'baddev', name: 'wc', aliases: ['contar'], summary: 'Cuenta líneas, palabras y caracteres de un archivo.', syntax: 'wc <archivo>', example: 'wc script.js', notes: '' },
  { id: 'abrir', scope: 'baddev', name: 'abrir', aliases: ['open', 'code'], summary: 'Abre un archivo del proyecto en el editor.', syntax: 'abrir <archivo>', example: 'abrir index.html', notes: 'Si el nombre es único en el proyecto no hace falta escribir la carpeta.' },
  { id: 'nuevo', scope: 'baddev', name: 'nuevo', aliases: ['touch', 'new'], summary: 'Crea un archivo nuevo con su plantilla inicial.', syntax: 'nuevo <nombre.ext>', example: 'nuevo pages/contacto.html', notes: 'El archivo existe en BadDev hasta que lo guardes (guardar o zip).' },
  { id: 'buscar', scope: 'baddev', name: 'buscar', aliases: ['grep', 'findstr'], summary: 'Busca un texto dentro de todos los archivos del proyecto.', syntax: 'buscar <texto>', example: 'buscar background', notes: 'No distingue mayúsculas y muestra archivo:línea. Máximo 60 resultados.' },
  { id: 'vista', scope: 'baddev', name: 'vista', aliases: ['preview', 'previa'], summary: 'Abre la vista previa, opcionalmente de un archivo concreto.', syntax: 'vista [archivo]', example: 'vista elmenucatalogo.html', notes: 'Funciona con HTML, Markdown, JSON y TypeScript.' },
  { id: 'python', scope: 'baddev', name: 'python', aliases: ['run', 'ejecutar'], summary: 'Ejecuta un archivo Python con el motor de BadDev.', syntax: 'python <archivo.py>', example: 'python hola_baddev.py', notes: 'Usa el motor elegido en el panel de Python (navegador o Python local).' },
  { id: 'guardar', scope: 'baddev', name: 'guardar', aliases: ['save'], summary: 'Guarda el archivo activo (igual que Ctrl+S).', syntax: 'guardar', example: 'guardar', notes: '' },
  { id: 'zip', scope: 'baddev', name: 'zip', aliases: ['exportar'], summary: 'Descarga el proyecto completo como ZIP, con sus imágenes.', syntax: 'zip', example: 'zip', notes: 'Requiere tener un proyecto abierto.' },
  { id: 'tema', scope: 'baddev', name: 'tema', aliases: ['theme'], summary: 'Muestra o cambia el tema visual de BadDev.', syntax: 'tema [nombre]', example: 'tema toxic', notes: 'Temas: demon, inferno, toxic, angelical, slayer.' },
  { id: 'imagenes', scope: 'baddev', name: 'imagenes', aliases: ['imágenes', 'images'], summary: 'Lista las imágenes detectadas en el proyecto.', syntax: 'imagenes', example: 'imagenes', notes: 'Solo hay imágenes si abriste una carpeta de proyecto que las contiene.' },
  { id: 'proyecto', scope: 'baddev', name: 'proyecto', aliases: ['info', 'status'], summary: 'Resume el proyecto: nombre, archivos, imágenes y tema.', syntax: 'proyecto', example: 'proyecto', notes: '' },
  { id: 'version', scope: 'baddev', name: 'version', aliases: ['versión'], summary: 'Muestra la versión de BadDev.', syntax: 'version', example: 'version', notes: '' },
  { id: 'echo', scope: 'baddev', name: 'echo', aliases: ['decir'], summary: 'Escribe un texto en la terminal.', syntax: 'echo <texto>', example: 'echo Hola BadDev', notes: '' },
  { id: 'fecha', scope: 'baddev', name: 'fecha', aliases: ['date', 'hora'], summary: 'Muestra la fecha y la hora actuales.', syntax: 'fecha', example: 'fecha', notes: '' },
  { id: 'limpiar', scope: 'baddev', name: 'limpiar', aliases: ['clear', 'cls'], summary: 'Borra la pantalla de la terminal.', syntax: 'limpiar', example: 'limpiar', notes: 'Atajo: Ctrl+L.' },
  { id: 'cmd', scope: 'baddev', name: 'cmd', aliases: ['real'], summary: 'Cambia a la pestaña CMD REAL (terminal de Windows).', syntax: 'cmd', example: 'cmd', notes: 'Solo en la app de escritorio (.exe).' },
  { id: 'salir', scope: 'baddev', name: 'salir', aliases: ['exit', 'cerrar'], summary: 'Cierra el panel de la terminal.', syntax: 'salir', example: 'salir', notes: 'Atajo: Ctrl+` abre y cierra la terminal.' },
  { id: 'mercy', scope: 'baddev', name: 'mercy', aliases: [], summary: 'Un recordatorio de la filosofía de BadDev.', syntax: 'mercy', example: 'mercy', notes: '' },

  // ----- Comandos reales de Windows (pestaña CMD REAL) -----
  { id: 'w-dir', scope: 'cmd', name: 'dir', aliases: [], summary: 'Lista los archivos y carpetas de la carpeta actual de Windows.', syntax: 'dir [ruta] [/a] [/s] [/b]', example: 'dir /b', notes: '/b muestra solo los nombres; /s incluye subcarpetas; /a muestra también archivos ocultos.' },
  { id: 'w-cd', scope: 'cmd', name: 'cd', aliases: ['chdir'], summary: 'Cambia de carpeta en Windows.', syntax: 'cd <carpeta> · cd .. · cd /d D:\\Proyectos', example: 'cd Documents\\BadDev', notes: 'Con comillas si el nombre lleva espacios: cd "Mis Proyectos". Para cambiar de disco usa «cd /d D:\\» o escribe «D:».' },
  { id: 'w-cls', scope: 'cmd', name: 'cls', aliases: ['clear'], summary: 'Limpia la pantalla.', syntax: 'cls', example: 'cls', notes: 'También sirve el atajo Ctrl+L.' },
  { id: 'w-type', scope: 'cmd', name: 'type', aliases: [], summary: 'Muestra el contenido de un archivo de texto.', syntax: 'type <archivo>', example: 'type package.json', notes: '' },
  { id: 'w-echo', scope: 'cmd', name: 'echo', aliases: [], summary: 'Escribe un texto. Con > guarda el texto en un archivo.', syntax: 'echo <texto> [> archivo]', example: 'echo Hola > saludo.txt', notes: '> sobrescribe el archivo; >> añade al final.' },
  { id: 'w-mkdir', scope: 'cmd', name: 'mkdir', aliases: ['md'], summary: 'Crea una carpeta.', syntax: 'mkdir <carpeta>', example: 'mkdir images', notes: '' },
  { id: 'w-copy', scope: 'cmd', name: 'copy', aliases: [], summary: 'Copia un archivo.', syntax: 'copy <origen> <destino>', example: 'copy index.html respaldo.html', notes: 'Para copiar carpetas completas usa xcopy o robocopy.' },
  { id: 'w-move', scope: 'cmd', name: 'move', aliases: [], summary: 'Mueve un archivo o carpeta a otro lugar.', syntax: 'move <origen> <destino>', example: 'move foto.png images', notes: 'Si el destino ya tiene un archivo con ese nombre, pregunta antes de sobrescribir.' },
  { id: 'w-ren', scope: 'cmd', name: 'ren', aliases: ['rename'], summary: 'Cambia el nombre de un archivo.', syntax: 'ren <nombre-actual> <nombre-nuevo>', example: 'ren viejo.html menu.html', notes: '' },
  { id: 'w-del', scope: 'cmd', name: 'del', aliases: ['erase'], summary: 'Borra archivos. NO usa la papelera.', syntax: 'del <archivo>', example: 'del prueba.txt', notes: '⚠ El borrado es definitivo. Revisa el nombre antes de pulsar Enter.' },
  { id: 'w-rmdir', scope: 'cmd', name: 'rmdir', aliases: ['rd'], summary: 'Borra una carpeta.', syntax: 'rmdir <carpeta> [/s]', example: 'rmdir viejo', notes: '⚠ Con /s borra también todo su contenido y no hay papelera.' },
  { id: 'w-tree', scope: 'cmd', name: 'tree', aliases: [], summary: 'Dibuja el árbol de carpetas.', syntax: 'tree [/f]', example: 'tree /f', notes: '/f incluye los archivos.' },
  { id: 'w-findstr', scope: 'cmd', name: 'findstr', aliases: [], summary: 'Busca un texto dentro de archivos.', syntax: 'findstr /s /i "<texto>" *.html', example: 'findstr /s /i "background" *.css', notes: '/s recorre subcarpetas; /i ignora mayúsculas.' },
  { id: 'w-where', scope: 'cmd', name: 'where', aliases: [], summary: 'Dice dónde está instalado un programa.', syntax: 'where <programa>', example: 'where node', notes: 'Si no responde nada, ese programa no está instalado o no está en el PATH.' },
  { id: 'w-set', scope: 'cmd', name: 'set', aliases: [], summary: 'Muestra las variables de entorno.', syntax: 'set [nombre]', example: 'set PATH', notes: '' },
  { id: 'w-whoami', scope: 'cmd', name: 'whoami', aliases: [], summary: 'Muestra el usuario de Windows actual.', syntax: 'whoami', example: 'whoami', notes: '' },
  { id: 'w-ipconfig', scope: 'cmd', name: 'ipconfig', aliases: [], summary: 'Muestra la configuración de red de tu equipo.', syntax: 'ipconfig [/all]', example: 'ipconfig', notes: '' },
  { id: 'w-ping', scope: 'cmd', name: 'ping', aliases: [], summary: 'Comprueba si hay conexión con un sitio.', syntax: 'ping <sitio> [-n veces]', example: 'ping -n 2 google.com', notes: 'Sin -n envía 4 pruebas en Windows.' },
  { id: 'w-tasklist', scope: 'cmd', name: 'tasklist', aliases: [], summary: 'Lista los programas en ejecución.', syntax: 'tasklist', example: 'tasklist', notes: '' },
  { id: 'w-taskkill', scope: 'cmd', name: 'taskkill', aliases: [], summary: 'Cierra un programa por su nombre o PID.', syntax: 'taskkill /im <programa.exe> [/f]', example: 'taskkill /im notepad.exe', notes: '⚠ /f fuerza el cierre y puedes perder trabajo sin guardar.' },
  { id: 'w-node', scope: 'cmd', name: 'node', aliases: [], summary: 'Ejecuta JavaScript con Node.js.', syntax: 'node <archivo.js> · node -v', example: 'node -v', notes: 'Necesita Node.js instalado.' },
  { id: 'w-npm', scope: 'cmd', name: 'npm', aliases: [], summary: 'Instala paquetes y ejecuta scripts de un proyecto Node.', syntax: 'npm install · npm run <script>', example: 'npm run dev', notes: 'Los scripts de BadDev son dev, build, desktop:dev y desktop:build.' },
  { id: 'w-git', scope: 'cmd', name: 'git', aliases: [], summary: 'Control de versiones y subida del proyecto a GitHub.', syntax: 'git status · git add . · git commit -m "mensaje" · git push', example: 'git status', notes: 'Necesita Git instalado. «git status» es seguro: solo muestra qué cambió.' },
  { id: 'w-python', scope: 'cmd', name: 'python', aliases: ['py'], summary: 'Ejecuta Python instalado en Windows.', syntax: 'python <archivo.py> · python --version', example: 'python --version', notes: 'Los programas que piden input() no son interactivos aquí si no envías la línea con Enter mientras corren.' },
  { id: 'w-code', scope: 'cmd', name: 'start', aliases: [], summary: 'Abre un archivo o carpeta con el programa de Windows asociado.', syntax: 'start <archivo o carpeta>', example: 'start .', notes: '«start .» abre la carpeta actual en el Explorador.' }
]);

export function docsFor(scope) { return COMMAND_DOCS.filter(doc => doc.scope === scope); }
export function findDoc(name, preferredScope = 'baddev') {
  const key = String(name || '').toLowerCase();
  const match = (doc) => doc.name === key || doc.aliases.includes(key);
  return COMMAND_DOCS.find(doc => doc.scope === preferredScope && match(doc)) || COMMAND_DOCS.find(match) || null;
}

const SCOPE_LABEL = { baddev: 'Comando de BadDev (funciona en web y .exe)', cmd: 'Comando real de Windows (pestaña CMD REAL, solo .exe)' };
export function explainLines(name, preferredScope = 'baddev') {
  const doc = findDoc(name, preferredScope);
  if (!doc) {
    const near = COMMAND_DOCS.filter(d => d.name.startsWith(String(name).toLowerCase().slice(0, 2))).map(d => d.name);
    return [{ kind: 'err', text: `No hay ayuda para «${name}».` }, ...(near.length ? [{ kind: 'dim', text: `¿Quisiste decir: ${[...new Set(near)].slice(0, 8).join(', ')}?` }] : [])];
  }
  const lines = [
    { kind: 'head', text: `${doc.name.toUpperCase()}${doc.aliases.length ? `  (también: ${doc.aliases.join(', ')})` : ''}` },
    { kind: 'dim', text: SCOPE_LABEL[doc.scope] },
    { kind: 'out', text: doc.summary },
    { kind: 'info', text: `Uso:      ${doc.syntax}` },
    { kind: 'info', text: `Ejemplo:  ${doc.example}` }
  ];
  if (doc.notes) lines.push({ kind: doc.notes.startsWith('⚠') ? 'warn' : 'dim', text: doc.notes });
  return lines;
}
export function helpListLines(scope) {
  const docs = docsFor(scope);
  const width = Math.max(...docs.map(d => d.name.length)) + 2;
  const lines = [{ kind: 'head', text: scope === 'baddev' ? 'COMANDOS DE BADDEV' : 'COMANDOS REALES DE WINDOWS (explicados)' }];
  for (const doc of docs) lines.push({ kind: 'out', text: `${doc.name.padEnd(width)}${doc.summary}` });
  lines.push({ kind: 'dim', text: scope === 'baddev'
    ? 'Escribe «ayuda <comando>» para ver uso y ejemplo. Tab completa nombres de comandos y archivos. Flecha arriba repite comandos.'
    : 'Esto es una guía: escribe «ayuda <comando>» para ver uso y ejemplo. Los comandos se ejecutan de verdad en tu equipo.' });
  return lines;
}

export function tokenize(line) {
  const tokens = [];
  const pattern = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let match;
  while ((match = pattern.exec(line))) tokens.push(match[1] ?? match[2] ?? match[3]);
  return tokens;
}
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
const byteLength = (text = '') => new TextEncoder().encode(text).length;
const IMAGE_EXT = /\.(?:png|jpe?g|gif|webp|svg|bmp|ico|avif)$/i;
const PREVIEW_EXT = /\.(?:html?|md|json|ts)$/i;

export function createBadDevShell(ctx) {
  let cwd = '';
  const out = (...texts) => ({ lines: texts.map(text => ({ kind: 'out', text })) });
  const err = (text) => ({ lines: [{ kind: 'err', text }] });
  const ok = (text) => ({ lines: [{ kind: 'ok', text }] });

  function resolvePath(arg = '') {
    const clean = String(arg).replace(/\\/g, '/');
    const parts = clean.startsWith('/') || !cwd ? [] : cwd.split('/');
    for (const segment of clean.split('/')) {
      if (!segment || segment === '.') continue;
      if (segment === '..') { if (!parts.length) return null; parts.pop(); } else parts.push(segment);
    }
    return parts.join('/');
  }
  const entries = () => [
    ...ctx.files().map(f => ({ name: f.name, kind: IMAGE_EXT.test(f.name) ? 'img' : 'file', size: byteLength(f.content), file: f })),
    ...ctx.assets().map(a => ({ name: a.name, kind: 'img', size: a.size }))
  ];
  const sameName = (a, b) => a.toLowerCase() === b.toLowerCase();
  function dirExists(path) { return path === '' || entries().some(e => e.name.toLowerCase().startsWith(`${path.toLowerCase()}/`)); }
  function listDir(path) {
    const prefix = path ? `${path}/` : '';
    const result = new Map();
    for (const entry of entries()) {
      if (!entry.name.toLowerCase().startsWith(prefix.toLowerCase())) continue;
      const rest = entry.name.slice(prefix.length);
      const segment = rest.split('/')[0];
      if (rest.includes('/')) { if (!result.has(`${segment}/`)) result.set(`${segment}/`, { name: segment, kind: 'dir' }); }
      else result.set(rest, { name: rest, kind: entry.kind, size: entry.size });
    }
    return [...result.values()].sort((a, b) => (a.kind === 'dir') !== (b.kind === 'dir') ? (a.kind === 'dir' ? -1 : 1) : a.name.localeCompare(b.name, 'es'));
  }
  // Localiza un archivo por ruta exacta o por nombre único en todo el proyecto.
  function locate(arg) {
    const path = resolvePath(arg);
    if (path === null) return { error: `La ruta «${arg}» sale del proyecto.` };
    const exact = entries().find(e => sameName(e.name, path));
    if (exact) return { entry: exact };
    const base = String(arg).replace(/\\/g, '/').split('/').pop().toLowerCase();
    const candidates = entries().filter(e => e.name.split('/').pop().toLowerCase() === base);
    if (candidates.length === 1) return { entry: candidates[0] };
    if (candidates.length > 1) return { error: `Hay varios «${base}»: ${candidates.map(c => c.name).join(', ')}. Escribe la ruta completa.` };
    return { error: `No existe «${arg}» en el proyecto. Prueba con «ls» o «tree».` };
  }
  const needArg = (args, usage) => (args.length ? null : err(`Falta un argumento. Uso: ${usage}`));
  const textFile = (arg) => {
    const found = locate(arg);
    if (found.error) return { fail: err(found.error) };
    if (found.entry.kind === 'img' || !found.entry.file) return { fail: err(`«${found.entry.name}» es una imagen: no se puede mostrar como texto.`) };
    return { file: found.entry.file };
  };

  const handlers = {
    ayuda: (args) => ({ lines: args.length ? explainLines(args[0], 'baddev') : helpListLines('baddev') }),
    ls: (args) => {
      const path = args[0] ? resolvePath(args[0]) : cwd;
      if (path === null || !dirExists(path)) return err(`No existe la carpeta «${args[0]}».`);
      const items = listDir(path);
      if (!items.length) return { lines: [{ kind: 'dim', text: '(vacío)' }] };
      return { lines: items.map(item => item.kind === 'dir' ? { kind: 'dir', text: `📁 ${item.name}/` }
        : { kind: item.kind === 'img' ? 'img' : 'out', text: `${item.kind === 'img' ? '🖼' : '📄'} ${item.name.padEnd(30)} ${formatBytes(item.size)}` }) };
    },
    tree: (args) => {
      const root = args[0] ? resolvePath(args[0]) : cwd;
      if (root === null || !dirExists(root)) return err(`No existe la carpeta «${args[0]}».`);
      const lines = [{ kind: 'dir', text: `📁 ${root || ctx.projectName()}` }];
      const walk = (path, prefix) => {
        const items = listDir(path);
        items.forEach((item, index) => {
          if (lines.length > 300) return;
          const last = index === items.length - 1;
          lines.push({ kind: item.kind === 'dir' ? 'dir' : item.kind === 'img' ? 'img' : 'out', text: `${prefix}${last ? '└── ' : '├── '}${item.name}${item.kind === 'dir' ? '/' : ''}` });
          if (item.kind === 'dir') walk(path ? `${path}/${item.name}` : item.name, `${prefix}${last ? '    ' : '│   '}`);
        });
      };
      walk(root, '');
      if (lines.length > 300) lines.push({ kind: 'dim', text: '… (árbol recortado)' });
      return { lines };
    },
    cd: (args) => {
      if (!args.length) return out(cwd ? `/${cwd}` : '/');
      const path = resolvePath(args[0]);
      if (path === null) return err('No se puede subir más allá de la raíz del proyecto.');
      if (!dirExists(path)) return err(`No existe la carpeta «${args[0]}».`);
      cwd = path;
      return { lines: [] };
    },
    pwd: () => out(cwd ? `/${cwd}` : '/'),
    cat: (args) => {
      const miss = needArg(args, 'cat <archivo>'); if (miss) return miss;
      const { file, fail } = textFile(args[0]); if (fail) return fail;
      const all = file.content.replace(/\r/g, '').split('\n');
      const lines = all.slice(0, 400).map((text, i) => ({ kind: 'out', text: `${String(i + 1).padStart(4)}  ${text}` }));
      if (all.length > 400) lines.push({ kind: 'dim', text: `… ${all.length - 400} línea(s) más. Usa «abrir ${file.name}» para verlas en el editor.` });
      return { lines };
    },
    head: (args) => {
      const miss = needArg(args, 'head <archivo> [líneas]'); if (miss) return miss;
      const { file, fail } = textFile(args[0]); if (fail) return fail;
      const count = Math.max(1, Math.min(200, Number.parseInt(args[1], 10) || 10));
      return { lines: file.content.replace(/\r/g, '').split('\n').slice(0, count).map(text => ({ kind: 'out', text })) };
    },
    wc: (args) => {
      const miss = needArg(args, 'wc <archivo>'); if (miss) return miss;
      const { file, fail } = textFile(args[0]); if (fail) return fail;
      const text = file.content;
      const lines = text.length ? text.replace(/\r/g, '').split('\n').length : 0;
      const words = (text.trim().match(/\S+/g) || []).length;
      return out(`${file.name}: ${lines} línea(s), ${words} palabra(s), ${text.length} carácter(es)`);
    },
    abrir: (args) => {
      const miss = needArg(args, 'abrir <archivo>'); if (miss) return miss;
      const found = locate(args[0]);
      if (found.error) return err(found.error);
      if (!found.entry.file || found.entry.kind === 'img') return err(`«${found.entry.name}» es una imagen; se ve en la vista previa, no en el editor.`);
      return ctx.openFile(found.entry.name) ? ok(`Abierto: ${found.entry.name}`) : err('No se pudo abrir el archivo.');
    },
    nuevo: (args) => {
      const miss = needArg(args, 'nuevo <nombre.ext>'); if (miss) return miss;
      const path = resolvePath(args[0]);
      if (path === null || !path) return err('Nombre o ruta no válidos.');
      const result = ctx.createFile(path);
      return result.ok ? ok(`Creado: ${result.name}`) : err(result.error || 'No se pudo crear el archivo.');
    },
    buscar: (args, raw) => {
      const needle = (raw || args.join(' ')).trim().toLowerCase();
      if (!needle) return err('Falta un texto. Uso: buscar <texto>');
      const lines = [];
      let total = 0;
      for (const file of ctx.files()) {
        file.content.replace(/\r/g, '').split('\n').forEach((text, index) => {
          if (!text.toLowerCase().includes(needle)) return;
          total++;
          if (lines.length < 60) lines.push({ kind: 'out', text: `${file.name}:${index + 1}: ${text.trim().slice(0, 120)}` });
        });
      }
      if (!total) return { lines: [{ kind: 'dim', text: `Sin resultados para «${needle}».` }] };
      lines.push({ kind: 'ok', text: `${total} coincidencia(s)${total > 60 ? ' (se muestran 60)' : ''}.` });
      return { lines };
    },
    vista: (args) => {
      if (!args.length) return ctx.previewShow('') ? ok('Vista previa abierta.') : err('No hay nada que previsualizar.');
      const found = locate(args[0]);
      if (found.error) return err(found.error);
      if (!PREVIEW_EXT.test(found.entry.name)) return err(`«${found.entry.name}» no se puede mostrar en la vista previa (solo HTML, Markdown, JSON y TypeScript).`);
      return ctx.previewShow(found.entry.name) ? ok(`Vista previa: ${found.entry.name}`) : err('No se pudo abrir la vista previa.');
    },
    python: async (args) => {
      const miss = needArg(args, 'python <archivo.py>'); if (miss) return miss;
      const found = locate(args[0]);
      if (found.error) return err(found.error);
      if (!/\.py$/i.test(found.entry.name)) return err('Solo se pueden ejecutar archivos .py.');
      await ctx.runPython(found.entry.name);
      return ok(`Ejecutando ${found.entry.name}. La salida aparece en el panel de Python.`);
    },
    guardar: async () => { await ctx.save(); return ok('Guardado solicitado para el archivo activo.'); },
    zip: () => { ctx.exportZip(); return ok('Descarga del ZIP solicitada.'); },
    tema: (args) => {
      if (!args.length) return { lines: [{ kind: 'head', text: 'TEMAS' }, ...Object.entries(THEME_LABELS).map(([key, label]) => ({ kind: key === ctx.getTheme() ? 'ok' : 'out', text: `${key === ctx.getTheme() ? '● ' : '  '}${label}` })), { kind: 'dim', text: 'Uso: tema <demon | inferno | toxic | angelical | slayer>' }] };
      const key = THEME_ALIASES[args[0].toLowerCase()];
      if (!key) return err(`No conozco el tema «${args[0]}». Escribe «tema» para ver la lista.`);
      ctx.setTheme(key);
      return ok(`Tema: ${THEME_LABELS[key]}`);
    },
    imagenes: () => {
      const images = ctx.assets();
      if (!images.length) return { lines: [{ kind: 'dim', text: 'No hay imágenes. Abre una carpeta de proyecto (botón Carpeta) que contenga una carpeta con imágenes.' }] };
      const total = images.reduce((sum, image) => sum + image.size, 0);
      return { lines: [...images.map(image => ({ kind: 'img', text: `🖼 ${image.name.padEnd(34)} ${formatBytes(image.size)}` })), { kind: 'ok', text: `${images.length} imagen(es), ${formatBytes(total)} en total.` }] };
    },
    proyecto: () => out(
      `Proyecto: ${ctx.projectName()}`,
      `Archivos: ${ctx.files().length}   Imágenes: ${ctx.assets().length}`,
      `Carpeta actual: /${cwd}`,
      `Tema: ${THEME_LABELS[ctx.getTheme()] || ctx.getTheme()}   ·   BadDev ${ctx.version()}`
    ),
    version: () => out(`BadDev ${ctx.version()} — Code without mercy.`),
    echo: (args, raw) => out(raw ?? args.join(' ')),
    fecha: () => out(new Date().toLocaleString('es')),
    limpiar: () => ({ lines: [], clear: true }),
    cmd: () => (ctx.isDesktop() ? { lines: [{ kind: 'info', text: 'Cambiando a CMD REAL…' }], switchTo: 'cmd' } : err('La terminal real de Windows solo existe en la app de escritorio (.exe). Aquí usa los comandos de BadDev: escribe «ayuda».')),
    salir: () => ({ lines: [], close: true }),
    mercy: () => ({ lines: [{ kind: 'err', text: 'No mercy.' }, { kind: 'dim', text: 'Escribe código, rómpelo, arréglalo. Repite.' }] })
  };
  const aliasToId = new Map();
  for (const doc of docsFor('baddev')) { aliasToId.set(doc.name, doc.id); doc.aliases.forEach(alias => aliasToId.set(alias, doc.id)); }
  const idToHandler = { ayuda: 'ayuda', ls: 'ls', tree: 'tree', cd: 'cd', pwd: 'pwd', cat: 'cat', head: 'head', wc: 'wc', abrir: 'abrir', nuevo: 'nuevo', buscar: 'buscar', vista: 'vista', python: 'python', guardar: 'guardar', zip: 'zip', tema: 'tema', imagenes: 'imagenes', proyecto: 'proyecto', version: 'version', echo: 'echo', fecha: 'fecha', limpiar: 'limpiar', cmd: 'cmd', salir: 'salir', mercy: 'mercy' };

  async function run(line) {
    const text = String(line || '').trim();
    if (!text) return { lines: [] };
    const tokens = tokenize(text);
    const name = tokens[0].toLowerCase();
    const id = aliasToId.get(name);
    if (!id) {
      const near = [...aliasToId.keys()].filter(key => key.startsWith(name.slice(0, 2)) && key !== name).slice(0, 5);
      return { lines: [{ kind: 'err', text: `Comando desconocido: «${tokens[0]}». Escribe «ayuda» para ver la lista.` }, ...(near.length ? [{ kind: 'dim', text: `Quizá quisiste: ${near.join(', ')}` }] : [])] };
    }
    const rawArgs = text.slice(tokens[0].length).trim();
    try { return await handlers[idToHandler[id]](tokens.slice(1), rawArgs); }
    catch (error) { return err(`Error al ejecutar «${tokens[0]}»: ${error.message}`); }
  }

  function complete(line) {
    const trailing = /\s$/.test(line);
    const tokens = tokenize(line);
    if (!tokens.length || (tokens.length === 1 && !trailing)) {
      const prefix = (tokens[0] || '').toLowerCase();
      const options = [...aliasToId.keys()].filter(key => key.startsWith(prefix)).sort();
      return finish(options, '', prefix, line);
    }
    const partial = trailing ? '' : tokens.at(-1);
    const normalized = partial.replace(/\\/g, '/');
    const slash = normalized.lastIndexOf('/');
    const dirPart = slash >= 0 ? normalized.slice(0, slash + 1) : '';
    const namePart = normalized.slice(slash + 1).toLowerCase();
    const dirPath = resolvePath(dirPart || '.');
    if (dirPath === null) return { line, options: [] };
    const options = listDir(dirPath).filter(item => item.name.toLowerCase().startsWith(namePart)).map(item => `${dirPart}${item.name}${item.kind === 'dir' ? '/' : ''}`);
    const head = line.slice(0, trailing ? line.length : line.length - partial.length);
    return finish(options, head, partial, line);
  }
  function finish(options, head, partial, line) {
    if (!options.length) return { line, options: [] };
    let common = options[0];
    for (const option of options) { while (!option.toLowerCase().startsWith(common.toLowerCase())) common = common.slice(0, -1); }
    const base = options.length === 1 ? (options[0].endsWith('/') ? options[0] : `${options[0]} `) : (common.length > partial.length ? common : partial);
    return { line: `${head}${base}`, options: options.length > 1 ? options : [] };
  }

  return { run, complete, get cwd() { return cwd; }, prompt: () => `baddev:/${cwd} ❯` };
}

// Quita secuencias ANSI (colores, cursor) de la salida de programas reales.
export function stripAnsi(text) {
  return String(text).replace(/\u001b\[[0-9;?]*[ -/]*[@-~]/g, '').replace(/\u001b\][^\u0007]*\u0007/g, '');
}
