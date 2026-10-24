const shortcutGroups = [
  { combo: 'Ctrl + N', text: 'Crear un archivo nuevo.' },
  { combo: 'Ctrl + O', text: 'Abrir archivos desde tu equipo.' },
  { combo: 'Ctrl + S', text: 'Guardar el archivo activo o el proyecto.' },
  { combo: 'Ctrl + F', text: 'Buscar texto en el archivo actual.' },
  { combo: 'Ctrl + H', text: 'Buscar y reemplazar.' },
  { combo: 'Ctrl + W', text: 'Cerrar la pestaña actual.' },
  { combo: 'Ctrl + Espacio', text: 'Mostrar sugerencias de código.' },
  { combo: 'Ctrl + Z / Ctrl + Y', text: 'Deshacer y rehacer cambios.' }
];

export function evaluateExercise(kind, answer) {
  const value = String(answer || '').trim();
  const normalized = value.toLowerCase().replace(/\s+/g, ' ');
  if (!value) return { ok: false, message: 'Escribe una respuesta antes de comprobar.' };

  if (kind === 'logic-if') {
    const ok = normalized.includes('if') && normalized.includes('edad') && (normalized.includes('>= 18') || normalized.includes('>=18') || normalized.includes('> 17')) && normalized.includes('mayor');
    return ok
      ? { ok: true, message: '¡Bien! Usaste una condición para decidir si la persona es mayor de edad.' }
      : { ok: false, message: 'Pista: usa if, la variable edad y una comparación con 18.' };
  }

  if (kind === 'html-button') {
    const ok = /<button\b/i.test(value) && /guardar/i.test(value) && (/class\s*=\s*['"][^'"]+['"]/i.test(value) || /id\s*=\s*['"][^'"]+['"]/i.test(value));
    return ok
      ? { ok: true, message: '¡Correcto! Creaste un botón HTML con texto útil y un atributo para identificarlo.' }
      : { ok: false, message: 'Pista: escribe una etiqueta <button> con el texto Guardar y una class o id.' };
  }

  if (kind === 'css-body') {
    const ok = /body\s*\{/i.test(value) && /background/i.test(value) && /color/i.test(value) && (/#090909|black|#000/i.test(value)) && (/#fff|white|#f5f5f5/i.test(value));
    return ok
      ? { ok: true, message: '¡Excelente! Definiste estilos básicos para el body.' }
      : { ok: false, message: 'Pista: crea una regla body { ... } con background oscuro y color claro.' };
  }

  return { ok: false, message: 'Ejercicio no reconocido.' };
}

function shortcutsMarkup() {
  return shortcutGroups.map(item => `
    <article class="learn-shortcut-card">
      <strong>${item.combo}</strong>
      <p>${item.text}</p>
    </article>`).join('');
}

function lessonCard(title, description, bullets) {
  return `
    <article class="learn-topic-card">
      <h4>${title}</h4>
      <p>${description}</p>
      <ul>${bullets.map(item => `<li>${item}</li>`).join('')}</ul>
    </article>`;
}

export function setupLearnCenter(root, helpers = {}) {
  if (!root) throw new Error('Se requiere un contenedor para BadDev Learn.');
  const {
    onExit = () => {},
    onCreatePracticeProject = () => {},
    onLoadSample = () => {}
  } = helpers;

  root.innerHTML = `
    <div class="learn-shell">
      <aside class="learn-nav" aria-label="Navegación de aprendizaje">
        <div class="learn-nav-brand">
          <span class="learn-kicker">BADDEV</span>
          <h2>LEARN <span>WITHOUT MERCY</span></h2>
          <p>Aprende a usar BadDev y a programar desde cero con una ruta simple.</p>
        </div>
        <div class="learn-nav-links">
          <button type="button" data-scroll-target="learn-start">Inicio</button>
          <button type="button" data-scroll-target="learn-editor">Usar el editor</button>
          <button type="button" data-scroll-target="learn-shortcuts">Atajos</button>
          <button type="button" data-scroll-target="learn-logic">Lógica básica</button>
          <button type="button" data-scroll-target="learn-examples">Ejemplos</button>
          <button type="button" data-scroll-target="learn-practice">Ejercicios</button>
        </div>
        <div class="learn-nav-actions">
          <button type="button" class="btn btn-primary" data-learn-action="practice-project">Nuevo proyecto de práctica</button>
          <button type="button" class="btn btn-quiet" data-learn-action="exit">Volver al editor</button>
        </div>
      </aside>
      <div class="learn-content" id="learn-content">
        <section class="learn-hero learn-section" id="learn-start">
          <div class="learn-hero-copy">
            <span class="learn-kicker">THE FRIENDLY SIDE OF BADDEV</span>
            <h1>Aprende a crear con <span>HTML</span>, <span>CSS</span> y <span>JavaScript</span>.</h1>
            <p>Esta sección te guía paso a paso: cómo usar BadDev, cómo pensar con lógica y cómo practicar con proyectos pequeños.</p>
            <div class="learn-hero-actions">
              <button type="button" class="btn btn-primary" data-learn-action="practice-project">Empezar con un proyecto guiado</button>
              <button type="button" class="btn btn-outline" data-scroll-target="learn-editor">Ver guía del editor</button>
            </div>
          </div>
          <div class="learn-hero-panel">
            <h3>Ruta recomendada</h3>
            <ol>
              <li>Lee cómo se usa el editor.</li>
              <li>Memoriza 4 o 5 atajos clave.</li>
              <li>Comprende variables, condiciones y bucles.</li>
              <li>Abre un ejemplo y modifícalo.</li>
              <li>Resuelve los ejercicios y practícalos en BadDev.</li>
            </ol>
          </div>
        </section>

        <section class="learn-section" id="learn-editor">
          <div class="learn-section-head">
            <span class="learn-mini-tag">GUIA</span>
            <h3>Cómo usar el editor</h3>
            <p>BadDev fue pensado para principiantes: menos opciones confusas y más acciones directas.</p>
          </div>
          <div class="learn-grid learn-grid-3">
            ${lessonCard('1. Crea o abre un proyecto', 'Empieza desde la pantalla principal o el menú Archivo.', ['Usa “Nuevo proyecto” para crear index.html, style.css y script.js.', 'Usa “Abrir proyecto” para cargar una carpeta existente.', 'Si solo quieres hacer una prueba rápida, usa “Archivo suelto”.'])}
            ${lessonCard('2. Escribe código y usa pestañas', 'Cada archivo se abre en una pestaña superior.', ['Haz clic en una pestaña para cambiar de archivo.', 'El punto rojo indica cambios sin guardar.', 'Puedes buscar, reemplazar y autocompletar desde la barra superior.'])}
            ${lessonCard('3. Guarda y visualiza', 'Guarda tu trabajo y pruébalo cuando quieras.', ['Ctrl + S guarda el archivo o proyecto.', 'Vista previa muestra tu HTML, CSS y JS juntos.', 'También puedes descargar tu proyecto como ZIP.'])}
          </div>
        </section>

        <section class="learn-section" id="learn-shortcuts">
          <div class="learn-section-head">
            <span class="learn-mini-tag">SHORTCUTS</span>
            <h3>Atajos esenciales</h3>
            <p>Aprende estos atajos primero. Te harán avanzar más rápido sin depender siempre del mouse.</p>
          </div>
          <div class="learn-shortcuts-grid">${shortcutsMarkup()}</div>
        </section>

        <section class="learn-section" id="learn-logic">
          <div class="learn-section-head">
            <span class="learn-mini-tag">LOGIC</span>
            <h3>Lógica básica para programar</h3>
            <p>La programación no empieza con sintaxis difícil. Empieza con ideas simples: guardar datos, decidir y repetir.</p>
          </div>
          <div class="learn-grid learn-grid-3">
            ${lessonCard('Variables', 'Sirven para guardar datos y usarlos después.', ['Ejemplo: let nombre = "Orlando";', 'Puedes guardar texto, números o valores verdaderos/falsos.', 'Piensa en una variable como una cajita con etiqueta.'])}
            ${lessonCard('Condicionales', 'Te permiten tomar decisiones.', ['Ejemplo: if (edad >= 18) { ... }', 'Sirven para responder: “si esto pasa, entonces haz aquello”.', 'También puedes usar else para el caso contrario.'])}
            ${lessonCard('Bucles', 'Repiten instrucciones varias veces.', ['for repite un número de veces.', 'while repite mientras una condición sea verdadera.', 'Úsalos para evitar escribir lo mismo muchas veces.'])}
          </div>
        </section>

        <section class="learn-section" id="learn-examples">
          <div class="learn-section-head">
            <span class="learn-mini-tag">EXAMPLES</span>
            <h3>Ejemplos listos para estudiar</h3>
            <p>Lee el código, entiende qué hace y luego cárgalo en el editor para modificarlo.</p>
          </div>
          <div class="learn-grid learn-grid-3">
            <article class="learn-example-card">
              <h4>HTML básico</h4>
              <pre>&lt;main&gt;
  &lt;h1&gt;Hola, BadDev&lt;/h1&gt;
  &lt;p&gt;Mi primera página.&lt;/p&gt;
&lt;/main&gt;</pre>
              <button type="button" class="btn btn-outline" data-load-sample="html">Cargar ejemplo HTML</button>
            </article>
            <article class="learn-example-card">
              <h4>CSS básico</h4>
              <pre>body {
  background: #090909;
  color: #f5f5f5;
}</pre>
              <button type="button" class="btn btn-outline" data-load-sample="css">Cargar ejemplo CSS</button>
            </article>
            <article class="learn-example-card">
              <h4>JavaScript básico</h4>
              <pre>let edad = 18;
if (edad >= 18) {
  console.log('Mayor');
}</pre>
              <button type="button" class="btn btn-outline" data-load-sample="logic">Cargar ejemplo JS</button>
            </article>
          </div>
        </section>

        <section class="learn-section" id="learn-practice">
          <div class="learn-section-head">
            <span class="learn-mini-tag">PRACTICE</span>
            <h3>Ejercicios interactivos</h3>
            <p>Escribe una respuesta corta y BadDev te dirá si vas por buen camino. Luego puedes practicar el mismo ejercicio en el editor.</p>
          </div>
          <div class="learn-exercises">
            <article class="learn-exercise-card">
              <h4>Ejercicio 1 — Condición</h4>
              <p>Escribe una condición en JavaScript que muestre “Mayor de edad” si la variable <code>edad</code> es 18 o más.</p>
              <textarea data-exercise-input="logic-if" spellcheck="false" placeholder="Ejemplo: if (...) { ... }"></textarea>
              <div class="learn-exercise-actions">
                <button type="button" class="btn btn-primary" data-check-exercise="logic-if">Comprobar</button>
                <button type="button" class="btn btn-quiet" data-load-sample="logic">Abrir ejemplo</button>
              </div>
              <p class="learn-feedback" data-feedback-for="logic-if">Aún no comprobado.</p>
            </article>
            <article class="learn-exercise-card">
              <h4>Ejercicio 2 — Botón HTML</h4>
              <p>Escribe un botón HTML con el texto “Guardar” y una <code>class</code> o <code>id</code>.</p>
              <textarea data-exercise-input="html-button" spellcheck="false" placeholder='Ejemplo: &lt;button class="..."&gt;Guardar&lt;/button&gt;'></textarea>
              <div class="learn-exercise-actions">
                <button type="button" class="btn btn-primary" data-check-exercise="html-button">Comprobar</button>
                <button type="button" class="btn btn-quiet" data-load-sample="html">Abrir ejemplo</button>
              </div>
              <p class="learn-feedback" data-feedback-for="html-button">Aún no comprobado.</p>
            </article>
            <article class="learn-exercise-card">
              <h4>Ejercicio 3 — Estilo CSS</h4>
              <p>Escribe una regla CSS para <code>body</code> con fondo oscuro y texto claro.</p>
              <textarea data-exercise-input="css-body" spellcheck="false" placeholder="Ejemplo: body { ... }"></textarea>
              <div class="learn-exercise-actions">
                <button type="button" class="btn btn-primary" data-check-exercise="css-body">Comprobar</button>
                <button type="button" class="btn btn-quiet" data-load-sample="css">Abrir ejemplo</button>
              </div>
              <p class="learn-feedback" data-feedback-for="css-body">Aún no comprobado.</p>
            </article>
          </div>
        </section>
      </div>
    </div>`;

  root.addEventListener('click', (event) => {
    const scrollButton = event.target.closest('[data-scroll-target]');
    if (scrollButton) {
      const target = root.querySelector(`#${scrollButton.dataset.scrollTarget}`);
      target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      return;
    }

    const actionButton = event.target.closest('[data-learn-action]');
    if (actionButton) {
      const action = actionButton.dataset.learnAction;
      if (action === 'exit') onExit();
      if (action === 'practice-project') onCreatePracticeProject();
      return;
    }

    const sampleButton = event.target.closest('[data-load-sample]');
    if (sampleButton) {
      onLoadSample(sampleButton.dataset.loadSample);
      return;
    }

    const checkButton = event.target.closest('[data-check-exercise]');
    if (checkButton) {
      const kind = checkButton.dataset.checkExercise;
      const input = root.querySelector(`[data-exercise-input="${kind}"]`);
      const feedback = root.querySelector(`[data-feedback-for="${kind}"]`);
      const result = evaluateExercise(kind, input?.value || '');
      if (feedback) {
        feedback.textContent = result.message;
        feedback.classList.toggle('is-success', Boolean(result.ok));
        feedback.classList.toggle('is-error', !result.ok);
      }
    }
  });

  return {
    open() {
      root.querySelector('#learn-start')?.scrollIntoView({ block: 'start' });
    },
    close() {
      root.querySelectorAll('.learn-feedback').forEach(node => {
        node.classList.remove('is-success', 'is-error');
      });
    }
  };
}
