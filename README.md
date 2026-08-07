# Astartes Forge v2.4.4 — Datasheet Structure

Print-first Warhammer 40,000 army companion for New Recruit `.rosz` rosters.

## Run

Open `index.html` in a modern browser, import a New Recruit roster in **Army Forge**, review Datasheets / Rules & Stratagems, then use **Forge Army Pack**.

## Project structure

```text
Astartes-Forge-v2.4.4/
├── index.html
├── assets/
│   └── css/
├── src/
│   ├── core/
│   └── libraries/
│       ├── attachments/
│       ├── chapters/
│       ├── keywords/
│       ├── reference/
│       ├── rules/
│       └── units/
├── tests/
│   ├── rosters/
│   ├── audit/
│   └── scripts/
├── docs/
│   ├── audits/
│   └── releases/
├── CHANGELOG.md
├── KNOWN_ISSUES.md
└── ROADMAP.md
```

## Gold Master checks

```bash
node tests/scripts/verify-libraries.js
python tests/scripts/audit_rosz.py
```

See `docs/releases/README-v2.4.4.md` and `docs/audits/GOLD-MASTER-AUDIT.md` for details.
