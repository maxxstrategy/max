// ------- THEME -------
const THEME_KEY = 'mx-theme'; // 'light' | 'dark'
const btn = document.querySelector('.mode-toggle-icon');
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(mode) {
  const isLight = mode === 'light';
  document.body.classList.toggle('light-mode', isLight);
  // به‌روزرسانی دکمه
  if (btn) {
    btn.textContent = isLight ? '☀️' : '🌙';
    btn.setAttribute('aria-pressed', String(isLight));
    btn.setAttribute('aria-label', isLight ? 'تغییر به حالت تیره' : 'تغییر به حالت روشن');
    btn.setAttribute('title', isLight ? 'حالت روشن' : 'حالت تیره');
  }
  // به‌روزرسانی theme-color
  if (themeMeta) {
    themeMeta.setAttribute('content', isLight ? '#f8f8fa' : '#0d0f1a');
  }
}

function getSystemPrefers() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved || getSystemPrefers());
}

function toggleMode() {
  const next = document.body.classList.contains('light-mode') ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}
window.toggleMode = toggleMode;

// init ASAP (قبل از onload برای کاهش FOUC)
initTheme();

// ------- PARALLAX -------
const parallaxElements = document.querySelectorAll('.c-parallax-element');
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let scrollY = window.scrollY, ticking = false;

function updateParallax() {
  if (reduceMotion || parallaxElements.length < 3) { ticking = false; return; }
  // ضرایب ملایم برای حرکت
  parallaxElements[0].style.transform = `translateY(${scrollY * 0.35}px)`;
  parallaxElements[1].style.transform = `translateY(${scrollY * 0.18}px)`;
  parallaxElements[2].style.transform = `translateY(${scrollY * 0.28}px)`;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (reduceMotion) return;
  scrollY = window.scrollY || window.pageYOffset;
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });

// ------- SERVICE WORKER -------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered:', reg.scope))
      .catch(err => console.warn('SW registration failed:', err));
  });
}
