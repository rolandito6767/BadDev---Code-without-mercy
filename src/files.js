// File System Access API cuando esté disponible; descarga real como alternativa.
import {
  EXTENSION_LABELS, STARTER_CODE, extensionOf, fileLanguage,
  pickerExtensions
} from './languages.js';

export { EXTENSION_LABELS, STARTER_CODE, extensionOf, fileLanguage };

export function validFilename(name) {
  return typeof name === 'string' && name.length > 0 && name.length <= 100 && !/[\\/:*?"<>|\x00-\x1F]/.test(name) && !/[. ]$/.test(name) && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i.test(name);
}

export function makeUniqueName(name, usedNames) {
  const used = new Set(usedNames.map(n => n.toLowerCase()));
  if (!used.has(name.toLowerCase())) return name;
  const dot = name.lastIndexOf('.');
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : '';
  let n = 2;
  while (used.has(`${stem} (${n})${ext}`.toLowerCase())) n++;
  return `${stem} (${n})${ext}`;
}

export async function chooseFiles() {
  if (typeof window.showOpenFilePicker !== 'function') return null;
  return window.showOpenFilePicker({
    multiple: true,
    types: [{ description: 'Archivos de código BadDev', accept: { 'text/plain': pickerExtensions() } }]
  });
}

export async function writeFile(file, forceNewHandle = false) {
  let handle = forceNewHandle ? null : file.handle;
  if (!handle && typeof window.showSaveFilePicker === 'function') {
    const extension = extensionOf(file.name);
    const ext = `.${extension}`;
    // MIME seguro y compatible con el selector de archivos en Chrome para archivos de texto.
    handle = await window.showSaveFilePicker({
      suggestedName: file.name,
      types: [{ description: `${fileLanguage(file.name)} (${ext})`, accept: { 'text/plain': [ext] } }]
    });
  }
  if (handle) {
    const writer = await handle.createWritable();
    try { await writer.write(file.content); }
    finally { await writer.close(); }
    return { handle, name: handle.name, mode: 'disk' };
  }

  // Una descarga NO sobrescribe un archivo descargado previamente.
  const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return { handle: null, name: file.name, mode: 'download' };
}
