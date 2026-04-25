/* ── Scroll Reveal (replaces AOS library) ─────────── */
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


/* ── Custom Cursor (optimized — stops when idle) ──── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = -100, my = -100, fx = -100, fy = -100;
let cursorMoving = false;
let cursorTimer = null;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  if (!cursorMoving) { cursorMoving = true; tickFollower(); }
  clearTimeout(cursorTimer);
  cursorTimer = setTimeout(() => { cursorMoving = false; }, 100);
});

function tickFollower() {
  fx += (mx - fx) * 0.14;
  fy += (my - fy) * 0.14;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  if (cursorMoving) requestAnimationFrame(tickFollower);
}

document.querySelectorAll('a, button, [role="button"]').forEach(el => {
  el.addEventListener('mouseenter', () => follower.classList.add('hovered'));
  el.addEventListener('mouseleave', () => follower.classList.remove('hovered'));
});

/* ── Dark Mode Toggle ─────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Apply saved theme or system preference
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.documentElement.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
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

/* ── Enhanced Background Canvas ───────────────────── */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');
let W, H;
let mouse = { x: -9999, y: -9999 };
const isTouchDevice = 'ontouchstart' in window;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });
if (!isTouchDevice) {
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
}

// ── Particle definitions ──────────────────────────
const COLORS = [
  [244, 114, 182],
  [236,  72, 153],
  [251, 207, 232],
  [249, 168, 212],
  [216,  27, 96],
];

let layers = { orbs: [], sparks: [], stars: [], hearts: [] };

function initParticles() {
  const isMobile = W < 700;

  layers.orbs = Array.from({ length: isMobile ? 3 : 5 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 80 + 50,
    dx: (Math.random() - 0.5) * 0.15,
    dy: (Math.random() - 0.5) * 0.15,
    a: Math.random() * 0.06 + 0.02,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    phase: Math.random() * Math.PI * 2,
    breathe: Math.random() * 0.3 + 0.15,
  }));

  layers.sparks = Array.from({ length: isMobile ? 20 : 35 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    baseX: 0, baseY: 0,
    r: Math.random() * 2 + 0.5,
    dx: (Math.random() - 0.5) * 0.28,
    dy: (Math.random() - 0.5) * 0.28,
    a: Math.random() * 0.5 + 0.15,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    phase: Math.random() * Math.PI * 2,
    freq: Math.random() * 0.006 + 0.002,
    amp: Math.random() * 14 + 4,
  }));

  layers.stars = Array.from({ length: isMobile ? 12 : 20 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.0 + 0.2,
    a: Math.random(),
    da: (Math.random() * 0.01 + 0.003) * (Math.random() < 0.5 ? 1 : -1),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  layers.hearts = Array.from({ length: isMobile ? 2 : 4 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    size: Math.random() * 8 + 5,
    dx: (Math.random() - 0.5) * 0.2,
    dy: -(Math.random() * 0.25 + 0.1),
    a: Math.random() * 0.15 + 0.05,
    rotation: Math.random() * Math.PI * 2,
    drot: (Math.random() - 0.5) * 0.01,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  layers.sparks.forEach(p => { p.baseX = p.x; p.baseY = p.y; });
}
initParticles();

// ── Draw helpers ──────────────────────────────────
function drawHeart(cx, cy, size, rotation, alpha, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
  ctx.beginPath();
  const s = size * 0.55;
  ctx.moveTo(0, s * 0.4);
  ctx.bezierCurveTo(-s * 1.1, -s * 0.4, -s * 1.8, s * 0.8, 0, s * 1.8);
  ctx.bezierCurveTo(s * 1.8, s * 0.8, s * 1.1, -s * 0.4, 0, s * 0.4);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawGlowOrb(x, y, r, color, alpha) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0,   `rgba(${color[0]},${color[1]},${color[2]},${alpha})`);
  grad.addColorStop(0.5, `rgba(${color[0]},${color[1]},${color[2]},${alpha * 0.35})`);
  grad.addColorStop(1,   `rgba(${color[0]},${color[1]},${color[2]},0)`);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
}

// ── Main draw loop (throttled on mobile) ──────────
let tick = 0;
let frameSkip = isTouchDevice ? 1 : 0; // on touch: render every other frame
let frameCount = 0;

function draw() {
  requestAnimationFrame(draw);
  frameCount++;
  if (frameSkip && frameCount % 2 !== 0) return;

  ctx.clearRect(0, 0, W, H);
  tick++;

  // 1. Glow orbs (few, cheap)
  layers.orbs.forEach(o => {
    o.x += o.dx; o.y += o.dy;
    if (o.x < -o.r) o.x = W + o.r;
    if (o.x > W + o.r) o.x = -o.r;
    if (o.y < -o.r) o.y = H + o.r;
    if (o.y > H + o.r) o.y = -o.r;
    const breathe = 1 + Math.sin(tick * o.breathe * 0.025 + o.phase) * 0.25;
    drawGlowOrb(o.x, o.y, o.r * breathe, o.color, o.a);
  });

  // 2. Connection lines (simple solid stroke, no gradient per line)
  const sp = layers.sparks;
  ctx.lineWidth = 0.6;
  for (let i = 0; i < sp.length; i++) {
    for (let j = i + 1; j < sp.length; j++) {
      const dx = sp[i].x - sp[j].x, dy = sp[i].y - sp[j].y;
      const distSq = dx * dx + dy * dy;
      if (distSq < 8100) { // 90²
        const alpha = 0.1 * (1 - Math.sqrt(distSq) / 90);
        ctx.beginPath();
        ctx.moveTo(sp[i].x, sp[i].y);
        ctx.lineTo(sp[j].x, sp[j].y);
        ctx.strokeStyle = `rgba(224,39,122,${alpha})`;
        ctx.stroke();
      }
    }
  }

  // 3. Sparkle dots
  sp.forEach(p => {
    p.baseX += p.dx; p.baseY += p.dy;
    if (p.baseX < 0) p.baseX = W; if (p.baseX > W) p.baseX = 0;
    if (p.baseY < 0) p.baseY = H; if (p.baseY > H) p.baseY = 0;

    p.x = p.baseX + Math.sin(tick * p.freq + p.phase) * p.amp;
    p.y = p.baseY + Math.cos(tick * p.freq * 0.7 + p.phase) * p.amp * 0.5;

    // mouse repulsion (desktop only)
    if (!isTouchDevice) {
      const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 80) {
        const push = (1 - mdist / 80) * 2;
        p.baseX += (mdx / mdist) * push;
        p.baseY += (mdy / mdist) * push;
      }
    }

    const pr = p.r * (1 + Math.sin(tick * 0.035 + p.phase) * 0.25);
    ctx.beginPath();
    ctx.arc(p.x, p.y, pr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.a})`;
    ctx.fill();
  });

  // 4. Twinkling stars
  layers.stars.forEach(s => {
    s.a += s.da;
    if (s.a > 1 || s.a < 0) s.da *= -1;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${Math.abs(s.a)})`;
    ctx.fill();
  });

  // 5. Floating hearts
  layers.hearts.forEach(h => {
    h.x += h.dx; h.y += h.dy;
    h.rotation += h.drot;
    if (h.y < -40) { h.y = H + 40; h.x = Math.random() * W; }
    if (h.x < -40) h.x = W + 40;
    if (h.x > W + 40) h.x = -40;
    drawHeart(h.x, h.y, h.size, h.rotation, h.a, h.color);
  });
}
draw();

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
