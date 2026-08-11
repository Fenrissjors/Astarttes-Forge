# Astartes Forge v2.8.0 — Chapter Scope & First Founding Expansion

Print-first Warhammer 40,000 army companion for New Recruit `.rosz` rosters.

## Run

Open `index.html` in a modern browser, import a New Recruit roster in **Army Forge**, review Datasheets / Rules & Stratagems, then use **Forge Army Pack**.

## What changed in v2.8.0

New Recruit remains the authority for roster legality and catalogue availability. Astartes Forge now preserves that availability as **detachment scope metadata** instead of assuming that every Space Marine detachment is generic.

Added and verification-enabled:

- Generic Adeptus Astartes: Armoured Speartip, Bastion Task Force, Ceramite Sentinels, Headhunter Task Force, Orbital Assault Force.
- Ultramarines: Blade of Ultramar, Reclamation Force.
- Imperial Fists: Emperor's Shield.
- Salamanders: Forgefather's Seekers.
- Iron Hands: Hammer of Avernii.
- Raven Guard: Shadowmark Talon.
- White Scars: Spearpoint Task Force.

The scope registry is organisational/diagnostic only. It does **not** second-guess New Recruit legality.

## Supported verification modules

- Generic Adeptus Astartes — 15 detachments
- Space Wolves — 7 detachments
- Blood Angels — 8 detachments
- Dark Angels — 8 detachments
- Black Templars — 6 detachments
- Ultramarines — 2 detachments
- Imperial Fists — 1 detachment
- Salamanders — 1 detachment
- Iron Hands — 1 detachment
- Raven Guard — 1 detachment
- White Scars — 1 detachment

**Total: 51 verification detachments.**

## Project structure

```text
Astartes-Forge-v2.8.0/
├── index.html
├── assets/
│   └── css/
├── src/
│   ├── core/
│   └── libraries/
│       ├── attachments/
│       ├── chapters/
│       ├── editions/
│       ├── keywords/
│       ├── reference/
│       ├── rules/
│       └── units/
├── tests/
│   ├── rosters/
│   │   ├── generic/
│   │   ├── space-wolves/
│   │   ├── blood-angels/
│   │   ├── dark-angels/
│   │   ├── black-templars/
│   │   ├── ultramarines/
│   │   ├── imperial-fists/
│   │   ├── salamanders/
│   │   ├── iron-hands/
│   │   ├── raven-guard/
│   │   └── white-scars/
│   ├── audit/
│   └── scripts/
├── docs/
├── CHANGELOG.md
├── KNOWN_ISSUES.md
└── ROADMAP.md
```

## Regression checks

```bash
node tests/scripts/verify-libraries.js
python tests/scripts/audit_rosz.py
python tests/scripts/audit-editions.py
python tests/scripts/audit-structure.py
python tests/scripts/audit-chapter-scope.py
```

See `docs/RELEASE-v2.8.0.md` for release details.
