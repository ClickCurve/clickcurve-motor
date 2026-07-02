# ClickCurve concept-motor

Genereert per lead 3 losse HTML-concept-websites, met echte foto's per branche
en door Claude geschreven teksten. Output = 3 zelfstandige HTML-bestanden die je
direct kunt openen of als link kunt versturen.

## Hoe het werkt (per lead)

1. **Lead binnen** — branche, bedrijfsnaam, korte omschrijving (uit het formulier).
2. **Claude** vertaalt de branche naar Engelse foto-zoektermen én schrijft de
   teksten (tagline, intro, 3 diensten, 2 reviews) en kiest een kleurensfeer.
3. **Unsplash** levert echte foto's op die zoektermen.
4. **3 templates** (Editorial, Vriendelijk, Bold) worden gevuld → 3 HTML-bestanden.

Dit lost het "elke branche moet werken"-punt op: ook een glazenwasser of
hondentrimmer krijgt automatisch passende foto's, zonder vooraf klaargezette set.

## Eenmalig instellen

1. Zorg dat Node.js 18+ is geïnstalleerd (`node --version`).
2. Kopieer `.env.example` naar `.env` en vul je twee sleutels in:
   - `ANTHROPIC_API_KEY` — via console.anthropic.com (kost een paar cent per lead)
   - `UNSPLASH_ACCESS_KEY` — gratis via unsplash.com/developers
3. Klaar.

## Testen

```bash
# laad .env en draai een testlead
node -r dotenv/config motor.js "Glazenwasser" "Helder Glas"
```

(Of zonder dotenv: zet de variabelen in je shell.)
De 3 bestanden verschijnen in `output/`. Open ze in je browser.

> Zonder sleutels draait de motor in demo-modus: nette placeholder-teksten en
> grijze foto-vakken, zodat je de templates altijd kunt zien.

## Koppelen aan de funnel (later)

De functie `genereerConcepten(lead)` is wat Make straks aanroept:
- input: `{ branche, bedrijf, omschrijving, contact:{email,telefoon} }`
- output: 3 bestandspaden (klaar om te uploaden naar je preview-hosting)

## Bestanden

- `motor.js` — de motor (Claude + Unsplash + wegschrijven)
- `templates.js` — de 3 HTML-templates
- `.env.example` — voorbeeld voor je sleutels
- `output/` — hier verschijnen de gegenereerde sites
