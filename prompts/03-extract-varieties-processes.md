# Prompt 03 — Extract varieties and processes to JSON

Run this in its own Claude Code session, after `02-extract-colombia-regions.md`.

---

Read `docs/research.md` sections 2.2 and 2.3, and produce two files.

## `seed/colombia-varieties.json`

```json
[
  {
    "id": "castillo",
    "labels": { "es": "Castillo", "en": "Castillo" },
    "parentage": "Caturra × Timor Hybrid",
    "released_by": "Cenicafé",
    "released_year": 2005,
    "rust_resistant": true,
    "cup_profile": { "es": "...", "en": "..." },
    "notes": { "es": "...", "en": "..." },
    "mvp": true
  }
]
```

Include all 16 varieties from section 2.2. Mark `mvp: true` for the first 8:
- Castillo
- Caturra
- Variedad Colombia
- Tabi
- Cenicafé 1
- Bourbon
- Pink Bourbon
- Geisha

For Pink Bourbon, include the genetic note from caveat #9 in the research doc — it is not actually a Bourbon, it's a misnamed Ethiopian landrace per Café Imports / RD2 Vision 2023 genetic testing.

## `seed/colombia-processes.json`

```json
[
  {
    "id": "lavado",
    "labels": { "es": "Lavado", "en": "Washed" },
    "description": { "es": "...", "en": "..." },
    "typical_fermentation_hours": [12, 36],
    "mvp": true
  }
]
```

Include all ~12 processes from section 2.3. Mark `mvp: true` for:
- lavado
- honey
- natural
- anaeróbico
- choque térmico
- co-fermentación

For processes without a typical fermentation range (e.g. natural), use `null` for `typical_fermentation_hours`.

Output both files as strictly valid JSON. Pretty-print with 2-space indent.
