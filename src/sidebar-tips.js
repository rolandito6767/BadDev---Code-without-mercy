// BadDev V 1.2 — Etapa F: consejos rotativos del explorador.
// Textos originales, sin HTML inyectado ni llamadas de red.
export const SIDEBAR_TIPS = Object.freeze([
  {
    title: 'Tu espacio creativo.',
    body: 'Trabaja con carpetas y archivos relacionados. Puedes exportar tu proyecto en ZIP.'
  },
  {
    title: 'Domina cada línea.',
    body: 'Un buen código no necesita magia: guarda, prueba y mejora. Sin piedad para los errores.'
  },
  {
    title: 'Construye sin miedo.',
    body: 'Una idea, un archivo y un paso más. Abre la vista previa y convierte el caos en código.'
  }
]);

export function initSidebarTips(container, { intervalMs = 7500 } = {}) {
  if (!container) return () => {};
  const content = container.querySelector('#sidebar-tip-content');
  const title = container.querySelector('#sidebar-tip-title');
  const description = container.querySelector('#sidebar-tip-description');
  const indicators = [...container.querySelectorAll('#sidebar-tip-pips span')];
  if (!content || !title || !description) return () => {};
  let index = 0;
  let swapping = false;
  let hovering = false;
  let timeout = null;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const update = (next) => {
    index = next;
    title.textContent = SIDEBAR_TIPS[index].title;
    description.textContent = SIDEBAR_TIPS[index].body;
    indicators.forEach((indicator, i) => indicator.classList.toggle('is-active', i === index));
  };
  const advance = () => {
    if (swapping || hovering || document.hidden) return;
    swapping = true;
    if (reduced?.matches) {
      update((index + 1) % SIDEBAR_TIPS.length);
      swapping = false;
      return;
    }
    content.classList.add('is-fading');
    timeout = window.setTimeout(() => {
      update((index + 1) % SIDEBAR_TIPS.length);
      content.classList.remove('is-fading');
      swapping = false;
      timeout = null;
    }, 240);
  };
  update(0);
  const pause = () => { hovering = true; };
  const resume = () => { hovering = false; };
  container.addEventListener('mouseenter', pause);
  container.addEventListener('mouseleave', resume);
  container.addEventListener('focusin', pause);
  container.addEventListener('focusout', resume);
  const timer = window.setInterval(advance, intervalMs);
  return () => {
    window.clearInterval(timer);
    if (timeout != null) window.clearTimeout(timeout);
    container.removeEventListener('mouseenter', pause);
    container.removeEventListener('mouseleave', resume);
    container.removeEventListener('focusin', pause);
    container.removeEventListener('focusout', resume);
    content.classList.remove('is-fading');
  };
}
