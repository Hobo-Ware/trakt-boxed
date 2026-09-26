# trakt-boxed build ledger

The anchor for every session. Read this first, then `PLAN.md`.

- `PLAN.md` - page map, decisions (all signed off 2026-09-26), delight layer
  (2a), performance budget (2b), zero layout shift (2c), build order (8).
- `designs/*.dc.html` - the signed-off mockups (source of the canvas at
  https://claude.ai/artifact/6hxF9ouBogKi1sYkwPpJot). Build each page to its
  board. `designs/STYLE.md` has the tokens and component rules the boards use.
  Twist boards (`Twist-A*`, `Twist-C*`, `Twist-B-mobile`) show the delight
  layer, applied within the 2b budget.
- `research/` - Trakt route/feature inventory, full API map, measured API
  timings. Letterboxd screenshots and notes live outside the repo in
  `~/Git/Hoboware/letterboxd-research/` (too large to commit).

## Rules for every session

1. Pick the next unchecked item below. Build it to its design board.
2. **Presentation only.** The technical architecture is inherited from trakt-web
   1:1, never reinvented: models, HTTP requests (`defineQuery`, mappers, Zod
   schemas, offline queue), authorization, theming (light / dark / system +
   seasonal), localization (Paraglide, 28 locales, RTL), query client, feature
   state, stores and utils are imported from `$lib` (=
   `projects/client/src/lib`) and route hooks via `$clientRoutes`. Never fork or
   rewrite them in boxed; never change their behaviour in `projects/client`.
   Two client edits are allowed: additive i18n keys (`boxed_*`) in
   `projects/client/i18n/meta/en.json`, and uplifting an `_internal` file one
   folder up unchanged so boxed may import it. New components use only semantic theme tokens
   (`--color-*`, palette vars), never raw hex, so light, dark and seasonal
   themes all keep working.
3. No fan-out requests, nothing slow above the fold (PLAN 2b).
4. Every async region has a same-size skeleton. Measure CLS with the harness
   (`~/Git/Hoboware/letterboxd-research/harness/shoot.ts`,
   `SLOW='/api/trakt/'`), target 0.00, fail above 0.01.
5. Verify: `deno task check` (boxed), unit tests, desktop + mobile screenshots
   compared against the board.
6. Replace the page's `legacy-mount` wrapper folder under `src/routes` with real
   files; run `deno task boxed:mirror` afterwards so nothing is lost.
7. One conventional commit per verified item; update this ledger in the same
   commit (status, commit sha, CLS numbers).

## Status

Legend: `[ ]` todo, `[~]` in progress, `[x]` done (commit).

### Wave 1 - foundation

- [x] Boxed app shell, legacy mounts, top bar, mobile tab bar (`35cf5361f`)
- [x] Tokens: state colours in `app.html` (Newsreader title face moves to wave 3, loaded only once a page uses it)
- [ ] Poster tile: 3-state outline, show progress bar, hover drawer, long-press
      (board `Posters`)
- [ ] Shared primitives: section header, poster row/grid, skeletons, stars
      display, page container, backdrop hero

### Wave 2 - logging

- [x] Log composer - film (board `Log-film`): diary toggle, date (now / release / other / unknown), check-in, rewatch chip, stars with popcorn and rotten tomato, like, review + spoiler (5 word minimum), private note, lists via the shared lists drawer (board shows inline chips; drawer reused instead)
- [x] Log composer - episodes (board `Log-episode`): opens on the first unfinished season, episode chips, one rating for all or each, optional season rating, review on the last selected episode
- [x] Log sheet - mobile + tab bar Log button + top bar `+ Log` + poster menu Log (board `Log-mobile`); search-first picker with an up next suggestion. CLS 0.0000; save flows verified end to end (request log in the wave 2 commit)

### Wave 3 - films

- [ ] Film page `/movies/[slug]` (boards `Film`, `Film-mobile`, `Twist-A`), incl. backdrop hero + Newsreader
- [ ] Engagement tabs `/movies/[slug]/{reviews,members,lists}` (board `Facet`)
- [ ] Your activity `/movies/[slug]/activity`

### Wave 4 - shows

- [ ] Show page `/shows/[slug]` (boards `Show`, `Show-mobile`, `Twist-A`,
      `Twist-A-mobile`)
- [ ] Season page `/shows/[slug]/seasons/[n]` (board `Season`)
- [ ] Episode page `/shows/[slug]/seasons/[n]/episodes/[e]` (boards `Episode`,
      `Episode-mobile`)
- [ ] Show engagement tabs + activity

### Wave 5 - home and discovery

- [ ] Landing `/` (board `Landing`)
- [ ] Home `/home` (boards `Home`, `Home-mobile`, `Twist-C`, `Twist-C-mobile`)
- [ ] Films / Shows landing (board `Browse`)
- [ ] Charts + facet grids (board `Browse-grid`)
- [ ] Calendar (board `Calendar`)
- [ ] Search (board `Search`)
- [ ] Person page (board `Person`)

### Wave 6 - profile

- [ ] Profile (boards `Profile`, `Profile-mobile`)
- [ ] Diary (boards `Diary`, `Diary-mobile`, `Twist-B-mobile`)
- [ ] Films / Shows watched (board `Watched-grid`)
- [ ] Watching (board `Watching`)
- [ ] Watchlist (board `Watchlist`)
- [ ] Profile lists (board `Profile-lists`)

### Wave 7 - lists and reviews

- [ ] Lists browse (board `Lists-browse`)
- [ ] Single list (board `List`)
- [ ] List editor (board `List-editor`)
- [ ] Reviews browse (board `Reviews-browse`)
- [ ] Review page (board `Review-page`)

### Wave 8 - social and stats

- [ ] Activity (board `Activity`)
- [ ] Network, likes, profile reviews (template)
- [ ] Stats (board `Stats`)
- [ ] Year / month in review reskin

### Wave 9 - settings and static

- [ ] Settings profile + import (board `Settings`)
- [ ] Other settings pages (reskin)
- [ ] Onboarding `/welcome` (board `Onboarding`)
- [ ] VIP, about, legal, FAQ, 404 (reskin)

### Wave 10 - rigor

- [ ] Skeleton + empty state audit on every page (CLS table)
- [ ] RTL (fa-IR, ar-SA) pass
- [ ] Accessibility pass (keyboard, contrast, labels)
- [ ] i18n: every `boxed_*` key has translations
- [ ] Remove all remaining legacy mounts
- [ ] Port the shared layer into boxed 1:1: `git mv` the non-UI parts of
      `projects/client/src/lib` (requests, models, features state, stores,
      utils, i18n, paraglide) plus hooks, worker and static into
      `projects/boxed`, unchanged; point `$lib` at the new location; delete
      `projects/client`
