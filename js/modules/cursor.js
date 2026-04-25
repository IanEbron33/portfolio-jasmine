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
