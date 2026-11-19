/* Source: Payhip header injection, live 19 Nov 2026 */
/* 49 DKL top nav current line (L2) */
(function(){function go(){try{var hd=document.querySelector('header');if(!hd)return;var outer=hd.querySelector('.header-outer');var links=[].slice.call(hd.querySelectorAll('a.js-header-nav-item-link-level0'));if(!outer||!links.length)return;
var p=(location.pathname.replace(/\/+$/,'')||'/').toLowerCase();
function pathOf(a){try{return new URL(a.href,location.href).pathname.replace(/\/+$/,'').toLowerCase();}catch(e){return '';}}
var cur=null,shop=null;links.forEach(function(a){var h=pathOf(a);if(h==='/collection/all')shop=a;if(h&&h!=='/'&&(p===h||p.indexOf(h+'/')===0))cur=a;});
if(!cur){var free=links.filter(function(a){return pathOf(a)===DKL.link('freeSample').toLowerCase();})[0];var blog=links.filter(function(a){return pathOf(a).indexOf('/blog')===0;})[0];
if(blog&&p.indexOf('/blog')===0)cur=blog;else if(free&&(p==='/my-name'||p==='/draw-it-alive'))cur=free;else if(shop&&(p.indexOf('/collection')===0||p.indexOf('/b/')===0||p==='/explore'))cur=shop;}
document.documentElement.classList.add('dkn-on');
var line=document.createElement('span');line.className='dkn-line is-cur';line.setAttribute('aria-hidden','true');
var hov=document.createElement('span');hov.className='dkn-line is-hov';hov.setAttribute('aria-hidden','true');
outer.appendChild(hov);outer.appendChild(line);
if(cur){cur.classList.add('dkn-cur');cur.setAttribute('aria-current','page');}
function place(el,a){if(!a||!a.offsetWidth){el.style.width='0';return;}var o=outer.getBoundingClientRect(),r=a.getBoundingClientRect();el.style.left=(r.left-o.left-12)+'px';el.style.width=(r.width+24)+'px';}
function all(){place(line,cur);}
all();window.addEventListener('resize',all);window.addEventListener('load',all);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(all);
links.forEach(function(a){if(a===cur)return;a.addEventListener('mouseenter',function(){place(hov,a);hov.classList.add('is-on');});a.addEventListener('mouseleave',function(){hov.classList.remove('is-on');});});
}catch(e){document.documentElement.classList.remove('dkn-on');}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();
