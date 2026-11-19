/* 120 blog v3 (19 Nov 2026) · Figma: 12 FOR APPROVAL · Blog categories, listen, details (494:2)
   - Blog index: category chips (filter, ?topic=slug), category name on each card.
   - Blog post: details row (category chip, read time, listen time, sources) and the Listen player (browser speechSynthesis).
   Data: DKL.blog.categories (topic slug -> name), DKL.blog.postCategory (post slug -> topic slug). */
(function(){
var B=window.DKL&&window.DKL.blog;if(!B||!B.categories)return;
var d=document,BASE='/blog/learning-at-home';
function txt(e){return (e&&e.textContent||'').replace(/\s+/g,' ').trim();}
function el(t,c,s){var e=d.createElement(t);if(c)e.className=c;if(s!=null)e.textContent=s;return e;}
function slugOf(href){var m=(href||'').replace(/^https?:\/\/[^\/]+/,'').match(/^\/blog\/[^\/]+\/([^\/?#]+)/);return m?m[1]:'';}
function chip(name,href,sel){var a=el('a','dkc-chip'+(sel?' is-sel':''),name);a.href=href;if(sel)a.setAttribute('aria-current','true');return a;}

/* ---------- index ---------- */
function index(){
 var items=[].slice.call(d.querySelectorAll('.blog-post-item'));if(!items.length||d.querySelector('.dkc-row'))return;
 var q=(location.search.match(/[?&]topic=([a-z0-9-]+)/)||[])[1]||'';if(!B.categories[q])q='';
 function tag(it){var a=it.querySelector('a[href*="/blog/"]'),s=slugOf(a&&a.getAttribute('href')),c=B.postCategory[s];it.setAttribute('data-slug',s);if(!c)return;it.setAttribute('data-topic',c);
  var w=it.querySelector('.blog-post-text-wrapper');if(w)w.setAttribute('data-dkc',B.categories[c]);}
 items.forEach(tag);
 var row=el('nav','dkc-row');row.setAttribute('aria-label','Blog categories');
 var all=chip('All',BASE,!q);row.appendChild(all);
 Object.keys(B.categories).forEach(function(k){row.appendChild(chip(B.categories[k],BASE+'?topic='+k,q===k));});
 var wrap=el('div','dkc-wrap');wrap.appendChild(row);
 var list=items[0].parentNode;list.parentNode.insertBefore(wrap,list);
 var pager=d.querySelector('.pagination-wrapper');
 /* Payhip shows 15 posts a page (?&page=15). A topic filter needs every page, so the other pages are fetched once and their cards added (hidden under "All"). */
 var more=null;
 function loadAll(){if(more)return more;var seen={};items.forEach(function(it){seen[it.getAttribute('data-slug')]=1;});
  more=new Promise(function(done){var n=0;function next(url){if(!url||n++>20)return done();
   fetch(url,{credentials:'same-origin'}).then(function(r){return r.text();}).then(function(t){var doc=new DOMParser().parseFromString(t,'text/html');
    [].slice.call(doc.querySelectorAll('.blog-post-item')).forEach(function(x){var it=d.importNode(x,true);tag(it);var s=it.getAttribute('data-slug');if(!s||seen[s])return;seen[s]=1;it.classList.add('dkc-x');it.style.display='none';list.appendChild(it);items.push(it);});
    var nx=[].slice.call(doc.querySelectorAll('.pagination a[href]')).filter(function(l){return /next/i.test(l.textContent)&&l.getAttribute('href')!=='#';})[0];
    next(nx?nx.href.replace(/^https?:\/\/[^\/]+/,''):null);}).catch(function(){done();});}
   next(BASE);});return more;}
 var cur='';
 function show(){var t=cur;items.forEach(function(it){var x=it.classList.contains('dkc-x');it.style.display=t?(it.getAttribute('data-topic')===t?'':'none'):(x?'none':'');});
  if(pager)pager.style.display=t?'none':'';
  [].slice.call(row.children).forEach(function(c){var on=(c.href.indexOf('topic='+t)>-1&&t)||(!t&&c===all);c.classList.toggle('is-sel',!!on);if(on)c.setAttribute('aria-current','true');else c.removeAttribute('aria-current');});}
 function apply(t){cur=t;show();if(t)loadAll().then(function(){if(cur===t)show();});}
 row.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;e.preventDefault();var t=(a.href.match(/topic=([a-z0-9-]+)/)||[])[1]||'';apply(t);try{history.replaceState(null,'',t?BASE+'?topic='+t:BASE);}catch(_){}});
 apply(q);
}

/* ---------- post ---------- */
function post(slug){
 var p=d.getElementById('page-section-blog-post');if(!p||p.querySelector('.dkbd'))return;
 var body=p.querySelector('.blog-post-content'),meta=p.querySelector('.blog-post-meta');if(!body||!meta)return;
 var words=txt(body).split(' ').length,read=Math.max(1,Math.round(words/220)),listen=Math.max(1,Math.round(words/150));
 var src=0;[].slice.call(body.querySelectorAll('h2,h3,p,strong')).some(function(h){if(/^sources\b/i.test(txt(h))){var n=h.closest('p,h2,h3')||h,ul=n.nextElementSibling;while(ul&&ul.tagName!=='UL'&&ul.tagName!=='OL'&&!/^H[23]$/.test(ul.tagName))ul=ul.nextElementSibling;if(ul&&/^(UL|OL)$/.test(ul.tagName))src=ul.querySelectorAll('li').length;return true;}});
 meta.textContent=txt(meta).replace(/\s*·\s*\d+\s*min read$/i,'');
 var c=B.postCategory[slug],row=el('div','dkbd');
 if(c)row.appendChild(chip(B.categories[c],BASE+'?topic='+c,false));
 [read+' min read',listen+' min listen'].concat(src?[src+(src===1?' source':' sources')]:[]).forEach(function(s){row.appendChild(el('span','dkbd-i',s));});
 meta.parentNode.insertBefore(row,meta.nextSibling);
 if('speechSynthesis' in window&&window.SpeechSynthesisUtterance)player(p,body,row,listen);
}

function player(p,body,after,mins){
 var S=window.speechSynthesis,rates=[1,1.25,1.5,.75],ri=0,chunks=[],i=0,state='ready',total=0,done=0,gen=0;
 var h1=p.querySelector('.blog-post-name');if(h1)chunks.push(txt(h1));
 [].slice.call(body.querySelectorAll('h2,h3,p,li')).forEach(function(n){if(n.closest('.dkh,.dkb-cta,.dkb-toc,.dkb-author,.dkbd,.dkl-player'))return;if(n.tagName==='P'&&n.closest('li'))return;var t=txt(n);if(t&&!/^sources\b/i.test(t))(t.match(/[^.!?]+[.!?]*\s*/g)||[t]).forEach(function(s){if(s.trim())chunks.push(s.trim());});});
 chunks.forEach(function(s){total+=s.length;});
 var box=el('div','dkl-player');box.setAttribute('role','region');box.setAttribute('aria-label','Listen to this article');
 box.innerHTML='<button class="dkl-pb" type="button" aria-label="Play">'+DKL.icon('play',{style:'filled',cls:'i-play'})+DKL.icon('pause',{style:'filled',cls:'i-pause'})+'</button><div class="dkl-c"><div class="dkl-top"><p class="dkl-t">Listen to this article</p><button class="dkl-sp" type="button" aria-label="Reading speed">1×</button></div><p class="dkl-s"></p><div class="dkl-pr"><span class="dkl-a">0:00</span><span class="dkl-tr"><span class="dkl-f"></span></span><span class="dkl-b"></span></div></div>';
 after.parentNode.insertBefore(box,after.nextSibling);
 var pb=box.querySelector('.dkl-pb'),sp=box.querySelector('.dkl-sp'),tl=box.querySelector('.dkl-t'),sub=box.querySelector('.dkl-s'),fl=box.querySelector('.dkl-f'),ta=box.querySelector('.dkl-a'),tb=box.querySelector('.dkl-b');
 var dur=mins*60;function mm(s){s=Math.max(0,Math.round(s));return Math.floor(s/60)+':'+('0'+s%60).slice(-2);}
 sub.textContent='About '+mins+' min · great for busy hands and little listeners';tb.textContent=mm(dur);
 function ui(){box.classList.toggle('is-play',state==='play');pb.setAttribute('aria-label',state==='play'?'Pause':'Play');tl.textContent=state==='play'?'Listening…':state==='pause'?'Paused':'Listen to this article';
  var f=total?done/total:0;fl.style.width=(f*100)+'%';ta.textContent=mm(f*dur/rates[ri]);tb.textContent=mm(dur/rates[ri]);}
 var NOVEL=/albert|bad news|bahh|bells|boing|bubbles|cellos|eddy|flo\b|fred|good news|grandma|grandpa|jester|junior|kathy|organ|ralph|reed|rocko|sandy|shelley|superstar|trinoids|whisper|wobble|zarvox|espeak|compact/i;
 function score(x){var n=x.name,sc=0;if(NOVEL.test(n))return -1;
  if(/natural|neural|premium|enhanced|siri/i.test(n))sc+=100;else if(/online/i.test(n))sc+=80;
  if(/google us english/i.test(n))sc+=60;else if(/samantha|ava|zoe|allison|jenny|aria|michelle|guy|evan|nathan/i.test(n))sc+=50;else if(/google uk english female|serena|libby|sonia|daniel|karen|moira|tessa/i.test(n))sc+=35;
  if(/^en[-_]us/i.test(x.lang))sc+=10;else if(/^en[-_](gb|au|ca|ie|nz)/i.test(x.lang))sc+=5;
  return sc;}
 var best=null;function voice(){if(best)return best;var v=S.getVoices().filter(function(x){return /^en(-|_)/i.test(x.lang)&&score(x)>=0;});v.sort(function(a,b){return score(b)-score(a);});best=v[0]||null;return best;}
 if('onvoiceschanged' in S)S.addEventListener('voiceschanged',function(){best=null;});
 function stop(){gen++;S.cancel();}
 function speak(){var g=gen;if(i>=chunks.length){state='ready';i=0;done=0;ui();return;}var u=new SpeechSynthesisUtterance(chunks[i]),v=voice();if(v)u.voice=v;u.lang=v?v.lang:'en-US';u.rate=rates[ri];
  u.onend=function(){if(state!=='play'||g!==gen)return;done+=chunks[i].length;i++;ui();speak();};u.onerror=function(){};S.speak(u);}
 pb.addEventListener('click',function(){if(state==='play'){state='pause';stop();}else{state='play';stop();speak();}ui();});
 sp.addEventListener('click',function(){ri=(ri+1)%rates.length;sp.textContent=String(rates[ri]).replace(/^0/,'')+'×';if(state==='play'){stop();speak();}ui();});
 window.addEventListener('pagehide',stop);
 ui();
}

var tries=0;
function go(){
 var path=location.pathname.replace(/\/$/,'');
 if(path===BASE){index();return;}
 var s=slugOf(path);if(!s)return;
 var p=d.getElementById('page-section-blog-post');
 if((!p||!p.getAttribute('data-dkb'))&&tries++<40){setTimeout(go,150);return;}
 setTimeout(function(){post(s);},60);
}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go();
})();
