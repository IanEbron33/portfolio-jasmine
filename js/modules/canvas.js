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
