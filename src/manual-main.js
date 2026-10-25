import { startLearnBoot } from './boot.js';
import { loadSettings } from './settings.js';
document.documentElement.dataset.theme = loadSettings().theme;
import './learn.css';
import packageInfo from '../package.json';
import { displayVersion } from './version.js';
import { MANUAL_SECTIONS } from './manual-data.js';
import { languageInfo } from './learn-catalog.js';
import { COURSE_MANUALS } from './education-data.js';
import { COMMAND_MANUAL } from './command-course.js';
import { renderLanguageChooser } from './learn-language-ui.js';
import { renderLanguageIntroduction } from './learn-language-intro.js';

const $ = id => document.getElementById(id);
let currentIndex = 0;
let sections = MANUAL_SECTIONS;

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
function makeNavigation() {
  const nav = $('manual-navigation');
  nav.replaceChildren();
  let lastGroup = '';
  for (const [index, section] of sections.entries()) {
    if (section.group !== lastGroup) {
      lastGroup = section.group;
      const heading = document.createElement('h3');
      heading.textContent = section.group;
      heading.className = 'manual-group-title';
      nav.append(heading);
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `lesson-link ${currentIndex === index ? 'active' : ''}`;
    button.dataset.section = String(index);
    button.setAttribute('aria-current', currentIndex === index ? 'page' : 'false');
    button.innerHTML = `<span class="nav-number">${String(index + 1).padStart(2,'0')}</span><span>${escapeHtml(section.title)}</span>`;
    nav.append(button);
  }
}
function render() {
  const section = sections[currentIndex];
  $('manual-section-tag').textContent = section.group.toUpperCase();
  $('previous-manual').disabled = currentIndex === 0;
  $('next-manual').textContent = currentIndex === sections.length - 1 ? 'Volver al inicio ↺' : 'Siguiente →';
  $('manual-article').innerHTML = `
    <div class="lesson-heading compact-heading">
      <span class="eyebrow">SECCIÓN ${String(currentIndex + 1).padStart(2,'0')} / ${sections.length}</span>
      <h1>${escapeHtml(section.title)}</h1>
      <p class="lesson-lede">${escapeHtml(section.subtitle)}</p>
    </div>
    <div class="manual-stack">
      <section class="content-card compact-card">
        <div class="section-label">TEORÍA</div>
        ${section.theory.map(text => `<p>${escapeHtml(text)}</p>`).join('')}
      </section>
      <section class="content-card compact-card">
        <div class="section-label">PUNTOS CLAVE</div>
        <ul class="simple-list">${section.bullets.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </section>
      <section class="content-card compact-card">
        <div class="section-label">EJEMPLO</div>
        <div class="code-title"><span>${escapeHtml(section.example.language.toUpperCase())} · Ejemplo</span></div>
        <pre class="code-example"><code>${escapeHtml(section.example.code)}</code></pre>
      </section>
      ${section.bestPractices?.length ? `<section class="content-card compact-card"><div class="section-label">BUENAS PRÁCTICAS</div><ul class="simple-list">${section.bestPractices.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul></section>` : ''}
      ${section.commonMistakes?.length ? `<section class="content-card compact-card"><div class="section-label">ERRORES FRECUENTES</div><ul class="simple-list">${section.commonMistakes.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul></section>` : ''}
      ${section.glossary?.length ? `<section class="content-card compact-card"><div class="section-label">GLOSARIO</div><dl class="education-glossary">${section.glossary.map(item => `<dt>${escapeHtml(item.term)}</dt><dd>${escapeHtml(item.definition)}</dd>`).join('')}</dl></section>` : ''}
    </div>`;
}
function jump(index) {
  if (index < 0 || index >= sections.length) return;
  currentIndex = index;
  render();
  makeNavigation();
  $('manual-content').scrollTo({ top: 0, behavior: 'instant' });
  const locationUrl = new URL(window.location.href);
  locationUrl.hash = sections[index].id;
  history.replaceState(null, '', locationUrl.href);
}
$('manual-navigation').addEventListener('click', event => {
  const button = event.target.closest('[data-section]');
  if (button) jump(Number(button.dataset.section));
});
$('previous-manual').addEventListener('click', () => jump(currentIndex - 1));
$('next-manual').addEventListener('click', () => jump(currentIndex === sections.length - 1 ? 0 : currentIndex + 1));
const version = displayVersion(packageInfo.version);
$('manual-version').textContent = version;
$('manual-footer-version').textContent = version;
renderLanguageChooser($('language-chooser'), 'manual');
const selectedLanguage = new URLSearchParams(window.location.search).get('lang');
if (languageInfo(selectedLanguage)) {
  $('language-chooser').hidden = true;
  $('language-back').hidden = false;
  const lang = languageInfo(selectedLanguage);
  sections = selectedLanguage === 'cmd' ? [...COMMAND_MANUAL] : COURSE_MANUALS[selectedLanguage];
  $('course-layout').hidden = false;
  const heading = document.querySelector('.route-heading h2');
  if (heading) heading.textContent = selectedLanguage === 'cmd' ? 'Manual de comandos' : `Manual de ${lang.name}`;
  const sectionHash = decodeURIComponent(location.hash.slice(1));
  currentIndex = Math.max(0, sections.findIndex(item => item.id === sectionHash));
  makeNavigation();
  render();
}
startLearnBoot({ duration: 3450 });
