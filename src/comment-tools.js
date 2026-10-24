// Alternar comentarios sin ejecutar el código. Retorna cambios compatibles con CodeMirror.
import { extensionOf } from './languages.js';

const LINE_MARKS = new Map([
  ['js','//'], ['mjs','//'], ['ts','//'], ['py','#'], ['php','//'],
  ['sql','--'], ['scss','//'], ['yaml','#'], ['yml','#']
]);
const BLOCK_MARKS = new Map([
  ['html',['<!--','-->']], ['htm',['<!--','-->']],
  ['xml',['<!--','-->']], ['md',['<!--','-->']], ['css',['/*','*/']]
]);
export function commentStyle(filename) {
  const ext = extensionOf(filename);
  if (ext === 'json') return { type: 'unsupported', reason: 'JSON estándar no permite comentarios.' };
  if (LINE_MARKS.has(ext)) return { type:'line', token: LINE_MARKS.get(ext) };
  if (BLOCK_MARKS.has(ext)) return { type:'block', open: BLOCK_MARKS.get(ext)[0], close: BLOCK_MARKS.get(ext)[1] };
  return { type:'unsupported', reason: 'No hay una sintaxis de comentarios para este tipo de archivo.' };
}

export function commentChanges(filename, source, anchor, head = anchor) {
  const text = String(source);
  const start = Math.max(0, Math.min(text.length, Math.min(anchor, head)));
  const end = Math.max(start, Math.min(text.length, Math.max(anchor, head)));
  const style = commentStyle(filename);
  if (style.type === 'unsupported') return { ok: false, message: style.reason, changes: [] };

  if (style.type === 'block') {
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const lineEndPos = text.indexOf('\n', end);
    const lineEnd = lineEndPos < 0 ? text.length : lineEndPos;
    const from = start === end ? lineStart : start;
    const to = start === end ? lineEnd : end;
    const selection = text.slice(from, to);
    const leading = selection.match(/^\s*/)?.[0] || '';
    const trailing = selection.match(/\s*$/)?.[0] || '';
    const core = selection.slice(leading.length, selection.length - trailing.length);
    if (!core) return { ok: false, message: 'Selecciona un texto para comentar.', changes: [] };
    const open = `${style.open} `, close = ` ${style.close}`;
    const hasComment = core.startsWith(open) && core.endsWith(close);
    if (!hasComment && core.includes(style.close)) return { ok: false, message: 'El texto contiene un cierre de comentario que impide envolverlo con seguridad.', changes: [] };
    const replaced = hasComment ? core.slice(open.length, -close.length) : `${open}${core}${close}`;
    return { ok:true, changes:[{from,to,insert:leading + replaced + trailing}], message: hasComment ? 'Comentario quitado.' : 'Comentario agregado.' };
  }

  const selectedEnd = end > start ? end - 1 : end; // No comentar la siguiente línea si termina justo al inicio.
  const segments = [];
  let at = 0;
  for (const line of text.split('\n')) {
    const after = at + line.length;
    if (after >= start && at <= selectedEnd) segments.push({ from: at, to: after, value: line });
    at = after + 1;
  }
  const nonempty = segments.filter(row => row.value.trim());
  if (!nonempty.length) return { ok:false, changes:[], message:'No hay contenido para comentar.' };
  const marker = style.token;
  const allCommented = nonempty.every(row => row.value.trimStart().startsWith(marker));
  const changes = nonempty.map(row => {
    const [, indentation = '', rest = ''] = row.value.match(/^(\s*)(.*)$/) || [];
    const commented = allCommented ? rest.slice(marker.length + (rest[marker.length] === ' ' ? 1 : 0)) : marker + ' ' + rest;
    return { from: row.from, to: row.to, insert: indentation + commented };
  });
  return { ok:true, changes, message: allCommented ? 'Comentarios quitados.' : 'Comentarios agregados.' };
}
