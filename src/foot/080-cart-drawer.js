/* Source: Payhip footer injection, live 19 Nov 2026 */
/* DKL cart v1 (17 Nov 2026): Payhip cart drawer styled to Figma "Cart drawer". Icons: Anron Line, Ink 500. */
(function(){
 var MEGA=DKL.link('completeLibrary'),AIR='https://payhip.com/cdn-cgi/image/format=auto,width=160/https://pe56d.s3.amazonaws.com/o_1k7j5ce0i12jsg411g1u23s1361k.png';
 var X='<svg class="dkcx" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#565D70" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18L18 6M6 6L18 18"></path></svg>';
 function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&','<':'<','>':'>','"':'"'}[c]})}
 function run(){var c=document.querySelector('.js-cart-container');if(!c)return;
  var cb=c.querySelector('.cart-close-button');if(cb&&!cb.querySelector('.dkcx'))cb.insertAdjacentHTML('beforeend',X);
  var items=c.querySelectorAll('.js-cart-item');var n=items.length;
  var t=c.querySelector('.cart-header-title');var tt=n?'Your cart ('+n+')':'Your cart';if(t&&t.textContent!==tt)t.textContent=tt;
  var mega=false;
  items.forEach(function(it){var a=it.querySelector('.cart-item-title a');if(!a)return;var href=a.getAttribute('href')||'';if(href.indexOf(MEGA)>-1)mega=true;
   if(!a.getAttribute('data-dkc')){var full=a.textContent.trim().replace(/\s+/g,' ');var name=full.split(':')[0].trim().split(/,\s*/).filter(function(p,i){return i===0||!/(^Ages\s)|(\d[\d,]*\+?\s+(Printable\s+)?(Pages|Lessons|Books|Stories|Worksheets|Activities))/i.test(p)}).join(', ');var ag=full.match(/Ages\s*(\d+)\s*[–-]\s*(\d+)/i);var ct=full.match(/(\d[\d,]*)\+?\s+(?:Printable\s+)?(Pages|Lessons|Books|Stories|Worksheets|Activities)/i);var m=[];if(ag)m.push('Ages '+ag[1]+'–'+ag[2]);if(ct)m.push(ct[1]+(full.indexOf(ct[1]+'+')>-1?'+':'')+' '+ct[2].toLowerCase());m.push('Instant PDF');
    a.setAttribute('data-dkc','1');a.setAttribute('title',full);a.textContent=name;var sp=document.createElement('span');sp.className='dkc-meta';sp.textContent=m.join(' · ');a.parentNode.insertBefore(sp,a.nextSibling)}});
  var body=c.querySelector('.js-cart-body'),up=c.querySelector('.dkc-up');
  if(n&&!mega){if(!up&&body){up=document.createElement('a');up.className='dkc-up';up.href=MEGA;up.innerHTML='<img src="'+AIR+'" alt=""><span class="dkc-up-t"><b>Get the whole Doodle World</b><span>Every printable, one download · $20.99</span></span><span class="dkc-up-b">View</span>';var w=c.querySelector('.js-cart-items-wrapper');w&&w.parentNode.insertBefore(up,w.nextSibling)}}
  else if(up)up.remove();
  var em=c.querySelector('.dkc-empty');if(!n&&body){if(!em){em=document.createElement('div');em.className='dkc-empty';em.innerHTML='<div class="dkc-empty-art" role="img" aria-label="Doodle World island"></div><p class="dkc-empty-t">Your cart is empty</p><p class="dkc-empty-p">Start with 10 free pages, or pick a land on the map.</p><a class="dkc-empty-b dkc-p" href="/b/t8MFO">Get 10 free pages</a><a class="dkc-empty-b" href="/explore">Explore the Doodle World map</a>';body.insertBefore(em,body.firstChild)}}else if(em)em.remove();
  var h=c.querySelector('.cart-total-heading');if(h&&h.textContent!=='Subtotal')h.textContent='Subtotal';
  var v=c.querySelector('.cart-total-value'),s=c.querySelector('.cart-checkout-button .js-button-state-standard');
  if(v&&s){var lbl='Checkout · '+v.textContent.trim();if(s.textContent!==lbl)s.textContent=lbl}}
 var pend=false;function q(){if(pend)return;pend=true;requestAnimationFrame(function(){pend=false;run()})}
 function init(){run();var c=document.querySelector('.js-cart-container');if(c)new MutationObserver(q).observe(c,{childList:true,subtree:true,characterData:true});
  document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('.header-cart-icon-button,.js-cart-item-remove'))setTimeout(q,300)},true)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
