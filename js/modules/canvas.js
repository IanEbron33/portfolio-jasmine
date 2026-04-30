/* ── Retro Pixel Background Canvas ─────────────────── */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

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

// ── Retro Pixel Colors (Pink palette) ─────────────
const COLORS = [
  [244, 114, 182],
  [224,  39, 122],
  [251, 207, 232],
  [249, 168, 212],
  [216,  27,  96],
  [255, 192, 220],
];

// Pixel size snapping helper
const PX = 4; // base pixel unit
function snap(v) { return Math.round(v / PX) * PX; }

let layers = { pixels: [], stars: [], hearts: [] };

function initParticles() {
  const isMobile = W < 700;

  // Drifting pixel squares
  layers.pixels = Array.from({ length: isMobile ? 28 : 55 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    size: (Math.floor(Math.random() * 4) + 1) * PX, // 4, 8, 12, or 16px
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    a: Math.random() * 0.35 + 0.08,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    blinkRate: Math.random() * 0.04 + 0.01,
    phase: Math.random() * Math.PI * 2,
  }));

  // Twinkling pixel stars (★ as 2x2 squares)
  layers.stars = Array.from({ length: isMobile ? 20 : 40 }, () => ({
    x: snap(Math.random() * W),
    y: snap(Math.random() * H),
    size: PX,
    a: Math.random(),
    da: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  // Floating pixel hearts (pixel-art ♥)
  layers.hearts = Array.from({ length: isMobile ? 3 : 6 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H + H * 0.5,
    size: (Math.floor(Math.random() * 3) + 2) * PX,
    dx: (Math.random() - 0.5) * 0.15,
    dy: -(Math.random() * 0.35 + 0.1),
    a: Math.random() * 0.25 + 0.06,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}
initParticles();

// ── Draw pixel square ─────────────────────────────
function drawPixelSquare(x, y, size, color, alpha) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
  ctx.fillRect(snap(x), snap(y), size, size);
  ctx.globalAlpha = 1;
}

// ── Draw pixel-art heart ──────────────────────────
// Heart pattern in a 4×4 grid scaled by `size`
function drawPixelHeart(cx, cy, size, color, alpha) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
  const p = size; // 1 pixel unit = size px
  // row 1:  .XX.XX.
  // row 2:  XXXXXXX
  // row 3:  XXXXXXX
  // row 4:  .XXXXX.
  // row 5:  ..XXX..
  // row 6:  ...X...
  const pattern = [
    [0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [0,1,1,1,1,1,0],
    [0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0],
  ];
  const ox = snap(cx - (pattern[0].length * p) / 2);
  const oy = snap(cy - (pattern.length * p) / 2);
  for (let r = 0; r < pattern.length; r++) {
    for (let c = 0; c < pattern[r].length; c++) {
      if (pattern[r][c]) ctx.fillRect(ox + c * p, oy + r * p, p, p);
    }
  }
  ctx.globalAlpha = 1;
}

// ── Main draw loop ────────────────────────────────
let tick = 0;
let frameCount = 0;
const frameSkip = isTouchDevice ? 1 : 0;

function draw() {
  requestAnimationFrame(draw);
  frameCount++;
  if (frameSkip && frameCount % 2 !== 0) return;

  ctx.clearRect(0, 0, W, H);
  tick++;

  // 1. Drifting pixel squares
  layers.pixels.forEach(p => {
    p.x += p.dx; p.y += p.dy;
    if (p.x < -p.size) p.x = W + p.size;
    if (p.x > W + p.size) p.x = -p.size;
    if (p.y < -p.size) p.y = H + p.size;
    if (p.y > H + p.size) p.y = -p.size;

    // pixel blink flicker
    const flicker = 0.5 + 0.5 * Math.sin(tick * p.blinkRate + p.phase);
    drawPixelSquare(p.x, p.y, p.size, p.color, p.a * flicker);
  });

  // 2. Twinkling pixel stars
  layers.stars.forEach(s => {
    s.a += s.da;
    if (s.a > 1 || s.a < 0) s.da *= -1;
    const a = Math.abs(s.a);
    // Draw a 3-pixel cross star shape
    ctx.globalAlpha = a;
    ctx.fillStyle = `rgb(${s.color[0]},${s.color[1]},${s.color[2]})`;
    ctx.fillRect(s.x, s.y,          PX, PX);         // center
    ctx.fillRect(s.x - PX, s.y,     PX, PX);          // left
    ctx.fillRect(s.x + PX, s.y,     PX, PX);          // right
    ctx.fillRect(s.x, s.y - PX,     PX, PX);          // top
    ctx.fillRect(s.x, s.y + PX,     PX, PX);          // bottom
    ctx.globalAlpha = 1;
  });

  // 3. Floating pixel hearts
  layers.hearts.forEach(h => {
    h.x += h.dx; h.y += h.dy;
    if (h.y < -40) { h.y = H + 40; h.x = Math.random() * W; }
    if (h.x < -40) h.x = W + 40;
    if (h.x > W + 40) h.x = -40;
    drawPixelHeart(h.x, h.y, h.size, h.color, h.a);
  });
}
draw();
