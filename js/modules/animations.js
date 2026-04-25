/* ── Scroll Reveal ─────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.aosDelay) || 0;
      setTimeout(() => el.classList.add('aos-animate'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

// Wait for the browser to paint the initial hidden state before observing
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.querySelectorAll('[data-aos]').forEach(el => revealObserver.observe(el));
  });
});

/* ── Skill Bar Animation ──────────────────────────── */
function animateCount(el, target, duration) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + '%';
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const level = bar.dataset.level;
      bar.style.width = level + '%';
      const pct = bar.closest('.skill-card').querySelector('.skill-pct');
      if (pct) animateCount(pct, parseInt(level), 1200);
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar').forEach(b => skillObserver.observe(b));

/* ── Active Nav Link on Scroll ────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => {
        l.style.color = '';
        l.style.setProperty('--underline', '0');
      });
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--text)';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
