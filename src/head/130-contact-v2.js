/* Source: Payhip header injection, live 19 Nov 2026 */
(function(){
if(!/^\/contact\/?$/.test(location.pathname))return;
var H=document.documentElement;H.classList.add('dkc-on');
/* Library icons (src/data/icons.json) · Line */
var I={clock:DKL.icon('clock'),q:DKL.icon('question'),mail:DKL.icon('email'),arrow:DKL.icon('arrow-right',{color:'#0B1023'})
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
