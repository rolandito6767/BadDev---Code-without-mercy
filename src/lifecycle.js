// La copia local del navegador nunca equivale a un archivo exportado.
export function unsavedFiles(files) {
  return files.filter(file => file.savedContent === null || file.content !== file.savedContent || Boolean(file.restored) || !['disk', 'download'].includes(file.lastSaveMode));
}
