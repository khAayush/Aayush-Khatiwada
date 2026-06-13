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
