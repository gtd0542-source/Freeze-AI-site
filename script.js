// Frezz AI — interactions du site : barre du haut, apparitions au défilement, mot animé du titre.
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Barre du haut : fond flouté dès qu'on défile.
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Apparition des blocs au défilement.
  const items = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => io.observe(el));
  }

  // Titre : « Ton dîner, décidé. / trouvé. / prêt. » lettre par lettre (façon x.ai).
  const cycle = document.getElementById('cycle');
  if (!cycle || reduced) return;
  const words = ['décidé.', 'trouvé.', 'prêt.'];
  let index = 0;
  const render = (word, instant = false) => {
    cycle.setAttribute('aria-label', word);
    cycle.innerHTML = '';
    [...word].forEach((letter, i) => {
      const span = document.createElement('span');
      span.className = instant ? 'ch in' : 'ch';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = letter;
      span.style.transitionDelay = `${i * 45}ms`;
      cycle.appendChild(span);
    });
    if (!instant) requestAnimationFrame(() => requestAnimationFrame(() => cycle.querySelectorAll('.ch').forEach((s) => s.classList.add('in'))));
  };
  // Premier mot affiché d'emblée (lisible en capture et par Google) ; on n'anime que si l'onglet est visible.
  render(words[0], true);
  setInterval(() => {
    if (document.hidden) return;
    const letters = cycle.querySelectorAll('.ch');
    letters.forEach((s, i) => { s.style.transitionDelay = `${i * 30}ms`; s.classList.add('out'); });
    setTimeout(() => { index = (index + 1) % words.length; render(words[index]); }, 380 + letters.length * 30);
  }, 3200);
})();
