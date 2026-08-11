#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
node tests/scripts/verify-libraries.js
python tests/scripts/audit_rosz.py
node --check src/core/app.js
node --check src/libraries/rules/rules-library.js
node --check src/libraries/keywords/keyword-library.js
printf '\nPASS: Gold Master audit complete.\n'
