/* Source: Payhip footer injection, live 19 Nov 2026 */
/* dkd */
(function(){
var B='https://payhip.com/cdn-cgi/image/format=auto,width=',S='/https://pe56d.s3.amazonaws.com/o_';
/* Library icons (src/data/icons.json) · Line · one colour icon/interface #565D70 */
/* icons: brush, pen-tool, book-open, clipboard-text, gift, file-download, users, bulb, star, pin, user, arrow-right, chevron-right, cross, award, folder */
var AN={color:'brush',draw:'pen-tool',book:'book-open',sheet:'clipboard-text',gift:'gift',free:'file-download',teach:'users',blog:'bulb',star:'star',pin:'pin',user:'user',go:'arrow-right',chev:'chevron-right',close:'cross',award:'award',folder:'folder'};
function an(k,p){return DKL.icon(AN[k],{size:20,color:p||'#565D70'})}
var IC={};for(var k in AN)IC[k]=an(k);IC.goW=IC.go;IC.userW=IC.user;
function pick(t){t=t.toLowerCase();if(/bestseller/.test(t))return ['award','#FFE7A3'];if(/all collections/.test(t))return ['folder','#F1F3F7'];if(/color/.test(t))return ['color','#FFE7A3'];if(/draw/.test(t))return ['draw','#FFF6D1'];if(/story|book/.test(t))return ['book','#FBD9E8'];if(/work/.test(t))return ['sheet','#DDF5E7'];if(/bundle/.test(t))return ['gift','#FACA03'];if(/free/.test(t))return ['free','#DDF5E7'];if(/teach/.test(t))return ['teach','#FFF6D1'];if(/blog|learn/.test(t))return ['blog','#FBD9E8'];if(/christmas|holiday/.test(t))return ['star','#FFD6D2'];if(/map|explore/.test(t))return ['pin','#FFF6D1'];return ['sheet','#F1F3F7']}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&','<':'<','>':'>','"':'"'}[c]})}
function lk(a){return {t:(a.textContent||'').trim(),h:a.getAttribute('href')||'#'}}
function build(){
 var box=document.querySelector('.js-nav-mobile-contents');if(!box||box.querySelector('.dkd'))return;
 var menu=box.querySelector('.js-menu');if(!menu)return;
 var tops=[].slice.call(menu.children).filter(function(li){return li.tagName==='LI'});
 var shop=null,others=[],login=null;
 tops.forEach(function(li){var a=li.querySelector(':scope > a');if(!a)return;var l=lk(a);if(/menu-item-login/.test(li.className)){login=l;return}var sub=li.querySelector(':scope > ul');if(sub&&!shop){shop={l:l,groups:[].slice.call(sub.children).map(function(g){var ga=g.querySelector(':scope > a');var gu=g.querySelector(':scope > ul');return {l:ga?lk(ga):null,items:gu?[].slice.call(gu.querySelectorAll(':scope > li > a')).map(lk):[]}})}}else others.push(l)});
 if(!shop)return;
 var prints=null,ages=null,disc=[];shop.groups.forEach(function(g){var n=g.l?g.l.t.toLowerCase():'';if(/age/.test(n))ages=g;else if(!prints&&/print|type|categ/.test(n))prints=g;else disc=disc.concat(g.items)});
 if(!prints)prints=shop.groups[0];
 var mapL=disc.filter(function(x){return /map|explore/i.test(x.t+x.h)})[0];var seen={};others.forEach(function(o){seen[o.h]=1});
 var extra=disc.filter(function(x){return x!==mapL&&!seen[x.h]&&!/free/i.test(x.t)});
 var allL=prints.items.filter(function(x){return /all/i.test(x.t)})[0],cats=prints.items.filter(function(x){return x!==allL&&!/bestseller/i.test(x.t)}),best=prints.items.filter(function(x){return /bestseller/i.test(x.t)})[0],colls=disc.filter(function(x){return /collections/i.test(x.h+' '+x.t)})[0];
 var logo=document.querySelector('.header-display-mobile .js-header-logo-image')||document.querySelector('.js-header-logo-image');
 var h='<div class="dkd"><div class="dkd-top">'+(logo?'<a href="/" aria-label="Home"><img src="'+logo.currentSrc+'" alt="Doodle Kids Land"></a>':'')+'</div><div class="dkd-body">';
 if(mapL)h+='<a class="dkd-map" href="'+mapL.h+'"><span class="dkd-thumb" style="background-image:url('+B+'240'+S+'1k7j5endg1gfla7kkrpg5bg8o88.png)"><img src="'+B+'160'+S+'1k7j5dbcq1f6136l9gife6127542.png" alt=""></span><span class="dkd-mt"><b>Doodle World map</b><small>Every printable on one map</small></span><span class="dkd-chev">'+IC.chev+'</span></a>';
 h+='<div class="dkd-sec"><div class="dkd-hd"><p class="dkd-ov">'+esc(prints.l?prints.l.t:'Printables')+'</p>'+(allL?'<a class="dkd-all" href="'+allL.h+'">See all</a>':'')+'</div><div class="dkd-tiles">'+cats.map(function(c){var k=pick(c.t);return '<a class="dkd-tile" href="'+c.h+'">'+IC[k[0]]+'<span>'+esc(c.t)+'</span></a>'}).join('')+'</div></div>';
 if(ages&&ages.items.length)h+='<div class="dkd-sec"><p class="dkd-ov">'+esc(ages.l?ages.l.t:'By age')+'</p><div class="dkd-ages">'+ages.items.map(function(a){return '<a href="'+a.h+'" aria-label="'+esc(a.t)+'">'+esc(a.t.replace(/^Ages\s*/i,''))+'</a>'}).join('')+'</div></div>';
 var rows=[best,colls].filter(Boolean).concat(others);
 h+='<ul class="dkd-list">'+rows.map(function(r){var k=pick(r.t);return '<li><a class="dkd-row" href="'+r.h+'">'+IC[k[0]]+'<span>'+esc(r.t)+'</span>'+(/free/i.test(r.t)?'<em>Free</em>':'')+'</a></li>'}).join('')+'</ul></div>';
 h+=(login?'<div class="dkd-foot"><a class="dkd-login" href="'+login.h+'">'+IC.userW+'Log in to your library</a></div>':'')+'</div>';
 var cb=box.querySelector('.js-nav-mobile-close-button');if(cb)cb.innerHTML=an('close');var w=box.querySelector('.nav-inner-wrapper')||box;w.insertAdjacentHTML('beforeend',h);document.documentElement.classList.add('dkd-on')}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build()})();
