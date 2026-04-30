/* ── Modal Helpers ────────────────────────────────── */
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');

function openModal() {
  if (!modalOverlay) return;
  modalOverlay.setAttribute('aria-hidden', 'false');
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Focus the close button for accessibility
  if (modalClose) setTimeout(() => modalClose.focus(), 50);
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  // Wait for CSS animation before hiding
  setTimeout(() => {
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }, 220);
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) {
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });
}
// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) closeModal();
});

/* ── Contact Form ─────────────────────────────────── */
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg   = document.getElementById('formSuccess');

if (form && submitBtn) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btnText = submitBtn.querySelector('.btn-text');
    btnText.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      btnText.textContent = 'Send Message';
      submitBtn.disabled = false;
      form.reset();
      openModal();
    }, 900);
  });
}

/* ── Reflection Accordion ─────────────────────────── */
document.querySelectorAll('.reflection-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const body = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all others
    document.querySelectorAll('.reflection-toggle').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      if (b.nextElementSibling) {
        b.nextElementSibling.classList.remove('open');
      }
    });

    // Toggle clicked one
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      body.classList.add('open');
    }
  });
});
