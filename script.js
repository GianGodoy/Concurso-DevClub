/* =========================================================
   DEVCLUB — script.js
   Índice:
   1. Preloader / animação de entrada
   2. Header (scroll + menu mobile)
   3. Scroll reveal (IntersectionObserver)
   4. Contadores animados (stats)
   5. Filtros de cursos
   6. Carrossel de depoimentos
   7. Botão voltar ao topo
   8. Nuvem de partículas "DEVCLUB" (canvas + mouse)
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     1. PRELOADER
  ============================================ */
  const preloader = document.getElementById('preloader');
  const MIN_PRELOAD_MS = 1700;
  const startTime = Date.now();

  function hidePreloader(){
    const elapsed = Date.now() - startTime;
    const wait = Math.max(MIN_PRELOAD_MS - elapsed, 0);
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.add('loaded');
      // dispara a formação do texto na nuvem de partículas
      window.dispatchEvent(new CustomEvent('devclub:intro'));
    }, wait);
  }
  window.addEventListener('load', hidePreloader);
  // fallback caso 'load' demore (fontes etc.)
  setTimeout(hidePreloader, 3500);


  /* ============================================
     2. HEADER — scroll state + menu mobile
  ============================================ */
  const header = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  const navBurger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');
  navBurger.addEventListener('click', () => {
    navBurger.classList.toggle('open');
    navMobile.classList.toggle('open');
  });
  navMobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navBurger.classList.remove('open');
      navMobile.classList.remove('open');
    });
  });


  /* ============================================
     3. SCROLL REVEAL
  ============================================ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));


  /* ============================================
     4. CONTADORES ANIMADOS
  ============================================ */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const startT = performance.now();

      function tick(now){
        const p = Math.min((now - startT) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        const value = Math.round(target * eased);
        el.textContent = value + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => counterObserver.observe(el));


  /* ============================================
     5. FILTROS DE CURSOS
  ============================================ */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const courseCards = document.querySelectorAll('.course-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;

      courseCards.forEach(card => {
        const cats = (card.dataset.cat || '').split(' ');
        const show = filter === 'todos' || cats.includes(filter);
        if (show){
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'none';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(.97)';
          setTimeout(() => { if (card.style.opacity === '0') card.style.display = 'none'; }, 280);
        }
      });
    });
  });
  courseCards.forEach(c => { c.style.transition = 'opacity .35s ease, transform .35s ease'; });


  /* ============================================
     6. CARROSSEL DE DEPOIMENTOS
     (um único card no DOM: o conteúdo é trocado por JS.
     Não existem dois cards sobrepostos, então não tem como
     "vazar" texto de um depoimento em cima do outro)
  ============================================ */
  const testimonials = [
    { initials: 'AS', name: 'Ana Silva', role: 'Front-end Developer @ Nubank', salary: 'R$ 8.200/mês',
      quote: '"Entrei no DevClub sabendo o básico de HTML. Em 6 meses migrei de carreira e fui contratada como front-end no Nubank. A metodologia prática fez toda a diferença."' },
    { initials: 'MO', name: 'Marcos Oliveira', role: 'Back-end Developer @ iFood', salary: 'R$ 9.500/mês',
      quote: '"Entrei no DevClub sem saber absolutamente nada de programação. Em 8 meses eu estava contratada pelo iFood. Não existe outra escola que chegue perto dessa metodologia."' },
    { initials: 'JP', name: 'Juliana Prado', role: 'Mobile Developer @ PicPay', salary: 'R$ 7.800/mês',
      quote: '"Trilha de mobile do DevClub é incrível. Publiquei meu primeiro app na 3ª semana e fui contratada antes mesmo de terminar o curso completo."' }
  ];

  const dotsWrap = document.getElementById('carouselDots');
  const cardEl = document.getElementById('testimonialCard');
  const elAvatar = document.getElementById('tCardAvatar');
  const elName = document.getElementById('tCardName');
  const elRole = document.getElementById('tCardRole');
  const elSalary = document.getElementById('tCardSalary');
  const elQuote = document.getElementById('tCardQuote');

  let current = 0;
  let autoTimer;
  let isAnimating = false;
  const CARD_TRANSITION_MS = 320;

  function renderContent(index){
    const t = testimonials[index];
    elAvatar.textContent = t.initials;
    elName.textContent = t.name;
    elRole.textContent = t.role;
    elSalary.textContent = t.salary;
    elQuote.textContent = t.quote;
  }

  function renderDots(){
    dotsWrap.innerHTML = '';
    testimonials.forEach((_, i) => {
      const d = document.createElement('span');
      if (i === current) d.classList.add('active');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });
  }

  function goTo(indexRaw, dir){
    const index = (indexRaw + testimonials.length) % testimonials.length;
    // ignora cliques enquanto uma troca já está em andamento — impede qualquer race condition
    if (index === current || isAnimating || !cardEl) return;
    isAnimating = true;

    if (dir === undefined){
      dir = ((index - current + testimonials.length) % testimonials.length === 1) ? 1 : -1;
    }
    const offset = 36;

    // 1) o único card sai da tela (fade + slide)
    cardEl.style.transition = `opacity ${CARD_TRANSITION_MS}ms var(--ease), transform ${CARD_TRANSITION_MS}ms var(--ease)`;
    cardEl.style.opacity = '0';
    cardEl.style.transform = `translateX(${dir === 1 ? -offset : offset}px)`;

    setTimeout(() => {
      // 2) com o card já invisível, troca o CONTEÚDO (não existe um segundo card por baixo)
      renderContent(index);
      current = index;
      Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === current));

      // posiciona do lado certo pra entrar, sem transição (instantâneo)
      cardEl.style.transition = 'none';
      cardEl.style.transform = `translateX(${dir === 1 ? offset : -offset}px)`;
      void cardEl.offsetWidth; // força aplicar antes de religar a transição
      cardEl.style.transition = `opacity ${CARD_TRANSITION_MS}ms var(--ease), transform ${CARD_TRANSITION_MS}ms var(--ease)`;
      cardEl.style.opacity = '1';
      cardEl.style.transform = 'translateX(0)';

      setTimeout(() => { isAnimating = false; }, CARD_TRANSITION_MS + 30);
    }, CARD_TRANSITION_MS);

    restartAuto();
  }

  function restartAuto(){
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1, 1), 6000);
  }

  if (cardEl){
    renderDots();
    restartAuto();
    document.getElementById('carNext').addEventListener('click', () => goTo(current + 1, 1));
    document.getElementById('carPrev').addEventListener('click', () => goTo(current - 1, -1));
    cardEl.closest('.testimonial-carousel').addEventListener('mouseenter', () => clearInterval(autoTimer));
    cardEl.closest('.testimonial-carousel').addEventListener('mouseleave', restartAuto);
  }


  /* ============================================
     7. VOLTAR AO TOPO
  ============================================ */
  const backToTop = document.getElementById('backToTop');
  document.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

});


/* =========================================================
   8. NUVEM DE PARTÍCULAS — "DEVCLUB"
   - Forma o texto no carregamento
   - Depois se dissolve numa nuvem flutuante conectada
   - Reage ao mouse (repulsão) e ao clique (reforma o texto)
========================================================= */
(function particleCloud(){
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = canvas.closest('.hero');

  let W, H, DPR;
  let particles = [];
  let mode = 'cloud';       // 'cloud' | 'text'
  let modeStart = 0;
  const TEXT_HOLD_MS = 4200;

  const mouse = { x: -9999, y: -9999, active: false };

  const cloudSpaceEl = document.getElementById('heroCloudSpace');

  function getTextTargetY(){
    if (cloudSpaceEl){
      const spaceRect = cloudSpaceEl.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      return (spaceRect.top - heroRect.top) + spaceRect.height / 2;
    }
    return H * 0.26;
  }

  let lastW = 0;
  function resize(){
    W = hero.clientWidth;
    H = hero.clientHeight;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // no mobile, mostrar/esconder a barra de endereço dispara "resize" só de altura.
    // Só refaz a nuvem/texto quando a LARGURA muda de verdade — evita o "pulo"/bug visual.
    const widthChanged = Math.abs(W - lastW) > 4;
    lastW = W;
    if (widthChanged || particles.length === 0){
      buildParticles();
    }
  }

  // --- gera os pontos do texto "DEVCLUB" a partir de um canvas offscreen ---
  function sampleTextPoints(){
    const off = document.createElement('canvas');
    const scale = 4; // super-sample para pontos mais nítidos
    const targetY = getTextTargetY();
    const spaceH = cloudSpaceEl ? cloudSpaceEl.getBoundingClientRect().height : H * 0.22;
    const fontSize = Math.max(Math.min(W * 0.13, spaceH * 0.85, 130), 42);
    off.width = W * scale;
    off.height = H * scale;
    const octx = off.getContext('2d');
    octx.scale(scale, scale);
    octx.fillStyle = '#fff';
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.font = `700 ${fontSize}px 'Space Grotesk', sans-serif`;
    octx.fillText('DEVCLUB', W / 2, targetY);

    const step = Math.max(Math.round(fontSize / 15), 3);
    const imgData = octx.getImageData(0, 0, off.width, off.height);
    const pts = [];
    for (let y = 0; y < off.height; y += step * scale){
      for (let x = 0; x < off.width; x += step * scale){
        const idx = (y * off.width + x) * 4 + 3;
        if (imgData.data[idx] > 128){
          pts.push({ x: x / scale, y: y / scale });
        }
      }
    }
    return pts;
  }

  function buildParticles(){
    const textPoints = sampleTextPoints();
    const ambientCount = Math.round(textPoints.length * 0.35);
    particles = [];

    textPoints.forEach(pt => {
      particles.push(makeParticle(pt.x, pt.y));
    });
    for (let i = 0; i < ambientCount; i++){
      particles.push(makeParticle(null, null));
    }
  }

  function makeParticle(tx, ty){
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      tx, ty,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.4 + 1.1,
      phase: Math.random() * Math.PI * 2,
      hasTarget: tx !== null
    };
  }

  function setMode(next){
    mode = next;
    modeStart = performance.now();
  }

  // clique (desktop): reforma o texto
  canvas.addEventListener('click', () => setMode('text'));

  // toque (mobile): só reage a um "tap" de verdade — não a um arrasto de scroll —
  // e libera a repulsão assim que o dedo sai da tela (antes ficava "grudado").
  let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
  canvas.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    if (!t) return;
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchStartTime = performance.now();
  }, { passive: true });

  canvas.addEventListener('touchend', (e) => {
    const t = e.changedTouches && e.changedTouches[0];
    if (t){
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const duration = performance.now() - touchStartTime;
      if (dist < 12 && duration < 500){
        setMode('text');
      }
    }
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  }, { passive: true });

  canvas.addEventListener('touchcancel', () => {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  }, { passive: true });

  // mouse tracking (relativo ao hero)
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  hero.addEventListener('mouseleave', () => { mouse.active = false; mouse.x = -9999; mouse.y = -9999; });
  hero.addEventListener('touchmove', (e) => {
    const rect = hero.getBoundingClientRect();
    const t = e.touches[0];
    if (!t) return;
    mouse.x = t.clientX - rect.left;
    mouse.y = t.clientY - rect.top;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener('devclub:intro', () => {
    setTimeout(() => setMode('text'), 1300);
  });

  let raf;
  function tick(now){
    ctx.clearRect(0, 0, W, H);

    // auto-transição: depois de formar o texto, dissolve pra nuvem
    if (mode === 'text' && now - modeStart > TEXT_HOLD_MS){
      setMode('cloud');
    }

    const REPEL_RADIUS = 110;
    const REPEL_STRENGTH = 34;

    // atualiza posições
    particles.forEach(p => {
      if (mode === 'text' && p.hasTarget){
        p.x += (p.tx - p.x) * 0.07;
        p.y += (p.ty - p.y) * 0.07;
      } else {
        // flutuação orgânica em nuvem
        p.phase += 0.006;
        p.x += p.vx + Math.sin(p.phase) * 0.15;
        p.y += p.vy + Math.cos(p.phase * 0.8) * 0.15;

        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
      }

      // repulsão do mouse (funciona nos dois modos)
      if (mouse.active){
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS && dist > 0.01){
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          p.x += (dx / dist) * force * (REPEL_STRENGTH / 10);
          p.y += (dy / dist) * force * (REPEL_STRENGTH / 10);
        }
      }
    });

    // desenha conexões — mas NÃO entre pontos que formam letras (senão vira uma mancha),
    // só entre partículas "soltas" da nuvem ambiente
    const LINK_DIST = mode === 'text' ? 60 : 92;
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++){
      const a = particles[i];
      if (mode === 'text' && a.hasTarget) continue;
      for (let j = i + 1; j < particles.length; j++){
        const b = particles[j];
        if (mode === 'text' && b.hasTarget) continue;
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST * LINK_DIST){
          const d = Math.sqrt(d2);
          const alpha = (1 - d / LINK_DIST) * (mode === 'text' ? 0.16 : 0.22);
          ctx.strokeStyle = `rgba(46,232,120,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // desenha partículas — as que formam letras ficam maiores e mais sólidas p/ boa leitura
    particles.forEach(p => {
      ctx.beginPath();
      const rad = (mode === 'text' && p.hasTarget) ? p.r + 0.7 : p.r;
      ctx.fillStyle = p.hasTarget ? 'rgba(46,232,120,0.95)' : 'rgba(46,232,120,0.45)';
      ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      ctx.fill();
    });

    // brilho perto do mouse
    if (mouse.active){
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
      grad.addColorStop(0, 'rgba(46,232,120,0.10)');
      grad.addColorStop(1, 'rgba(46,232,120,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 140, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(tick);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  resize();
  raf = requestAnimationFrame(tick);
})();

/* =========================================================
   9. NUVEM DE PARTÍCULAS AMBIENTE — resto da página
   Mesmo estilo visual da nuvem do hero, só que mais sutil,
   fixa atrás de todo o conteúdo, cobrindo a viewport inteira.
========================================================= */
(function bgParticleField(){
  const canvas = document.getElementById('bgParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, DPR;
  let particles = [];
  const PARTICLE_COUNT_BASE = 70; // por 1000px de largura, ajustado no resize
  const LINK_DIST = 130;

  const mouse = { x: -9999, y: -9999, active: false };

  let lastW = 0;
  function resize(){
    W = window.innerWidth;
    H = window.innerHeight;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // evita recriar tudo quando a barra do navegador mobile aparece/some (só muda altura)
    const widthChanged = Math.abs(W - lastW) > 4;
    lastW = W;
    if (widthChanged || particles.length === 0){
      buildParticles();
    }
  }

  function buildParticles(){
    const count = Math.round((W * H) / (1000 * 1000) * PARTICLE_COUNT_BASE) + 24;
    particles = [];
    for (let i = 0; i < count; i++){
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.3 + 0.6,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }, { passive: true });
  document.addEventListener('mouseleave', () => { mouse.active = false; });

  const REPEL_RADIUS = 130;

  function tick(){
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.phase += 0.005;
      p.x += p.vx + Math.sin(p.phase) * 0.08;
      p.y += p.vy + Math.cos(p.phase * 0.8) * 0.08;

      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;

      if (mouse.active){
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS && dist > 0.01){
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          p.x += (dx / dist) * force * 2.2;
          p.y += (dy / dist) * force * 2.2;
        }
      }
    });

    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++){
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++){
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST * LINK_DIST){
          const d = Math.sqrt(d2);
          const alpha = (1 - d / LINK_DIST) * 0.12;
          ctx.strokeStyle = `rgba(46,232,120,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(46,232,120,0.35)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(tick);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  resize();
  requestAnimationFrame(tick);
})();
