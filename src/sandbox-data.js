import { LESSONS } from './learn-data.js';
import { findCourseLessonById } from './education-data.js';

const outerHtml = (body) => `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Práctica BadDev</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${body}
<script src="script.js"></script>
</body>
</html>`;
const starterStyle = `body { font-family: system-ui, sans-serif; background: #0e0e0e; color: #f5f5f5; padding: 32px; }
h1 { color: #ff1744; } button { padding: 10px 15px; border: 0; border-radius: 8px; cursor: pointer; }`;

export function sandboxForLesson(lessonId) {
  const result = findCourseLessonById(lessonId);
  const lesson = result?.lesson ?? LESSONS[0];
  if (result && !['html', 'css', 'js'].includes(result.languageId)) throw new Error('Este lenguaje aún no tiene ejecución en Sandbox.');
  const { language, code } = lesson.example;
  let html = outerHtml('<main><h1>Práctica BadDev</h1><p>Modifica el ejemplo y comprueba el resultado.</p><button id="saludar">Saludar</button><p id="resultado"></p></main>');
  let css = starterStyle;
  let js = '// Puedes practicar JavaScript aquí.\n';
  let file = 'index.html';
  if (language === 'html') {
    const isDocument = /<!doctype\s+html|<html\b/i.test(code);
    html = isDocument ? code : outerHtml(code);
    file = 'index.html';
  } else if (language === 'css') {
    css = code;
    file = 'style.css';
  } else if (language === 'js') {
    js = code;
    file = 'script.js';
    if (lesson.id === 'dom' || lesson.id === 'miniproyecto') {
      html = outerHtml('<main><h1>Prueba el botón</h1><button id="saludar">Saludar</button><p id="resultado">Sin clics todavía</p></main>');
      if (lesson.id === 'miniproyecto') js = `const boton = document.getElementById('saludar');\nconst resultado = document.getElementById('resultado');\n${code}`;
    }
  } else {
    // Un ejemplo de atajos no es ejecutable como código. Mostramos una guía en HTML.
    html = outerHtml(`<main><h1>Atajos de BadDev</h1><p>Este ejemplo es una referencia de teclado, no código ejecutable.</p><pre id="atajos"></pre></main>`);
    js = `document.getElementById('atajos').textContent = ${JSON.stringify(code)};`;
  }
  return {
    lessonId: lesson.id, title: lesson.title, selected: file,
    files: [
      { name: 'index.html', content: html },
      { name: 'style.css', content: css },
      { name: 'script.js', content: js }
    ]
  };
}

export function lessonUrl(id) {
  const record = findCourseLessonById(id);
  const lesson = record?.lesson || LESSONS[0];
  // Compatibilidad con los enlaces originales de Etapa D.
  if (lesson.id.startsWith('e-')) return `./lessons.html?lang=${encodeURIComponent(record.languageId)}#${encodeURIComponent(lesson.id)}`;
  return `./lessons.html#${encodeURIComponent(lesson.id)}`;
}
