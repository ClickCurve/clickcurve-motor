// ============================================================
// server.js — de ClickCurve motor als web-dienst (Render-klaar)
//
// Wat het doet:
//  - Luistert op een webadres (POST /genereer) naar Make.
//  - Ontvangt de leadgegevens (bedrijfsnaam, branche, omschrijving,
//    naam, email, telefoon).
//  - Roept de bestaande motor aan -> 3 concept-HTML's.
//  - Slaat die op in de publieke map /sites en serveert ze.
//  - Stuurt de 3 klikbare links als JSON terug naar Make.
//
// Zo koppelt Make: HTTP-module -> POST naar https://<jouw-app>.onrender.com/genereer
//
// Benodigde omgevingsvariabelen (zet je in Render, niet in code):
//  - ANTHROPIC_API_KEY
//  - UNSPLASH_ACCESS_KEY
//  - PUBLIC_BASE_URL   (bv. https://clickcurve-motor.onrender.com)
//  - WEBHOOK_TOKEN     (zelf verzonnen wachtwoord; Make stuurt dit mee)
// ============================================================

const express = require('express');
const fs = require('fs');
const path = require('path');
const { genereerConcepten } = require('./motor');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true })); // ook form-encoded aankunnen

// map waar de gegenereerde sites komen te staan (publiek bereikbaar)
const SITES_DIR = path.join(__dirname, 'sites');
if (!fs.existsSync(SITES_DIR)) fs.mkdirSync(SITES_DIR, { recursive: true });

// de sites publiek serveren op /sites/<bestand>.html
app.use('/sites', express.static(SITES_DIR));

// simpele statuscheck (handig om te zien of de dienst leeft)
app.get('/', (req, res) => {
  res.send('ClickCurve motor draait. Stuur een POST naar /genereer.');
});

// ---- de hoofdactie: lead binnen -> 3 concepten -> 3 links terug ----
app.post('/genereer', async (req, res) => {
  try {
    // 1) simpele beveiliging: Make moet het juiste token meesturen
    const token = req.headers['x-webhook-token'] || req.body.token;
    if (process.env.WEBHOOK_TOKEN && token !== process.env.WEBHOOK_TOKEN) {
      return res.status(401).json({ ok: false, fout: 'Ongeldig of ontbrekend token' });
    }

    // 2) leadgegevens uit het verzoek halen (namen = de Custom ID's uit Elementor)
    const b = req.body || {};
    const lead = {
      branche: b.branche || 'Onderneming',
      bedrijf: b.bedrijfsnaam || b.bedrijf || 'Uw bedrijf',
      omschrijving: b.omschrijving || '',
      contact: { email: b.email || '', telefoon: b.telefoon || '' },
    };
    if (!b.bedrijfsnaam || !b.branche) {
      return res.status(400).json({ ok: false, fout: 'bedrijfsnaam en branche zijn verplicht' });
    }

    // 3) de motor aanroepen -> schrijft 3 HTML-bestanden in SITES_DIR
    const paden = await genereerConcepten(lead, SITES_DIR);

    // 4) bestandsnamen omzetten naar publieke links
    const base = (process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const links = paden.map(p => `${base}/sites/${path.basename(p)}`);

    // 5) links teruggeven aan Make
    console.log(`✓ Concepten klaar voor ${lead.bedrijf}:`, links);
    res.json({
      ok: true,
      bedrijf: lead.bedrijf,
      branche: lead.branche,
      concept_1: links[0] || '',
      concept_2: links[1] || '',
      concept_3: links[2] || '',
      links,
    });
  } catch (e) {
    console.error('❌ Fout bij genereren:', e.message);
    res.status(500).json({ ok: false, fout: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ClickCurve motor luistert op poort ${PORT}`));
