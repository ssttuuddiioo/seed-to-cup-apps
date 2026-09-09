# Seed to Cup

**Herramientas de código abierto para caficultores — de la semilla a la taza.**
**Open-source tools for coffee farmers — from seed to cup.**

[Español](#español) · [English](#english)

---

## Español

Software libre para que los caficultores registren y sean dueños de los datos de
su propio café, en cada eslabón de la cadena: de la semilla a la taza.

La trazabilidad del café hoy vive en plataformas caras, en inglés, y pensadas
para el comprador — no para quien cultiva. Cuando el productor sí registra sus
datos, casi siempre terminan en manos de otro. Este proyecto invierte eso:
**español primero, funciona sin señal, gratis, y los datos son de la finca.**

Construido en campo con productores colombianos, en cataciones y beneficios
reales.

### Los eslabones

De la semilla a la taza hay muchos pasos. Dos ya están construidos y en uso:

| Eslabón | Estado |
|---|---|
| Vivero y cultivo | Planeado |
| Cosecha y recolección | Planeado |
| Despulpado | Planeado |
| **Fermentación** | ✅ **Construido** |
| Lavado y secado | Planeado |
| Trilla y clasificación | Planeado |
| **Catación (SCA CVA)** | ✅ **Construido** |
| Exportación y ficha del productor | ✅ Parcial (ficha del productor) |

#### 🫙 Fermentación — funciona sin internet

Digitaliza el formato en papel **CFF-005 "Control de Fermentación"**. El operario
registra lote, hora, temperatura ambiente y de masa, °Brix, pH, conductividad
(EC) y notas — directo en el tanque, sin señal.

- **Local primero**: los datos se guardan en el dispositivo (IndexedDB) y suben
  solos cuando vuelve la conexión.
- Abre en frío sin señal (service worker).
- Validación suave: avisa si el pH o la temperatura se salen de rango, pero
  **nunca bloquea** — el dato real manda.
- Exporta a CSV y a PDF conservando el código del formato para trazabilidad.

#### ☕ Catación — norma SCA CVA (2024)

Cataciones a ciegas completas, siguiendo el *Coffee Value Assessment* de la SCA:

- **CVA 101** — evaluación física (café verde y tostado)
- **CVA 103** — evaluación descriptiva (CATA, intensidades)
- **CVA 104** — evaluación afectiva (puntaje de 8 secciones, fórmula validada)
- **CVA 105** — evaluación extrínseca
- Asignación aleatoria de códigos ciegos, panel de varios catadores,
  destape con ranking y **ficha del productor exportable como PNG** para
  mandar por WhatsApp.

Incluye una capa de referencia para Colombia: 110 atributos del léxico sensorial
WCR, 18 regiones/denominaciones, 16 variedades, 11 procesos, y **20 descriptores
andinos** que el léxico de la SCA no cubre — mortiño, lulo, panela, curuba,
guanábana, almíbar.

### Estado del proyecto

Funciona y se usa en campo, pero es temprano. Con honestidad:

- ✅ Ambos módulos construidos, con pruebas, y desplegables.
- ✅ La fórmula del puntaje afectivo CVA está validada contra
  `sca.coffee/cuppingscore` en 5 casos (±0.1).
- ⚠️ **Los textos en español todavía no son los oficiales de la SCA.** Son
  traducciones de trabajo, revisadas por un hablante nativo, pendientes de
  cotejar contra la norma SCA-103-S/2024. Ver `notes/`.
- ⚠️ Sin autenticación todavía (v1 es de un solo usuario).
- ⚠️ Los eslabones de cultivo y cosecha aún no existen.

**Se buscan colaboradores**, sobre todo caficultores, catadores y agrónomos que
puedan decirnos dónde el software no coincide con la realidad de la finca.

### Instalación

Requiere **Node ≥ 20** y un proyecto de [Supabase](https://supabase.com) (el
plan gratuito alcanza).

```bash
git clone https://github.com/ssttuuddiioo/seed-to-cup-apps.git
cd seed-to-cup-apps
npm install
cp .env.local.example .env.local   # y llena las variables
```

Variables en `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...        # públicas, las usa la app
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...       # solo servidor, solo para `npm run seed`
```

Aplica las migraciones de `supabase/migrations/` (0001 → 0004) en orden, desde
el editor SQL del panel de Supabase. Luego carga los datos de referencia y
arranca:

```bash
npm run seed
npm run dev
```

### Comandos

```bash
npm run dev                 # servidor de desarrollo
npm run build               # build de producción (requiere Node ≥ 20)
npx tsc --noEmit            # chequeo de tipos

npm run test:scoring        # valida la fórmula del puntaje CVA
npm run test:fermentacion   # validación + exportación CSV
npm run verify:lexicon      # verifica cada archivo semilla
npm run verify:regions      #   (también: varieties, processes,
npm run verify:origen-descriptors  #   origen-descriptors)
```

`npm run lint` no está configurado. La verificación real es `tsc --noEmit` más
`next build`.

### Cómo está organizado

```
app/
  sessions/            # catación: asistente, evaluar, físico, destape, ficha
  fermentacion/        # fermentación: lista, nueva, detalle (offline)
lib/
  scoring.ts           # fórmula del puntaje afectivo CVA + pruebas
  results.ts           # agregación del panel, radar de 8 ejes
  reference.ts         # datos de referencia tipados
  fermentacion/        # db, sync, store, validación, csv, print
  i18n/                # es.json / en.json — español por defecto
seed/                  # léxico, regiones, variedades, procesos, descriptores
scripts/               # verificadores de cada archivo semilla
supabase/migrations/   # 0001–0004
docs/research.md       # investigación de fondo (referencia)
OVERVIEW.md            # mapa técnico actual de la app
```

Stack: Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · Supabase
· IndexedDB.

### Cómo contribuir

Los aportes son bienvenidos, en español o en inglés — no hace falta escribir
inglés para participar.

Lo más útil ahora mismo:

1. **Revisar el español** contra la norma oficial SCA-103-S/2024 (ver `notes/`).
2. **Descriptores locales** de otros orígenes — el léxico de la SCA no cubre lo
   que se cultiva y se prueba fuera de EE.UU. y Europa.
3. **Los eslabones que faltan** — cultivo, cosecha, secado.
4. **Contarnos qué se rompe en campo.** Un reporte de una finca sin señal vale
   más que cualquier función nueva.

Antes de abrir un PR: que pasen `npx tsc --noEmit`, `next build` y las pruebas.

### Licencia

[Apache-2.0](LICENSE). Úsalo, modifícalo, véndelo, móntalo para tu cooperativa.
Solo conserva el aviso de licencia.

Las normas del *Coffee Value Assessment* son de la
[Specialty Coffee Association](https://sca.coffee); el léxico sensorial es de
[World Coffee Research](https://worldcoffeeresearch.org). Este proyecto los
implementa, no los reemplaza, y no está afiliado a ninguna de las dos.

---

## English

Free software for coffee farmers to record — and own — the data about their own
coffee, at every link in the chain: from seed to cup.

Coffee traceability today lives in expensive, English-language platforms built
for the buyer, not the grower. When producers do record their data, it usually
ends up belonging to someone else. This project inverts that:
**Spanish first, works with no signal, free, and the data belongs to the farm.**

Built in the field with Colombian producers, during real cuppings and real
fermentations.

### The links in the chain

Seed to cup is a lot of steps. Two are built and in use:

| Link | Status |
|---|---|
| Nursery & cultivation | Planned |
| Harvest & picking | Planned |
| Depulping | Planned |
| **Fermentation** | ✅ **Built** |
| Washing & drying | Planned |
| Milling & grading | Planned |
| **Cupping (SCA CVA)** | ✅ **Built** |
| Export & producer card | ✅ Partial (producer card) |

#### 🫙 Fermentation — works offline

Digitizes the paper **CFF-005 "Fermentation Control"** form. The operator logs
lot, time, ambient and mass temperature, °Brix, pH, conductivity (EC) and notes
— standing at the tank, with no signal.

- **Local-first**: writes land in on-device IndexedDB and sync themselves when
  connectivity returns.
- Opens cold with no signal (service worker).
- Soft validation: warns when pH or temperature look out of range but **never
  blocks** — the real reading wins.
- CSV and print-to-PDF export, both preserving the form's document code for
  traceability.

#### ☕ Cupping — SCA CVA standard (2024)

Full blind cuppings following the SCA *Coffee Value Assessment*:

- **CVA 101** — physical assessment (green and roast)
- **CVA 103** — descriptive assessment (CATA, intensities)
- **CVA 104** — affective assessment (8-section score, validated formula)
- **CVA 105** — extrinsic assessment
- Randomized blind-code assignment, multi-cupper panels, ranked reveal, and a
  **producer card exported as PNG** to send over WhatsApp.

Ships with a Colombia reference layer: 110 WCR sensory lexicon attributes, 18
regions/denominations, 16 varieties, 11 processes, and **20 Andean descriptors**
the SCA lexicon doesn't cover — mortiño, lulo, panela, curuba, guanábana,
almíbar.

### Project status

It works and it's used in the field, but it's early. Honestly:

- ✅ Both modules built, tested, and deployable.
- ✅ The CVA affective score formula is validated against
  `sca.coffee/cuppingscore` across 5 cases (±0.1).
- ⚠️ **The Spanish strings are not yet the official SCA ones.** They are
  native-speaker working translations, pending review against the
  SCA-103-S/2024 standard. See `notes/`.
- ⚠️ No authentication yet (v1 is single-user).
- ⚠️ The cultivation and harvest links don't exist yet.

**Contributors wanted** — especially farmers, cuppers, and agronomists who can
tell us where the software doesn't match reality on the farm.

### Setup

Requires **Node ≥ 20** and a [Supabase](https://supabase.com) project (free tier
is enough).

```bash
git clone https://github.com/ssttuuddiioo/seed-to-cup-apps.git
cd seed-to-cup-apps
npm install
cp .env.local.example .env.local   # then fill it in
```

Variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...        # public, used by the app
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...       # server-only, used solely by `npm run seed`
```

Apply the migrations in `supabase/migrations/` (0001 → 0004) in order via the
Supabase dashboard SQL editor. Then load reference data and start:

```bash
npm run seed
npm run dev
```

### Commands

```bash
npm run dev                 # dev server
npm run build               # production build (needs Node >= 20)
npx tsc --noEmit            # typecheck

npm run test:scoring        # validates the CVA score formula
npm run test:fermentacion   # validation + CSV export
npm run verify:lexicon      # verify each seed file
npm run verify:regions      #   (also: varieties, processes,
npm run verify:origen-descriptors  #   origen-descriptors)
```

`npm run lint` is not configured. The real gate is `tsc --noEmit` plus
`next build`.

### Layout

```
app/
  sessions/            # cupping: wizard, evaluate, physical, reveal, card
  fermentacion/        # fermentation: list, new, detail (offline)
lib/
  scoring.ts           # CVA affective score formula + tests
  results.ts           # panel aggregation, 8-axis radar
  reference.ts         # typed reference-data fetchers
  fermentacion/        # db, sync, store, validation, csv, print
  i18n/                # es.json / en.json — Spanish is the default
seed/                  # lexicon, regions, varieties, processes, descriptors
scripts/               # a verifier per seed file
supabase/migrations/   # 0001–0004
docs/research.md       # background research (reference)
OVERVIEW.md            # current technical map of the app
```

Stack: Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · Supabase
· IndexedDB.

### Contributing

Contributions are welcome in Spanish or English — you do not need to write
English to take part.

Most useful right now:

1. **Spanish review** against the official SCA-103-S/2024 standard (see `notes/`).
2. **Local descriptors** from other origins — the SCA lexicon doesn't cover what
   is grown and tasted outside the US and Europe.
3. **The missing links** — cultivation, harvest, drying.
4. **Telling us what breaks in the field.** One report from a farm with no
   signal is worth more than any new feature.

Before opening a PR: `npx tsc --noEmit`, `next build`, and the tests should pass.

### License

[Apache-2.0](LICENSE). Use it, modify it, sell it, run it for your cooperative.
Just keep the license notice.

The *Coffee Value Assessment* standards belong to the
[Specialty Coffee Association](https://sca.coffee); the sensory lexicon to
[World Coffee Research](https://worldcoffeeresearch.org). This project
implements them, does not replace them, and is not affiliated with either.
