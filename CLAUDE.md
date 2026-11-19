# Working in dkl-store-assets

Shared code for the Doodle Kids Land Payhip stores (doodlekidsland.com in USD, in.doodlekidsland.com in INR). README.md explains the system; read it first.

Rules:
- Never edit code inside Payhip. Change `src/`, push to `main`, and let the workflow build, test and publish.
- DKL website rule: every visual change is designed in Figma first, then coded here.
- Things that change often (categories, popular searches, special product ids per store) belong in `src/data/*.json`, not in scripts. Scripts read them through `DKL.site`, `DKL.id()` and `DKL.link()`.
- New features go in a new numbered file in `src/head/` or `src/foot/`. Don't append to unrelated files.
- No emoji on the website; icons come from the Anron set.
- Run `npm run build` before pushing. It must pass with no errors.
- If a change touches `src/inline/` (the Payhip boxes), Milan must paste the new `dist/payhip/*` snippets into both stores. Check live pages side by side in Chrome before and after.
- Live code from before this repo is backed up on the SSD: `13 - Website (Payhip store)/06 - Embed Code/_backup-live-2026-11-19/`.
- Product changes (Payhip, not code): after every product update, check the live product in BOTH stores right away (US, and India once live) against the master product sheet, then log it in the sheet's Change log. Milan chose this over a weekly check (19 Nov 2026).
