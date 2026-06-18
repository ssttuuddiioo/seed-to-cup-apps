# Design references

Stitch (or Figma export) PNGs that anchor implementation prompts. Paste the relevant screen image into Claude Code along with the build prompt — gives the model a concrete reference instead of having to interpret prose.

## Conventions

- One subdirectory per flow (e.g. `session-setup/`, `descriptive/`, `affective/`, `producer-card/`).
- Inside each: filenames `<screen>-<viewport>.png` — e.g. `screen-1-detalles-tablet-1024.png`, `screen-1-detalles-phone-390.png`.
- Keep the source brief next to the images as `brief.md` so future-you knows what was asked for.
- PNGs only. Don't commit `.fig` files unless they're small and stable.

## Status

| Flow | Brief | Tablet (1024) | Phone (390) | Implemented |
|---|---|---|---|---|
| Session setup (3 screens) | pending | — | — | — |
| Descriptive (CVA 103) | not started | — | — | — |
| Affective (CVA 104) | not started | — | — | — |
| Reveal | not started | — | — | — |
| Producer card | not started | — | — | — |
