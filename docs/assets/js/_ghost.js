// _ghost.js – small helpers live here
(()=>{const els=document.querySelectorAll('.reveal');if(!els.length)return; if(!('IntersectionObserver'in window)){els.forEach(e=>e.classList.add('in'));return;}const io=new IntersectionObserver((ents,obs)=>{for(const e of ents){if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}}},{threshold:0.15});els.forEach(el=>io.observe(el));})();

// Close siblings when one opens (tidy UX)
(function(){const items=[...document.querySelectorAll('.pricing-item')];items.forEach(d=>{const s=d.querySelector('summary');if(!s)return;s.addEventListener('click',()=>{requestAnimationFrame(()=>{if(d.open){items.filter(x=>x!==d&&x.open).forEach(x=>x.open=false);d.scrollIntoView({block:'nearest',behavior:'smooth'});}});});});})();

// Keep only one pricing item open for tidy UX
(function(){const items=[...document.querySelectorAll('.pricing-item')];items.forEach(d=>{const s=d.querySelector('summary');if(!s)return;s.addEventListener('click',()=>{requestAnimationFrame(()=>{if(d.open){items.filter(x=>x!==d&&x.open).forEach(x=>x.open=false);}});});});})();

// Keep only one pricing item open for tidy UX
(function(){const items=[...document.querySelectorAll('.pricing-item')];items.forEach(d=>{const s=d.querySelector('summary');if(!s)return;s.addEventListener('click',()=>{requestAnimationFrame(()=>{if(d.open){items.filter(x=>x!==d&&x.open).forEach(x=>x.open=false);}});});});})();

// Keep only one pricing item open (tidy UX)
(function(){const items=[...document.querySelectorAll('.pricing-item')];items.forEach(d=>{const s=d.querySelector('summary');if(!s)return;s.addEventListener('click',()=>{requestAnimationFrame(()=>{if(d.open){items.filter(x=>x!==d&&x.open).forEach(x=>x.open=false);}});});});})();

// Diag: log what we actually have so we can target correctly
(function(){try{const nav=document.querySelector('.nav-header');const hero=document.querySelector('.hero-section');const img=document.querySelector('.hero-image');const foot=document.querySelector('footer');console.log('[ghost-ops diag]',{nav:!!nav,hero:!!hero,heroImg:!!img,footer:!!foot,vw:window.innerWidth});}catch(e){console.warn('[ghost-ops diag error]',e)}})();

(function(){const items=[...document.querySelectorAll('.pricing-item')];items.forEach(d=>{const s=d.querySelector('summary');if(!s)return;s.addEventListener('click',()=>{requestAnimationFrame(()=>{if(d.open){items.filter(x=>x!==d&&x.open).forEach(x=>x.open=false);}});});});})();

// ===== TG debug logger (toggle with localStorage TG_DEBUG=1 or URL #debug) =====
(function(){
  try{
    var DEBUG = (localStorage.getItem('TG_DEBUG') === '1') || /[#&?](debug|tg_debug)(=1)?\b/i.test(location.href);
    if(!DEBUG) return;

    var styleHdr = 'background:#00ff88;color:#001b10;padding:2px 6px;border-radius:4px;font-weight:700';
    console.group('%cTestGhost Debug', styleHdr);

    // Mark that _ghost assets are loaded
    var ghostCss = !!document.querySelector('link[rel="stylesheet"][href*="_ghost.css"]');
    var ghostJs  = !!document.querySelector('script[src*="_ghost.js"]');
    console.log('ghost CSS loaded:', ghostCss);
    console.log('ghost JS  loaded:', ghostJs);

    // Hero image check
    var hero = document.querySelector('.hero-section .hero-image, .hero-section picture img, .hero-section img');
    if(hero){
      var rect = hero.getBoundingClientRect();
      console.log('hero src ->', hero.getAttribute('src'));
      console.log('hero size ->', Math.round(rect.width)+'x'+Math.round(rect.height));
    } else {
      console.warn('hero image not found');
    }

    // Nav brand image check
    var navBrand = document.querySelector('.nav-brand');
    if(navBrand){
      console.log('nav brand src ->', navBrand.getAttribute('src'));
      var nbRect = navBrand.getBoundingClientRect();
      console.log('nav brand size ->', Math.round(nbRect.width)+'x'+Math.round(nbRect.height));
    } else {
      console.warn('nav-brand not found');
    }

    // Footer font check
    var footerText = document.querySelector('footer .footer-text');
    if(footerText){
      var cs = getComputedStyle(footerText);
      console.log('footer font-size ->', cs.fontSize, ' line-height ->', cs.lineHeight);
    } else {
      console.warn('footer .footer-text not found');
    }

    // Tiny on-page badge so you know debug is active
    var mark = document.createElement('div');
    mark.textContent = 'TG DEBUG';
    mark.style.cssText = 'position:fixed;bottom:8px;right:8px;background:#00ff88;color:#012;'+
                         'padding:2px 6px;font:700 11px/1.2 monospace;z-index:99999;border-radius:4px;opacity:.85';
    document.body.appendChild(mark);

    console.groupEnd();
  }catch(e){ console.error('[TG DEBUG error]', e); }
})();

