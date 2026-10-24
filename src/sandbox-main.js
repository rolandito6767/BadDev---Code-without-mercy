import { loadSettings } from './settings.js';
document.documentElement.dataset.theme = loadSettings().theme;
import './sandbox.css';
import packageInfo from '../package.json';
import { displayVersion } from './version.js';
import { createEditor } from './editor.js';
import { buildPreview } from './preview.js';
import { sandboxForLesson, lessonUrl } from './sandbox-data.js';

const $ = id => document.getElementById(id);
const params = new URLSearchParams(window.location.search);
const work = sandboxForLesson(params.get('lesson'));
const files = work.files;
const states = new Map();
let selected = work.selected;
let previewTimer;
let previewToken = '';
let diagnostics = [];

const back = lessonUrl(work.lessonId);
$('return-lesson').setAttribute('href', back);
$('footer-return').setAttribute('href', back);
$('sandbox-title').textContent = work.title;
$('sandbox-version').textContent = displayVersion(packageInfo.version);

const current = () => files.find(file => file.name === selected);
const { view, stateForFile } = createEditor($('sandbox-editor'), update => {
  if (!update.docChanged) return;
  current().content = update.state.doc.toString();
  states.set(selected, update.state);
  clearTimeout(previewTimer);
  previewTimer = setTimeout(refreshPreview, 350);
}, { fontSize: 14, tabSize: 2, wordWrap: true });

function changeFile(name) {
  if (!files.some(f => f.name === name)) return;
  states.set(selected, view.state);
  selected = name;
  view.setState(states.get(selected) || stateForFile(current()));
  document.querySelectorAll('[data-file]').forEach(button => {
    const isActive = button.dataset.file === selected;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });
  view.focus();
}
function renderDiagnostics() {
  const el = $('sandbox-errors');
  el.replaceChildren();
  if (!diagnostics.length) { el.textContent = 'Sin errores detectados.'; return; }
  for (const message of diagnostics.slice(0, 8)) {
    const line = document.createElement('span');
    line.textContent = message;
    el.append(line);
  }
}
async function refreshPreview() {
  diagnostics = [];
  previewToken = `sandbox-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  try {
    const result = await buildPreview(files, 'index.html', previewToken, { captureConsole: true });
    diagnostics = result.warnings.map(warning => `Aviso: ${warning}`);
    $('sandbox-frame').srcdoc = result.html;
  } catch (error) {
    $('sandbox-frame').removeAttribute('srcdoc');
    diagnostics = [String(error.message).slice(0, 400)];
  }
  renderDiagnostics();
}
window.addEventListener('message', event => {
  if (event.source !== $('sandbox-frame').contentWindow) return;
  const data = event.data;
  if (!data || typeof data !== 'object' || data.baddevPreview !== previewToken || !['error', 'log'].includes(data.type)) return;
  diagnostics.push(`${data.type === 'log' ? 'Consola' : 'Error'}: ${String(data.message).slice(0, 500)}`);
  renderDiagnostics();
});
document.querySelectorAll('[data-file]').forEach(button => {
  button.addEventListener('click', () => changeFile(button.dataset.file));
});
// El contenido de Sandbox existe únicamente en memoria mientras esta página está abierta.
// Si Chrome usa la caché de navegación, reiniciar impide recuperar ediciones descartadas.
window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
window.addEventListener('pagehide', () => {
  clearTimeout(previewTimer);
  for (const file of files) file.content = '';
  states.clear();
  $('sandbox-frame').removeAttribute('srcdoc');
});
changeFile(selected);
refreshPreview();
