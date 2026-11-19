/* Source: Payhip header injection, live 19 Nov 2026 */
(function(){
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var DESKTOP=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
  var COLORS=['#F974BC','#9F4DD5','#FACA03','#06A7EE','#0BA45E','#F48102'];
  var CLICKABLE='a,button,[role=button],input[type=submit],input[type=button],summary,label[for],.product-card,[onclick]';
  var TYPING='input:not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]),textarea,select,[contenteditable=""],[contenteditable=true],iframe';

  /* ---------- particles: real physics (velocity, gravity, drag, tumble, flutter) ---------- */
  var parts=[],pRun=false;
  function spawn(cls,x,y,vx,vy,color,size,life){
    var d=document.createElement('div');d.className='dkl-fx '+cls;d.style.background=color;d.style.width=d.style.height=size+'px';d.style.margin=(-size/2)+'px 0 0 '+(-size/2)+'px';
    document.body.appendChild(d);
    parts.push({d:d,x:x,y:y,vx:vx,vy:vy,r:Math.random()*360,vr:(Math.random()-.5)*14,age:0,life:life,seed:Math.random()*6.28,petal:cls==='petal',s:1});
    if(!pRun){pRun=true;requestAnimationFrame(pStep);}
  }
  var pLast=0;
  function pStep(now){
    var dt=pLast?Math.min(40,now-pLast)/16.67:1;pLast=now;
    for(var i=parts.length-1;i>=0;i--){var p=parts[i];p.age+=dt;
      var drag=p.petal?.94:.965;p.vx*=Math.pow(drag,dt);p.vy*=Math.pow(drag,dt);
      p.vy+=(p.petal?.11:.2)*dt;                                        // gravity (petals fall slower)
      if(p.petal){p.x+=Math.sin(p.age*.18+p.seed)*.9*dt;p.vr+=Math.sin(p.age*.12+p.seed)*.4;} // flutter + tumble
      p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;
      var k=p.age/p.life,o=k<.7?1:Math.max(0,1-(k-.7)/.3),sc=k<.12?.4+k/.12*.6:1;
      p.d.style.opacity=o;p.d.style.transform='translate3d('+p.x.toFixed(1)+'px,'+p.y.toFixed(1)+'px,0) rotate('+p.r.toFixed(0)+'deg) scale('+(sc*(p.petal?1:1)).toFixed(2)+(p.petal?','+(.55+.45*Math.abs(Math.cos(p.age*.15+p.seed))).toFixed(2):'')+')';
      if(p.age>=p.life){p.d.remove();parts.splice(i,1);}
    }
    if(parts.length)requestAnimationFrame(pStep);else{pRun=false;pLast=0;}
  }
  function ring(x,y,color,big){var d=document.createElement('div');d.className='dkl-fx ring';d.style.borderColor=color;document.body.appendChild(d);
    var a=d.animate([{transform:'translate('+x+'px,'+y+'px) scale(.3)',opacity:.9},{transform:'translate('+x+'px,'+y+'px) scale('+(big?2:1.5)+')',opacity:0}],{duration:520,easing:'cubic-bezier(.2,.7,.3,1)'});a.onfinish=function(){d.remove();};}
  function burst(x,y,big,small){
    ring(x,y,COLORS[Math.floor(Math.random()*4)],big);
    var n=big?14:(small?7:10),kinds=['petal','star','petal','dot','heart'];
    for(var i=0;i<n;i++){var a=-Math.PI/2+(Math.random()-.5)*Math.PI*1.5,sp=(small?3.2:4.2)+Math.random()*(big?4:3),k=kinds[i%kinds.length];
      spawn(k,x,y,Math.cos(a)*sp,Math.sin(a)*sp,COLORS[i%COLORS.length],k==='petal'?10+Math.random()*4:(k==='dot'?7:11),55+Math.random()*30);}
  }

  /* ---------- butterfly sprite (wings + body layers) ---------- */
  function makeBf(){
    var root=document.createElement('div');root.className='dkl-bf';root.setAttribute('aria-hidden','true');
    root.innerHTML='<div class="sh"></div><div class="bf"><i class="l"></i><i class="r"></i><i class="b"></i></div>';
    document.body.appendChild(root);
    return {root:root,bf:root.querySelector('.bf'),L:root.querySelector('.l'),R:root.querySelector('.r'),SH:root.querySelector('.sh')};
  }
  function wings(B,phase,amp,base){var open=.5+.5*Math.sin(phase),w=base+open*amp;B.L.style.transform='rotateY('+w.toFixed(1)+'deg)';B.R.style.transform='rotateY('+(-w).toFixed(1)+'deg)';}
  function noise(t,s){return Math.sin(t*1.0+s)*.5+Math.sin(t*1.7+s*2.3)*.3+Math.sin(t*2.9+s*.7)*.2;} // smooth pseudo-noise

  /* ---------- desktop: DKL doodle arrow cursor (Weave K01), spring physics ---------- */
  function cursor(){
    if(document.querySelector('.dkl-cur'))return;
    var c=document.createElement('div');c.className='dkl-cur';c.setAttribute('aria-hidden','true');c.innerHTML='<i class="n"></i><i class="h"></i>';document.body.appendChild(c);
    var HX=14,HY=13,mx=-200,my=-200,pmx=-200,seen=false,hot=null,typing=false,dragging=false,press=false,s=1,sv=0,r=0,rv=0,vx=0,last=0,running=true,lastBurst=0;
    function show(){var vis=!!(seen&&!typing&&!dragging);c.classList.toggle('on',vis);document.documentElement.classList.toggle('dkl-nocur',vis);}
    addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;if(running)kick();if(!seen){seen=true;pmx=mx;show();}},{passive:true});
    document.documentElement.addEventListener('mouseleave',function(){seen=false;show();});
    addEventListener('mouseover',function(e){var t=e.target;typing=!!(t.closest&&t.closest(TYPING));var h=(!typing&&t.closest)?t.closest(CLICKABLE):null;if(!!h!==!!hot){c.classList.toggle('hot',!!h);if(h)sv+=.06;}hot=h;show();},{passive:true});
    addEventListener('dragstart',function(){dragging=true;show();},true);['dragend','drop','mouseup'].forEach(function(n){addEventListener(n,function(){if(dragging){dragging=false;show();}},true);});
    addEventListener('pointerdown',function(e){if(e.pointerType&&e.pointerType!=='mouse')return;press=true;var now=performance.now();if(now-lastBurst<120)return;lastBurst=now;burst(e.clientX,e.clientY,!!hot,!hot);},{passive:true});
    addEventListener('pointerup',function(){press=false;},{passive:true});
    var raf=0;function kick(){if(!raf){last=0;raf=requestAnimationFrame(tick);}}document.addEventListener('visibilitychange',function(){running=!document.hidden;if(running)kick();});addEventListener('focus',function(){running=!document.hidden;kick();});addEventListener('pageshow',function(){running=!document.hidden;kick();});
    function tick(now){
      raf=0;if(!running)return;var dt=last?Math.min(40,now-last)/16.67:1;if(!(dt>0.05))dt=1;last=now;
      var nvx=(mx-pmx)/dt;pmx=mx;vx+=(nvx-vx)*.35;
      var ts=press?.86:(hot&&hot.isConnected?1.12:1);sv=(sv+(ts-s)*.22*dt)*Math.pow(.68,dt);s+=sv*dt;             // springy grow on buttons, squash on press
      var tr=Math.max(-12,Math.min(12,vx*.8))+(hot?-6:0);rv=(rv+(tr-r)*.16*dt)*Math.pow(.7,dt);r+=rv*dt;        // leans with speed, tilts up on buttons
      if(!isFinite(vx+s+sv+r+rv)){vx=0;s=1;sv=0;r=0;rv=0;}
      c.style.transform='translate3d('+(mx-HX).toFixed(1)+'px,'+(my-HY).toFixed(1)+'px,0) rotate('+r.toFixed(2)+'deg) scale('+s.toFixed(3)+')';
      raf=requestAnimationFrame(tick);
    }
    kick();
  }

  /* ---------- butterfly guide v12: lives on the logo (small = far away), flies to the CTA and grows to full size (close), then flies home ---------- */
  function guide(){
    var PATH=location.pathname,NOGUIDE=/\/(checkout|cart)/i.test(PATH);
    var FAR=.46,lastTap=0,lastTouch=0,lastScroll=performance.now(),sy=scrollY,sv=0,t0=performance.now();
    var MAXPAGE=10,MAXSESS=40,COOL=1500,pageN=0,lastLand=-1e9,seen=[];
    function sess(){try{return +(sessionStorage.getItem('dklBfN')||0);}catch(e){return 0;}}
    function bump(){try{sessionStorage.setItem('dklBfN',sess()+1);}catch(e){}}
    function logo(){var S=['.js-header-logo-image','header .logo img','header img'];for(var j=0;j<S.length;j++){var ls=document.querySelectorAll(S[j]);for(var i=0;i<ls.length;i++){var r=ls[i].getBoundingClientRect();if(r.width>20&&r.height>10&&r.bottom>0&&r.top<innerHeight)return r;}}return null;}
    function home(){var r=logo();if(r)return {x:r.right-8,y:r.top+r.height*.2,on:true};return {x:30,y:-30,on:false};}   // perch on the top-right of the logo
    var B=makeBf(),h0=home();
    var g={mx:-999,my:-999,orb:0,state:'home',x:h0.x,y:h0.y,vx:0,vy:0,sc:FAR,phase:0,flap:.6,next:0,seed:Math.random()*9,last:performance.now(),target:null,p:0,S:null,C:null,D:1,tStart:0};
    B.root.classList.add('on');
    addEventListener('pointerdown',function(e){
      var touch=e.pointerType==='touch'||e.pointerType==='pen';lastTouch=performance.now();
      var el=e.target.closest&&e.target.closest(CLICKABLE);
      if(g.target&&el&&(el===g.target||el.contains(g.target)||g.target.contains(el))&&(g.state==='rest'||g.state==='go'||g.state==='orbit')){celebrate();}
      else if((g.state==='rest'||g.state==='go'||g.state==='orbit')&&Math.hypot(e.clientX-g.x,e.clientY-g.y)<70){burst(g.x,g.y,false,true);nextStop();}
      else if(g.state==='home'&&Math.hypot(e.clientX-g.x,e.clientY-g.y)<40){g.flap=1.4;}                      // tap the logo butterfly: it flutters
      if(!el||!touch)return;var now=performance.now();if(now-lastTap<200)return;lastTap=now;burst(e.clientX,e.clientY,false,true);
    },{passive:true});
    if(DESKTOP){addEventListener('mousemove',function(e){g.mx=e.clientX;g.my=e.clientY;var d=Math.hypot(e.clientX-g.x,e.clientY-g.y),T=g.target,over=!!(T&&e.target&&(T===e.target||T.contains(e.target)));
      if((g.state==='rest'&&(over||d<70))||(g.state==='go'&&over)){g.state='orbit';g.orb=Math.atan2(g.y-g.my,g.x-g.mx);g.flap=1.6;}   // v13: hover the CTA or the butterfly -> it plays around the cursor
      else if(g.state==='orbit'){var r=T&&T.getBoundingClientRect(),near=over||(r&&e.clientX>r.left-80&&e.clientX<r.right+80&&e.clientY>r.top-80&&e.clientY<r.bottom+80);if(!near)nextStop();}   // leave the CTA -> fly on to the next stop of the story
      else if(g.state==='home'&&d<45)g.flap=Math.max(g.flap,1.2);},{passive:true});
    document.documentElement.addEventListener('mouseleave',function(){if(g.state==='orbit'&&g.target){g.state='go';g.flap=1.2;plan(dest());}});}
    addEventListener('scroll',function(){var now=performance.now();sv=Math.abs(scrollY-sy);sy=scrollY;lastScroll=now;
      if((g.state==='rest'||g.state==='go'||g.state==='orbit')&&!inView(g.target,40))nextStop();},{passive:true});
    var P1=/(buy now|add to cart|get (it|them|this) free|download (it )?free|get \d+ free|free (printable )?(pages|sample|pack|printables)|claim)/i,
        P2=/(shop (all|now|the)|start here|see (all|bundles|the bundle)|view (bundle|all)|browse|explore)/i;
    function inView(el,pad){if(!el||!el.isConnected)return false;var bb=el.closest&&el.closest('.dkp-buybar');if(bb)return bb.classList.contains('on');var r=el.getBoundingClientRect();return r.width>0&&r.top>pad+40&&r.bottom<innerHeight-pad&&r.left>=-2&&r.right<=innerWidth+2;}
    // hand-picked hooks (top priority). Add a selector here to make the butterfly guide visitors to it.
    var HOOKS='.dkt-card[data-id="'+DKL.id('teacherBundle')+'"],.dkl .dkl-btn[href$="'+DKL.link('completeLibrary')+'"],.dkm-card .dkm-up,.dkm-card .dkm-btn,.dkb-cta-b';
    function pick(){
      try{[].forEach.call(document.querySelectorAll(HOOKS),function(e){e.setAttribute('data-dkl-hook','')})}catch(x){}
      var els=document.querySelectorAll('[data-dkl-hook],a,button,[role=button],input[type=submit]'),best=null,bs=-1,cy=innerHeight*.5;
      for(var i=0;i<els.length;i++){var el=els[i];if(seen.indexOf(el)>=0)continue;
        if(el.closest('header,footer,nav,.dkl-bf,[aria-hidden=true]'))continue;
        var t=(el.textContent||el.value||'').replace(/\s+/g,' ').trim();
        var cls=(el.className&&el.className.baseVal===undefined?el.className:'')+'';
        var p=el.hasAttribute('data-dkl-hook')?3:(t.length>40?0:(P1.test(t)||/buy|add-to-cart/i.test(cls)?2:(P2.test(t)?1:0)));if(!p)continue;if(/buy now/i.test(t))p+=.5;   // data-dkl-hook = a hook we choose by hand
        var r=el.getBoundingClientRect();if(r.width<40||r.height<24||!inView(el,60))continue;
        var cs=getComputedStyle(el);if(cs.visibility==='hidden'||+cs.opacity<.5)continue;
        var s=p*1000-Math.abs((r.top+r.bottom)/2-cy);if(s>bs){bs=s;best=el;}}
      return best;
    }
    // appear only when the visitor pauses (not while scrolling, typing or right after a tap)
    if(!NOGUIDE)setInterval(function(){
      if(g.state!=='home'||document.hidden)return;var now=performance.now();
      if(now-t0<600||now-lastScroll<450||now-lastTouch<600||now-lastLand<COOL)return;
      if(pageN>=MAXPAGE||sess()>=MAXSESS)return;
      var a=document.activeElement;if(a&&a.matches&&a.matches(TYPING))return;
      var el=pick();if(el)fly(el);
    },150);
    function dest(){var r=g.target.getBoundingClientRect();return {x:Math.min(r.right-14,innerWidth-24),y:r.top-13};}
    function plan(to){ // curved flight path: start -> lifted control point -> end
      var S={x:g.x,y:g.y},dx=to.x-S.x,dy=to.y-S.y,dist=Math.hypot(dx,dy)||1,side=(Math.random()<.5?-1:1)*Math.min(140,dist*.28);
      g.S=S;g.C={x:S.x+dx*.5+(-dy/dist)*side,y:S.y+dy*.5+(-dx/dist)*side*.4-Math.min(120,dist*.22)};
      g.D=Math.min(1700,650+dist*.75);g.tStart=performance.now();g.p=0;}
    function fly(target){seen.push(target);pageN++;bump();g.target=target;g.state='go';g.flap=1.5;plan(dest());}
    function goHome(){if(g.state==='home'||g.state==='back')return;g.state='back';g.flap=1.2;var h=home();plan(h);lastLand=performance.now();}
    function nextStop(){if(g.target&&seen.indexOf(g.target)<0)seen.push(g.target);var el=(pageN<MAXPAGE&&sess()<MAXSESS)?pick():null;if(el)fly(el);else{if(g.state==='orbit')g.state='rest';goHome();}}
    function celebrate(){burst(g.x,g.y+6,false,true);g.flap=1.6;goHome();}
    function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
    function bez(S,C,E,t){var u=1-t;return {x:u*u*S.x+2*u*t*C.x+t*t*E.x,y:u*u*S.y+2*u*t*C.y+t*t*E.y};}
    function step(now){
      requestAnimationFrame(step);if(document.hidden)return;
      var dt=Math.min(40,now-g.last)/16.67;g.last=now;var tx,ty,landed=false,sTarget;
      if(g.state==='home'){var h=home();tx=h.x;ty=h.y;sTarget=FAR;landed=true;B.root.style.opacity=h.on?'':'0';g.x=tx;g.y=ty;g.vx=0;g.vy=0;}
      else if(g.state==='rest'){if(!g.target.isConnected){goHome();return;}var d0=dest();tx=d0.x;ty=d0.y;sTarget=1;landed=true;if(now-lastLand>7000)nextStop();}
      else if(g.state==='orbit'){if(!g.target||!g.target.isConnected){nextStop();return;}g.orb+=dt*.12;var Rr=38+8*Math.sin(now/260);tx=g.mx+Math.cos(g.orb)*Rr*1.3;ty=g.my+Math.sin(g.orb)*Rr*.85-8;sTarget=.92;}
      else{ // 'go' or 'back': follow the curved path, size grows (coming close) or shrinks (flying far away)
        var E=g.state==='go'?dest():home();g.p=Math.min(1,(now-g.tStart)/g.D);var e=ease(g.p),pt=bez(g.S,g.C,E,e),w=Math.sin(Math.PI*g.p);
        tx=pt.x+noise(now/420,g.seed)*14*w;ty=pt.y+noise(now/360,g.seed+4)*10*w;
        sTarget=g.state==='go'?FAR+(1-FAR)*e+.1*w:1-(1-FAR)*e;                                                             // depth: far = small, near = big (slight overshoot as it comes close)
        if(g.p>=1&&Math.hypot(E.x-g.x,E.y-g.y)<4){if(g.state==='go'){g.state='rest';lastLand=now;g.flap=.8;}else{g.state='home';g.target=null;lastLand=now;g.flap=.6;}}}
      var k=landed?.3:(g.state==='orbit'?.34:.27),damp=landed?.6:.66;
      g.vx=(g.vx+(tx-g.x)*k*dt)*Math.pow(damp,dt);g.vy=(g.vy+(ty-g.y)*k*dt)*Math.pow(damp,dt);g.x+=g.vx*dt;g.y+=g.vy*dt;
      g.sc+=(sTarget-g.sc)*Math.min(1,.18*dt);
      var sp=Math.hypot(g.vx,g.vy),flying=!landed||sp>1.5;g.flap*=Math.pow(.95,dt);
      if(landed&&now>g.next){g.flap=Math.max(g.flap,.35);g.next=now+3200+Math.random()*3000;}                              // a tiny flutter now and then
      g.phase+=dt*(flying?.42+Math.min(.45,sp*.06)+g.flap*.35:.05+g.flap*.4);
      wings(B,g.phase,flying?60:34+g.flap*30,flying?10:8);
      var bob=flying?Math.sin(g.phase)*-2*g.sc:0,ang=flying?Math.max(-30,Math.min(30,g.vx*3)):-10;
      B.bf.style.transform='translate3d('+g.x.toFixed(1)+'px,'+(g.y+bob).toFixed(1)+'px,0) rotate('+ang.toFixed(1)+'deg) rotateX('+(flying?14:0)+'deg) scale('+g.sc.toFixed(3)+')';
      var shy=landed?15*g.sc:22+18*(1-g.sc);B.SH.style.transform='translate3d('+g.x.toFixed(1)+'px,'+(g.y+shy).toFixed(1)+'px,0) scale('+((landed?.55:.7)*g.sc).toFixed(2)+')';B.SH.style.opacity=(landed?.3:.22)*g.sc;
    }
    requestAnimationFrame(step);
  }

  function start(){if(DESKTOP)cursor();guide();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
