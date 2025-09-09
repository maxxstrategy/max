function toggleMode() {
  document.body.classList.toggle('light-mode');
  const icon = document.querySelector('.mode-toggle-icon');
  icon.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
  const themeColor = document.querySelector('meta[name="theme-color"]');
  themeColor.setAttribute('content', document.body.classList.contains('light-mode') ? '#f8f8fa' : '#0d0f1a');
}

const parallaxElements = document.querySelectorAll('.c-parallax-element');
let scrollY = window.scrollY, ticking = false;

function updateParallax() {
  parallaxElements[0].style.transform = `translateY(${scrollY * 0.4}px)`;
  parallaxElements[1].style.transform = `translateY(${scrollY * 0.2}px)`;
  parallaxElements[2].style.transform = `translateY(${scrollY * 0.3}px)`;
  ticking = false;
}

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
});

// ثبت Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('Service Worker registered:', reg.scope))
    .catch(err => console.log('Service Worker registration failed:', err));
}