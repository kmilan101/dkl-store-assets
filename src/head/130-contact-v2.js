/* Source: Payhip header injection, live 19 Nov 2026 */
(function(){
if(!/^\/contact\/?$/.test(location.pathname))return;
var H=document.documentElement;H.classList.add('dkc-on');
var S=function(d,c){return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="'+d+'" stroke="'+(c||'#565D70')+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';};
var I={
clock:S('M12 8V12L15 14M4 1L1 4M20 1L23 4M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z'),
q:S('M10 10.5V10C10 8.89543 10.8954 8 12 8C13.1046 8 14 8.89543 14 10V10.1213C14 10.6839 13.7765 11.2235 13.3787 11.6213L12 13M12.5 16C12.5 16.2761 12.2761 16.5 12 16.5C11.7239 16.5 11.5 16.2761 11.5 16M12.5 16C12.5 15.7239 12.2761 15.5 12 15.5C11.7239 15.5 11.5 15.7239 11.5 16M12.5 16H11.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z'),
mail:S('M18 8L17 8.66667L16.4376 9.0416C14.8338 10.1108 14.0319 10.6454 13.1652 10.8531C12.3992 11.0366 11.6008 11.0366 10.8348 10.8531C9.96808 10.6454 9.16618 10.1108 7.5624 9.0416L7 8.66667L6 8M10 21H14C16.8003 21 18.2004 21 19.27 20.455C20.2108 19.9757 20.9757 19.2108 21.455 18.27C22 17.2004 22 15.8003 22 13V11C22 8.19974 22 6.79961 21.455 5.73005C20.9757 4.78924 20.2108 4.02433 19.27 3.54497C18.2004 3 16.8003 3 14 3H10C7.19974 3 5.79961 3 4.73005 3.54497C3.78924 4.02433 3.02433 4.78924 2.54497 5.73005C2 6.79961 2 8.19974 2 11V13C2 15.8003 2 17.2004 2.54497 18.27C3.02433 19.2108 3.78924 19.9757 4.73005 20.455C5.79961 21 7.19974 21 10 21Z'),
arrow:S('M3 11.9999H21M14 5L21 11.9999L14 18.9999','#0B1023')
};
function build(){
try{
var blk=document.querySelector('.js-contact-us-form-block');
if(!blk||document.querySelector('.dkc')){if(!blk)H.classList.remove('dkc-on');return;}
var sec=blk.closest('.section-wrapper'),con=sec&&sec.querySelector('.section-contents');
if(!con){H.classList.remove('dkc-on');return;}
var w=document.createElement('div');w.className='dkc';
w.innerHTML='<div class="dkc-panel"><div class="dkc-card"><p class="dkc-k">WE’RE HERE TO HELP</p><p class="dkc-t">Ask us anything</p><ul class="dkc-rows"><li>'+I.clock+'<span>A real person replies, usually within one working day</span></li><li>'+I.q+'<span>Most answers are already in our <a href="/help-center">Help Center</a></span></li><li>'+I.mail+'<span>Orders, downloads and school licenses</span></li></ul></div></div><div class="dkc-form"><h1 class="dkc-h">Get in touch</h1><p class="dkc-sub">Questions about an order, a download or a school license? Send us a message and we will get back to you.</p><div class="dkc-slot"></div><div class="dkc-div"></div><p class="dkc-alt">Prefer email? <a href="mailto:support@doodlekidsland.com">support@doodlekidsland.com</a></p><p class="dkc-note">We use your details only to answer your message. See our <a href="/privacy-policy">Privacy Policy</a>.</p></div>';
w.querySelector('.dkc-slot').replaceWith(blk);
con.appendChild(w);
var F={firstName:['First name','Your first name','given-name'],lastName:['Last name','Your last name','family-name'],emailAddress:['Email address','you@example.com','email'],message:['Message','How can we help?','']};
Object.keys(F).forEach(function(k){var el=blk.querySelector('[name="'+k+'"]');if(!el)return;el.placeholder=F[k][1];if(F[k][2])el.setAttribute('autocomplete',F[k][2]);var g=el.closest('.form-group'),lb=g&&g.querySelector('label');if(lb){lb.textContent=F[k][0];if(!el.id)el.id='dkc-'+k;lb.setAttribute('for',el.id);}});
var bs=blk.querySelector('.js-button-state-standard');if(bs)bs.innerHTML=I.arrow+'<span>Send message</span>';
var old=sec.querySelector('.row');if(old)old.setAttribute('aria-hidden','true');
}catch(e){H.classList.remove('dkc-on');}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();
