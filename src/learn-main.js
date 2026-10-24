import { startLearnBoot } from './boot.js';
import { loadSettings } from './settings.js';
document.documentElement.dataset.theme = loadSettings().theme;
import './learn.css';
import packageInfo from '../package.json';
import { displayVersion } from './version.js';
import { LESSONS } from './learn-data.js';
import { languageInfo, languageForLessonId } from './learn-catalog.js';
import { COURSE_LESSONS, findCourseLessonById } from './education-data.js';
import { checkEducationCode } from './education-checks.js';
import { renderLanguageChooser } from './learn-language-ui.js';
import { renderLanguageIntroduction } from './learn-language-intro.js';
import { checkChoice, checkCode } from './learn-checks.js';

const $ = (id) => document.getElementById(id);
const STORE = 'baddev-learn-progress-v2';
let currentIndex = 0;
let selectedChoice = null;
let toastTimer;
let completed = new Set();
let courseLessons = LESSONS;
const ALL_LESSON_IDS = new Set(Object.values(COURSE_LESSONS).flat().map(lesson => lesson.id));
let selectedLanguage = null;

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE));
    if (Array.isArray(saved)) completed = new Set(saved.filter(id => ALL_LESSON_IDS.has(id)));
  } catch { completed = new Set(); }
}
function persistProgress() {
  try { localStorage.setItem(STORE, JSON.stringify([...completed])); }
  catch { notify('No se pudo guardar el progreso en este navegador.'); }
}
function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
function notify(message) {
  clearTimeout(toastTimer);
  const el = $('learn-toast');
  el.textContent = message;
  el.classList.add('visible');
  toastTimer = setTimeout(() => el.classList.remove('visible'), 3400);
}
function makeNavigation() {
  const nav = $('learn-navigation');
  nav.replaceChildren();
  for (const group of [...new Set(courseLessons.map(item => item.group))]) {
    const block = document.createElement('div');
    block.className = 'nav-group';
    const heading = document.createElement('h3');
    heading.textContent = group;
    block.append(heading);
    for (const lesson of courseLessons.filter(item => item.group === group)) {
      const index = courseLessons.indexOf(lesson);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `lesson-link ${currentIndex === index ? 'active' : ''}`;
      button.dataset.lesson = String(index);
      button.setAttribute('aria-current', currentIndex === index ? 'step' : 'false');
      const number = document.createElement('span');
      number.className = 'nav-number';
      number.textContent = completed.has(lesson.id) ? '✓' : String(index + 1).padStart(2, '0');
      const label = document.createElement('span');
      label.textContent = lesson.title;
      button.append(number, label);
      block.append(button);
    }
    nav.append(block);
  }
}
function renderProgress() {
  const done = courseLessons.filter(item => completed.has(item.id)).length;
  const total = courseLessons.length;
  $('progress-count').textContent = `${done}/${total}`;
  $('progress-track').setAttribute('aria-valuenow', String(done));
  $('progress-track').setAttribute('aria-valuemax', String(total));
  $('progress-fill').style.width = `${100 * done / total}%`;
}
function jump(index) {
  if (index < 0 || index >= courseLessons.length) return;
  currentIndex = index;
  selectedChoice = null;
  renderLesson();
  makeNavigation();
  $('lesson-content').scrollTo({ top: 0, behavior: 'instant' });
  const url = new URL(window.location.href);
  url.hash = courseLessons[index].id;
  history.replaceState(null, '', url.href);
}
function markComplete() {
  const id = courseLessons[currentIndex].id;
  if (!completed.has(id)) {
    completed.add(id);
    persistProgress();
  }
  renderProgress();
  makeNavigation();
  const feedback = $('feedback');
  feedback.classList.remove('feedback-error');
  feedback.classList.add('feedback-success');
  $('check-answer').disabled = true;
}
function renderLesson() {
  const lesson = courseLessons[currentIndex];
  const challenge = lesson.challenge;
  const already = completed.has(lesson.id);
  $('section-tag').textContent = lesson.group.toUpperCase();
  $('previous-lesson').disabled = currentIndex === 0;
  $('next-lesson').textContent = currentIndex === courseLessons.length - 1 ? 'Volver al inicio ↺' : 'Siguiente →';
  const challengeInput = challenge.type === 'choice'
    ? `<div class="answer-choices" role="group" aria-label="Respuestas posibles">${challenge.choices.map((choice, i) =>
        `<button type="button" class="choice-button" data-choice="${i}" aria-pressed="false"><span>${String.fromCharCode(65 + i)}</span>${escapeHtml(choice)}</button>`
      ).join('')}</div>`
    : `<label class="code-label" for="student-code">Escribe tu solución</label>
       <textarea id="student-code" rows="6" spellcheck="false" autocapitalize="off" autocomplete="off" aria-describedby="validation-note">${escapeHtml(challenge.starter || '')}</textarea>
       <p id="validation-note" class="validation-note">La revisión reconoce estructuras básicas. No ejecuta tu código.</p>`;

  const difficulty = currentIndex < 4 ? 'PRINCIPIANTE' : currentIndex < 9 ? 'INTERMEDIO' : 'PRÁCTICA';
  const shortParagraphs = lesson.paragraphs.slice(0, 2);
  const shortTips = lesson.tips.slice(0, 3);
  const supportsSandbox = ['html', 'css', 'js'].includes(selectedLanguage);
  const solution = lesson.solution || {};
  const resultSummary = lesson.summary || shortTips;
  $('lesson-article').innerHTML = `
    <div class="lesson-heading compact-heading">
      <span class="eyebrow">LECCIÓN ${String(currentIndex + 1).padStart(2, '0')} / ${courseLessons.length} · ${escapeHtml(lesson.time)} · ${difficulty}</span>
      <h1>${escapeHtml(lesson.title)}</h1>
      <p class="lesson-lede">${escapeHtml(lesson.subtitle)}</p>
      <span class="completion-tag" id="completion-tag">${already ? '✓ Lección completada' : 'Aprende · Prueba · Avanza'}</span>
      <p class="lesson-objective"><strong>Objetivo:</strong> ${escapeHtml(lesson.objective || lesson.subtitle)}</p>
    </div>
    <div class="manual-stack">
      <section class="content-card compact-card">
        <div class="section-label">IDEA CLAVE</div>
        ${shortParagraphs.map(text => `<p>${escapeHtml(text)}</p>`).join('')}
      </section>
      <section class="content-card compact-card">
        <div class="section-label">RECUERDA</div>
        <ul class="simple-list">${shortTips.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </section>
      <section class="content-card compact-card">
        <div class="section-label">EJEMPLO</div>
        <div class="code-title"><span>${escapeHtml(lesson.example.language.toUpperCase())} · Ejemplo</span><button type="button" class="small-button" id="copy-example">${supportsSandbox ? 'Copiar y probar en Sandbox ↗' : 'Copiar ejemplo'}</button></div>
        <pre class="code-example"><code>${escapeHtml(lesson.example.code)}</code></pre>
        <p class="example-note">${escapeHtml(lesson.example.note)}</p>
      </section>
      <section class="content-card compact-card practice-card">
        <div class="section-label">RETO</div>
        <p class="challenge-question">${escapeHtml(challenge.question)}</p>
        ${challengeInput}
        <div class="challenge-actions">
          <button type="button" class="button button-primary" id="check-answer" ${already ? 'disabled' : ''}>${already ? '✓ Completado' : 'Comprobar'}</button>
          <button type="button" class="small-button" id="show-hint" aria-expanded="false">Ver pista</button>
          ${supportsSandbox ? `<a class="small-button" href="./sandbox.html?lesson=${encodeURIComponent(courseLessons[currentIndex].id)}">Abrir Sandbox ↗</a>` : `<span class="language-practice-note">Este lenguaje se estudia aquí. BadDev no ejecuta ${escapeHtml(languageInfo(selectedLanguage)?.name || 'este código')} en Sandbox.</span>`}
        </div>
        <p class="hint-message" id="hint-message" hidden>${escapeHtml(challenge.hint)}</p>
        <p class="feedback ${already ? 'feedback-success' : ''}" id="feedback" role="status" aria-live="polite">${already ? `✓ Ya aprobaste este reto. ${escapeHtml(challenge.explanation)}` : 'Resuelve el reto para completar.'}</p>
      </section>
      <section class="content-card compact-card solution-card">
        <div class="section-label">SOLUCIÓN EXPLICADA</div>
        <button type="button" class="small-button" id="toggle-solution" aria-expanded="false" aria-controls="solution-detail">Mostrar solución</button>
        <div id="solution-detail" hidden>
          ${solution.answer ? `<p><strong>Respuesta:</strong> ${escapeHtml(solution.answer)}</p>` : ''}
          <pre class="code-example"><code>${escapeHtml(solution.code || lesson.example.code)}</code></pre>
          <p>${escapeHtml(solution.why || challenge.explanation)}</p>
        </div>
      </section>
      <section class="content-card compact-card summary-card">
        <div class="section-label">RESUMEN DE LA LECCIÓN</div>
        <ul class="simple-list">${resultSummary.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </section>
    </div>`;
}
function showFeedback(ok, message) {
  const feedback = $('feedback');
  feedback.textContent = message;
  feedback.classList.toggle('feedback-success', ok);
  feedback.classList.toggle('feedback-error', !ok);
}
function checkAnswer() {
  const lesson = courseLessons[currentIndex];
  const challenge = lesson.challenge;
  if (completed.has(lesson.id)) return;
  let result;
  if (challenge.type === 'choice') {
    result = selectedChoice === null
      ? { ok: false, message: 'Elige una respuesta primero.' }
      : { ok: checkChoice(selectedChoice, challenge.answer), message: checkChoice(selectedChoice, challenge.answer) ? `¡Correcto! ${challenge.explanation}` : 'Todavía no. Lee la idea clave y vuelve a intentarlo.' };
  } else {
    result = challenge.task?.startsWith('e-') ? checkEducationCode(challenge.task.slice(2), $('student-code')?.value || '') : checkCode(challenge.task, $('student-code')?.value || '');
    if (result.ok) result.message += ' ' + challenge.explanation;
  }
  showFeedback(result.ok, result.message);
  if (result.ok) {
    markComplete();
    $('completion-tag').textContent = '✓ Lección completada';
    $('check-answer').textContent = '✓ Completado';
  }
}
$('learn-navigation').addEventListener('click', event => {
  const button = event.target.closest('[data-lesson]');
  if (button) jump(Number(button.dataset.lesson));
});
$('lesson-article').addEventListener('click', async event => {
  const choice = event.target.closest('[data-choice]');
  if (choice) {
    selectedChoice = Number(choice.dataset.choice);
    document.querySelectorAll('.choice-button').forEach(btn => {
      const selected = btn === choice;
      btn.classList.toggle('is-selected', selected);
      btn.setAttribute('aria-pressed', String(selected));
    });
    return;
  }
  if (event.target.closest('#toggle-solution')) {
    const detail = $('solution-detail');
    const control = $('toggle-solution');
    detail.hidden = !detail.hidden;
    control.setAttribute('aria-expanded', String(!detail.hidden));
    control.textContent = detail.hidden ? 'Mostrar solución' : 'Ocultar solución';
    return;
  }
  if (event.target.closest('#check-answer')) { checkAnswer(); return; }
  if (event.target.closest('#show-hint')) {
    const hint = $('hint-message');
    hint.hidden = !hint.hidden;
    $('show-hint').setAttribute('aria-expanded', String(!hint.hidden));
    $('show-hint').textContent = hint.hidden ? 'Ver pista' : 'Ocultar pista';
    return;
  }
  if (event.target.closest('#copy-example')) {
    let copied = false;
    try { await navigator.clipboard.writeText(courseLessons[currentIndex].example.code); copied = true; }
    catch { notify('No se pudo copiar automáticamente. Selecciona el texto y usa Ctrl + C.'); }
    if (['html', 'css', 'js'].includes(selectedLanguage)) {
      // Los ejercicios web sí cuentan con Sandbox; los demás no simulan ejecución.
      window.location.assign(new URL(`sandbox.html?lesson=${encodeURIComponent(courseLessons[currentIndex].id)}`, window.location.href).href);
    } else if (copied) notify('Ejemplo copiado. Puedes pegarlo en un archivo de BadDev.');
  }
});
$('previous-lesson').addEventListener('click', () => jump(currentIndex - 1));
$('next-lesson').addEventListener('click', () => jump(currentIndex === courseLessons.length - 1 ? 0 : currentIndex + 1));
$('reset-progress').addEventListener('click', () => {
  if (!confirm(`¿Reiniciar el progreso de ${languageInfo(selectedLanguage)?.name || 'este curso'}? No borra tus proyectos.`)) return;
  for (const item of courseLessons) completed.delete(item.id);
  persistProgress();
  renderProgress();
  makeNavigation();
  renderLesson();
  notify('Progreso reiniciado.');
});

const version = displayVersion(packageInfo.version);
$('learn-version').textContent = version;
$('footer-version').textContent = version;
loadProgress();
renderLanguageChooser($('language-chooser'), 'lessons');
const firstHash = decodeURIComponent(location.hash.slice(1));
const explicitLanguage = new URLSearchParams(window.location.search).get('lang');
// Un regreso antiguo de Sandbox (lessons.html#dom) sigue abriendo la lección correcta.
selectedLanguage = explicitLanguage && languageInfo(explicitLanguage)
  ? explicitLanguage : (!explicitLanguage && firstHash ? (findCourseLessonById(firstHash)?.languageId || languageForLessonId(firstHash)) : null);
if (selectedLanguage) {
  $('language-chooser').hidden = true;
  $('language-back').hidden = false;
  const lang = languageInfo(selectedLanguage);
  courseLessons = COURSE_LESSONS[selectedLanguage];
  const initial = courseLessons.findIndex(item => item.id === firstHash);
  currentIndex = initial >= 0 ? initial : 0;
  $('course-layout').hidden = false;
  const heading = document.querySelector('.route-heading h2');
  if (heading) heading.textContent = `${lang.name} desde cero`;
  const reset = $('reset-progress');
  if (reset) reset.textContent = `Reiniciar progreso de ${lang.name}`;
  renderProgress();
  makeNavigation();
  renderLesson();
}
startLearnBoot({ duration: 3450 });
