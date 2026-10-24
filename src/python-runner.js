// Orquesta los dos motores Python de BadDev. Nunca ejecuta código al abrir un archivo.
export const PYTHON_BRIDGE_URL = 'http://127.0.0.1:8765';
export const PYTHON_MAX_SOURCE = 100_000;
export const PYTHON_RUNTIME_LIMIT = 12000;

export function checkPythonSource(code) {
  if (typeof code !== 'string' || !code.trim()) return 'Escribe código Python antes de ejecutarlo.';
  if (code.length > PYTHON_MAX_SOURCE) return 'Máximo 100 KB de código Python por ejecución.';
  return null;
}

export function createPythonRunner({ onOutput = () => {}, onStatus = () => {}, onBusy = () => {} } = {}) {
  let worker = null;
  let requestId = 0;
  let timer = null;
  let controller = null;
  let busy = false;
  let mode = '';
  function setBusy(value) { busy = value; onBusy(value); }
  function clearTimers() { clearTimeout(timer); timer = null; }
  function stop(notify = true) {
    requestId++;
    clearTimers();
    if (worker) { worker.terminate(); worker = null; }
    if (controller) { controller.abort(); controller = null; }
    if (busy && notify) onStatus('Ejecución detenida.');
    setBusy(false); mode = '';
  }
  function startBrowser({ code, filename, input }) {
    const error = checkPythonSource(code);
    if (error) { onStatus(error); return false; }
    stop(false);
    const id = ++requestId;
    mode = 'browser';
    setBusy(true);
    onStatus('Descargando o iniciando Pyodide… La primera ejecución necesita Internet.');
    worker = new Worker(new URL('./python-worker.js', import.meta.url), { type: 'classic' });
    timer = setTimeout(() => {
      if (id !== requestId) return;
      onStatus('La carga de Python tardó demasiado. Revisa la conexión a Internet.');
      stop(false);
    }, 70_000);
    worker.onmessage = (event) => {
      if (id !== requestId || mode !== 'browser') return;
      const data = event.data || {};
      if (data.id !== id) return;
      if (data.type === 'started') {
        clearTimers();
        onStatus('Ejecutando Python en el navegador…');
        timer = setTimeout(() => {
          if (id !== requestId) return;
          onStatus('Límite de 12 segundos alcanzado: Python detenido.');
          stop(false);
        }, PYTHON_RUNTIME_LIMIT);
      } else if (data.type === 'output') {
        onOutput(data.stream, data.text);
      } else if (data.type === 'error') {
        onOutput('stderr', data.message);
        onStatus('Python terminó con un error.');
        stop(false);
      } else if (data.type === 'done') {
        onStatus('Ejecución Python completada.');
        stop(false);
      }
    };
    worker.onerror = () => {
      if (id !== requestId) return;
      onStatus('No se pudo iniciar Pyodide. Revisa tu conexión a Internet o bloqueadores.');
      stop(false);
    };
    worker.postMessage({ type:'run', id, code, filename, input });
    return true;
  }
  async function startLocal({ code, filename, input }) {
    const error = checkPythonSource(code);
    if (error) { onStatus(error); return false; }
    stop(false);
    const id = ++requestId;
    mode = 'local';
    setBusy(true);
    controller = new AbortController();
    const signal = controller.signal;
    onStatus('Conectando con Python local…');
    try {
      const response = await fetch(PYTHON_BRIDGE_URL + '/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, filename, input }),
        signal
      });
      const data = await response.json();
      if (id !== requestId) return false;
      if (data.stdout) onOutput('stdout', data.stdout);
      if (data.stderr) onOutput('stderr', data.stderr);
      if (!response.ok) onOutput('stderr', data.error || 'Error del complemento local.');
      onStatus(data.timedOut ? 'Python local se detuvo por el límite de tiempo.' : response.ok && data.exitCode === 0 ? 'Python local terminó correctamente.' : 'Python local terminó con un error.');
    } catch (error) {
      if (id !== requestId) return false;
      onStatus('Complemento local no disponible. En Windows ejecuta: npm run python:bridge');
    } finally {
      if (id === requestId) { controller = null; setBusy(false); mode = ''; }
    }
    return true;
  }
  return {
    run({ engine, code, filename, input = '' }) {
      return engine === 'local' ? startLocal({code,filename,input}) : startBrowser({code,filename,input});
    },
    stop,
    isBusy() { return busy; }
  };
}
