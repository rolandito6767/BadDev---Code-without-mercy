import { CATALOG, languageUrl } from './learn-catalog.js';
import { COMMAND_TRACK } from './command-course.js';

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
  // V 1.4 — extra: aprender los comandos de la terminal (no es un lenguaje, por eso va aparte).
  const extra = document.createElement('div');
  extra.className = 'learn-extra';
  const extraTitle = document.createElement('span');
  extraTitle.className = 'small-tag learn-extra-title';
  extraTitle.textContent = 'EXTRA / TERMINAL';
  const extraGrid = document.createElement('nav');
  extraGrid.className = 'learn-languages-grid learn-extra-grid';
  extraGrid.setAttribute('aria-label', 'Aprender comandos de la terminal');
  const cmdLink = document.createElement('a');
  cmdLink.className = 'learn-language-card learn-command-card';
  cmdLink.href = languageUrl(mode, COMMAND_TRACK.id);
  cmdLink.style.setProperty('--lang-accent', COMMAND_TRACK.color);
  const cmdIcon = document.createElement('span');
  cmdIcon.className = 'language-card-icon';
  cmdIcon.textContent = COMMAND_TRACK.icon;
  cmdIcon.setAttribute('aria-hidden', 'true');
  const cmdBody = document.createElement('span');
  cmdBody.className = 'language-card-body';
  const cmdTitle = document.createElement('strong');
  cmdTitle.textContent = mode === 'manual' ? 'Leer comandos' : 'Aprender comandos';
  const cmdDescription = document.createElement('span');
  cmdDescription.className = 'language-card-description';
  cmdDescription.textContent = 'Comandos propios de BadDev y comandos reales de CMD, explicados paso a paso.';
  const cmdExt = document.createElement('span');
  cmdExt.className = 'language-card-ext';
  cmdExt.textContent = COMMAND_TRACK.ext;
  cmdBody.append(cmdTitle, cmdDescription);
  cmdLink.append(cmdIcon, cmdBody, cmdExt);
  extraGrid.append(cmdLink);
  extra.append(extraTitle, extraGrid);
  root.append(top, grid, extra);
}
