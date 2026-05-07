# Origen / Colombia descriptors — open items

Notes from running `prompts/04-extract-origen-descriptors.md` against `docs/research.md` §2.8.

## Total: 20 entries from 16 source rows (15 covered, 1 omitted)

`seed/origen-descriptors.json` contains 20 entries derived from the 16 rows of the §2.8 table. The expansion comes from three split descriptors (each has two SCA parents, so each emits two entries per the prompt's `lulo_citrus` / `lulo_other_fruit` rule):

- `lulo` → `lulo_citrus`, `lulo_other_fruit` (Fruity → Citrus / Other Fruit)
- `lulada` (Lulada / lulo verde) → `lulada_green`, `lulada_other_fruit` (Green-Vegetative + Fruity → Other Fruit)
- `almibar` → `almibar_sweet`, `almibar_mouthfeel` (Sweet + Mouthfeel)

Two source rows that listed paired ES descriptors with a slash were emitted as two separate entries each, since they are distinct descriptors:

- "Tabaco rubio / Tabaco negro" → `tabaco_rubio` (mvp), `tabaco_negro` (phase 2). Different `closest_wcr_equivalent`: `tobacco` vs `pipe_tobacco`.
- "Miel de caña / Miel de abejas" → `miel_de_cana` (mvp), `miel_de_abejas` (phase 2). Both share parent `["sweet"]` and `closest_wcr_equivalent: honey`, but the §2.8 note explicitly says to "distinguish from honey (bee)".

## Omitted: "Café de oro / Limpieza"

The §2.8 table marks this as "Concept (not CATA)". The prompt's hard validation rule says `parent_cata_path` must match a `cata_path` that exists in `seed/lexicon.json`, and `closest_wcr_equivalent` must match an `attribute_id`. There is no CATA parent for a clean-cup quality concept, and no WCR attribute for it either, so emitting this descriptor would necessarily fail the verifier.

It is intentionally omitted from `seed/origen-descriptors.json`. It belongs in a future "Concepts" surface alongside the WCR Amplitude entries (Overall Impact, Blended, Longevity, Body/Fullness — see `notes/lexicon-todos.md`). When that surface is built, `cafe_de_oro` should ship with `section: ["concept"]` and `cata_path: ["concept"]`, and the lexicon's allowed-section list should be extended to match (mirroring the `amplitude` precedent).

## Closest-WCR mapping calls

Several mappings required a judgment because the §2.8 table uses informal CATA category labels rather than exact WCR attribute IDs. Documenting them here so they can be reviewed:

| Descriptor | `closest_wcr_equivalent` | Why |
|---|---|---|
| `panela` | `brown_sugar` | §2.8 row says "closest = Brown Sugar / Molasses". Picked `brown_sugar` over `molasses` because the §2.8 prose emphasises "Iconic Colombian sweetness; floral + vanilla accents", which reads closer to the brown-sugar profile than to the deeper, smokier molasses. |
| `bocadillo`, `guanabana`, `curuba`, `maracuya`, `tomate_de_arbol`, `lulada_other_fruit`, `lulo_other_fruit` | `other_fruit` | All fall under WCR's Fruity → Other Fruit bucket. The lexicon does not carry per-fruit WCR attributes for these. |
| `lulo_citrus` | `citrus_fruit` | Maps to the WCR Citrus Fruit head attribute, since lulo's citric reading isn't specifically lemon / orange / lime. |
| `mora` | `blackberry` | Direct equivalence (Andean mora de Castilla = blackberry per §1.5). |
| `mortino` | `blueberry` | §2.8 says "Closest to Blueberry but more astringent". |
| `aguardiente` | `alcohol` | Mapped to the WCR Alcohol head attribute under sour-fermented. |
| `tabaco_rubio` | `tobacco` | Light-cured tobacco maps cleanly to the WCR Tobacco attribute. |
| `tabaco_negro` | `pipe_tobacco` | The lexicon's two tobacco attributes are `tobacco` and `pipe_tobacco`; the darker, more resinous reading lines up with pipe_tobacco. |
| `achiote` | `spice_brown` | §2.8 says "Spice → Brown spice". The lexicon attribute is `spice_brown` with `cata_path: ["spice"]`. |
| `miel_de_cana`, `miel_de_abejas` | `honey` | Both share the WCR Honey attribute. The descriptor labels carry the cane-vs-bee distinction. |
| `almibar_sweet` | `maple_syrup` | The lexicon does not have a generic `syrup` attribute under sweet; `maple_syrup` is the closest WCR sweet-syrup attribute. Keep an eye on this — if a Spanish-CVA reviewer prefers `caramelised` or `molasses` instead, swap. |
| `almibar_mouthfeel` | `smooth` | The lexicon's `smooth` attribute is glossed "Smooth (Velvety/Silky/Syrupy)" — the syrupy reading covers almíbar's mouthfeel. |
| `lulada_green` | `green` | Mapped to the head `green` attribute under `green_vegetative`; the more specific `under_ripe` was a close runner-up. |

## Parent-CATA-path convention

The prompt's schema example shows `parent_cata_path: ["sweet", "brown_sugar"]`, but in `seed/lexicon.json` the brown_sugar entry has `cata_path: ["sweet"]` (CATA paths stop at the SCA group level — the leaf is the attribute_id, not part of the path). The verifier rule "must match a `cata_path` that exists in `seed/lexicon.json`" therefore takes precedence, and `parent_cata_path` is set to the GROUP-level path that the WCR equivalent lives under. The leaf is captured in `closest_wcr_equivalent` instead.

If a future reviewer prefers the example convention (path includes the leaf), the lexicon would need to be denormalised so each attribute carries its own leaf-inclusive `cata_path`, and the verifier updated to match.

## Spanish strings

Definitions are working coffee-trade Spanish, not from an SCA Spanish CVA source. Per `PRODUCT.md` §"Validation criteria for done", these should be reviewed against the SCA Spanish CVA materials and Colombian producer-facing usage before shipping. Specific things to check:

- "Almíbar" — is it understood the same way in Huila vs. Santander vs. Antioquia? Definition currently leans on the Huila usage from §2.8.
- "Aguardiente" — anise spirit reading is correct, but the current definition pairs it specifically with "anaeróbicos sobrefermentados". Confirm with producers whether that's a fair shorthand or unnecessarily narrow.
- Diacritic-stripped IDs (`mortino`, `guanabana`, `maracuya`, `miel_de_cana`, `tomate_de_arbol`, `almibar_*`) follow the lexicon's ASCII snake_case convention. The user-facing `labels.es` retain the diacritics correctly.

## MVP set

The 10 source-row MVP descriptors expand to 12 entries because of the two MVP-row splits (lulo → 2, almíbar → 2):

```
panela, bocadillo, lulo_citrus, lulo_other_fruit, guanabana, mora,
mortino, curuba, tabaco_rubio, miel_de_cana, almibar_sweet, almibar_mouthfeel
```

When the UI ships the MVP set as nested CATA suggestions, both halves of each split should appear under their respective parent boxes (Lulo under both Citrus and Other Fruit; Almíbar under both Sweet and Mouthfeel).
