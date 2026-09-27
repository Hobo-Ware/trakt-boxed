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

- [x] Film page `/movies/[slug]` (boards `Film`, `Film-mobile`, `Twist-A`), incl. backdrop hero + Newsreader with a metric-matched Georgia fallback: ambient colour from the poster, action card (log / like / watchlist / rate, join prompt signed out), where to watch, share, ratings histogram with external ratings, cast / crew / details / genres / releases tabs, popular reviews with spoiler cover, sentiment pros and cons, trivia (VIP count / upsell), friends who watched, extras, soundtrack, popular lists. CLS 0.0000 desktop + mobile, slow and fast
- [x] Engagement tabs (board `Facet`): `/movies/[slug]/reviews` with Reviews (popular / recent), Watching now and Lists tabs via `?tab=`, plus a your review card. `/movies/[slug]/lists` and `/related` are still legacy mounts. CLS 0.0000 desktop, 0.0002 mobile (web font swap on a tab label)
- [x] Your activity (kept at the existing `/history/movies/[slug]`, `/history/shows/[slug]` and `/history/shows/[slug]/seasons/[n]/episodes/[e]` URLs the action cards link to): title header with poster, then the profile diary table / mobile cards filtered to that title (`DiaryList` gained an optional `id`). One title request plus the history request. CLS 0.0000

### Wave 4 - shows

- [x] Show page `/shows/[slug]` (boards `Show`, `Show-mobile`, `Twist-A`, `Twist-A-mobile`): title kit hero, action card, up next card with progress (mark watched / check in), seasons strip with per-season progress, network / status / airs info, ratings, reviews, cast. Ratings-by-episode chart and the mobile episode list left out (one request per season). CLS up to 0.0001
- [x] Season page `/shows/[slug]/seasons/[n]` (board `Season`): season header on the show backdrop, season switcher, episode rows (still, number, title, air date, rating, watched toggle), mark season watched, season rating. No season rating chart, friends or cast (no request / internal hook). CLS 0.0000
- [x] Episode page `/shows/[slug]/seasons/[n]/episodes/[e]` (boards `Episode`, `Episode-mobile`): real page instead of the drawer redirect, still hero, show breadcrumb, prev / next, action card logging that episode, ratings, reviews, guest cast, more from the season. No reaction chips. CLS up to 0.0001
- [x] Show engagement tabs: `/shows/[slug]/reviews` via the shared reviews facet (reviews / watching now / lists). Show-level comments only (the request has no season / episode scope). Activity route still open (see wave 3). CLS up to 0.0004 mobile (web font swap on tab labels)

### Wave 5 - home and discovery

- [x] Landing `/` (board `Landing`): the client's spotlight backdrop, poster stack and login / get started buttons inside the boxed layout, serif three-line headline, trending posters, six feature tiles, Letterboxd / TV Time import card, footer. Popular reviews left out (slow endpoint, PLAN 2b). CLS 0.0000
- [x] Home `/home` (boards `Home`, `Home-mobile`, `Twist-C`, `Twist-C-mobile`): greeting + streak, Just watched rail and New from friends (both from the one friends feed request, no per-friend calls), Up next cards with one-tap mark watched, then viewport-gated Start watching, Out this week, Popular, Recommended. Popular reviews from friends is left out: no cheap endpoint (PLAN 2b). CLS 0.0000 desktop + mobile, slow and fast, scrolled
- [x] Films / Shows landing (board `Browse`): `/discover` with a Movies / Shows / Both switch (writes `?mode=`), the shared filter drawer and seasonal toggle, Trending up front, Popular / Anticipated / Recommended viewport-gated, genre chips. CLS 0.0000. Open: in the harness the Recommended row never settles when recommendations come back empty; check with a real account
- [x] Charts grid (board `Browse-grid`): `/discover/{trending,popular,anticipated,recommended}` 8-column poster grid with infinite scroll (next page appended below). Genre facets use `?genres=` on the chart instead of `/films/genre/x` paths. CLS 0.0000
- [x] Calendar (board `Calendar`): serif title, mode switch, episode-type toggles and filters, week strip with today highlighted and prev / next / today, day groups with time, still, episode code, premiere / finale chip and network. CLS <= 0.0002
- [x] Search (board `Search`): big search field bound to `?q=`, mode tabs (media / shows / movies / people / lists), result rows (posters, round headshots, lists with owner + count), Top Searches for an empty query. CLS 0.0000
- [x] Person page (board `Person`): round headshot, known for, birthday / age / death, two-line bio with read more, IMDb / Wikipedia / social links, department tabs (known for first, then by count), Movies / Shows switch with counts, you've seen X of Y bar and hide watched (signed in), sort (popular / newest / oldest), poster grid that reserves room for every credit and reveals 48 at a time. Two credit requests, no per-item calls. CLS 0.0000, up to 0.0005 from the web font swap on tab labels. `/people/[slug]/{movies,shows,history}` are still legacy mounts

### Wave 6 - profile

- [x] Profile (boards `Profile`, `Profile-mobile`): cover banner, identity (avatar, name, VIP, bio, location, member since), stat strip, profile tabs, favorites, currently watching, recent activity, ratings histogram (average / most given), this month's diary, year heatmap. Left out (no cheap data): recent reviews, popular lists, year in review card. CLS up to 0.0002 (serif swap on stat numbers)
- [x] Diary (boards `Diary`, `Diary-mobile`, `Twist-B-mobile`): month-grouped table on desktop, ticket-stub cards and binge piles on mobile, same-day episodes grouped with expand, rewatch / review markers, edit opens the log composer. Year / rated-only / sort filters and the review column skipped. CLS 0.0000
- [x] Films / Shows watched (board `Watched-grid`): `/profile/[slug]/films` and `/shows` poster grids with completed / progress badges. Filters skipped. CLS 0.0000
- [x] Watching (board `Watching`): up next (reuses `UpNextCard`), in progress, dropped, completed tabs. Owner only (client hooks return the viewer's data); tab counts and now-watching banner skipped. CLS 0.0000
- [x] Watchlist (board `Watchlist`): headline counts and poster grid. Owner only; on my services, reorder and coming soon skipped. CLS 0.0000
- [x] Profile lists (board `Profile-lists`): personal / collaborations / liked / smart lists via the shared `ListCardGrid`. Sidebar skipped. CLS 0.0000

### Wave 7 - lists and reviews

- [x] Lists browse (board `Lists-browse`): your lists (4, signed in) and popular lists as poster-fan cards with owner, count, likes, two-line description; grid reserves its rows while loading. CLS 0.0000
- [x] Single list (board `List`): owner, title (one line), two-line description slot, count, list actions, media/shows/movies switch, poster grid with rank numbers for ranked lists, infinite scroll. Progress ring dropped (needs every page); comments not shown (no read hook). CLS 0.0000
- [x] List editor (board `List-editor`): full pages at `/lists/new` and `/users/[user]/lists/[list]/edit` with name, description, public / private, save / create, cancel, and reorder via the shared reorder drawer. Owners get an Edit link on their list page (desktop; the list menu covers mobile), and Create list on `/lists` goes to the new page. Ranked toggle, per-item notes and in-editor search left out: the shared list requests do not support them. List action bar reworked so buttons appearing after load move nothing. CLS 0.0000
- [ ] Reviews browse (board `Reviews-browse`): BLOCKED. Needs `comments/trending` and `comments/recent`, which have no request in the shared layer; adding one is outside presentation-only. Revisit once the requests are ported or the rule is relaxed
- [x] Review page (board `Review-page`): `/comments/[id]` is now a real page instead of a redirect: poster with log / where to watch, review by (avatar, VIP), title and year, stars and date, full markdown body via the shared `CommentBody` (spoilers, GIFs), likes, replies thread (read only), reply opens the existing thread drawer, popular reviews rail for films and shows. List reviews still redirect. Reactions, follow, sort and inline reply form skipped (their components are internal to the client comments module). CLS 0.0000 desktop, up to 0.0054 mobile when long text re-wraps on the web font swap

### Wave 8 - social and stats

- [x] Activity (board `Activity`): `/social/activity` with Friends / You tabs, day groups, poster + who + what + stars + time ago, movies / episodes filter. The friends feed only carries watches (no review / list / like / follow events); no incoming tab (requests live on Network). CLS 0.0000 (up to 0.0008 mobile fast, font swap)
- [x] Network, likes, profile reviews (template): `/profile/[slug]/social` (following / followers / requests, follow buttons), `/profile/[slug]/favorites` (movies / shows / liked lists), `/profile/[slug]/reviews` (rating, date, spoiler cover, likes, replies). No liked-reviews tab (no hook). CLS 0.0000
- [x] Stats (board `Stats`): `/profile/[slug]/stats` with totals, weekly / by-year bars, genres, countries, decades, milestones, highest rated, top people (lazy, one request per role), list progress. The dev API answers 403/426 for the year-in-review data every block after the totals needs, so real data shows totals plus a notice; the full layout was checked with injected data. CLS 0.0000 (0.0003 with injected data)
- [ ] Year / month in review reskin: left on the client pages (purple identity kept). Year pages 0.0003 to 0.0006; month in review is over the limit (0.03 desktop, 0.06 mobile) inside the client's 2024 template, which is outside the allowed edits

### Wave 9 - settings and static

- [x] Settings profile + import (board `Settings`): settings shell with side nav (chips on mobile), profile form (avatar, cover reset, display name, location, about, private) saving only changed fields, import cards (Letterboxd first) above the client import / export section. Website, favourites pickers, currently-watching / public-watchlist switches and backdrop chooser left out (no client support). CLS 0.0000
- [x] Other settings pages (reskin): general, account, data, advanced, plex, preview, connected apps, streaming services wrapped in the shell. `settings/apps/**/+page.ts` redirects stay mounted. CLS up to 0.0007 (streaming select widening)
- [x] Onboarding `/welcome` (board `Onboarding`): chromeless welcome hero on a colour-tile poster wall, import step, finish, skip. Only the client's import step exists, so favourites / follow steps and the step indicator are left out. CLS 0.0000
- [x] VIP, about, legal, FAQ, 404 (reskin): serif headings, fixed reading column on legal pages, rebuilt error pages (poster wall + serif title), VIP keeps purple. `vip/renew` still mounted (needs a helper two folders deep in `_internal`). CLS 0.0000 except about 0.0004, privacy 0.0034, faq 0.0087, and terms mobile 0.0184 (over the limit: long paragraphs re-wrap when Roboto replaces the metric-matched Arial fallback; the client page measured 0.0323). Options: `display=optional` for the body font, or accept

### Wave 10 - rigor

- [ ] Skeleton + empty state audit on every page (CLS table)
- [x] RTL (fa-IR, ar-SA) pass: no physical-side CSS in boxed (logical properties throughout, directional icons mirror via `trakt-icon-directional`, binge pile uses `--rtl-sign`). Home, film, show, person, review, lists, diary shot in fa-IR on both viewports: layout mirrors correctly, CLS up to 0.0013 (Persian font swap). Harness takes `LOCALE=<code>` (sets `trakt-locale`)
- [x] Accessibility pass: axe (WCAG 2 A / AA) over 14 key pages. Fixed two contrast failures (person type counts, diary month ribbon year). One open, left for a product decision: the inherited viewport tag sets `user-scalable=no` (axe critical: zoom disabled)
- [ ] i18n: every `boxed_*` key has translations. All keys live in `projects/client/i18n/meta/en.json` with descriptions; translations arrive through Crowdin (`crowdin.yml` reads en.json and opens a PR). Needs the source upload once this branch is the translation source; not done from here because the Crowdin project is shared with production
- [ ] Remove all remaining legacy mounts
- [ ] Merge the title rail list card (`title/_internal/ListCard`) into `lists/ListCard` as a variant
- [ ] Port the shared layer into boxed 1:1: `git mv` the non-UI parts of
      `projects/client/src/lib` (requests, models, features state, stores,
      utils, i18n, paraglide) plus hooks, worker and static into
      `projects/boxed`, unchanged; point `$lib` at the new location; delete
      `projects/client`
