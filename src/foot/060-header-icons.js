/* DKL header icons: Payhip's default header icons -> library icons (Icon/Interface, Icon/Commerce, Icon/Communication · Line · icon/interface #565D70). */
(function(){
 var MAP=[['.js-live-search-button-search','search'],['.header-cart-icon-button','shopping-bag'],['.header-login-icon-link','user'],['.header-burger-button','menu'],['.nav-mobile-close-button','cross']];
 /* icons: search, shopping-bag, user, menu, cross */
 function run(){MAP.forEach(function(m){document.querySelectorAll(m[0]).forEach(function(b){if(b.querySelector(':scope>svg.dkhi'))return;var old=b.querySelector(':scope>svg');var ic=DKL.iconEl(m[1],{cls:'dkhi',color:'#565D70'});if(old)b.insertBefore(ic,old);else b.insertBefore(ic,b.firstChild)})})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
 setTimeout(run,1200);
})();
