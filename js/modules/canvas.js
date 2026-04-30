/* ── Enhanced Retro Pixel Background Canvas ────────── */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

let W, H;
let mouse = { x: -9999, y: -9999, targetX: -9999, targetY: -9999 };
const isTouchDevice = 'ontouchstart' in window;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });

if (!isTouchDevice) {
  document.addEventListener('mousemove', e => { 
    mouse.targetX = e.clientX; 
    mouse.targetY = e.clientY; 
    if (mouse.x === -9999) {
      mouse.x = mouse.targetX;
      mouse.y = mouse.targetY;
    }
  }, { passive: true });
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

let layers = { pixels: [], stars: [], hearts: [], comets: [], snakes: [] };

function initParticles() {
  const isMobile = W < 700;

  // Drifting pixel squares
  layers.pixels = Array.from({ length: isMobile ? 35 : 70 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    baseX: Math.random() * W,
    baseY: Math.random() * H,
    size: (Math.floor(Math.random() * 4) + 1) * PX, // 4, 8, 12, or 16px
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
    a: Math.random() * 0.4 + 0.1,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    blinkRate: Math.random() * 0.05 + 0.02,
    phase: Math.random() * Math.PI * 2,
    // Add sinusoidal drifting
    freq: Math.random() * 0.01 + 0.005,
    amp: Math.random() * 20 + 5,
  }));
  
  // Sync x/y with baseX/baseY
  layers.pixels.forEach(p => { p.baseX = p.x; p.baseY = p.y; });

  // Twinkling pixel stars (★ as crosses)
  layers.stars = Array.from({ length: isMobile ? 25 : 50 }, () => ({
    x: snap(Math.random() * W),
    y: snap(Math.random() * H),
    size: PX,
    a: Math.random(),
    da: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  // Floating pixel hearts (pixel-art ♥)
  layers.hearts = Array.from({ length: isMobile ? 4 : 8 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H + H * 0.5,
    size: (Math.floor(Math.random() * 3) + 2) * PX,
    dx: (Math.random() - 0.5) * 0.2,
    dy: -(Math.random() * 0.4 + 0.15),
    a: Math.random() * 0.3 + 0.1,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
  
  // Shooting pixel comets
  layers.comets = Array.from({ length: isMobile ? 1 : 2 }, () => resetComet());
  
  // Background Pixel Snakes
  layers.snakes = Array.from({ length: isMobile ? 1 : 2 }, () => resetSnake());
}

function resetSnake() {
  const size = PX * 3; // 12px
  const x = Math.floor((Math.random() * W) / size) * size;
  const y = Math.floor((Math.random() * H) / size) * size;
  const dirs = [{x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1}];
  const dir = dirs[Math.floor(Math.random() * dirs.length)];
  
  const length = Math.floor(Math.random() * 8) + 8; // 8 to 15 segments
  const segments = [];
  for (let i = 0; i < length; i++) {
    segments.push({ x: x - dir.x * i * size, y: y - dir.y * i * size });
  }

  return {
    segments,
    dir,
    size,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speed: 6, // frames per move
    tickCounter: 0
  };
}

function resetComet() {
  return {
    x: Math.random() * W,
    y: -50,
    length: Math.random() * 60 + 40,
    speed: Math.random() * 8 + 6,
    angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2, // ~45 deg down-right
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 200 + 50, // frames to wait before shooting
    active: false,
  };
}

initParticles();

// ── Draw helpers ──────────────────────────────────
function drawPixelSquare(x, y, size, color, alpha) {
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
  ctx.fillRect(snap(x), snap(y), size, size);
  ctx.globalAlpha = 1;
}

function drawPixelHeart(cx, cy, size, color, alpha) {
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
  const p = size; 
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

  // Smooth mouse interpolation
  if (!isTouchDevice) {
    mouse.x += (mouse.targetX - mouse.x) * 0.1;
    mouse.y += (mouse.targetY - mouse.y) * 0.1;
  }

  // Calculate parallax offset based on mouse
  const cx = W / 2, cy = H / 2;
  const pxOffset = isTouchDevice ? 0 : (mouse.x - cx) * 0.02;
  const pyOffset = isTouchDevice ? 0 : (mouse.y - cy) * 0.02;

  // 1. Drifting pixel squares (with mouse repel & parallax)
  layers.pixels.forEach((p, i) => {
    p.baseX += p.dx; p.baseY += p.dy;
    
    // Wrap around screen
    if (p.baseX < -50) p.baseX = W + 50;
    if (p.baseX > W + 50) p.baseX = -50;
    if (p.baseY < -50) p.baseY = H + 50;
    if (p.baseY > H + 50) p.baseY = -50;

    // Add sine wave motion
    p.x = p.baseX + Math.sin(tick * p.freq + p.phase) * p.amp;
    p.y = p.baseY + Math.cos(tick * p.freq * 0.8 + p.phase) * p.amp;

    // Mouse repulsion
    if (!isTouchDevice) {
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const dist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (dist < 120) {
        const force = (120 - dist) / 120; // 0 to 1
        p.baseX += (mdx / dist) * force * 3;
        p.baseY += (mdy / dist) * force * 3;
      }
    }

    // Parallax depth based on size
    const depth = p.size / 8; 
    const finalX = p.x - pxOffset * depth;
    const finalY = p.y - pyOffset * depth;

    // pixel blink flicker
    const flicker = 0.5 + 0.5 * Math.sin(tick * p.blinkRate + p.phase);
    drawPixelSquare(finalX, finalY, p.size, p.color, p.a * flicker);
  });

  // 2. Twinkling pixel stars
  layers.stars.forEach(s => {
    s.a += s.da;
    if (s.a > 1 || s.a < 0) s.da *= -1;
    const a = Math.abs(s.a);
    
    const finalX = snap(s.x - pxOffset * 0.5);
    const finalY = snap(s.y - pyOffset * 0.5);

    ctx.globalAlpha = a;
    ctx.fillStyle = `rgb(${s.color[0]},${s.color[1]},${s.color[2]})`;
    ctx.fillRect(finalX, finalY, PX, PX);
    ctx.fillRect(finalX - PX, finalY, PX, PX);
    ctx.fillRect(finalX + PX, finalY, PX, PX);
    ctx.fillRect(finalX, finalY - PX, PX, PX);
    ctx.fillRect(finalX, finalY + PX, PX, PX);
    ctx.globalAlpha = 1;
  });

  // 3. Floating pixel hearts
  layers.hearts.forEach(h => {
    h.x += h.dx; h.y += h.dy;
    
    // Slight sway
    h.x += Math.sin(tick * 0.02) * 0.3;

    if (h.y < -50) { h.y = H + 50; h.x = Math.random() * W; }
    if (h.x < -50) h.x = W + 50;
    if (h.x > W + 50) h.x = -50;
    
    const depth = h.size / 6;
    const finalX = h.x - pxOffset * depth;
    const finalY = h.y - pyOffset * depth;

    drawPixelHeart(finalX, finalY, h.size, h.color, h.a);
  });
  
  // 4. Shooting Pixel Comets
  layers.comets.forEach((c, idx) => {
    if (!c.active) {
      c.delay--;
      if (c.delay <= 0) {
        c.active = true;
        c.x = Math.random() * W;
        c.y = -50;
        // 50% chance to start from left side instead of top
        if (Math.random() > 0.5) {
          c.x = -50;
          c.y = Math.random() * H * 0.5;
        }
      }
    } else {
      c.x += Math.cos(c.angle) * c.speed;
      c.y += Math.sin(c.angle) * c.speed;
      
      // Draw pixel trail
      const segments = 8;
      ctx.fillStyle = `rgb(${c.color[0]},${c.color[1]},${c.color[2]})`;
      for (let i = 0; i < segments; i++) {
        const trailX = snap(c.x - Math.cos(c.angle) * (i * c.length / segments) - pxOffset * 1.2);
        const trailY = snap(c.y - Math.sin(c.angle) * (i * c.length / segments) - pyOffset * 1.2);
        const size = Math.max(PX, PX * 2 - i * 0.5); // taper off
        ctx.globalAlpha = 1 - (i / segments);
        ctx.fillRect(trailX, trailY, size, size);
      }
      ctx.globalAlpha = 1;

      if (c.y > H + 100 || c.x > W + 100) {
        layers.comets[idx] = resetComet();
      }
    }
  });

  // 5. Background Snake(s)
  layers.snakes.forEach(snake => {
    snake.tickCounter++;
    if (snake.tickCounter >= snake.speed) {
      snake.tickCounter = 0;
      
      // Randomly turn (10% chance)
      if (Math.random() < 0.1) {
        if (snake.dir.x !== 0) {
          // moving horizontally, turn vertically
          snake.dir = { x: 0, y: Math.random() < 0.5 ? 1 : -1 };
        } else {
          // moving vertically, turn horizontally
          snake.dir = { x: Math.random() < 0.5 ? 1 : -1, y: 0 };
        }
      }
      
      const head = snake.segments[0];
      let nx = head.x + snake.dir.x * snake.size;
      let ny = head.y + snake.dir.y * snake.size;
      
      // Screen wrap
      if (nx < -snake.size * 2) nx = W + snake.size;
      if (nx > W + snake.size * 2) nx = -snake.size;
      if (ny < -snake.size * 2) ny = H + snake.size;
      if (ny > H + snake.size * 2) ny = -snake.size;
      
      snake.segments.unshift({ x: nx, y: ny });
      snake.segments.pop();
    }
    
    // Draw snake (with opacity)
    ctx.fillStyle = `rgb(${snake.color[0]},${snake.color[1]},${snake.color[2]})`;
    snake.segments.forEach((seg, i) => {
      // head could be a bit opaque, tail fades out
      ctx.globalAlpha = 0.25 * (1 - i / snake.segments.length) + 0.05;
      
      const finalX = seg.x - pxOffset * 0.8;
      const finalY = seg.y - pyOffset * 0.8;
      
      // Draw pixel block with small gap for retro feel
      ctx.fillRect(finalX + 1, finalY + 1, snake.size - 2, snake.size - 2);
      
      // Draw snake eyes on head
      if (i === 0) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#fff';
        if (snake.dir.x === 1) { // right
          ctx.fillRect(finalX + snake.size - 4, finalY + 2, 2, 2);
          ctx.fillRect(finalX + snake.size - 4, finalY + snake.size - 4, 2, 2);
        } else if (snake.dir.x === -1) { // left
          ctx.fillRect(finalX + 2, finalY + 2, 2, 2);
          ctx.fillRect(finalX + 2, finalY + snake.size - 4, 2, 2);
        } else if (snake.dir.y === 1) { // down
          ctx.fillRect(finalX + 2, finalY + snake.size - 4, 2, 2);
          ctx.fillRect(finalX + snake.size - 4, finalY + snake.size - 4, 2, 2);
        } else { // up
          ctx.fillRect(finalX + 2, finalY + 2, 2, 2);
          ctx.fillRect(finalX + snake.size - 4, finalY + 2, 2, 2);
        }
        ctx.fillStyle = `rgb(${snake.color[0]},${snake.color[1]},${snake.color[2]})`; // reset
      }
    });
    ctx.globalAlpha = 1;
  });
}
draw();
