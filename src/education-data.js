import { CATALOG, BASE_LESSON_IDS, BASE_MANUAL_IDS } from './learn-catalog.js';
import { LESSONS } from './learn-data.js';
import { MANUAL_SECTIONS } from './manual-data.js';
import { EDUCATION_SOURCE } from './education-content.js';

const uniq = list => [...new Set(list)];
const toLesson = (lang, topic, index) => ({
  id: `e-${lang.id}-${index + 1}`,
  languageId: lang.id,
  group: index < 2 ? 'Fundamentos' : 'Aplicación',
  title: topic.title,
  subtitle: topic.overview,
  time: index === 3 ? '9 min' : '7 min',
  objective: topic.detail,
  paragraphs: [topic.overview, topic.detail],
  tips: [topic.detail, EDUCATION_SOURCE[lang.id].practices[index % 3]],
  example: { language: lang.id, code: topic.code, note: topic.detail },
  challenge: { ...topic.challenge, ...(topic.challenge.type === 'code' ? { task: `e-${topic.challenge.task}` } : {}) },
  solution: {
    code: topic.challenge.type === 'choice' ? topic.code : topic.solution,
    why: topic.challenge.explanation,
    answer: topic.challenge.type === 'choice' ? topic.challenge.choices[topic.challenge.answer] : null
  },
  summary: uniq([topic.overview, topic.challenge.explanation, EDUCATION_SOURCE[lang.id].practices[index % 3]])
});

const ORIGINAL_SOLUTIONS = {
  'html-button': '<button class="boton">Guardar</button>',
  'css-body': 'body {\n  background: #090909;\n  color: #f5f5f5;\n}',
  'js-if': 'if (edad >= 18) { console.log("Mayor de edad"); }',
  'js-loop': 'for (let i = 0; i < 3; i++) { console.log(i); }'
};
const legacyLesson = lesson => ({
  ...lesson,
  objective: lesson.paragraphs[1] || lesson.subtitle,
  solution: {
    code: lesson.challenge.type === 'choice'
      ? lesson.example.code
      : ORIGINAL_SOLUTIONS[lesson.challenge.task] || lesson.example.code,
    answer: lesson.challenge.type === 'choice'
      ? lesson.challenge.choices[lesson.challenge.answer]
      : null,
    why: lesson.challenge.explanation
  },
  summary: uniq([lesson.subtitle, lesson.challenge.explanation, ...lesson.tips.slice(0, 2)])
});

/** Cursos con los 13 ejercicios originales más los 48 nuevos. */
export const COURSE_LESSONS = Object.freeze(Object.fromEntries(CATALOG.map(lang => {
  const base = new Set(BASE_LESSON_IDS[lang.id] || []);
  return [lang.id, [
    ...LESSONS.filter(item => base.has(item.id)).map(legacyLesson),
    ...EDUCATION_SOURCE[lang.id].topics.map((topic, i) => toLesson(lang, topic, i))
  ]];
})));

function manualSection(lang, index, title, subtitle, group, theory, bullets, code, extras = {}) {
  return {
    id: `m-${lang.id}-${index}`,
    group,
    title,
    subtitle,
    theory,
    bullets,
    example: { language: lang.id, code },
    ...extras
  };
}

function languageManual(lang) {
  const source = EDUCATION_SOURCE[lang.id];
  const [t1, t2, t3, t4] = source.topics;
  const l = lang.name;
  const glossary = Object.entries(source.glossary).map(([term, definition]) => ({term, definition}));
  return [
    manualSection(lang, 1, `Qué es ${l}`, 'Una introducción para leer sin ejercicios.', 'Introducción',
      [source.intro, lang.note, `Antes de crear proyectos grandes, identifica qué representa un archivo ${lang.ext} y qué herramientas externas hacen falta para utilizarlo.`],
      [t1.overview, t2.overview, lang.note], lang.code),
    manualSection(lang, 2, 'Sintaxis esencial', 'Cómo se escribe y se interpreta.', 'Sintaxis',
      [t1.overview, t1.detail, 'La sintaxis define las reglas de escritura. Un archivo puede verse bien coloreado en BadDev y aun contener un error: revisa siempre su estructura.'],
      [t1.challenge.explanation, ...source.practices.slice(0, 2)], t1.code),
    manualSection(lang, 3, 'Estructuras y datos', 'Patrones que verás en proyectos reales.', 'Sintaxis',
      [t2.overview, t2.detail, 'Estudia primero qué dato o elemento recibe cada operación y qué resultado produce. Esta relación es más útil que memorizar símbolos aislados.'],
      [t2.challenge.explanation, source.practices[0], source.mistakes[0]], t2.code),
    manualSection(lang, 4, 'Uso práctico', 'Organizar y combinar conceptos.', 'Aplicación',
      [t3.overview, t3.detail, t4.detail],
      [t3.challenge.explanation, t4.challenge.explanation, source.practices[1]], t4.code),
    manualSection(lang, 5, 'Buenas prácticas', 'Reglas para escribir con claridad.', 'Calidad',
      [`Con ${l}, un ejemplo corto que se entiende suele ser más útil que una solución extensa que no sabes mantener.`, source.intro, 'Revisa estos criterios al escribir y al leer proyectos ajenos.'],
      source.practices, t2.code, { bestPractices: source.practices }),
    manualSection(lang, 6, 'Errores frecuentes y glosario', 'Referencia rápida para cuando algo falle.', 'Referencia',
      [`Los errores de ${l} pueden depender tanto de la sintaxis como de las herramientas que lo interpretan.`, 'Comprueba un cambio por vez y compara el comportamiento con un ejemplo pequeño antes de modificar todo el proyecto.'],
      source.mistakes, t3.code, { commonMistakes: source.mistakes, glossary })
  ];
}

/** Manuales de solo lectura: seis secciones nuevas por lenguaje, con guía anterior conservada. */
export const COURSE_MANUALS = Object.freeze(Object.fromEntries(CATALOG.map(lang => {
  const old = new Set(BASE_MANUAL_IDS[lang.id] || []);
  return [lang.id, [
    ...MANUAL_SECTIONS.filter(section => old.has(section.id)).map(section => ({ ...section, id: `legacy-${lang.id}-${section.id}` })),
    ...languageManual(lang)
  ]];
})));

export const EDUCATION_TOTALS = Object.freeze({
  languages: CATALOG.length,
  newLessons: CATALOG.reduce((total, lang) => total + EDUCATION_SOURCE[lang.id].topics.length, 0),
  manualSections: CATALOG.reduce((total, lang) => total + COURSE_MANUALS[lang.id].length, 0)
});

export function findCourseLessonById(id) {
  if (!id) return null;
  for (const [languageId, lessons] of Object.entries(COURSE_LESSONS)) {
    const lesson = lessons.find(item => item.id === id);
    if (lesson) return { languageId, lesson };
  }
  return null;
}
