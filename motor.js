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
  const prompt = `Je schrijft de teksten voor DRIE verschillende websiteconcepten volgens het StoryBrand-raamwerk (SB7). De KLANT is de held, het bedrijf is de GIDS. Spreek de bezoeker aan met "u".

=== HET BEDRIJF ===
Branche: ${lead.branche}
Bedrijfsnaam: ${lead.bedrijf}
Omschrijving: ${lead.omschrijving || '(geen)'}

Schrijf ALLES specifiek voor de branche "${lead.branche}". Gebruik woorden, diensten, problemen en beelden die bij precies deze branche horen. Verzin GEEN diensten uit een andere sector.

=== DE DRIE CONCEPTEN ===
De klant ontvangt drie concepten die ECHT van elkaar moeten verschillen in toon, kleursfeer en beeld:
1. "redactioneel" — verfijnd en rustig. Toon: kalm, verzorgd, premium. Beelden: details, vakmanschap, texturen, stille composities.
2. "helder" — warm en menselijk. Toon: direct, vriendelijk, toegankelijk. Beelden: mensen, gezichten, interactie, warme sfeer.
3. "zakelijk" — professioneel en resultaatgericht. Toon: zelfverzekerd, concreet, zakelijk. Beelden: werkomgeving, resultaat, professionele context.

Elke concepttekst is ANDERS geformuleerd (geen zin mag letterlijk in twee concepten voorkomen) en elk concept krijgt EIGEN foto-zoekwoorden vanuit de eigen beeld-invalshoek hierboven. De drie "sfeer"-waarden moeten alle drie VERSCHILLEND zijn.

Geef UITSLUITEND geldige JSON terug, geen uitleg, exact dit formaat (tekst tussen haakjes is uitleg, NIET letterlijk overnemen):
{
  "label": "(korte branche-aanduiding)",
  "diensten": [
    {"t": "(dienst die past bij ${lead.branche})", "d": "(1 korte zin)"},
    {"t": "(tweede dienst)", "d": "(1 korte zin)"},
    {"t": "(derde dienst)", "d": "(1 korte zin)"}
  ],
  "faq": [
    {"v": "(veelgestelde vraag van een klant in deze branche)", "a": "(geruststellend antwoord van 1-2 zinnen)"},
    {"v": "(tweede vraag)", "a": "(antwoord)"},
    {"v": "(derde vraag)", "a": "(antwoord)"},
    {"v": "(vierde vraag)", "a": "(antwoord)"}
  ],
  "reviews": [
    ["(geloofwaardige review van 1 zin over ${lead.branche})", "(voornaam)"],
    ["(idem)", "(voornaam)"],
    ["(idem)", "(voornaam)"]
  ],
  "usps": ["(vertrouwenspunt 2-4 woorden)", "(idem)", "(idem)"],
  "concepten": {
    "redactioneel": {
      "sfeer": "(kies EEN: warm, groen, blauw, paars, zand, leisteen)",
      "oneliner": "(kopzin max 9 woorden, over wat de KLANT wint, in de toon van dit concept)",
      "subkop": "(1 zin van ca. 18 woorden)",
      "directe_cta": "(knoptekst 2-3 woorden)",
      "transitionele_cta": "(lagedrempel-actie 2-4 woorden)",
      "probleem_titel": "(korte kop)",
      "probleem_punten": ["(pijnpunt 1 zin)", "(tweede)", "(derde)"],
      "gids_empathie": "(1 zin empathie)",
      "gids_autoriteit": "(1 zin autoriteit)",
      "plan": [
        {"stap": "(staptitel 2-4 woorden)", "uitleg": "(1 korte zin)"},
        {"stap": "(stap 2)", "uitleg": "(1 korte zin)"},
        {"stap": "(stap 3)", "uitleg": "(1 korte zin)"}
      ],
      "succes_punten": ["(winst 1)", "(winst 2)", "(winst 3)"],
      "fotos": {
        "hero": "(2-4 ENGELSE zoekwoorden, beeld-invalshoek van DIT concept, geschikt als paginavullende sfeerfoto)",
        "a": "(2-4 ENGELSE zoekwoorden, ander beeld)",
        "b": "(idem)",
        "c": "(idem)",
        "portret": "(2-4 ENGELSE zoekwoorden voor een persoon/vakman uit deze branche aan het werk of vriendelijk in beeld, professioneel)"
      }
    },
    "helder": { (exact dezelfde velden, maar alles in de toon en beeld-invalshoek van concept "helder", met een ANDERE sfeer) },
    "zakelijk": { (exact dezelfde velden, in de toon en beeld-invalshoek van concept "zakelijk", met weer een ANDERE sfeer) }
  }
}

Belangrijk: one-liners en succes-punten gaan over de klant, niet over het bedrijf. Alle foto-zoekwoorden zijn ENGELS, concreet-professioneel, horen 100% bij branche "${lead.branche}", en bevatten woorden voor lichte, rustige, professionele beelden (zoals "bright", "clean", "modern", "professional"). De 15 foto-zoekwoorden (3 concepten x 4) moeten onderling zoveel mogelijk verschillen zodat er geen dubbele beelden ontstaan.`;

  // ---- fallback zonder API-sleutel ----
  if (!key) {
    console.log('  ⚠ Geen ANTHROPIC_API_KEY — ik gebruik demo-teksten.');
    const basisPlan = [
      { stap: 'Neem contact op', uitleg: 'Vraag vrijblijvend een offerte aan.' },
      { stap: 'Wij komen langs', uitleg: 'We bekijken het en maken een helder plan.' },
      { stap: 'Klaar zonder zorgen', uitleg: 'Wij regelen het, u geniet van het resultaat.' },
    ];
    const maakConcept = (sfeer, oneliner, subkop, hoek) => ({
      sfeer,
      oneliner,
      subkop,
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
      plan: basisPlan,
      succes_punten: [
        'Rust en zekerheid dat het goed geregeld is.',
        'Een resultaat waar u trots op bent.',
        'Tijd over voor de dingen die u leuk vindt.',
      ],
      fotos: { hero: `${lead.branche} ${hoek}`, a: `${lead.branche} detail`, b: `${lead.branche} werk`, c: `${lead.branche} resultaat`, portret: `${lead.branche} professional portrait` },
    });
    return {
      label: lead.branche,
      diensten: [
        { t: 'Onze dienst', d: 'Een korte omschrijving van wat we doen.' },
        { t: 'Tweede dienst', d: 'Nog een omschrijving van ons aanbod.' },
        { t: 'Derde dienst', d: 'En waar we verder mee kunnen helpen.' },
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
      concepten: {
        redactioneel: maakConcept('zand', 'Vakwerk dat rust uitstraalt.', `${lead.bedrijf} werkt met oog voor detail, zodat u kunt vertrouwen op een verzorgd resultaat.`, 'craft detail'),
        helder: maakConcept('warm', 'Gewoon goed geregeld, met een glimlach.', `${lead.bedrijf} staat voor u klaar met persoonlijke aandacht en duidelijke afspraken.`, 'people smiling'),
        zakelijk: maakConcept('blauw', 'Resultaat waar u op kunt bouwen.', `${lead.bedrijf} levert professioneel werk met heldere afspraken en meetbaar resultaat.`, 'professional workspace'),
      },
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
        max_tokens: 4000,
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
async function zoekFoto(term, breedte = 1400, reserveTerm = '') {
  const key = process.env.UNSPLASH_ACCESS_KEY;

  // fallback zonder sleutel: een kleur-placeholder (laadt altijd)
  if (!key) {
    return `https://placehold.co/${breedte}x${Math.round(breedte * 0.7)}/cccccc/666666?text=${encodeURIComponent(term)}`;
  }

  // één zoekpoging
  async function poging(q) {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=10&orientation=landscape&content_filter=high`;
    const res = await fetch(url, { headers: { Authorization: `Client-ID ${key}` } });
    if (!res.ok) {
      // 403 = uurlimiet bereikt; dat willen we duidelijk in de log zien
      console.log(`    ⚠ Unsplash gaf ${res.status} voor "${q}"${res.status === 403 ? ' (uurlimiet bereikt?)' : ''}`);
      return null;
    }
    const data = await res.json();
    const results = data.results || [];
    if (!results.length) return null;
    const hit = results[Math.floor(Math.random() * Math.min(results.length, 6))];
    return `${hit.urls.raw}&w=${breedte}&q=80&fit=crop`;
  }

  // Steeds bredere zoektermen proberen. Specifieke termen (vooral voor de hero)
  // leveren soms 0 resultaten; dan mag de foto niet wegvallen.
  const woorden = String(term).trim().split(/\s+/);
  const kandidaten = [
    term,                                    // volledige term
    woorden.slice(0, 3).join(' '),           // eerste 3 woorden
    woorden.slice(0, 2).join(' '),           // eerste 2 woorden
    reserveTerm,                             // branche-term als vangnet
    woorden[woorden.length - 1],             // laatste woord (vaak het onderwerp)
    'professional business',                 // laatste redmiddel: altijd resultaat
  ].filter((v, i, a) => v && a.indexOf(v) === i);

  for (const q of kandidaten) {
    try {
      const url = await poging(q);
      if (url) {
        if (q !== term) console.log(`    → foto gevonden via bredere term "${q}" (i.p.v. "${term}")`);
        return url;
      }
    } catch (e) {
      console.log(`    ⚠ Fout bij zoeken naar "${q}": ${e.message}`);
    }
  }

  // alles geprobeerd: neutrale grijze plaat zonder storende tekst
  console.log(`    ⚠ Geen enkele foto gevonden voor "${term}"`);
  return `https://placehold.co/${breedte}x${Math.round(breedte * 0.7)}/e8e6e1/e8e6e1?text=+`;
}

// ============================================================
// HOOFDFUNCTIE — genereer 3 concepten voor één lead
// ============================================================
async function genereerConcepten(lead, outDir = path.join(__dirname, 'output')) {
  console.log(`\n▶ Lead: ${lead.bedrijf} (${lead.branche})`);

  // 1+2. Claude: teksten + zoektermen (3 varianten in één antwoord)
  console.log('  • Claude: teksten en zoektermen voor 3 concepten...');
  const ai = await vraagClaude(lead);
  const KEYS = ['redactioneel', 'helder', 'zakelijk'];
  // veiligheidscheck: alle drie de concepten moeten er zijn
  for (const k of KEYS) {
    if (!ai.concepten || !ai.concepten[k]) throw new Error(`Antwoord mist concept "${k}"`);
  }
  // --- diagnose: per concept de kop + hero-zoekwoord, zodat drift zichtbaar is ---
  for (const k of KEYS) {
    console.log(`    → ${k}: "${ai.concepten[k].oneliner}" | hero: ${ai.concepten[k].fotos.hero}`);
  }

  // 3. foto's ophalen: 12 stuks (5 per concept), parallel
  console.log('  • Unsplash: 15 foto\'s ophalen (5 per concept)...');
  const fotoJobs = [];
  for (const k of KEYS) {
    const f = ai.concepten[k].fotos;
    fotoJobs.push(
      zoekFoto(f.hero, 1600, `${lead.branche} professional`),
      zoekFoto(f.a, 900, lead.branche),
      zoekFoto(f.b, 900, lead.branche),
      zoekFoto(f.c, 900, lead.branche),
      zoekFoto(f.portret || f.hero, 900, `${lead.branche} portrait`)
    );
  }
  const alleFotos = await Promise.all(fotoJobs);

  // kleurpalet per concept, met dedupe zodat de drie nooit dezelfde kleuren krijgen
  const paletFallback = { redactioneel: 'zand', helder: 'warm', zakelijk: 'blauw' };
  const gebruikteSferen = new Set();
  function kiesPalet(sfeer, key) {
    let s = PALETTEN[sfeer] ? sfeer : paletFallback[key];
    if (gebruikteSferen.has(s)) s = paletFallback[key];
    if (gebruikteSferen.has(s)) s = Object.keys(PALETTEN).find(x => !gebruikteSferen.has(x));
    gebruikteSferen.add(s);
    return PALETTEN[s];
  }

  // gedeelde gegevens + per concept een eigen data-object
  const gedeeld = {
    bedrijf: lead.bedrijf,
    label: ai.label,
    diensten: ai.diensten,
    faq: ai.faq || [],
    reviews: ai.reviews,
    usps: ai.usps || ['Gratis & vrijblijvend', 'Snelle reactie', 'Met garantie'],
    contact: lead.contact || {},
  };
  const dPer = {};
  KEYS.forEach((k, i) => {
    const c = ai.concepten[k];
    dPer[k] = {
      ...gedeeld,
      oneliner: c.oneliner,
      subkop: c.subkop,
      directe_cta: c.directe_cta || 'Neem contact op',
      transitionele_cta: c.transitionele_cta || 'Bekijk ons werk',
      probleem_titel: c.probleem_titel || 'Herkent u dit?',
      probleem_punten: c.probleem_punten || [],
      gids_empathie: c.gids_empathie || '',
      gids_autoriteit: c.gids_autoriteit || '',
      plan: c.plan || [],
      succes_punten: c.succes_punten || [],
      fotos: { hero: alleFotos[i * 5], a: alleFotos[i * 5 + 1], b: alleFotos[i * 5 + 2], c: alleFotos[i * 5 + 3], portret: alleFotos[i * 5 + 4] },
      ...kiesPalet(c.sfeer, k),
    };
  });

  // 4. templates vullen + wegschrijven
  console.log('  • Templates vullen en wegschrijven...');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const slug = lead.bedrijf.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const bestanden = {
    [`${slug}-1-redactioneel.html`]: templates.editorial(dPer.redactioneel),
    [`${slug}-2-helder.html`]: templates.vriendelijk(dPer.helder),
    [`${slug}-3-zakelijk.html`]: templates.zakelijk(dPer.zakelijk),
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
