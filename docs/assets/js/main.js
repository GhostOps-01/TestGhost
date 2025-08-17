// ===== UTIL =====
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function smoothScrollTo(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ===== HERO ANIM + SCROLL CUE =====
document.addEventListener("DOMContentLoaded", () => {
  const heroQuote = $(".hero-quote");
  const scrollBtn = $("#scrollDownBtn");
  const nextSection = $("#coverage") || $(".section");

  if (heroQuote) {
    heroQuote.style.opacity = "0";
    setTimeout(() => { heroQuote.style.opacity = "1"; }, 500);
  }

  if (scrollBtn) {
    scrollBtn.style.opacity = "0";
    setTimeout(() => { scrollBtn.style.opacity = "1"; }, 1100);
    scrollBtn.addEventListener("click", () => nextSection && smoothScrollTo(nextSection));
  }
});

// ===== NAV DRAWER =====
document.addEventListener("DOMContentLoaded", () => {
  const overlay   = $("#navOverlay");
  const openBtn   = $("#hamburgerMenu");
  const closeBtn  = $("#closeNav") || $(".nav-close-btn");
  const navLinks  = $$(".nav-link");

  const open = () => {
    if (!overlay) return;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  };

  openBtn && openBtn.addEventListener("click", open);
  closeBtn && closeBtn.addEventListener("click", close);

  // close on link click
  navLinks.forEach(a => a.addEventListener("click", close));

  // close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // close when clicking outside drawer on wide layouts (optional)
  overlay && overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
});

// ===== iOS SAFE-AREA CSS VARS (kept) =====
(function setSafeAreaVars() {
  const root = document.documentElement;
  const test = document.createElement("div");
  test.style.cssText = `
    position: fixed; top: env(safe-area-inset-top); bottom: env(safe-area-inset-bottom);
    left: env(safe-area-inset-left); right: env(safe-area-inset-right); visibility: hidden;`;
  document.body.appendChild(test);
  root.style.setProperty("--sat-top", "env(safe-area-inset-top)");
  root.style.setProperty("--sat-bottom", "env(safe-area-inset-bottom)");
  root.style.setProperty("--sat-left", "env(safe-area-inset-left)");
  root.style.setProperty("--sat-right", "env(safe-area-inset-right)");
  test.remove();
})();