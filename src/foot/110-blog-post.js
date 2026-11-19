/* 110 blog post (19 Nov 2026) · Figma: 11 FOR APPROVAL · Blog batch 2 · "Try it" hook box
   - The hook box: real product cover, overline, headline, product line with the LIVE price, "See what's inside".
   - The post date from src/data/blog.json (shown in the byline and given to Google as BlogPosting JSON-LD).
   Works with the blog-post template (Payhip embed section), which sets data-dkb on the post and builds the old .dkb-cta box. */
(function(){
var B=window.DKL&&window.DKL.blog;if(!B)return;
var m=location.pathname.match(/^\/blog\/[^\/]+\/([^\/?#]+)\/?$/);if(!m)return;
var d=document,slug=m[1],iso=B.dates[slug]||'',tries=0;
function txt(e){return (e&&e.textContent||'').replace(/\s+/g,' ').trim();}
function fmt(dt){return dt.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});}
function el(tag,cls,t){var e=d.createElement(tag);if(cls)e.className=cls;if(t)e.textContent=t;return e;}

function place(post,body,box){
 var old=post.querySelector('.dkb-cta');
 if(old){old.parentNode.insertBefore(box,old);return;}
 var hh=[].slice.call(body.querySelectorAll('h2')).filter(function(e){return !e.closest('.dkb-toc');});
 var at=hh[Math.min(2,hh.length-1)];
 if(at&&/^faq/i.test(txt(at))&&hh.length>1)at=hh[1];
 if(at)body.insertBefore(box,at);else body.appendChild(box);
}

function hook(post,body){
 var H=B.hooks[slug],href='';
 if(H)href='/b/'+H.code;else{var a=body.querySelector('a[href*="/b/"]');if(a)href=a.getAttribute('href').replace(/^https?:\/\/[^\/]+/,'').split(/[?#]/)[0];}
 if(!href||!window.fetch)return;
 fetch(href,{credentials:'same-origin'}).then(function(r){return r.ok?r.text():'';}).then(function(h){
  if(!h||post.querySelector('.dkh'))return;
  var x=new DOMParser().parseFromString(h,'text/html');
  var name=txt(x.querySelector('.font-section-product-name')),pr=txt(x.querySelector('.product-price .value')),og=x.querySelector('meta[property="og:image"]'),img=og?og.getAttribute('content'):'';
  if(!name)return;
  var short=name.split(/:|,/)[0].trim();
  var box=el('aside','dkh');box.setAttribute('aria-label','Printable for this article');
  if(img){var i=el('img');i.src=img;i.alt=short+' cover';i.width=160;i.height=160;i.loading='lazy';box.appendChild(i);}
  var t=el('div','dkh-t');
  t.appendChild(el('p','dkh-o',H?H.over:'TRY IT TONIGHT · INSTANT PDF'));
  t.appendChild(el('p','dkh-h',H?H.head:short));
  t.appendChild(el('p','dkh-l',(H?H.line:short)+(pr?' · '+pr:'')));
  var b=el('a','dkh-b',"See what's inside");b.href=href;t.appendChild(b);
  box.appendChild(t);place(post,body,box);
 }).catch(function(){});
}

function ld(post,h1,dt){
 if(d.querySelector('script[data-dkl-article]'))return;
 var og=d.querySelector('meta[property="og:image"]'),im=og?og.getAttribute('content'):'';
 if(!im){var pi=post.querySelector('img');if(pi)im=pi.currentSrc||pi.src;}
 var day=dt&&!isNaN(dt)?dt.toISOString().slice(0,10):'';
 var o={'@context':'https://schema.org','@type':'BlogPosting',headline:txt(h1).slice(0,110),
  mainEntityOfPage:location.origin+location.pathname,
  author:{'@type':'Person',name:'Komal',url:location.origin+'/about-us'},
  publisher:{'@type':'Organization',name:'Doodle Kids Land',url:location.origin+'/'}};
 if(im)o.image=[im];if(day){o.datePublished=day;o.dateModified=day;}
 var s=el('script');s.type='application/ld+json';s.setAttribute('data-dkl-article','1');s.textContent=JSON.stringify(o);d.head.appendChild(s);
}

function go(){
 var post=d.getElementById('page-section-blog-post');
 if((!post||!post.getAttribute('data-dkb'))&&tries++<40){setTimeout(go,150);return;}
 if(!post)return;
 var body=post.querySelector('.blog-post-content'),meta=post.querySelector('.blog-post-meta'),h1=post.querySelector('.blog-post-name');
 var dt=iso?new Date(iso+'T09:00:00'):null;
 if(meta){
  if(dt){var s=txt(meta);meta.textContent=/Updated /.test(s)?s.replace(/Updated [^·]+/,'Updated '+fmt(dt)+' '):fmt(dt);}
  else{var mm=txt(meta).match(/Updated ([^·]+)/);dt=new Date(mm?mm[1].trim():txt(meta));}
 }
 if(body)hook(post,body);
 ld(post,h1,dt);
}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go();
})();
