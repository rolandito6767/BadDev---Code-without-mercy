// Preferencias de edición: valores comprobados y persistencia opcional.
export const SETTINGS_KEY = 'baddev.settings.v2';
export const DEFAULT_SETTINGS = Object.freeze({ fontSize: 14, tabSize: 2, wordWrap: false, theme: 'demon' });

export function normalizeSettings(input) {
  const source = input && typeof input === 'object' ? input : {};
  const size = Number(source.fontSize);
  return {
    fontSize: Number.isInteger(size) && size >= 12 && size <= 22 ? size : DEFAULT_SETTINGS.fontSize,
    tabSize: [2, 4].includes(Number(source.tabSize)) ? Number(source.tabSize) : DEFAULT_SETTINGS.tabSize,
    wordWrap: typeof source.wordWrap === 'boolean' ? source.wordWrap : DEFAULT_SETTINGS.wordWrap,
    theme: ['demon','purple','green','angel','slayer'].includes(source.theme) ? source.theme : 'demon'
  };
}

export function loadSettings(storage = globalThis.localStorage) {
  try { return normalizeSettings(JSON.parse(storage.getItem(SETTINGS_KEY))); }
  catch { return { ...DEFAULT_SETTINGS }; }
}

export function saveSettings(settings, storage = globalThis.localStorage) {
  const clean = normalizeSettings(settings);
  try { storage.setItem(SETTINGS_KEY, JSON.stringify(clean)); return true; }
  catch { return false; }
}
