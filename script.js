const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Simple mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const opened = nav.style.display === 'flex';
    nav.style.display = opened ? 'none' : 'flex';
    if (!opened) nav.style.flexDirection = 'column';
  });
}

// Contact form -> open mailto with prefilled body
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const first = data.get('firstName') || '';
    const last = data.get('lastName') || '';
    const email = data.get('email') || '';
    const msg = data.get('message') || '';

    const subject = encodeURIComponent(`Contato via site — ${first} ${last}`);
    const body = encodeURIComponent(`Nome: ${first} ${last}\nEmail: ${email}\n\nMensagem:\n${msg}`);

    const to = 'comercial@unimidia.pt';
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

    const success = document.getElementById('form-success');
    if (success) success.hidden = false;
    form.reset();
  });
}


