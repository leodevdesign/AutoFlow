/* ============================================================
   Página de Vendas — comportamento (canvas do herói, FAQ, etc.)
   Cada bloco é uma IIFE independente, executada após o parse
   do DOM (script com defer).
   ============================================================ */

/* ---------- cursor personalizado ---------- */
(function() {
  'use strict';
  var dot = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  var rx = 0, ry = 0;
  document.addEventListener('mousemove', function(e) {
    dot.style.left = e.clientX + 'px';

    dot.style.top = e.clientY + 'px';
    rx += (e.clientX - rx) * 0.18;
    ry += (e.clientY - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  });
  document.addEventListener('mousedown', function() { ring.classList.add('cursor-ring-click'); });
  document.addEventListener('mouseup', function() { ring.classList.remove('cursor-ring-click'); });
  (function animRing() {
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();
})();


/* ---------- comportamento 04 - GSAP scroll e entradas ---------- */
(function () {
  'use strict';
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function afterPreloader(fn) {
    var fired = false;
    function run() {
      if (fired) return;
      fired = true;
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(fn);
      });
    }

    if (!document.body.classList.contains('preloader-active')) {
      run();
      return;
    }

    var observer = new MutationObserver(function () {
      if (!document.body.classList.contains('preloader-active')) {
        observer.disconnect();
        run();
      }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    window.setTimeout(function () {
      observer.disconnect();
      run();
    }, 2800);
  }

  function fallbackSplitChars(element) {
    var chars = [];
    var spans = Array.prototype.slice.call(element.querySelectorAll('span'));
    spans.forEach(function (line) {
      var text = line.textContent;
      var frag = document.createDocumentFragment();
      line.textContent = '';
      Array.prototype.forEach.call(text, function (char) {
        var span = document.createElement('span');
        span.className = 'split-char';
        span.innerHTML = char === ' ' ? '&nbsp;' : char;
        frag.appendChild(span);
        chars.push(span);
      });
      line.appendChild(frag);
    });
    return { chars: chars, revert: function () {} };
  }

  function visibleElements(list) {
    return Array.prototype.filter.call(list, function (el) {
      return el && el.getClientRects().length && window.getComputedStyle(el).visibility !== 'hidden';
    });
  }

  onReady(function () {
    try {
    if (!window.gsap || !window.ScrollTrigger) return;

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var gsap = window.gsap;
    var plugins = [window.ScrollTrigger];
    if (window.ScrollSmoother) plugins.push(window.ScrollSmoother);
    if (window.SplitText) plugins.push(window.SplitText);
    gsap.registerPlugin.apply(gsap, plugins);
    gsap.defaults({ ease: 'power3.out', duration: 0.8 });

    if (!reduceMotion && window.ScrollSmoother && document.getElementById('smooth-wrapper') && document.getElementById('smooth-content')) {
      document.documentElement.classList.add('gsap-smooth-ready');
      window.autoflowSmoother = window.ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.15,
        smoothTouch: 0.12,
        normalizeScroll: true,
        effects: false
      });
    }

    afterPreloader(function () {
      var hero = document.querySelector('.hero-section');
      var title = hero && hero.querySelector('h1');
      var badge = hero && hero.querySelector('.mb-4 > div');
      var pills = hero ? hero.querySelectorAll('.pill-animated') : [];
      var heroText = hero ? hero.querySelectorAll('.framer-text, .text-gray-300') : [];
      var heroButtons = hero ? hero.querySelectorAll('.framer-metal-button') : [];

      if (!hero || !title || reduceMotion) {
        gsap.set('#root', { autoAlpha: 1 });
        window.ScrollTrigger.refresh();
        return;
      }

      var split = null;
      if (window.SplitText) {
        split = window.SplitText.create(title, {
          type: 'words, chars',
          charsClass: 'split-char',
          wordsClass: 'split-word',
          aria: 'auto',
          smartWrap: true
        });
      } else {
        split = fallbackSplitChars(title);
      }

      var tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: function () {
          window.ScrollTrigger.refresh();
        }
      });

      tl.fromTo(badge, { autoAlpha: 0, y: 18, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55 })
        .fromTo(split.chars, { autoAlpha: 0, yPercent: 105, rotationX: -55 }, {
          autoAlpha: 1,
          yPercent: 0,
          rotationX: 0,
          transformOrigin: '50% 100%',
          duration: 0.38,
          stagger: { each: 0.007, from: 'start' }
        }, '-=0.1')
        .fromTo(pills, { autoAlpha: 0, y: 18, scale: 0.96 }, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          stagger: 0.08,
          duration: 0.52
        }, '-=0.58')
        .fromTo(heroText, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.48 }, '-=0.36')
        .fromTo(heroButtons, { autoAlpha: 0, y: 22, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.52 }, '-=0.34');
    });

    if (reduceMotion) {
      gsap.set('#root, section, footer', { autoAlpha: 1, clearProps: 'transform' });
      return;
    }

    var sections = gsap.utils.toArray('section:not(.hero-section):not(.logos-ticker-section), .section-divider-orange, footer');
    sections.forEach(function (section) {
      section.classList.add('gsap-reveal');
      var itemSelector = [
        'h2',
        'h3',
        'p',
        '.testimonial-card',
        '.tools-card',
        '.modules-card',
        '.bonus-card',
        '.certificate-container-mobile',
        '.mobile-text-section',
        '.promo-card-container',
        '.card-vitalicio',
        '.faq-item',
        '.final-call-section .flex.items-center',
        '.framer-metal-button',
        'img'
      ].join(',');
      var items = visibleElements(section.querySelectorAll(itemSelector)).slice(0, 18);
      items.forEach(function (item) { item.classList.add('gsap-reveal-item'); });

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 88%',
          end: 'top 38%',
          scrub: 0.75,
          invalidateOnRefresh: true
        }
      });

      tl.fromTo(section, { autoAlpha: 0.28, y: 62 }, { autoAlpha: 1, y: 0, ease: 'none', duration: 1 }, 0);
      if (items.length) {
        tl.fromTo(items, { autoAlpha: 0, y: 34, scale: 0.985 }, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          stagger: 0.045,
          ease: 'none',
          duration: 0.85
        }, 0.12);
      }
    });

    window.addEventListener('load', function () {
      window.ScrollTrigger.refresh();
    }, { once: true });
    } catch (e) {
      document.querySelectorAll('#root, section, footer').forEach(function(el) {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.transform = 'none';
      });
    }
  });
})();

/* ---------- comportamento 01 — snake global ---------- */
(function () {
  'use strict';
  var canvas = document.getElementById('global-snake-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  var dpr = Math.max(1, Math.min(1.5, window.devicePixelRatio || 1));
  var isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (isCoarse) dpr = 1;

  var rafId = null;
  var t = 0;
  var active = false;
  var intensity = 0.45;
  var intensityTarget = 0.45;
  var motion = 0;
  var center = { x: 0, y: 0 };
  var target = { x: 0, y: 0 };
  var SNAKE_LEN = 30;
  var snake = [];
  for (var _i = 0; _i < SNAKE_LEN; _i++) snake.push({ x: 0, y: 0 });

  function createGlowSprite(size, inner, mid, outer) {
    var c = document.createElement('canvas');
    c.width = size; c.height = size;
    var cctx = c.getContext('2d');
    var r = size * 0.5;
    var g = cctx.createRadialGradient(r, r, 0, r, r, r);
    g.addColorStop(0, inner); g.addColorStop(0.34, mid); g.addColorStop(1, outer);
    cctx.fillStyle = g; cctx.fillRect(0, 0, size, size);
    return c;
  }

  var glowHead = createGlowSprite(180, 'rgba(255,230,180,0.95)', 'rgba(255,150,60,0.50)', 'rgba(255,80,20,0)');
  var glowBody = createGlowSprite(120, 'rgba(255,200,120,0.75)', 'rgba(255,120,40,0.32)', 'rgba(255,60,10,0)');
  var glowTail = createGlowSprite(72,  'rgba(255,160,80,0.55)',  'rgba(255,90,20,0.18)',  'rgba(255,40,0,0)');

  function resizeCanvas() {
    canvas.width  = Math.max(1, Math.floor(window.innerWidth  * dpr));
    canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function resetState(x, y) {
    center.x = x; center.y = y; target.x = x; target.y = y;
    for (var _j = 0; _j < SNAKE_LEN; _j++) { snake[_j].x = x; snake[_j].y = y; }
  }

  function setTarget(clientX, clientY) {
    target.x = clientX;
    target.y = clientY;
  }

  function drawSprite(sprite, x, y, size, alpha) {
    if (alpha <= 0.001) return;
    var hs = size * 0.5;
    ctx.globalAlpha = alpha;
    ctx.drawImage(sprite, x - hs, y - hs, size, size);
  }

  function render() {
    var w = canvas.width / dpr;
    var h = canvas.height / dpr;
    t += 0.016;
    intensity += (intensityTarget - intensity) * 0.07;

    var idleX = center.x + Math.cos(t * 0.40) * (w * 0.04);
    var idleY = center.y + Math.sin(t * 0.30) * (h * 0.03);
    var tx = active ? target.x : idleX;
    var ty = active ? target.y : idleY;

    var prevHeadX = snake[0].x;
    var prevHeadY = snake[0].y;
    snake[0].x += (tx - snake[0].x) * 0.13;
    snake[0].y += (ty - snake[0].y) * 0.13;
    var speed = Math.hypot(snake[0].x - prevHeadX, snake[0].y - prevHeadY);
    motion += (Math.min(1, speed / 4.5) - motion) * 0.22;

    for (var i = 1; i < SNAKE_LEN; i++) {
      var lp = 0.20 - i * 0.003;
      snake[i].x += (snake[i - 1].x - snake[i].x) * lp;
      snake[i].y += (snake[i - 1].y - snake[i].y) * lp;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    for (var j = SNAKE_LEN - 1; j >= 0; j--) {
      var prog  = 1 - j / (SNAKE_LEN - 1);
      var prog2 = prog * prog;
      if (prog < 0.35) {
        drawSprite(glowTail, snake[j].x, snake[j].y, 22 + prog * 72, (0.02 + prog * 0.18) * intensity);
      } else if (prog < 0.75) {
        drawSprite(glowBody, snake[j].x, snake[j].y, 52 + prog2 * 86, (0.08 + prog2 * 0.22) * intensity);
      } else {
        drawSprite(glowHead, snake[j].x, snake[j].y, (70 + prog2 * 66) * (0.72 + motion * 0.55), (0.18 + prog2 * 0.42) * intensity * (0.58 + motion * 0.68));
      }
    }
    drawSprite(glowHead, snake[0].x, snake[0].y, 78 * (0.72 + motion * 0.52), (0.40 + motion * 0.42) * intensity);

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    rafId = window.requestAnimationFrame(render);
  }

  resizeCanvas();
  resetState(window.innerWidth * 0.5, window.innerHeight * 0.45);
  canvas.style.opacity = '1';
  canvas.style.filter = 'blur(1px) brightness(1.1) saturate(1.1)';

  document.addEventListener('mousemove', function(e) {
    if (!active) { active = true; intensityTarget = 0.65; }
    setTarget(e.clientX, e.clientY);
  });

  document.addEventListener('touchstart', function(e) {
    if (!e.touches || !e.touches[0]) return;
    active = true; intensityTarget = 0.70;
    setTarget(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  document.addEventListener('touchmove', function(e) {
    if (!e.touches || !e.touches[0]) return;
    setTarget(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  document.addEventListener('touchend', function() {
    active = false; intensityTarget = 0.70;
  }, { passive: true });

  window.addEventListener('resize', function() {
    resizeCanvas();
    resetState(window.innerWidth * 0.5, window.innerHeight * 0.45);
  });

  window.requestAnimationFrame(render);
})();


/* ---------- comportamento 02 ---------- */
(function() {
  'use strict';
  function initModulesAccordion() {
    var section = document.querySelector('.modules-section');
    if (!section) return;
    var headers = section.querySelectorAll('.modules-card-header');
    headers.forEach(function(header) {
      header.addEventListener('click', function(e) {
        e.preventDefault();
        var card = header.closest('.modules-card');
        var panel = card.querySelector('.modules-lessons-panel');
        var icon = header.querySelector('.modules-accordion-toggle');
        var title = header.querySelector('.modules-card-title');
        var isOpen = panel.classList.contains('modules-lessons-open');
        section.querySelectorAll('.modules-lessons-panel').forEach(function(p) {
          p.classList.remove('modules-lessons-open');
        });
        section.querySelectorAll('.modules-accordion-toggle').forEach(function(i) {
          i.classList.remove('modules-accordion-open');
        });
        section.querySelectorAll('.modules-card-title').forEach(function(t) {
          t.classList.remove('modules-card-title-active');
        });
        if (!isOpen) {
          panel.classList.add('modules-lessons-open');
          icon.classList.add('modules-accordion-open');
          title.classList.add('modules-card-title-active');
        }
      }, { passive: false });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModulesAccordion);
  } else {
    initModulesAccordion();
  }
})();


/* ---------- comportamento 03 ---------- */
(function () {
  'use strict';
  function initFaqAccordion() {
    var section = document.querySelector('.faq-section');
    if (!section) return;

    var items = section.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var button = item.querySelector('.faq-button');
      var answer = item.querySelector('.faq-answer');
      var chevron = item.querySelector('.faq-chevron');
      var question = item.querySelector('.faq-question');

      if (!button || !answer) return;

      button.addEventListener('click', function (e) {
        e.preventDefault();
        var isOpen = answer.style.display === 'block';

        items.forEach(function (other) {
          var otherAnswer = other.querySelector('.faq-answer');
          var otherChevron = other.querySelector('.faq-chevron');
          var otherQuestion = other.querySelector('.faq-question');
          if (otherAnswer) otherAnswer.style.display = 'none';
          if (otherChevron) otherChevron.classList.remove('faq-chevron-open');
          if (otherQuestion) otherQuestion.classList.remove('faq-question-active');
        });

        if (!isOpen) {
          answer.style.display = 'block';
          if (chevron) chevron.classList.add('faq-chevron-open');
          if (question) question.classList.add('faq-question-active');
        }
      }, { passive: false });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaqAccordion);
  } else {
    initFaqAccordion();
  }
})();
