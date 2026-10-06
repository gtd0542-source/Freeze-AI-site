// Frezz AI — motion design (GSAP + ScrollTrigger + SplitText + Lenis), pages anglaises et françaises.
// Principe : sans GSAP (fichier bloqué) ou avec « réduire les animations », tout reste visible et utilisable.
(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  let lenis = null;
  // Amounts follow the page language: dollars on the English site, euros on the French one.
  const money = (value) => (root.lang === 'fr'
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })).format(value);

  // ---------- Barre du haut ----------
  const nav = $('#nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Minuteur vivant de la carte « Cuisine » ----------
  let timerStarted = false;
  const startTimer = () => {
    const el = $('#timer');
    if (timerStarted || !el) return;
    timerStarted = true;
    let t = 4 * 60 + 12;
    setInterval(() => {
      t = t <= 0 ? 300 : t - 1;
      el.textContent = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
    }, 1000);
  };

  // ---------- Titre : les mots du titre animé viennent de la page (data-words), dans sa langue ----------
  const startCycle = () => {
    const cycle = $('#cycle');
    if (!cycle) return;
    const words = (cycle.dataset.words || cycle.textContent.trim()).split('|');
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
    render(words[0], true);
    setInterval(() => {
      if (document.hidden) return;
      const letters = cycle.querySelectorAll('.ch');
      letters.forEach((s, i) => { s.style.transitionDelay = `${i * 30}ms`; s.classList.add('out'); });
      setTimeout(() => { index = (index + 1) % words.length; render(words[index]); }, 380 + letters.length * 30);
    }, 3200);
  };

  // Position d'un élément dans un ancêtre, sans tenir compte des transformations en cours.
  const posIn = (el, ancestor) => {
    let x = el.offsetWidth / 2;
    let y = el.offsetHeight / 2;
    for (let node = el; node && node !== ancestor; node = node.offsetParent) { x += node.offsetLeft; y += node.offsetTop; }
    return { x, y };
  };

  // =====================================================================
  // MOTION
  // =====================================================================
  function initMotion() {
    const { gsap, ScrollTrigger, SplitText } = window;
    gsap.registerPlugin(ScrollTrigger);
    if (SplitText) gsap.registerPlugin(SplitText);

    // Défilement fluide, synchronisé avec ScrollTrigger.
    if (window.Lenis) {
      lenis = new window.Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // Barre de progression de lecture.
    gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    // ---------- Intro du hero ----------
    const doodle = $$('.doodle path');
    doodle.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });

    const intro = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.2 } });
    intro
      .fromTo('.nav .wrap', { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 1 })
      .fromTo('.hero .pill', { autoAlpha: 0, y: 16, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1 }, 0.1)
      .set('.hero h1', { visibility: 'visible' }, 0.15)
      .from('.hero h1 .line-in', { yPercent: 115, rotate: 2.5, duration: 1.5, stagger: 0.13 }, 0.15)
      .fromTo('.hero .lead', { autoAlpha: 0, y: 24, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)' }, 0.5)
      .set('.hero-cta', { visibility: 'visible' }, 0.62)
      .fromTo('.hero-cta > *', { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, stagger: 0.08 }, 0.62)
      .fromTo('.hero .stores', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0 }, 0.8)
      .fromTo('.hero .device.back', { autoAlpha: 0, y: 180, rotate: -8 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 1.7 }, 0.55)
      .fromTo('.hero .device.front', { autoAlpha: 0, y: 220, rotate: 6 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 1.7 }, 0.68)
      .from('.hero .fridge-photo', { scale: 1.14, filter: 'blur(6px)', duration: 1.6, ease: 'power2.out' }, 0.9)
      .from('.hero .app-shot', { autoAlpha: 0, y: 24, duration: 1.1 }, 1.1)
      .from('.hero .tag', { autoAlpha: 0, scale: 0.6, y: 24, duration: 0.9, ease: 'back.out(1.7)', stagger: 0.12 }, 1.4)
      .to(doodle, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: 0.35 }, 1.5)
      .add(startCycle, 1.8);

    // Parallaxe du hero au défilement (yPercent : ne se mélange pas aux « y » de l'intro).
    const heroScroll = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.timeline({ scrollTrigger: heroScroll })
      .to('.hero h1', { yPercent: -28, ease: 'none' }, 0)
      .to('.hero .pill, .hero .lead', { yPercent: -60, ease: 'none' }, 0)
      .to('.hero .device.front .phone', { yPercent: -14, ease: 'none' }, 0)
      .to('.hero .device.back .phone', { yPercent: -5, rotate: -3, ease: 'none' }, 0);
    $$('.hero .tag').forEach((tag, i) => {
      gsap.to(tag, { yPercent: -80 - (i % 3) * 60, ease: 'none', scrollTrigger: heroScroll });
    });

    // ---------- Chiffres ----------
    gsap.from('.stat', { autoAlpha: 0, y: 40, duration: 1.2, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.stats', start: 'top 88%' } });
    $$('[data-count]').forEach((el) => {
      const to = Number(el.dataset.count);
      const counter = { v: Number(el.dataset.from ?? 0) };
      el.textContent = String(counter.v);
      gsap.to(counter, {
        v: to, duration: 1.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.stats', start: 'top 88%' },
        onUpdate: () => { el.textContent = String(Math.round(counter.v)); },
      });
    });

    // ---------- Titres de section : lignes qui montent derrière un masque ----------
    if (SplitText) {
      $$('h2.split').forEach((h) => {
        SplitText.create(h, {
          type: 'lines', mask: 'lines', linesClass: 'sl', autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, {
            yPercent: 115, rotate: 2, duration: 1.3, ease: 'expo.out', stagger: 0.1,
            scrollTrigger: { trigger: h, start: 'top 86%' },
          }),
        });
      });
    }
    $$('.kicker').forEach((k) => gsap.from(k, { autoAlpha: 0, x: -14, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: k, start: 'top 90%' } }));
    $$('.section-lead.fade, .final-box > p, .final-box > .btn, .final-box > .mark').forEach((el) => {
      gsap.from(el, { autoAlpha: 0, y: 26, filter: 'blur(6px)', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
    });

    // ---------- Moment signature : « 0 achat supplémentaire » ----------
    const stage = $('.zero-stage');
    if (stage) {
      const items = $$('.z-item', stage);
      const plate = $('.z-plate', stage);
      const sumEl = $('.r-sum', stage);
      const proofs = $$('.proofs li');
      const setStep = (n) => proofs.forEach((li, i) => li.classList.toggle('on', i <= n));
      const mm = gsap.matchMedia();
      mm.add({ desktop: '(min-width: 901px)', mobile: '(max-width: 900px)' }, (context) => {
        const { desktop } = context.conditions;
        sumEl.textContent = money(8.67);
        sumEl.classList.remove('zeroed');
        const sum = { v: 8.67 };
        const tl = gsap.timeline({
          defaults: { ease: 'power3.inOut' },
          scrollTrigger: desktop
            ? { trigger: '.zero', start: 'top top', end: '+=190%', pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true }
            : { trigger: stage, start: 'top 80%', end: 'bottom 35%', scrub: 1, invalidateOnRefresh: true },
          // Sur téléphone, la liste est au-dessus de la scène (hors écran) : elle reste entièrement cochée.
          onUpdate: () => { if (!desktop) return; const p = tl.progress(); setStep(p < 0.36 ? 0 : p < 0.66 ? 1 : 2); },
        });
        setStep(desktop ? 0 : 2);
        tl.fromTo('.z-ring', { rotate: 0 }, { rotate: 200, duration: 5, ease: 'none' }, 0)
          .to(items, { backgroundColor: '#F3F1EC', color: '#0B0F14', scale: 1.06, duration: 0.35, stagger: 0.12, ease: 'power2.out' }, 0.1)
          .to(items, {
            x: (i, el) => posIn(plate, stage).x - posIn(el, stage).x,
            y: (i, el) => posIn(plate, stage).y - posIn(el, stage).y,
            scale: 0.25, autoAlpha: 0, rotate: () => gsap.utils.random(-50, 50),
            duration: 1, ease: 'power2.in', stagger: 0.09,
          }, 1.1)
          .fromTo('.z-empty', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 2.25)
          .to(plate, { scale: 1.07, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' }, 2.05)
          .fromTo('.z-dish', { scale: 0, rotate: -140 }, { scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.7)' }, 2.1)
          .fromTo('.z-dish-name', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 2.35)
          .fromTo('.z-receipt', { y: 30 }, { y: -10, duration: 0.8, ease: 'power2.out' }, 2.6)
          .fromTo('.r-line i', { scaleX: 0 }, { scaleX: 1, duration: 0.35, stagger: 0.22, ease: 'power2.out' }, 2.8)
          .fromTo('.r-line span', { opacity: 1 }, { opacity: 0.35, duration: 0.3, stagger: 0.11 }, 2.95)
          .to(sum, {
            v: 0, duration: 0.9, ease: 'power2.inOut',
            onUpdate: () => { sumEl.textContent = money(sum.v); sumEl.classList.toggle('zeroed', sum.v < 0.005); },
          }, 3.1)
          .fromTo('.stamp', { autoAlpha: 0, scale: 2.4, rotate: -20 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(2.6)' }, 4.0)
          .to({}, { duration: 0.6 });
        return () => { sumEl.textContent = money(0); sumEl.classList.add('zeroed'); };
      });
    }

    // ---------- Bento : cartes qui se redressent, puis leur contenu s'anime ----------
    gsap.set('.bento .card', { autoAlpha: 0 });
    ScrollTrigger.batch('.bento .card', {
      start: 'top 90%', once: true,
      onEnter: (batch) => {
        gsap.fromTo(batch,
          { autoAlpha: 0, y: 90, scale: 0.94, rotateX: -14, transformPerspective: 1200, transformOrigin: '50% 100%' },
          { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: 1.4, ease: 'expo.out', stagger: 0.12, clearProps: 'transform' });
        batch.forEach((card, i) => setTimeout(() => {
          card.classList.add('visible');
          if (card.querySelector('#timer')) startTimer();
        }, 380 + i * 120));
        batch.forEach((card, i) => {
          const mini = card.querySelector('.mini-card');
          if (mini) gsap.from(mini, { y: 50, rotate: -5, scale: 0.9, autoAlpha: 0, duration: 1.2, delay: 0.35 + i * 0.12, ease: 'back.out(1.4)' });
          const alts = card.querySelectorAll('.alt');
          if (alts.length) gsap.from(alts, { x: 70, autoAlpha: 0, duration: 1, delay: 0.4 + i * 0.12, stagger: 0.12, ease: 'expo.out' });
          const step = card.querySelector('.step');
          if (step) gsap.from(step.children, { y: 18, autoAlpha: 0, duration: 0.9, delay: 0.45 + i * 0.12, stagger: 0.08, ease: 'expo.out' });
        });
      },
    });

    // ---------- Section claire qui « monte » comme une feuille ----------
    gsap.fromTo('#pourquoi', { scale: 0.93, transformOrigin: '50% 0%' }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '#pourquoi', start: 'top bottom', end: 'top 35%', scrub: true },
    });
    gsap.set('.why-card', { autoAlpha: 0 });
    ScrollTrigger.batch('.why-card', {
      start: 'top 90%', once: true,
      onEnter: (batch) => gsap.fromTo(batch,
        { autoAlpha: 0, y: 70, rotateX: 22, transformPerspective: 900, transformOrigin: '50% 100%' },
        { autoAlpha: 1, y: 0, rotateX: 0, duration: 1.3, ease: 'expo.out', stagger: 0.12, clearProps: 'transform' }),
    });
    const compare = { trigger: '.compare', start: 'top 85%' };
    gsap.from('.compare .before', { x: -60, autoAlpha: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: compare });
    gsap.from('.compare .after', { x: 60, autoAlpha: 0, duration: 1.3, ease: 'expo.out', delay: 0.1, scrollTrigger: compare });
    gsap.from('.compare .after li', { x: 24, autoAlpha: 0, duration: 0.8, ease: 'back.out(1.6)', stagger: 0.14, delay: 0.5, scrollTrigger: compare });

    // ---------- FAQ ----------
    gsap.from('.faq-list details', { y: 34, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '.faq-list', start: 'top 88%' } });

    // ---------- CTA final : la carte s'ouvre ----------
    gsap.fromTo('.final-box', { scale: 0.88, borderRadius: 80 }, {
      scale: 1, borderRadius: 40, ease: 'none',
      scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'top 30%', scrub: true },
    });
    gsap.from('.foot > div', { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: 'footer', start: 'top 92%' } });

    // ---------- Micro-interactions (souris uniquement) ----------
    if (finePointer) {
      $$('.magnetic').forEach((btn) => {
        const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
        const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
        btn.addEventListener('pointermove', (e) => {
          const r = btn.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.25);
          yTo((e.clientY - r.top - r.height / 2) * 0.35);
        });
        btn.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
      });
      $$('.card, .spot').forEach((el) => {
        el.addEventListener('pointermove', (e) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty('--mx', `${e.clientX - r.left}px`);
          el.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
      });
    }

    // Ancres : défilement fluide sous la barre du haut.
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const target = a.getAttribute('href').length > 1 && document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -72, duration: 1.4 });
      else target.scrollIntoView({ behavior: 'smooth' });
    }));

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  const fallback = () => {
    root.classList.remove('motion');
    $$('.bento .card').forEach((card) => card.classList.add('visible'));
    startTimer();
    if (!reduced) startCycle();
  };

  if (!reduced && window.gsap && window.ScrollTrigger) {
    try { initMotion(); } catch (error) {
      console.error('[motion]', error);
      window.gsap.globalTimeline.getChildren(true, true, false).forEach((t) => t.progress(1));
      window.gsap.set('.bento .card, .why-card', { autoAlpha: 1 });
      fallback();
    }
  } else {
    fallback();
  }

})();
