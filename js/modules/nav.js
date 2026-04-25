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
