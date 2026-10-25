import './styles.css';
import { formatCode } from './formatter.js';
import { validateDocument, canValidate } from './diagnostics.js';
import { commentChanges } from './comment-tools.js';
import { foldCode, unfoldCode } from '@codemirror/language';
import { undo, redo } from '@codemirror/commands';
import { openSearchPanel } from '@codemirror/search';
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from './settings.js';
import { createEditor } from './editor.js';
import { chooseFiles, writeFile, fileLanguage, extensionOf, makeUniqueName, validFilename, STARTER_CODE } from './files.js';
import { languageForFile, languageForType, supportedFileName, indentSizeForFile } from './languages.js';
import { createStarterProject, readDirectory, resolveProjectReference, validProjectPath, PROJECT_TYPES, MAX_FILE_BYTES, MAX_PROJECT_FILES, writeProjectFile } from './project.js';
import { buildPreview, selectPreviewEntry, openDetachedPreview, previewableFiles } from './preview.js';
import { initTerminal } from './terminal.js';
import { buildAssetMap, setAssets, clearAssets, getAssets, assetCount, isImageName } from './assets.js';
import { makeZip, downloadBlob } from './zip.js';
import { readSession, writeSession, removeSession, SESSION_VERSION } from './session.js';
import packageInfo from '../package.json';
import { displayVersion } from './version.js';
import { unsavedFiles } from './lifecycle.js';
import { initSidebarTips } from './sidebar-tips.js';
import { createPythonRunner } from './python-runner.js';

const $ = (selector) => document.querySelector(selector);
const refs = {
  welcome: $('#welcome'), host: $('#editor-host'), tabs: $('#tabs'),
  list: $('#file-list'), sidebarEmpty: $('#empty-sidebar'), count: $('#file-count'),
  save: $('#status-save'), filename: $('#status-file'), pos: $('#status-pos'), lang: $('#status-lang'),
  toast: $('#toast'), newDialog: $('#new-file-dialog'), newForm: $('#new-file-form'),
  newType: $('#new-file-type'), newName: $('#new-file-name'), newHint: $('#new-file-hint'),
  infoDialog: $('#info-dialog'), infoTitle: $('#info-title'), infoContent: $('#info-content'),
  input: $('#native-file-input'), workspace: $('#workspace'), sideMenu: $('#sidebar-menu-item'),
  filter: $('#file-filter'), filterEmpty: $('#filter-empty'), sort: $('#sort-button'),
  renameDialog: $('#rename-dialog'), renameForm: $('#rename-form'), renameName: $('#rename-name'), renameHint: $('#rename-hint'),
  settingsDialog: $('#settings-dialog'), fontSize: $('#font-size'), fontValue: $('#font-value'), tabSize: $('#tab-size'), wordWrap: $('#word-wrap'),
  indent: $('#status-indent'), projectName: $('#project-name'), projectCloseButton: $('#project-close-button'),
  projectDialog: $('#new-project-dialog'), projectForm: $('#new-project-form'), projectInput: $('#new-project-name'), projectHint: $('#new-project-hint'),
  nativeFolderInput: $('#native-folder-input'), previewPanel: $('#preview-panel'), previewFrame: $('#preview-frame'),
  previewEntry: $('#preview-entry'), previewErrors: $('#preview-errors'), previewErrorCount: $('#preview-error-count'),
  previewMenuItem: $('#preview-menu-item'), splash: $('#startup-splash'), skipSplash: $('#skip-splash'),
  backupStatus: $('#backup-status'), sidebar: $('#sidebar'), previewButton: $('.top-preview'),
  versionChip: $('#version-chip'), statusVersion: $('#status-version'),
  theme: $('#theme-select'), previewSize: $('#preview-size'), previewAuto: $('#preview-auto'),
  unsavedDialog: $('#unsaved-dialog'), unsavedDescription: $('#unsaved-description'), unsavedError: $('#unsaved-error'),
  codeRain: $('#code-rain'), tip: $('#sidebar-tip'),
  diagnosticsDialog: $('#diagnostics-dialog'), diagnosticsName: $('#diagnostics-name'),
  diagnosticsList: $('#diagnostics-list'),
  pythonPanel: $('#python-panel'), pythonOutput: $('#python-output'), pythonStatus: $('#python-status'),
  pythonEngine: $('#python-engine'), pythonInput: $('#python-input'), pythonRun: $('#python-run'),
  pythonStop: $('#python-stop'), pythonHelp: $('#python-engine-help'), pythonQuickRun: $('#python-quick-run')
};

const files = [];
let activeId = null;
let nextId = 1;
let toastTimeout;
let renameId = null;
let sortByName = false;
let project = null; // { name, dirHandle } or null when editing loose files
let previewVisible = false;
let previewToken = '';
let previewErrorCount = 0;
let previewPreferredEntry = '';
let settings = loadSettings();
document.documentElement.dataset.theme = settings.theme;
let previewAutoTimer;
let sessionReady = false;
let backupTimer = null;
let backupQueue = Promise.resolve();
let lastBackupError = '';

const saving = new Set();
let returnToHome = true; // V 0.7: siempre iniciar en el menú, nunca restaurar automáticamente
let restoringSession = false;

function makeLearnProject(kind = 'starter') {
  const sampleProjects = {
    starter: {
      name: 'Práctica guiada BadDev',
      entries: [
        { name: 'index.html', content: `<!doctype html>\n<html lang="es">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Mi práctica BadDev</title>\n    <link rel="stylesheet" href="style.css" />\n  </head>\n  <body>\n    <main class="card">\n      <h1>Mi práctica en BadDev</h1>\n      <p>Edita este texto para presentarte.</p>\n      <button id="btnSaludo">Haz clic</button>\n      <p id="resultado">Aquí aparecerá un mensaje.</p>\n    </main>\n    <script src="script.js"></script>\n  </body>\n</html>` },
        { name: 'style.css', content: `body {\n  margin: 0;\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  background: #090909;\n  color: #f5f5f5;\n  font-family: Arial, sans-serif;\n}\n\n.card {\n  width: min(90vw, 460px);\n  padding: 24px;\n  border-radius: 18px;\n  background: #111111;\n  border: 1px solid #252525;\n  box-shadow: 0 0 24px rgba(217, 11, 43, 0.14);\n}\n\nbutton {\n  padding: 12px 16px;\n  border-radius: 12px;\n  border: 1px solid #790016;\n  background: #d90b2b;\n  color: white;\n  cursor: pointer;\n}` },
        { name: 'script.js', content: `const boton = document.getElementById('btnSaludo');\nconst resultado = document.getElementById('resultado');\n\nboton.addEventListener('click', () => {\n  resultado.textContent = '¡Tu JavaScript ya está funcionando!';\n});` }
      ]
    },
    html: {
      name: 'Ejemplo HTML básico',
      entries: [
        { name: 'index.html', content: `<!doctype html>\n<html lang="es">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Ejemplo HTML</title>\n  </head>\n  <body>\n    <main>\n      <h1>Hola, BadDev</h1>\n      <p>Mi primera página.</p>\n      <button class="boton-guardar">Guardar</button>\n    </main>\n  </body>\n</html>` },
        { name: 'style.css', content: `/* Puedes crear estilos aquí. */` },
        { name: 'script.js', content: `// Puedes agregar interactividad aquí.` }
      ]
    },
    css: {
      name: 'Ejemplo CSS básico',
      entries: [
        { name: 'index.html', content: `<!doctype html>\n<html lang="es">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Ejemplo CSS</title>\n    <link rel="stylesheet" href="style.css" />\n  </head>\n  <body>\n    <main>\n      <h1>Estilos base</h1>\n      <p>Prueba cambiando colores, espacios y bordes.</p>\n    </main>\n  </body>\n</html>` },
        { name: 'style.css', content: `body {\n  background: #090909;\n  color: #f5f5f5;\n  font-family: Arial, sans-serif;\n  padding: 32px;\n}\n\nmain {\n  max-width: 520px;\n  margin: 0 auto;\n  background: #111111;\n  border: 1px solid #252525;\n  border-radius: 18px;\n  padding: 24px;\n}` },
        { name: 'script.js', content: `// Aquí no necesitas JavaScript todavía.` }
      ]
    },
    logic: {
      name: 'Ejemplo de lógica JS',
      entries: [
        { name: 'index.html', content: `<!doctype html>\n<html lang="es">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Lógica básica</title>\n    <link rel="stylesheet" href="style.css" />\n  </head>\n  <body>\n    <main>\n      <h1>Lógica con JavaScript</h1>\n      <p>Abre la vista previa y revisa la consola.</p>\n    </main>\n    <script src="script.js"></script>\n  </body>\n</html>` },
        { name: 'style.css', content: `body { background: #090909; color: #f5f5f5; font-family: Arial, sans-serif; padding: 32px; }` },
        { name: 'script.js', content: `let edad = 18;\n\nif (edad >= 18) {\n  console.log('Mayor de edad');\n} else {\n  console.log('Menor de edad');\n}` }
      ]
    }
  };
  return sampleProjects[kind] || sampleProjects.starter;
}

// La copia de emergencia (IndexedDB) no abre archivos automáticamente.
// Se solicita guardar o exportar el proyecto antes de cerrar o salir de él.
let pendingExit = null;
function dismissUnsaved() {
  refs.unsavedDialog.close();
  pendingExit = null;
}
function askUnsaved({ fileId = null, onSaved, onDiscard }) {
  if (refs.unsavedDialog.open) return;
  pendingExit = { fileId, onSaved, onDiscard };
  const name = fileId == null ? (project?.name || 'tu espacio de trabajo') : (files.find(f => f.id === fileId)?.name || 'tu archivo');
  const count = fileId == null ? unsavedFiles(files).length : 1;
  refs.unsavedDescription.textContent = `«${name}» tiene ${count} archivo(s) o cambio(s) pendiente(s). Guarda una copia o elige descartar antes de cerrar.`;
  refs.unsavedError.textContent = 'La copia de emergencia del navegador no equivale a guardar en tu equipo.';
  refs.unsavedDialog.showModal();
}
async function resolveUnsavedSave(mode) {
  if (!pendingExit) return;
  const pending = pendingExit;
  const buttonIds = ['#unsaved-save-folder','#unsaved-save-as','#unsaved-discard','#unsaved-cancel','#unsaved-back'];
  buttonIds.forEach(id => { $(id).disabled = true; });
  try {
    let success = false;
    if (pending.fileId !== null) {
      const file = files.find(f => f.id === pending.fileId);
      if (!file) return;
      if (activeId !== file.id) activateFile(file.id);
      if (mode === 'folder' && project) {
        await saveProject();
      } else {
        await saveFile(mode === 'as' || !file.handle);
      }
      success = !unsavedFiles([file]).length;
    } else if (project && files.length) {
      if (mode === 'folder') await saveProject();
      else exportProjectZip();
      success = !unsavedFiles(files).length;
    } else if (files.length === 1) {
      await saveFile(mode === 'as' || !active()?.handle);
      success = !unsavedFiles(files).length;
    } else if (files.length > 1) {
      // Varios archivos sueltos: descarga una copia íntegra antes de continuar.
      const snapshots = files.map(f => ({ name:f.name, content:f.content }));
      downloadBlob(makeZip(snapshots), 'BadDev-archivos-sueltos.zip');
      for (const file of files) { file.savedContent = file.content; file.lastSaveMode = 'download'; file.restored = false; }
      renderFileLists(); renderStatus();
      success = !unsavedFiles(files).length;
    }
    if (success) {
      dismissUnsaved();
      await pending.onSaved();
    } else {
      refs.unsavedError.textContent = 'No se completó el guardado. Puedes reintentarlo o cancelar para seguir editando.';
    }
  } catch (error) {
    refs.unsavedError.textContent = `No se pudo guardar: ${error.message}`;
  } finally {
    buttonIds.forEach(id => { $(id).disabled = false; });
  }
}
$('#unsaved-save-folder').addEventListener('click', () => resolveUnsavedSave('folder'));
$('#unsaved-save-as').addEventListener('click', () => resolveUnsavedSave('as'));
$('#unsaved-discard').addEventListener('click', () => {
  if (!pendingExit) return;
  const pending = pendingExit;
  dismissUnsaved();
  pending.onDiscard();
});
$('#unsaved-cancel').addEventListener('click', dismissUnsaved);
$('#unsaved-back').addEventListener('click', dismissUnsaved);
refs.unsavedDialog.addEventListener('close', () => { pendingExit = null; });

function canCloseProject(onSaved = null, onDiscard = null) {
  if (saving.size) { toast('Hay archivos guardándose. Inténtalo de nuevo.', 'error'); return false; }
  if (!files.length) return true;
  const pending = unsavedFiles(files);
  if (pending.length) {
    askUnsaved({ onSaved: onSaved || (() => {}), onDiscard: onDiscard || (() => toast('Acción cancelada: mantuvimos el trabajo en el editor.')) });
    return false;
  }
  return true;
}
async function closeProject(discard = false, confirmedByModal = false) {
  if (!discard && !canCloseProject(() => closeProject(false, true), () => closeProject(true, true))) return;
  // Tras Guardar o No guardar en el modal ya se ha confirmado la decisión.
  if (!discard && !confirmedByModal && files.length && !window.confirm('¿Cerrar el proyecto y volver al menú? Comprueba que tienes tus archivos guardados o el ZIP descargado.')) return;
  clearTimeout(backupTimer);
  sessionReady = false; // no generar otro respaldo al vaciar el espacio
  clearWorkspace();
  if (previewVisible) togglePreview();
  returnToHome = true;
  renderWorkspace();
  try { await backupQueue.catch(() => {}); await removeSession(); }
  catch (error) { console.warn('No se pudo limpiar el respaldo anterior:', error); }
  finally { sessionReady = true; }
  toast('Proyecto cerrado. Usa Abrir proyecto para continuar desde tus archivos.');
}
async function openLearnCenter(discard = false) {
  if (!discard && !canCloseProject(() => openLearnCenter(), () => openLearnCenter(true))) return;
  if (discard) {
    clearTimeout(backupTimer);
    sessionReady = false;
    clearWorkspace();
    await backupQueue.catch(() => {});
    try { await removeSession(); } catch {}
  }
  window.location.assign(new URL('learn.html', window.location.href).href);
}

function loadLearnProject(kind) {
  const sample = makeLearnProject(kind);
  if (!confirmReplaceWorkspace()) {
    toast('Se mantuvo tu trabajo actual. Puedes guardarlo antes de cargar el ejemplo.', 'error');
    return;
  }
  returnToHome = false;
  loadProject(sample.name, sample.entries.map(entry => ({ ...entry, isNew: true })));
  toast(`Ejemplo «${sample.name}» cargado. Puedes usar Vista previa.`);
}

const active = () => files.find(file => file.id === activeId) ?? null;
const dirty = (file) => file.savedContent === null || file.content !== file.savedContent;

const { view, stateForFile, updateSettings, changeLanguage } = createEditor(refs.host, (update) => {
  const file = active();
  if (!file) return;
  if (update.docChanged) {
    const wasDirty = dirty(file);
    file.content = update.state.doc.toString();
    file.editorState = update.state;
    if (wasDirty !== dirty(file)) renderFileLists();
    scheduleBackup();
    if (previewVisible && refs.previewAuto.checked) { clearTimeout(previewAutoTimer); previewAutoTimer = setTimeout(refreshPreview, 650); }
  }
  if (update.selectionSet) { file.cursor = update.state.selection.main.head; scheduleBackup(); }
  if (update.selectionSet || update.docChanged) renderStatus();
}, settings, { onComment: toggleComments });

function toast(message, kind = 'success') {
  clearTimeout(toastTimeout);
  refs.toast.textContent = message;
  refs.toast.className = `toast is-visible ${kind === 'error' ? 'toast-error' : ''}`;
  toastTimeout = setTimeout(() => refs.toast.classList.remove('is-visible'), 3500);
}

function createFileBadge(file) {
  const type = languageForFile(file.name);
  const badge = document.createElement('span');
  badge.className = `file-badge file-badge-${type?.badgeColor ?? 'text'}`;
  badge.textContent = type?.badge ?? '•';
  badge.title = type?.label ?? 'Texto';
  badge.setAttribute('aria-hidden', 'true');
  return badge;
}

// Los respaldos son copias locales del navegador, NO un guardado en el disco.
// Se escriben en orden para impedir que un respaldo viejo sobrescriba uno reciente.
function workspaceSnapshot() {
  const current = active();
  return {
    version: SESSION_VERSION,
    projectName: project?.name || null,
    files: files.map(f => ({
      name: f.name, content: f.content, savedContent: f.savedContent,
      lastSaveMode: f.lastSaveMode,
      cursor: f.id === activeId ? view.state.selection.main.head : (f.cursor || 0)
    })),
    activeIndex: files.indexOf(current), previewVisible, sortByName,
    sidebarCollapsed: refs.workspace.classList.contains('sidebar-collapsed'),
    previewEntry: refs.previewEntry.value || previewPreferredEntry,
    updatedAt: Date.now()
  };
}
function scheduleBackup(delay = 650) {
  if (!sessionReady) return;
  clearTimeout(backupTimer);
  if (files.length) refs.backupStatus.textContent = 'Respaldo pendiente';
  backupTimer = setTimeout(() => {
    const snapshot = workspaceSnapshot();
    backupQueue = backupQueue.catch(() => {}).then(async () => {
      try {
        await writeSession(snapshot);
        lastBackupError = '';
        refs.backupStatus.textContent = snapshot.files.length ? 'Respaldo local ✓' : 'Espacio vacío';
      } catch (error) {
        lastBackupError = error.message;
        refs.backupStatus.textContent = 'Respaldo no disponible';
        refs.backupStatus.title = lastBackupError;
      }
    });
  }, delay);
}
function renderFileLists() {
  refs.list.replaceChildren();
  refs.tabs.replaceChildren();
  refs.count.textContent = String(files.length);
  refs.projectName.textContent = project?.name || 'Archivos sueltos';
  refs.projectCloseButton.hidden = !project;
  refs.projectName.title = project ? `${project.name}${project.dirHandle ? ' · carpeta vinculada' : ' · sin carpeta vinculada'}` : 'Abre o crea un proyecto';
  refs.sidebarEmpty.hidden = files.length !== 0;
  const filter = refs.filter.value.trim().toLocaleLowerCase();
  const visible = files.filter(file => file.name.toLocaleLowerCase().includes(filter));
  if (sortByName) visible.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  refs.filterEmpty.hidden = files.length === 0 || visible.length !== 0;

  for (const file of visible) {
    const isActive = file.id === activeId;
    const modified = dirty(file);
    const row = document.createElement('div');
    row.className = `file-row ${isActive ? 'is-active' : ''}`;
    row.setAttribute('role', 'listitem');
    const sidebarButton = document.createElement('button');
    sidebarButton.type = 'button';
    sidebarButton.className = `file-item ${isActive ? 'is-active' : ''}`;
    sidebarButton.title = `${file.name}${modified ? ' — sin guardar' : ''}`;
    sidebarButton.dataset.selectId = String(file.id);
    sidebarButton.append(createFileBadge(file));
    const sidebarName = document.createElement('span');
    sidebarName.className = 'file-name';
    sidebarName.textContent = file.name;
    sidebarButton.append(sidebarName);
    if (modified) {
      const modifiedDot = document.createElement('span');
      modifiedDot.className = 'modified-dot';
      modifiedDot.title = 'Cambios sin guardar';
      sidebarButton.append(modifiedDot);
    }
    const fileActions = document.createElement('div');
    fileActions.className = 'file-row-actions';
    const renameButton = document.createElement('button');
    renameButton.type = 'button';
    renameButton.title = `Renombrar ${file.name}`;
    renameButton.setAttribute('aria-label', `Renombrar ${file.name}`);
    renameButton.dataset.renameId = String(file.id);
    renameButton.textContent = '✎';
    const duplicateButton = document.createElement('button');
    duplicateButton.type = 'button';
    duplicateButton.title = `Duplicar ${file.name}`;
    duplicateButton.setAttribute('aria-label', `Duplicar ${file.name}`);
    duplicateButton.dataset.duplicateId = String(file.id);
    duplicateButton.textContent = '⧉';
    fileActions.append(renameButton, duplicateButton);
    row.append(sidebarButton, fileActions);
    refs.list.append(row);
  }

  // Las pestañas no se filtran ni se ordenan: conservan su orden de apertura.
  for (const file of files) {
    const isActive = file.id === activeId;
    const modified = dirty(file);
    const tab = document.createElement('div');
    tab.className = `tab ${isActive ? 'is-active' : ''}`;
    tab.setAttribute('role', 'presentation');
    const tabButton = document.createElement('button');
    tabButton.type = 'button';
    tabButton.className = 'tab-label';
    tabButton.dataset.selectId = String(file.id);
    tabButton.title = file.name;
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-selected', String(isActive));
    tabButton.tabIndex = isActive ? 0 : -1;
    tabButton.setAttribute('aria-controls', 'editor-host');
    tabButton.append(createFileBadge(file));
    const tabName = document.createElement('span');
    tabName.className = 'tab-name';
    tabName.textContent = file.name;
    tabButton.append(tabName);
    if (modified) {
      const dot = document.createElement('span');
      dot.className = 'modified-dot';
      dot.title = 'Cambios sin guardar';
      tabButton.append(dot);
    }
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'tab-close';
    close.title = `Cerrar ${file.name}`;
    close.setAttribute('aria-label', `Cerrar ${file.name}`);
    close.dataset.closeId = String(file.id);
    close.textContent = '×';
    tab.append(tabButton, close);
    refs.tabs.append(tab);
  }
  scheduleBackup();
}

function renderStatus() {
  const file = active();
  refs.indent.textContent = `Espacios: ${indentSizeForFile(file?.name, settings.tabSize)}${file && extensionOf(file.name) === 'py' ? ' · Python' : ''}`;
  if (!file) {
    refs.save.textContent = project ? 'Proyecto vacío' : 'Listo para crear';
    refs.filename.textContent = 'Sin archivo';
    refs.lang.textContent = '—';
    refs.pos.textContent = 'Ln —, Col —';
    return;
  }
  refs.save.textContent = saving.has(file.id) ? 'Guardando...' : dirty(file) ? '● Cambios sin guardar' : file.restored ? '● Recuperado · guarda en tu equipo' : file.lastSaveMode === 'download' ? '✓ Descargado' : '✓ Guardado';
  refs.filename.textContent = file.name;
  refs.lang.textContent = fileLanguage(file.name);
  const head = view.state.selection.main.head;
  const line = view.state.doc.lineAt(head);
  refs.pos.textContent = `Ln ${line.number}, Col ${head - line.from + 1}`;
}

function renderWorkspace() {
  const file = active();
  refs.welcome.hidden = !!file && !returnToHome;
  refs.host.hidden = !file || returnToHome;
  refs.previewPanel.hidden = returnToHome || !previewVisible;
  refs.pythonQuickRun.hidden = !file || !/\.py$/i.test(file.name) || returnToHome;
  renderFileLists();
  renderStatus();
  if (previewVisible) updatePreviewEntries();
}

function activateFile(id) {
  if (!restoringSession) returnToHome = false;
  if (activeId === id) { renderWorkspace(); view.requestMeasure(); view.focus(); return; }
  const previous = active();
  if (previous) previous.editorState = view.state;
  const file = files.find(item => item.id === id);
  if (!file) return;
  activeId = id;
  view.setState(file.editorState ?? stateForFile(file));
  changeLanguage(file, () => activeId === file.id, message => toast(message, 'error'));
  renderWorkspace();
  view.focus();
}

function insertFile({ name, content, handle = null, isNew = false, savedContent = undefined, lastSaveMode = undefined, cursor = 0, restored = false }) {
  const file = {
    id: nextId++, name, content, handle,
    savedContent: savedContent === undefined ? (isNew ? null : content) : savedContent,
    lastSaveMode: lastSaveMode ?? (isNew ? 'new' : 'disk'), editorState: null,
    cursor, restored
  };
  files.push(file);
  activateFile(file.id);
  return file;
}

function showRenameDialog(id) {
  const file = files.find(item => item.id === id);
  if (!file) return;
  renameId = id;
  refs.renameName.value = file.name;
  refs.renameHint.textContent = 'Usa una extensión compatible. El archivo anterior del disco no se modifica.';
  refs.renameHint.classList.remove('error-text');
  refs.renameDialog.showModal();
  refs.renameName.focus();
  refs.renameName.select();
}

refs.renameForm.addEventListener('submit', event => {
  event.preventDefault();
  const file = files.find(item => item.id === renameId);
  if (!file) { refs.renameDialog.close(); return; }
  const name = refs.renameName.value.trim();
  if (!(project ? validProjectPath(name) : validFilename(name)) || !PROJECT_TYPES.has(extensionOf(name))) {
    refs.renameHint.textContent = 'Usa una extensión compatible con BadDev y un nombre válido en Windows.';
    refs.renameHint.classList.add('error-text'); return;
  }
  if (files.some(other => other.id !== file.id && other.name.toLowerCase() === name.toLowerCase())) {
    refs.renameHint.textContent = 'Ya existe un archivo abierto con ese nombre.';
    refs.renameHint.classList.add('error-text'); return;
  }
  if (file.name === name) { refs.renameDialog.close(); return; }
  const extChanged = extensionOf(file.name) !== extensionOf(name);
  file.name = name;
  // Renombrar en la sesión no renombra un archivo físico: se pide Guardar como.
  file.handle = null;
  file.savedContent = null;
  file.lastSaveMode = 'new';
  if (extChanged) changeLanguage(file, () => activeId === file.id, message => toast(message, 'error'));
  refs.renameDialog.close();
  renderFileLists(); renderStatus();
  if (previewVisible) updatePreviewEntries();
  toast(`${file.name} renombrado en BadDev. ${project ? 'No elimina el nombre anterior en la carpeta.' : 'Guarda para crear el nuevo archivo.'}`);
});

function duplicateFile(id) {
  const source = files.find(file => file.id === id);
  if (!source) return;
  const name = makeUniqueName(source.name, files.map(file => file.name));
  insertFile({ name, content: source.content, isNew: true });
  toast(`Copia ${name} creada. Aún no está guardada en el equipo.`);
}

function showNewDialog() {
  refs.newType.value = 'html';
  refs.newName.value = makeUniqueName('index.html', files.map(f => f.name));
  refs.newHint.textContent = 'Los archivos sin guardar aparecen con un punto rojo.';
  refs.newHint.classList.remove('error-text');
  refs.newDialog.showModal();
  refs.newName.focus();
  refs.newName.select();
}

refs.newType.addEventListener('change', () => {
  const type = refs.newType.value;
  const base = languageForType(type)?.filename ?? 'index.html';
  refs.newName.value = makeUniqueName(base, files.map(f => f.name));
});

refs.newForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let name = refs.newName.value.trim();
  const type = refs.newType.value;
  if (!extensionOf(name) || !name.includes('.')) name += `.${type}`;
  const ext = extensionOf(name);
  if (!(project ? validProjectPath(name) : validFilename(name)) || !PROJECT_TYPES.has(ext)) {
    refs.newHint.textContent = 'Escribe un nombre de archivo con una extensión compatible.';
    refs.newHint.classList.add('error-text');
    return;
  }
  if (!languageForType(type)?.extensions.includes(ext)) {
    refs.newHint.textContent = 'La extensión del archivo debe coincidir con el lenguaje seleccionado.';
    refs.newHint.classList.add('error-text');
    return;
  }
  const uniqueName = makeUniqueName(name, files.map(f => f.name));
  refs.newDialog.close();
  insertFile({ name: uniqueName, content: STARTER_CODE[type] ?? '', isNew: true });
  toast(`${uniqueName} creado. Recuerda guardarlo.`);
});

async function openFromHandles(handles) {
  for (const handle of handles) {
    try {
      // Avoid reopening the same underlying file if Chrome offers handle identity.
      let existing = null;
      if (handle.isSameEntry) {
        for (const file of files) {
          if (file.handle && await handle.isSameEntry(file.handle)) { existing = file; break; }
        }
      }
      if (existing) { activateFile(existing.id); continue; }
      const diskFile = await handle.getFile();
      if (!supportedFileName(diskFile.name)) { toast(`${diskFile.name}: extensión no compatible.`, 'error'); continue; }
      if (diskFile.size > 5_000_000) { toast(`${diskFile.name}: supera el límite recomendado de 5 MB.`, 'error'); continue; }
      const name = makeUniqueName(diskFile.name, files.map(f => f.name));
      insertFile({ name, content: await diskFile.text(), handle: project ? null : handle });
    } catch (error) { toast(`No se pudo abrir el archivo: ${error.message}`, 'error'); }
  }
}

async function openFiles() {
  if (typeof window.showOpenFilePicker === 'function') {
    try {
      const handles = await chooseFiles();
      if (handles) { await openFromHandles(handles); return; }
    } catch (error) {
      if (error.name === 'AbortError') return;
      // Some Chromium environments disallow the native picker; use the file input.
      console.warn('Selector de archivos no disponible:', error);
    }
  }
  refs.input.value = '';
  refs.input.click();
}

refs.input.addEventListener('change', async (event) => {
  for (const file of Array.from(event.target.files)) {
    try {
      if (!supportedFileName(file.name)) { toast(`${file.name}: extensión no compatible.`, 'error'); continue; }
      if (file.size > MAX_FILE_BYTES) { toast(`${file.name}: supera el límite recomendado de 5 MB.`, 'error'); continue; }
      insertFile({ name: makeUniqueName(file.name, files.map(f => f.name)), content: await file.text(), isNew: Boolean(project) });
    } catch (error) { toast(`No se pudo leer ${file.name}: ${error.message}`, 'error'); }
  }
  refs.input.value = '';
});

async function saveFile(forceNewHandle = false) {
  const file = active();
  if (!file) { toast('Abre o crea un archivo antes de guardarlo.', 'error'); return; }
  // En un proyecto nuevo, Ctrl+S guarda todo junto en la carpeta seleccionada.
  if (project && !project.dirHandle && !forceNewHandle) {
    if (typeof window.showDirectoryPicker === 'function') await saveProject();
    else exportProjectZip();
    return;
  }
  if (saving.has(file.id)) return;
  const snapshot = file.content;
  const oldExtension = extensionOf(file.name);
  saving.add(file.id);
  renderStatus();
  try {
    let result;
    if (project && !forceNewHandle && project.dirHandle) {
      const handle = await writeProjectFile(project.dirHandle, file, snapshot);
      result = { handle, name: file.name, mode: 'disk' };
    } else if (project && !project.dirHandle && !forceNewHandle && file.name.includes('/')) {
      toast('Este archivo está en una subcarpeta. Usa Guardar proyecto o Descargar ZIP.', 'error');
      return;
    } else {
      result = await writeFile({ ...file, name: file.name.split('/').at(-1), content: snapshot }, forceNewHandle);
      // Guardar como en modo proyecto exporta una copia independiente; no altera la ruta del proyecto.
      if (project) result.name = file.name;
    }
    file.handle = result.handle;
    file.name = result.name;
    file.savedContent = snapshot;
    file.lastSaveMode = result.mode;
    file.restored = false;
    if (extensionOf(file.name) !== oldExtension) {
      // Guardar como otro tipo actualiza sintaxis sin borrar el historial.
      changeLanguage(file, activeId === file.id);
    }
    toast(result.mode === 'disk' ? `${file.name} guardado en tu equipo.` : `${file.name} descargado. Para volver a guardar, se descargará otra copia.`);
    if (previewVisible) refreshPreview();
  } catch (error) {
    if (error.name !== 'AbortError') toast(`No se pudo guardar: ${error.message}`, 'error');
  } finally {
    saving.delete(file.id);
    renderFileLists();
    renderStatus();
  }
}

const discardingTab = new Set();
function closeTab(id = activeId) {
  const index = files.findIndex(file => file.id === id);
  if (index === -1) return;
  const file = files[index];
  if (saving.has(file.id)) { toast('Este archivo todavía se está guardando.', 'error'); return; }
  if ((dirty(file) || file.restored) && !discardingTab.has(file.id)) {
    askUnsaved({ fileId: file.id, onSaved: () => closeTab(file.id), onDiscard: () => { discardingTab.add(file.id); closeTab(file.id); discardingTab.delete(file.id); } });
    return;
  }

  if (activeId === id) {
    files.splice(index, 1);
    activeId = null;
    const next = files[Math.min(index, files.length - 1)];
    if (next) activateFile(next.id);
    else renderWorkspace();
  } else {
    files.splice(index, 1);
    renderFileLists();
    if (previewVisible) updatePreviewEntries();
  }
}

function findText(replace = false) {
  if (!active()) { toast('Abre un archivo para buscar código.', 'error'); return; }
  openSearchPanel(view);
  if (replace) {
    const input = view.dom.querySelector('.cm-search input[name="replace"]');
    if (input) { input.focus(); input.select(); }
  }
}

function renderSettingsForm() {
  refs.fontSize.value = String(settings.fontSize);
  refs.fontValue.textContent = `${settings.fontSize} px`;
  refs.tabSize.value = String(settings.tabSize);
  refs.wordWrap.checked = settings.wordWrap;
  refs.theme.value = settings.theme;
}

function setEditorSettings(next) {
  settings = { ...next };
  document.documentElement.dataset.theme = settings.theme;
  const persisted = saveSettings(settings);
  updateSettings(settings, files.filter(file => file.id !== activeId), active()?.name ?? '');
  renderSettingsForm(); renderStatus();
  if (!persisted) toast('El navegador no permitió guardar las preferencias.', 'error');
}

function showSettings() { renderSettingsForm(); refs.settingsDialog.showModal(); }
refs.fontSize.addEventListener('input', () => setEditorSettings({ ...settings, fontSize: Number(refs.fontSize.value) }));
refs.tabSize.addEventListener('change', () => setEditorSettings({ ...settings, tabSize: Number(refs.tabSize.value) }));
refs.wordWrap.addEventListener('change', () => setEditorSettings({ ...settings, wordWrap: refs.wordWrap.checked }));
refs.theme.addEventListener('change', () => setEditorSettings({ ...settings, theme: refs.theme.value }));
refs.filter.addEventListener('input', renderFileLists);

function toggleSidebar() {
  const hidden = refs.workspace.classList.toggle('sidebar-collapsed');
  refs.sideMenu.textContent = hidden ? 'Mostrar explorador' : 'Ocultar explorador';
  refs.sidebar.setAttribute('aria-hidden', String(hidden));
  scheduleBackup();
  view.requestMeasure();
}

function showInfo(kind) {
  if (kind === 'shortcuts') {
    refs.infoTitle.textContent = 'Atajos de teclado';
    refs.infoContent.innerHTML = '<p><strong>Ctrl + N</strong> — Nuevo archivo</p><p><strong>Ctrl + O</strong> — Abrir archivos</p><p><strong>Ctrl + S</strong> — Guardar</p><p><strong>Ctrl + W</strong> — Cerrar pestaña</p><p><strong>Ctrl + F</strong> — Buscar texto</p><p><strong>Ctrl + H</strong> — Buscar y reemplazar</p><p><strong>Ctrl + Espacio</strong> — Sugerencias</p><p><strong>Ctrl + Z</strong> — Deshacer (editor)</p><p><strong>Ctrl + /</strong> — Alternar comentario</p><p><strong>Ctrl + Y</strong> — Rehacer (editor)</p><p class="info-muted">Los navegadores pueden reservar algunos atajos. Usa Editar si un atajo no llega a BadDev. Los resultados de búsqueda pertenecen al archivo activo.</p>';
  } else {
    refs.infoTitle.textContent = `BadDev — ${displayVersion(packageInfo.version)}`;
    refs.infoContent.innerHTML = '<p><strong>Code without mercy.</strong> BadDev incluye LEARN WITHOUT MERCY como una página independiente, con cursos, retos y guías interactivas.</p><p>La vista previa funciona con HTML, Markdown, JSON y TypeScript, siempre de forma local, sin backend ni conexiones externas. Si abres una carpeta con imágenes, también se muestran en la vista previa.</p><p class="info-muted">BadDev siempre abre en el menú. Guarda o descarga el proyecto antes de cerrarlo. El respaldo de emergencia solo se recupera manualmente desde Archivo.</p>';
  }
  refs.infoDialog.showModal();
}

// ----- Fase 3: proyectos y carpetas -----
function confirmReplaceWorkspace() {
  return canCloseProject() && (!files.length || window.confirm('¿Abrir otro proyecto? El proyecto actual ya debe tener una copia guardada o exportada.')); 
}

function clearWorkspace() {
  files.splice(0);
  clearAssets();
  activeId = null;
  project = null;
  previewPreferredEntry = '';
  refs.filter.value = '';
  refs.previewFrame.removeAttribute('srcdoc');
  renderWorkspace();
}

function loadProject(name, entries, dirHandle = null, images = []) {
  clearWorkspace();
  project = { name, dirHandle };
  const built = buildAssetMap(images);
  setAssets(built.map);
  if (built.warnings.length) console.warn('Imágenes omitidas:', built.warnings);
  for (const entry of entries) {
    if (validProjectPath(entry.name) && PROJECT_TYPES.has(extensionOf(entry.name))) {
      insertFile({ ...entry, isNew: !dirHandle && entry.isNew === true });
    }
  }
  const home = files.find(f => f.name === 'index.html') || files.find(f => /\.html?$/i.test(f.name)) || files[0];
  if (home) activateFile(home.id);
  renderWorkspace();
  if (previewVisible) refreshPreview();
}

function showProjectDialog() {
  refs.projectInput.value = 'Mi proyecto BadDev';
  refs.projectHint.textContent = 'Se crean index.html, style.css y script.js.';
  refs.projectHint.classList.remove('error-text');
  refs.projectDialog.showModal();
  refs.projectInput.focus();
  refs.projectInput.select();
}

refs.projectForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = refs.projectInput.value.trim();
  if (!name || name.length > 70 || /[\\/:*?"<>|]/.test(name)) {
    refs.projectHint.textContent = 'Usa un nombre simple, sin barras ni símbolos especiales.';
    refs.projectHint.classList.add('error-text');
    return;
  }
  if (!confirmReplaceWorkspace()) return;
  refs.projectDialog.close();
  loadProject(name, createStarterProject().map(f => ({ ...f, isNew: true })));
  toast(`Proyecto «${name}» creado. Abre Vista previa para verlo.`);
});

async function openFolder() {
  if (!confirmReplaceWorkspace()) return;
  if (typeof window.showDirectoryPicker === 'function') {
    try {
      const dir = await window.showDirectoryPicker({ mode: 'readwrite', id: 'baddev-project' });
      const result = await readDirectory(dir);
      if (!result.files.length) { toast('No se encontraron archivos de código compatibles en esa carpeta.', 'error'); return; }
      loadProject(dir.name, result.files, dir, result.images);
      const pics = assetCount();
      toast(`${result.files.length} archivo(s) abiertos de «${dir.name}».${pics ? ` ${pics} imagen(es) disponibles en la vista previa.` : ''}${result.warnings.length ? ` ${result.warnings.length} advertencia(s).` : ''}`);
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.warn('Carpeta nativa no disponible:', error);
    }
  }
  // Chromium directory upload fallback: read-only imported snapshot, no file handles.
  refs.nativeFolderInput.value = '';
  refs.nativeFolderInput.click();
}

refs.nativeFolderInput.addEventListener('change', async (event) => {
  const chosen = Array.from(event.target.files);
  if (!chosen.length) return;
  const prefix = chosen[0].webkitRelativePath.split('/')[0] || 'Proyecto importado';
  const entries = [];
  const images = [];
  for (const file of chosen) {
    const relative = file.webkitRelativePath.split('/').slice(1).join('/');
    if (isImageName(relative) && validProjectPath(relative)) {
      if (file.size <= 3_000_000) images.push({ name: relative, bytes: new Uint8Array(await file.arrayBuffer()) });
      continue;
    }
    if (entries.length >= MAX_PROJECT_FILES) continue;
    if (!validProjectPath(relative) || !PROJECT_TYPES.has(extensionOf(relative)) || file.size > MAX_FILE_BYTES) continue;
    entries.push({ name: relative, content: await file.text() });
  }
  if (!entries.length) { toast('No se encontraron archivos de código compatibles.', 'error'); return; }
  loadProject(prefix, entries, null, images);
  const pics = assetCount();
  toast(`Carpeta importada: ${entries.length} archivo(s)${pics ? ` y ${pics} imagen(es)` : ''}. Para guardar usa ZIP o Guardar proyecto.`);
  refs.nativeFolderInput.value = '';
});

async function saveProject() {
  if (!project || !files.length) { toast('Crea o abre un proyecto antes de guardarlo.', 'error'); return; }
  if (typeof window.showDirectoryPicker !== 'function') {
    toast('Chrome no permite guardar carpetas aquí. Usa Descargar proyecto ZIP.', 'error'); return;
  }
  let target = project.dirHandle;
  if (!target) {
    try { target = await window.showDirectoryPicker({ mode: 'readwrite', id: 'baddev-save-project' }); }
    catch (error) { if (error.name !== 'AbortError') toast(`No se pudo elegir carpeta: ${error.message}`, 'error'); return; }
  }
  // Snapshot protects the saved status if a file changes during the asynchronous write.
  const snapshots = files.map(file => ({ file, content: file.content }));
  let saved = 0;
  const failed = [];
  for (const { file, content } of snapshots) {
    try {
      const handle = await writeProjectFile(target, file, content);
      file.handle = handle;
      file.savedContent = content;
      file.lastSaveMode = 'disk';
      file.restored = false;
      saved++;
    } catch (error) { failed.push(`${file.name}: ${error.message}`); }
  }
  project.dirHandle = target;
  renderFileLists(); renderStatus();
  if (failed.length) toast(`${saved} guardados, ${failed.length} fallaron. ${failed[0]}`, 'error');
  else { toast(`${saved} archivos guardados en «${target.name}».`); if (previewVisible) refreshPreview(); }
}

function exportProjectZip() {
  if (!project || !files.length) { toast('Crea o abre un proyecto antes de descargarlo.', 'error'); return; }
  try {
    const snapshots = files.map(f => ({ name: f.name, content: f.content }));
    const imageEntries = [...getAssets().values()].map(a => ({ name: a.name, data: a.bytes }));
    const blob = makeZip([...snapshots, ...imageEntries]);
    const name = (project.name.replace(/[^\wáéíóúüñ-]+/gi, '-').slice(0, 55) || 'Mi-BadDev').replace(/^-|-$/g, '');
    downloadBlob(blob, `${name}.zip`);
    for (const f of files) { f.savedContent = snapshots.find(s => s.name === f.name)?.content ?? f.savedContent; f.lastSaveMode = 'download'; f.restored = false; }
    renderFileLists(); renderStatus();
    toast('Proyecto descargado como ZIP. Extráelo en Windows para abrirlo como carpeta.');
    if (previewVisible) refreshPreview();
  } catch (error) { toast(`No se pudo crear el ZIP: ${error.message}`, 'error'); }
}

// ----- Fase 3: vista previa aislada -----
function previewLabelFor(name) {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const labels = { html:'HTML', htm:'HTML', md:'Markdown', json:'JSON', ts:'TypeScript', py:'Python' };
  return labels[ext] || ext.toUpperCase();
}
function updatePreviewEntries(fallback = active()?.name || '') {
  const previous = refs.previewEntry.value || previewPreferredEntry;
  refs.previewEntry.replaceChildren();
  const candidates = [...previewableFiles(files), ...files.filter(f => /\.py$/i.test(f.name))];
  for (const f of candidates) {
    const option = document.createElement('option');
    option.value = f.name;
    option.textContent = `${f.name} · ${previewLabelFor(f.name)}`;
    refs.previewEntry.append(option);
  }
  const entry = candidates.some(f => f.name === previous) ? previous
    : candidates.some(f => f.name === fallback) ? fallback
    : selectPreviewEntry(files, previous, fallback) || candidates[0]?.name;
  if (entry) { refs.previewEntry.value = entry; previewPreferredEntry = entry; }
}

// ----- V 1.4: consola mejorada (tipos, filtros, hora, copiar) -----
const CONSOLE_LABELS = { error: 'ERROR', warn: 'AVISO', log: 'LOG', info: 'INFO' };
const consoleCounts = { error: 0, warn: 0, log: 0, info: 0 };
let consoleFilter = 'all';
function updateConsoleCounts() {
  const total = consoleCounts.error + consoleCounts.warn + consoleCounts.log + consoleCounts.info;
  const shown = { all: total, error: consoleCounts.error, warn: consoleCounts.warn, log: consoleCounts.log };
  document.querySelectorAll('[data-console-count]').forEach(el => { el.textContent = String(shown[el.dataset.consoleCount] ?? 0); });
  refs.previewErrorCount.textContent = String(consoleCounts.error);
  refs.previewErrorCount.classList.toggle('has-errors', consoleCounts.error > 0);
}
function resetPreviewErrors() {
  previewErrorCount = 0;
  Object.keys(consoleCounts).forEach(key => { consoleCounts[key] = 0; });
  refs.previewErrors.replaceChildren();
  updateConsoleCounts();
}
function previewLine(message, isError = true, kind = '') {
  const type = kind || (isError ? 'error' : 'info');
  if (type === 'error') previewErrorCount++;
  consoleCounts[type]++;
  const line = document.createElement('p');
  line.className = `console-line kind-${type}${type === 'info' ? ' preview-notice' : ''}${type === 'log' ? ' preview-log' : ''}${type === 'warn' ? ' preview-warn' : ''}`;
  line.dataset.kind = type;
  const time = document.createElement('span');
  time.className = 'console-time';
  time.textContent = new Date().toLocaleTimeString('es', { hour12: false });
  const badge = document.createElement('span');
  badge.className = 'console-badge';
  badge.textContent = CONSOLE_LABELS[type];
  const text = document.createElement('span');
  text.className = 'console-text';
  text.textContent = message;
  line.append(time, badge, text);
  refs.previewErrors.append(line);
  refs.previewErrors.scrollTop = refs.previewErrors.scrollHeight;
  updateConsoleCounts();
}
function setConsoleFilter(filter) {
  consoleFilter = filter;
  refs.previewErrors.dataset.filter = filter;
  document.querySelectorAll('[data-console-filter]').forEach(button => {
    const active = button.dataset.consoleFilter === filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}
document.querySelectorAll('[data-console-filter]').forEach(button => button.addEventListener('click', () => setConsoleFilter(button.dataset.consoleFilter)));
async function copyConsole() {
  const lines = [...refs.previewErrors.querySelectorAll('.console-line')]
    .filter(line => consoleFilter === 'all' || line.dataset.kind === consoleFilter)
    .map(line => [...line.children].map(part => part.textContent).join(' '));
  if (!lines.length) { toast('No hay mensajes para copiar.', 'error'); return; }
  try { await navigator.clipboard.writeText(lines.join('\n')); toast(`${lines.length} mensaje(s) copiados.`); }
  catch { toast('No se pudo copiar automáticamente. Selecciona el texto y usa Ctrl + C.', 'error'); }
}
// Etapa G — ambos motores Python. Nunca se ejecuta al abrir un archivo ni por Auto.
let pythonOutputLength = 0;
const pythonRunner = createPythonRunner({
  onStatus: message => { refs.pythonStatus.textContent = message; },
  onBusy: busy => { refs.pythonRun.disabled = busy; refs.pythonStop.disabled = !busy; },
  onOutput: (stream, text) => {
    const value = String(text ?? '');
    if (pythonOutputLength < 34000) {
      const chunk = value.slice(0, 34000 - pythonOutputLength);
      pythonOutputLength += chunk.length;
      refs.pythonOutput.textContent += chunk + '\n';
      refs.pythonOutput.scrollTop = refs.pythonOutput.scrollHeight;
    }
    previewLine(`[Python ${stream}] ${value.slice(0, 450)}`, stream === 'stderr', stream === 'stderr' ? 'error' : 'log');
  }
});
function setPythonPreview(selected) {
  const isPython = /\.py$/i.test(selected || '');
  refs.previewPanel.classList.toggle('is-python', isPython);
  refs.pythonPanel.hidden = !isPython;
  refs.previewFrame.hidden = isPython;
  refs.previewAuto.disabled = isPython;
  if (isPython) refs.previewAuto.checked = false;
  return isPython;
}
async function runSelectedPython(fileName = '') {
  if (!previewVisible) togglePreview();
  if (fileName) { previewPreferredEntry = fileName; updatePreviewEntries(fileName); refs.previewEntry.value = fileName; }
  const name = refs.previewEntry.value;
  const file = files.find(f => f.name === name);
  if (!file || !/\.py$/i.test(file.name)) { toast('Selecciona un archivo Python (.py) antes de ejecutarlo.', 'error'); return; }
  if (!setPythonPreview(file.name)) return;
  resetPreviewErrors();
  pythonOutputLength = 0;
  refs.pythonOutput.textContent = '';
  // El código se obtiene del archivo activo, que se actualiza al escribir; no de una copia anterior.
  await pythonRunner.run({engine:refs.pythonEngine.value, code:file.content, filename:file.name, input:refs.pythonInput.value});
}
refs.pythonRun.addEventListener('click', () => runSelectedPython());
refs.pythonStop.addEventListener('click', () => pythonRunner.stop());
refs.pythonEngine.addEventListener('change', () => {
  pythonRunner.stop(false);
  refs.pythonHelp.textContent = refs.pythonEngine.value === 'local'
    ? 'Windows: instala Python y abre otro CMD en la carpeta BadDev con npm run python:bridge. El código local puede acceder a archivos de tu usuario; usa solo código de confianza.'
    : 'Pyodide ejecuta Python dentro del navegador. Requiere Internet para descargar el motor la primera vez; no accede directamente a tus archivos de Windows.';
});

async function preparedPreview() {
  updatePreviewEntries();
  const entry = refs.previewEntry.value;
  if (!entry || /\.py$/i.test(entry)) throw new Error('Selecciona un archivo web compatible para la vista previa. Python utiliza su propia consola.');
  const token = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const result = await buildPreview(files, entry, token, { captureConsole: true, assets: getAssets() });
  return { ...result, token };
}
function toggleComments() {
  const file = active();
  if (!file) { toast('Abre un archivo para comentar.', 'error'); return; }
  const state = view.state;
  const { anchor, head } = state.selection.main;
  const result = commentChanges(file.name, state.doc.toString(), anchor, head);
  if (!result.ok) { toast(result.message, 'error'); return; }
  view.dispatch({ changes: result.changes });
  view.focus();
  toast(result.message);
}
function foldCurrentBlock(expand = false) {
  if (!active()) { toast('Abre un archivo primero.', 'error'); return; }
  const success = expand ? unfoldCode(view) : foldCode(view);
  if (!success) { toast('Coloca el cursor dentro de un bloque que se pueda plegar.', 'error'); return; }
  view.focus();
}
async function checkCurrentSyntax() {
  const file = active();
  if (!file) { toast('Abre un archivo antes de comprobar.', 'error'); return; }
  if (!canValidate(file.name)) { toast('La comprobación está disponible para JSON, XML y YAML.', 'error'); return; }
  const snapshot = view.state.doc.toString();
  const fileId = file.id;
  let result;
  try {
    result = await validateDocument(file.name, snapshot);
  } catch (error) {
    toast(`No se pudo comprobar: ${error.message}`, 'error');
    return;
  }
  if (activeId !== fileId || view.state.doc.toString() !== snapshot) {
    toast('El archivo cambió durante la comprobación. Vuelve a comprobarlo.', 'error');
    return;
  }
  refs.diagnosticsName.textContent = `${file.name} · ${result.message}`;
  refs.diagnosticsList.replaceChildren();
  if (!result.diagnostics.length) {
    const success = document.createElement('p');
    success.className = 'diagnostic-ok';
    success.textContent = `✓ ${result.language}: no se encontraron errores de sintaxis.`;
    refs.diagnosticsList.append(success);
  } else {
    for (const issue of result.diagnostics) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `diagnostic-entry diagnostic-${issue.severity}`;
      button.dataset.diagLine = String(issue.line);
      button.dataset.diagColumn = String(issue.column);
      const position = document.createElement('strong');
      position.textContent = `${issue.severity === 'warning' ? 'Advertencia' : 'Error'} · línea ${issue.line}, columna ${issue.column}`;
      const detail = document.createElement('span');
      detail.textContent = issue.message;
      button.append(position, detail);
      button.title = 'Ir a la línea en el editor';
      refs.diagnosticsList.append(button);
    }
  }
  refs.diagnosticsDialog.showModal();
}
refs.diagnosticsList.addEventListener('click', (event) => {
  const entry = event.target.closest('[data-diag-line]');
  if (!entry) return;
  const line = view.state.doc.line(Math.min(view.state.doc.lines, Math.max(1, Number(entry.dataset.diagLine))));
  const column = Math.max(1, Number(entry.dataset.diagColumn));
  const target = Math.min(line.to, line.from + column - 1);
  refs.diagnosticsDialog.close();
  view.dispatch({ selection: { anchor: target }, scrollIntoView: true });
  view.focus();
});

async function formatActiveFile() {
  const file = active();
  if (!file) { toast('Abre un archivo para formatear.', 'error'); return; }
  try {
    const formatted = await formatCode(file.name, view.state.doc.toString(), { tabWidth: indentSizeForFile(file.name, settings.tabSize) });
    if (active()?.id !== file.id) { toast('El archivo activo cambió; vuelve a intentarlo.', 'error'); return; }
    if (formatted !== view.state.doc.toString()) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: formatted } });
    }
    toast('Código ordenado con Prettier. Revisa y guarda los cambios.');
  } catch (error) { toast(`No se pudo ordenar: ${error.message}`, 'error'); }
}
let previewRequest = 0;
// Red de seguridad: si un script de la página usa location.href, el iframe carga la pantalla de BadDev.
// Se detecta una carga que BadDev no pidió y se restaura la vista previa (una sola vez por intento).
let previewLoadPending = false;
let lastPreviewRecovery = 0;
refs.previewFrame.addEventListener('load', () => {
  if (previewLoadPending) { previewLoadPending = false; return; }
  if (!previewVisible || !previewToken || !refs.previewFrame.hasAttribute('srcdoc')) return;
  if (Date.now() - lastPreviewRecovery < 2500) {
    previewToken = '';
    refs.previewFrame.srcdoc = '<!doctype html><html><body style="font:14px system-ui;padding:25px;color:#777">Esta página intenta cambiar de dirección por sí sola. Pulsa Actualizar para volver a cargarla.</body></html>';
    previewLoadPending = true;
    return;
  }
  lastPreviewRecovery = Date.now();
  previewLine('Aviso: un script cambió la dirección con location.href. Para ir a otra página usa un enlace <a href="archivo.html">; la vista previa se restauró.', false, 'warn');
  refreshPreview();
});
async function refreshPreview() {
  if (!previewVisible) return;
  const currentRequest = ++previewRequest;
  updatePreviewEntries();
  if (setPythonPreview(refs.previewEntry.value)) {
    previewToken = '';
    refs.previewFrame.removeAttribute('srcdoc');
    return; // Python se ejecuta solo al pulsar Ejecutar.
  }
  resetPreviewErrors();
  try {
    const result = await preparedPreview();
    // Evita mostrar resultados de una solicitud antigua tras cambiar de archivo o cerrar el panel.
    if (!previewVisible || currentRequest !== previewRequest) return;
    previewToken = result.token;
    previewLoadPending = true;
    refs.previewFrame.srcdoc = result.html;
    if (result.warnings.length) result.warnings.forEach(w => previewLine(`Aviso: ${w}`, false, 'warn'));
    else previewLine('Vista previa actualizada. Los errores y mensajes aparecerán aquí.', false);
  } catch (error) {
    if (!previewVisible || currentRequest !== previewRequest) return;
    previewLoadPending = true;
    refs.previewFrame.srcdoc = '<!doctype html><html><body style="font:14px system-ui;padding:25px;color:#777">No se pudo generar la vista previa. Revisa los diagnósticos de BadDev.</body></html>';
    previewLine(error.message, true);
  }
}
function togglePreview() {
  previewVisible = !previewVisible;
  refs.previewPanel.hidden = !previewVisible;
  refs.previewButton.setAttribute('aria-pressed', String(previewVisible));
  refs.previewMenuItem.textContent = previewVisible ? 'Ocultar vista previa' : 'Mostrar vista previa';
  if (previewVisible) refreshPreview();
  else { pythonRunner.stop(false); previewRequest++; previewToken = ''; refs.previewFrame.removeAttribute('srcdoc'); }
  scheduleBackup();
  view.requestMeasure();
}
async function detachPreview() {
  if (/\.py$/i.test(refs.previewEntry.value)) { toast('Python se ejecuta en la consola integrada, no en otra pestaña.'); return; }
  try {
    const preview = await preparedPreview();
    const didOpen = openDetachedPreview(preview.html);
    if (!didOpen) toast('Chrome bloqueó la nueva pestaña. Permite ventanas emergentes para BadDev.', 'error');
  } catch (error) { toast(error.message, 'error'); }
}
refs.previewSize.addEventListener('change', () => { refs.previewPanel.dataset.device = refs.previewSize.value; });
refs.previewAuto.addEventListener('change', () => { if (refs.previewAuto.checked && previewVisible) refreshPreview(); });
refs.previewEntry.addEventListener('change', () => { pythonRunner.stop(false); previewPreferredEntry = refs.previewEntry.value; refreshPreview(); scheduleBackup(); });
// Un enlace dentro de la página previsualizada abre el archivo enlazado del proyecto (nunca navega el iframe).
function followPreviewLink(data) {
  const href = String(data.href || '').slice(0, 240);
  if (data.external) { previewLine(`Aviso: los enlaces externos no se abren en la vista previa (${href}).`, false, 'warn'); return; }
  const target = resolveProjectReference(refs.previewEntry.value, href);
  const match = target ? files.find(f => f.name.toLowerCase() === target.toLowerCase()) : null;
  if (!match) { previewLine(`No se encontró el archivo enlazado: ${href}`, true); return; }
  if (!previewableFiles(files).some(f => f.name === match.name)) { previewLine(`«${match.name}» no se puede mostrar en la vista previa.`, false, 'warn'); return; }
  pythonRunner.stop(false);
  refs.previewEntry.value = match.name;
  previewPreferredEntry = match.name;
  refreshPreview();
  scheduleBackup();
}
window.addEventListener('message', (event) => {
  if (!previewVisible || event.source !== refs.previewFrame.contentWindow) return;
  const data = event.data;
  if (data && typeof data === 'object' && data.baddevPreview === previewToken && data.type === 'navigate') { followPreviewLink(data); return; }
  if (!data || typeof data !== 'object' || data.baddevPreview !== previewToken || !['error','log','warn'].includes(data.type)) return;
  if (refs.previewErrors.childElementCount >= 120) return;
  previewLine(String(data.message).slice(0, 800), data.type === 'error', data.type === 'log' ? 'log' : data.type === 'warn' ? 'warn' : 'error');
});


// Decoración discreta: gotas de código y binarios, solo en el menú inicial.
const RAIN_CHARACTERS = ['01', '10', '101', '0', '1', '</>', '{}', 'const', '=>', 'if', ';', '<>', '0110'];
function dropCode() {
  if (refs.welcome.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) return;
  if (refs.codeRain.childElementCount >= 14) return;
  const drop = document.createElement('span');
  drop.className = 'rain-bit';
  drop.textContent = RAIN_CHARACTERS[Math.floor(Math.random() * RAIN_CHARACTERS.length)];
  drop.style.left = `${8 + Math.random() * 85}%`;
  drop.style.animationDuration = `${7 + Math.random() * 6}s`;
  drop.style.fontSize = `${10 + Math.round(Math.random() * 4)}px`;
  refs.codeRain.append(drop);
  drop.addEventListener('animationend', () => drop.remove(), { once: true });
}
setInterval(dropCode, 1150);

// Intro más largo, adaptable al tamaño de la ventana y con acceso para omitirlo.
let splashTimeout;
function finishSplash() {
  if (!refs.splash || refs.splash.classList.contains('is-leaving')) return;
  clearTimeout(splashTimeout);
  refs.splash.classList.add('is-leaving');
  setTimeout(() => { refs.splash.hidden = true; }, 550);
}
refs.skipSplash.addEventListener('click', finishSplash);
splashTimeout = setTimeout(finishSplash, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1200 : 4200);

// ----- V 1.4: terminal integrada -----
const terminal = initTerminal({
  files: () => files,
  assets: () => [...getAssets().values()].map(a => ({ name: a.name, size: a.bytes.length })),
  projectName: () => project?.name || 'Archivos sueltos',
  version: () => displayVersion(packageInfo.version),
  getTheme: () => settings.theme,
  setTheme: (theme) => setEditorSettings({ ...settings, theme }),
  openFile: (name) => { const file = files.find(f => f.name.toLowerCase() === name.toLowerCase()); if (!file) return false; activateFile(file.id); return true; },
  createFile: (name) => {
    if (!(project ? validProjectPath(name) : validFilename(name)) || !PROJECT_TYPES.has(extensionOf(name))) return { ok: false, error: 'Nombre no válido o extensión no compatible con BadDev.' };
    if (files.length >= MAX_PROJECT_FILES) return { ok: false, error: 'Se alcanzó el límite de archivos del proyecto.' };
    const unique = makeUniqueName(name, files.map(f => f.name));
    insertFile({ name: unique, content: STARTER_CODE[extensionOf(unique)] ?? '', isNew: true });
    return { ok: true, name: unique };
  },
  save: () => saveFile(),
  exportZip: () => exportProjectZip(),
  previewShow: (name) => {
    if (name) {
      const match = previewableFiles(files).find(f => f.name.toLowerCase() === name.toLowerCase());
      if (!match) return false;
      previewPreferredEntry = match.name;
      refs.previewEntry.value = match.name;
    } else if (!previewableFiles(files).length) return false;
    if (!previewVisible) togglePreview(); else refreshPreview();
    return true;
  },
  runPython: (name) => runSelectedPython(name),
  afterHide: () => view?.focus?.()
});

const actions = {
  new: showNewDialog,
  'new-project': showProjectDialog,
  'cancel-project': () => refs.projectDialog.close(),
  'open-folder': openFolder,
  'import-folder': () => { if (confirmReplaceWorkspace()) { refs.nativeFolderInput.value = ''; refs.nativeFolderInput.click(); } },
  'save-project': saveProject,
  'export-zip': exportProjectZip,
  'toggle-preview': togglePreview,
  'toggle-terminal': () => terminal.toggle(),
  'refresh-preview': refreshPreview,
  'run-python': () => runSelectedPython(active()?.name),
  'detach-preview': detachPreview,
  'clear-errors': resetPreviewErrors,
  'copy-console': copyConsole,
  'clear-workspace': closeProject,
  'close-project': closeProject,
  'recover-backup': async () => {
    if (files.length) { toast('Cierra el proyecto actual antes de recuperar una copia.', 'error'); return; }
    returnToHome = false;
    await restorePreviousSession();
    if (!files.length) { returnToHome = true; renderWorkspace(); toast('No hay copia de emergencia disponible.', 'error'); }
  },
  open: openFiles,
  save: () => saveFile(),
  'save-as': () => saveFile(true),
  close: () => closeTab(),
  undo: () => { if (active()) { undo(view); view.focus(); } },
  redo: () => { if (active()) { redo(view); view.focus(); } },
  'toggle-sidebar': toggleSidebar,
  'sort-files': () => { sortByName = !sortByName; refs.sort.title = sortByName ? 'Mostrar orden de apertura' : 'Ordenar archivos por nombre'; refs.sort.setAttribute('aria-label', refs.sort.title); renderFileLists(); },
  format: formatActiveFile,
  'check-syntax': checkCurrentSyntax,
  comment: toggleComments,
  'fold-block': () => foldCurrentBlock(false),
  'unfold-block': () => foldCurrentBlock(true),
  'close-diagnostics': () => refs.diagnosticsDialog.close(),
  find: () => findText(false),
  replace: () => findText(true),
  settings: showSettings,
  'close-settings': () => refs.settingsDialog.close(),
  'reset-settings': () => setEditorSettings(DEFAULT_SETTINGS),
  'cancel-rename': () => refs.renameDialog.close(),
  learn: openLearnCenter,
  home: closeProject,
  shortcuts: () => showInfo('shortcuts'),
  about: () => showInfo('about'),
  'cancel-new': () => refs.newDialog.close(),
  'close-info': () => refs.infoDialog.close()
};

function closeMenus() {
  document.querySelectorAll('[data-dropdown]').forEach(menu => { menu.hidden = true; });
  document.querySelectorAll('[data-menu]').forEach(button => button.setAttribute('aria-expanded', 'false'));
}

document.addEventListener('click', (event) => {
  const menuTrigger = event.target.closest('[data-menu]');
  if (menuTrigger) {
    const dropdown = document.querySelector(`[data-dropdown="${menuTrigger.dataset.menu}"]`);
    const shouldOpen = dropdown.hidden;
    closeMenus();
    if (shouldOpen) { dropdown.hidden = false; menuTrigger.setAttribute('aria-expanded', 'true'); }
    return;
  }
  const actionButton = event.target.closest('[data-action]');
  if (actionButton) {
    closeMenus();
    actions[actionButton.dataset.action]?.();
    return;
  }
  const renameButton = event.target.closest('[data-rename-id]');
  if (renameButton) { showRenameDialog(Number(renameButton.dataset.renameId)); return; }
  const duplicateButton = event.target.closest('[data-duplicate-id]');
  if (duplicateButton) { duplicateFile(Number(duplicateButton.dataset.duplicateId)); return; }
  const closeButton = event.target.closest('[data-close-id]');
  if (closeButton) { closeTab(Number(closeButton.dataset.closeId)); return; }
  const selectButton = event.target.closest('[data-select-id]');
  if (selectButton) { activateFile(Number(selectButton.dataset.selectId)); return; }
  if (!event.target.closest('.dropdown')) closeMenus();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { closeMenus(); return; }
  if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
  if (refs.infoDialog.open || refs.newDialog.open || refs.renameDialog.open || refs.settingsDialog.open || refs.projectDialog.open || refs.unsavedDialog.open || refs.diagnosticsDialog.open) return;
  if (event.key === '/' || event.code === 'Slash') { event.preventDefault(); actions.comment(); return; }
  if (event.code === 'Backquote') { event.preventDefault(); actions['toggle-terminal'](); return; }
  const key = event.key.toLowerCase();
  const action = { n: 'new', o: 'open', s: 'save', w: 'close', f: 'find', h: 'replace' }[key];
  if (action) {
    // The browser can reserve some shortcuts; this handler works when the page receives them.
    event.preventDefault();
    if (action === 'new' && refs.newDialog.open) return;
    if (action === 'close' && (refs.newDialog.open || refs.infoDialog.open)) return;
    actions[action]();
  }
});

// Navegación con flechas en las pestañas, sin interceptar teclas dentro del editor.
refs.tabs.addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || !files.length) return;
  event.preventDefault();
  let index = files.findIndex(f => f.id === activeId);
  if (event.key === 'ArrowLeft') index = (index - 1 + files.length) % files.length;
  if (event.key === 'ArrowRight') index = (index + 1) % files.length;
  if (event.key === 'Home') index = 0;
  if (event.key === 'End') index = files.length - 1;
  activateFile(files[index].id);
  refs.tabs.querySelector(`[data-select-id="${files[index].id}"]`)?.focus();
});

// Rehidratar archivos desde IndexedDB sin restaurar automáticamente permisos de disco.
async function restorePreviousSession() {
  restoringSession = true;
  try {
    const previous = await readSession();
    if (!previous) return;
    if (files.length) return; // Recuperación manual solo con espacio vacío.
    if (!previous.files.length) return;
    project = previous.projectName ? { name: previous.projectName, dirHandle: null } : null;
    sortByName = previous.sortByName;
    if (previous.sidebarCollapsed) {
      refs.workspace.classList.add('sidebar-collapsed');
      refs.sidebar.setAttribute('aria-hidden', 'true');
      refs.sideMenu.textContent = 'Mostrar explorador';
    }
    for (const f of previous.files) insertFile({ ...f, restored: true });
    if (previous.activeIndex >= 0 && files[previous.activeIndex]) activateFile(files[previous.activeIndex].id);
    previewPreferredEntry = previous.previewEntry;
    if (previous.previewVisible) togglePreview();
    renderWorkspace();
    toast(`Sesión recuperada: ${files.length} archivo(s). Recuerda guardarlos en tu equipo.`);
  } catch (error) {
    lastBackupError = error.message;
    refs.backupStatus.textContent = 'Respaldo no disponible';
    refs.backupStatus.title = error.message;
  } finally {
    restoringSession = false;
    if (returnToHome) renderWorkspace();
    sessionReady = true;
    if (!files.length && !lastBackupError) refs.backupStatus.textContent = 'Sin archivos';
    // No sobrescribir un respaldo inválido o ilegible sin necesidad.
    if (files.length) scheduleBackup(1300);
  }
}

window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') scheduleBackup(0);
});
window.addEventListener('beforeunload', (event) => {
  if (files.some(dirty)) { event.preventDefault(); event.returnValue = ''; }
});

initSidebarTips(refs.tip, { intervalMs: 7500 });
refs.versionChip.firstChild.textContent = displayVersion(packageInfo.version) + ' ';
refs.statusVersion.textContent = 'BadDev ' + displayVersion(packageInfo.version);
renderWorkspace();
renderSettingsForm();
// La recuperación queda disponible SOLO desde Archivo → Recuperar respaldo local.
sessionReady = true;
refs.backupStatus.textContent = 'Guarda o exporta tu proyecto';
