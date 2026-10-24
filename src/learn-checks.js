// Las respuestas de código se revisan estructuralmente; no se ejecuta código del alumno.
// La comprobación es orientativa y no sustituye a un compilador ni a pruebas completas.
function stripComments(input) {
  return String(input).replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|\s)\/\/[^\n]*/g, '$1');
}
function balanced(input) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  let quote = ''; let escape = false;
  for (const char of input) {
    if (quote) {
      if (escape) escape = false;
      else if (char === '\\') escape = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (['"', "'", '`'].includes(char)) { quote = char; continue; }
    if ('({['.includes(char)) stack.push(char);
    if (')}]'.includes(char) && stack.pop() !== pairs[char]) return false;
  }
  return !quote && stack.length === 0;
}
export function checkChoice(choiceIndex, correctIndex) {
  return Number.isInteger(choiceIndex) && choiceIndex === correctIndex;
}
export function checkCode(task, code) {
  const source = stripComments(code).trim();
  if (!source) return { ok: false, message: 'Escribe tu código primero.' };
  if (!balanced(source)) return { ok: false, message: 'Revisa paréntesis, comillas y llaves: hay un cierre incompleto.' };
  if (task === 'html-button') {
    const match = source.match(/<button\s+([^>]*)>([\s\S]*?)<\/button\s*>/i);
    const attrs = match?.[1] || '';
    const text = match?.[2]?.replace(/<[^>]*>/g, '').trim().toLowerCase();
    const ok = !!match && /\b(?:id|class)\s*=\s*(?:"[^"]+"|'[^']+')/i.test(attrs) && text === 'guardar';
    return ok
      ? { ok: true, message: '¡Bien! Tu botón tiene el texto Guardar y un identificador válido.' }
      : { ok: false, message: 'Debe existir <button id="...">Guardar</button> (también sirve class).' };
  }
  if (task === 'css-body') {
    const block = source.match(/(?:^|\})\s*body\s*\{([^{}]+)\}/i);
    if (!block) return { ok: false, message: 'Crea una regla body { ... }.' };
    const rules = new Map();
    for (const item of block[1].split(';')) {
      const pos = item.indexOf(':');
      if (pos >= 0) rules.set(item.slice(0, pos).trim().toLowerCase(), item.slice(pos + 1).trim().toLowerCase());
    }
    const bg = (rules.get('background') || rules.get('background-color') || '').replace(/\s*!important\s*$/, '');
    const fg = (rules.get('color') || '').replace(/\s*!important\s*$/, '');
    const isDark = /^(#090909|#000(?:000)?|black|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\))$/.test(bg);
    const isLight = /^(#fff(?:fff)?|#f5f5f5|white|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))$/.test(fg);
    return isDark && isLight
      ? { ok: true, message: '¡Bien! Declaraste un fondo oscuro y texto claro para body.' }
      : { ok: false, message: 'Usa background: #090909; (o black) y color: #f5f5f5; (o white) dentro de body.' };
  }
  if (task === 'js-if') {
    const cond = /\bif\s*\(\s*edad\s*(?:>=\s*18|>\s*17)\s*\)\s*\{([\s\S]*?)\}/.exec(source);
    const body = cond?.[1] || '';
    const ok = !!cond && /\bconsole\s*\.\s*log\s*\(\s*(['"])mayor de edad\1\s*\)\s*;?/i.test(body);
    return ok
      ? { ok: true, message: '¡Correcto! El if comprueba edad y muestra el mensaje dentro del bloque.' }
      : { ok: false, message: 'Escribe if (edad >= 18) { console.log("Mayor de edad"); }.' };
  }
  if (task === 'js-loop') {
    const loop = /\bfor\s*\(\s*(?:let|var)\s+i\s*=\s*0\s*;\s*i\s*(?:<\s*3|<=\s*2)\s*;\s*(?:i\+\+|i\s*\+=\s*1|i\s*=\s*i\s*\+\s*1)\s*\)\s*\{([\s\S]*?)\}/.exec(source);
    const ok = !!loop && /\bconsole\s*\.\s*log\s*\(\s*i\s*\)/.test(loop[1]);
    return ok
      ? { ok: true, message: '¡Bien! Tu contador recorre 0, 1 y 2.' }
      : { ok: false, message: 'Prueba for (let i = 0; i < 3; i++) { console.log(i); }.' };
  }
  return { ok: false, message: 'Tipo de reto desconocido.' };
}
