/* Source: Payhip footer injection, live 19 Nov 2026 */
/* 48-footer-sky-motion (18 Nov 2026) · wind-driven clouds, balloons and airship with bob, sway and cursor lift */
(function(){
var K={A:'1k7j5ce0i12jsg411g1u23s1361k',B1:'1k7j59mv91md3tk1k31o3p2rh13',B3:'1k7j5ce0ifvm1ln51mup14ifhe71m',B5:'1k7j5ce0i2eoqqcveal2k1rac1o',C2:'1k7j5ce0i15i9jhqamfocq1r841r',C3:'1k7j5ce0i5dp189au9h2vt37e1s'};
var U=function(k,w){return 'https://payhip.com/cdn-cgi/image/format=auto,width='+w+'/https://pe56d.s3.amazonaws.com/o_'+K[k]+'.png'};
/* [key, x@1440, y, width, speed px/s, bob px, bob s, sway deg, clickable, shadow] */
var D=[['C2',150,-34,190,9,2,9,0,0,1],['C3',780,58,130,7,2,11,0,0,1],['C2',1290,-18,150,8,2,10,0,0,1],['B3',620,38,62,13,4,6.5,3,1,0],['B1',330,12,84,19,5,5.2,3.5,1,0],['B5',1250,26,72,16,4,5.8,3,1,0],['A',1040,22,150,23,3,4.4,1.6,1,0]];
var M=[['C2',120,-22,120,7,2,9,0,0,1],['B1',40,6,60,13,3,5.2,3,1,0],['A',262,9,100,17,2,4.4,1.4,1,0]];
function init(){
var w=document.querySelector('.section-wrapper:has(.group-footer-wrapper) .section-contents-wrapper');if(!w||w.querySelector('.dkfx'))return;
var box=document.createElement('div');box.className='dkfx';w.insertBefore(box,w.firstChild);
var red=matchMedia('(prefers-reduced-motion: reduce)').matches,mob,items=[],W=0,H=0,px=-999,py=-999,run=0,vis=1,last=0,t0=0;
function build(){box.innerHTML='';items=[];mob=innerWidth<992;W=box.clientWidth;H=box.clientHeight;var L=mob?M:D,sx=mob?W/390:W/1440;
L.forEach(function(d,i){var el,img=new Image();img.alt='';img.decoding='async';img.loading='lazy';img.src=U(d[0],Math.round(d[3]*2));
if(d[8]){el=document.createElement('a');el.href='/explore';el.setAttribute('aria-label','Explore Doodle World');el.title='Explore Doodle World';}else{el=document.createElement('span');el.setAttribute('aria-hidden','true');}
el.className='dkfx-i';el.style.width=d[3]+'px';el.appendChild(img);
var sh=null;if(d[9]){sh=document.createElement('span');sh.className='dkfx-sh';sh.style.width=d[3]*0.9+'px';sh.style.height=d[3]*0.3+'px';box.appendChild(sh);}
box.appendChild(el);items.push({d:d,el:el,sh:sh,x:d[1]*sx,ph:i*1.7,oy:0,vy:0,ox:0,vx:0});});}
function step(ts){if(!run)return;var dt=Math.min(0.05,(ts-(last||ts))/1000);last=ts;var t=(ts-t0)/1000;
items.forEach(function(o){var d=o.d,w2=d[3];o.x+=d[4]*dt;if(o.x>W+20)o.x=-w2-20;
var cx=o.x+w2/2,cy=d[2]+w2*0.35+o.oy,dx=cx-px,dy=cy-py,r=Math.sqrt(dx*dx+dy*dy),R=mob?70:110;
if(r<R&&d[8]){var f=(1-r/R)*900;o.vy+=(dy/(r||1))*f*dt-f*0.6*dt;o.vx+=(dx/(r||1))*f*0.5*dt;}
o.vy+=(-60*o.oy)*dt;o.vx+=(-60*o.ox)*dt;o.vy*=Math.pow(0.04,dt);o.vx*=Math.pow(0.04,dt);o.oy+=o.vy*dt;o.ox+=o.vx*dt;
var a=2*Math.PI*t/d[6]+o.ph,by=d[5]*Math.sin(a),rot=d[7]*Math.sin(a*0.5+o.ph)+(d[0]=='A'?-d[7]*Math.cos(a):0)+o.vx*0.02;
o.el.style.transform='translate3d('+(o.x+o.ox).toFixed(1)+'px,'+(d[2]+by+o.oy).toFixed(1)+'px,0) rotate('+rot.toFixed(2)+'deg)';
if(o.sh)o.sh.style.transform='translate3d('+(o.x+w2*0.15+18).toFixed(1)+'px,'+(H*0.62).toFixed(1)+'px,0)';});
requestAnimationFrame(step);}
function go(){var on=vis&&!document.hidden&&!red;if(on&&!run){run=1;last=0;requestAnimationFrame(step);}else if(!on)run=0;}
build();if(!t0)t0=performance.now();
if(red){items.forEach(function(o){var d=o.d;o.el.style.transform='translate3d('+o.x+'px,'+d[2]+'px,0)';if(o.sh)o.sh.style.transform='translate3d('+(o.x+d[3]*0.15+18)+'px,'+H*0.62+'px,0)';});}
var sec=w.closest('.section-wrapper');sec.addEventListener('pointermove',function(e){var b=box.getBoundingClientRect();px=e.clientX-b.left;py=e.clientY-b.top;},{passive:true});
sec.addEventListener('pointerleave',function(){px=py=-999;});
if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;go();}).observe(box);
document.addEventListener('visibilitychange',go);
var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){var m=innerWidth<992;if(m!==mob){build();}else{var nw=box.clientWidth;items.forEach(function(o){o.x=o.x*nw/(W||nw)});W=nw;H=box.clientHeight;}},150);});
go();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
