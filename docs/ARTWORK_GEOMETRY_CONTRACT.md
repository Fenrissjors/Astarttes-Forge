# Astartes Forge Artwork Geometry Contract v1.1

## Authority
Blood Angels is the immutable geometry/composition master. The master geometry is stored as exact compressed masks in `config/artwork-master-geometry-v1.1.json`.

## Production canvas
Every production frame is exactly 2480 × 3508 px, portrait and full bleed.

## Central opening
The canonical opening is the 8-connected `alpha <= 128` component containing the transparent pixel nearest the centre of the supplied Blood Angels master. The exact native mask is frozen in the master geometry file. New frames may change decoration but may not change this functional silhouette beyond the validator tolerance.

Native Blood Angels opening bbox: **x 249–1199, y 334–1921**.

## Formal title safe zone
The title field is now a separate formal geometry zone. Because the parchment is opaque, it cannot be extracted from alpha. It was derived once from the Blood Angels master using a deterministic light/low-chroma component rule and then inset with two 13×13 binary erosions. The resulting mask is frozen for contract v1.1.

Future chapter frames do **not** redefine the title zone using their own colours. The validator checks the fixed master zone for opacity and excessive high-contrast edges. This makes centrally crossing shields, skulls, crosses, badges, chains and equivalent obstructions mechanically detectable while allowing subtle chapter-specific texture.

Native Blood Angels title-safe bbox: **x 201–1245, y 131–276**.

## Points safe zone
The points area is a separate formal sub-zone: the rightmost 18% of the frozen title-safe-zone bounding box, intersected with the title-safe mask.

Native points-safe bbox: **x 1058–1245, y 132–276**.

## Outer contour
All four production-canvas edges must remain fully opaque (`alpha >= 250`). Unexpected transparent edge pixels fail validation.

## Validator
Install the two small dependencies and run:

```bash
python -m pip install pillow numpy
python tools/validate_artwork_geometry.py assets/art/<chapter>/frames/<frame>.png
```

The validator checks:

- exact 2480 × 3508 production canvas;
- closed/opaque outer contour;
- central-opening mask mismatch against the frozen Blood Angels master;
- title-safe-zone opacity;
- title-safe-zone high-contrast edge density;
- points-safe-zone opacity;
- points-safe-zone high-contrast edge density.

It emits JSON and exits with `0` for PASS, `1` for FAIL and `2` for input/config errors.

## Detection, not correction
The validator owns detection only. A failed artwork frame must be regenerated or reworked. The validator must never clip, fill, reshape or silently alter artwork in order to make it pass.

## Change control
The frozen masks belong to contract v1.1. Chapter decoration can evolve without changing the contract. Any intentional functional geometry change requires an explicit new contract version.
