/* Nav drawer */
const overlay = document.getElementById('navOverlay');
const backdrop = document.getElementById('navBackdrop');
const burger = document.querySelector('.hamburger');
const closeBtn = document.querySelector('.nav-close-btn');

function openNav() {
  overlay.hidden = false;
  backdrop.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('open'));
  burger.setAttribute('aria-expanded', 'true');
}
function closeNav() {
  overlay.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  setTimeout(() => {
    overlay.hidden = true;
    backdrop.hidden = true;
  }, 200);
}

if (burger) burger.addEventListener('click', openNav);
if (closeBtn) closeBtn.addEventListener('click', closeNav);
if (backdrop) backdrop.addEventListener('click', closeNav);
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) closeNav(); });

/* Pricing: keep one open at a time */
const items = [...document.querySelectorAll('.pricing-item')];
items.forEach(d => {
  const s = d.querySelector('summary');
  if (!s) return;
  s.addEventListener('click', () => {
    requestAnimationFrame(() => {
      if (d.open) items.filter(x => x !== d && x.open).forEach(x => x.open = false);
    });
  });
});

/* Scroll down button */
document.querySelectorAll('.scroll-down-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.dataset.scroll || '#pricing');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});