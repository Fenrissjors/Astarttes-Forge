#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
node tests/scripts/verify-libraries.js
node tests/scripts/verify-chapter-visual-registry.js
node tests/scripts/verify-runtime-hardening.js
node tests/scripts/verify-artwork-print-renderer.js
python3 tests/scripts/verify-golden-frame-standard.py
python3 tests/scripts/validate-frames.py
python3 tests/scripts/audit_rosz.py
python3 tests/scripts/audit-chapter-scope.py
node --check src/core/app.js
node --check src/libraries/rules/rules-library.js
node --check src/libraries/keywords/keyword-library.js
node --check src/libraries/chapters/chapter-visual-registry.js
node --check src/libraries/chapters/decoration-pack-library.js
node --check src/libraries/art/a4-frame-engine.js
printf '\nPASS: Gold Master audit complete, including A4 Golden Frame Standard.\n'
