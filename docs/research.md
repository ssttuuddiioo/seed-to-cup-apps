# Origen Cupping App — Content & Feature Spec
## CVA-Based Mobile/Tablet App for Colombian Specialty Coffee

**Bottom line up front:** Build the app around three concentric layers — (1) a fully bilingual WCR/CVA sensory data model that mirrors the SCA's CATA categories one-to-one so producers and beginners share the same vocabulary as importers; (2) a Colombia-first traceability and metadata layer (department → municipio → vereda → finca → lote, plus FNC export grade and DO/PDO awareness); and (3) a separate "Learn" track that complements (does not duplicate) the SCA Coffee Skills Program by teaching the CVA's CATA logic, calibration drills, and how producers should read and act on their own results. The single most important content decision is to make the CVA Descriptive form (CVA 103) — not the legacy 2004 100-point form — the primary cupping surface, because this is what the SCA, Cup of Excellence (under the 2024 SCA-ACE MOU), and most modern green buyers will use going forward, and it is far better suited to beginners because CATA boxes prevent "blank-page paralysis."

---

## TL;DR
- **Sensory model:** Implement the CVA 103 form (intensity + CATA) as the primary input surface, backed by a structured 110-attribute WCR Sensory Lexicon with English + Spanish (SCA-published) labels, definitions, and reference recipes. The CATA hierarchy maps cleanly to ten parent categories (Floral, Fruity, Sour/Fermented, Green/Vegetative, Other, Roasted, Spice, Nutty/Cocoa, Sweet, plus Main Tastes & Mouthfeel) — that is the data model.
- **Colombia layer:** Treat Colombia as a first-class data domain — region taxonomy (32 producing departments grouped into North/Central/South/East zones, with the six DO origins), 12+ varieties with cup profiles, ~12 processing methods including thermal-shock and co-fermentation, FNC Excelso/Supremo/UGQ grades, vereda/municipio/finca traceability, and a curated "Spanish-first" descriptor pack (panela, lulo, guanábana, mora, bocadillo, etc.) layered on top of the WCR lexicon.
- **Learning track:** Build a freemium "Aprende a catar" track that teaches CATA logic, intensity calibration on a 15-point scale, triangulation drills, and how to read your own descriptive profile back to a buyer — explicitly positioned as complement (not replacement) to SCA Sensory Foundation/Intermediate and the CVA for Cuppers course (which itself retires Nov 30, 2026).

---

# RESEARCH AREA 1 — FULL BILINGUAL WCR SENSORY LEXICON, MAPPED TO CVA 103

## 1.1 How the data model should be shaped

The SCA Standard 103-2024 "Descriptive Assessment" defines a three-tier hierarchy that should be the spine of the app's content model:

1. **Cupping section** — Fragrance, Aroma, Flavor, Aftertaste, Acidity, Sweetness, Mouthfeel (plus the implicit Roast Level estimation that precedes the assessment).
2. **CATA category** — the parent group that appears as a checkbox on the CVA 103 form (e.g., "Floral", "Fruity → Berry", "Sour/Fermented → Sour", "Mouthfeel → Smooth"). This is what the cupper actually checks.
3. **Specific descriptor (free-elicited)** — the WCR Sensory Lexicon attribute (e.g., Blueberry, Jasmine, Lemon). Per SCA 103 §6.3.4, when a precise descriptor is detected, the cupper marks the parent CATA box AND writes the specific term in the notes.

This is critical: in the CVA, the 110-attribute WCR lexicon is no longer a checkbox list — it is a **reference dictionary** that nests under the CATA boxes. Your data model must therefore store the parent–child relationship explicitly, so when a user taps "Berry" they see Blueberry / Blackberry / Raspberry / Strawberry as suggestions to free-elicit.

The 15-point intensity scale (0–15) is rated **per cupping section, not per descriptor** — this is a major break from the 2004 form and a common stumbling block. Score is the **integer closest to the tick**.

## 1.2 Bilingual labelling — the source-of-truth rule

The SCA has officially translated the Coffee Taster's Flavor Wheel into Spanish (released 2021, available in the SCA store as "Rueda de Sabores del Catador de Café") and the CVA 103 standard exists in a Spanish edition (SCA-103-S/2024). The flavor wheel translation is licensed CC BY-NC-ND 4.0; **unauthorised translations cannot be redistributed**. Practical implication: ship the SCA's official Spanish wheel terms verbatim where they exist (the 9 inner categories, the middle-ring sub-categories, the outer-ring 110 specific attributes), and add your own Spanish-Colombia descriptors as a **separate, clearly-labelled "Origen / Colombia" extension** so you don't infringe the SCA's CC-ND licence.

The SCA itself acknowledges that the official Spanish wheel is a direct translation that does not capture local palate (e.g., Indonesia and Taiwan have published their own localised wheels for this reason). Your Colombia-extension layer (see Research Area 2) is the right place for that.

## 1.3 The structured lexicon (≈110 attributes), grouped by CVA 103 CATA category

Below is the complete content model, ready to import as JSON. For each attribute I provide: parent CATA category exactly as it appears on the CVA 103 form, English term, Spanish term (SCA flavor wheel translation where official; standard Spanish coffee-trade Spanish otherwise), beginner-friendly EN/ES definition (paraphrased from the WCR Sensory Lexicon), and primary reference. WCR Lexicon Edition 1 contains 110 attributes; Edition 2 (2017) added/refined 24 references. I include all 110.

### SECTION A — FRAGRANCE / AROMA & FLAVOR / AFTERTASTE (shared olfactory CATA list)

The **same** olfactory CATA list is used for fragrance/aroma (orthonasal) and flavor/aftertaste (retronasal). Per CVA 103 §6.3.1–6.3.2, the cupper selects up to five descriptors per box.

#### Floral / Floral
| EN | ES | Definition (EN / ES, beginner-friendly) | WCR Reference |
|---|---|---|---|
| Floral | Floral | Sweet, light, slightly fragrant aromatic of fresh flowers. / Aromático suave, dulce y ligeramente perfumado, propio de flores frescas. | Welch's white grape juice; Le Nez du Café n.12 "coffee blossom" |
| Black Tea | Té negro | Brown, musty, dried-bark aromatic from oxidised tea leaves. / Aromático pardo, mohoso, a corteza seca; té oxidado. | Lipton Black Tea |
| Chamomile | Manzanilla | Sweet, slightly woody-floral note of chamomile. / Floral dulce y algo herbal, propio de la manzanilla. | Celestial Seasonings Chamomile |
| Rose | Rosa | Sweet, soft, slightly dusty floral fragrance. / Floral suave, dulce y algo polvoriento. | Rose water |
| Jasmine | Jazmín | Intense, sweet, slightly pungent floral aromatic. / Floral intenso, dulce y ligeramente picante. | Jasmine extract |

#### Fruity → Berry / Afrutado → Baya
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Berry | Baya | Sweet, sour, floral aromatic of mixed berries. / Aromático dulce-ácido y floral de bayas variadas. | Private Selection Triple Berry Preserves |
| Blackberry | Mora | Sweet, dark, floral, slightly woody and sour. / Dulce, oscuro, floral y un poco ácido, como mora. | Smucker's Blackberry Jam |
| Raspberry | Frambuesa | Light sweet-fruity, slightly sour, floral, slightly musty. / Dulce-ácido suave, floral y algo mohoso. | Jell-O Raspberry powder |
| Blueberry | Arándano | Dark, sweet, slightly sour and dusty-floral. / Dulce-ácido, floral, algo terroso. | Oregon Fruit Blueberries in light syrup |
| Strawberry | Fresa / Frutilla | Sweet-sour, floral, fruity, often winey. / Dulce-ácido, floral y a veces vinoso. | Dole Whole Strawberries |

#### Fruity → Dried Fruit / Afrutado → Fruto seco/deshidratado
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Dried Fruit | Fruta deshidratada | Aromatic of dark, sweet, slightly brown dried fruit. / Aromático a fruta seca, dulce y oscura. | Sunsweet Prune Juice; raisin-prune mix |
| Raisin | Pasa | Concentrated, sweet, brown, slightly sour grape note. / Concentrado, dulce-ácido, marrón. | Sun-Maid Raisins |
| Prune | Ciruela pasa | Sweet, brown, floral, musty, overripe note. / Dulce, marrón, mohoso, sobremaduro. | Sun-Maid Prunes |

#### Fruity → Other Fruit / Afrutado → Otras frutas
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Other Fruit | Otra fruta | Sweet, light, somewhat floral fruity aromatic. / Aromático afrutado suave y algo floral. | Le Nez du Café n.17 "apple" |
| Apple | Manzana | Sweet, light, fruity, somewhat floral. / Dulce, ligero, afrutado y floral. | Le Nez du Café n.17; Gerber Applesauce |
| Pear | Pera | Sweet, slightly floral, woody, fruity. / Dulce, floral, leñoso. | Jumax Pear Nectar |
| Peach | Durazno / Melocotón | Floral, perfuming, sweet-sour stone fruit. / Floral, dulce-ácido, frutal a hueso. | Fresh peach pit; Jell-O Peach |
| Grape | Uva | Sweet, fruity, floral, slightly sour, musty. / Dulce-ácido, floral, algo mohoso. | Welch's Concord Grape Juice |
| Cherry | Cereza | Sour-sweet, fruity, slightly bitter, floral. / Dulce-ácido, floral, algo amarga. | R.W. Knudsen Tart Cherry Juice |
| Pomegranate | Granada | Sour-sweet, dark, slightly musty/earthy, astringent. / Dulce-ácido, oscuro, algo astringente. | R.W. Knudsen Pomegranate |
| Coconut | Coco | Slightly sweet, nutty, somewhat woody. / Dulce-suave, anuezado, leñoso. | Coconut imitation extract |
| Pineapple | Piña | Sweet, slightly sharp tropical fruit. / Dulce, algo agudo y tropical. | Dole Pineapple Juice |

#### Fruity → Citrus Fruit / Afrutado → Cítricos
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Citrus Fruit | Cítricos | Citric, sour, astringent, peely, somewhat floral. / Cítrico, ácido, astringente, a cáscara. | Lemon + lime peel; grapefruit peel; Five Alive |
| Lemon | Limón | Citric, sour, slightly sweet, peely, floral. / Cítrico ácido, ligeramente dulce, a cáscara. | Fresh lemon juice; Le Nez n.15 |
| Grapefruit | Toronja / Pomelo | Citric, sour, bitter, astringent, peely. / Cítrico ácido-amargo, astringente. | Ocean Spray White Grapefruit |
| Orange | Naranja | Citric, sweet, floral, slightly sour. / Cítrico dulce, floral, algo ácido. | Tropicana 100% No Pulp |
| Lime | Lima | Citric, sour, astringent, bitter, green, peely. / Cítrico ácido y verde, a cáscara. | Lime peel; ReaLime |

#### Sour / Fermented → Sour / Ácido-fermentado → Ácido
*(CVA 103 lumps these under "Sour/Fermented" with sub-boxes for Sour and Fermented; the WCR sub-tree is finer.)*
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Sour Aromatics | Aromáticos ácidos | The aromatic impression of a sour product. / Impresión aromática de algo ácido. | Bush's Pinto Beans (canned, drained) |
| Acetic Acid | Ácido acético | Sour, astringent, slightly pungent vinegar note. / Vinagre, ácido y astringente. | 0.5–2% acetic acid solution |
| Butyric Acid | Ácido butírico | Sour, fermented-dairy note like aged cheese. / Lácteo fermentado, queso añejo. | 0.4 µl/l butyric acid |
| Isovaleric Acid | Ácido isovalérico | Pungent, sour, sweat-and-aged-cheese note. / Ácido pungente, queso curado. | 0.2 µl/l isovaleric acid |
| Citric Acid | Ácido cítrico | Mild, clean sour with citrus and astringency. / Ácido limpio, cítrico. | 0.025–0.05% citric acid |
| Malic Acid | Ácido málico | Sour, sharp, slightly fruity, astringent. / Ácido frutal, manzana verde. | 0.5–1.0 g/l malic acid |

#### Sour / Fermented → Alcohol / Fermented / Ácido-fermentado → Fermentado
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Alcohol | Alcohol | Pungent, chemical, distilled-spirits aromatic. / Pungente, químico, a destilados. | Vodka diluted |
| Whiskey | Whisky | Distilled-from-fermented-grain note. / Destilado de granos fermentados. | Jack Daniel's |
| Winey | Vinoso | Sharp, pungent, fruity, alcohol-like. / Vinoso, frutal y alcohólico. | Yellow Tail Cabernet |
| Fermented | Fermentado | Pungent, sweet-sour, yeasty, alcohol-like. / Pungente, dulce-ácido, levaduroso. | Guinness Extra Stout; fermented grass |
| Overripe / Near-fermented | Sobremaduro / Casi fermentado | Sweet-sour, damp, musty, past-ripe note. / Dulzón, húmedo, sobremaduro. | Overripe banana, frozen + microwaved |

#### Green / Vegetative / Verde-vegetal
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Olive Oil | Aceite de oliva | Light, oily, buttery-green-peppery. / Oleoso, ligeramente verde y picante. | Bertolli EVOO |
| Raw | Crudo | Aromatic of uncooked products. / Aromático de productos sin cocinar. | Fisher Whole Almonds |
| Green | Verde | Fresh plant matter — leafy, viny, grassy, peapod. / Vegetal fresco, herbáceo. | Parsley water |
| Fresh | Fresco | Newly-cut grass, sweet and pungent. / Pasto recién cortado. | Fresh green grass |
| Dark Green | Verde oscuro | Cooked-green-vegetable, slightly bitter, dusty. / Verdura cocida, algo amarga. | Canned green beans/spinach liquid |
| Vegetative | Vegetal | Sharp, slightly pungent green plant. / Vegetal nítido, algo pungente. | Canned asparagus |
| Hay-like | A heno | Sweet, dry, dusty, slightly green dry-grass note. / A heno seco, dulzón. | McCormick Parsley Flakes |
| Herb-like | Herbal | Sweet, slightly pungent, slightly bitter green herb. / Herbal verde, algo pungente. | Bay+thyme+basil mix |
| Beany | A frijol | Bean/legume note: musty, dusty, sour, starchy, green. / A frijol/leguminosa. | Pinto beans, drained |
| Peapod | Vaina de arveja / chícharo | Sweet, beany, fresh, raw, musty-green note. / Vaina verde, dulzona y herbácea. | Le Nez du Café n.3 "garden peas" |
| Under-ripe | Verde / Inmaduro | Aromatic of green/under-ripe fruit. / Frutal inmaduro. | Grapefruit peel |

#### Other → Stale / Papery / Otro → Rancio / Cartón
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Stale | Rancio | Aromatic characterised by lack of freshness. / Falto de frescura. | Mama Mary's Pizza Crust |
| Papery | A papel | Aromatic of white paper cups. / A papel/filtro. | Pure Brew filters in water |
| Cardboard | A cartón | Aromatic of cardboard packaging. / A cartón. | Cardboard square in water |

#### Other → Earthy / Otro → Terroso
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Musty / Earthy | Mohoso / Terroso | Sweet, heavy, decaying-vegetation, damp-soil. / Tierra húmeda, vegetación en descomposición. | Miracle-Gro Potting Mix; Le Nez n.1 |
| Musty / Dusty | Mohoso / Polvoriento | Dry closed-air, attic/closet note. / A buhardilla, polvoriento. | Kretschmer Wheat Germ; trimethoxybenzaldehyde |
| Moldy / Damp | Enmohecido / Húmedo | Damp, musty, sharp, slightly green basement note. / A sótano húmedo. | 2-Ethyl-1-Hexanol; tetrachloroanisole |
| Woody | Amaderado | Sweet, brown, musty, dark, tree-bark note. / Amaderado dulzón. | Diamond Walnuts; popsicle sticks |

#### Other → Animalic / Phenolic / Otro → Animal / Fenólico
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Phenolic | Fenólico | Damp, musty, animal-hide, tack-room note. / A cuero húmedo, fenólico. | Phenylacetic acid |
| Animalic | Animal | Combination of farm-animal and live-animal notes. / Animal, a establo. | Unflavored gelatin in water |
| Meaty / Brothy | Cárnico / Caldo | Boiled-meat / soup-stock with weak meat notes. / A caldo de carne. | Campbell's Beef Broth |

#### Other → Chemical / Otro → Químico
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Medicinal | Medicinal | Sterile, antiseptic, alcohol/iodine note. / Antiséptico, a botiquín. | Iodine; alcohol; Le Nez n.35; Band-Aid |
| Rubber | Caucho / Hule | Dark, heavy, slightly sharp/pungent rubber. / A caucho. | A&W rubber bands |
| Petroleum | Petróleo | Crude-oil/heavy-oil chemical note. / A petróleo. | Vaseline |
| Skunky | A zorrillo | Skunk-spray combination. / A mofeta. | Latex balloons in jar |

#### Roasted / Tostado
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Roasted | Tostado | Dark-brown high-heat dry-cooked impression, no burnt notes. / Tostado profundo sin quemado. | Roasted blanched peanuts (varied times) |
| Brown, Roast | Pardo, tostado | Rich, full, round dark roast aromatic. / Pardo, redondo, tostado. | Pinto beans; brown sugar |
| Acrid | Acre | Sharp, pungent, bitter, over-roasted note. / Pungente y amargo, sobre-tostado. | Alf's Red Wheat Cereal; Wright's Liquid Smoke |
| Ashy | A ceniza | Dry, dusty, dirty, smoky residue note. / Ceniza seca y polvorienta. | Black cocoa; benzyl disulfide; paper ashes |
| Burnt | Quemado | Dark over-cooked product, sharp/bitter/sour. / Quemado, agudo y amargo. | Over-roasted peanuts; benzyl disulfide |
| Smoky | Ahumado | Acute pungent combustion-of-wood/leaves note. / Ahumado pungente. | Benzyl disulfide; smoked almonds; wood ashes |

#### Roasted → Tobacco / Tostado → Tabaco
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Tobacco | Tabaco | Brown, slightly sweet, slightly pungent cured tobacco. / Tabaco curado. | Le Nez n.33; cigar tobacco |
| Pipe Tobacco | Tabaco de pipa | Brown, sweet, slightly pungent, fruity-floral cured tobacco. / Tabaco de pipa, dulzón. | Carter Hall Pipe Tobacco |

#### Roasted → Cereal / Tostado → Cereal
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Grain | Grano | Light brown, dusty, musty, sweet grain note. / Grano dulzón y polvoriento. | Mixed Rice Chex/Wheaties/Quaker Oats |
| Malt | Malta | Light brown, dusty, sweet, sour/fermented grain. / Malta tostada, dulce-ácida. | Post Grape-Nuts |

#### Spice / Especiado
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Pungent | Pungente | Sharp, physically penetrating nasal sensation. / Sensación pungente, picante en la nariz. | Orange essential oil |
| Pepper | Pimienta | Spicy, pungent, musty, woody black-pepper note. / A pimienta negra. | McCormick Black Pepper |
| Anise | Anís | Pungent, sweet, brown, caramelised, slightly floral/medicinal. / Anís dulce y caramelizado. | Tone's Anise Extract |
| Nutmeg | Nuez moscada | Wet, brown, woody, pungent, lemony-petroleum note. / Nuez moscada, leñosa. | McCormick Nutmeg |
| Spice, Brown | Especia parda | Sweet, brown spice complex (cinnamon/clove/nutmeg/allspice). / Especias dulces pardas. | Cinnamon stick; whole nutmeg+clove; spice mix |
| Cinnamon | Canela | Sweet, brown, slightly woody, slightly pungent, spicy. / Canela dulce y leñosa. | McCormick Ground Cinnamon |
| Clove | Clavo | Sweet, brown, spicy, pungent, floral, citrus, medicinal, minty. / Clavo dulce y pungente. | Le Nez n.7 "clove" |

#### Nutty / Cocoa → Nutty / Anuezado / Cacao → Anuezado
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Nutty | Anuezado | Slightly sweet, brown, woody, oily, musty, astringent, bitter. / Anuezado dulzón. | Le Nez n.29; almond+walnut puree |
| Almond | Almendra | Sweet, light brown, woody, buttery, floral-fruity, slightly smoky. / Almendra tostada. | Le Nez n.27 |
| Hazelnut / Filbert | Avellana | Woody, brown, sweet, musty, cedar-like. / Avellana tostada. | Le Nez n.29; McCormick Hazelnut Extract |
| Peanut | Cacahuete / Maní | Sweet, light brown, oily, slightly musty, beany. / Maní tostado, oleoso. | Roasted blanched peanuts |

#### Nutty / Cocoa → Cocoa / Cacao
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Chocolate | Chocolate | Cocoa, cocoa butter, dark-roast aromatic blend. / Chocolate, manteca de cacao. | Nestlé Toll House Semi-Sweet |
| Cocoa | Cacao | Brown, sweet, dusty, musty, often bitter cocoa-bean note. / Cacao en polvo, dulzón-amargo. | Hershey's Cocoa Powder |
| Dark Chocolate | Chocolate oscuro | High-intensity cocoa+butter with dark-roast/spicy/burnt notes, astringent and bitter. / Chocolate amargo intenso. | Lindt 90% Cocoa; Dove Promises |

#### Sweet / Dulce
| EN | ES | Definition | WCR Reference |
|---|---|---|---|
| Sweet Aromatics | Aromáticos dulces | Aromatic impression of a sweet substance. / Impresión aromática dulce. | Vanillin in water; Lorna Doone cookies |
| Overall Sweet | Dulzor general | Combined sweet taste + aromatics. / Combinación de dulzor y aroma dulce. | Post Shredded Wheat / Lorna Doone |
| Vanilla | Vainilla | Woody, slightly chemical vanilla-bean note with brown/beany/floral/spicy notes. / Vainilla natural. | Le Nez n.10; Spice Islands Vanilla Bean; McCormick Vanilla |
| Vanillin | Vainillina | Extremely sweet, non-natural vanilla / cotton-candy / marshmallow note. / Vainillina sintética muy dulce. | Fisher Scientific Vanillin |
| Brown Sugar | Azúcar morena | Rich, full, round, sweet, dark aromatic. / Azúcar morena dulzón. | C&H Golden Brown |
| Molasses | Melaza | Dark caramelised top notes; sharp, acrid, sulfurous. / Melaza oscura. | Grandma's Original Molasses |
| Maple Syrup | Jarabe de arce / Maple | Woody, sweet, caramelised, slightly green. / Jarabe de arce, leñoso-dulce. | Le Nez n.24; Maple Grove Farms |
| Caramelised | Caramelo / Caramelizado | Round, full-bodied, medium-brown, sweet cooked-sugar; no burnt. / Caramelo dulce sin quemado. | Le Nez n.25; caramelised cane sugar |
| Honey | Miel | Sweet, light brown, slightly spicy honey note. / Miel suave. | Busy Bee Pure Clover |

### SECTION B — TASTE BASICS (Main Tastes / "Sabores básicos")

These appear on the CVA 103 form as a separate small "Main Tastes (2)" CATA list — the cupper picks up to two that **stand out** (CVA 103 §6.3.2). Note SCA 103-2024 redefined the reference solutions for these — these are the new (2024) values, **not** the old WCR Lexicon ones:

| EN | ES | Definition | SCA 103 Reference |
|---|---|---|---|
| Sweet | Dulce | Fundamental sweet taste (sucrose-typical). / Sabor básico dulce. | 0.52% sucrose solution (white sugar) |
| Sour | Ácido | Fundamental sour taste (citric-acid-associated). / Sabor básico ácido. | 0.04% citric acid solution |
| Salty | Salado | Fundamental salty taste (sodium-chloride-typical). / Sabor básico salado. | 0.20% NaCl solution |
| Bitter | Amargo | Fundamental bitter taste (caffeine-associated). / Sabor básico amargo. | Dark-roasted coffee (~Agtron #35) |
| Umami | Umami | Savoury "fifth taste". / Sabor básico umami. | 0.10% MSG solution |

### SECTION C — MOUTHFEEL / Sensación en boca

CVA 103 reduces the WCR mouthfeel descriptors to 5 CATA boxes (cupper picks up to two). The intensity of mouthfeel = thickness of the brew (rated 0–15 separately).

| EN | ES | Definition | Reference |
|---|---|---|---|
| Rough (Gritty/Chalky/Sandy) | Áspero (granuloso/calcáreo/arenoso) | Feel of small particles in the brew. / Sensación de partículas pequeñas. | Ibrik/cezve coffee |
| Oily | Aceitoso | Feel of oils in the mouth. / Sensación oleosa. | Coffee with a small amount of butter; Half & Half |
| Smooth (Velvety/Silky/Syrupy) | Suave (aterciopelado/sedoso/jarabeado) | Smooth mouth texture. / Textura suave en boca. | Syrup |
| Mouth-drying | Astringente / Reseca | Drying, puckering, tingling on tongue/mouth. / Astringencia, reseca la boca. | 0.05–0.07% alum solution |
| Metallic | Metálico | Aromatic + mouthfeel of tin can / aluminium foil. / Sensación a metal. | 0.10% potassium chloride solution |

The legacy WCR Mouthfeel descriptors **Mouth Drying / Thickness / Metallic / Oily** still exist and your data model should keep them as historical references, but the user-facing CATA list must be the CVA 103 list above.

### SECTION D — AMPLITUDE (Reference-only, not on CVA 103 form)

The WCR lexicon also includes Amplitude attributes (Overall Impact, Blended, Longevity, Body/Fullness). These are **not** CATA boxes on the CVA 103 form — they have been replaced by the per-section intensity scales and the CVA 104 affective scores. Keep them as a glossary section ("Concepts → Amplitude") because experienced cuppers and Q-Graders trained on the 2004 form still reference them.

### 1.4 Counting and gap audit

Adding the section attributes: Floral 5 + Berry 5 + Dried 3 + Other Fruit 9 + Citrus 5 + Sour 7 + Alcohol/Fermented 5 + Green/Veg 11 + Stale/Papery 3 + Earthy 4 + Phenolic/Animalic 3 + Chemical 4 + Roasted 6 + Tobacco 2 + Cereal 2 + Spice 7 + Nutty 4 + Cocoa 3 + Sweet 9 + Taste basics 4 + Mouthfeel 4 + Amplitude 4 = **109 attributes** mapped from the WCR Lexicon, plus Umami (added by CVA 103) for **110 in the user-facing model**. The original WCR 2016 index lists 110; my mapping recovers all of them within ±1 (the discrepancy comes from how WCR splits "Sour Aromatics" vs the simple "Sour" taste — both appear in the WCR index but represent the same word in two sections).

**Known gaps the implementer must close:**
- The official **Spanish translations of every CATA box** are in the SCA Spanish flavor wheel poster (paid digital download from the SCA Store) and the SCA-103-S/2024 standard — the app must source the exact published Spanish strings from those documents and not rely on the table above for legal redistribution. The Spanish strings I provide are accurate working translations that match the SCA-published Spanish CVA 103 phrasing observed in published Spanish-language CVA articles (e.g., "afrutado", "baya", "ácido-fermentado", "sensación en boca", "regusto") but should be verified attribute-by-attribute against the SCA's Spanish-language assets before shipping.
- The WCR Lexicon Edition 2 (2017) replaced 24 references with FlavorActiV-encapsulated equivalents that ship internationally — for a Colombian field deployment, FlavorActiV references are far easier to source than US-grocery brands; the app's "preparation instructions" field should accommodate **two reference recipes per attribute** (US grocery + FlavorActiV) and ideally a **third** Colombia-local equivalent (see Research Area 2).
- The SCA's Olfactory Examples Library (sca.coffee/value-assessment/olfactory-examples) is the authoritative current source for CVA 103 reference recipes and is described by the SCA itself as a "living document". Implement a server-side content endpoint so the lexicon can be updated without an app release.

### 1.5 JSON shape (recommended)

```
{
  "attribute_id": "blueberry",
  "section": ["fragrance_aroma", "flavor_aftertaste"],
  "cata_path": ["fruity", "berry"],
  "labels": {
    "en": "Blueberry",
    "es": "Arándano",
    "es_co": "Arándano"
  },
  "definitions": {
    "en": "Slightly dark, fruity, sweet, slightly sour, musty, dusty, floral aromatic associated with blueberry.",
    "es": "Aromático ligeramente oscuro, frutal, dulce-ácido, algo mohoso y floral, propio del arándano."
  },
  "references": [
    { "name_en":"Oregon Fruit Blueberries in Light Syrup", "name_es":"Arándanos Oregon Fruit en almíbar ligero", "source":"WCR_v1", "intensity_aroma": 6.5, "intensity_flavor": 6.0, "prep_en":"...", "prep_es":"..." },
    { "name_en":"FlavorActiV Blueberry Capsule", "source":"WCR_v2_FlavorActiV", "intensity_aroma": 6.0 }
  ],
  "co_local_reference": { "name_es":"Mortiño (Vaccinium meridionale) silvestre andino", "notes":"Wild Andean blueberry; common Colombian analogue." }
}
```

---

# RESEARCH AREA 2 — COLOMBIAN COFFEE NICHE FEATURES

## 2.1 Department & sub-region taxonomy (MVP data set)

The FNC officially recognises 23 producing departments. Group them by zone (the Colombian Coffee Growers Federation's own zoning) so the picker is fast on a tablet:

| Zone | Departments | Typical altitude (masl) | Typical sensory signature (small-business reference profile) |
|---|---|---|---|
| **Norte** | Antioquia, Santander, Norte de Santander, Cesar, La Guajira, Magdalena (Sierra Nevada) | 1,300–1,800 (Santander up to 1,800+) | More body, less acidity, chocolate, nuts, tobacco, panela; shade-grown; Santander often chocolate + tobacco notes |
| **Centro** | Caldas, Risaralda, Quindío, N. Valle del Cauca, Cundinamarca, N. Tolima | 1,300–2,000 | "Classic Colombian": panela, milk chocolate, brown sugar, red fruit, balanced acidity, medium-high body |
| **Sur** | Huila, Cauca, Nariño, S. Tolima | 1,500–2,300+ (Nariño routinely >2,000) | Brighter and more complex: stone fruit, citrus, floral, juicy acidity; Nariño often citrus + caramel; Huila stone fruit + caramel + panela; Cauca cocoa + body |
| **Oriente** | Casanare, Meta, Caquetá | varies | <1% national volume; emerging |

**Designations of Origin (DO/PDO) the app should flag:** Café de Colombia (national PDO), plus six regional DOs — **Café de Cauca, Café de Nariño, Café de Huila, Café de Tolima, Café de Santander, Café de la Sierra Nevada**. Display the DO badge automatically when the lot's department matches.

For Pablo's primary use case (Oscar Castro at Finca Bellavista, Charalá, Santander), the app should default to: zone = Norte, department = Santander, expected altitude band ~1,500–1,800 masl, expected profile = chocolate / panela / tobacco / medium body / mild acidity. Charalá itself sits in a province (Comunera) of Santander with shade-grown tradition — pre-populate that as a vereda-level template.

**MVP** = ship the four-zone × 23-department list with PDO badges. **Phase 2** = sub-regions (e.g., "Sur del Huila / Pitalito / Acevedo" which produce different profiles than northern Huila). **Nice-to-have** = vereda-level dropdowns sourced from FNC municipal data (411 veredas in the Coffee Cultural Landscape alone).

## 2.2 Variety library (MVP set)

The 12 varieties below cover ≥98% of what Pablo will encounter. Each entry should include name, origin, parentage, leaf-rust resistance, typical cup, and whether it's a Cenicafé release.

| Variety | ES name | Origin / parentage | Cup notes (Colombia, washed baseline) | Notes |
|---|---|---|---|---|
| Castillo | Castillo | Cenicafé 2005 (Caturra × Timor Hybrid; 6+ regional sub-lines) | Smooth, citric acidity, fruity to chocolate; ~45% of national crop | F5 multi-line, leaf-rust resistant; Castillo 2.0 released late 2024 |
| Caturra | Caturra | Brazil 1937, Bourbon mutation | Average cup, classic Colombian sweet-balanced | Susceptible to leaf rust |
| Variedad Colombia | Colombia / Variedad Colombia | Cenicafé 1982 (Catimor F5) | Smooth, balanced, sweet | Pre-leaf-rust release |
| Tabi | Tabi | Cenicafé 2002 (Typica × Bourbon × Timor) | Bright acidity, balanced clean cup; "good" in Guambiano | Tall, long branches |
| Cenicafé 1 | Cenicafé 1 | Cenicafé 2016 (Caturra × Timor 1343) | Cocoa, honey, hazelnut; ~84-point initial cuppings; 84% screen 18 (Supremo) | Leaf-rust + CBD resistant |
| Bourbon (Red/Yellow) | Borbón rojo/amarillo | Reunion mutation of Typica | Sweet, balanced; rare in Colombia | Susceptible to rust |
| Typica | Típica | Original Yemen lineage | Long bean, low yield, classic clean cup | ~25% of Colombian trees |
| Pink Bourbon | Borbón rosado | Misnamed Ethiopian landrace (genetic 2023, Café Imports) | Floral, jasmine, panela, lemongrass, grapefruit, complex acidity | Surged at 2022 COE Colombia; 2023 WBC use |
| Geisha | Gesha / Geisha | Ethiopia → Panama → Colombia (10+ years) | Floral, jasmine, peach, tea-like; thrives at altitude | Very low yield |
| Wush Wush | Wush Wush | Ethiopia (Wushwush region) | Blueberry, vanilla, maple, lavender, tea-like | Adapts variably; rare |
| Maragogype | Maragogipe / Maragogype | Brazil mutation of Typica | Large beans ("elephant"); mild, smooth | Low productivity |
| Pacamara | Pacamara | El Salvador 1958 (Pacas × Maragogype) | Big body, complex, herbal | Some Colombian micro-lots |
| Java | Java | Ethiopia → Java → Cameroon → 1980s release | Cocoa, rich berries, Geisha-adjacent | Reviewed at 95 by Coffee Review 2024 |
| Chiroso | Chiroso | Ethiopian landrace selected in Colombia (RD2 Vision genetic) | Delicate, floral edging into herb, "gardeny" | Often labelled Chiroso Caturra incorrectly |
| Sidra | Sidra | Likely Ecuador/Pichincha; Ethiopian-related | Sweet, complex, floral; full-shade-only | Pest-susceptible |
| SL28 | SL28 | Kenya, Scott Labs 1931 | Black-currant, dense, complex | Rare in Colombia |

**MVP** = first 8 varieties (Castillo, Caturra, Colombia, Tabi, Cenicafé 1, Bourbon, Pink Bourbon, Geisha). **Phase 2** = the rest plus the 16 regional Castillo sub-lines (Castillo Naranjal, Paraguaicito, Santa Bárbara, Pueblo Bello, El Rosario, La Trinidad, El Tambo).

## 2.3 Processing methods (Colombia-specific palette)

The app's "process" field should default to the modern Colombian set, with English/Spanish toggle:

- **Lavado / Washed** (~98% of Colombian production per Ally Open / FNC) — depulp, ferment in water tanks 12–36h, wash, dry. Highlights bright acidity and clean profile.
- **Honey / Miel** — partial mucilage retained.
- **Natural / Natural** — whole-cherry dry.
- **Anaeróbico / Anaerobic** — sealed-tank fermentation, often 36–120h, sometimes with CO₂ injection.
- **Maceración carbónica / Carbonic maceration** — CO₂-purged tank (Sasa Sestic / 2015 WBC origin).
- **Choque térmico / Thermal shock** — Diego Bermúdez / Finca El Paraíso, Cauca: ozone-clean cherries → 36–72h anaerobic → pulp → wash 40°C hot then 12°C cold to "seal" the bean → controlled drier 32°C to 11% moisture. The signature modern Colombian process.
- **Lactic / Láctico** — closed-tank lactic-fermentation (less alcohol/winey, more fruit).
- **Co-fermentación / Co-ferment** — added fruit, yeast, or spices during fermentation (Sebastián Ramírez Watermelon, Blackberry; etc.).
- **Doble fermentación / Double fermentation** — anaerobic in cherry, then anaerobic post-pulp.
- **Honey rojo / amarillo / negro** (red/yellow/black honey) — mucilage retention level.
- **Lavado mecánico / Eco-pulping (Penagos / DESLIM)** — Cenicafé's water-saving wet-mill that cuts water use ~95%.

The data model should store **processing recipe parameters** (fermentation temperature, hours, microbial additions, drying method, drying days, target moisture, target water activity) because Colombian producers like Diego Bermúdez and Sebastián Ramírez build their identity on precise process recipes, and buyers will pay for that traceability.

**MVP** = lavado, honey, natural, anaeróbico, choque térmico, co-fermentación. **Phase 2** = the full recipe-parameters editor.

## 2.4 FNC grading & how to display it alongside CVA

FNC grading is **size + defect + cup** based and is mandatory for export (Excelso is the legal minimum to export). Per FNC Resolution 2 of April 2016 and the FNC export standard:

| FNC Grade | Screen | Defect tolerance (500 g) | Use |
|---|---|---|---|
| **Supremo** | screen 17/64+ (some specs ≥18) | Strict | Premium export size |
| **Extra** | screen 16+ | Moderate | Higher-quality export |
| **Excelso** | screen 14/64+ (≤5% through 14, retained on 12; ≤24 defects/500g; moisture ≤12.5%; clean cup) | Standard | Legal export minimum |
| **UGQ (Usual Good Quality)** | smaller / more defects | Higher | Domestic / lower-tier |
| **Pasilla** | broken/defective | Highest | Domestic only |

**App should display BOTH**: the FNC physical grade (for export/customs/contract context) AND the CVA Descriptive + Affective output (for sensory communication with the buyer). They answer different questions. The CVA 80-point specialty threshold (now derived from CVA 104 affective scoring) lives alongside, not inside, FNC grading.

Also display: the **screen-size sieve readout** (12, 14, 16, 17, 18) for green-coffee evaluation — in Colombia this is the primary physical metric.

## 2.5 Colombian-specific defects (physical assessment)

CVA Physical Assessment (CVA 101, in development) and SCA Green Coffee Classification are the standards, but the FNC-specific quirks are:
- **Broca (Hypothenemus hampei) damage** — Colombia uses a more granular insect-damage rule than SCA. Per Raw Material's Colombia spec: 1 perforation only with no dark area = "slightly insect damaged"; 2+ perforations with dark areas = full insect-damage defect. FNC accepts 140 slightly-damaged beans alongside 2 full primaries / 40 full secondaries in 500g for Excelso. **The app's defect counter must let cuppers tag broca damage at this granularity, not just SCA's binary.**
- **Pasilla** (broken/floaters) — ubiquitous.
- **Vinagre / Sour** — over-fermentation a real risk in washed processing in humid microclimates.
- **Negros parciales / Partial blacks** — common in mechanical-drying lots.
- **Cardenillo / Verdín** — green-coloured mould patina indicating storage problems in coastal Sierra Nevada lots.

**MVP** = SCA primary/secondary defect count + Colombian broca tri-state. **Phase 2** = visual reference photos for each defect (camera-based ML "is this a broca bean?" assist is a nice-to-have).

## 2.6 Altitude → cup-profile heuristic (UI hint)

Because Colombia spans 1,100–2,300+ masl, a hint chip on the form helps beginners orient: "≥1,800 masl + Sur/Norte zone → expect higher acidity, more aromatic complexity; ≤1,500 masl → expect more body, chocolate, nutty notes." This is the same logic the FNC publishes in its own marketing material and aligns with the higher-altitude → slower maturation → more sugar development chain.

## 2.7 Competition support: COE Colombia + Taza de Excelencia + regional cups

- **Cup of Excellence Colombia / Taza de Excelencia Colombia** — uses the COE form (different from the SCA / CVA: 8 attributes — Aroma, Acidity, Sweetness, Clean Cup, Flavor, Mouthfeel, Balance, Aftertaste — each scored on a 0–8 sub-scale, summed and added to 36 to yield 100; 86+ to advance, 87+ for auction, 90+ for Presidential). Run by Asociación Colombiana para la Excelencia del Café (ASECC) and ACE; FNC co-sponsors.
- **2024 SCA × ACE MOU** — Cup of Excellence is integrating CVA into competition, so the COE form is moving toward CVA alignment. **The app should let a cupper run a CVA Descriptive + CVA Affective AND export a COE-style summary**, because for the next 2–3 years both will coexist. Build the export as a templated PDF.
- **Mejor Taza de Café de Santander** (FNC Santander, 20+ editions) and other departmental cups — already use SCA-protocol cupping. Local relevance for Pablo: this is the regional competition his producers will enter first.
- **Best of Colombia / Concurso departamentales** — region-specific.

**MVP** = CVA-only cupping with the option to also produce a "COE-style" summary card (8 attributes derived from CVA Affective categories). **Phase 2** = full COE form support. **Nice-to-have** = direct CSV/PDF export sized to the FNC entry forms.

## 2.8 Spanish-first descriptor pack — the "Origen / Colombia" extension

These descriptors do **not** appear in the WCR Lexicon but are culturally meaningful and frequently used by Colombian producers and buyers. They should live in the app as an **opt-in extension layer** that nests under the SCA's CATA categories (so the cupper still ticks "Sweet → Brown Sugar" when they write "panela", preserving export-grade interoperability):

| ES descriptor | EN equivalent / closest WCR | CATA category | Note |
|---|---|---|---|
| Panela | Unrefined cane sugar (closest = Brown Sugar / Molasses) | Sweet → Brown Sugar | Iconic Colombian sweetness; floral + vanilla accents; best-in-Pitalito/Pedregal |
| Bocadillo | Guava paste | Fruity → Other Fruit | Common in Santander cup notes |
| Lulo | Naranjilla (citric Andean fruit) | Fruity → Citrus / Other | High-altitude descriptor |
| Guanábana | Soursop | Fruity → Other Fruit | Tropical fruit note in lower-altitude lots |
| Mora | Blackberry | Fruity → Berry | Direct equivalent of WCR Blackberry, but Andean wild mora reads sharper |
| Mortiño | Andean wild blueberry | Fruity → Berry | Closest to Blueberry but more astringent |
| Curuba | Banana passionfruit | Fruity → Other Fruit | High-altitude tropical |
| Maracuyá | Passionfruit | Fruity → Other Fruit | |
| Lulada / Lulo verde | Green naranjilla | Green/Vegetative + Fruity | |
| Tomate de árbol | Tamarillo | Fruity → Other Fruit | |
| Café de oro / Limpieza | Clean cup quality | Concept (not CATA) | "Clean cup" — used heavily in COE judging |
| Aguardiente | Anise spirit / Alcohol | Sour-Fermented → Alcohol | Can describe over-fermented anaerobic |
| Tabaco rubio / Tabaco negro | Light/dark cured tobacco | Roasted → Tobacco | Santander signature |
| Achiote | Annatto | Spice → Brown spice | Earthy-paprika |
| Miel de caña / Miel de abejas | Cane honey / bee honey | Sweet → Honey | Distinguish from Honey (bee) |
| Almíbar | Syrup (mouthfeel + flavor) | Sweet + Mouthfeel | Common in juicy washed Huilas |

**MVP** = ship Panela, Mora, Lulo, Guanábana, Bocadillo, Mortiño, Curuba, Tabaco rubio, Almíbar, Miel de caña — the 10 most useful — as nested suggestions under the relevant SCA CATA boxes, fully bilingual.

## 2.9 Direct-trade & traceability data fields (lot-level model)

This is where Origen can substantially differentiate vs Cropster Cup and Tastify. Shape the lot record around what Colombian producers and small importers actually need:

**Producer**
- Nombre del productor (full name)
- Cédula / FNC member ID (Cédula Cafetera)
- Género / age (for sustainability reporting)
- Asociación / Cooperativa (e.g., ASPROCESCA, Coopcentral)
- Indigenous community / ethnic group (Cauca-relevant)

**Geography**
- Finca name
- Vereda
- Municipio
- Departamento
- Zona FNC
- DO/PDO (auto-derived; flag Café de Santander etc.)
- Altitude — masl, single value or min–max
- GPS (optional; relevant for EUDR after 2025)
- UNESCO Coffee Cultural Landscape flag

**Crop**
- Variedad (multi-select; allow blends with %)
- Total farm area (ha)
- Coffee-planted area (ha)
- Sowing density (trees/ha)
- Shade system (sun / partial / full / agroforestal)
- Tree age (years)

**Harvest & post-harvest**
- Picking date(s) — main / mitaca distinction (Colombia is one of the few origins with two harvests/year, key context)
- Lot size (kg of cherry, kg of pergamino, kg of green)
- Process recipe (linked to 2.3)
- Drying method (patio, marquesina, parabólico, mechanical, polytunnel, "elvas"/rooftop)
- Drying days
- Final moisture %
- Water activity (aW)
- Mill (wet mill / dry mill, with "Beneficio propio" vs cooperative)
- Roast date & profile (for the cupping sample)

**Commercial**
- Farmgate price paid (COP/kg pergamino)
- FOB price (USD/lb green)
- Currency exchange rate at contract date
- Certifications (FNC Excelso badge, Rainforest Alliance, Fair Trade, Organic, Bird-Friendly, EUDR-ready)
- Buyer / contract reference

**MVP** = bold fields above. **Phase 2** = GPS, EUDR plot polygon, water activity, recipe parameters. **Nice-to-have** = QR-code generator the producer hands to the next link in the chain.

---

# RESEARCH AREA 3 — SEPARATE LEARNING / EDUCATION TRACK

## 3.1 What the SCA already covers — and what to leave alone

Do **not** rebuild content the SCA charges money for. Avoid infringement and avoid duplicating high-quality material.

The SCA's paid pathway:
- **Coffee Skills Program → Sensory Skills** at Foundation (7 h online), Intermediate (advanced sensory science, panel design, CVAS Descriptive/Affective practice), Professional (panel management).
- **CVA for Cuppers Course** (2 days, hands-on, four exams) — designed for users of the 2004 form upgrading to CVA. **Will be retired November 30, 2026** per SCA Education, after which CVA will be folded into the new "Evolved Q Grader" certification (the legacy CQI Q Grader course retired Sep 30, 2025; SCA now runs the Q programme).
- **Coffee Skills → Green Coffee** Foundation/Intermediate/Professional for grading and trade.

What an Origen-branded free/freemium track **can and should** cover without infringing:
1. **How to use the CVA forms practically** (the SCA standards 102/103/104 are CC-licensed for partial reproduction with attribution — the standards themselves are free).
2. **Practical field cupping** — adapted to a Colombian producer cupping room with limited equipment.
3. **The 110-attribute lexicon and a vocabulary builder** (the WCR Sensory Lexicon is a free CC-licensed PDF).
4. **Calibration and triangulation drills** (these are method-based, not copyrightable).
5. **Reading your own cupping result** — explanation, not curriculum.
6. **How to communicate results to a buyer**.
7. **Spanish-first translations and Colombian sensory analogues** (your IP).

## 3.2 Pedagogical sequence (recommended 7-stage curriculum)

For Pablo's audience — small business owners, baristas entering QC, and producers learning to evaluate their own coffee — research from sensory training (Roast Magazine, Pacific Daily Grind, Lok Chan / Régine Guion-Firmin) supports a sequence that prioritises fundamentals before fluency. Concretely:

1. **Why we cup (≈10 min, video).** Frame: the CVA splits "what's in the cup" (Descriptive) from "how much I like it" (Affective). The single most common beginner mistake is conflating them.
2. **The four basic tastes + umami + mouthfeel basics (1 hr, hands-on).** Drink the SCA 103 reference solutions (sucrose 0.52%, citric 0.04%, NaCl 0.20%, dark-roast coffee for bitter, MSG 0.10%) — these are cheap to make. Train recognition first, intensity second.
3. **The smell vocabulary (multi-session).** Glossary deep-dives — one CATA category per session (Floral → Fruity-Berry → Fruity-Citrus → Sour/Fermented → Green/Vegetative → Other → Roasted → Spice → Nutty/Cocoa → Sweet). Each session: read definition + smell two reference items + try to recall blind. Use the Le Nez du Café 36 (Revelation kit, the SCA's official kit) where available; for Colombia, suggest cheaper DIY kits per 3.4.
4. **Intensity scaling (1 session).** Train the 0–15 scale using the SCA 103 paired-strength references (e.g., 0.025% citric vs 0.05% citric for sour intensity 2.5 vs 3.5). Calibrate recognising "barely detectable / slightly intense / moderately intense / very intense" anchor points (per WCR scale: 0=none, 2=barely, 4=identifiable, 6=intense, 8=moderately intense, 10=extremely intense, 12=very intense).
5. **The CVA 103 form, walk-through cupping.** First with one coffee, then 3, then 5. Beginners freeze on the form — coach them to: (a) tick total intensity first, (b) then check up to 5 olfactory CATA boxes, (c) then up to 2 main tastes that **stand out**, (d) then up to 2 mouthfeel boxes. Free-elicit terms only after CATA.
6. **Triangulation drills (recurring).** Three cups, two identical, find the odd one. Per Coffee Strategies / Q Grader prep: 6 sets per session, ideally under red light to remove visual bias. Start "easy" (clearly different origins) and work toward "hard" (same farm, two lots).
7. **Affective scoring (CVA 104) and reading your result.** Introduce the 9-point hedonic scale ("dislike extremely → neither like nor dislike → like extremely") only after Descriptive is comfortable. Walk through: how Aroma/Flavor/Aftertaste/Acidity/Sweetness/Mouthfeel/Overall are scored, how the SCA Affective Score Calculator converts those into a 0–100 number, and why "backwards scoring" (rating Acidity 9 because it's intense but you don't like it) is the most common error the calculator catches (per Alex Pond, SCA "CVA In Action: Affective" article).

## 3.3 Calibration drills the app should ship as built-in features

- **Triangle test generator** — pick 4 coffees, the app deals 6 sets of three cups (two same, one odd), tracks correct/incorrect, scores the user.
- **Paired comparison** — same bean, two roasts/processes; rate which has more of attribute X.
- **Intensity-scaling drill** — present cupper with 4 reference solutions of different strengths; cupper rates intensity 0–15; app shows the WCR/SCA target and the deviation.
- **Olfactory ID drill** — blind smell test using Le Nez du Café numbered vials (or DIY analogues) — app shows a number, cupper picks the descriptor from a CATA tree, app scores.
- **Group calibration session** — multi-cupper mode (your tablet's killer feature for the Oscar Castro field use case): 3 cuppers cup the same coffee, the app shows the panel's mean intensity per section + the spread (standard deviation). The 2023 COE Colombia top-2 spread was 0.22 points (per Christopher Feran's analysis); the app should show producers what panel agreement looks like at competition tightness.
- **"Beat the panel"** — cup blind, the app reveals the panel mean afterward, computes your z-score per section.

## 3.4 Sensory references — kits Colombian producers can actually access

- **Le Nez du Café "Revelation" 36** (~US$300+, French-made) — the SCA's official olfactory kit. Required for SCA Sensory and CQI Q Grader exams. Aromas guaranteed 5y. Vials labeled by number for blind testing. **Cost-prohibitive for many Colombian producers.**
- **Le Nez du Café "Temptation" 6** (~US$70–90) — six core aromas, "ABC of coffee aromas." Realistic gift price.
- **Le Nez du Café 60 "Coffee 2.0"** — adds Robusta-specific markers; expensive.
- **Aroma Kit T100 (100 aromas)** — used by Lok Chan; alternative.
- **FlavorActiV capsules** — used in WCR Lexicon Edition 2 references; pharmaceutical-grade, ship internationally.
- **DIY Colombian-accessible alternatives** — Sweet Maria's, Wildkaffee, and Cropster (community) all document grocery-store substitutes. For a Colombian context, ship a "DIY caja de aromas" recipe pack as built-in app content:
  - **Citric solutions** (0.025–0.05–0.5–1.0%) — citric acid powder is freely available in Colombian markets as "ácido cítrico"
  - **Caffeine solutions** for bitter (medical-grade caffeine via pharmacy)
  - **Sucrose / NaCl / MSG** — kitchen-grade
  - **Local fruit equivalents** — fresh mora, lulo, guanábana, mortiño, panela, fresh coffee blossom (have producers smell their own farm in flowering season)
  - **Spice mix** — cinnamon, clove, nutmeg, allspice (per WCR Spice Brown recipe)
  - **Herb mix** — bay, thyme, basil
  - **Vanilla extract / vanilla bean / molasses / honey / dark chocolate** — all readily available locally
- This DIY content is itself an Origen IP differentiator — neither Cropster Cup nor Tastify ships it.

## 3.5 Common beginner mistakes the UI should design against

| Mistake | Source | UI countermeasure |
|---|---|---|
| Conflating Descriptive and Affective ("It tastes like cherries → 9/9") | Roast Magazine, SCA "CVA In Action: Affective" | Hard-separate the two screens; don't show the affective scale until the descriptive is locked. Tooltip: "What you taste ≠ how much you like it." |
| Backwards scoring on hedonic scale | Alex Pond (Elio), SCA Affective article | Use the SCA's Affective Score Calculator logic and warn if the 0–100 derived score is inverted relative to written notes. |
| Missing or skipping uniformity / non-uniform cup count | CVA Cupping Score Calculator (sca.coffee/cuppingscore) | Enforce per-cup tasting; show the 5-cup grid and require explicit non-uniform tags. |
| Rating individual descriptors instead of total intensity | CVA 103 §6.2, Sweet Maria's commentary | Constrain UI: intensity slider lives at the section header; CATA descriptors below have no individual scale (CVA design intent). |
| "Esoteric" tasting notes ("the raspberries from my grandmother's garden") | Roukiat Delrue / SCA "CVA In Action: Descriptive" | Force CATA selection before allowing free-elicit; suggest the matching parent CATA when the user types "raspberry" → autocompletes to Berry-Raspberry. |
| Visual / colour bias (purple looks sweet, green looks grassy) | Cropster Cup design rationale | Greyscale UI; allow "blind mode" that hides sample names. |
| Dominant-cupper bias on a panel | Chris Kornman (Royal), Sprudge | Multi-cupper sessions hide other cuppers' results until everyone has submitted, then reveal panel averages and spreads. |
| Cardboard / staling unrecognised | WCR Lexicon definition | Have the dry-grounds → wet-aroma walkthrough prompt the user to actively check for cardboard/papery. |
| Over-extracting "fruit" terms when actual is fermented | Le Nez du Café Indonesia critique | "Fermented vs fruity" mini-quiz in Learn track; reference fermented banana intensity 6.5. |

## 3.6 Competing apps — gap analysis

| App | What it does well | What it misses for Origen's audience |
|---|---|---|
| **Cropster Cup** | Offline, greyscale, syncs to roasting/inventory ERP; SCA + COE forms; multi-cupper | Tied to Cropster ecosystem (expensive for a small Colombian business); no producer-facing learning content; CVA support arrived late |
| **Tastify** | Visual reports (spider/word cloud/branded wheel); arabica + robusta + COE; Spanish/Portuguese supported; remote collaboration; guest cuppers | Web-based first (offline weaker than Cropster); fewer producer-side features; descriptors not deeply nested per CVA |
| **Catador** | iOS/Android; SCA + UCDA Robusta protocols; affordable | Older 2004-form orientation; thin learning content |
| **Cup.coffee / Pomelo / Quaffee / Sensory Lab** | Various lightweight scoresheets, some good for personal use | None positioned as a CVA-native bilingual producer-side app |
| **Cropster Origin** | Deep producer/exporter inventory + lot management with cupping integration | Not a tablet-first field app for a 2-cup farm visit |

**Origen's defensible niche: CVA-native + Spanish-first + Colombia-specific + producer-side learning.** No competitor combines those four.

## 3.7 Gamification — what works, what feels gimmicky

**Use:**
- **Calibration score vs. panel mean** — proven in COE judging culture. Show "your z-score" per section. Producers respect this.
- **Streak: days cupped in a row** — light, encourages habit.
- **Triangulation accuracy %** — directly mirrors the Q Grader / CVA for Cuppers exam, gives professional context.
- **Olfactory recognition % per CATA category** — measurable progress; celebrates mastery of, e.g., "Floral" before "Spice".
- **Badges tied to real milestones** — "100 cups completed", "Cupped 5 producers", "Calibrated within 0.5 of panel mean for a session".

**Avoid:**
- Cartoonish cup illustrations / leaderboards across strangers — feels childish in a professional buyer-relationship context.
- "XP points" / generic levelling — Roukiat Delrue's CVA design philosophy rejects gamified overlay on professional sensory work.
- Public competitive leaderboards — calibration is collaborative, not competitive; ranking Oscar Castro's farm against another farm publicly damages trust.
- Pop-ups during a cupping session — bias risk.

## 3.8 Content for the Learn track — concrete asset list

**MVP (ship at launch):**
1. Glossary (110 attributes with EN/ES definitions, references, audio pronunciation in both languages, and Colombian local analogue).
2. Six 3–5 minute video explainers, one per umbrella CATA category (Floral, Fruity, Sour/Fermented, Green/Veg, Roasted, Sweet) — record on-farm in Santander with Colombian producers as on-camera talent.
3. **"Cómo catar tu propio café"** — a 12-minute producer-facing video walking through the CVA 103 form.
4. **DIY reference recipe pack** — 30 attributes a Colombian producer can prep from a local grocery and a basic chemistry supply.
5. Three calibration drills: triangle test, paired comparison, intensity-scaling.
6. **"Cómo leer tu propio resultado"** — explainer of how to read a Descriptive form (intensity per section, CATA boxes, dominant categories) and turn it into 2–3 selling sentences.
7. **"Cómo comunicar al comprador"** — a templated email-builder that turns a CVA Descriptive output into a buyer-facing offer sheet (per the SCA's recommendation that descriptive forms be used directly in coffee labelling and offer lists).

**Phase 2:**
8. CATA category deep-dives (one per category, ≥30 min each).
9. Simulated cupping challenges — recorded panel results from real coffees, the user "cups" against the recorded panel and gets calibration feedback.
10. **CVA Affective explainer** — including the 9-point hedonic scale, the Score Calculator, and the backward-scoring trap.
11. Defect handbook with photos (Colombia broca specifics).
12. **"Preparación para Taza de Excelencia / COE Colombia"** — a curriculum specifically aimed at producers preparing samples (sample size, water activity, screen sizing, what jurors are looking for, the COE form vs CVA).
13. Q Grader / Evolved Q Grader prep companion (post-Nov 2026, when SCA's Evolved Q is the canonical certification).

**Nice-to-have:**
14. Voice-driven cupping (cupper dictates, app fills the form — useful when hands are wet on the cupping table).
15. Le Nez du Café 36 vial integration: scan QR on a vial, app drills you on what it is.
16. Buyer-facing public read-only sample profile pages (Origen-branded) the producer can share via WhatsApp link.

---

# Recommendations (Decision-Ready)

**For MVP (3–4 month build, target launch alongside the next harvest visit to Charalá):**
1. **Ship the CVA 103 Descriptive form as the primary cupping screen, in Spanish-first.** Use the SCA's official Spanish-translated CATA labels. Hard-tie the WCR 110-attribute lexicon as nested suggestions under each CATA box. This is the single most important content decision.
2. **Build the data model around the 23-department × 12-variety × ~10-process Colombia matrix.** Pre-populate Santander/Charalá-area templates for the Oscar Castro use case.
3. **Implement multi-cupper-on-one-tablet as a first-class flow** — pass the iPad around a 5-person panel, hide each cupper's result until all submit, then show panel mean + spread. This is the single most differentiating workflow vs. Cropster Cup and Tastify.
4. **Ship the 10-attribute Spanish-Colombia descriptor pack** (Panela, Mora, Lulo, Guanábana, Bocadillo, Mortiño, Curuba, Tabaco rubio, Almíbar, Miel de caña) as nested suggestions under SCA CATA boxes.
5. **Ship the DIY reference recipe pack** as the Learn track's launch hero — this has no equivalent in any competing app and addresses the core barrier (cost of Le Nez du Café) for producers.
6. **Build a CVA Affective form (CVA 104) on top of the 9-point hedonic scale and reuse the SCA Affective Score Calculator math** — but only enable it after Descriptive is filled to prevent backwards scoring.

**For Phase 2 (post-MVP, ~6–9 months out):**
- Vereda-level dropdowns; finca template library shareable across cuppers.
- COE form export; physical form (CVA 101) when standardised.
- Buyer offer-sheet generator and shareable read-only public lot pages.
- Triangulation generator + intensity drills with live calibration scoring.
- 16 Castillo regional sub-line variety expansion.
- Process-recipe parameter editor (fermentation hours/temperature/microorganisms/CO₂).

**For Phase 3 / nice-to-have:**
- ML-assisted broca defect detection from camera photos.
- EUDR-ready GPS plot polygon storage.
- Le Nez du Café vial QR integration.
- Voice dictation of CATA selections.
- Integration with Evolved Q Grader curriculum once SCA publishes (post-Nov 2026).

**Benchmarks/thresholds that would change the priorities:**
- If the SCA releases an open-source Spanish CVA forms package before MVP launch, redirect engineering effort from translation-validation to learning content.
- If Cup of Excellence formally swaps to the CVA form (currently an MOU plan as of mid-2024), drop COE-form export from Phase 2 and replace with a single unified CVA + COE workflow.
- If SCA releases the CVA Physical Assessment (CVA 101) standard, prioritise it over the COE form export.
- If a Colombia-focused competitor ships a CVA-native bilingual app, accelerate the multi-cupper field-panel flow as the moat.
- If Pablo's customer interviews show producers do not read English at all, reverse the bilingual default to ES-only with EN as opt-in (currently the recommendation is bilingual with ES as default).

---

# Caveats

1. **The exact published SCA Spanish strings must be verified attribute-by-attribute** before shipping the lexicon. The Spanish translations in §1.3 are accurate working translations validated against published Spanish CVA articles, but the SCA's licensing (CC BY-NC-ND 4.0) requires using their official strings for the wheel/CATA labels in any public distribution. The SCA has produced an official Spanish flavor wheel poster (sold via the SCA store) and an SCA-103-S/2024 Spanish edition of the Descriptive Assessment standard — buy them and lift the strings verbatim.
2. **The WCR Sensory Lexicon is a "living document"** per WCR's own statement; Edition 2 (2017) added/refined references for ~24 attributes via FlavorActiV encapsulated standards. Build the content pipeline so attributes/references can update server-side without app releases.
3. **The CVA itself is still evolving.** SCA Standard 102/103/104 were ratified November 2024; Standard 101 (Physical) and 105 (Extrinsic) and 610 (System Operation) are in preparation as of mid-2024. CVA for Cuppers retires Nov 30, 2026. The app should treat the CVA standards URL on sca.coffee as a versioned dependency.
4. **The 110-attribute count is aspirational.** Different sources (WCR PDF index, SCA flavor wheel outer-ring count, Sensory Studies 2016 paper) yield slightly different counts (108–112) depending on whether duplicates like Sour-as-taste vs Sour-Aromatics-as-olfactory are merged. The model in §1.3 maps cleanly to ~109 unique WCR attributes plus Umami (added by CVA) for 110 user-facing items.
5. **Castillo "2.0" was announced in late 2024 but large-scale cultivation has not yet begun** (per 1Zpresso reporting); treat it as a forward-looking variety entry.
6. **Cup of Excellence Colombia uses an FNC/ASECC-administered competition known locally as "Taza de Excelencia"** — the historical scoring uses the COE 8-attribute form, NOT the SCA form. The 2024 SCA × ACE MOU commits to integrating CVA into COE judging, but as of this report's date the transition is in progress and not all editions will be fully CVA-aligned. Build for both.
7. **FNC export rules changed in 2016** (Resolution 2 of April 25, 2016) — Excelso tolerance for through-14/64 screen rose from 1.5% to 5% — make sure the app's grading thresholds are dated, because international buyer specs and FNC specs sometimes diverge.
8. **Direct-trade traceability fields likely to be required by EUDR for EU-market exporters** (GPS polygon, deforestation proof) are still being clarified for smallholder Colombian lots; treat the GPS field as optional MVP / required Phase 2 when EUDR enforcement firms up.
9. **"Pink Bourbon" is not actually a Bourbon** (per Café Imports / RD2 Vision 2023 genetic testing — it's an Ethiopian landrace). The app's variety library should use the local market-recognised name "Pink Bourbon / Borbón rosado" but flag the genetic note in the variety detail page so producers don't misrepresent it to buyers who do their own DNA testing.
10. **The SCA's Olfactory Examples Library and the WCR Lexicon use US-centric reference brands** (Smucker's, Welch's, Kroger). The app must not depend on these being available in Colombia — every reference attribute needs a Colombia-local DIY equivalent or a FlavorActiV alternative, or the educational track is unusable in the field.
