import { CATALOG, languageUrl } from './learn-catalog.js';

/** Menú reutilizable para Lecciones y Manual. Es un conjunto de enlaces reales. */
export function renderLanguageChooser(root, mode = 'manual') {
  if (!root) throw new Error('Falta el contenedor del selector de lenguajes.');
  root.replaceChildren();
  root.className = 'learn-language-chooser';
  const top = document.createElement('div');
  top.className = 'language-chooser-top';
  const kicker = document.createElement('span');
  kicker.className = 'small-tag';
  kicker.textContent = mode === 'manual' ? 'BADDEV / MANUAL' : 'BADDEV / LECCIONES';
  const heading = document.createElement('h1');
  heading.textContent = mode === 'manual' ? '¿Qué quieres leer?' : '¿Qué quieres aprender?';
  const intro = document.createElement('p');
  intro.textContent = mode === 'manual'
    ? 'Selecciona un lenguaje para abrir su manual. Solo teoría y ejemplos, sin ejercicios.'
    : 'Elige un lenguaje: cada curso incluye teoría, ejemplos, ejercicios, pistas, soluciones y resúmenes. Tu progreso se guarda en este navegador.';
  top.append(kicker, heading, intro);
  const grid = document.createElement('nav');
  grid.className = 'learn-languages-grid';
  grid.setAttribute('aria-label', mode === 'manual' ? 'Manuales disponibles' : 'Lenguajes para aprender');
  CATALOG.forEach((item, index) => {
    const link = document.createElement('a');
    link.className = 'learn-language-card';
    link.href = languageUrl(mode, item.id);
    link.style.setProperty('--lang-accent', item.color);
    link.style.setProperty('--float-delay', `${(index % 4) * -.35}s`);
    const icon = document.createElement('span');
    icon.className = 'language-card-icon';
    icon.textContent = item.icon;
    icon.setAttribute('aria-hidden', 'true');
    const body = document.createElement('span');
    body.className = 'language-card-body';
    const title = document.createElement('strong');
    title.textContent = mode === 'manual' ? `Leer ${item.name}` : `Aprender ${item.name}`;
    const description = document.createElement('span');
    description.className = 'language-card-description';
    description.textContent = item.summary;
    const ext = document.createElement('span');
    ext.className = 'language-card-ext';
    ext.textContent = item.ext;
    body.append(title, description);
    link.append(icon, body, ext);
    grid.append(link);
  });
  root.append(top, grid);
}
