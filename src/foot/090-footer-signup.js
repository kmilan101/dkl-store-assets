/* Source: Payhip footer injection, live 19 Nov 2026 */
/* 47-footer-v2 signup (18 Nov 2026) · Figma: Footer / Email signup · opens the free sample checkout */
(function(){
function b(){
var w=document.querySelector('.group-footer-wrapper');if(!w||w.querySelector('.dkfs'))return;
var d=document.createElement('div');d.className='dkfs';
d.innerHTML='<p class="dkfs-t">Free pages in your inbox</p><p class="dkfs-s">New printables and seasonal freebies. No spam, unsubscribe anytime.</p><form class="dkfs-f" novalidate><label class="dkfs-l" for="dkfs-in">Email address</label><input id="dkfs-in" type="email" name="email" placeholder="you@example.com" autocomplete="email" required><button type="submit">Send me free pages</button></form><p class="dkfs-e" role="alert">Please enter a valid email address.</p><p class="dkfs-n">We only use your email to send DKL news. See our <a href="/privacy-policy">Privacy Policy</a>.</p>';
w.appendChild(d);
var f=d.querySelector('form'),i=d.querySelector('input');
f.addEventListener('submit',function(e){e.preventDefault();var v=(i.value||'').trim();
if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){d.classList.add('is-err');i.setAttribute('aria-invalid','true');i.focus();return;}
d.classList.remove('is-err');i.removeAttribute('aria-invalid');
location.href='/buy?link=t8MFO&email='+encodeURIComponent(v);});
i.addEventListener('input',function(){if(d.classList.contains('is-err')){d.classList.remove('is-err');i.removeAttribute('aria-invalid');}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',b);else b();
})();
