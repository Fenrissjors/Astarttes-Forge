# Astartes Forge Artwork Geometry Contract v1.0

## Authority
The Blood Angels master frame is the immutable geometry and composition reference for all chapter artwork frames.

## Production canvas
- 2480 x 3508 px
- A4 portrait
- Full bleed
- Outer contour closed and flush to all four edges

## Functional geometry
Every chapter frame must preserve the Blood Angels master's title zone, central datasheet opening silhouette, panel area, side intrusions and lower opening boundary. Chapter identity may change decoration, materials, heraldry and colour, but may not alter functional geometry.

## Title zone
The title area is one uninterrupted clear zone for dynamic renderer text. No central cross, shield, skull, badge, chained ornament, parchment strip, heraldic device or equivalent decoration may cross it.

## Points zone
The upper-right points area must remain visually clear and readable.

## Central data opening
The central opening is reserved for dynamic datasheet panels. It must match the master silhouette and may not be narrowed, filled or obstructed by chapter decoration.

## Artwork-only rule
The PNG contains decorative artwork only. No chapter name, helper panels, translucent title plates, beige overlays, semi-transparent guides or renderer content may be baked into the asset.

## Validation model
Validation is based on the master alpha mask plus fixed landmarks/safe zones. It must validate the final raster, not merely inferred layout values. A chapter asset is accepted only if its production canvas, outer contour, central opening, title zone and points zone satisfy this contract.

## Source vs production resolution
The supplied Blood Angels reference raster is 1447 x 2048. It defines the approved design and normalized geometry. Production assets are 2480 x 3508, so geometry is mapped through normalized coordinates rather than copying source pixels directly.

## Change control
The geometry contract is versioned. Changes to chapter decoration do not require a contract revision. Any intentional change to functional geometry requires an explicit new contract version and must never happen implicitly while generating a chapter frame.
