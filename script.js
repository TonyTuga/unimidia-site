const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Show success message if redirected back with ?sent=1
(() => {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get('sent') === '1') {
      const success = document.getElementById('form-success');
      if (success) success.hidden = false;
      // Clean the query param from the URL
      const cleanUrl = url.origin + url.pathname + url.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  } catch (err) {
    // ignore
  }
})();

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

// Contact form submission via AJAX to static-friendly provider
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    }).then((res) => {
      if (!res.ok) throw new Error('Failed');
      const success = document.getElementById('form-success');
      if (success) success.hidden = false;
      form.reset();
    }).catch(() => {
      // Fallback to standard form submission
      form.submit();
    });
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


// Lightweight slider for "Quem somos?"
(() => {
  const slider = document.querySelector('.media-frame.slider');
  if (!slider) return;
  const images = Array.from(slider.querySelectorAll('.slides img'));
  if (images.length === 0) return;
  let index = 0;

  const apply = () => {
    images.forEach((img, i) => img.classList.toggle('active', i === index));
  };
  apply();

  const prevBtn = slider.querySelector('.slider-btn.prev');
  const nextBtn = slider.querySelector('.slider-btn.next');
  const prev = () => { index = (index - 1 + images.length) % images.length; apply(); };
  const next = () => { index = (index + 1) % images.length; apply(); };
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  // Keyboard support when slider is focused
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  });
})();

// Smooth, centered scroll for header nav anchors and initial hash
(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const headerNav = document.querySelector('.site-header .nav');
  if (!headerNav) return;

  const centerScrollTo = (element) => {
    const rect = element.getBoundingClientRect();
    const absoluteTop = window.pageYOffset + rect.top;
    const targetTop = absoluteTop - (window.innerHeight / 2) + (rect.height / 2);
    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
  };

  headerNav.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.length < 2) return;
    event.preventDefault();
    const id = href.slice(1);
    const section = document.getElementById(id);
    if (!section) return;
    centerScrollTo(section);
    // Close mobile menu if toggle is visible
    if (toggle && getComputedStyle(toggle).display !== 'none' && nav) {
      nav.style.display = 'none';
    }
    if (history.pushState) {
      history.pushState(null, '', `#${id}`);
    }
  });

  // Center to section if page loads with a hash
  window.addEventListener('load', () => {
    if (window.location.hash && window.location.hash.length > 1) {
      const id = window.location.hash.slice(1);
      const section = document.getElementById(id);
      if (section) {
        setTimeout(() => centerScrollTo(section), 100);
      }
    }
  });
})();

