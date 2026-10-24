import { languageInfo } from './learn-catalog.js';

/** Contenido introductorio honesto de Etapa D; las lecciones completas son de Etapa E. */
export function renderLanguageIntroduction(root, id, mode = 'manual') {
  const lang = languageInfo(id);
  if (!root || !lang) return false;
  root.replaceChildren();
  root.className = 'language-intro-page';
  root.style.setProperty('--lang-accent', lang.color);

  const outer = document.createElement('div');
  outer.className = 'language-intro-inner';
  const heading = document.createElement('header');
  heading.className = 'language-intro-heading';
  const marker = document.createElement('span');
  marker.className = 'small-tag';
  marker.textContent = mode === 'manual' ? `MANUAL / ${lang.name}` : `LECCIONES / ${lang.name}`;
  const h1 = document.createElement('h1');
  h1.textContent = mode === 'manual' ? `Leer ${lang.name}` : `Aprender ${lang.name}`;
  const summary = document.createElement('p');
  summary.textContent = lang.summary;
  heading.append(marker, h1, summary);

  const grid = document.createElement('div');
  grid.className = 'language-intro-grid';
  const textCard = document.createElement('section');
  textCard.className = 'language-intro-card';
  const theoryTitle = document.createElement('h2');
  theoryTitle.textContent = mode === 'manual' ? 'Primeros conceptos' : 'Tu punto de partida';
  const theory = document.createElement('p');
  theory.textContent = lang.note;
  const subhead = document.createElement('h3');
  subhead.textContent = 'Qué vas a estudiar';
  const list = document.createElement('ul');
  lang.concepts.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.append(li);
  });
  textCard.append(theoryTitle, theory, subhead, list);

  const codeCard = document.createElement('section');
  codeCard.className = 'language-intro-card language-intro-code-card';
  const top = document.createElement('div');
  top.className = 'language-intro-code-head';
  const codeTitle = document.createElement('span');
  codeTitle.textContent = `EJEMPLO / ${lang.ext}`;
  const copy = document.createElement('button');
  copy.className = 'small-button';
  copy.type = 'button';
  copy.textContent = 'Copiar código';
  const announce = document.createElement('p');
  announce.className = 'language-copy-status';
  announce.setAttribute('role', 'status');
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(lang.code); announce.textContent = 'Código copiado. Pégalo en un archivo de BadDev.'; }
    catch { announce.textContent = 'No se pudo copiar automáticamente. Selecciona el código y utiliza Ctrl + C.'; }
  });
  top.append(codeTitle, copy);
  const pre = document.createElement('pre');
  pre.className = 'code-example';
  const code = document.createElement('code');
  code.textContent = lang.code;
  pre.append(code);
  codeCard.append(top, pre, announce);
  grid.append(textCard, codeCard);

  const footer = document.createElement('div');
  footer.className = 'language-intro-footer';
  const note = document.createElement('p');
  note.textContent = mode === 'manual'
    ? 'Esta es una introducción de navegación de la Etapa D. La Etapa E añadirá un manual completo con sintaxis, buenas prácticas, errores frecuentes y glosario.'
    : 'Esta es la introducción de la Etapa D. Los ejercicios, pistas y soluciones para este lenguaje llegarán con los cursos completos de la Etapa E.';
  const switchMode = document.createElement('a');
  switchMode.className = 'button button-secondary';
  switchMode.href = mode === 'manual' ? `./lessons.html?lang=${encodeURIComponent(id)}` : `./manual.html?lang=${encodeURIComponent(id)}`;
  switchMode.textContent = mode === 'manual' ? 'Ver ruta de lecciones →' : 'Leer introducción teórica →';
  footer.append(note, switchMode);
  outer.append(heading, grid, footer);
  root.append(outer);
  return true;
}
