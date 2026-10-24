/** Controla el splash real de Learn, Lecciones y Manual. Sin dependencias. */
export function startLearnBoot({ duration = 3450 } = {}) {
  const splash = document.getElementById('learn-splash');
  if (!splash) return;
  const button = document.getElementById('skip-learn-splash');
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  let timer;
  function finish() {
    if (splash.classList.contains('is-leaving')) return;
    window.clearTimeout(timer);
    splash.classList.add('is-leaving');
    window.setTimeout(() => { splash.hidden = true; }, reduceMotion ? 0 : 420);
  }
  button?.addEventListener('click', finish);
  timer = window.setTimeout(finish, reduceMotion ? 450 : duration);
}
