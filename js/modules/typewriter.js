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
