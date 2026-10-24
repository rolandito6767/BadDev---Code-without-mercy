import { startLearnBoot } from './boot.js';
import { loadSettings } from './settings.js';
import './learn.css';
import packageInfo from '../package.json';
import { displayVersion } from './version.js';

document.documentElement.dataset.theme = loadSettings().theme;
const $ = id => document.getElementById(id);
const version = displayVersion(packageInfo.version);
$('learn-version').textContent = version;

startLearnBoot({ duration: 3450 });


const rainContainer = $('learn-code-rain');
const RAIN_CHARACTERS = ['01', '10', '101', '0', '1', '</>', '{}', 'const', '=>', 'if', ';', '<>', '0110'];
function dropCode() {
  if (!rainContainer || matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) return;
  if (rainContainer.childElementCount >= 16) return;
  const drop = document.createElement('span');
  drop.className = 'rain-bit';
  drop.textContent = RAIN_CHARACTERS[Math.floor(Math.random() * RAIN_CHARACTERS.length)];
  drop.style.left = `${5 + Math.random() * 90}%`;
  drop.style.animationDuration = `${7 + Math.random() * 5}s`;
  drop.style.fontSize = `${10 + Math.round(Math.random() * 4)}px`;
  drop.style.setProperty('--rain-duration', `${8 + Math.round(Math.random() * 6)}s`);
  drop.style.animationDelay = `${-Math.random() * 7}s`;
  rainContainer.append(drop);
  drop.addEventListener('animationend', () => drop.remove(), { once: true });
}
if (rainContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  for (let i = 0; i < 14; i++) dropCode();
  setInterval(dropCode, 1050);
}
