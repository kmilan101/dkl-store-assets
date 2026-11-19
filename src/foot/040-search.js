/* Source: Payhip footer injection, live 19 Nov 2026 */
(function(){
 var POP=[['Coloring pages','coloring'],['Alphabet','alphabet'],['Dinosaurs','dinosaur'],['Ages 4–6','ages 4'],['Christmas','christmas'],['Story books','story']];
 var NONE=[['Animals','animal'],['Coloring pages','coloring'],['Free pages','free'],['Story books','story']];
 var COL=[[/colou?r/i,'/collection/coloring-pages','Coloring pages'],[/draw/i,'/collection/how-to-draw','How to draw'],[/story|book/i,'/collection/story-books','Story books'],[/work ?sheet|trac|alphabet|letter|number|math|count/i,'/collection/learning-worksheets','Worksheets'],[/bundle|mega/i,'/collection/mega-bundles','Mega bundles'],[/teach|class/i,'/collection/for-teachers','For teachers'],[/\b2\b|\b3\b|toddler/i,'/collection/ages-2-4','Ages 2–4'],[/\b4\b|\b5\b|preschool/i,'/collection/ages-4-6','Ages 4–6'],[/\b6\b|\b7\b|kinder/i,'/collection/ages-6-8','Ages 6–8'],[/\b8\b|\b9\b|1[0-2]/i,'/collection/ages-8-12','Ages 8–12']];
 function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&','<':'<','>':'>','"':'"'}[c]})}
 function recent(){try{return JSON.parse(localStorage.getItem('dksRecent')||'[]')}catch(e){return[]}}
 function remember(q){q=(q||'').trim();if(q.length<2)return;try{var r=recent().filter(function(x){return x.toLowerCase()!==q.toLowerCase()});r.unshift(q);localStorage.setItem('dksRecent',JSON.stringify(r.slice(0,3)))}catch(e){}}
 function run(blk,q){var i=blk.querySelector('.js-live-search-input');if(!i)return;i.value=q;i.focus();i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new KeyboardEvent('keyup',{bubbles:true,key:'a'}));remember(q);sync(blk)}
 function panel(blk){var p=blk.querySelector('.dksr-panel');if(!p){p=document.createElement('div');p.className='dksr-panel';p.setAttribute('role','dialog');p.setAttribute('aria-label','Search');blk.appendChild(p);p.addEventListener('click',function(e){var t=e.target.closest('[data-q]');if(t){e.preventDefault();run(blk,t.getAttribute('data-q'))}})}return p}
 function chips(list){return '<div class="dksr-chips">'+list.map(function(x){return '<button type="button" class="dksr-chip" data-q="'+esc(x[1])+'">'+esc(x[0])+'</button>'}).join('')+'</div>'}
 function startHTML(){var r=recent(),h='';if(r.length){h+='<div class="dksr-sec"><span class="dksr-over">Recent</span>'+r.map(function(x){return '<button type="button" class="dksr-recent" data-q="'+esc(x)+'">'+esc(x)+'</button>'}).join('')+'</div>'}return h+'<div class="dksr-sec" style="margin:0"><span class="dksr-over">Popular searches</span>'+chips(POP)+'</div>'}
 function noneHTML(q){return '<p class="dksr-none-t">No quick matches for “'+esc(q)+'”</p><p class="dksr-none-p">Check the spelling, see the full results, or try one of these:</p><a class="dksr-all" href="/search?q='+encodeURIComponent(q)+'">See all results for “'+esc(q)+'”</a>'+chips(NONE)}
 function decorate(blk,q){var res=blk.querySelector('.js-live-search-results');if(!res)return;var prods=res.querySelector('.live-search-results-products');
  res.querySelectorAll('.live-search-results-products-content-content-title').forEach(function(t){if(t.getAttribute('data-dks'))return;var full=t.textContent.trim().replace(/\s+/g,' ');var name=full.split(':')[0].trim();var rest=full.slice(name.length);var ag=full.match(/Ages\s*(\d+)\s*[–-]\s*(\d+)/i);var ct=rest.match(/(\d[\d,]*)\+?\s+(?:Printable\s+)?(Pages|Lessons|Books|Stories|Worksheets|Activities)/i);var meta=[];if(ct)meta.push(ct[1]+' '+ct[2].toLowerCase());if(ag)meta.push('Ages '+ag[1]+'–'+ag[2]);meta.push('Instant PDF');t.setAttribute('data-dks','1');t.setAttribute('title',full);t.innerHTML='<span class="dksr-name">'+esc(name)+'</span><span class="dksr-meta">'+esc(meta.join(' · '))+'</span>'});
  var items=res.querySelectorAll('.live-search-results-products-content');items.forEach(function(w,i){var x=i>=3;if(w.classList.contains('dksr-x')!==x)w.classList.toggle('dksr-x',x)});
  if(prods&&!res.querySelector('.dksr-head')){var h=document.createElement('span');h.className='dksr-over dksr-head';h.textContent='Printables';prods.parentNode.insertBefore(h,prods)}
  var cats=COL.filter(function(c){return c[0].test(q)}).slice(0,3);if(!cats.length)cats=[[0,'/collection/all','All printables']];
  var c=res.querySelector('.dksr-cats');if(!c){c=document.createElement('div');c.className='dksr-sec dksr-cats';var f=res.querySelector('.live-search-results-footer');res.insertBefore(c,f||null)}
  var ch='<span class="dksr-over">Categories</span><div class="dksr-chips">'+cats.map(function(x){return '<a class="dksr-chip" href="'+x[1]+'">'+esc(x[2])+'</a>'}).join('')+'</div>';if(c.getAttribute('data-h')!==ch){c.setAttribute('data-h',ch);c.innerHTML=ch}
  var sa=res.querySelector('.dksr-see');if(!sa){sa=document.createElement('a');sa.className='dksr-all dksr-see';res.appendChild(sa)}var sh='/search?q='+encodeURIComponent(q),vt='See all results for “'+q+'”';if(sa.getAttribute('href')!==sh)sa.setAttribute('href',sh);if(sa.textContent!==vt)sa.textContent=vt;if(res.lastElementChild!==sa)res.appendChild(sa);
  }
 var timers=new WeakMap();
 
 function dksrClear(){var blk=document.querySelector('.live-search-block.active');var inp=blk&&blk.querySelector('.js-live-search-input');var b=document.querySelector('.dksr-clear');
  if(!b){b=document.createElement('button');b.type='button';b.className='dksr-clear';b.setAttribute('aria-label','Clear search');b.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#565D70" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>';document.body.appendChild(b);
   b.addEventListener('mousedown',function(e){e.preventDefault()});
   b.addEventListener('click',function(){var a=document.querySelector('.live-search-block.active .js-live-search-input');if(!a)return;a.value='';a.dispatchEvent(new Event('input',{bubbles:true}));a.dispatchEvent(new KeyboardEvent('keyup',{bubbles:true}));a.focus();dksrClear()})}
  var has=!!(inp&&inp.value.trim());document.documentElement.classList.toggle('dksr-has',has);
  if(inp&&has){var r=inp.getBoundingClientRect();var t=Math.round(r.top+(r.height-28)/2)+'px',l=Math.round(r.right-12-28)+'px';if(b.style.top!==t)b.style.top=t;if(b.style.left!==l)b.style.left=l}}
 document.addEventListener('input',function(e){if(e.target&&e.target.classList&&e.target.classList.contains('js-live-search-input'))dksrClear()},true);
 window.addEventListener('resize',function(){if(document.documentElement.classList.contains('dksr-on'))dksrClear()});
 function sync(blk){setTimeout(dksrClear,0);var on=blk.classList.contains('active');document.documentElement.classList.toggle('dksr-on',!!document.querySelector('.js-live-search-block.active'));if(!on)return;
  var i=blk.querySelector('.js-live-search-input'),q=(i&&i.value||'').trim(),p=panel(blk);if(i&&i.getAttribute('placeholder')!=='Search printables')i.setAttribute('placeholder','Search printables');
  if(blk._q!==q){blk._q=q;if(blk.classList.contains('dksr-none'))blk.classList.remove('dksr-none')}else if(blk.classList.contains('dksr-none')){if(blk.querySelectorAll('.live-search-results-products-content').length){blk.classList.remove('dksr-none')}else return}
  if(q.length<2){if(!blk.classList.contains('dksr-empty'))blk.classList.add('dksr-empty');var sh=startHTML();if(p.getAttribute('data-h')!==sh){p.setAttribute('data-h',sh);p.innerHTML=sh}return}
  if(blk.classList.contains('dksr-empty'))blk.classList.remove('dksr-empty');
  clearTimeout(timers.get(blk));timers.set(blk,setTimeout(function(){var n=blk.querySelectorAll('.live-search-results-products-content').length;if(!n&&(i.value||'').trim()===q){blk.classList.add('dksr-none');var nh=noneHTML(q);if(p.getAttribute('data-h')!==nh){p.setAttribute('data-h',nh);p.innerHTML=nh}}else{decorate(blk,q)}},2200));
  decorate(blk,q)}
 function init(){document.querySelectorAll('.js-live-search-block').forEach(function(blk){if(blk.getAttribute('data-dks'))return;blk.setAttribute('data-dks','1');
  new MutationObserver(function(){sync(blk)}).observe(blk,{attributes:true,attributeFilter:['class'],childList:true,subtree:true});
  var f=blk.querySelector('.js-live-search-form'),lg=document.querySelector('#header a[href="/"] img, #header a[href$="doodlekidsland.com"] img, #header a[href$="doodlekidsland.com/"] img, header .header-logo img');if(f&&lg&&!f.querySelector('.dksr-logo')){var a=document.createElement('a');a.className='dksr-logo';a.href='/';a.setAttribute('aria-label','Doodle Kids Land home');var im=lg.cloneNode(true);im.removeAttribute('id');im.alt='Doodle Kids Land';a.appendChild(im);f.insertBefore(a,f.firstChild)}
  var i=blk.querySelector('.js-live-search-input');if(i){i.addEventListener('input',function(){sync(blk)});i.addEventListener('keydown',function(e){if(e.key==='Enter')remember(i.value);if(e.key==='Escape'){var c=blk.querySelector('.js-live-search-form-button-close');c&&c.click()}})}
  var v=blk.querySelector('.js-live-search-results');v&&v.addEventListener('click',function(){remember(i&&i.value)});
  sync(blk)})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
