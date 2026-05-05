# Prompt 02 — Extract Colombia regions to JSON

Run this in its own Claude Code session, after `01-extract-lexicon.md`.

---

Read `docs/research.md` section 2.1 and produce `seed/colombia-regions.json`.

**Schema:**
```json
{
  "zones": [
    {
      "id": "norte",
      "label": { "es": "Norte", "en": "North" },
      "altitude_band_masl": [1300, 1800],
      "typical_profile": { "es": "...", "en": "..." },
      "departments": [
        {
          "id": "santander",
          "label": { "es": "Santander", "en": "Santander" },
          "pdo": "Café de Santander",
          "notes": { "es": "...", "en": "..." }
        }
      ]
    }
  ]
}
```

Zone IDs must be exactly: `"norte"`, `"centro"`, `"sur"`, `"oriente"`.

Include all 23 producing departments grouped into the 4 zones from the research. The 6 regional PDOs to flag (set as the `pdo` string, otherwise `null`):
- Café de Cauca
- Café de Nariño
- Café de Huila
- Café de Tolima
- Café de Santander
- Café de la Sierra Nevada

For Santander specifically, add a `notes` string mentioning Charalá and shade-grown tradition (this is Pablo's primary use case at Finca Bellavista).

Output strictly valid JSON. Pretty-print with 2-space indent.
