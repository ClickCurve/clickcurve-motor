// ============================================================
// server.js — ClickCurve motor als web-dienst (Render + Cloudflare R2)
//
// Wat het doet:
//  - Luistert op POST /genereer (aangeroepen door Make).
//  - Roept de motor aan -> 3 concept-HTML's (tijdelijk op schijf).
//  - Uploadt die 3 pagina's naar Cloudflare R2 (blijvende opslag).
//  - Geeft de 3 publieke R2-links terug aan Make.
//
// Waarom R2: Render's schijf is tijdelijk en wordt bij herstart/
// spin-down gewist. R2 is blijvend, dus links werken altijd.
//
// Omgevingsvariabelen (in Render instellen):
//  Motor:
//   - ANTHROPIC_API_KEY
//   - UNSPLASH_ACCESS_KEY
//   - WEBHOOK_TOKEN            (zelf verzonnen wachtwoord)
//  Cloudflare R2:
//   - R2_ACCOUNT_ID            (Cloudflare account-ID)
//   - R2_ACCESS_KEY_ID         (R2 API-token: Access Key ID)
//   - R2_SECRET_ACCESS_KEY     (R2 API-token: Secret Access Key)
//   - R2_BUCKET                (naam van je bucket, bv. clickcurve-concepten)
//   - R2_PUBLIC_BASE_URL       (publieke URL van de bucket, bv.
//                               https://pub-xxxx.r2.dev  of je eigen domein)
// ============================================================

const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { genereerConcepten } = require('./motor');
const {
  S3Client,
  PutObjectCommand,
} = require('@aws-sdk/client-s3');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ---- Cloudflare R2 client (praat via de S3-standaard) ----
const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});
const R2_BUCKET = process.env.R2_BUCKET;
const R2_PUBLIC = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '');

function r2Klaar() {
  return process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY && R2_BUCKET && R2_PUBLIC;
}

// statuscheck
app.get('/', (req, res) => {
  res.send('ClickCurve motor draait. Stuur een POST naar /genereer.');
});

// ---- hoofdactie ----
app.post('/genereer', async (req, res) => {
  try {
    // 1) token-check
    const token = req.headers['x-webhook-token'] || req.body.token;
    if (process.env.WEBHOOK_TOKEN && token !== process.env.WEBHOOK_TOKEN) {
      return res.status(401).json({ ok: false, fout: 'Ongeldig of ontbrekend token' });
    }

    // 2) leadgegevens
    const b = req.body || {};

    // Bescherming: als een mapping in Make kapot is, stuurt Make de letterlijke
    // placeholder mee (bv. "{{2.fields.bedrijfnaam}}"). Die mag NOOIT op een
    // conceptpagina belanden. Zulke waarden behandelen we als leeg.
    const schoon = (v) => {
      const s = String(v == null ? '' : v).trim();
      if (!s) return '';
      // herkent {{...}}, {...}, losse "fields.xxx" of "N.fields.xxx"
      if (/\{\{|\}\}/.test(s)) return '';
      if (/^\{.*\}$/.test(s)) return '';
      if (/\b\d*\.?fields\.[a-z_]+/i.test(s)) return '';
      return s;
    };

    const lead = {
      branche: schoon(b.branche) || 'Onderneming',
      bedrijf: schoon(b.bedrijfsnaam) || schoon(b.bedrijf) || 'Uw bedrijf',
      omschrijving: schoon(b.omschrijving),
      contact: { email: schoon(b.email), telefoon: schoon(b.telefoon) },
    };

    // verplichte velden controleren NA het schoonmaken, zodat kapotte
    // mappings een duidelijke fout geven in plaats van een rare pagina
    if (!schoon(b.bedrijfsnaam) || !schoon(b.branche)) {
      console.error('❌ Ongeldige invoer ontvangen:', JSON.stringify({ bedrijfsnaam: b.bedrijfsnaam, branche: b.branche }));
      return res.status(400).json({
        ok: false,
        fout: 'bedrijfsnaam en branche zijn verplicht en mogen geen onopgeloste Make-placeholder bevatten. Controleer de mapping in de HTTP-module.',
        ontvangen: { bedrijfsnaam: b.bedrijfsnaam, branche: b.branche },
      });
    }
    if (!r2Klaar()) {
      return res.status(500).json({ ok: false, fout: 'R2 is niet (volledig) geconfigureerd. Controleer de R2_* omgevingsvariabelen in Render.' });
    }

    // 3) motor aanroepen -> 3 HTML's in een tijdelijke, unieke map
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cc-'));
    const paden = await genereerConcepten(lead, tmpDir);

    // 4) elke pagina naar R2 uploaden onder een unieke, nette sleutel
    //    map per aanvraag zodat namen nooit botsen: sites/<uniek>/<bestand>.html
    const groep = `${slug(lead.bedrijf)}-${crypto.randomBytes(4).toString('hex')}`;
    const links = [];
    for (const p of paden) {
      const bestand = path.basename(p);
      const key = `sites/${groep}/${bestand}`;
      const html = fs.readFileSync(p, 'utf8');
      await R2.send(new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: html,
        ContentType: 'text/html; charset=utf-8',
        CacheControl: 'public, max-age=31536000',
      }));
      links.push(`${R2_PUBLIC}/${key}`);
    }

    // 5) tijdelijke map opruimen (R2 heeft de bestanden nu)
    fs.rmSync(tmpDir, { recursive: true, force: true });

    // 6) links teruggeven aan Make
    console.log(`✓ Concepten op R2 voor ${lead.bedrijf}:`, links);
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
    console.error('❌ Fout bij genereren:', e);
    res.status(500).json({ ok: false, fout: e.message });
  }
});

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'bedrijf';
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ClickCurve motor luistert op poort ${PORT}`));
