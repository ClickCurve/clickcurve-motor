// ============================================================
// motor.js — de ClickCurve concept-motor
//
// Wat het doet, per lead:
//  1. Neemt leadgegevens aan (branche, bedrijfsnaam, omschrijving)
//  2. Vraagt Claude: vertaal branche -> Engelse Unsplash-zoektermen
//     + schrijf de teksten (tagline, korte intro, 3 diensten)
//  3. Haalt echte foto's op bij Unsplash op die zoektermen
//  4. Vult de 3 templates en schrijft 3 losse HTML-bestanden
//
// Benodigde omgevingsvariabelen (zie .env.example):
//  - ANTHROPIC_API_KEY   (van console.anthropic.com)
//  - UNSPLASH_ACCESS_KEY (van unsplash.com/developers)
//
// Werkt OOK zonder sleutels: dan gebruikt het nette demo-teksten
// en kleur-placeholders, zodat je de templates altijd kunt zien.
// ============================================================

const fs = require('fs');
const path = require('path');
const templates = require('./templates');

// ---- kleurenpaletten per "sfeer" (de motor kiest er één op gevoel van de branche) ----
const PALETTEN = {
  warm:    { accent: '#B6705A', accentDeep: '#7E4636', tint: '#F6EEE9' },
  groen:   { accent: '#5B7B4A', accentDeep: '#3A5230', tint: '#EEF2E8' },
  blauw:   { accent: '#4A6E8A', accentDeep: '#2F4860', tint: '#EAF0F4' },
  paars:   { accent: '#9B5B8A', accentDeep: '#6E3D61', tint: '#F4ECF1' },
  zand:    { accent: '#B08D57', accentDeep: '#7C6035', tint: '#F4EFE4' },
  leisteen:{ accent: '#5E6B70', accentDeep: '#3C4649', tint: '#ECEEEF' },
};

// ============================================================
// STAP 2 — Claude: branche -> zoektermen + teksten
// ============================================================
async function vraagClaude(lead) {
  const key = process.env.ANTHROPIC_API_KEY;
  const prompt = `Je schrijft de teksten voor een website volgens het StoryBrand-raamwerk (SB7). De KLANT is de held, het bedrijf is de GIDS. Spreek de bezoeker aan met "u".

=== HET BEDRIJF ===
Branche: ${lead.branche}
Bedrijfsnaam: ${lead.bedrijf}
Omschrijving: ${lead.omschrijving || '(geen)'}

Schrijf ALLES specifiek voor de branche "${lead.branche}". Gebruik woorden, diensten, problemen en beelden die bij precies deze branche horen. Verzin GEEN diensten uit een andere sector. Als de branche bijvoorbeeld "${lead.branche}" is, dan gaan de teksten en foto-zoekwoorden ALLEEN over ${lead.branche}, nergens anders over.

Geef UITSLUITEND geldige JSON terug, geen uitleg, exact dit formaat (de voorbeelden tussen haakjes zijn slechts uitleg van het soort inhoud, NIET letterlijk overnemen):
{
  "label": "(korte branche-aanduiding)",
  "oneliner": "(aspirationele kopzin van max 9 woorden, over wat de KLANT wint)",
  "subkop": "(1 zin van ca. 18 woorden over het aanbod en het voordeel voor de klant)",
  "directe_cta": "(knoptekst 2-3 woorden)",
  "transitionele_cta": "(lagedrempel-actie 2-4 woorden)",
  "probleem_titel": "(korte kop die het probleem benoemt)",
  "probleem_punten": ["(pijnpunt van de klant in 1 zin)", "(tweede pijnpunt)", "(derde pijnpunt)"],
  "gids_empathie": "(1 zin empathie die laat zien dat u de klant begrijpt)",
  "gids_autoriteit": "(1 zin die vertrouwen/autoriteit geeft)",
  "plan": [
    {"stap": "(korte staptitel 2-4 woorden)", "uitleg": "(1 korte zin)"},
    {"stap": "(stap 2)", "uitleg": "(1 korte zin)"},
    {"stap": "(stap 3)", "uitleg": "(1 korte zin)"}
  ],
  "diensten": [
    {"t": "(dienst die past bij ${lead.branche})", "d": "(1 korte zin)"},
    {"t": "(dienst die past bij ${lead.branche})", "d": "(1 korte zin)"},
    {"t": "(dienst die past bij ${lead.branche})", "d": "(1 korte zin)"}
  ],
  "succes_punten": ["(wat de klant wint, kort)", "(tweede winst)", "(derde winst)"],
  "faq": [
    {"v": "(veelgestelde vraag van een klant in deze branche)", "a": "(geruststellend antwoord van 1-2 zinnen)"},
    {"v": "(tweede veelgestelde vraag)", "a": "(antwoord)"},
    {"v": "(derde veelgestelde vraag)", "a": "(antwoord)"},
    {"v": "(vierde veelgestelde vraag)", "a": "(antwoord)"}
  ],
  "reviews": [
    ["(geloofwaardige review van 1 zin over ${lead.branche})", "(voornaam)"],
    ["(idem)", "(voornaam)"],
    ["(idem)", "(voornaam)"]
  ],
  "usps": ["(vertrouwenspunt 2-4 woorden)", "(idem)", "(idem)"],
  "sfeer": "(kies exact EEN die past bij de branche: warm, groen, blauw, paars, zand, leisteen)",
  "fotos": {
    "hero": "(2-4 ENGELSE zoekwoorden voor een professionele sfeerfoto van een ${lead.branche}-bedrijf)",
    "a": "(2-4 ENGELSE zoekwoorden, ander beeld dat past bij ${lead.branche})",
    "b": "(2-4 ENGELSE zoekwoorden, ander beeld dat past bij ${lead.branche})",
    "c": "(2-4 ENGELSE zoekwoorden, ander beeld dat past bij ${lead.branche})"
  }
}

Belangrijk: de one-liner en succes-punten gaan over de klant, niet over het bedrijf. De foto-zoekwoorden zijn ENGELS, concreet-professioneel, en horen 100% bij branche "${lead.branche}". Voeg bij elk foto-zoekwoord woorden toe die zorgen voor lichte, rustige, professionele beelden (bijvoorbeeld "bright", "clean", "modern", "professional"), zodat de foto's premium ogen en niet donker of rommelig zijn.`;

  // ---- fallback zonder API-sleutel ----
  if (!key) {
    console.log('  ⚠ Geen ANTHROPIC_API_KEY — ik gebruik demo-teksten.');
    return {
      label: lead.branche,
      oneliner: `Een zorg minder, perfect geregeld.`,
      subkop: `${lead.bedrijf} neemt het werk uit handen, zodat u zich nergens druk om hoeft te maken.`,
      directe_cta: 'Vraag offerte aan',
      transitionele_cta: 'Bekijk ons werk',
      probleem_titel: 'Herkent u dit?',
      probleem_punten: [
        'U weet niet waar u moet beginnen of wie u kunt vertrouwen.',
        'Eerdere ervaringen liepen uit op gedoe of tegenvallers.',
        'U wilt gewoon dat het in één keer goed gebeurt.',
      ],
      gids_empathie: 'Wij snappen dat u zekerheid wilt, geen verrassingen.',
      gids_autoriteit: 'Met jarenlange ervaring en tevreden klanten weet u dat het goed zit.',
      plan: [
        { stap: 'Neem contact op', uitleg: 'Vraag vrijblijvend een offerte aan.' },
        { stap: 'Wij komen langs', uitleg: 'We bekijken het en maken een helder plan.' },
        { stap: 'Klaar zonder zorgen', uitleg: 'Wij regelen het, u geniet van het resultaat.' },
      ],
      diensten: [
        { t: 'Onze dienst', d: 'Een korte omschrijving van wat we doen.' },
        { t: 'Tweede dienst', d: 'Nog een omschrijving van ons aanbod.' },
        { t: 'Derde dienst', d: 'En waar we verder mee kunnen helpen.' },
      ],
      succes_punten: [
        'Rust en zekerheid dat het goed geregeld is.',
        'Een resultaat waar u trots op bent.',
        'Tijd over voor de dingen die u leuk vindt.',
      ],
      faq: [
        { v: 'Wat kost het?', a: 'Dat hangt af van uw situatie. U krijgt vooraf een heldere, vrijblijvende offerte zonder verrassingen.' },
        { v: 'Hoe snel kunnen jullie aan de slag?', a: 'Meestal plannen we binnen een week een afspraak in. Vraag gerust naar de actuele planning.' },
        { v: 'Is de offerte echt vrijblijvend?', a: 'Ja. U zit nergens aan vast en betaalt niets voor een offerte of advies.' },
        { v: 'Krijg ik een vast aanspreekpunt?', a: 'Zeker. U heeft één contactpersoon die u door het hele traject begeleidt.' },
      ],
      reviews: [
        ['Top geholpen, precies wat ik zocht. Aanrader!', 'Sanne'],
        ['Netjes, snel en een eerlijke prijs. Zeer tevreden.', 'Mark'],
        ['Snelle reactie en alles keurig geregeld. Top bedrijf.', 'Priya'],
      ],
      usps: ['Gratis & vrijblijvend', 'Reactie binnen 24 uur', 'Vakwerk met garantie'],
      sfeer: 'blauw',
      fotos: { hero: lead.branche, a: lead.branche, b: lead.branche, c: lead.branche },
    };
  }

  // ---- echte Claude-aanroep, met 1 automatische herkansing bij ongeldige JSON ----
  async function callClaude() {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`Claude API fout: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.content.filter(b => b.type === 'text').map(b => b.text).join('').trim();
  }

  function parseJson(raw) {
    let txt = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    // pak alleen het JSON-object (van eerste { tot laatste })
    const first = txt.indexOf('{');
    const last = txt.lastIndexOf('}');
    if (first !== -1 && last !== -1) txt = txt.slice(first, last + 1);
    // verwijder trailing komma's (veelvoorkomende fout): ,} en ,]
    txt = txt.replace(/,(\s*[}\]])/g, '$1');
    return JSON.parse(txt);
  }

  let raw = await callClaude();
  try {
    return parseJson(raw);
  } catch (e) {
    console.log('  → Antwoord was geen nette JSON, ik probeer het nog één keer...');
    raw = await callClaude();
    return parseJson(raw); // lukt dit ook niet, dan stopt de motor met een duidelijke melding
  }
}

// ============================================================
// STAP 3 — Unsplash: zoekterm -> foto-URL
// ============================================================
async function zoekFoto(term, breedte = 1400) {
  const key = process.env.UNSPLASH_ACCESS_KEY;

  // fallback zonder sleutel: een kleur-placeholder (laadt altijd)
  if (!key) {
    return `https://placehold.co/${breedte}x${Math.round(breedte * 0.7)}/cccccc/666666?text=${encodeURIComponent(term)}`;
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&per_page=10&orientation=landscape&content_filter=high`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${key}` } });
  if (!res.ok) throw new Error(`Unsplash fout: ${res.status}`);
  const data = await res.json();
  const results = data.results || [];
  if (!results.length) return `https://placehold.co/${breedte}x${Math.round(breedte * 0.7)}/cccccc/666666?text=geen+foto`;
  // kies willekeurig uit de top-resultaten, zodat de 4 foto's niet identiek zijn
  const hit = results[Math.floor(Math.random() * Math.min(results.length, 6))];
  // raw-URL met eigen breedte/kwaliteit
  return `${hit.urls.raw}&w=${breedte}&q=80&fit=crop`;
}

// ============================================================
// HOOFDFUNCTIE — genereer 3 concepten voor één lead
// ============================================================
async function genereerConcepten(lead, outDir = path.join(__dirname, 'output')) {
  console.log(`\n▶ Lead: ${lead.bedrijf} (${lead.branche})`);

  // 1+2. Claude: teksten + zoektermen
  console.log('  • Claude: teksten en zoektermen...');
  const ai = await vraagClaude(lead);
  // --- diagnose: laat zien wat Claude teruggaf, zodat drift zichtbaar is ---
  console.log(`    → kop: "${ai.oneliner}"`);
  console.log(`    → foto-zoekwoorden: ${ai.fotos.hero} | ${ai.fotos.a} | ${ai.fotos.b} | ${ai.fotos.c}`);

  // 3. foto's ophalen (parallel)
  console.log('  • Unsplash: foto\'s ophalen...');
  const [hero, a, b, c] = await Promise.all([
    zoekFoto(ai.fotos.hero, 1400),
    zoekFoto(ai.fotos.a, 900),
    zoekFoto(ai.fotos.b, 900),
    zoekFoto(ai.fotos.c, 900),
  ]);

  // data-object samenstellen
  const palet = PALETTEN[ai.sfeer] || PALETTEN.blauw;
  const d = {
    bedrijf: lead.bedrijf,
    label: ai.label,
    oneliner: ai.oneliner,
    subkop: ai.subkop,
    directe_cta: ai.directe_cta || 'Neem contact op',
    transitionele_cta: ai.transitionele_cta || 'Bekijk ons werk',
    probleem_titel: ai.probleem_titel || 'Herkent u dit?',
    probleem_punten: ai.probleem_punten || [],
    gids_empathie: ai.gids_empathie || '',
    gids_autoriteit: ai.gids_autoriteit || '',
    plan: ai.plan || [],
    diensten: ai.diensten,
    succes_punten: ai.succes_punten || [],
    faq: ai.faq || [],
    reviews: ai.reviews,
    usps: ai.usps || ['Gratis & vrijblijvend', 'Snelle reactie', 'Met garantie'],
    fotos: { hero, a, b, c },
    contact: lead.contact || {},
    ...palet,
  };

  // 4. templates vullen + wegschrijven
  console.log('  • Templates vullen en wegschrijven...');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const slug = lead.bedrijf.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const bestanden = {
    [`${slug}-1-redactioneel.html`]: templates.editorial(d),
    [`${slug}-2-helder.html`]: templates.vriendelijk(d),
    [`${slug}-3-zakelijk.html`]: templates.zakelijk(d),
  };
  const paden = [];
  for (const [naam, html] of Object.entries(bestanden)) {
    const p = path.join(outDir, naam);
    fs.writeFileSync(p, html, 'utf8');
    paden.push(p);
    console.log(`    ✓ ${naam}`);
  }
  return paden;
}

module.exports = { genereerConcepten, vraagClaude, zoekFoto };

// ---- direct draaien voor een test: `node motor.js` ----
if (require.main === module) {
  const testLead = {
    branche: process.argv[2] || 'Glazenwasser',
    bedrijf: process.argv[3] || 'Helder Glas',
    omschrijving: 'Glazenwasserij voor particulier en bedrijf, binnen en buiten, met ladder en waterzuigsysteem.',
    contact: { email: 'info@helderglas.nl', telefoon: '06 12 34 56 78' },
  };
  genereerConcepten(testLead)
    .then(p => console.log(`\n✅ Klaar. ${p.length} bestanden in output/`))
    .catch(e => { console.error('\n❌ Fout:', e.message); process.exit(1); });
}
