// Muestra V mayor.menor y agrega el parche cuando corresponde (p. ej. V 1.0.2).
export function displayVersion(version) {
  const match = /^(\d+)\.(\d+)(?:\.(\d+))?(?:[-+][a-z0-9.-]+)?$/i.exec(version || '');
  if (!match) return 'V ?';
  const patch = Number(match[3] || 0);
  return `V ${match[1]}.${match[2]}${patch ? `.${patch}` : ''}`;
}
