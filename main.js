// ---------- Progress Bar ----------
const progressBar = document.getElementById('progress-bar');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = pct + '%';
  }, { passive: true });
}

// ---------- Navbar Scroll State ----------
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ---------- Hamburger / Mobile Menu ----------
const hamburger  = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ---------- Active Nav on Scroll ----------
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionIds = ['hero','about','education','experience','skills','languages','projects','contact'];

window.addEventListener('scroll', () => {
  const scrollMid = window.scrollY + window.innerHeight / 2;
  let active = 'hero';
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollMid) active = id;
  });
  const navActive = active === 'languages' ? 'skills' : active;
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + navActive);
  });
}, { passive: true });

// ---------- Scroll Reveal (IntersectionObserver) ----------
const revealEls = document.querySelectorAll('.reveal, .reveal-x, .reveal-x-right');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// ---------- Hero divider scale-in animation ----------
const divider = document.getElementById('hero-divider');
if (divider) {
  divider.style.transform = 'scaleX(0)';
  divider.style.transformOrigin = 'left';
  divider.style.transition = 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.55s';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { divider.style.transform = 'scaleX(1)'; });
  });
}

// ---------- Cursor particles (site-wide) ----------
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hasFinePointer && !prefersReducedMotion) {
  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-canvas';
  // All styling inline so the effect never depends on stylesheet load/cache.
  canvas.style.cssText =
    'position:fixed;top:0;left:0;pointer-events:none;z-index:901;mix-blend-mode:screen;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let viewW = 0, viewH = 0;
  const resizeCanvas = () => {
    // CSS box and drawing buffer are sized from the same numbers, so canvas
    // coordinates match mouse clientX/clientY exactly.
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    canvas.style.width = viewW + 'px';
    canvas.style.height = viewH + 'px';
    canvas.width = viewW * dpr;
    canvas.height = viewH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  let lastX = 0, lastY = 0;       // last particle spawn point
  let started = false;
  let rafId = null;

  const particles = [];
  const MAX_PARTICLES = 90;
  const SPAWN_DISTANCE = 22;      // px of travel per particle

  const spawnParticle = (x, y) => {
    if (particles.length >= MAX_PARTICLES) particles.shift();
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5 - 0.15,
      size: 0.8 + Math.random() * 1.4,
      life: 1,
      decay: 0.008 + Math.random() * 0.012,
    });
  };

  const tick = () => {
    ctx.clearRect(0, 0, viewW, viewH);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      const alpha = 0.45 * p.life * p.life;  // ease-out fade
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 205, 60, ${alpha})`;
      ctx.fill();
    }

    rafId = particles.length > 0 ? requestAnimationFrame(tick) : null;
  };

  window.addEventListener('mousemove', e => {
    if (!started) {
      started = true;
      lastX = e.clientX;
      lastY = e.clientY;
    }
    // Walk along the path travelled since the last spawn, emitting evenly
    // spaced particles, so fast moves leave a continuous trail from the tip.
    let dx = e.clientX - lastX;
    let dy = e.clientY - lastY;
    let dist = Math.hypot(dx, dy);
    while (dist >= SPAWN_DISTANCE) {
      const t = SPAWN_DISTANCE / dist;
      lastX += dx * t;
      lastY += dy * t;
      spawnParticle(lastX, lastY);
      dx = e.clientX - lastX;
      dy = e.clientY - lastY;
      dist = Math.hypot(dx, dy);
    }
    if (particles.length && !rafId) rafId = requestAnimationFrame(tick);
  }, { passive: true });
}

// ---------- Language bar fill on scroll ----------
const langFills = document.querySelectorAll('.lang-fill');
const langObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.pct + '%';
      langObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
langFills.forEach(el => langObs.observe(el));

// ---------- EmailJS Init ----------
emailjs.init('QK4pfrVYwny2zwxpv'); // replace with your EmailJS public key

// ---------- Contact Form Submit ----------
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const origHTML = btn.innerHTML;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    const templateParams = {
      from_name: `${document.getElementById('fname').value.trim()} ${document.getElementById('lname').value.trim()}`.trim(),
      from_email: document.getElementById('femail').value.trim(),
      subject:    document.getElementById('fsubject').value.trim() || 'No subject',
      message:    document.getElementById('fmessage').value.trim(),
    };

    emailjs.send('service_fuwk9oe', 'template_xeko9ig', templateParams)
      .then(() => {
        btn.textContent = 'Message sent!';
        btn.style.background = '#34d399';
        btn.style.color = '#000';
        contactForm.reset();
        setTimeout(() => {
          btn.innerHTML = origHTML;
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 3000);
      })
      .catch(() => {
        btn.textContent = 'Failed — try again';
        btn.style.background = '#f87171';
        btn.style.color = '#000';
        setTimeout(() => {
          btn.innerHTML = origHTML;
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 3000);
      });
  });
}

// ---------- Smooth hash scroll (nav links) ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
