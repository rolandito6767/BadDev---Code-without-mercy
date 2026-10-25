// BadDev V 1.4 — Panel de terminal con dos pestañas:
//  · BADDEV: comandos propios (web y .exe) sobre los archivos del proyecto.
//  · CMD REAL: comandos reales de Windows, solo en la app de escritorio (Electron, vía preload).
import { createBadDevShell, explainLines, helpListLines, stripAnsi, tokenize } from './terminal-commands.js';

const MAX_LINES = 2000;
const NO_DESKTOP = 'La terminal real de Windows solo funciona en la app de escritorio (.exe). Aquí puedes aprender los comandos con «ayuda <comando>»; en la pestaña BADDEV puedes usar los comandos propios.';

export function initTerminal(ctx) {
  const $ = (id) => document.getElementById(id);
  const panel = $('terminal-panel');
  const body = $('terminal-body');
  const input = $('terminal-input');
  const promptEl = $('terminal-prompt');
  const cwdEl = $('terminal-cwd');
  const folderButton = $('terminal-folder');
  const tabButtons = [...panel.querySelectorAll('[data-term-tab]')];
  const desktop = window.baddevDesktop?.terminal || null;

  const shell = createBadDevShell({ ...ctx, isDesktop: () => Boolean(desktop) });
  const makeTab = (id) => {
    const el = document.createElement('div');
    el.className = 'terminal-output';
    el.setAttribute('role', 'log');
    el.hidden = true;
    body.append(el);
    return { id, el, history: [], cursor: 0, draft: '', open: null };
  };
  const tabs = { baddev: makeTab('baddev'), cmd: makeTab('cmd') };
  tabs.cmd.cwd = '';
  tabs.cmd.running = null;
  tabs.cmd.ready = false;
  let current = 'baddev';
  let seq = 0;
  let started = false;

  // ---------- salida ----------
  function addLine(tab, kind, text) {
    const line = document.createElement('div');
    line.className = `terminal-line kind-${kind}`;
    line.textContent = text;
    tab.el.append(line);
    if (tab.el.childElementCount > MAX_LINES) for (let i = 0; i < 200; i++) tab.el.firstElementChild?.remove();
    scrollDown(tab);
    return line;
  }
  function printLines(tab, lines) { for (const line of lines) addLine(tab, line.kind || 'out', line.text); }
  function scrollDown(tab) { tab.el.scrollTop = tab.el.scrollHeight; }
  function appendStream(tab, raw, kind) {
    const text = stripAnsi(raw).replace(/\r\n/g, '\n');
    text.split('\n').forEach((part, index) => {
      if (index > 0) tab.open = null;
      if (!part) return;
      part.split('\r').forEach((segment, j) => {
        if (j > 0 && tab.open) tab.open.textContent = '';
        if (!segment) return;
        if (!tab.open) tab.open = addLine(tab, kind, '');
        tab.open.textContent += segment;
      });
    });
    scrollDown(tab);
  }
  function clearTab(tab) { tab.el.replaceChildren(); tab.open = null; }

  // ---------- estado visual ----------
  function refreshPrompt() {
    if (current === 'baddev') { promptEl.textContent = shell.prompt(); cwdEl.textContent = `${ctx.projectName()} · /${shell.cwd}`; }
    else { promptEl.textContent = tabs.cmd.running ? '…' : (tabs.cmd.cwd ? `${tabs.cmd.cwd}>` : '>'); cwdEl.textContent = tabs.cmd.cwd || 'Windows'; }
    folderButton.hidden = !(current === 'cmd' && desktop);
    input.placeholder = current === 'baddev' ? 'Escribe un comando… (ayuda)' : (desktop ? 'Comando de Windows… (ayuda dir)' : 'Solo disponible en el .exe — prueba: ayuda dir');
  }
  function switchTab(id) {
    current = id;
    for (const button of tabButtons) {
      const active = button.dataset.termTab === id;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    }
    for (const [key, tab] of Object.entries(tabs)) tab.el.hidden = key !== id;
    if (id === 'cmd') startReal();
    refreshPrompt();
    scrollDown(tabs[id]);
    input.focus();
  }
  async function startReal() {
    const tab = tabs.cmd;
    if (tab.ready) return;
    tab.ready = true;
    if (!desktop) { printLines(tab, [{ kind: 'info', text: 'CMD REAL' }, { kind: 'warn', text: NO_DESKTOP }, { kind: 'dim', text: 'Escribe «ayuda» para ver los comandos de Windows explicados.' }]); return; }
    try {
      const info = await desktop.info();
      tab.cwd = info.cwd;
      printLines(tab, [
        { kind: 'info', text: 'CMD REAL — terminal de Windows dentro de BadDev' },
        { kind: 'warn', text: '⚠ Los comandos se ejecutan de verdad en tu equipo y con tus permisos. del y rmdir no usan la papelera.' },
        { kind: 'dim', text: `Carpeta inicial: ${tab.cwd}. Usa el botón ▣ para elegir la carpeta de tu proyecto.` },
        { kind: 'dim', text: 'No es una terminal interactiva completa: editores y asistentes que piden teclas especiales no funcionan. Ctrl+C detiene el comando. «ayuda <comando>» explica cualquier comando.' }
      ]);
      desktop.onEvent(onRealEvent);
    } catch (error) { printLines(tab, [{ kind: 'err', text: `No se pudo iniciar la terminal real: ${error.message}` }]); }
    refreshPrompt();
  }

  // ---------- CMD real ----------
  function onRealEvent(event) {
    const tab = tabs.cmd;
    if (!event || event.id !== tab.running) return;
    if (event.type === 'data') appendStream(tab, event.text, 'out');
    else if (event.type === 'error') { tab.open = null; addLine(tab, 'err', event.message); }
    else if (event.type === 'exit') {
      tab.open = null;
      if (event.code) addLine(tab, 'dim', `(terminó con código ${event.code})`);
      tab.running = null;
      refreshPrompt();
    }
  }
  async function realCd(line) {
    const tab = tabs.cmd;
    let target = line.replace(/^cd\b/i, '').trim().replace(/^\/d\s*/i, '').trim();
    if (/^[a-z]:$/i.test(line.trim())) target = `${line.trim()}\\`;
    if ((target.startsWith('"') && target.endsWith('"')) || (target.startsWith("'") && target.endsWith("'"))) target = target.slice(1, -1);
    if (!target) { addLine(tab, 'out', tab.cwd); return; }
    const result = await desktop.cd(tab.cwd, target);
    if (result.ok) { tab.cwd = result.cwd; refreshPrompt(); } else addLine(tab, 'err', result.error);
  }
  async function runReal(line) {
    const tab = tabs.cmd;
    const [first = ''] = tokenize(line);
    const lower = first.toLowerCase();
    if (lower === 'ayuda') { printLines(tab, tokenize(line).length > 1 ? explainLines(tokenize(line)[1], 'cmd') : helpListLines('cmd')); return; }
    if (['cls', 'clear', 'limpiar'].includes(lower)) { clearTab(tab); return; }
    if (lower === 'salir') { hide(); return; }
    if (!desktop) { printLines(tab, [{ kind: 'warn', text: NO_DESKTOP }]); return; }
    if (tab.running) { await desktop.write(tab.running, `${line}\n`); return; }
    if (/^cd(\s|$)/i.test(line) || /^[a-z]:$/i.test(line)) { await realCd(line); return; }
    const id = `t${Date.now().toString(36)}${++seq}`;
    tab.running = id;
    refreshPrompt();
    const result = await desktop.run(id, line, tab.cwd);
    if (!result.ok) { tab.running = null; addLine(tab, 'err', result.error || 'No se pudo ejecutar el comando.'); refreshPrompt(); }
  }

  // ---------- entrada ----------
  async function submit() {
    const tab = tabs[current];
    const line = input.value;
    input.value = '';
    const echoed = current === 'cmd' && tab.running ? line : `${promptEl.textContent} ${line}`;
    addLine(tab, 'cmdline', echoed);
    if (line.trim() && tab.history.at(-1) !== line) tab.history.push(line);
    tab.cursor = tab.history.length;
    tab.draft = '';
    if (!line.trim()) return;
    if (current === 'cmd') { await runReal(line); return; }
    const result = await shell.run(line);
    if (result.clear) clearTab(tab);
    printLines(tab, result.lines || []);
    refreshPrompt();
    if (result.switchTo) switchTab(result.switchTo);
    if (result.close) hide();
  }
  function recall(direction) {
    const tab = tabs[current];
    if (!tab.history.length) return;
    if (tab.cursor === tab.history.length) tab.draft = input.value;
    tab.cursor = Math.max(0, Math.min(tab.history.length, tab.cursor + direction));
    input.value = tab.cursor === tab.history.length ? tab.draft : tab.history[tab.cursor];
    requestAnimationFrame(() => input.setSelectionRange(input.value.length, input.value.length));
  }
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); submit(); return; }
    if (event.key === 'ArrowUp') { event.preventDefault(); recall(-1); return; }
    if (event.key === 'ArrowDown') { event.preventDefault(); recall(1); return; }
    if (event.key === 'Tab' && current === 'baddev') {
      event.preventDefault();
      const { line, options } = shell.complete(input.value);
      input.value = line;
      if (options.length) { addLine(tabs.baddev, 'dim', options.join('   ')); }
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') { event.preventDefault(); clearTab(tabs[current]); return; }
    if (event.ctrlKey && event.key.toLowerCase() === 'c' && input.selectionStart === input.selectionEnd) {
      event.preventDefault();
      const tab = tabs[current];
      if (current === 'cmd' && tab.running) { desktop.kill(tab.running); addLine(tab, 'dim', '^C'); }
      else { addLine(tab, 'dim', `${promptEl.textContent} ${input.value}^C`); input.value = ''; }
    }
  });
  tabButtons.forEach(button => button.addEventListener('click', () => switchTab(button.dataset.termTab)));
  $('terminal-clear').addEventListener('click', () => { clearTab(tabs[current]); input.focus(); });
  $('terminal-close').addEventListener('click', () => hide());
  folderButton.addEventListener('click', async () => {
    if (!desktop) return;
    const folder = await desktop.pickFolder();
    if (folder) { tabs.cmd.cwd = folder; addLine(tabs.cmd, 'dim', `Carpeta de trabajo: ${folder}`); refreshPrompt(); }
    input.focus();
  });
  panel.addEventListener('click', (event) => { if (!window.getSelection()?.toString() && !event.target.closest('button, input')) input.focus(); });

  // ---------- redimensionar ----------
  const resizer = $('terminal-resizer');
  resizer.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    const startY = event.clientY;
    const startHeight = panel.getBoundingClientRect().height;
    const limit = () => Math.max(160, Math.round((panel.parentElement?.getBoundingClientRect().height || 800) * 0.75));
    const move = (e) => panel.style.setProperty('--terminal-h', `${Math.max(120, Math.min(limit(), startHeight + (startY - e.clientY)))}px`);
    const stop = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
  });

  // ---------- mostrar / ocultar ----------
  function show() {
    panel.hidden = false;
    if (!started) {
      started = true;
      printLines(tabs.baddev, [
        { kind: 'head', text: `BADDEV TERMINAL · ${ctx.version()}` },
        { kind: 'dim', text: 'Escribe «ayuda» para ver los comandos. Tab completa, flecha arriba repite, Ctrl+L limpia.' },
        { kind: 'dim', text: desktop ? 'Pestaña CMD REAL: terminal de Windows dentro de BadDev.' : 'La terminal real de Windows está en la app de escritorio (.exe).' }
      ]);
    }
    switchTab(current);
    syncButtons();
  }
  function syncButtons() {
    document.querySelectorAll('[data-action="toggle-terminal"]').forEach(button => button.setAttribute('aria-pressed', String(!panel.hidden)));
    const item = document.getElementById('terminal-menu-item');
    if (item) item.textContent = panel.hidden ? 'Mostrar terminal (Ctrl+`)' : 'Ocultar terminal (Ctrl+`)';
  }
  function hide() { panel.hidden = true; syncButtons(); ctx.afterHide?.(); }
  function toggle() { if (panel.hidden) show(); else hide(); }
  window.addEventListener('beforeunload', () => { if (tabs.cmd.running && desktop) desktop.kill(tabs.cmd.running); });
  refreshPrompt();
  return { show, hide, toggle, isVisible: () => !panel.hidden, refresh: refreshPrompt };
}
