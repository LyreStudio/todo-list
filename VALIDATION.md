# Validation — 2026-10-14

Windows x64, Node 24.19.0, real Playwright Chromium. Original MIT license and per-file upstream SHA-256 checked at pinned commit.

- npm test passes: every public file loads; private/config, .env, .git, .lyre, traversal and writes are denied; HEAD has no body.
- Browser checks pass: task add, reload persistence, completion, keyboard deletion, literal text rendering, malformed-storage preservation. Desktop 1440×1000 and compact 390×844 have no horizontal overflow or script errors. No external resource request occurred.
- Representative browser screenshots are in screenshots/. Touch is Chromium emulation; no physical-device or installed Lyre binary acceptance is claimed.

No account, sync, production hosting or native application is supplied. The drawing canvas is not autosaved; task data is local to the browser.
