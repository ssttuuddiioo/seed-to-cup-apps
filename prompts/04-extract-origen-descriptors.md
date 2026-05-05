# Prompt 04 — Extract the Origen / Colombia descriptor pack

Run this in its own Claude Code session, after `03-extract-varieties-processes.md`.

This prompt depends on `seed/lexicon.json` already existing — it cross-references parent CATA paths.

---

Read `docs/research.md` section 2.8 and produce `seed/origen-descriptors.json`.

**Schema:**
```json
[
  {
    "id": "panela",
    "labels": { "es": "Panela", "en": "Panela (unrefined cane sugar)" },
    "parent_cata_path": ["sweet", "brown_sugar"],
    "definition": { "es": "...", "en": "..." },
    "closest_wcr_equivalent": "brown_sugar",
    "mvp": true
  }
]
```

Include all 16 descriptors from the table in 2.8. Mark `mvp: true` for the 10 highest-priority ones called out at the end of that section:
- panela
- mora
- lulo
- guanábana
- bocadillo
- mortiño
- curuba
- tabaco rubio
- almíbar
- miel de caña

**Validation:**
The `parent_cata_path` must match a `cata_path` that exists in `seed/lexicon.json`, and `closest_wcr_equivalent` must match an `attribute_id` from that file. Verify each one before writing the file.

If a descriptor has no clean SCA parent (e.g. lulo doesn't fit cleanly under citrus OR other fruit), put it under both by emitting two entries with different parent paths but the same `id` suffixed (`lulo_citrus`, `lulo_other_fruit`), and note in `notes/origen-descriptors-todos.md`.

Output strictly valid JSON. Pretty-print with 2-space indent.
