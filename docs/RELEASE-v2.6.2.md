# Astartes Forge v2.6.2 — Context-Aware Validation

Maintenance release on top of the Structure-Aware Data Model.

## Fixed
- The precision validator now recognises objective-range terminology as a valid core-rules concept.
- Phrases such as `within range of a Vowed objective` and `within range of an objective marker` no longer require a fabricated inch distance.
- Genuine vague uses of `within range` without an objective context are still flagged.
- No roster, Rules Library, datasheet, attachment, weapon or print data is changed by this release.

## Intent
Validation should detect missing precision, not rewrite valid Games Workshop rules terminology.
