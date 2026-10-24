import { basicSetup, EditorView } from 'codemirror';
import { EditorState, Compartment, Prec } from '@codemirror/state';
import { oneDarkHighlightStyle } from '@codemirror/theme-one-dark';
import { syntaxHighlighting, indentUnit } from '@codemirror/language';
import { keymap } from '@codemirror/view';
import { redo } from '@codemirror/commands';
import { search, openSearchPanel } from '@codemirror/search';
import { extensionOf } from './files.js';
import { indentSizeForFile } from './languages.js';
import { cachedLanguageSupport, loadLanguageSupport, completionExtensionsFor } from './language-support.js';

const fontCompartment = new Compartment();
const indentCompartment = new Compartment();
const wrapCompartment = new Compartment();
const languageCompartment = new Compartment();
const completionsCompartment = new Compartment();

const darkTheme = EditorView.theme({
  '&': { height: '100%', backgroundColor: '#0B0B0B', color: '#E8E8E8' },
  '.cm-scroller': { overflow: 'auto', fontFamily: '"Cascadia Code", Consolas, "Courier New", monospace', lineHeight: '1.75' },
  '.cm-content': { caretColor: '#FF1744', padding: '21px 0' },
  '.cm-gutters': { backgroundColor: '#0B0B0B', color: '#646464', borderRight: '1px solid #222', paddingLeft: '10px' },
  '.cm-activeLine': { backgroundColor: '#1C1216' },
  '.cm-activeLineGutter': { backgroundColor: '#201115', color: '#FF506C' },
  '&.cm-focused .cm-cursor': { borderLeftColor: '#FF1744' },
  '&.cm-focused .cm-selectionBackground, ::selection': { backgroundColor: '#6B2135' },
  '.cm-selectionBackground': { backgroundColor: '#4C1C2A' },
  '.cm-matchingBracket': { backgroundColor: '#4A2030', outline: '1px solid #D90B2B' },
  '.cm-panels': { backgroundColor: '#161616', color: '#f5f5f5' },
  '.cm-panels.cm-panels-top': { borderBottom: '1px solid #55222d' },
  '.cm-search': { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', padding: '11px 16px' },
  '.cm-search input': { backgroundColor: '#0e0e0e', color: '#fff', border: '1px solid #4b3137', borderRadius: '5px', padding: '7px' },
  '.cm-search input:focus': { borderColor: '#FF1744', outline: '1px solid #FF174466' },
  '.cm-search button': { backgroundColor: '#23171b', color: '#eee', border: '1px solid #65303c', borderRadius: '5px', padding: '6px 9px' },
  '.cm-search button:hover': { backgroundColor: '#4a1423', borderColor: '#ff1744' },
  '.cm-search label': { fontSize: '12px' },
  '.cm-tooltip': { backgroundColor: '#181818', border: '1px solid #59202d', color: '#f2f2f2', boxShadow: '0 10px 26px #000b' },
  '.cm-tooltip-autocomplete ul li[aria-selected]': { backgroundColor: '#4E1523', color: '#fff' },
  '.cm-completionMatchedText': { color: '#ff4b6b', textDecoration: 'none', fontWeight: 'bold' }
}, { dark: true });

const fontExtension = (settings) => EditorView.theme({ '&': { fontSize: `${settings.fontSize}px` } });
const indentExtension = (settings, name) => {
  const size = indentSizeForFile(name, settings.tabSize);
  return [EditorState.tabSize.of(size), indentUnit.of(' '.repeat(size))];
};
const wrapExtension = (settings) => settings.wordWrap ? EditorView.lineWrapping : [];
const effectsFor = (settings, name) => [
  fontCompartment.reconfigure(fontExtension(settings)),
  indentCompartment.reconfigure(indentExtension(settings, name)),
  wrapCompartment.reconfigure(wrapExtension(settings))
];

export function createEditor(parent, onUpdate, initialSettings, handlers = {}) {
  let settings = { ...initialSettings };
  const stateForFile = (file) => EditorState.create({
    doc: file.content,
    selection: { anchor: Math.max(0, Math.min(Number(file.cursor) || 0, file.content.length)) },
    extensions: [
      basicSetup,
      languageCompartment.of(cachedLanguageSupport(file.name)),
      darkTheme,
      syntaxHighlighting(oneDarkHighlightStyle),
      EditorState.phrases.of({
        Find: 'Buscar', Replace: 'Reemplazar', next: 'Siguiente', previous: 'Anterior', all: 'Todos',
        replace: 'Reemplazar', 'replace all': 'Reemplazar todos', 'match case': 'Distinguir mayúsculas',
        regexp: 'Expresión regular', 'by word': 'Palabra completa', close: 'Cerrar'
      }),
      fontCompartment.of(fontExtension(settings)),
      indentCompartment.of(indentExtension(settings, file.name)),
      wrapCompartment.of(wrapExtension(settings)),
      search({ top: true }),
      completionsCompartment.of(completionExtensionsFor(file.name)),
      Prec.highest(keymap.of([{ key: 'Mod-/', run: () => { handlers.onComment?.(); return true; } }, { key: 'Mod-h', run: (view) => {
        openSearchPanel(view);
        const replaceInput = view.dom.querySelector('.cm-search input[name="replace"]');
        if (replaceInput) { replaceInput.focus(); replaceInput.select(); }
        return true;
      } }, { key: 'Ctrl-y', run: redo }])),
      EditorView.updateListener.of(onUpdate)
    ]
  });
  const view = new EditorView({ state: stateForFile({ name: 'sin-archivo.txt', content: '' }), parent });
  const updateSettings = (next, inactiveFiles, activeName = '') => {
    settings = { ...next };
    view.dispatch({ effects: effectsFor(settings, activeName) });
    for (const file of inactiveFiles) {
      if (file.editorState) file.editorState = file.editorState.update({ effects: effectsFor(settings, file.name) }).state;
    }
  };
  // Los cambios de lenguaje preservan el historial y nunca se aplican a otra pestaña.
  const applyLanguage = (file, support, isCurrent) => {
    const effects = [
      languageCompartment.reconfigure(support),
      indentCompartment.reconfigure(indentExtension(settings, file.name)),
      completionsCompartment.reconfigure(completionExtensionsFor(file.name, support))
    ];
    if (isCurrent()) {
      view.dispatch({ effects });
      file.editorState = view.state;
    } else if (file.editorState) {
      file.editorState = file.editorState.update({ effects }).state;
    }
  };

  // Las extensiones nuevas se importan de forma diferida: el inicio de BadDev no carga 9 parsers.
  function changeLanguage(file, isCurrent = () => true, onError = () => {}) {
    const originalName = file.name;
    const initialSupport = cachedLanguageSupport(originalName);
    applyLanguage(file, initialSupport, isCurrent);
    void loadLanguageSupport(originalName).then(support => {
      if (file.name !== originalName) return;
      applyLanguage(file, support, isCurrent);
    }).catch(error => {
      if (isCurrent()) onError(`No se pudo cargar el resaltado de ${originalName}: ${error.message}`);
      console.error('BadDev language support:', originalName, error);
    });
  }
  return { view, stateForFile, updateSettings, changeLanguage };
}
