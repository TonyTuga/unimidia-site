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

// Vimeo play button: start playback on click
const playBtn = document.getElementById('hero-play');
const vimeoIframe = document.getElementById('heroVimeo');
const controlsWrap = document.getElementById('hero-controls');
const toggleBtn = document.getElementById('hero-toggle');
const volumeSlider = document.getElementById('hero-volume');
if (playBtn && vimeoIframe && typeof window.Vimeo !== 'undefined') {
  const player = new window.Vimeo.Player(vimeoIframe);

  const showControls = () => { if (controlsWrap) controlsWrap.style.display = 'inline-flex'; };
  const hideControls = () => { if (controlsWrap) controlsWrap.style.display = 'none'; };

  playBtn.addEventListener('click', (e) => {
    e.preventDefault();
    playBtn.style.display = 'none';
    player.play();
    showControls();
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      player.getPaused().then((paused) => {
        if (paused) {
          player.play();
          toggleBtn.textContent = 'Pausa';
          toggleBtn.setAttribute('aria-pressed', 'false');
        } else {
          player.pause();
          toggleBtn.textContent = 'Continuar';
          toggleBtn.setAttribute('aria-pressed', 'true');
        }
      });
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      player.setVolume(parseFloat(volumeSlider.value));
    });
  }

  player.on('ended', () => {
    hideControls();
    playBtn.style.display = '';
  });
}


