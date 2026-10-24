// BadDev Python: Worker aislado del DOM. Necesita Internet la primera vez.
// Versión fija de Pyodide, no un enlace cambiante a "latest".
const PYODIDE_BASE = 'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/';
let pyodidePromise = null;
let pyodide = null;
const OUTPUT_LIMIT = 32000;
let outputLength = 0;
let executing = false;
function output(id, stream, message) {
  let text = String(message ?? '');
  if (outputLength >= OUTPUT_LIMIT) return;
  text = text.slice(0, OUTPUT_LIMIT - outputLength);
  outputLength += text.length;
  self.postMessage({ type: 'output', id, stream, text });
}
async function prepare() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      self.importScripts(PYODIDE_BASE + 'pyodide.js');
      return self.loadPyodide({ indexURL: PYODIDE_BASE, stdout: () => {}, stderr: () => {} });
    })();
  }
  try { pyodide = await pyodidePromise; return pyodide; }
  catch (error) { pyodidePromise = null; throw error; }
}
self.onmessage = async (event) => {
  const data = event.data || {};
  if (data.type !== 'run' || executing) return;
  const id = data.id;
  if (typeof data.code !== 'string' || data.code.length > 100000) {
    self.postMessage({type:'error', id, message:'Archivo Python demasiado grande (máximo 100 KB).'});
    return;
  }
  executing = true;
  outputLength = 0;
  try {
    const runtime = await prepare();
    self.postMessage({ type: 'started', id });
    const inputLines = String(data.input ?? '').split(/\r?\n/);
    let inputIndex = 0;
    runtime.setStdout({ batched: (msg) => output(id, 'stdout', msg) });
    runtime.setStderr({ batched: (msg) => output(id, 'stderr', msg) });
    runtime.setStdin({ stdin: () => inputIndex < inputLines.length ? inputLines[inputIndex++] : null });
    const result = await runtime.runPythonAsync(data.code, { filename: data.filename || 'main.py' });
    if (result !== undefined && result !== null) output(id, 'result', String(result));
    self.postMessage({ type: 'done', id });
  } catch (error) {
    self.postMessage({ type: 'error', id, message: String(error?.message || error).slice(0, 1800) });
  } finally { executing = false; }
};
