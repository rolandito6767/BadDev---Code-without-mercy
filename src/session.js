// Fase 4 — respaldo local en IndexedDB. No guarda ni solicita permisos de archivos del equipo.
import { validFilename, extensionOf } from './files.js';
import { validProjectPath, PROJECT_TYPES, MAX_PROJECT_FILES, MAX_FILE_BYTES } from './project.js';

export const SESSION_DB = 'baddev-workspace-v4';
export const SESSION_KEY = 'current';
export const SESSION_VERSION = 1;
export const MAX_SESSION_CHARS = 9_000_000;

export function normalizeSession(raw) {
  if (!raw || typeof raw !== 'object' || raw.version !== SESSION_VERSION || !Array.isArray(raw.files)) return null;
  if (raw.files.length > MAX_PROJECT_FILES) return null;
  const projectName = typeof raw.projectName === 'string' && raw.projectName.length <= 70 ? raw.projectName : null;
  const seen = new Set();
  let chars = 0;
  const entries = [];
  for (const f of raw.files) {
    if (!f || typeof f.name !== 'string' || typeof f.content !== 'string') return null;
    const nameValid = projectName ? validProjectPath(f.name) : validFilename(f.name);
    if (!nameValid || !PROJECT_TYPES.has(extensionOf(f.name)) || f.content.length > MAX_FILE_BYTES) return null;
    const key = f.name.toLowerCase();
    if (seen.has(key)) return null;
    seen.add(key);
    // A savedContent snapshot preserves whether the disk/download copy is out of date.
    const savedContent = f.savedContent === null || typeof f.savedContent === 'string' ? f.savedContent : null;
    if (savedContent !== null && savedContent.length > MAX_FILE_BYTES) return null;
    chars += f.content.length + (savedContent?.length || 0);
    if (chars > MAX_SESSION_CHARS) return null;
    entries.push({
      name: f.name, content: f.content, savedContent,
      lastSaveMode: ['disk', 'download', 'new'].includes(f.lastSaveMode) ? f.lastSaveMode : 'new',
      cursor: Number.isSafeInteger(f.cursor) ? Math.max(0, Math.min(f.cursor, f.content.length)) : 0
    });
  }
  const index = Number.isInteger(raw.activeIndex) ? raw.activeIndex : -1;
  return {
    version: SESSION_VERSION, projectName, files: entries,
    activeIndex: Math.max(-1, Math.min(index, entries.length - 1)),
    previewVisible: raw.previewVisible === true,
    sidebarCollapsed: raw.sidebarCollapsed === true,
    sortByName: raw.sortByName === true,
    previewEntry: typeof raw.previewEntry === 'string' ? raw.previewEntry.slice(0, 240) : '',
    updatedAt: Number.isFinite(raw.updatedAt) ? raw.updatedAt : Date.now()
  };
}

// Database connection is lazily opened and shared between reads/writes.
let databasePromise;
function db() {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('IndexedDB no está disponible en este navegador.'));
  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(SESSION_DB, 1);
      request.onupgradeneeded = () => request.result.createObjectStore('sessions');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('No se pudo abrir IndexedDB.'));
      request.onblocked = () => reject(new Error('La base de datos está bloqueada por otra pestaña.'));
    }).catch(error => { databasePromise = null; throw error; });
  }
  return databasePromise;
}
async function operation(mode, method, value) {
  const database = await db();
  return new Promise((resolve, reject) => {
    let result;
    const transaction = database.transaction('sessions', mode);
    const store = transaction.objectStore('sessions');
    const request = method === 'get' ? store.get(SESSION_KEY) : method === 'put' ? store.put(value, SESSION_KEY) : store.delete(SESSION_KEY);
    request.onsuccess = () => { result = request.result; };
    transaction.oncomplete = () => resolve(result);
    transaction.onerror = () => reject(transaction.error || new Error('Falló IndexedDB.'));
    transaction.onabort = () => reject(transaction.error || new Error('Se interrumpió el respaldo.'));
  });
}
export async function readSession() {
  const raw = await operation('readonly', 'get');
  return raw ? normalizeSession(raw) : null;
}
export async function writeSession(snapshot) {
  const clean = normalizeSession(snapshot);
  if (!clean) throw new Error('El proyecto es demasiado grande o contiene archivos no compatibles para restauración automática.');
  await operation('readwrite', 'put', clean);
}
export async function removeSession() { await operation('readwrite', 'delete'); }
