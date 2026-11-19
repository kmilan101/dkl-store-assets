# DKL store assets

Shared design and code for the Doodle Kids Land stores:

- **US store:** doodlekidsland.com (USD)
- **India store:** in.doodlekidsland.com (INR, planned)

Both stores load the same files from here. Change a file in `src/`, push, and both sites update.

## How it works

1. Edit a file in `src/`.
2. Push to `main`.
3. GitHub runs **Build, safety test, publish** (see the Actions tab):
   - **Build:** joins and shrinks the files. It stops on JavaScript errors, on files over their size budget, or on snippets over Payhip's 65,535-character box limit.
   - **Safety test:** uses saved copies of real store pages in `tests/fixtures/`. Payhip's Cloudflare blocks robots from the live site, as it should. Each page is opened on desktop and mobile, twice: once with the code that's published now, once with the new build. It stops if there are new errors, missing DKL elements, a different page height, or more than 1% of the screen looking different. Screenshots are kept for 14 days. With no saved pages yet, only the build checks run.
   - **Publish:** only if every check passed. Files go to the `gh-pages` branch and are served at `https://kmilan101.github.io/dkl-store-assets/`. A mirror copy on jsDelivr is refreshed as a backup.
4. Visitors get the new files within about 10 minutes, which is the browser cache time.

**Changing a Payhip box** (rare): before switching, Claude checks the live pages side by side in a real Chrome window, once with the current code and once with the new code.

## What lives where

| Folder | What | Loaded by |
|---|---|---|
| `src/store.css` | Main store styling (was Payhip's Store CSS box) | `@import` in Payhip's Store CSS box |
| `src/head/*.css` → `head.css` | Header styles (cursor butterfly, mega menu, contact) | Payhip header code |
| `src/head/*.js` → `head.js` | Header scripts (SEO helpers, icons, prices, cursor, finder filter, nav line, logo) | Payhip header code |
| `src/foot/*` → `foot.css`, `foot.js` | Mobile drawer, search, header icons, cart drawer, footer signup, footer sky | Payhip footer code |
| `src/inline/` | Kept in Payhip on purpose: GTM, Meta Pixel guard, hero preload, meta tags (must run first) | Pasted into Payhip |
| `src/runtime/prelude.js` | Detects the store (`DKL.store` = `US` or `IN`, `<html data-dkl-store>`) and loads the mirror if store.css failed | Start of head.js |

**Store-specific styling:** use `html[data-dkl-store="IN"] .thing { … }` in CSS, or `if (DKL.store === 'IN')` in JS.

## Payhip boxes (same on both stores)

After a build, `dist/payhip/` holds the exact text for Payhip's three boxes:

- `store-css-box.css`
- `header.html`
- `footer.html`

You only paste these again when `src/inline/` changes. Normal edits never need Payhip.

## Rules

- Never edit code inside Payhip. Edit it here.
- Every design change starts in Figma first (DKL website rule), then code.
- Each file in `src/head` and `src/foot` runs in its own safety wrapper, so one broken file can't stop the others.
- To roll back, revert the commit and push. The previous version is live again in about 10 minutes.
- The Payhip code from before this repository is backed up on the SSD in `13 - Website (Payhip store)/06 - Embed Code/_backup-live-2026-11-19/`.
