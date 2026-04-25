/* ── Init AOS ─────────────────────────────────────── */
AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });

/* ── Custom Cursor ────────────────────────────────── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let fx = mx, fy = my;

// Position cursor dot immediately on mousemove
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

// Smooth-follow for ring
function animateFollower() {
  fx += (mx - fx) * 0.14;
  fy += (my - fy) * 0.14;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, [role="button"]').forEach(el => {
  el.addEventListener('mouseenter', () => follower.classList.add('hovered'));
  el.addEventListener('mouseleave', () => follower.classList.remove('hovered'));
});

/* ── Scrolled Nav ─────────────────────────────────── */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Mobile Menu ──────────────────────────────────── */
const toggle   = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const toggleIcon = document.getElementById('navToggleIcon');

function closeMenu() {
  toggle.classList.remove('open');
  mobileMenu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  mobileLinks.forEach(l => l.setAttribute('tabindex', '-1'));
  toggleIcon.classList.remove('fa-xmark');
  toggleIcon.classList.add('fa-grip');
}

toggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  mobileLinks.forEach(l => l.setAttribute('tabindex', isOpen ? '0' : '-1'));
  if (isOpen) {
    toggleIcon.classList.remove('fa-grip');
    toggleIcon.classList.add('fa-xmark');
  } else {
    toggleIcon.classList.remove('fa-xmark');
    toggleIcon.classList.add('fa-grip');
  }
});

mobileLinks.forEach(l => l.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ── Typewriter ───────────────────────────────────── */
const phrases = [
  'Bachelor of Secondary Education Major in Social Studies'
];
const el = document.getElementById('roleDynamic');
let pi = 0, ci = 0, deleting = false;
const PAUSE = 1800, TYPE_SPEED = 80, DEL_SPEED = 45;

function type() {
  const word = phrases[pi];
  el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
  if (!deleting && ci > word.length) {
    deleting = true; setTimeout(type, PAUSE); return;
  }
  if (deleting && ci < 0) {
    deleting = false; ci = 0; pi = (pi + 1) % phrases.length;
    setTimeout(type, 300); return;
  }
  setTimeout(type, deleting ? DEL_SPEED : TYPE_SPEED);
}
type();

/* ── Skill Bar Animation ──────────────────────────── */
function animateCount(el, target, duration) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    // ease-out cubic
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
      // Animate the matching percentage label
      const pct = bar.closest('.skill-card').querySelector('.skill-pct');
      if (pct) animateCount(pct, parseInt(level), 1200);
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar').forEach(b => skillObserver.observe(b));

/* ── Particle Canvas ──────────────────────────────── */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize, { passive: true });

const COUNT = window.innerWidth < 600 ? 40 : 80;

for (let i = 0; i < COUNT; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.4 + 0.3,
    dx: (Math.random() - 0.5) * 0.28,
    dy: (Math.random() - 0.5) * 0.28,
    a: Math.random() * 0.6 + 0.1,
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(244,114,182,${p.a})`;
    ctx.fill();
  });

  // draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(224,39,122,${0.14 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ── Contact Form ─────────────────────────────────── */
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg   = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();
  const btnText = submitBtn.querySelector('.btn-text');
  btnText.textContent = 'Sending…';
  submitBtn.disabled = true;

  setTimeout(() => {
    btnText.textContent = 'Send Message';
    submitBtn.disabled = false;
    formMsg.textContent = 'Message sent! I\'ll get back to you soon.';
    form.reset();
    setTimeout(() => { formMsg.textContent = ''; }, 4000);
  }, 1600);
});

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

/* ── Reflection Accordion ─────────────────────────── */
document.querySelectorAll('.reflection-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const body = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all others
    document.querySelectorAll('.reflection-toggle').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });

    // Toggle clicked one
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      body.classList.add('open');
    }
  });
});
