/* Comprobaciones orientativas de estructura, sin ejecutar ni evaluar el código del alumno.
   Las respuestas aceptadas no sustituyen al intérprete o validador del lenguaje. */
const output = (ok, hint = 'Revisa el objetivo y el ejemplo de la lección.') => ({
  ok,
  message: ok ? 'Estructura reconocida. ¡Bien! Consulta la explicación de la solución.' : hint
});
const has = (source, regex) => regex.test(source);
const all = (source, patterns) => patterns.every(re => has(source, re));
function stripped(source) {
  return String(source ?? '').trim().replace(/\r\n?/g, '\n');
}
export function checkEducationCode(task, input) {
  const s = stripped(input);
  if (!s) return output(false, 'Escribe una respuesta antes de comprobar.');
  // No eval, Function, imports ni network. Las expresiones aquí solo inspeccionan texto.
  switch(task) {
    case 'html-link': return output(all(s, [/<a\b[^>]*\bhref\s*=\s*['"]contacto\.html['"][^>]*>/i, />\s*Contacto\s*<\/a\s*>/i]));
    case 'html-label': return output(all(s, [/<label\b[^>]*\bfor\s*=\s*['"]correo['"][^>]*>\s*Correo\s*<\/label>/i, /<input\b[^>]*\bid\s*=\s*['"]correo['"]/i]));
    case 'css-variable': return output(all(s, [/--acento\s*:\s*#[0-9a-f]{3,8}\b/i, /color\s*:\s*var\(\s*--acento\s*\)/i]));
    case 'css-media': return output(all(s, [/@media\s*\(\s*max-width\s*:\s*600px\s*\)/i, /\.grid\s*\{[^}]*grid-template-columns\s*:\s*1fr\b/i]));
    case 'js-sum': return output(all(s, [/\bfunction\s+sumar\s*\(\s*a\s*,\s*b\s*\)\s*\{/i, /\breturn\s+a\s*\+\s*b\s*;?/i]));
    case 'js-click': return output(all(s, [/querySelector\s*\(\s*['"]#boton['"]\s*\)/i, /addEventListener\s*\(\s*['"]click['"]/i, /console\.log\s*\(\s*['"]Hola['"]\s*\)/i]));
    case 'ts-sum': return output(all(s, [/function\s+sumar\s*\(\s*a\s*:\s*number\s*,\s*b\s*:\s*number\s*\)\s*:\s*number/i, /return\s+a\s*\+\s*b\b/i]));
    case 'ts-union': return output(has(s, /(?:let|const)\s+id\s*:\s*(?:string\s*\|\s*number|number\s*\|\s*string)\s*=\s*10\b/i));
    case 'py-if': return output(has(s, /(?:^|\n)if\s+edad\s*>=\s*18\s*:\s*\n[ \t]+print\s*\(\s*['"]Mayor['"]\s*\)/));
    case 'py-double': return output(has(s, /(?:^|\n)def\s+doble\s*\(\s*n\s*\)\s*:\s*\n[ \t]+return\s+n\s*\*\s*2\b/));
    case 'php-echo': return output(all(s, [/\$nombre\s*=\s*['"]BadDev['"]\s*;/i, /\becho\s+\$nombre\s*;/i]));
    case 'php-if': return output(all(s, [/\bif\s*\(\s*\$total\s*>=\s*40\s*\)\s*\{/i, /\becho\s+['"]Envío gratis['"]\s*;/i]));
    case 'json-product': {
      try { const o=JSON.parse(s); return output(!!o && !Array.isArray(o) && o.producto==='Cacao' && o.precio===40); }
      catch { return output(false, 'JSON inválido: recuerda comillas dobles y elimina las comas finales.'); }
    }
    case 'json-stock': {
      try { const o=JSON.parse(s); return output(!!o && !Array.isArray(o) && o.activo===true && o.stock===3); }
      catch { return output(false, 'JSON inválido. Escribe true y 3 sin comillas.'); }
    }
    case 'md-list': return output(all(s, [/^\s*-\s+Crear\s*$/mi, /^\s*-\s+Guardar\s*$/mi]));
    case 'md-code': return output(has(s, /```(?:javascript|js)\s*\n[\s\S]*?console\.log\s*\(\s*['"]Hola['"]\s*\)\s*;?[\s\S]*?\n```/i));
    case 'sql-filter': return output(all(s, [/\bSELECT\s+nombre\s+FROM\s+productos\b/i, /\bWHERE\s+precio\s*>\s*20\b/i]));
    case 'sql-insert': return output(all(s, [/\bINSERT\s+INTO\s+productos\s*\(\s*nombre\s*,\s*precio\s*\)/i, /\bVALUES\s*\(\s*['"]Cacao['"]\s*,\s*40\s*\)/i]));
    case 'scss-color': return output(all(s, [/\$acento\s*:\s*#ff1744\s*;/i, /\.boton\s*\{[^}]*background\s*:\s*\$acento\s*;/i]));
    case 'scss-hover': return output(has(s, /\.boton\s*\{[\s\S]*?&:hover\s*\{[^}]*color\s*:\s*white\s*;/i));
    case 'xml-store': {
      const ok = /<tienda>\s*<nombre>BadDev<\/nombre>\s*<\/tienda>/i.test(s);
      return output(ok);
    }
    case 'xml-product': return output(all(s, [/<producto\s+id\s*=\s*['"]c1['"]\s*>/i, /<nombre>\s*Cacao\s*<\/nombre>/i, /<\/producto>/i]));
    case 'yaml-languages': return output(has(s, /^lenguajes:\s*\n[ ]+-\s+HTML\s*\n[ ]+-\s+Python\s*$/im));
    case 'yaml-server': return output(has(s, /^servidor:\s*\n([ ]+)puerto:\s*3000\s*\n\1activo:\s*true\s*$/im));
    default: return output(false, 'La comprobación de este ejercicio no está configurada.');
  }
}
