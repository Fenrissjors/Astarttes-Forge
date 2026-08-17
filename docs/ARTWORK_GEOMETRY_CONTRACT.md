# Astartes Forge Artwork Geometry Contract v1.2

## Authority
Blood Angels remains the immutable geometry/composition master. Ultramarines is used only as an approved positive calibration reference for normal title-zone texture. It does not redefine geometry.

## Production canvas
Every production frame is exactly 2480 × 3508 px, portrait and full bleed. Native 1447 × 2048 source/reference frames may be checked in auto mode and receive `PASS_SOURCE_ONLY`; they are not production-ready until exported at 2480 × 3508. Use `--production` to enforce production resolution.

## Central opening
The canonical opening remains the frozen Blood Angels alpha geometry. v1.2 does not loosen the v1.1 opening tolerance.

Native Blood Angels opening bbox: **x 249–1199, y 334–1921**.

## Formal title safe zone
The frozen title-safe mask remains unchanged.

Native Blood Angels title-safe bbox: **x 201–1245, y 131–276**.

### v1.2 calibration
v1.1 measured high-contrast edges across the whole title-safe mask. That incorrectly penalized the approved Ultramarines frame because normal blue/gold frame detail near the perimeter entered the metric.

v1.2 therefore validates two nested regions inside the same frozen title-safe mask:

- **core**: 6 native pixels further inset; allows at most 1.5% strong-edge pixels;
- **deep core**: 10 native pixels further inset; allows at most 0.25% strong-edge pixels.

This preserves the original safe-zone geometry while distinguishing perimeter decoration/texture from a real shield, cross, skull, badge, chain or other high-contrast device entering the live title field.

## Points safe zone
The frozen points-safe zone remains unchanged: **x 1058–1245, y 132–276** in native master coordinates. It receives the same core/deep-core obstruction test as the title zone.

## Outer contour
All four candidate edges must remain fully opaque (`alpha >= 250`). Unexpected transparent edge pixels fail validation.

## Validator
Install dependencies:

```bash
python -m pip install pillow numpy
```

Source/reference validation:

```bash
python tools/validate_artwork_geometry.py path/to/frame.png
```

Production validation:

```bash
python tools/validate_artwork_geometry.py --production path/to/frame.png
```

Statuses:

- `PASS` — valid production-size frame;
- `PASS_SOURCE_ONLY` — valid 1447 × 2048 source/reference geometry, but not a production export;
- `FAIL` — one or more contract requirements failed;
- `ERROR` — invalid input/configuration.

## Calibration evidence
v1.2 was calibrated against:

- Blood Angels master: PASS_SOURCE_ONLY, zero title/deep-core obstruction;
- approved Ultramarines frame: PASS_SOURCE_ONLY, title core ~0.819%, title deep core 0%, points core ~0.602%, points deep core 0%;
- synthetic central obstruction test: FAIL because title deep-core obstruction exceeded the 0.25% blocking threshold.

## Detection, not correction
The validator only detects violations. It never clips, fills, masks, scales or modifies artwork to force a pass.

## Change control
Blood Angels remains the only geometry authority. Positive calibration references may tune detection logic but may never redefine the frozen opening, title or points masks.
