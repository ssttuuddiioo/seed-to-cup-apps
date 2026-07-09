-- Full CVA (101–105) — schema additions
--
-- The CVA standards have different ownership:
--   * 101 Physical is a per-coffee measurement (FNC grade, screen size,
--     moisture, defect counts, broca, roast/quakers). One reading per sample,
--     not per cupper — so it lives on `samples`.
--   * 103 Descriptive and 104 Affective are per-cupper and already have
--     `evaluations.descriptive` / `evaluations.affective` / `evaluations.score`.
--   * 105 Extrinsic is a per-cupper impression of the coffee's extrinsic value
--     (provenance, certifications, claims) — so it joins the evaluation row.
--
-- Both columns are jsonb (form shape evolves with the SCA standard) and
-- nullable (a sample may be cupped before its physical grading is entered).

alter table cupping.samples
  add column if not exists physical jsonb;

alter table cupping.evaluations
  add column if not exists extrinsic jsonb;
