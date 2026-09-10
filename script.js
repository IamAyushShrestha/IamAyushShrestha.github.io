/* ============================================================
   AYUSH SHRESTHA — PORTFOLIO v2
   Matrix rain + animations
   ============================================================ */

(function () {
  'use strict';

  /* ============ MATRIX RAIN ============ */
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');

  // Nepali Devanagari glyphs (the original Matrix rain characters)
  const glyphs = ['अ','आ','इ','ई','उ','ऊ','ए','ऐ','ओ','औ','क','ख','ग','घ','ङ','च','छ','ज','झ','ञ','ट','ठ','ड','ढ','ण','त','थ','द','ध','न','प','फ','ब','भ','म','य','र','ल','व','श','ष','स','ह','क्ष','त्र','ज्ञ'];

  // Blue-pill world: tint the rain cyan
  const isBlueWorld = document.body.classList.contains('blue-world');
  const rainColor = isBlueWorld ? '0, 229, 255' : '0, 255, 65';
  const fadeColor = isBlueWorld ? 'rgba(2, 4, 3, 0.08)' : 'rgba(2, 4, 3, 0.08)';

  let fontSize = 16;
  let columns = 0;
  let drops = [];
  let speeds = [];
  let brightness = [];

  const mouse = { x: -9999, y: -9999 };

  function initMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    fontSize = window.innerWidth < 768 ? 14 : 16;
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    speeds = [];
    brightness = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height / fontSize);
      speeds[i] = 0.6 + Math.random() * 1.2;      // variable fall speed
      brightness[i] = 0.4 + Math.random() * 0.6;  // variable brightness
    }
  }

  function drawMatrix() {
    // Fade trail
    ctx.fillStyle = fadeColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < columns; i++) {
      const char = glyphs[Math.floor(Math.random() * glyphs.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Mouse repulsion: glyphs near cursor dim slightly
      const dist = Math.hypot(x - mouse.x, y - mouse.y);
      const dim = dist < 120 ? 0.35 : 1;

      // Leading character is bright white, trail is colored
      if (Math.random() > 0.975) {
        ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.9 * dim) + ')';
      } else {
        ctx.fillStyle = 'rgba(' + rainColor + ', ' + (0.55 * brightness[i] * dim) + ')';
      }

      ctx.fillText(char, x, y);

      // Reset when off-screen
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
        brightness[i] = 0.4 + Math.random() * 0.6;
      }
      drops[i] += speeds[i];
    }
  }

  initMatrix();
  setInterval(drawMatrix, 50);

  window.addEventListener('resize', initMatrix);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  /* ============ PRELOADER ============ */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 1800);
  });
  // Safety: never trap the user
  setTimeout(() => preloader.classList.add('hidden'), 4000);

  /* ============ TYPING EFFECT ============ */
  const roles = [
    'Full Stack Developer',
    'Problem Solver',
    'Code Whisperer',
    'Bug Hunter',
    'Digital Explorer'
  ];
  const typedEl = document.getElementById('typed-text');
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
      setTimeout(typeLoop, 70);
    } else {
      typedEl.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 35);
    }
  }
  typeLoop();

  /* ============ SCROLL REVEAL ============ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ============ SKILL BARS ============ */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.width || '0%';
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.skill-bar-fill').forEach((el) => skillObserver.observe(el));

  /* ============ STAT COUNTERS ============ */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        const duration = 1500;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach((el) => counterObserver.observe(el));

  /* ============ NAVIGATION ============ */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click + active link highlighting
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  links.forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) => l.classList.remove('active'));
        const active = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-10% 0px -85% 0px' });

  sections.forEach((s) => sectionObserver.observe(s));

  /* ============ HUD CLOCK ============ */
  const hudTime = document.getElementById('hud-time');
  function updateClock() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    hudTime.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ============ FOOTER YEAR ============ */
  document.getElementById('year').textContent = new Date().getFullYear();
})();