/* DKL Payhip icons (19 Nov 2026, Milan: "one consistent icon set everywhere")
   Payhip's own theme icons, and icons inside HTML pasted into single Payhip pages, are swapped for the library icons
   (src/data/icons.json · Anron Icons 10 · Foundation page 06 section 2 "Where to use which icon").
   Kept on purpose: payment card logos and the X (Twitter) share logo (brand marks; Anron has no X logo). */
(function(){
 /* icons: chevron-down, search, cross, arrow-right, check, facebook, pinterest, star:filled, check-circle, arrows-move, plus */
 var RULES=[
  // [selector, icon, options] - size/colour fall back to the old icon's own width and colour
  ['.js-header-nav-item-link-level0>svg.icon-down-arrow','chevron-down',{size:16,inherit:1}],
  ['.live-search-button-search>svg.icon-search','search',{size:20,color:'#565D70'}],
  ['.live-search-form-button-close>svg.icon-close','cross',{size:20,color:'#565D70'}],
  ['span.icon-wrap>svg.icon-arrow','arrow-right',{size:16,inherit:1}],
  ['.dkf-stars>svg','star',{size:20,style:'filled',color:'#F48102'}],     // icon/rating
  ['.dkm-pill svg','check-circle',{}],
  ['.dkm-cue>svg','arrows-move',{size:20}],
  ['.dkm-x>svg','cross',{size:16}],
  ['.dkab-logo>svg[width="28"]','plus',{size:24}]
 ];
 var SHARE={'M16 8.049':'facebook','M8 0a8 8':'pinterest'}; // Payhip share buttons, matched by the start of their drawing
 function col(svg){var p=svg.querySelector('[stroke]:not([stroke="none"]),[fill]:not([fill="none"])');return p?(p.getAttribute('stroke')&&p.getAttribute('stroke')!=='none'?p.getAttribute('stroke'):p.getAttribute('fill')):''}
 function swap(svg,name,o){
  if(!svg||svg.classList.contains('dki'))return;
  var size=o.size||parseInt(svg.getAttribute('width'),10)||24;
  var c=o.inherit?'':(o.color||col(svg)||'');
  var el=DKL.iconEl(name,{size:size,color:c||undefined,style:o.style,cls:'dkpi'});
  if(!el)return;
  svg.replaceWith(el);
 }
 function run(){
  try{
   RULES.forEach(function(r){document.querySelectorAll(r[0]).forEach(function(s){swap(s,r[1],r[2])})});
   document.querySelectorAll('.js-trigger-social-media>svg:not(.dki)').forEach(function(s){
    var p=s.querySelector('path'),k=p&&p.getAttribute('d')||'';
    for(var pre in SHARE){if(k.indexOf(pre)===0){swap(s,SHARE[pre],{size:20,inherit:1});return}}
    s.setAttribute('width','20');s.setAttribute('height','20'); // X logo: keep the official mark, same size as the others
   });
   document.querySelectorAll('span.icon.dripicons-checkmark:not(.dkpi-done)').forEach(function(sp){
    sp.classList.add('dkpi-done');sp.appendChild(DKL.iconEl('check',{size:16,cls:'dkpi'}));
   });
  }catch(e){}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
 setTimeout(run,800);setTimeout(run,2500);
 var t=0;try{new MutationObserver(function(){clearTimeout(t);t=setTimeout(run,120)}).observe(document.body,{childList:true,subtree:true})}catch(e){}
})();
