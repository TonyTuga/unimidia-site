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

// Vimeo play button and custom controls
const playBtn = document.getElementById('hero-play');
const vimeoIframe = document.getElementById('heroVimeo');

/**
 * Initialize Vimeo Player and wire up custom controls. We wait until the
 * Vimeo API is available to avoid race conditions on slower connections.
 */
const initVimeo = () => {
  if (!playBtn || !vimeoIframe || typeof window.Vimeo === 'undefined') return false;

  const player = new window.Vimeo.Player(vimeoIframe);

  // Keep UI in sync with player state
  player.on('play', () => {
    if (playBtn) playBtn.style.display = 'none';
    if (toggleBtn) {
      toggleBtn.textContent = 'Pausa';
      toggleBtn.setAttribute('aria-pressed', 'false');
    }
    // native controls will be visible; nothing else to show
  });
  player.on('pause', () => {
    // Keep big play button hidden during pauses; user can use toggle to resume
  });
  player.on('ended', () => {
    if (playBtn) playBtn.style.display = '';
  });

  // Big play button
  playBtn.addEventListener('click', (e) => {
    e.preventDefault();
    player.play();
  });

  // Removed custom pause/volume controls; rely on Vimeo UI

  return true;
};

// If the Vimeo API is not yet available, retry a few times
if (!initVimeo()) {
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (initVimeo() || tries > 20) clearInterval(timer);
  }, 100);
}


