# Astartes Forge v3.0.28 — Stability Repair

This release focuses on restoring and hardening the standalone app runtime.

## Fixes
- Removes the hard dependency on `crypto.randomUUID()` by adding a compatible ID generator.
- Makes all persisted JSON state tolerant of corrupt or stale localStorage entries.
- Makes core event bindings null-safe so one missing optional control cannot stop initialization.
- Adds startup recovery handling instead of allowing a single exception to kill the complete interface.
- Keeps the current Space Wolves, Ultramarines and Blood Angels chapter artwork registry intact.
