# trakt-boxed build state

Active autonomous build. After context compaction, read this file plus the
remaining build items below, then continue committing.

## Brief recap

trakt-boxed is a mobile-first, Letterboxd-flavoured Trakt client forked
from trakt-web. Tagline: "Your movie diary on Trakt." Reference repo:
https://github.com/Hobo-Ware/trakt-time. Letterboxd research at
`../letterboxd-research/` (read `notes/SUMMARY.md` first).

**Stretch goal (per user, 2026-05-08):** trakt-boxed should be
"letter-boxed that has also shows and slightly better design". Lean
into episode-tracking as first-class alongside films, and make the
visual treatment more refined than Letterboxd's defaults — Fraunces
serif for media titles instead of Tiempos, the three-state poster
outline applied consistently, and the diary spreadsheet gracefully
collapses to mobile cards with the verb-coded glyphs.

**When you don't have what you need: re-read the research.** If
context has been compacted and a visual decision is unclear, open
`../letterboxd-research/notes/<surface>.md` and the matching mobile
screenshot before guessing. Brief is in `notes/SUMMARY.md`; per-surface
notes (film-summary, profile-diary, film-reviews, single-list, etc.)
include color samples, typography, and mobile-vs-desktop deltas.

## Done

1. `refactor(treeshake): drop unreachable upstream features` — dropped
   vip/upsell/promotions/player/plex/spoilers/team + e2e + cucumber +
   i18n/meta. Kept notes/, report/, portal/ (it's a body-portal util,
   not watch-now).
2. `chore(brand): rename trakt-web to trakt-boxed` — worker name, PWA
   manifest, page title, Sentry project, README.
3. `feat(brand): add trakt-boxed accent tokens` — `--tboxed-positive`
   (#00b020), `--tboxed-rating` (#ff8000), `--tboxed-network` (#40bcf4)
   in `style/palette/tboxed.css`.
4. `ci: pin Wrangler 4.88.0 and persist projects/client/.npmrc`.
5. `docs(planning): record trakt-boxed session state for autonomous resume`.
6. `chore(scripts): drop i18n meta generator and e2e harness` —
   bundled with the bottom-nav rewire to Films/Diary/Lists/Profile +
   `button_label_films` / `button_label_diary` across 20 locales.
7. `feat(shell): cover hero pattern and summary-* shared classes` —
   `style/components.css` + Fraunces serif for media titles.
8. `feat(media): trakt-boxed media atoms` — MediaCoverHero, MediaPoster
   (3-state outline via useMediaWatchState), MediaRating, MediaGenres,
   MediaActionsRow. No barrel; consumers import directly from each
   file.
9. `feat(diary): chronological diary surface at /diary` — calendar
   tile cards with films + episodes interleaved, mobile bottom nav
   Diary tab now points at /diary.
10. `feat(lists): inline create-list pill on personal lists` — fast-add
    flow that hits useSaveList + List.Created invalidation; full
    SaveListDrawer still owns the description/privacy path.
11. `feat(reviews): surface comments as Reviews` — list_title_reviews
    key + lowercase "watched" eyebrow on each review header.
12. `feat(media): Favorite in the more-options popup`.
13. Profile — verified upstream already meets the brief (gear next to
    username when isOwner via SettingsButton, ProfileImageCropDialog
    wired into ProfileImage isEditable, no duplicate gear).
14. `feat(import): make Letterboxd primary; drop TV Time path; ship
    export CTA` — LetterboxdExportCta.svelte (default + compact),
    compact variant ships in Landing + MobileLanding next to the
    LoginButton. TV Time parsers + tvtime ImportSource gone.
15. `build(i18n): add sync-i18n script for locale parity` —
    `deno task i18n:check` / `deno task i18n:sync`. Currently reports
    parity across all 21 locales.
16. `feat(brand): trakt-boxed mark, PWA icons, and OG card` — gradient
    rounded-square mark with serif "tb", PWA icon set re-rendered via
    inkscape, 1200x630 OG card with safe-area composition.
    DEFAULT_SHARE_COVER pinned to og-card.png.
17. `feat(media): wire MediaGenres into the movie/show summary
    surfaces` — pill row drilldowns into the corresponding /movies or
    /shows catalog filtered by genre.
18. `docs(rules): add infra and i18n agent rules` — Cloudflare worker
    invariants, /v3/users/me vs typed @trakt/api distinction, the
    edge-crop guideline, paraglide-as-canonical i18n, sync workflow,
    snake_case naming.
19. `refactor(nav): drop /discover landing; pivot side nav to Films /
    Shows / Diary` — Letterboxd has no cross-media discover. Sub-routes
    /discover/popular etc. stay alive; the landing page is gone.
    UrlBuilder.discover() removed; MediaGenres + CtaButton route to
    /movies or /shows directly.
20. `feat(profile): Letterboxd-style stat row on the user banner` —
    isMe-only for now; films / this year / lists / following with
    deep links per cell. Hairlines between cells, tracked uppercase
    labels, large numerals.
21. `refactor(lists): tighten list-card poster collage` — 12 posters
    layered with ~30% slice per poster, left-anchored z-stack, smaller
    corner radius. Cascades through every list-summary surface.
22. `feat(theme): swap dark theme to Letterboxd slate palette` — page
    bg --shade-940 (#131517), surface --shade-900, link/emphasis/
    streak/heatmap/sentiment/toggler/chart-hover all swap from
    purple to --tboxed-positive. Profile-details radial drops the
    purple-950 bath in favour of slate.
23. `feat(lists): tracked-uppercase section labels` — every
    SectionList header now carries 11px bold uppercase tracked titles,
    replacing the body-weight mixed-case heading.
24. `feat(theme): halve the border-radius scale` — xs/s/m/l/xl/xxl all
    drop to roughly half their trakt-web values; posters become film
    cells, cards become slabs, the brand mark stays a touch curved.
25. `feat(films): poster-only grid for popular / trending /
    anticipated` — FilmsPosterGrid renders just posters in a 4-up
    mobile / 7-up desktop layout with an in-viewport sentinel for
    infinite paging. Wired into the three discover sub-routes.
26. `feat(profile): centred Letterboxd-flavour banner` — avatar
    centred, display name in Fraunces 26-32px serif, location
    underneath, page actions floated to the top-right corner.
27. `feat(lists): editorial detail header for single-list pages` —
    ListDetailHeader renders the byline + serif title + full
    description on /users/[user]/lists/[list] and /lists/official/
    [list]. Drops the tooltip-clamped duplicate inside the list body.
28. `feat(nav): rebuild chrome as a Letterboxd top ribbon` — three-dot
    logo (orange/green/blue) + thin top nav with Films / Lists /
    Members / Journal + search + avatar. Replaces SideNavbar /
    TopNavbar / MobileNavbar dispatch with a single LetterboxdNav.
29. `feat(landing): rebuild anonymous home and sign-in as Letterboxd
    surfaces` — single-column page with cinematic backdrop hero,
    serif tagline, single green CTA, two decorative poster strips,
    six-tile feature grid. /sign-in is a centred slate card with the
    three-dot mark, Fraunces headline, single OIDC-bridging CTA.
30. `feat(routes): profile sub-tabs + /members/popular + /journal` —
    ProfileSubTabs ride the 11-tab horizontal sub-row on every
    profile, /members/popular shows the user network in member-row
    rhythm, /journal renders popular movies + shows as editorial
    cards on a steel-blue canvas with Fraunces headlines.
31. `feat(summary): Letterboxd-flavour hero on movie + show pages` —
    LetterboxdMediaHero replaces the dual MediaSummary /
    MediaSummaryV2 dispatch. Cinematic backdrop bleed, 220px poster,
    Fraunces title at 32/44/60px, eyebrow + entity type, brand-green
    "DIRECTED BY" / "CREATED BY" credit links. Films and shows
    siblings on the same hero.
32. `feat(lists): numbered Letterboxd grid on single-list detail` —
    LetterboxdListGrid replaces section-list rendering on both
    /users/[user]/lists/[list] and /lists/official/[list]. Tabular-
    numeral rank pill bottom-left, 4-up mobile / 7-up desktop,
    infinite-scroll sentinel.
33. `fix(media): unalias $state rune collision in MediaPoster` —
    the watch-state observable was destructured into `state`,
    which collided with the Svelte 5 `$state` rune at the
    `$state ?? "none"` site and broke the dev build. Renamed to
    `watchState` so the auto-subscription reads as `$watchState`.
34. `feat(summary): Letterboxd summary block library` — eight
    stateless blocks under `_internal/`: LetterboxdMetaRow (year /
    runtime / cert / status / trailer), LetterboxdSynopsis
    (uppercase tagline + collapsible overview),
    LetterboxdRatingsHistogram (10-bucket green bar chart + score),
    LetterboxdCastChips (24-up grid + show-all),
    LetterboxdGenreChips (translated chips routed into /movies or
    /shows), LetterboxdDetailsPanel (studio / country / language /
    runtime), LetterboxdEpisodeHero (greenfield episode hero),
    LetterboxdSummaryStack (max-width container), LetterboxdSubTabs
    (parked anchor strip).
35. `feat(summary): rewrite movie / show / episode pages from
    scratch` — visual layouts entirely new on top of the unchanged
    useMovie / useShow / useEpisode data hooks. Movie + show share
    hero -> meta-row -> tagline + synopsis -> ratings histogram ->
    cast chips -> genre chips -> details panel -> sentiment ->
    comments -> related -> popular lists. Shows layer SeasonList
    above the static blocks. Episode is greenfield with a "From
    <Show>" breadcrumb eyebrow, season/episode pills, and the
    same synopsis/ratings/cast cadence.
36. `feat(search): rewrite results as a Letterboxd row feed` —
    LetterboxdSearchResults + LetterboxdSearchRow replace the
    poster grid with a single column of rows: poster left,
    title + year right, alt-title hint, entity meta chip
    (FILM / SHOW / PERSON / LIST + country + runtime, or list
    byline + count). Same SearchItem contract; useSearch
    untouched.
37. `feat(home): Letterboxd-style welcome banner above
    dashboard` — Fraunces serif greeting (Good morning/afternoon/
    evening + first name) on top of an editorial eyebrow showing
    today's date in green plus "your trakt-boxed journal".
    Dashboard tracking surfaces (UpNext, WatchList, etc.) stay
    intact below the banner.
38. `feat(summary): from-scratch Letterboxd summary block
    library` — nine new blocks each hitting the underlying Trakt
    queries directly with no SectionList wrapping. Replaces the
    Comments / Lists / RelatedList / VideoList / Sentiment /
    SeasonList trakt-web rails entirely:
    LetterboxdSummaryShell (desktop two-column shell + cinematic
    backdrop), LetterboxdHeroBlock (eyebrow + Fraunces title),
    LetterboxdReviewCard + LetterboxdReviewStack (Popular +
    Recent vertical review feeds), LetterboxdRelatedStrip (flat
    3/4/6-up grid), LetterboxdPopularLists (5-poster collage list
    cards stacked), LetterboxdSeasonsRail (show seasons grid),
    LetterboxdWhereToWatch (BLU / RENT / BUY / FREE / 4K pills),
    LetterboxdSignInCard (anonymous-only right-rail CTA).
39. `feat(summary): rebuild movie / show / episode pages around
    new shell` — every trakt-web rail removed from
    MovieSummary / ShowSummary / EpisodeSummary. Each surface is
    now a composition of the new block library on the two-column
    shell, with a sign-in CTA + where-to-watch right rail. Movie
    and show share the same flow; show inserts a SeasonsRail;
    episode keeps the cinematic still as backdrop with a "From
    <Show>" breadcrumb eyebrow and S/E pills. Drops the unused
    videos / sentiment props from the +page.svelte files.

## Done. The brief queue is empty (and then some).

If you pick up after compaction, the next moves are still quality:
- Sweep dead VIP analytics keys (`VipUpsell`, `VipUpgrade`, etc.).
- Wire the remaining media atoms (MediaCoverHero, MediaPoster with
  state, MediaActionsRow, MediaRating) into surfaces beyond the
  summary — diary cards, poster grids, lists.
- Add a per-user stats query so the profile stat row works for
  arbitrary users, not just isMe. Same query unlocks a followers
  count.
- Per-film engagement sub-tabs: /movies/[slug]/members,
  /movies/[slug]/lists. The Reviews drawer already exists; Members
  and Lists are the missing pair.
- Member directory route /members/popular/this-week — entirely
  missing as a surface; needs both a query and a row component.
- Search results: re-author as a mixed-entity row feed
  (research/notes/search.md). Today still uses the Trakt section
  layout; the row treatment with poster + title + alt-titles + green
  director chip is the Letterboxd signature.
- Numbered rank overlay on single-list poster grid items (1, 2, 3
  ...). Today they render unranked — Letterboxd's curated lists are
  ordered editorial artifacts.
- Add `deno task i18n:check` to CI before deploy.
- Real Letterboxd export ZIP fixture round-trip test for
  LetterboxdParser + the multi-CSV ingest.
- Re-read `../letterboxd-research/` notes per the guardrail before any
  visual call. Surfaces still un-redesigned: homepage hero (anonymous
  / authed both), search results, single-list detail, member directory
  (entirely missing as a route), film cast/crew tabs.

## Hard guardrails

- Conventional commit prefixes (`feat`, `fix`, `chore`, `refactor`,
  `docs`, `style`, `test`, `perf`, `ci`, `build`). Never `i18n:` or
  `wip:`.
- Atomic commits.
- No emoji in files or commit messages.
- Heredoc commit bodies; verify with `git log -1 --format=%B` for
  leaked backslashes.
- Every new user-visible string lands in `i18n/messages/en.json` AND
  propagates to all 20 locales. Real translations in de, fr, es, it,
  pt-br, nl, ja, zh-cn, ru, pl; English fallback explicitly in the
  rest.
- bits-ui: `[data-disabled]` not `:disabled`; wrap selectors in
  `:global(...)`.
- Cover-hero crops on small viewports — verify centred composition
  survives 5–10% edge crop.
- `/v3/users/me/...` endpoints are me-only optimisations; arbitrary
  user slugs go through the typed `@trakt/api` contract.

## Known baseline

- 21 pre-existing test failures (date-fixture related on
  toRelativeHumanDay / AirDateTag / MediaDetails / mapToConfirmation /
  formatSortValue). Not regressions — present before treeshake. Stable
  across all commits in this session.
- VIP analytics events (`VipUpsell`, `VipUpgrade`, `VipManage`,
  `VipCancel`, `BannerDismiss`) are now dead code; safe to remove in a
  later sweep but don't block builds.
- Letterboxd research lives at `../letterboxd-research/`; sample 4–5
  screenshots before any visual call.
- Vitest must be run from `projects/client/` so the `$lib`/`$test`
  aliases resolve.
- `i18n/messages/{locale}.json` files are now the i18n source of truth
  (Paraglide reads them directly). When adding strings, edit
  `en.json` then run `deno task i18n:sync` to fan English fallbacks
  into the other 20 locales. `deno task i18n:check` is the CI check.
- No barrel files (`index.ts` re-exports). Import each component or
  function from its own path.

## Dev commands

- Tests: `cd projects/client && deno run -A npm:vitest run`
- Dev server: `deno task client:dev` from repo root
- Install: `deno task install`
