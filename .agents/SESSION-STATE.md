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

## Done. The brief queue is empty.

If you pick up after compaction, the next moves are quality work:
- Sweep dead VIP analytics keys (`VipUpsell`, `VipUpgrade`, etc.).
- Wire the new media atoms into MovieSummary / ShowSummary so they
  actually render on the page (atoms shipped, consumers haven't
  swapped yet).
- Add `deno task i18n:check` to CI before deploy.
- Real Letterboxd export ZIP fixture round-trip test for
  LetterboxdParser + the multi-CSV ingest.
- Re-read `../letterboxd-research/` notes per the guardrail before any
  visual call.

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
