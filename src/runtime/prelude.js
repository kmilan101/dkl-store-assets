/* DKL runtime prelude: which store is this, and is the shared store CSS loaded? */
try{
  document.documentElement.setAttribute('data-dkl-store', DKL.store);
  /* Safety net: if store.css (loaded by @import in Payhip's Store CSS box) failed, load the mirror copy. */
  (function(){
    var ok = getComputedStyle(document.documentElement).getPropertyValue('--dkl-store-css').trim() === '1';
    if (ok) return;
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = 'https://cdn.jsdelivr.net/gh/kmilan101/dkl-store-assets@gh-pages/store.css';
    document.head.appendChild(l);
    try { console.warn('[DKL] store.css missing, loaded mirror'); } catch (_) {}
  })();
}catch(e){}
