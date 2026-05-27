/* =============================================
   SHE CAN FOUNDATION — script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ============ NAVBAR SCROLL ============
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ============ HAMBURGER MENU ============
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // ============ SCROLL REVEAL ============
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  // ============ COUNTER ANIMATION ============
  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    if (isNaN(target)) return;
    const suffix = el.textContent.includes('+') ? '+' : '';
    const duration = 2000;
    const steps = 60;
    const stepVal = target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(stepVal * step), target);
      el.textContent = current.toLocaleString('en-IN') + suffix;
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // ============ DONUT CHART ============
  function drawDonut() {
    const canvas = document.getElementById('donutChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = 150, cy = 150, r = 110, strokeW = 28;
    const data = [
      { pct: 85, color: '#C8775A', label: 'Programs' },
      { pct: 10, color: '#4A7C2A', label: 'Tech' },
      { pct: 5,  color: '#2B6CB0', label: 'Admin' },
    ];
    ctx.clearRect(0, 0, 300, 300);
    // Background ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = strokeW;
    ctx.stroke();

    let startAngle = -Math.PI / 2;
    const gap = 0.03;
    data.forEach(seg => {
      const arc = (seg.pct / 100) * Math.PI * 2 - gap;
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, startAngle + arc);
      ctx.strokeStyle = seg.color;
      ctx.lineWidth = strokeW;
      ctx.lineCap = 'round';
      ctx.stroke();
      startAngle += (seg.pct / 100) * Math.PI * 2;
    });
  }

  // Animate donut on scroll
  const donutSection = document.querySelector('.transparency-section');
  if (donutSection) {
    const donutObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          drawDonut();
          // Animate bars
          document.querySelectorAll('.bar-fill').forEach(bar => {
            const w = bar.dataset.width;
            setTimeout(() => { bar.style.width = w + '%'; }, 200);
          });
          donutObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    donutObs.observe(donutSection);
  }

  // ============ STORY CAROUSEL ============
  const cards = document.querySelectorAll('.story-card');
  const dots  = document.querySelectorAll('.story-dots .dot');
  let current = 0;

  function showStory(idx) {
    cards.forEach(c => c.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    cards[idx].classList.add('active');
    dots[idx].classList.add('active');
    current = idx;
  }

  document.getElementById('nextStory')?.addEventListener('click', () => {
    showStory((current + 1) % cards.length);
  });
  document.getElementById('prevStory')?.addEventListener('click', () => {
    showStory((current - 1 + cards.length) % cards.length);
  });
  dots.forEach(dot => {
    dot.addEventListener('click', () => showStory(parseInt(dot.dataset.idx)));
  });

  // Auto-advance every 5s
  setInterval(() => showStory((current + 1) % cards.length), 5000);

  // ============ INTERNSHIP FILTER ============
  const filterBtns = document.querySelectorAll('.filter-btn');
  const internCards = document.querySelectorAll('.intern-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      internCards.forEach(card => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          const tags = card.dataset.tags || '';
          card.classList.toggle('hidden', !tags.includes(filter));
        }
      });
    });
  });

  // ============ DONATE AMOUNT BUTTONS ============
  document.querySelectorAll('.amt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.amt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelector('.amt-custom').value = '';
    });
  });
  document.querySelector('.amt-custom')?.addEventListener('input', () => {
    document.querySelectorAll('.amt-btn').forEach(b => b.classList.remove('active'));
  });

  // ============ CONTACT FORM ============
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      successMsg.style.display = 'block';
      form.reset();
      btn.textContent = 'Send Message →';
      btn.disabled = false;
      setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
    }, 1200);
  });

  // ============ SMOOTH ACTIVE NAV ============
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--terracotta)' : '';
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObserver.observe(s));

});