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
