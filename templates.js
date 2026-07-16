// ============================================================
// templates.js — DRIE totaal verschillende concepten
//  1. NOTTE     (editorial)   : Calliano-DNA — full-bleed foto-hero,
//     donker/crème, serif, portret met badge, portfolio-tegels.
//  2. ATELIER   (vriendelijk) : licht editorial — split-hero (tekst
//     naast staande foto), genummerde dienstenlijst, foto-mozaïek,
//     groot citaat, dunne lijnen.
//  3. STATEMENT (zakelijk)    : modern & uitgesproken — enorme
//     typografie-hero met fotoband eronder, tellende cijfers,
//     afwisselende werk-rijen, sticky CTA.
// Zelfde data-model (d) voor alle drie; de motor blijft gelijk.
// ============================================================

function esc(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
const tel = d => esc((d.contact || {}).telefoon || '06 12 34 56 78');
const mail = d => esc((d.contact || {}).email || 'info@voorbeeld.nl');

function splitKop(s = '') {
  const w = String(s).replace(/\.$/, '').split(' ');
  if (w.length < 3) return [s, ''];
  const cut = Math.max(1, Math.round(w.length * 0.45));
  return [w.slice(0, cut).join(' '), w.slice(cut).join(' ')];
}
function img(url, alt = '') {
  return `<img src="${esc(url)}" alt="${esc(alt)}" loading="lazy" onerror="this.remove()">`;
}

const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.5L12 16.9 6.1 20.1l1.3-6.5L2.5 9l6.6-.8L12 2z"/></svg>';
const STARS = `<span class="stars" aria-label="5 sterren">${STAR.repeat(5)}</span>`;
const ICONS = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
];
const icon = i => ICONS[i % ICONS.length];

function headTag(d, fonts, themeColor) {
  return `<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(d.bedrijf)} — ${esc(d.label)}</title><meta name="description" content="${esc(d.subkop)}"><meta name="theme-color" content="${themeColor}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="${fonts}" rel="stylesheet">`;
}

// gedeelde mini-reset + animaties (bewust klein gehouden;
// alle layout en sfeer is per concept eigen)
const RESET = `
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;overflow-x:clip}
body{margin:0;overflow-x:clip;-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%}
a{color:inherit;text-decoration:none}
p{margin:0 0 1.1em}
@media(prefers-reduced-motion:no-preference){
.fx{opacity:0;transform:translateY(22px);animation:rise .8s cubic-bezier(.22,.7,.3,1) forwards}
.fx-1{animation-delay:.05s}.fx-2{animation-delay:.18s}.fx-3{animation-delay:.32s}.fx-4{animation-delay:.46s}.fx-5{animation-delay:.6s}
@keyframes rise{to{opacity:1;transform:none}}
.reveal{opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s cubic-bezier(.22,.7,.3,1)}
.reveal.in{opacity:1;transform:none}
.d1{transition-delay:.08s}.d2{transition-delay:.16s}.d3{transition-delay:.24s}
}`;

const NAV_REVEAL_JS = `
(function(){
  var h=document.getElementById('hdr');
  if(h){addEventListener('scroll',function(){h.classList.toggle('scrolled',scrollY>40)},{passive:true});}
  var t=document.getElementById('navToggle'),m=document.getElementById('mobielmenu');
  if(t&&m){t.addEventListener('click',function(){var o=m.classList.toggle('open');t.classList.toggle('open',o);document.body.classList.toggle('no-scroll',o)});
  m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){m.classList.remove('open');t.classList.remove('open');document.body.classList.remove('no-scroll')})});}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
})();`;

// ============================================================
// CONCEPT 1 — NOTTE (editorial): het Calliano-DNA
// Full-bleed foto-hero · donker/crème ritme · serif met cursief
// ============================================================
function editorial(d) {
  const [k1, k2] = splitKop(d.oneliner);
  return `${headTag(d, 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Figtree:wght@400;500;600;700&display=swap', '#121410')}
<style>${RESET}
:root{--acc:${d.accent};--deep:${d.accentDeep};--bg:#14150f;--bg2:#191b12;--card:#1b1d13;--txt:#efecdf;--mut:rgba(239,236,223,.7);--crema:#f4efe3;--ink:#1b1d14;--inkmut:rgba(27,29,20,.7);--ld:rgba(239,236,223,.12);--ll:rgba(27,29,20,.18)}
body{background:var(--bg);color:var(--txt);font-family:'Figtree',system-ui,sans-serif;font-size:1.0625rem;line-height:1.65}
h1,h2,h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;line-height:1.08;margin:0 0 .6em}
.container{width:min(1160px,92vw);margin-inline:auto}
.section{padding-block:clamp(4.2rem,8.5vw,7rem)}
.cream{background:var(--crema);color:var(--ink)}
.kicker{display:inline-flex;align-items:center;gap:.55rem;font-size:.78rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--acc);margin:0 0 1rem}
.kicker::before{content:"";width:9px;height:9px;border-radius:50%;background:var(--acc)}
.h-xl{font-size:clamp(2.1rem,4.4vw,3.2rem)}
h2 em{font-style:italic;color:var(--acc)}
.cream h2 em{color:var(--deep)}
.lead{font-size:clamp(1.02rem,1.6vw,1.18rem);color:var(--mut);max-width:38rem}
.cream .lead{color:var(--inkmut)}
.sec-head{max-width:46rem;margin-bottom:2.5rem}
.btn{display:inline-flex;align-items:center;gap:.55rem;padding:.95rem 1.7rem;border-radius:999px;border:1px solid transparent;font-weight:600;font-size:1rem;cursor:pointer;font-family:inherit;transition:.3s}
.btn svg{width:18px;height:18px}
.btn-p{background:var(--acc);color:#14140f}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 14px 34px -10px var(--acc)}
.btn-g{border-color:var(--ld);color:var(--txt)}
.btn-g:hover{border-color:var(--acc);color:var(--acc)}
.cream .btn-g{border-color:var(--ll);color:var(--ink)}
.site-header{position:fixed;inset:0 0 auto;z-index:60;transition:.35s;border-bottom:1px solid transparent}
.site-header.scrolled{background:rgba(18,20,14,.9);backdrop-filter:blur(12px);border-color:var(--ld)}
.nav{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding-block:.9rem}
.brand{display:flex;align-items:center;gap:.7rem;font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:600}
.bmark{width:38px;height:38px;border-radius:50%;background:var(--acc);color:#14140f;display:grid;place-items:center;font-weight:700}
.nav-links{display:none;gap:2rem;list-style:none;margin:0;padding:0}
.nav-links a{font-size:.97rem;color:var(--mut);transition:.25s}
.nav-links a:hover{color:var(--acc)}
.nav-cta{display:none;padding:.7rem 1.3rem;font-size:.95rem}
.nav-toggle{display:inline-flex;flex-direction:column;gap:5px;background:none;border:0;padding:.5rem;cursor:pointer}
.nav-toggle span{width:24px;height:2px;background:var(--txt);transition:.3s}
.nav-toggle.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.nav-toggle.open span:nth-child(2){opacity:0}
.nav-toggle.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
@media(min-width:900px){.nav-links{display:flex}.nav-cta{display:inline-flex}.nav-toggle{display:none}}
.mobile-panel{position:fixed;inset:0;z-index:55;background:rgba(14,15,10,.97);display:grid;place-content:center;text-align:center;gap:1.6rem;opacity:0;pointer-events:none;transition:.3s}
.mobile-panel.open{opacity:1;pointer-events:auto}
.mobile-panel a{font-family:'Cormorant Garamond',serif;font-size:2rem;color:var(--txt)}
body.no-scroll{overflow:hidden}
.hero{position:relative;min-height:100svh;display:flex;align-items:flex-end;overflow:hidden;padding-block:8.5rem 3.2rem}
.hero-bg{position:absolute;inset:0;background:linear-gradient(150deg,#1c1f14,#0e0f0a 70%)}
.hero-bg img{width:100%;height:100%;object-fit:cover}
.hero-bg::after{content:"";position:absolute;inset:0;background:linear-gradient(200deg,rgba(14,15,10,.34),rgba(14,15,10,.62) 45%,rgba(14,15,10,.94))}
.sole{position:absolute;right:-8%;top:5%;width:min(560px,62vw);aspect-ratio:1;border-radius:50%;pointer-events:none;z-index:1;filter:blur(4px);background:radial-gradient(circle at 50% 45%,color-mix(in srgb,var(--acc) 40%,transparent),transparent 70%)}
.hero-inner{position:relative;z-index:2;max-width:47rem}
.hero h1{margin:0 0 1.2rem}
.hero .it{display:block;font-style:italic;line-height:.98;font-size:clamp(2.9rem,9vw,6rem);color:var(--acc);text-wrap:balance}
.hero .nl{display:block;font-weight:500;margin-top:.4rem;font-size:clamp(1.7rem,4.6vw,3.1rem)}
.hero-cta{display:flex;flex-wrap:wrap;gap:.9rem;margin:1.9rem 0 2.3rem}
.hero-meta{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem 1.1rem;color:var(--mut);font-size:.94rem;border-top:1px solid var(--ld);padding-top:1.4rem}
.stars{display:inline-flex;gap:2px;color:var(--acc)}
.stars svg{width:15px;height:15px;fill:currentColor}
.dot{width:5px;height:5px;border-radius:50%;background:var(--acc);opacity:.7}
.grid3{display:grid;gap:1.4rem}
@media(min-width:700px){.grid3{grid-template-columns:repeat(3,1fr)}}
.pijn{border-top:1px solid var(--ld);padding-top:1.3rem}
.pijn span{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.5rem;color:var(--acc)}
.pijn p{margin:.5rem 0 0;color:var(--mut)}
.dienst{background:var(--card);border:1px solid var(--ld);border-radius:20px;padding:1.9rem 1.7rem;display:flex;flex-direction:column;gap:.55rem;transition:.35s}
.dienst:hover{transform:translateY(-5px);border-color:var(--acc)}
.dienst h3{font-size:1.5rem;margin:0}
.dienst p{color:var(--mut);margin:0;flex:1;font-size:.99rem}
.dicon{width:48px;height:48px;border-radius:50%;border:1px solid var(--acc);color:var(--acc);display:grid;place-items:center;margin-bottom:.55rem}
.dicon svg{width:22px;height:22px}
.alink{display:inline-flex;align-items:center;gap:.5rem;font-weight:600;color:var(--acc);font-size:.97rem}
.alink svg{width:16px;height:16px;transition:.3s}
.alink:hover svg{transform:translateX(4px)}
.over-grid{display:grid;gap:3rem}
@media(min-width:920px){.over-grid{grid-template-columns:.9fr 1.1fr;gap:4.5rem;align-items:center}}
.ph{position:relative;overflow:hidden;background:linear-gradient(140deg,#20241a,#12140d)}
.ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .6s}
.portrait{position:relative;max-width:440px;margin-top:1.2rem}
.portrait .ph{border-radius:20px;aspect-ratio:4/5}
.portrait::after{content:"";position:absolute;inset:0;border:1.5px solid var(--deep);border-radius:20px;transform:translate(16px,16px);z-index:-1}
.badge{position:absolute;right:-16px;top:-22px;width:110px;height:110px;border-radius:50%;background:var(--deep);color:#fff;display:grid;place-content:center;text-align:center;font-weight:700;font-size:.72rem;line-height:1.15;padding:.6rem;z-index:2;rotate:6deg;box-shadow:0 12px 28px rgba(0,0,0,.22)}
.badge strong{display:block;font-family:'Cormorant Garamond',serif;font-size:1.7rem;line-height:1;margin-bottom:.15rem}
@media(max-width:640px){.portrait{margin-right:12px}.badge{right:-6px;top:-16px;width:96px;height:96px}.portrait::after{transform:translate(10px,10px)}}
.quote{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1.3rem,2.3vw,1.6rem);line-height:1.3;border-left:3px solid var(--deep);padding-left:1.1rem;margin:1.5rem 0}
.chips{display:flex;flex-wrap:wrap;gap:.55rem;margin:0 0 1.7rem}
.chip{font-size:.85rem;font-weight:600;padding:.42rem .95rem;border-radius:999px;border:1px solid var(--ll)}
.pf-grid{display:grid;gap:1.1rem}
@media(min-width:640px){.pf-grid{grid-template-columns:repeat(3,1fr)}}
.pf{position:relative;border-radius:20px;overflow:hidden;border:1px solid var(--ld);margin:0}
.pf .ph{aspect-ratio:4/5}
.pf::after{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,transparent 42%,rgba(10,10,10,.88))}
.pf figcaption{position:absolute;left:1rem;right:1rem;bottom:1rem;z-index:2;color:#fff}
.pf-tag{display:block;font-size:.66rem;letter-spacing:.15em;text-transform:uppercase;color:var(--acc);font-weight:700;margin-bottom:.2rem}
.pf-name{font-family:'Cormorant Garamond',serif;font-size:1.25rem;font-weight:600}
.pf:hover .ph img{transform:scale(1.06)}
.step{background:var(--card);border:1px solid var(--ld);border-radius:20px;padding:1.8rem 1.6rem}
.step span{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:2rem;color:var(--acc);line-height:1}
.step h3{font-size:1.4rem;margin:.7rem 0 .35rem}
.step p{color:var(--mut);margin:0;font-size:.98rem}
.rev{background:var(--card);border:1px solid var(--ld);border-radius:20px;padding:1.8rem;display:flex;flex-direction:column;gap:.9rem;transition:.35s}
.rev:hover{transform:translateY(-4px);border-color:var(--acc)}
.rev q{font-family:'Cormorant Garamond',serif;font-size:1.25rem;line-height:1.35;flex:1;quotes:'"' '"'}
.rev cite{font-size:.9rem;color:var(--mut);font-weight:600;font-style:normal}
.faq-list{max-width:48rem}
.faq{border-bottom:1px solid var(--ll)}
.faq:first-of-type{border-top:1px solid var(--ll)}
.faq summary{display:flex;justify-content:space-between;align-items:center;gap:1rem;cursor:pointer;list-style:none;padding:1.2rem 0;font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:600}
.faq summary::-webkit-details-marker{display:none}
.faq .plus{flex:none;width:30px;height:30px;border-radius:50%;border:1px solid var(--ll);display:grid;place-items:center;color:var(--deep);transition:.3s}
.faq .plus svg{width:14px;height:14px}
.faq[open] .plus{transform:rotate(45deg);background:var(--deep);color:#fff;border-color:var(--deep)}
.faq-a{padding:0 3rem 1.3rem 0;color:var(--inkmut)}
.contact-grid{display:grid;gap:3rem}
@media(min-width:980px){.contact-grid{grid-template-columns:1fr 1.05fr;gap:4.5rem;align-items:start}}
.irow{display:flex;gap:.95rem;align-items:flex-start;margin-bottom:1.1rem}
.iicn{width:40px;height:40px;flex:none;border-radius:50%;border:1px solid var(--acc);color:var(--acc);display:grid;place-items:center}
.iicn svg{width:18px;height:18px}
.irow strong{display:block;font-size:.72rem;letter-spacing:.13em;text-transform:uppercase;color:var(--mut);font-weight:600}
.fcard{background:#fbf7ec;color:#1b1d14;border-radius:24px;padding:clamp(1.5rem,3vw,2.3rem);box-shadow:0 30px 70px rgba(0,0,0,.28)}
.fcard h3{font-size:1.6rem;margin-bottom:1.2rem}
.fgrid{display:grid;gap:1rem}
@media(min-width:640px){.fgrid{grid-template-columns:1fr 1fr}.sp2{grid-column:1/-1}}
.fcard label{display:block;font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(27,29,20,.6);margin-bottom:.4rem}
.fcard input,.fcard textarea{width:100%;padding:.85rem 1rem;border:1px solid rgba(0,0,0,.16);border-radius:12px;background:#fff;font:inherit}
.fcard textarea{min-height:110px;resize:vertical}
.fnote{font-size:.85rem;color:rgba(27,29,20,.6);margin:.9rem 0 0}
.site-footer{background:#0c0d08;border-top:1px solid var(--ld);padding:3.2rem 0 2rem;color:rgba(239,236,223,.75)}
.f-in{display:flex;flex-wrap:wrap;justify-content:space-between;gap:1.6rem}
.f-tag{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.15rem;color:var(--acc);margin:.7rem 0 0;max-width:22rem}
.f-r{display:grid;gap:.4rem;text-align:right;font-size:.95rem}
.f-mini{opacity:.55;font-size:.82rem}
@media(max-width:640px){.f-r{text-align:left}}
</style></head><body>
<header class="site-header" id="hdr"><div class="container nav">
<a class="brand" href="#top"><span class="bmark">${esc(d.bedrijf[0])}</span>${esc(d.bedrijf)}</a>
<ul class="nav-links"><li><a href="#diensten">Diensten</a></li><li><a href="#werk">Ons werk</a></li><li><a href="#over">Over ons</a></li><li><a href="#contact">Contact</a></li></ul>
<a class="btn btn-p nav-cta" href="#contact">${esc(d.directe_cta)}</a>
<button class="nav-toggle" id="navToggle" aria-label="Menu"><span></span><span></span><span></span></button>
</div></header>
<nav class="mobile-panel" id="mobielmenu"><a href="#diensten">Diensten</a><a href="#werk">Ons werk</a><a href="#over">Over ons</a><a href="#contact">Contact</a><a class="btn btn-p" href="#contact">${esc(d.directe_cta)}</a></nav>
<main>
<section class="hero" id="top">
<div class="hero-bg">${img(d.fotos.hero)}</div><div class="sole"></div>
<div class="container hero-inner">
<p class="kicker fx fx-1">${esc(d.label)}</p>
<h1><span class="it fx fx-2">${esc(k1)}</span>${k2 ? `<span class="nl fx fx-3">${esc(k2)}</span>` : ''}</h1>
<p class="lead fx fx-4">${esc(d.subkop)}</p>
<div class="hero-cta fx fx-4"><a class="btn btn-p" href="#contact">${esc(d.directe_cta)} ${ARROW}</a><a class="btn btn-g" href="#werk">${esc(d.transitionele_cta)}</a></div>
<div class="hero-meta fx fx-5">${STARS}${d.usps.map(u => `<span class="dot"></span><span>${esc(u)}</span>`).join('')}</div>
</div></section>
<section class="section" style="background:var(--bg2)"><div class="container">
<div class="sec-head reveal"><p class="kicker">Herkenbaar?</p><h2 class="h-xl">${esc(d.probleem_titel)}</h2></div>
<div class="grid3">${d.probleem_punten.map((p, i) => `<div class="pijn reveal d${i + 1}"><span>${String(i + 1).padStart(2, '0')}</span><p>${esc(p)}</p></div>`).join('')}</div>
</div></section>
<section class="section" id="diensten"><div class="container">
<div class="sec-head reveal"><p class="kicker">Onze diensten</p><h2 class="h-xl">Vakwerk, van begin tot <em>eind</em></h2></div>
<div class="grid3">${d.diensten.map((s, i) => `<article class="dienst reveal d${i + 1}"><div class="dicon">${icon(i)}</div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p><a class="alink" href="#contact">Meer weten ${ARROW}</a></article>`).join('')}</div>
</div></section>
<section class="section cream" id="over"><div class="container over-grid">
<div class="portrait reveal"><span class="badge"><strong>★</strong>vakwerk met aandacht</span><div class="ph">${img(d.fotos.portret, esc(d.bedrijf))}</div></div>
<div class="reveal d1"><p class="kicker" style="color:var(--deep)">Over ons</p><h2 class="h-xl">Uw partner in <em>${esc(d.label.toLowerCase())}</em></h2>
<p>${esc(d.gids_empathie)}</p><p style="color:var(--inkmut)">${esc(d.gids_autoriteit)}</p>
<blockquote class="quote">"${esc(d.succes_punten[0] || '')}"</blockquote>
<div class="chips">${d.usps.map(u => `<span class="chip">${esc(u)}</span>`).join('')}</div>
<a class="btn btn-g" href="#contact">${esc(d.transitionele_cta)}</a></div>
</div></section>
<section class="section" id="werk"><div class="container">
<div class="sec-head reveal"><p class="kicker">Ons werk</p><h2 class="h-xl">Werk om trots op te <em>zijn</em></h2><p class="lead">Een indruk van de sfeer waar we voor staan.</p></div>
<div class="pf-grid">${[d.fotos.a, d.fotos.b, d.fotos.c].map((f, i) => `<figure class="pf reveal d${i + 1}"><div class="ph">${img(f)}</div><figcaption><span class="pf-tag">Sfeerbeeld</span><span class="pf-name">${esc((d.diensten[i] || d.diensten[0]).t)}</span></figcaption></figure>`).join('')}</div>
</div></section>
<section class="section" style="background:var(--bg2)"><div class="container">
<div class="sec-head reveal"><p class="kicker">Zo werken we</p><h2 class="h-xl">In drie stappen <em>geregeld</em></h2></div>
<div class="grid3">${d.plan.map((s, i) => `<div class="step reveal d${i + 1}"><span>0${i + 1}</span><h3>${esc(s.stap)}</h3><p>${esc(s.uitleg)}</p></div>`).join('')}</div>
</div></section>
<section class="section"><div class="container">
<div class="sec-head reveal"><p class="kicker">Ervaringen</p><h2 class="h-xl">Wat klanten <em>zeggen</em></h2></div>
<div class="grid3">${d.reviews.map((r, i) => `<article class="rev reveal d${i + 1}">${STARS}<q>${esc(r[0])}</q><cite>${esc(r[1])}</cite></article>`).join('')}</div>
</div></section>
${d.faq && d.faq.length ? `<section class="section cream"><div class="container">
<div class="sec-head reveal"><p class="kicker" style="color:var(--deep)">Veelgestelde vragen</p><h2 class="h-xl">Goed om te <em>weten</em></h2></div>
<div class="faq-list reveal d1">${d.faq.map(f => `<details class="faq"><summary>${esc(f.v)}<span class="plus">${PLUS}</span></summary><div class="faq-a"><p>${esc(f.a)}</p></div></details>`).join('')}</div>
</div></section>` : ''}
<section class="section" id="contact"><div class="container contact-grid">
<div class="reveal"><p class="kicker">Contact</p><h2 class="h-xl">${esc(d.directe_cta)} <em>vandaag</em></h2>
<p class="lead">Gratis en vrijblijvend. We reageren binnen 24 uur.</p>
<div style="margin-top:1.6rem">
<div class="irow"><span class="iicn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.66 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.23a2 2 0 0 1 2.11-.45c.84.32 1.72.54 2.62.66A2 2 0 0 1 22 16.92z"/></svg></span><div><strong>Bel ons</strong><a href="tel:${tel(d)}">${tel(d)}</a></div></div>
<div class="irow"><span class="iicn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span><div><strong>Mail ons</strong><a href="mailto:${mail(d)}">${mail(d)}</a></div></div>
</div></div>
<div class="fcard reveal d1"><h3>Vraag vrijblijvend aan</h3>
<div class="fgrid"><div><label>Naam</label><input placeholder="Uw naam"></div><div><label>Telefoon of e-mail</label><input placeholder="Waarop we u bereiken"></div><div class="sp2"><label>Uw vraag</label><textarea placeholder="Waar kunnen we mee helpen?"></textarea></div><div class="sp2"><button class="btn btn-p" type="button" style="width:100%;justify-content:center">${esc(d.directe_cta)}</button></div></div>
<p class="fnote">We nemen meestal dezelfde dag nog contact op.</p></div>
</div></section>
</main>
<footer class="site-footer"><div class="container f-in"><div><span style="font-family:'Cormorant Garamond',serif;font-size:1.3rem">${esc(d.bedrijf)}</span><p class="f-tag">"${esc(d.oneliner)}"</p></div><div class="f-r"><span>${mail(d)} · ${tel(d)}</span><span class="f-mini">Conceptontwerp door ClickCurve</span></div></div></footer>
<script>${NAV_REVEAL_JS}</script>
</body></html>`;
}

// ============================================================
// CONCEPT 2 — ATELIER (vriendelijk): licht editorial
// Split-hero (tekst | staande foto) · genummerde dienstenlijst ·
// foto-mozaïek · groot citaat · dunne lijnen · veel witruimte
// ============================================================
function vriendelijk(d) {
  return `${headTag(d, 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap', '#FBF8F1')}
<style>${RESET}
:root{--acc:${d.accentDeep};--soft:${d.accent};--tint:${d.tint};--bg:#fbf8f1;--txt:#26221b;--mut:rgba(38,34,27,.64);--line:rgba(38,34,27,.16)}
body{background:var(--bg);color:var(--txt);font-family:'Inter',system-ui,sans-serif;font-size:1.04rem;line-height:1.7}
h1,h2,h3{font-family:'Fraunces',Georgia,serif;font-weight:500;line-height:1.12;margin:0 0 .6em}
em{font-style:italic;color:var(--acc)}
.wrap{width:min(1120px,90vw);margin-inline:auto}
.section{padding-block:clamp(4rem,8vw,6.8rem)}
.kick{font-size:.75rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--acc);display:inline-flex;align-items:center;gap:.7rem;margin:0 0 1.1rem}
.kick::before{content:"";width:26px;height:1px;background:var(--acc)}
.btn{display:inline-flex;align-items:center;gap:.55rem;padding:.9rem 1.6rem;border-radius:12px;border:1px solid transparent;font-weight:600;font-size:.98rem;cursor:pointer;font-family:inherit;transition:.3s}
.btn svg{width:17px;height:17px}
.btn-p{background:var(--acc);color:#fffdf8}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 14px 30px -12px var(--acc)}
.btn-g{border-color:var(--line);color:var(--txt)}
.btn-g:hover{border-color:var(--acc);color:var(--acc)}
.topbar{position:fixed;inset:0 0 auto;z-index:60;background:rgba(251,248,241,.92);backdrop-filter:blur(10px);border-bottom:1px solid transparent;transition:.3s}
.topbar.scrolled{border-color:var(--line)}
.nav{display:flex;align-items:center;justify-content:space-between;padding-block:1rem}
.brand{font-family:'Fraunces',serif;font-size:1.35rem;font-weight:600}
.brand em{color:var(--acc)}
.nav-links{display:none;gap:2.1rem;list-style:none;margin:0;padding:0}
.nav-links a{font-size:.95rem;color:var(--mut);transition:.25s}
.nav-links a:hover{color:var(--acc)}
.nav-cta{display:none}
.nav-toggle{display:inline-flex;flex-direction:column;gap:5px;background:none;border:0;padding:.5rem;cursor:pointer}
.nav-toggle span{width:24px;height:2px;background:var(--txt);transition:.3s}
.nav-toggle.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.nav-toggle.open span:nth-child(2){opacity:0}
.nav-toggle.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
@media(min-width:900px){.nav-links{display:flex}.nav-cta{display:inline-flex}.nav-toggle{display:none}}
.mobile-panel{position:fixed;inset:0;z-index:55;background:rgba(251,248,241,.98);display:grid;place-content:center;text-align:center;gap:1.5rem;opacity:0;pointer-events:none;transition:.3s}
.mobile-panel.open{opacity:1;pointer-events:auto}
.mobile-panel a{font-family:'Fraunces',serif;font-size:1.9rem}
body.no-scroll{overflow:hidden}
/* split-hero */
.hero{padding-top:7.2rem;padding-bottom:clamp(3rem,6vw,5rem)}
.hero-grid{display:grid;gap:2.6rem;align-items:center}
@media(min-width:940px){.hero-grid{grid-template-columns:1.05fr .95fr;gap:4rem}}
.hero h1{font-size:clamp(2.5rem,5.6vw,4.2rem);font-weight:500}
.hero .lead{font-size:clamp(1.05rem,1.5vw,1.2rem);color:var(--mut);max-width:32rem;margin-top:1rem}
.hero-cta{display:flex;flex-wrap:wrap;gap:.9rem;margin-top:1.9rem}
.hero-note{display:flex;align-items:center;gap:.8rem;margin-top:2.2rem;color:var(--mut);font-size:.92rem}
.stars{display:inline-flex;gap:2px;color:var(--soft)}
.stars svg{width:15px;height:15px;fill:currentColor}
.hero-foto{position:relative}
.hero-foto .ph{aspect-ratio:4/5;border-radius:22px;overflow:hidden;position:relative;background:linear-gradient(140deg,#e9e2d2,#d6cfbc)}
.hero-foto .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero-foto::before{content:"";position:absolute;inset:auto -14px -14px auto;width:60%;height:60%;border:1px solid var(--soft);border-radius:22px;z-index:-1}
.hero-usps{position:absolute;left:-14px;bottom:22px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:.9rem 1.1rem;box-shadow:0 18px 40px rgba(38,34,27,.12);display:grid;gap:.35rem;font-size:.88rem}
.hero-usps span{display:flex;align-items:center;gap:.5rem}
.hero-usps svg{width:14px;height:14px;color:var(--acc)}
@media(max-width:640px){.hero-usps{position:static;margin-top:1rem;box-shadow:none}}
/* groot citaat */
.cite-band{border-block:1px solid var(--line);padding-block:clamp(2.6rem,5vw,4rem);text-align:center}
.cite-band p{font-family:'Fraunces',serif;font-style:italic;font-size:clamp(1.4rem,3vw,2.1rem);line-height:1.35;max-width:46rem;margin:0 auto;color:var(--txt)}
/* pijn + diensten als lijst */
.split{display:grid;gap:2.6rem}
@media(min-width:940px){.split{grid-template-columns:.85fr 1.15fr;gap:4.5rem}}
.pijn-lijst{display:grid;gap:1.1rem;margin-top:.4rem}
.pijn-lijst div{display:flex;gap:.85rem;color:var(--mut)}
.pijn-lijst em{font-family:'Fraunces',serif;font-size:1.15rem;color:var(--soft);flex:none}
.d-lijst{border-top:1px solid var(--line)}
.d-item{display:grid;grid-template-columns:auto 1fr auto;gap:1.2rem;align-items:baseline;padding:1.5rem 0;border-bottom:1px solid var(--line);transition:.25s}
.d-item:hover{padding-left:.5rem}
.d-item .nr{font-family:'Fraunces',serif;font-style:italic;font-size:1.3rem;color:var(--soft)}
.d-item h3{font-size:1.45rem;margin:0 0 .25rem}
.d-item p{margin:0;color:var(--mut);font-size:.97rem;max-width:34rem}
.d-item .alink{align-self:center}
.alink{display:inline-flex;align-items:center;gap:.45rem;font-weight:600;color:var(--acc);font-size:.94rem}
.alink svg{width:15px;height:15px;transition:.3s}
.alink:hover svg{transform:translateX(4px)}
/* mozaïek */
.moz{display:grid;gap:1.1rem}
@media(min-width:760px){.moz{grid-template-columns:1.35fr 1fr;grid-template-rows:1fr 1fr}.moz .groot{grid-row:1/3}}
.moz figure{position:relative;margin:0;border-radius:20px;overflow:hidden;border:1px solid var(--line)}
.moz .ph{position:relative;background:linear-gradient(140deg,#e9e2d2,#d6cfbc);height:100%;min-height:230px}
.moz .groot .ph{min-height:480px}
.moz .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .6s}
.moz figure:hover img{transform:scale(1.05)}
.moz figcaption{position:absolute;left:1rem;bottom:.9rem;background:rgba(251,248,241,.92);backdrop-filter:blur(6px);border-radius:999px;padding:.4rem 1rem;font-size:.85rem;font-weight:600}
/* over */
.over{background:var(--tint);border-radius:26px;padding:clamp(2rem,4.5vw,3.6rem);display:grid;gap:2.2rem}
@media(min-width:860px){.over{grid-template-columns:auto 1fr;gap:3.4rem;align-items:center}}
.over .ph{width:min(300px,70vw);aspect-ratio:1;border-radius:50%;overflow:hidden;position:relative;background:linear-gradient(140deg,#e9e2d2,#d6cfbc);border:6px solid #fff;box-shadow:0 22px 50px rgba(38,34,27,.16)}
.over .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.over h2{font-size:clamp(1.8rem,3.4vw,2.6rem)}
.over .chips{display:flex;flex-wrap:wrap;gap:.5rem;margin:1.2rem 0 0}
.over .chip{font-size:.84rem;font-weight:600;padding:.4rem .95rem;border-radius:999px;background:#fff;border:1px solid var(--line)}
/* stappen horizontaal */
.stappen{display:grid;gap:1.6rem;counter-reset:st}
@media(min-width:760px){.stappen{grid-template-columns:repeat(3,1fr);gap:2.2rem}}
.stap{position:relative;padding-top:1.4rem;border-top:2px solid var(--line)}
.stap::before{counter-increment:st;content:"0" counter(st);position:absolute;top:-0.85rem;left:0;background:var(--bg);padding-right:.7rem;font-family:'Fraunces',serif;font-style:italic;font-size:1.25rem;color:var(--acc)}
.stap h3{font-size:1.3rem;margin:.2rem 0 .3rem}
.stap p{margin:0;color:var(--mut);font-size:.96rem}
/* reviews: 1 groot + 2 klein */
.rev-groot{max-width:52rem;margin:0 auto 2.2rem;text-align:center}
.rev-groot q{font-family:'Fraunces',serif;font-style:italic;font-size:clamp(1.3rem,2.6vw,1.8rem);line-height:1.4;quotes:'"' '"'}
.rev-groot cite{display:block;margin-top:1rem;font-style:normal;font-size:.92rem;color:var(--mut);font-weight:600}
.rev-rij{display:grid;gap:1.2rem}
@media(min-width:720px){.rev-rij{grid-template-columns:1fr 1fr}}
.rev-k{background:#fff;border:1px solid var(--line);border-radius:18px;padding:1.5rem 1.6rem}
.rev-k q{font-size:1.02rem;quotes:'"' '"'}
.rev-k cite{display:block;margin-top:.7rem;font-style:normal;font-size:.88rem;color:var(--mut);font-weight:600}
/* faq */
.faq-list{max-width:46rem;margin-inline:auto}
.faq{border-bottom:1px solid var(--line)}
.faq:first-of-type{border-top:1px solid var(--line)}
.faq summary{display:flex;justify-content:space-between;align-items:center;gap:1rem;cursor:pointer;list-style:none;padding:1.15rem 0;font-family:'Fraunces',serif;font-size:1.2rem;font-weight:500}
.faq summary::-webkit-details-marker{display:none}
.faq .plus{flex:none;width:28px;height:28px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;color:var(--acc);transition:.3s}
.faq .plus svg{width:13px;height:13px}
.faq[open] .plus{transform:rotate(45deg);background:var(--acc);color:#fff;border-color:var(--acc)}
.faq-a{padding:0 3rem 1.2rem 0;color:var(--mut)}
/* contact */
.c-kaart{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(1.8rem,4vw,3rem);display:grid;gap:2.4rem;box-shadow:0 26px 60px rgba(38,34,27,.1)}
@media(min-width:940px){.c-kaart{grid-template-columns:1fr 1.1fr;gap:3.6rem}}
.fgrid{display:grid;gap:1rem}
@media(min-width:640px){.fgrid{grid-template-columns:1fr 1fr}.sp2{grid-column:1/-1}}
.c-kaart label{display:block;font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--mut);margin-bottom:.4rem}
.c-kaart input,.c-kaart textarea{width:100%;padding:.85rem 1rem;border:1px solid var(--line);border-radius:12px;background:var(--bg);font:inherit}
.c-kaart textarea{min-height:110px;resize:vertical}
.c-info a{font-weight:600;color:var(--acc)}
footer{border-top:1px solid var(--line);padding:2.6rem 0;color:var(--mut);font-size:.94rem}
.f-in{display:flex;flex-wrap:wrap;justify-content:space-between;gap:1rem}
</style></head><body>
<header class="topbar" id="hdr"><div class="wrap nav">
<a class="brand" href="#top">${esc(d.bedrijf)} <em>.</em></a>
<ul class="nav-links"><li><a href="#diensten">Diensten</a></li><li><a href="#werk">Ons werk</a></li><li><a href="#over">Over ons</a></li><li><a href="#contact">Contact</a></li></ul>
<a class="btn btn-p nav-cta" href="#contact">${esc(d.directe_cta)}</a>
<button class="nav-toggle" id="navToggle" aria-label="Menu"><span></span><span></span><span></span></button>
</div></header>
<nav class="mobile-panel" id="mobielmenu"><a href="#diensten">Diensten</a><a href="#werk">Ons werk</a><a href="#over">Over ons</a><a href="#contact">Contact</a><a class="btn btn-p" href="#contact">${esc(d.directe_cta)}</a></nav>
<main id="top">
<section class="hero"><div class="wrap hero-grid">
<div>
<p class="kick fx fx-1">${esc(d.label)}</p>
<h1 class="fx fx-2">${esc(splitKop(d.oneliner)[0])} <em>${esc(splitKop(d.oneliner)[1] || '')}</em></h1>
<p class="lead fx fx-3">${esc(d.subkop)}</p>
<div class="hero-cta fx fx-4"><a class="btn btn-p" href="#contact">${esc(d.directe_cta)} ${ARROW}</a><a class="btn btn-g" href="#werk">${esc(d.transitionele_cta)}</a></div>
<div class="hero-note fx fx-5">${STARS}<span>Klanten beoordelen ons met 4,9 / 5</span></div>
</div>
<div class="hero-foto fx fx-3"><div class="ph">${img(d.fotos.hero)}</div>
<div class="hero-usps">${d.usps.map(u => `<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>${esc(u)}</span>`).join('')}</div>
</div>
</div></section>
<div class="cite-band reveal"><div class="wrap"><p>"${esc(d.gids_empathie)}"</p></div></div>
<section class="section" id="diensten"><div class="wrap split">
<div class="reveal"><p class="kick">Herkenbaar?</p><h2 style="font-size:clamp(1.7rem,3.2vw,2.4rem)">${esc(d.probleem_titel)}</h2>
<div class="pijn-lijst">${d.probleem_punten.map(p => `<div><em>✳</em><span>${esc(p)}</span></div>`).join('')}</div></div>
<div class="reveal d1"><p class="kick">Onze diensten</p><h2 style="font-size:clamp(1.7rem,3.2vw,2.4rem)">Waar we u mee <em>helpen</em></h2>
<div class="d-lijst">${d.diensten.map((s, i) => `<div class="d-item"><span class="nr">0${i + 1}</span><div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div><a class="alink" href="#contact">${ARROW}</a></div>`).join('')}</div></div>
</div></section>
<section class="section" id="werk" style="padding-top:0"><div class="wrap">
<div class="reveal" style="max-width:44rem;margin-bottom:2.2rem"><p class="kick">Ons werk</p><h2 style="font-size:clamp(1.9rem,3.6vw,2.7rem)">Een indruk van de <em>sfeer</em></h2></div>
<div class="moz">
<figure class="groot reveal"><div class="ph">${img(d.fotos.a)}</div><figcaption>${esc(d.diensten[0].t)}</figcaption></figure>
<figure class="reveal d1"><div class="ph">${img(d.fotos.b)}</div><figcaption>${esc((d.diensten[1] || d.diensten[0]).t)}</figcaption></figure>
<figure class="reveal d2"><div class="ph">${img(d.fotos.c)}</div><figcaption>${esc((d.diensten[2] || d.diensten[0]).t)}</figcaption></figure>
</div></div></section>
<section class="section" id="over" style="padding-top:0"><div class="wrap">
<div class="over reveal">
<div class="ph">${img(d.fotos.portret, esc(d.bedrijf))}</div>
<div><p class="kick">Over ons</p><h2>Persoonlijk, betrokken en <em>eerlijk</em></h2>
<p>${esc(d.gids_autoriteit)}</p>
<div class="chips">${d.usps.map(u => `<span class="chip">${esc(u)}</span>`).join('')}</div></div>
</div></div></section>
<section class="section" style="padding-top:0"><div class="wrap">
<div class="reveal" style="max-width:44rem;margin-bottom:2.4rem"><p class="kick">Zo werken we</p><h2 style="font-size:clamp(1.9rem,3.6vw,2.7rem)">Van kennismaking tot <em>resultaat</em></h2></div>
<div class="stappen">${d.plan.map((s, i) => `<div class="stap reveal d${i + 1}"><h3>${esc(s.stap)}</h3><p>${esc(s.uitleg)}</p></div>`).join('')}</div>
</div></section>
<section class="section" style="background:#fff;border-block:1px solid var(--line)"><div class="wrap">
<div class="rev-groot reveal">${STARS}<q>${esc(d.reviews[0][0])}</q><cite>— ${esc(d.reviews[0][1])}</cite></div>
<div class="rev-rij">${d.reviews.slice(1).map((r, i) => `<div class="rev-k reveal d${i + 1}"><q>${esc(r[0])}</q><cite>— ${esc(r[1])}</cite></div>`).join('')}</div>
</div></section>
${d.faq && d.faq.length ? `<section class="section"><div class="wrap">
<div class="reveal" style="text-align:center;margin-bottom:2rem"><p class="kick" style="justify-content:center">Veelgestelde vragen</p><h2 style="font-size:clamp(1.9rem,3.6vw,2.7rem)">Goed om te <em>weten</em></h2></div>
<div class="faq-list reveal d1">${d.faq.map(f => `<details class="faq"><summary>${esc(f.v)}<span class="plus">${PLUS}</span></summary><div class="faq-a"><p>${esc(f.a)}</p></div></details>`).join('')}</div>
</div></section>` : ''}
<section class="section" id="contact" style="padding-top:0"><div class="wrap">
<div class="c-kaart reveal">
<div class="c-info"><p class="kick">Contact</p><h2 style="font-size:clamp(1.8rem,3.4vw,2.5rem)">${esc(d.directe_cta)} <em>vandaag</em></h2>
<p style="color:var(--mut)">Gratis en vrijblijvend. We reageren binnen 24 uur, persoonlijk en zonder kleine lettertjes.</p>
<p>Bel <a href="tel:${tel(d)}">${tel(d)}</a><br>of mail <a href="mailto:${mail(d)}">${mail(d)}</a></p></div>
<div class="fgrid"><div><label>Naam</label><input placeholder="Uw naam"></div><div><label>Telefoon of e-mail</label><input placeholder="Waarop we u bereiken"></div><div class="sp2"><label>Uw vraag</label><textarea placeholder="Waar kunnen we mee helpen?"></textarea></div><div class="sp2"><button class="btn btn-p" type="button" style="width:100%;justify-content:center">${esc(d.directe_cta)}</button></div></div>
</div></div></section>
</main>
<footer><div class="wrap f-in"><span style="font-family:'Fraunces',serif;font-size:1.1rem;color:var(--txt)">${esc(d.bedrijf)}</span><span>${mail(d)} · ${tel(d)}</span><span style="opacity:.6;font-size:.84rem">Conceptontwerp door ClickCurve</span></div></footer>
<script>${NAV_REVEAL_JS}</script>
</body></html>`;
}

// ============================================================
// CONCEPT 3 — STATEMENT (zakelijk): modern & uitgesproken
// Type-hero (XXL kop) met fotoband eronder · tellende cijfers ·
// donkere diensten-band · afwisselende werk-rijen · sticky CTA
// ============================================================
function zakelijk(d) {
  return `${headTag(d, 'https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap', '#0e1116')}
<style>${RESET}
:root{--acc:${d.accent};--ink:#0e1116;--ink2:#151a21;--bg:#ffffff;--grijs:#f3f5f7;--txt:#10141a;--mut:rgba(16,20,26,.62);--line:rgba(16,20,26,.12);--ldark:rgba(255,255,255,.14);--wmut:rgba(255,255,255,.72)}
body{background:var(--bg);color:var(--txt);font-family:'Inter',system-ui,sans-serif;font-size:1.03rem;line-height:1.65;padding-bottom:64px}
h1,h2,h3{font-family:'Sora',system-ui,sans-serif;font-weight:700;line-height:1.06;margin:0 0 .55em;letter-spacing:-.015em}
.wrap{width:min(1180px,92vw);margin-inline:auto}
.section{padding-block:clamp(4rem,8vw,6.6rem)}
.kick{font-size:.72rem;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--mut);display:inline-flex;align-items:center;gap:.6rem;margin:0 0 1rem}
.kick::before{content:"";width:10px;height:10px;background:var(--acc);border-radius:2px}
.dark .kick{color:var(--wmut)}
.btn{display:inline-flex;align-items:center;gap:.55rem;padding:.95rem 1.7rem;border-radius:10px;border:2px solid transparent;font-weight:700;font-size:.98rem;cursor:pointer;font-family:'Sora',sans-serif;transition:.25s}
.btn svg{width:17px;height:17px}
.btn-p{background:var(--ink);color:#fff}
.btn-p:hover{background:var(--acc);color:var(--ink);transform:translateY(-2px)}
.btn-a{background:var(--acc);color:var(--ink)}
.btn-a:hover{transform:translateY(-2px);box-shadow:0 14px 30px -12px var(--acc)}
.btn-g{border-color:var(--line);color:var(--txt)}
.btn-g:hover{border-color:var(--ink)}
.topbar{position:fixed;inset:0 0 auto;z-index:60;background:rgba(255,255,255,.94);backdrop-filter:blur(10px);border-bottom:1px solid transparent;transition:.3s}
.topbar.scrolled{border-color:var(--line)}
.nav{display:flex;align-items:center;justify-content:space-between;padding-block:1rem}
.brand{font-family:'Sora',sans-serif;font-weight:800;font-size:1.15rem;letter-spacing:.02em;text-transform:uppercase}
.brand i{font-style:normal;color:var(--acc)}
.nav-links{display:none;gap:2rem;list-style:none;margin:0;padding:0}
.nav-links a{font-size:.8rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mut);transition:.25s}
.nav-links a:hover{color:var(--txt)}
.nav-cta{display:none;padding:.65rem 1.2rem;font-size:.85rem}
.nav-toggle{display:inline-flex;flex-direction:column;gap:5px;background:none;border:0;padding:.5rem;cursor:pointer}
.nav-toggle span{width:24px;height:2px;background:var(--txt);transition:.3s}
.nav-toggle.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.nav-toggle.open span:nth-child(2){opacity:0}
.nav-toggle.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
@media(min-width:900px){.nav-links{display:flex}.nav-cta{display:inline-flex}.nav-toggle{display:none}}
.mobile-panel{position:fixed;inset:0;z-index:55;background:rgba(255,255,255,.98);display:grid;place-content:center;text-align:center;gap:1.5rem;opacity:0;pointer-events:none;transition:.3s}
.mobile-panel.open{opacity:1;pointer-events:auto}
.mobile-panel a{font-family:'Sora',sans-serif;font-weight:800;font-size:1.6rem;text-transform:uppercase}
body.no-scroll{overflow:hidden}
/* type-hero + fotoband */
.hero{padding-top:8rem}
.hero h1{font-size:clamp(2.7rem,7.2vw,5.4rem);max-width:16ch}
.hero h1 b{color:var(--acc)}
.hero .lead{font-size:clamp(1.05rem,1.6vw,1.25rem);color:var(--mut);max-width:36rem;margin-top:1.1rem}
.hero-cta{display:flex;flex-wrap:wrap;gap:.9rem;margin-top:1.9rem}
.foto-band{margin-top:clamp(2.4rem,5vw,3.6rem);border-radius:18px;overflow:hidden;position:relative;background:linear-gradient(140deg,#1b202a,#0f1218);aspect-ratio:21/9;min-height:260px}
.foto-band img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.usp-strip{display:grid;border-block:1px solid var(--line)}
@media(min-width:700px){.usp-strip{grid-template-columns:repeat(3,1fr)}}
.usp-strip div{padding:1.4rem 1.6rem;display:flex;align-items:center;gap:.8rem;font-weight:600;font-size:.95rem}
.usp-strip div+div{border-top:1px solid var(--line)}
@media(min-width:700px){.usp-strip div+div{border-top:0;border-left:1px solid var(--line)}}
.usp-strip svg{width:18px;height:18px;color:var(--acc);flex:none}
/* stats donker met tellers */
.dark{background:var(--ink);color:#fff}
.stats{display:grid;gap:2rem;text-align:center}
@media(min-width:700px){.stats{grid-template-columns:repeat(3,1fr)}}
.stat .num{font-family:'Sora',sans-serif;font-weight:800;font-size:clamp(2.6rem,6vw,4rem);color:var(--acc);line-height:1}
.stat .lbl{margin-top:.5rem;color:var(--wmut);font-size:.95rem}
/* pijn */
.pijn-grid{display:grid;gap:1.4rem}
@media(min-width:700px){.pijn-grid{grid-template-columns:repeat(3,1fr)}}
.pijn{background:var(--grijs);border-radius:14px;padding:1.6rem;border-left:4px solid var(--acc)}
.pijn b{font-family:'Sora',sans-serif;font-size:.8rem;letter-spacing:.18em;text-transform:uppercase;color:var(--mut)}
.pijn p{margin:.5rem 0 0}
/* diensten donker */
.d-grid{display:grid;gap:1.4rem}
@media(min-width:760px){.d-grid{grid-template-columns:repeat(3,1fr)}}
.d-card{border:1px solid var(--ldark);border-radius:16px;padding:1.9rem 1.7rem;transition:.3s;background:var(--ink2)}
.d-card:hover{border-color:var(--acc);transform:translateY(-5px)}
.d-card .nr{font-family:'Sora',sans-serif;font-weight:800;font-size:2.6rem;line-height:1;color:transparent;-webkit-text-stroke:1.5px var(--acc)}
.d-card h3{font-size:1.3rem;margin:.9rem 0 .35rem;color:#fff}
.d-card p{margin:0;color:var(--wmut);font-size:.96rem}
/* werk: afwisselende rijen */
.werk-rij{display:grid;gap:2rem;align-items:center;padding-block:clamp(1.8rem,4vw,3rem)}
@media(min-width:860px){.werk-rij{grid-template-columns:1.15fr .85fr;gap:3.6rem}.werk-rij.omgekeerd .w-foto{order:2}.werk-rij.omgekeerd .w-tekst{order:1}}
.werk-rij+.werk-rij{border-top:1px solid var(--line)}
.w-foto{position:relative;border-radius:16px;overflow:hidden;background:linear-gradient(140deg,#1b202a,#0f1218);aspect-ratio:16/10}
.w-foto img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .6s}
.werk-rij:hover .w-foto img{transform:scale(1.04)}
.w-tekst .nr{font-family:'Sora',sans-serif;font-weight:800;color:transparent;-webkit-text-stroke:1.5px var(--acc);font-size:2.2rem;line-height:1}
.w-tekst h3{font-size:clamp(1.5rem,2.6vw,2rem);margin:.7rem 0 .4rem}
.w-tekst p{color:var(--mut);max-width:30rem}
/* over compact */
.over{display:grid;gap:2.4rem;align-items:center}
@media(min-width:860px){.over{grid-template-columns:.75fr 1.25fr;gap:4rem}}
.over .ph{border-radius:16px;overflow:hidden;position:relative;aspect-ratio:4/5;background:linear-gradient(140deg,#1b202a,#0f1218)}
.over .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.over .tag{position:absolute;left:1rem;top:1rem;background:var(--acc);color:var(--ink);font-family:'Sora',sans-serif;font-weight:800;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;padding:.45rem .9rem;border-radius:8px;z-index:2}
/* stappenbalk */
.stap-balk{display:grid;gap:1.2rem}
@media(min-width:760px){.stap-balk{grid-template-columns:repeat(3,1fr)}}
.stap{background:#fff;border:1px solid var(--line);border-radius:14px;padding:1.6rem;position:relative;overflow:hidden}
.stap::after{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--acc)}
.stap b{font-family:'Sora',sans-serif;font-size:.78rem;letter-spacing:.2em;text-transform:uppercase;color:var(--mut)}
.stap h3{font-size:1.25rem;margin:.5rem 0 .3rem}
.stap p{margin:0;color:var(--mut);font-size:.95rem}
/* reviews */
.rev-grid{display:grid;gap:1.4rem}
@media(min-width:760px){.rev-grid{grid-template-columns:repeat(3,1fr)}}
.rev{background:var(--grijs);border-radius:14px;padding:1.7rem;border-top:4px solid var(--acc)}
.rev q{quotes:'"' '"';font-weight:500}
.rev cite{display:block;margin-top:.9rem;font-style:normal;font-size:.88rem;color:var(--mut);font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.stars{display:inline-flex;gap:2px;color:var(--acc);margin-bottom:.7rem}
.stars svg{width:14px;height:14px;fill:currentColor}
/* faq */
.faq-list{max-width:48rem;margin-inline:auto}
.faq{background:#fff;border:1px solid var(--line);border-radius:12px;margin-bottom:.9rem;overflow:hidden}
.faq summary{display:flex;justify-content:space-between;align-items:center;gap:1rem;cursor:pointer;list-style:none;padding:1.15rem 1.3rem;font-family:'Sora',sans-serif;font-weight:600;font-size:1.05rem}
.faq summary::-webkit-details-marker{display:none}
.faq .plus{flex:none;width:28px;height:28px;border-radius:8px;background:var(--grijs);display:grid;place-items:center;color:var(--txt);transition:.3s}
.faq .plus svg{width:13px;height:13px}
.faq[open] .plus{transform:rotate(45deg);background:var(--acc)}
.faq-a{padding:0 1.3rem 1.2rem;color:var(--mut)}
/* contact donker */
.c-grid{display:grid;gap:2.6rem}
@media(min-width:940px){.c-grid{grid-template-columns:1fr 1.05fr;gap:4rem;align-items:center}}
.c-grid h2{color:#fff}
.c-grid .lead{color:var(--wmut)}
.c-check{display:grid;gap:.7rem;margin-top:1.6rem;color:var(--wmut)}
.c-check span{display:flex;gap:.6rem;align-items:center}
.c-check svg{width:16px;height:16px;color:var(--acc)}
.fcard{background:#fff;color:var(--txt);border-radius:18px;padding:clamp(1.6rem,3vw,2.4rem)}
.fgrid{display:grid;gap:1rem}
@media(min-width:640px){.fgrid{grid-template-columns:1fr 1fr}.sp2{grid-column:1/-1}}
.fcard label{display:block;font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mut);margin-bottom:.4rem}
.fcard input,.fcard textarea{width:100%;padding:.85rem 1rem;border:1px solid var(--line);border-radius:10px;font:inherit}
.fcard textarea{min-height:110px;resize:vertical}
footer{background:var(--ink);color:var(--wmut);padding:2.4rem 0;font-size:.92rem}
.f-in{display:flex;flex-wrap:wrap;justify-content:space-between;gap:1rem;align-items:center}
/* sticky CTA */
.sticky{position:fixed;left:0;right:0;bottom:0;z-index:70;background:var(--ink);border-top:1px solid var(--ldark);transform:translateY(110%);transition:transform .35s}
.sticky.show{transform:none}
.sticky .wrap{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding-block:.7rem}
.sticky span{color:#fff;font-family:'Sora',sans-serif;font-weight:700;font-size:.92rem}
.sticky .btn{padding:.6rem 1.2rem;font-size:.85rem}
@media(max-width:560px){.sticky span{display:none}.sticky .wrap{justify-content:center}}
</style></head><body>
<header class="topbar" id="hdr"><div class="wrap nav">
<a class="brand" href="#top">${esc(d.bedrijf)}<i>.</i></a>
<ul class="nav-links"><li><a href="#diensten">Diensten</a></li><li><a href="#werk">Werk</a></li><li><a href="#over">Over</a></li><li><a href="#contact">Contact</a></li></ul>
<a class="btn btn-a nav-cta" href="#contact">${esc(d.directe_cta)}</a>
<button class="nav-toggle" id="navToggle" aria-label="Menu"><span></span><span></span><span></span></button>
</div></header>
<nav class="mobile-panel" id="mobielmenu"><a href="#diensten">Diensten</a><a href="#werk">Werk</a><a href="#over">Over</a><a href="#contact">Contact</a><a class="btn btn-a" href="#contact">${esc(d.directe_cta)}</a></nav>
<main id="top">
<section class="hero"><div class="wrap">
<p class="kick fx fx-1">${esc(d.label)}</p>
<h1 class="fx fx-2">${esc(splitKop(d.oneliner)[0])} <b>${esc(splitKop(d.oneliner)[1] || '')}</b></h1>
<p class="lead fx fx-3">${esc(d.subkop)}</p>
<div class="hero-cta fx fx-4"><a class="btn btn-a" href="#contact">${esc(d.directe_cta)} ${ARROW}</a><a class="btn btn-g" href="#werk">${esc(d.transitionele_cta)}</a></div>
<div class="foto-band fx fx-5">${img(d.fotos.hero)}</div>
</div></section>
<div class="usp-strip">${d.usps.map(u => `<div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>${esc(u)}</div>`).join('')}</div>
<section class="section dark"><div class="wrap">
<div class="stats">
<div class="stat reveal"><div class="num" data-count="4.9" data-dec="1" data-suffix="★">0★</div><div class="lbl">Gemiddelde klantbeoordeling</div></div>
<div class="stat reveal d1"><div class="num" data-count="24" data-suffix="u">0u</div><div class="lbl">Reactie op uw aanvraag</div></div>
<div class="stat reveal d2"><div class="num" data-count="100" data-suffix="%">0%</div><div class="lbl">Vrijblijvend en transparant</div></div>
</div></div></section>
<section class="section"><div class="wrap">
<div class="reveal" style="max-width:46rem;margin-bottom:2.2rem"><p class="kick">Herkenbaar?</p><h2 style="font-size:clamp(1.9rem,4vw,2.9rem)">${esc(d.probleem_titel)}</h2></div>
<div class="pijn-grid">${d.probleem_punten.map((p, i) => `<div class="pijn reveal d${i + 1}"><b>0${i + 1}</b><p>${esc(p)}</p></div>`).join('')}</div>
</div></section>
<section class="section dark" id="diensten"><div class="wrap">
<div class="reveal" style="max-width:46rem;margin-bottom:2.2rem"><p class="kick">Diensten</p><h2 style="font-size:clamp(1.9rem,4vw,2.9rem);color:#fff">Dit doen we voor u</h2></div>
<div class="d-grid">${d.diensten.map((s, i) => `<article class="d-card reveal d${i + 1}"><span class="nr">0${i + 1}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></article>`).join('')}</div>
</div></section>
<section class="section" id="werk"><div class="wrap">
<div class="reveal" style="max-width:46rem"><p class="kick">Ons werk</p><h2 style="font-size:clamp(1.9rem,4vw,2.9rem)">Resultaat dat voor zich spreekt</h2></div>
${[d.fotos.a, d.fotos.b].map((f, i) => `<div class="werk-rij ${i % 2 ? 'omgekeerd' : ''} reveal"><div class="w-foto">${img(f)}</div><div class="w-tekst"><span class="nr">0${i + 1}</span><h3>${esc((d.diensten[i] || d.diensten[0]).t)}</h3><p>${esc((d.diensten[i] || d.diensten[0]).d)}</p><a class="btn btn-g" href="#contact">${esc(d.transitionele_cta)}</a></div></div>`).join('')}
</div></section>
<section class="section" id="over" style="padding-top:0"><div class="wrap over">
<div class="ph reveal"><span class="tag">Team</span>${img(d.fotos.portret, esc(d.bedrijf))}</div>
<div class="reveal d1"><p class="kick">Over ${esc(d.bedrijf)}</p><h2 style="font-size:clamp(1.9rem,4vw,2.9rem)">Nuchter, vakkundig, afspraak is afspraak</h2>
<p>${esc(d.gids_empathie)}</p><p style="color:var(--mut)">${esc(d.gids_autoriteit)}</p>
<div class="stap-balk" style="margin-top:1.6rem">${d.plan.map((s, i) => `<div class="stap"><b>Stap 0${i + 1}</b><h3>${esc(s.stap)}</h3><p>${esc(s.uitleg)}</p></div>`).join('')}</div></div>
</div></section>
<section class="section" style="background:var(--grijs)"><div class="wrap">
<div class="reveal" style="max-width:46rem;margin-bottom:2.2rem"><p class="kick">Reviews</p><h2 style="font-size:clamp(1.9rem,4vw,2.9rem)">Wat klanten zeggen</h2></div>
<div class="rev-grid">${d.reviews.map((r, i) => `<article class="rev reveal d${i + 1}" style="background:#fff">${STARS}<q>${esc(r[0])}</q><cite>${esc(r[1])}</cite></article>`).join('')}</div>
</div></section>
${d.faq && d.faq.length ? `<section class="section"><div class="wrap">
<div class="reveal" style="text-align:center;margin-bottom:2rem"><p class="kick" style="justify-content:center">FAQ</p><h2 style="font-size:clamp(1.9rem,4vw,2.9rem)">Goed om te weten</h2></div>
<div class="faq-list reveal d1">${d.faq.map(f => `<details class="faq"><summary>${esc(f.v)}<span class="plus">${PLUS}</span></summary><div class="faq-a"><p>${esc(f.a)}</p></div></details>`).join('')}</div>
</div></section>` : ''}
<section class="section dark" id="contact"><div class="wrap c-grid">
<div class="reveal"><p class="kick">Contact</p><h2 style="font-size:clamp(2rem,4.4vw,3.1rem)">${esc(d.directe_cta)}<span style="color:var(--acc)">.</span></h2>
<p class="lead">Vertel kort wat u zoekt — u hoort binnen 24 uur van ons.</p>
<div class="c-check"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Gratis &amp; vrijblijvend</span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Reactie binnen 24 uur</span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Bel direct: <a href="tel:${tel(d)}" style="color:#fff;font-weight:700">${tel(d)}</a></span></div></div>
<div class="fcard reveal d1"><div class="fgrid"><div><label>Naam</label><input placeholder="Uw naam"></div><div><label>Telefoon of e-mail</label><input placeholder="Waarop we u bereiken"></div><div class="sp2"><label>Uw vraag</label><textarea placeholder="Waar kunnen we mee helpen?"></textarea></div><div class="sp2"><button class="btn btn-a" type="button" style="width:100%;justify-content:center">${esc(d.directe_cta)}</button></div></div></div>
</div></section>
</main>
<footer><div class="wrap f-in"><span class="brand" style="color:#fff">${esc(d.bedrijf)}<i>.</i></span><span>${mail(d)} · ${tel(d)}</span><span style="opacity:.5;font-size:.82rem">Conceptontwerp door ClickCurve</span></div></footer>
<div class="sticky" id="sticky"><div class="wrap"><span>${esc(d.bedrijf)} — gratis &amp; vrijblijvend</span><a class="btn btn-a" href="#contact">${esc(d.directe_cta)}</a></div></div>
<script>${NAV_REVEAL_JS}
(function(){
  function tel(el){var t=parseFloat(el.getAttribute('data-count')),sf=el.getAttribute('data-suffix')||'',dc=parseInt(el.getAttribute('data-dec')||'0',10),d=1300,s=null;
    function st(ts){if(!s)s=ts;var p=Math.min((ts-s)/d,1),e=1-Math.pow(1-p,3);el.textContent=(t*e).toFixed(dc).replace('.',',')+sf;if(p<1)requestAnimationFrame(st);}requestAnimationFrame(st);}
  var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){tel(e.target);co.unobserve(e.target)}})},{threshold:.5});
  document.querySelectorAll('.num[data-count]').forEach(function(el){co.observe(el)});
  var st=document.getElementById('sticky'),ct=document.getElementById('contact');
  addEventListener('scroll',function(){var past=scrollY>650,bij=ct&&ct.getBoundingClientRect().top<innerHeight;st.classList.toggle('show',past&&!bij)},{passive:true});
})();
</script>
</body></html>`;
}

module.exports = { editorial, vriendelijk, zakelijk };
