// ============================================================
// templates.js — 3 templates in StoryBrand-opbouw (SB7)
// Volgorde: held/one-liner + CTA → probleem → gids (empathie +
// autoriteit) → plan (3 stappen) → wat we doen → succes →
// directe CTA. Klant = held, bedrijf = gids.
// ============================================================

function esc(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function bg(url, fb) { return `background-color:${fb};background-image:url('${url}');background-size:cover;background-position:center;`; }
function head(d, font) {
  return `<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(d.bedrijf)}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="${font}" rel="stylesheet">`;
}
const tel = d => esc((d.contact || {}).telefoon || '06 12 34 56 78');
const mail = d => esc((d.contact || {}).email || 'info@voorbeeld.nl');

// Universele, branche-neutrale SVG-iconen voor de diensten (stroke = currentColor).
// Roteren op volgorde, zodat elke dienst een eigen icoon krijgt.
const ICONS = [
  // vinkje in cirkel
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  // ster
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  // schild
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  // duim omhoog
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>',
  // bliksem
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  // hart
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
];
const icon = i => ICONS[i % ICONS.length];

// Gedeelde wow-CSS (scroll-reveal, hovers, sticky CTA, FAQ-accordeon).
// Werkt in elke template; gebruikt de bestaande --accent/--ink/--line variabelen.
function wowCss() {
  return `
.js .reveal{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.2,.6,.2,1),transform .7s cubic-bezier(.2,.6,.2,1)}
.js .reveal.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.js .reveal{opacity:1;transform:none}}
.band-imgs div,.hero-img{transition:transform .5s cubic-bezier(.2,.6,.2,1)}
.band-imgs div:hover{transform:scale(1.03)}
.sticky-cta{position:fixed;left:0;right:0;bottom:0;z-index:60;background:rgba(20,20,20,.96);backdrop-filter:blur(10px);transform:translateY(120%);transition:transform .4s cubic-bezier(.2,.6,.2,1);border-top:1px solid rgba(255,255,255,.1)}
.sticky-cta.show{transform:none}
.sticky-cta .scwrap{max-width:1180px;margin:0 auto;padding:13px 40px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.sticky-cta .t{color:#fff;font-weight:700;font-size:16px}
.sticky-cta .t span{display:block;color:#b3b3b3;font-weight:400;font-size:13px}
.sticky-cta .sc-actions{display:flex;gap:12px;align-items:center;flex-shrink:0}
.sticky-cta .sc-tel{color:#fff;text-decoration:none;font-weight:600;font-size:15px}
.sticky-cta .sc-btn{background:var(--accent);color:#fff;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;text-decoration:none}
.faqsec .faq-wrap{max-width:820px;margin:0 auto}
.faq-item{background:#fff;border:1px solid var(--line);border-radius:12px;margin-bottom:14px;overflow:hidden}
.faq-q{width:100%;text-align:left;background:none;border:none;cursor:pointer;padding:22px 26px;font-weight:700;font-size:17px;color:var(--ink);display:flex;justify-content:space-between;align-items:center;gap:16px}
.faq-q .fic{flex-shrink:0;width:26px;height:26px;border-radius:50%;background:var(--accent);color:#fff;display:grid;place-items:center;font-size:18px;font-weight:700;transition:transform .3s;line-height:1}
.faq-item.open .faq-q .fic{transform:rotate(45deg)}
.faq-a{max-height:0;overflow:hidden;transition:max-height .35s ease;color:var(--soft);font-size:16px;line-height:1.6}
.faq-a div{padding:0 26px 22px}
@media(max-width:840px){.sticky-cta .t span{display:none}.sticky-cta .scwrap{padding:13px 20px}}`;
}

// Gedeelde FAQ-sectie. `cls` = extra sectieklasse voor achtergrondkleur per template.
function faqSection(d, cls = '') {
  if (!d.faq || !d.faq.length) return '';
  return `<section class="faqsec ${cls}"><div class="wrap reveal"><div class="lab" style="text-align:center">Veelgestelde vragen</div><h2 class="sec-h" style="text-align:center;margin-left:auto;margin-right:auto">Goed om te weten.</h2>
<div class="faq-wrap">${d.faq.map(f => `<div class="faq-item"><button class="faq-q">${esc(f.v)}<span class="fic">+</span></button><div class="faq-a"><div>${esc(f.a)}</div></div></div>`).join('')}</div></div></section>`;
}

// Gedeelde sticky CTA-balk.
function stickyCta(d) {
  return `<div class="sticky-cta" id="stickyCta"><div class="scwrap"><div class="t">${esc(d.bedrijf)}<span>Gratis &amp; vrijblijvend · reactie binnen 24 uur</span></div><div class="sc-actions"><a class="sc-tel" href="tel:${tel(d)}">${tel(d)}</a><a href="#contact" class="sc-btn">${esc(d.directe_cta)}</a></div></div></div>`;
}

// Gedeelde JS (reveal, tellende cijfers, sticky CTA, FAQ) + body-class voor JS-detectie.
function wowJs() {
  return `<script>
document.documentElement.className='js';document.body.className=(document.body.className+' js').trim();
(function(){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.14});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  function ac(el){var t=parseFloat(el.getAttribute('data-count')),sf=el.getAttribute('data-suffix')||'',dc=parseInt(el.getAttribute('data-dec')||'0',10),d=1300,s=null;
    function st(ts){if(!s)s=ts;var p=Math.min((ts-s)/d,1),e=1-Math.pow(1-p,3);el.textContent=(t*e).toFixed(dc).replace('.',',')+sf;if(p<1)requestAnimationFrame(st);}requestAnimationFrame(st);}
  var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){ac(e.target);co.unobserve(e.target);}});},{threshold:.5});
  document.querySelectorAll('.num[data-count]').forEach(function(el){co.observe(el);});
  var sticky=document.getElementById('stickyCta'),contact=document.getElementById('contact');
  window.addEventListener('scroll',function(){var past=window.scrollY>700,atForm=contact&&contact.getBoundingClientRect().top<window.innerHeight;if(past&&!atForm)sticky.classList.add('show');else sticky.classList.remove('show');},{passive:true});
  document.querySelectorAll('.faq-q').forEach(function(b){b.addEventListener('click',function(){var it=b.parentElement,a=it.querySelector('.faq-a'),o=it.classList.toggle('open');a.style.maxHeight=o?(a.scrollHeight+'px'):null;});});
})();
</script>`;
}

// ============================================================
// TEMPLATE 1 — REDACTIONEEL
// ============================================================
function editorial(d) {
  return `${head(d, 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap')}
<style>
:root{--accent:${d.accent};--deep:${d.accentDeep};--tint:${d.tint};--ink:#1a1815;--soft:#57514a;--line:rgba(0,0,0,.1);--paper:#fbfaf7}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--paper);color:var(--ink);font-family:'Inter',sans-serif;font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:1180px;margin:0 auto;padding:0 40px}
h1,h2,h3{font-family:'Fraunces',serif;font-weight:300;line-height:1.08;letter-spacing:-.01em}
nav{position:sticky;top:0;z-index:50;background:rgba(251,250,247,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.nav-in{display:flex;justify-content:space-between;align-items:center;height:74px;max-width:1180px;margin:0 auto;padding:0 40px}
.brand{font-family:'Fraunces';font-size:23px}
.nav-r{display:flex;align-items:center;gap:24px}
.nav-r a.tel{color:var(--ink);text-decoration:none;font-weight:500;font-size:15px}
.nav-cta{background:var(--accent);color:#fff;padding:11px 22px;font-size:14px;text-decoration:none;transition:.2s}
.nav-cta:hover{background:var(--deep)}
header{padding:72px 0 0}
.hero{display:grid;grid-template-columns:1.25fr 1fr;gap:56px;align-items:center}
.eyebrow{font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:var(--deep);margin-bottom:22px}
h1{font-size:clamp(44px,6.2vw,66px)}
h1 em{font-style:italic;color:var(--accent)}
.hero .sub{font-size:19px;color:var(--soft);margin-top:24px;max-width:42ch}
.cta-row{margin-top:34px;display:flex;gap:16px;align-items:center;flex-wrap:wrap}
.btn{background:var(--ink);color:#fff;padding:16px 32px;font-size:15px;text-decoration:none;transition:.2s}
.btn:hover{background:var(--accent)}
.btn-link{color:var(--ink);text-decoration:none;font-size:15px;border-bottom:1px solid var(--ink);padding-bottom:3px}
.hero-img{aspect-ratio:4/5;${bg(d.fotos.hero, d.accentDeep)}}
.usps{border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-top:64px;display:grid;grid-template-columns:repeat(3,1fr)}
.usps div{padding:22px 40px 22px 0;font-size:15px;font-weight:500;display:flex;align-items:center;gap:12px}
.usps div+div{padding-left:40px;border-left:1px solid var(--line)}
.usps .mk{color:var(--accent);font-size:18px}
section{padding:88px 0}
.lab{font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:var(--deep);margin-bottom:14px}
.sec-h{font-size:clamp(30px,4vw,44px);max-width:22ch;margin-bottom:44px}
/* probleem */
.problem{background:var(--tint)}
.prob-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:8px}
.prob{background:var(--paper);padding:30px 26px;border-top:3px solid var(--accent)}
.prob p{font-size:16px;color:var(--ink)}
/* gids */
.guide .wrap{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.guide .emp{font-family:'Fraunces';font-size:clamp(26px,3.2vw,36px);line-height:1.25}
.guide .aut{margin-top:20px;font-size:17px;color:var(--soft)}
.guide blockquote{background:var(--ink);color:var(--paper);padding:36px;font-family:'Fraunces';font-weight:300;font-size:22px;line-height:1.35}
.guide cite{display:block;margin-top:20px;font-style:normal;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
/* plan */
.plan{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line)}
.plan .st{padding:34px 28px 34px 0}
.plan .st+.st{padding-left:28px;border-left:1px solid var(--line)}
.plan .n{font-family:'Fraunces';font-size:34px;font-style:italic;color:var(--accent)}
.plan h3{font-size:22px;margin:16px 0 8px}
.plan p{font-size:15px;color:var(--soft)}
/* diensten */
.svc{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--line);border:1px solid var(--line)}
.svc-item{background:var(--paper);padding:30px 26px}
.svc-item h3{font-size:21px;margin-bottom:8px}
.svc-item p{font-size:15px;color:var(--soft)}
/* succes */
.success{background:var(--ink);color:var(--paper)}
.success .sec-h{color:var(--paper)}
.succ-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
.succ div{display:flex;gap:14px;align-items:flex-start;font-size:17px}
.succ .mk{color:var(--accent);font-size:20px;flex-shrink:0}
/* fotoband */
.band-imgs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:2px}
.band-imgs div{height:280px}
.band-imgs .a{${bg(d.fotos.a, d.accentDeep)}}.band-imgs .b{${bg(d.fotos.b, d.accentDeep)}}.band-imgs .c{${bg(d.fotos.c, d.accentDeep)}}
/* cta */
.form{background:var(--tint)}
.form .wrap{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.form h2{font-size:clamp(30px,4vw,46px)}
.form h2 em{font-style:italic;color:var(--accent)}
.reassure{margin-top:20px;display:flex;flex-direction:column;gap:10px}
.reassure span{display:flex;gap:10px;align-items:center;font-size:15px;color:var(--soft)}
.reassure .mk{color:var(--accent)}
.card{background:#fff;padding:36px;box-shadow:0 30px 60px -40px rgba(0,0,0,.4)}
.field{margin-bottom:18px}
.field label{display:block;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--soft);margin-bottom:7px}
.field input,.field textarea{width:100%;border:1px solid var(--line);background:#fff;padding:13px 15px;font-family:inherit;font-size:16px}
.field input:focus,.field textarea:focus{outline:none;border-color:var(--accent)}
.form button{width:100%;background:var(--ink);color:#fff;border:none;padding:16px;font-size:15px;cursor:pointer;transition:.2s}
.form button:hover{background:var(--accent)}
.mini{text-align:center;font-size:13px;color:var(--soft);margin-top:14px}
footer{background:var(--ink);color:var(--paper);padding:30px 0 96px}
footer .wrap{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:13px;color:#b8b1a6}
.svc-item .ic{width:46px;height:46px;border-radius:10px;background:var(--tint);color:var(--accent);display:grid;place-items:center;margin-bottom:16px}
.svc-item .ic svg{width:22px;height:22px}
${wowCss()}
@media(max-width:840px){.hero,.usps,.prob-grid,.guide .wrap,.plan,.svc,.succ-grid,.band-imgs,.form .wrap{grid-template-columns:1fr}.usps div+div,.plan .st+.st{border-left:none;padding-left:0}.hero-img{aspect-ratio:16/10}.band-imgs div{height:220px}section{padding:60px 0}}
</style></head><body>
<nav><div class="nav-in"><div class="brand">${esc(d.bedrijf)}</div><div class="nav-r"><a class="tel" href="tel:${tel(d)}">${tel(d)}</a><a href="#contact" class="nav-cta">${esc(d.directe_cta)}</a></div></div></nav>
<!-- HELD -->
<header><div class="wrap"><div class="hero">
<div><div class="eyebrow">${esc(d.label)}</div><h1>${esc(d.oneliner)}</h1><p class="sub">${esc(d.subkop)}</p>
<div class="cta-row"><a href="#contact" class="btn">${esc(d.directe_cta)}</a><a href="#werk" class="btn-link">${esc(d.transitionele_cta)} →</a></div></div>
<div class="hero-img"></div></div>
<div class="usps">${d.usps.map(u => `<div><span class="mk">✦</span>${esc(u)}</div>`).join('')}</div>
</div></header>
<!-- PROBLEEM -->
<section class="problem"><div class="wrap reveal"><div class="lab">Het probleem</div><h2 class="sec-h">${esc(d.probleem_titel)}</h2>
<div class="prob-grid">${d.probleem_punten.map(p => `<div class="prob"><p>${esc(p)}</p></div>`).join('')}</div></div></section>
<!-- GIDS -->
<section class="guide"><div class="wrap reveal">
<div><div class="lab">U staat er niet alleen voor</div><div class="emp">${esc(d.gids_empathie)}</div><p class="aut">${esc(d.gids_autoriteit)}</p></div>
<blockquote>"${esc(d.reviews[0][0])}"<cite>— ${esc(d.reviews[0][1])}, tevreden klant</cite></blockquote>
</div></section>
<!-- PLAN -->
<section style="padding-top:0"><div class="wrap reveal"><div class="lab">Zo werkt het</div><h2 class="sec-h">In drie stappen geregeld.</h2>
<div class="plan">${d.plan.map((s, i) => `<div class="st"><div class="n">0${i + 1}</div><h3>${esc(s.stap)}</h3><p>${esc(s.uitleg)}</p></div>`).join('')}</div></div></section>
<!-- WAT WE DOEN -->
<section id="werk" style="padding-top:0"><div class="wrap reveal"><div class="lab">Wat we doen</div><h2 class="sec-h">Vakwerk waar u op kunt bouwen.</h2>
<div class="svc">${d.diensten.map((s, i) => `<div class="svc-item"><div class="ic">${icon(i)}</div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join('')}</div></div></section>
<div class="band-imgs"><div class="a"></div><div class="b"></div><div class="c"></div></div>
<!-- SUCCES -->
<section class="success"><div class="wrap reveal"><div class="lab">Het resultaat</div><h2 class="sec-h">Zo voelt het straks.</h2>
<div class="succ-grid">${d.succes_punten.map(p => `<div class="succ"><span class="mk">✦</span><span>${esc(p)}</span></div>`).join('')}</div></div></section>
${faqSection(d, 'problem')}
<!-- DIRECTE CTA -->
<div class="form" id="contact"><div class="wrap reveal" style="padding:88px 40px">
<div><div class="lab">Vrijblijvend</div><h2>${esc(d.directe_cta)} <em>vandaag</em>.</h2>
<div class="reassure"><span><span class="mk">✦</span>Gratis en vrijblijvend</span><span><span class="mk">✦</span>Reactie binnen 24 uur</span><span><span class="mk">✦</span>Persoonlijk contact, geen callcenter</span></div></div>
<div class="card"><div class="field"><label>Naam</label><input placeholder="Uw naam"></div><div class="field"><label>E-mail of telefoon</label><input placeholder="Waarop we u bereiken"></div><div class="field"><label>Uw vraag</label><textarea rows="3" placeholder="Waar kunnen we mee helpen?"></textarea></div><button>${esc(d.directe_cta)}</button><div class="mini">We nemen meestal dezelfde dag nog contact op.</div></div>
</div></div>
<footer><div class="wrap"><span>${esc(d.bedrijf)}</span><span>${mail(d)} · ${tel(d)}</span></div></footer>
${stickyCta(d)}
${wowJs()}
</body></html>`;
}

// ============================================================
// TEMPLATE 2 — HELDER
// ============================================================
function vriendelijk(d) {
  return `${head(d, 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600&display=swap')}
<style>
:root{--accent:${d.accent};--deep:${d.accentDeep};--tint:${d.tint};--ink:#241f1a;--soft:#6b6356}
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;color:var(--ink);font-family:'Inter',sans-serif;font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:1140px;margin:0 auto;padding:0 32px}
h1,h2,h3{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;line-height:1.08;letter-spacing:-.02em}
nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-bottom:1px solid #eee}
.nav-in{display:flex;justify-content:space-between;align-items:center;height:72px;max-width:1140px;margin:0 auto;padding:0 32px}
.brand{display:flex;align-items:center;gap:11px;font-family:'Bricolage Grotesque';font-weight:800;font-size:19px}
.dot{width:36px;height:36px;border-radius:50%;background:var(--accent);color:#fff;display:grid;place-items:center;font-weight:700}
.nav-r{display:flex;align-items:center;gap:18px}
.nav-r .tel{color:var(--ink);text-decoration:none;font-weight:600;font-size:15px}
.nav-cta{background:var(--accent);color:#fff;padding:11px 22px;border-radius:100px;font-weight:600;font-size:14px;text-decoration:none}
header{display:grid;grid-template-columns:1.05fr 1fr;gap:48px;align-items:center;padding:52px 32px 60px;max-width:1140px;margin:0 auto}
.rating{display:inline-flex;align-items:center;gap:10px;background:var(--tint);padding:8px 16px;border-radius:100px;font-size:14px;font-weight:600;margin-bottom:22px}
.rating .st{color:var(--accent)}
h1{font-size:clamp(40px,5.6vw,56px)}
header .sub{font-size:19px;color:var(--soft);margin-top:18px;max-width:36ch}
.actions{margin-top:30px;display:flex;gap:12px;flex-wrap:wrap}
.btn{padding:15px 28px;border-radius:100px;font-size:15px;font-weight:600;text-decoration:none;transition:.2s}
.btn-fill{background:var(--accent);color:#fff}.btn-fill:hover{background:var(--deep)}
.btn-out{border:2px solid var(--accent);color:var(--deep)}
.assure{margin-top:22px;display:flex;gap:22px;flex-wrap:wrap;font-size:14px;color:var(--soft)}
.assure b{color:var(--ink)}
.hero-img{width:100%;aspect-ratio:4/5;border-radius:24px;box-shadow:0 30px 60px -34px rgba(0,0,0,.4);${bg(d.fotos.hero, d.accentDeep)}}
section{padding:58px 0}
.lab{text-align:center;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:10px}
.sec-h{text-align:center;font-size:clamp(28px,4vw,40px);margin-bottom:8px}
.sec-s{text-align:center;color:var(--soft);margin-bottom:38px}
/* probleem */
.problem{background:var(--tint)}
.prob-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.prob{background:#fff;border-radius:18px;padding:26px;display:flex;gap:14px;align-items:flex-start}
.prob .x{width:30px;height:30px;border-radius:50%;background:var(--tint);color:var(--accent);display:grid;place-items:center;font-weight:700;flex-shrink:0}
.prob p{font-size:15px}
/* gids */
.guide .wrap{display:grid;grid-template-columns:1fr 1fr;gap:44px;align-items:center}
.guide .emp{font-size:clamp(24px,3vw,32px);font-weight:700;line-height:1.2;letter-spacing:-.02em}
.guide .aut{margin-top:16px;font-size:17px;color:var(--soft)}
.guide .qbox{background:var(--tint);border-radius:20px;padding:32px}
.guide .st{color:var(--accent);margin-bottom:12px}
.guide blockquote{font-size:19px;line-height:1.4}
.guide cite{display:block;margin-top:16px;font-style:normal;font-weight:700;font-size:14px}
/* plan */
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;counter-reset:s}
.step{background:#fff;border:1px solid #eee;border-radius:20px;padding:30px 26px;position:relative}
.step .n{width:44px;height:44px;border-radius:50%;background:var(--accent);color:#fff;display:grid;place-items:center;font-family:'Bricolage Grotesque';font-weight:800;font-size:19px;margin-bottom:16px}
.step h3{font-size:20px;margin-bottom:8px}
.step p{font-size:15px;color:var(--soft)}
/* diensten + gallery */
.band{background:var(--tint);padding:56px 0}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:#fff;border-radius:20px;padding:30px 26px;transition:.2s}
.card:hover{transform:translateY(-4px);box-shadow:0 20px 40px -26px rgba(0,0,0,.35)}
.card .ic{width:50px;height:50px;border-radius:14px;background:var(--tint);display:grid;place-items:center;font-size:22px;color:var(--accent);font-weight:700;margin-bottom:16px}
.card h3{font-size:20px;margin-bottom:8px}
.card p{font-size:15px;color:var(--soft)}
.gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.gallery div{height:210px;border-radius:18px}
.gallery .a{${bg(d.fotos.a, d.accentDeep)}}.gallery .b{${bg(d.fotos.b, d.accentDeep)}}.gallery .c{${bg(d.fotos.c, d.accentDeep)}}
/* succes */
.success .succ{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.success .s{background:var(--tint);border-radius:18px;padding:26px;display:flex;gap:12px;align-items:flex-start}
.success .ck{width:26px;height:26px;border-radius:50%;background:var(--accent);color:#fff;display:grid;place-items:center;font-size:13px;font-weight:700;flex-shrink:0}
.success .s p{font-size:15px}
/* reviews */
.revs{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.rev{background:var(--tint);border-radius:18px;padding:26px}
.rev .st{color:var(--accent);font-size:15px;margin-bottom:10px}
.rev p{font-size:15px}
.rev .who{margin-top:16px;display:flex;align-items:center;gap:11px}
.rev .av{width:38px;height:38px;border-radius:50%;background:var(--accent);color:#fff;display:grid;place-items:center;font-weight:700;font-size:15px}
.rev b{font-size:14px}
/* cta */
.form{background:var(--deep);color:#fff;padding:64px 0}
.form .wrap{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center}
.form h2{color:#fff;font-size:clamp(28px,4vw,42px);text-align:left}
.form .sub{color:rgba(255,255,255,.82);margin-top:14px;max-width:32ch}
.checks{margin-top:22px;display:flex;flex-direction:column;gap:10px}
.checks span{display:flex;gap:10px;align-items:center;font-size:15px;color:rgba(255,255,255,.92)}
.checks .ck{width:22px;height:22px;border-radius:50%;background:var(--accent);display:grid;place-items:center;font-size:12px;font-weight:700;flex-shrink:0}
.fcard{background:#fff;border-radius:22px;padding:34px}
.field{margin-bottom:16px}
.field label{display:block;color:var(--ink);font-size:13px;font-weight:600;margin-bottom:7px}
.field input,.field textarea{width:100%;border:1.5px solid #e6ddd2;border-radius:12px;padding:13px 16px;font-family:inherit;font-size:16px;color:var(--ink)}
.field input:focus,.field textarea:focus{outline:none;border-color:var(--accent)}
.fcard button{width:100%;background:var(--accent);color:#fff;border:none;padding:15px;border-radius:100px;font-size:15px;font-weight:600;cursor:pointer}
.fmini{text-align:center;color:var(--soft);font-size:13px;margin-top:12px}
footer{background:#1a1612;color:rgba(255,255,255,.7);text-align:center;padding:30px 32px 96px;font-size:14px}
.card .ic svg{width:24px;height:24px}
${wowCss()}
@media(max-width:840px){header,.prob-grid,.guide .wrap,.steps,.cards,.gallery,.success .succ,.revs,.form .wrap{grid-template-columns:1fr}}
</style></head><body>
<nav><div class="nav-in"><div class="brand"><span class="dot">${esc(d.bedrijf[0])}</span> ${esc(d.bedrijf)}</div><div class="nav-r"><a class="tel" href="tel:${tel(d)}">${tel(d)}</a><a href="#contact" class="nav-cta">${esc(d.directe_cta)}</a></div></div></nav>
<!-- HELD -->
<header>
<div><div class="rating"><span class="st">★★★★★</span> 4,9 · ${esc(d.label)}</div><h1>${esc(d.oneliner)}</h1><p class="sub">${esc(d.subkop)}</p>
<div class="actions"><a href="#contact" class="btn btn-fill">${esc(d.directe_cta)}</a><a href="#werk" class="btn btn-out">${esc(d.transitionele_cta)}</a></div>
<div class="assure">${d.usps.map(u => `<span><b>✓</b> ${esc(u)}</span>`).join('')}</div></div>
<div class="hero-img"></div></header>
<!-- PROBLEEM -->
<section class="problem"><div class="wrap reveal"><div class="lab">Het probleem</div><h2 class="sec-h">${esc(d.probleem_titel)}</h2><p class="sec-s">U bent niet de enige. Dit horen we vaak.</p>
<div class="prob-grid">${d.probleem_punten.map(p => `<div class="prob"><span class="x">!</span><p>${esc(p)}</p></div>`).join('')}</div></div></section>
<!-- GIDS -->
<section class="guide"><div class="wrap reveal">
<div><div class="lab" style="text-align:left">U staat er niet alleen voor</div><div class="emp">${esc(d.gids_empathie)}</div><p class="aut">${esc(d.gids_autoriteit)}</p></div>
<div class="qbox"><div class="st">★★★★★</div><blockquote>"${esc(d.reviews[0][0])}"</blockquote><cite>${esc(d.reviews[0][1])}</cite></div>
</div></section>
<!-- PLAN -->
<section><div class="wrap reveal"><div class="lab">Zo werkt het</div><h2 class="sec-h">In drie simpele stappen</h2><p class="sec-s">Geen gedoe, u weet precies waar u aan toe bent.</p>
<div class="steps">${d.plan.map((s, i) => `<div class="step"><div class="n">${i + 1}</div><h3>${esc(s.stap)}</h3><p>${esc(s.uitleg)}</p></div>`).join('')}</div></div></section>
<!-- WAT WE DOEN -->
<div class="band" id="werk"><div class="wrap reveal"><div class="lab">Wat we doen</div><h2 class="sec-h">Waar we goed in zijn</h2><p class="sec-s">Alles in vertrouwde handen, van begin tot eind.</p>
<div class="cards">${d.diensten.map((s, i) => `<div class="card"><div class="ic">${icon(i)}</div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join('')}</div>
<div class="gallery" style="margin-top:24px"><div class="a"></div><div class="b"></div><div class="c"></div></div></div></div>
<!-- SUCCES -->
<section class="success"><div class="wrap reveal"><div class="lab">Het resultaat</div><h2 class="sec-h">Zo voelt het straks</h2><p class="sec-s">Dit levert het u op.</p>
<div class="succ">${d.succes_punten.map(p => `<div class="s"><span class="ck">✓</span><p>${esc(p)}</p></div>`).join('')}</div></div></section>
<!-- REVIEWS -->
<section style="padding-top:0"><div class="wrap reveal"><h2 class="sec-h">Wat klanten zeggen</h2><div class="sec-s"></div>
<div class="revs">${d.reviews.map(r => `<div class="rev"><div class="st">★★★★★</div><p>"${esc(r[0])}"</p><div class="who"><span class="av">${esc(r[1][0])}</span><b>${esc(r[1])}</b></div></div>`).join('')}</div></div></section>
${faqSection(d, '')}
<!-- DIRECTE CTA -->
<div class="form" id="contact"><div class="wrap reveal">
<div><h2>Benieuwd wat het kost?</h2><p class="sub">Laat uw gegevens achter, dan nemen we snel contact met u op.</p>
<div class="checks"><span><span class="ck">✓</span>Gratis en vrijblijvend offerte</span><span><span class="ck">✓</span>Reactie binnen 24 uur</span><span><span class="ck">✓</span>Een vast aanspreekpunt</span></div></div>
<div class="fcard"><div class="field"><label>Uw naam</label><input placeholder="Voor- en achternaam"></div><div class="field"><label>Telefoon of e-mail</label><input placeholder="Waarop we u bereiken"></div><div class="field"><label>Uw vraag</label><textarea rows="3" placeholder="Waar kunnen we mee helpen?"></textarea></div><button>${esc(d.directe_cta)}</button><div class="fmini">Geen verplichtingen. We bellen u terug.</div></div>
</div></div>
<footer>${esc(d.bedrijf)} · ${mail(d)} · ${tel(d)}</footer>
${stickyCta(d)}
${wowJs()}
</body></html>`;
}

// ============================================================
// TEMPLATE 3 — STATEMENT
// ============================================================
function bold(d) {
  const rev = d.reviews[1] || d.reviews[0];
  const tick = d.usps.concat(d.usps);
  return `${head(d, 'https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Grotesk:wght@300;400;500&display=swap')}
<style>
:root{--accent:${d.accent};--deep:${d.accentDeep};--bg:#141210;--bg2:#1d1a16;--bone:#f3f0ea;--soft:#a8a092;--line:#2e2a23}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--bone);font-family:'Space Grotesk',sans-serif;font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:1200px;margin:0 auto;padding:0 40px}
h1,h2,h3{font-family:'Syne',sans-serif;font-weight:700;line-height:1.04;letter-spacing:-.02em}
nav{position:sticky;top:0;z-index:50;background:rgba(20,18,16,.8);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.nav-in{display:flex;justify-content:space-between;align-items:center;height:76px;max-width:1200px;margin:0 auto;padding:0 40px}
.brand{font-family:'Syne';font-weight:800;font-size:19px;letter-spacing:.12em}
.nav-r{display:flex;align-items:center;gap:20px}
.nav-r .tel{color:var(--bone);text-decoration:none;font-size:15px}
.nav-cta{background:var(--accent);color:var(--bg);padding:11px 22px;border-radius:100px;font-weight:700;font-size:13px;text-decoration:none}
header{padding:84px 0 56px;position:relative;overflow:hidden}
.glow{position:absolute;top:-25%;right:-12%;width:560px;height:560px;background:radial-gradient(circle,var(--accent),transparent 62%);opacity:.18;pointer-events:none}
.eyebrow{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--accent);margin-bottom:24px}
h1{font-size:clamp(48px,7.8vw,80px);max-width:14ch}
.hero-foot{margin-top:42px;display:grid;grid-template-columns:1fr auto;gap:30px;align-items:end;border-top:1px solid var(--line);padding-top:30px}
.hero-foot p{color:var(--soft);font-size:18px;max-width:46ch}
.hero-foot .ctas{display:flex;gap:14px;flex-wrap:wrap}
.btn{background:var(--accent);color:var(--bg);padding:16px 32px;border-radius:100px;font-size:14px;font-weight:700;text-decoration:none;white-space:nowrap;transition:.2s}
.btn:hover{filter:brightness(1.1)}
.btn-ghost{background:transparent;border:1px solid var(--line);color:var(--bone);padding:16px 28px;border-radius:100px;font-size:14px;text-decoration:none}
.ticker{border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden;white-space:nowrap;padding:16px 0}
.tt{display:inline-block;animation:s 22s linear infinite}
.tt span{font-family:'Syne';font-weight:600;font-size:18px;color:var(--soft);margin:0 26px}
.tt span b{color:var(--accent)}
@keyframes s{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.hero-img{height:400px;${bg(d.fotos.hero, d.accentDeep)}}
section{padding:80px 0}
.lab{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--accent);margin-bottom:16px}
.sec-h{font-size:clamp(30px,4.4vw,48px);max-width:22ch;margin-bottom:44px}
/* probleem */
.prob-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line)}
.prob{background:var(--bg);padding:38px 32px}
.prob .x{color:var(--accent);font-size:24px;font-weight:700}
.prob p{margin-top:16px;color:var(--bone);font-size:16px}
/* gids */
.guide{background:var(--bg2)}
.guide .wrap{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.guide .emp{font-size:clamp(26px,3.4vw,38px);line-height:1.2}
.guide .aut{margin-top:18px;color:var(--soft);font-size:17px}
.guide blockquote{font-size:22px;line-height:1.4;border-left:3px solid var(--accent);padding-left:26px}
.guide cite{display:block;margin-top:16px;font-style:normal;font-size:13px;letter-spacing:.14em;color:var(--accent)}
/* plan */
.plan{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.pstep{border-top:2px solid var(--accent);padding-top:24px}
.pstep .n{font-family:'Syne';font-weight:800;font-size:15px;color:var(--accent);letter-spacing:.2em}
.pstep h3{font-size:24px;margin:18px 0 10px}
.pstep p{color:var(--soft);font-size:15px}
/* diensten */
.svc{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--line);border:1px solid var(--line)}
.svc-item{background:var(--bg);padding:42px 36px;transition:.25s}
.svc-item:hover{background:var(--bg2)}
.svc-item .n{font-size:13px;color:var(--accent);letter-spacing:.2em}
.svc-item h3{font-size:26px;margin:40px 0 12px}
.svc-item p{color:var(--soft);font-size:15px}
.duo{display:grid;grid-template-columns:7fr 5fr;gap:16px;margin-top:60px}
.duo div{height:330px;border-radius:6px}
.duo .a{${bg(d.fotos.a, d.accentDeep)}}.duo .b{${bg(d.fotos.b, d.accentDeep)}}
/* succes + stats */
.success{background:var(--bg2)}
.succ-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;margin-bottom:50px}
.succ div{display:flex;gap:13px;align-items:flex-start;font-size:17px}
.succ .mk{color:var(--accent);font-size:20px;flex-shrink:0}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:36px;text-align:center;border-top:1px solid var(--line);padding-top:44px}
.stat .num{font-family:'Syne';font-weight:800;font-size:clamp(40px,6vw,58px);color:var(--accent);line-height:1}
.stat .l{margin-top:10px;color:var(--soft);font-size:14px}
/* cta */
.quote{padding:64px 0;text-align:center}
.quote p{font-size:26px;line-height:1.3;max-width:26ch;margin:0 auto}
.quote span{display:block;font-size:13px;letter-spacing:.15em;color:var(--accent);margin-top:20px}
.form{padding:80px 0;background:var(--bg2)}
.form .wrap{display:grid;grid-template-columns:1.1fr 1fr;gap:60px;align-items:start}
.form h2{font-size:clamp(36px,5vw,54px)}
.form h2 span{color:var(--accent)}
.checks{margin-top:24px;display:flex;flex-direction:column;gap:12px}
.checks span{display:flex;gap:11px;align-items:center;color:var(--soft);font-size:15px}
.checks .ck{color:var(--accent);font-weight:700}
.field{margin-bottom:18px}
.field label{display:block;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--soft);margin-bottom:8px}
.field input,.field textarea{width:100%;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:14px 16px;font-family:inherit;font-size:16px;color:var(--bone)}
.field input:focus,.field textarea:focus{outline:none;border-color:var(--accent)}
.form button{width:100%;background:var(--accent);color:var(--bg);border:none;padding:16px;border-radius:100px;font-family:'Syne';font-weight:700;font-size:16px;cursor:pointer}
.fmini{text-align:center;color:var(--soft);font-size:13px;margin-top:12px}
footer{border-top:1px solid var(--line);padding:30px 0 96px}
footer .wrap{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:13px;color:var(--soft)}
.svc-item .ic{color:var(--accent);margin-bottom:8px;display:block}
.svc-item .ic svg{width:26px;height:26px}
${wowCss()}
/* donkere FAQ voor dit thema */
.faqsec{background:var(--bg2)}
.faqsec .faq-item{background:var(--bg);border-color:var(--line)}
.faqsec .faq-q{color:var(--bone)}
.faqsec .faq-a{color:var(--soft)}
.faqsec .sec-h{color:var(--bone)}
@media(max-width:840px){.prob-grid,.guide .wrap,.plan,.svc,.duo,.succ-grid,.stats,.hero-foot,.form .wrap{grid-template-columns:1fr}.duo div{height:240px}section{padding:56px 0}}
</style></head><body>
<nav><div class="nav-in"><div class="brand">${esc(d.bedrijf.toUpperCase())}</div><div class="nav-r"><a class="tel" href="tel:${tel(d)}">${tel(d)}</a><a href="#contact" class="nav-cta">${esc(d.directe_cta)}</a></div></div></nav>
<!-- HELD -->
<header><div class="wrap"><div class="glow"></div><div class="eyebrow">— ${esc(d.label)}</div><h1>${esc(d.oneliner)}</h1>
<div class="hero-foot"><p>${esc(d.subkop)}</p><div class="ctas"><a href="#contact" class="btn">${esc(d.directe_cta)} →</a><a href="#werk" class="btn-ghost">${esc(d.transitionele_cta)}</a></div></div></div></header>
<div class="ticker"><div class="tt">${tick.map(u => `<span>${esc(u)} <b>◆</b></span>`).join('')}</div></div>
<div class="hero-img"></div>
<!-- PROBLEEM -->
<section><div class="wrap reveal"><div class="lab">Het probleem</div><h2 class="sec-h">${esc(d.probleem_titel)}</h2>
<div class="prob-grid">${d.probleem_punten.map(p => `<div class="prob"><div class="x">!</div><p>${esc(p)}</p></div>`).join('')}</div></div></section>
<!-- GIDS -->
<section class="guide"><div class="wrap reveal">
<div><div class="lab">U staat er niet alleen voor</div><div class="emp">${esc(d.gids_empathie)}</div><p class="aut">${esc(d.gids_autoriteit)}</p></div>
<blockquote>"${esc(d.reviews[0][0])}"<cite>${esc(d.reviews[0][1].toUpperCase())}</cite></blockquote>
</div></section>
<!-- PLAN -->
<section><div class="wrap reveal"><div class="lab">Zo werkt het</div><h2 class="sec-h">In drie stappen geregeld.</h2>
<div class="plan">${d.plan.map((s, i) => `<div class="pstep"><div class="n">0${i + 1}</div><h3>${esc(s.stap)}</h3><p>${esc(s.uitleg)}</p></div>`).join('')}</div></div></section>
<!-- WAT WE DOEN -->
<section id="werk" style="padding-top:0"><div class="wrap reveal"><div class="lab">Wat we bieden</div><h2 class="sec-h">Vakwerk, tot in de details.</h2>
<div class="svc">${d.diensten.concat([{ t: 'En meer', d: 'Neem contact op en we kijken samen wat past.' }]).map((s, i) => `<div class="svc-item"><div class="ic">${icon(i)}</div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join('')}</div>
<div class="duo"><div class="a"></div><div class="b"></div></div></div></section>
<!-- SUCCES + STATS -->
<section class="success"><div class="wrap reveal"><div class="lab">Het resultaat</div><h2 class="sec-h">Zo voelt het straks.</h2>
<div class="succ-grid">${d.succes_punten.map(p => `<div class="succ"><span class="mk">✦</span><span>${esc(p)}</span></div>`).join('')}</div>
<div class="stats"><div class="stat"><div class="num" data-count="4.9" data-suffix="★" data-dec="1">0★</div><div class="l">Gemiddelde beoordeling</div></div><div class="stat"><div class="num" data-count="24" data-suffix="u">0u</div><div class="l">Reactie op uw aanvraag</div></div><div class="stat"><div class="num" data-count="100" data-suffix="%">0%</div><div class="l">Vrijblijvend en eerlijk</div></div></div>
</div></section>
<div class="quote"><div class="wrap reveal"><p>"${esc(rev[0])}"</p><span>${esc(rev[1].toUpperCase())}</span></div></div>
${faqSection(d, '')}
<!-- DIRECTE CTA -->
<div class="form" id="contact"><div class="wrap reveal">
<div><div class="lab">Contact</div><h2>Klaar om te <span>beginnen</span>?</h2>
<div class="checks"><span><span class="ck">✦</span>Gratis en vrijblijvend</span><span><span class="ck">✦</span>Reactie binnen 24 uur</span><span><span class="ck">✦</span>Persoonlijk contact</span></div></div>
<div><div class="field"><label>Naam</label><input placeholder="Uw naam"></div><div class="field"><label>E-mail of telefoon</label><input placeholder="Waarop we u bereiken"></div><div class="field"><label>Uw vraag</label><textarea rows="3" placeholder="Waar kunnen we mee helpen?"></textarea></div><button>${esc(d.directe_cta)}</button><div class="fmini">We nemen meestal dezelfde dag nog contact op.</div></div>
</div></div>
<footer><div class="wrap"><span style="color:var(--bone);font-weight:700">${esc(d.bedrijf.toUpperCase())}</span><span>${mail(d)} · ${tel(d)}</span></div></footer>
${stickyCta(d)}
${wowJs()}
</body></html>`;
}

// ============================================================
// TEMPLATE — ZAKELIJK  (corporate, strak, vertrouwen, B2B)
// StoryBrand-opbouw, één merkaccent, professioneel grid.
// ============================================================
function zakelijk(d) {
  return `${head(d, 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap')}
<style>
:root{--accent:${d.accent};--deep:${d.accentDeep};--tint:${d.tint};--ink:#141922;--soft:#5b6573;--bg:#ffffff;--panel:#f6f7f9;--line:#e6e9ee}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--ink);font-family:'Inter',sans-serif;font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:1200px;margin:0 auto;padding:0 40px}
h1,h2,h3{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;line-height:1.12;letter-spacing:-.02em}
a{color:inherit}
/* utility bar */
.util{background:var(--ink);color:#fff}
.util .wrap{display:flex;justify-content:space-between;align-items:center;height:42px;font-size:13px}
.util .l{display:flex;gap:24px;color:#c7ccd4}
.util .l a{text-decoration:none}
.util .r{color:#c7ccd4}
.util .r b{color:#fff}
/* nav */
nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.nav-in{display:flex;justify-content:space-between;align-items:center;height:74px;max-width:1200px;margin:0 auto;padding:0 40px}
.brand{display:flex;align-items:center;gap:11px;font-family:'Plus Jakarta Sans';font-weight:800;font-size:20px;letter-spacing:-.01em}
.logo{width:36px;height:36px;border-radius:9px;background:var(--accent);color:#fff;display:grid;place-items:center;font-weight:800;font-size:17px}
.nav-links{display:flex;gap:30px;align-items:center}
.nav-links a{text-decoration:none;font-size:15px;font-weight:500;color:var(--soft)}
.nav-links a:hover{color:var(--ink)}
.nav-cta{background:var(--accent);color:#fff!important;padding:11px 22px;border-radius:9px;font-size:14px;font-weight:600;text-decoration:none;transition:.2s}
.nav-cta:hover{background:var(--deep)}
/* hero */
header{padding:64px 0 0}
.hero{display:grid;grid-template-columns:1fr 1.02fr;gap:56px;align-items:center}
.eyebrow{display:inline-flex;align-items:center;gap:9px;font-size:13px;font-weight:600;letter-spacing:.04em;color:var(--deep);background:var(--tint);padding:7px 14px;border-radius:100px;margin-bottom:24px}
.eyebrow::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--accent)}
h1{font-size:clamp(38px,4.6vw,56px);text-wrap:balance}
.hero .sub{font-size:19px;color:var(--soft);margin-top:22px;max-width:40ch}
.cta-row{margin-top:32px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.btn{background:var(--accent);color:#fff;padding:15px 30px;border-radius:9px;font-size:15px;font-weight:600;text-decoration:none;transition:.2s}
.btn:hover{background:var(--deep)}
.btn-out{background:#fff;color:var(--ink);border:1px solid var(--line);padding:14px 26px;border-radius:9px;font-size:15px;font-weight:600;text-decoration:none}
.btn-out:hover{border-color:var(--ink)}
.hero-media{position:relative}
.hero-img{aspect-ratio:4/3.4;min-height:480px;border-radius:18px;box-shadow:0 40px 80px -50px rgba(20,25,34,.55);${bg(d.fotos.hero, d.accentDeep)}}
.proof-badge{position:absolute;left:22px;bottom:22px;background:#fff;border-radius:14px;padding:15px 20px;box-shadow:0 18px 44px -18px rgba(20,25,34,.45);display:flex;align-items:center;gap:13px}
.proof-badge .st{color:var(--accent);font-size:16px}
.proof-badge b{font-family:'Plus Jakarta Sans';font-size:18px}
.proof-badge span{display:block;font-size:12px;color:var(--soft)}
/* usp bar */
.uspbar{margin-top:60px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--panel)}
.uspbar .wrap{display:grid;grid-template-columns:repeat(3,1fr)}
.uspbar .u{padding:22px 0;display:flex;align-items:center;gap:12px;font-size:15px;font-weight:500}
.uspbar .u+.u{padding-left:36px;border-left:1px solid var(--line)}
.uspbar .ck{width:26px;height:26px;border-radius:7px;background:var(--tint);color:var(--accent);display:grid;place-items:center;font-size:13px;font-weight:700;flex-shrink:0}
/* sections */
section{padding:90px 0}
.lab{font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:14px}
.sec-h{font-size:clamp(30px,4vw,42px);max-width:22ch;margin-bottom:46px}
.sec-h.ctr{margin-left:auto;margin-right:auto;text-align:center}
/* probleem */
.problem{background:var(--panel)}
.prob-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.prob{background:#fff;border:1px solid var(--line);border-radius:14px;padding:30px 28px}
.prob .x{width:40px;height:40px;border-radius:10px;background:var(--tint);color:var(--accent);display:grid;place-items:center;font-size:20px;font-weight:700;margin-bottom:18px}
.prob p{font-size:16px;color:var(--ink)}
/* gids */
.guide{border-top:1px solid var(--line)}
.guide .wrap{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.guide .emp{font-family:'Plus Jakarta Sans';font-weight:700;font-size:clamp(24px,3.2vw,34px);line-height:1.2;letter-spacing:-.02em}
.guide .aut{margin-top:18px;font-size:17px;color:var(--soft)}
.qcard{background:var(--ink);color:#fff;border-radius:16px;padding:38px}
.qcard .st{color:var(--accent);font-size:16px;margin-bottom:14px}
.qcard blockquote{font-family:'Plus Jakarta Sans';font-weight:600;font-size:21px;line-height:1.4}
.qcard cite{display:block;margin-top:20px;font-style:normal;font-size:14px;color:#c7ccd4}
/* plan */
.plan{display:grid;grid-template-columns:repeat(3,1fr);gap:0;position:relative}
.pstep{padding:0 28px}
.pstep:first-child{padding-left:0}.pstep:last-child{padding-right:0}
.pstep .n{width:48px;height:48px;border-radius:12px;background:var(--accent);color:#fff;display:grid;place-items:center;font-family:'Plus Jakarta Sans';font-weight:800;font-size:20px;margin-bottom:20px}
.pstep h3{font-size:21px;margin-bottom:10px}
.pstep p{font-size:15px;color:var(--soft)}
/* diensten */
.diensten{background:var(--panel)}
.svc{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.svc-item{background:#fff;border:1px solid var(--line);border-radius:14px;padding:32px 28px;transition:.2s}
.svc-item:hover{border-color:var(--accent);box-shadow:0 20px 40px -28px rgba(20,25,34,.35)}
.svc-item .ic{width:48px;height:48px;border-radius:11px;background:var(--tint);color:var(--accent);display:grid;place-items:center;margin-bottom:18px}
.svc-item .ic svg{width:24px;height:24px}
.svc-item h3{font-size:21px;margin-bottom:9px}
.svc-item p{font-size:15px;color:var(--soft)}
.band-imgs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px;margin-top:56px;padding-bottom:8px}
.band-imgs div{height:260px;border-radius:16px}
.band-imgs .a{${bg(d.fotos.a, d.accentDeep)}}.band-imgs .b{${bg(d.fotos.b, d.accentDeep)}}.band-imgs .c{${bg(d.fotos.c, d.accentDeep)}}
/* succes + stats */
.success{background:var(--ink);color:#fff}
.success .lab{color:var(--accent)}
.success .sec-h{color:#fff}
.succ-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;margin-bottom:54px}
.succ .s{display:flex;gap:13px;align-items:flex-start;font-size:17px;color:#e7eaef}
.succ .ck{width:26px;height:26px;border-radius:7px;background:var(--accent);color:#fff;display:grid;place-items:center;font-size:13px;font-weight:700;flex-shrink:0}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:30px;border-top:1px solid rgba(255,255,255,.12);padding-top:48px}
.stat .num{font-family:'Plus Jakarta Sans';font-weight:800;font-size:clamp(34px,4.4vw,46px);color:var(--accent);line-height:1}
.stat .l2{margin-top:8px;color:#aab2bd;font-size:14px}
/* cta */
.form{background:var(--panel)}
.form .wrap{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.form h2{font-size:clamp(30px,4vw,44px)}
.checks{margin-top:22px;display:flex;flex-direction:column;gap:11px}
.checks span{display:flex;gap:11px;align-items:center;font-size:15px;color:var(--soft)}
.checks .ck{width:24px;height:24px;border-radius:7px;background:var(--tint);color:var(--accent);display:grid;place-items:center;font-size:12px;font-weight:700;flex-shrink:0}
.fcard{background:#fff;border:1px solid var(--line);border-radius:16px;padding:36px}
.field{margin-bottom:18px}
.field label{display:block;font-size:13px;font-weight:600;margin-bottom:8px}
.field input,.field textarea{width:100%;border:1px solid var(--line);border-radius:10px;padding:13px 15px;font-family:inherit;font-size:16px;background:var(--bg)}
.field input:focus,.field textarea:focus{outline:none;border-color:var(--accent)}
.fcard button{width:100%;background:var(--accent);color:#fff;border:none;padding:16px;border-radius:10px;font-family:'Plus Jakarta Sans';font-weight:700;font-size:16px;cursor:pointer;transition:.2s}
.fcard button:hover{background:var(--deep)}
.fmini{text-align:center;font-size:13px;color:var(--soft);margin-top:12px}
/* footer */
footer{background:var(--ink);color:#aab2bd;padding:40px 0 96px}
footer .wrap{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;font-size:14px}
footer .fb{display:flex;align-items:center;gap:11px;color:#fff;font-family:'Plus Jakarta Sans';font-weight:800;font-size:18px}
/* ===== WOW: scroll-animaties ===== */
.js .reveal{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.2,.6,.2,1),transform .7s cubic-bezier(.2,.6,.2,1)}
.js .reveal.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.js .reveal{opacity:1;transform:none;transition:none}}
/* ===== WOW: hover-zoom op foto's ===== */
.hero-img,.band-imgs div{transition:transform .5s cubic-bezier(.2,.6,.2,1)}
.band-imgs div{cursor:pointer}
.band-imgs div:hover{transform:scale(1.03)}
.svc-item{will-change:transform}
/* ===== WOW: gloed achter hero ===== */
header{position:relative;overflow:hidden}
.hero-glow{position:absolute;top:-180px;right:-160px;width:620px;height:620px;border-radius:50%;background:radial-gradient(circle,var(--accent),transparent 60%);opacity:.12;pointer-events:none;z-index:0}
.hero,.uspbar{position:relative;z-index:1}
/* ===== WOW: sticky CTA ===== */
.sticky-cta{position:fixed;left:0;right:0;bottom:0;z-index:60;background:rgba(20,25,34,.96);backdrop-filter:blur(10px);transform:translateY(120%);transition:transform .4s cubic-bezier(.2,.6,.2,1);border-top:1px solid rgba(255,255,255,.08)}
.sticky-cta.show{transform:none}
.sticky-cta .wrap{display:flex;align-items:center;justify-content:space-between;gap:20px;padding-top:14px;padding-bottom:14px}
.sticky-cta .t{color:#fff;font-family:'Plus Jakarta Sans';font-weight:700;font-size:16px}
.sticky-cta .t span{display:block;color:#aab2bd;font-family:'Inter';font-weight:400;font-size:13px}
.sticky-cta .sc-actions{display:flex;gap:12px;align-items:center;flex-shrink:0}
.sticky-cta .sc-tel{color:#fff;text-decoration:none;font-weight:600;font-size:15px}
/* ===== WOW: FAQ ===== */
.faq{background:var(--panel)}
.faq-wrap{max-width:820px;margin:0 auto}
.faq-item{background:#fff;border:1px solid var(--line);border-radius:12px;margin-bottom:14px;overflow:hidden}
.faq-q{width:100%;text-align:left;background:none;border:none;cursor:pointer;padding:22px 26px;font-family:'Plus Jakarta Sans';font-weight:700;font-size:17px;color:var(--ink);display:flex;justify-content:space-between;align-items:center;gap:16px}
.faq-q .ic{flex-shrink:0;width:26px;height:26px;border-radius:50%;background:var(--tint);color:var(--accent);display:grid;place-items:center;font-size:18px;font-weight:700;transition:transform .3s}
.faq-item.open .faq-q .ic{transform:rotate(45deg)}
.faq-a{max-height:0;overflow:hidden;transition:max-height .35s ease;color:var(--soft);font-size:16px;line-height:1.6}
.faq-a div{padding:0 26px 22px}
@media(max-width:860px){
  .util .l{gap:14px}.util .r{display:none}.nav-links{display:none}
  .hero,.uspbar .wrap,.prob-grid,.guide .wrap,.plan,.svc,.band-imgs,.succ-grid,.stats,.form .wrap{grid-template-columns:1fr}
  .hero-img{min-height:340px;aspect-ratio:4/3}
  .uspbar .u+.u{border-left:none;padding-left:0}
  .pstep{padding:0 0 8px}
  .stats{gap:24px}
  .sticky-cta .t span{display:none}
  section{padding:60px 0}
}
</style></head><body>
<script>document.documentElement.className='js';document.body.className='js';</script>
<div class="util"><div class="wrap"><div class="l"><a href="mailto:${mail(d)}">✉ ${mail(d)}</a><a href="tel:${tel(d)}">✆ ${tel(d)}</a></div><div class="r"><b>Gratis &amp; vrijblijvend</b> · reactie binnen 24 uur</div></div></div>
<nav><div class="nav-in"><div class="brand"><span class="logo">${esc(d.bedrijf[0])}</span> ${esc(d.bedrijf)}</div><div class="nav-links"><a href="#aanpak">Aanpak</a><a href="#diensten">Diensten</a><a href="#resultaat">Resultaat</a><a href="#contact" class="nav-cta">${esc(d.directe_cta)}</a></div></div></nav>
<!-- HELD -->
<header><div class="hero-glow"></div><div class="wrap"><div class="hero">
<div class="reveal"><div class="eyebrow">${esc(d.label)}</div><h1>${esc(d.oneliner)}</h1><p class="sub">${esc(d.subkop)}</p>
<div class="cta-row"><a href="#contact" class="btn">${esc(d.directe_cta)}</a><a href="#aanpak" class="btn-out">${esc(d.transitionele_cta)}</a></div></div>
<div class="hero-media reveal"><div class="hero-img"></div><div class="proof-badge"><span class="st">★★★★★</span><div><b>4,9 / 5</b><span>klantbeoordeling</span></div></div></div>
</div></div>
<div class="uspbar"><div class="wrap">${d.usps.map(u => `<div class="u"><span class="ck">✓</span>${esc(u)}</div>`).join('')}</div></div>
</header>
<!-- PROBLEEM -->
<section class="problem"><div class="wrap reveal"><div class="lab">De uitdaging</div><h2 class="sec-h">${esc(d.probleem_titel)}</h2>
<div class="prob-grid">${d.probleem_punten.map(p => `<div class="prob"><div class="x">!</div><p>${esc(p)}</p></div>`).join('')}</div></div></section>
<!-- GIDS -->
<section class="guide"><div class="wrap reveal">
<div><div class="lab">Uw partner</div><div class="emp">${esc(d.gids_empathie)}</div><p class="aut">${esc(d.gids_autoriteit)}</p></div>
<div class="qcard"><div class="st">★★★★★</div><blockquote>"${esc(d.reviews[0][0])}"</blockquote><cite>— ${esc(d.reviews[0][1])}, klant</cite></div>
</div></section>
<!-- PLAN -->
<section id="aanpak"><div class="wrap reveal"><div class="lab">Onze aanpak</div><h2 class="sec-h">Zo werken we, in drie stappen.</h2>
<div class="plan">${d.plan.map((s, i) => `<div class="pstep"><div class="n">${i + 1}</div><h3>${esc(s.stap)}</h3><p>${esc(s.uitleg)}</p></div>`).join('')}</div></div></section>
<!-- DIENSTEN -->
<section class="diensten" id="diensten"><div class="wrap reveal"><div class="lab">Onze diensten</div><h2 class="sec-h">Vakwerk waar u op kunt bouwen.</h2>
<div class="svc">${d.diensten.map((s, i) => `<div class="svc-item"><div class="ic">${icon(i)}</div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join('')}</div>
<div class="band-imgs"><div class="a"></div><div class="b"></div><div class="c"></div></div></div></section>
<!-- SUCCES + STATS -->
<section class="success" id="resultaat"><div class="wrap reveal"><div class="lab">Het resultaat</div><h2 class="sec-h">Wat het u oplevert.</h2>
<div class="succ-grid">${d.succes_punten.map(p => `<div class="s"><span class="ck">✓</span><span>${esc(p)}</span></div>`).join('')}</div>
<div class="stats"><div class="stat"><div class="num" data-count="4.9" data-suffix="★" data-dec="1">0★</div><div class="l2">Klantbeoordeling</div></div><div class="stat"><div class="num" data-count="24" data-suffix="u">0u</div><div class="l2">Reactietijd</div></div><div class="stat"><div class="num" data-count="100" data-suffix="%">0%</div><div class="l2">Vrijblijvend</div></div><div class="stat"><div class="num" data-count="10" data-suffix="+">0+</div><div class="l2">Jaar ervaring</div></div></div>
</div></section>
${d.faq && d.faq.length ? `<!-- FAQ -->
<section class="faq"><div class="wrap reveal"><div class="lab" style="text-align:center">Veelgestelde vragen</div><h2 class="sec-h ctr">Goed om te weten.</h2>
<div class="faq-wrap">${d.faq.map(f => `<div class="faq-item"><button class="faq-q">${esc(f.v)}<span class="ic">+</span></button><div class="faq-a"><div>${esc(f.a)}</div></div></div>`).join('')}</div>
</div></section>` : ''}
<!-- DIRECTE CTA -->
<div class="form" id="contact"><div class="wrap reveal" style="padding:88px 40px">
<div><div class="lab">Aan de slag</div><h2>${esc(d.directe_cta)} vandaag nog.</h2>
<div class="checks"><span><span class="ck">✓</span>Gratis en vrijblijvend</span><span><span class="ck">✓</span>Reactie binnen 24 uur</span><span><span class="ck">✓</span>Persoonlijk contact, geen callcenter</span></div></div>
<div class="fcard"><div class="field"><label>Naam</label><input placeholder="Uw naam"></div><div class="field"><label>E-mail of telefoon</label><input placeholder="Waarop we u bereiken"></div><div class="field"><label>Uw vraag</label><textarea rows="3" placeholder="Waar kunnen we mee helpen?"></textarea></div><button>${esc(d.directe_cta)}</button><div class="fmini">We nemen meestal dezelfde dag nog contact op.</div></div>
</div></div>
<footer><div class="wrap"><div class="fb"><span class="logo">${esc(d.bedrijf[0])}</span> ${esc(d.bedrijf)}</div><span>${mail(d)} · ${tel(d)}</span></div></footer>

<!-- WOW: sticky CTA -->
<div class="sticky-cta" id="stickyCta"><div class="wrap"><div class="t">${esc(d.bedrijf)}<span>Gratis &amp; vrijblijvend · reactie binnen 24 uur</span></div><div class="sc-actions"><a class="sc-tel" href="tel:${tel(d)}">${tel(d)}</a><a href="#contact" class="btn">${esc(d.directe_cta)}</a></div></div></div>

<script>
(function(){
  // 1) scroll-reveal
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .14 });
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  // 2) tellende cijfers
  function animateCount(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var dur = 1300, start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(dec).replace('.', ',');
      el.textContent = val + suffix;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var co = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ animateCount(e.target); co.unobserve(e.target); } });
  }, { threshold: .5 });
  document.querySelectorAll('.num[data-count]').forEach(function(el){ co.observe(el); });

  // 3) sticky CTA: tonen na hero, verbergen bij contactformulier
  var sticky = document.getElementById('stickyCta');
  var contact = document.getElementById('contact');
  window.addEventListener('scroll', function(){
    var past = window.scrollY > 700;
    var atForm = contact && contact.getBoundingClientRect().top < window.innerHeight;
    if(past && !atForm) sticky.classList.add('show'); else sticky.classList.remove('show');
  }, { passive: true });

  // 4) FAQ-accordeon
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.parentElement;
      var ans = item.querySelector('.faq-a');
      var open = item.classList.toggle('open');
      ans.style.maxHeight = open ? (ans.scrollHeight + 'px') : null;
    });
  });
})();
</script>
</body></html>`;
}

module.exports = { editorial, vriendelijk, bold, zakelijk };
