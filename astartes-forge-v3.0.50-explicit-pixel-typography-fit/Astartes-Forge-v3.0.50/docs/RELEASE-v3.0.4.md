
# Astartes Forge v3.0.4 — Render Pipeline Repair

## Fixed
V3.0.3 normalized Chapter Art Pack slots from an array into a named object,
but the legacy `applyDecorationPack()` renderer still called `.map()` on that
value. The exception occurred while every datasheet was being created, which
also left Theme Preview and print output empty.

V3.0.4 makes both slot formats valid and keeps legacy ornament aliases and the
new A4 Frame Engine compatible.

## Failure isolation
Artwork is now optional at runtime. If a Chapter artwork layer fails, the live
datasheet still renders and remains printable. The card records
`data-art-frame-error` for diagnostics instead of crashing the render pipeline.

## Developer helper
`runRenderPipelineSelfCheck()` reports renderer/library availability, rendered
card count, preview shells and frame errors.

No ROSZ parsing, rules, weapons, provenance or verification semantics changed.
