/* ── Contact Form ─────────────────────────────────── */
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg   = document.getElementById('formSuccess');

if (form && submitBtn && formMsg) {
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
