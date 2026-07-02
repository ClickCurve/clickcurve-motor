// Vervangt de externe placeholder-foto's in de output door inline SVG,
// puur zodat de preview hier rendert. De echte motor gebruikt Unsplash.
const fs = require('fs');
const path = require('path');

function svgData(label, accent, deep, seed) {
  const ang = 110 + (seed*37)%70;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
  <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1' gradientTransform='rotate(${ang} .5 .5)'>
  <stop offset='0' stop-color='${accent}'/><stop offset='1' stop-color='${deep}'/></linearGradient>
  <radialGradient id='r' cx='48%' cy='38%' r='80%'><stop offset='0' stop-color='#fff' stop-opacity='.28'/>
  <stop offset='.7' stop-color='#000' stop-opacity='0'/><stop offset='1' stop-color='#000' stop-opacity='.3'/></radialGradient></defs>
  <rect width='400' height='300' fill='url(#g)'/>
  <circle cx='${80+(seed*53)%240}' cy='${50+(seed*29)%150}' r='${60+(seed*23)%50}' fill='#fff' opacity='.10'/>
  <circle cx='${140+(seed*71)%180}' cy='${130+(seed*17)%120}' r='${40+(seed*13)%40}' fill='#fff' opacity='.07'/>
  <rect width='400' height='300' fill='url(#r)'/>
  <text x='20' y='285' font-family='system-ui,sans-serif' font-size='13' letter-spacing='1' fill='rgba(255,255,255,.9)'>${label}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// palet uit motor (blauw = fallback sfeer voor de demo)
const pal = { accent:'#4A6E8A', deep:'#2F4860' };
const labels = ['Sfeerbeeld','Detail','Aan het werk','Resultaat'];

const dir = path.join(__dirname,'output');
let seed = 1;
for (const f of fs.readdirSync(dir).filter(x=>x.endsWith('.html'))) {
  let html = fs.readFileSync(path.join(dir,f),'utf8');
  let i = 0;
  // vervang elke placehold.co url door een inline svg
  html = html.replace(/https:\/\/placehold\.co[^')]*/g, () => {
    const u = svgData(labels[i%labels.length], pal.accent, pal.deep, seed+i*3);
    i++; return u;
  });
  fs.writeFileSync(path.join(dir,f), html, 'utf8');
  seed += 7;
  console.log('gefixt:', f, '('+i+' foto\'s)');
}
