# Roadmap

v3.0.18 freezes the working v3.0.17 print layouts and establishes the Unified Chapter Visual Registry as the artwork pipeline.

Next priorities:

- Create and approve seamless A4 frames for Ultramarines, Blood Angels, Dark Angels, Black Templars, Imperial Fists, Salamanders, White Scars, Raven Guard and Iron Hands.
- Add each approved image only by filling that Chapter profile's `artwork.a4Frame` slot.
- Keep A5 artwork-free and preserve the dedicated A5 datasheet layout.
- Move Chapter emblems to local assets in a later pass so printing no longer depends on remote heraldry URLs.
- Continue content verification independently from visual work.

Architecture rule:

> New Recruit decides what the roster can contain. The Chapter Visual Registry decides how the detected Chapter is presented. The shared renderer must remain Chapter-agnostic.
