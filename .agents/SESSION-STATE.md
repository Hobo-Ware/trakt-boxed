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
6. `chore(scripts): drop i18n meta generator and e2e harness` — removed
   the orphaned i18n meta generator + .scripts/, dropped pre:dev/
   prebuild/pretest/test:e2e tasks. Bundled in this same commit:
   bottom-nav rewire to Films/Diary/Lists/Profile + new
   `button_label_films` and `button_label_diary` keys across all 20
   locale JSONs (translated for de/fr/es/it/pt-br/nl/ja/zh-cn/ru/pl;
   English fallback elsewhere).

## Next, in order

Each bullet = one or more atomic conventional commits. Stop only when
context is exhausted, not after each item.

5. **Mobile shell** — DONE: bottom nav rewired, page-level cover hero
   pattern + summary-* shared classes (`style/components.css`),
   Fraunces wired as the serif for `.summary-title-serif` /
   `.trakt-responsive-title`. Diary route still points at `/history` —
   repoint when the dedicated diary route lands.
6. **Movie summary page** with shared atoms from day one: `MediaCoverHero`,
   `MediaPoster`, `MediaRating`, `MediaGenres`, `MediaActionsRow`. Build
   the atoms upfront — don't ship duplicates and refactor later.
7. **Diary** — chronological log with date headers, inline star rating,
   review snippet. The marquee feature.
8. **Lists** with create-inline pill. Mirror trakt-time's
   `CreateListPill` flow: POST `/users/me/lists`, invalidate
   `List.Created`, optimistic UI.
9. **Reviews** — Letterboxd's "review" is Trakt's "comment" with a star
   rating attached. Surface comments as reviews, sort by likes by
   default, inline thread expansion.
10. **More-options sheet** — `[label] + circular icon button` pattern
    beside the watch toggle (NOT a chunky bordered text pill — we
    learned that already). Sheet handles rating, favorite, watchlist,
    lists, mark-as-watched, create list. Pipe `watchedProps` so the
    sheet can mark-as-watched in place.
11. **Profile** — avatar upload + crop, gear icon next to the username
    row when `isOwner`, NO duplicate gear at the bottom.
12. **Settings** — TV Time importer (history + watchlist) plus the
    Liberator extension CTA on both the import block and the login
    gate. Single `TvTimeLiberatorCta.svelte` with default + compact
    variants.
13. **i18n sync helper** — write `scripts/sync-i18n.ts` that ensures
    every locale carries the full key set (translated where listed,
    English fallback elsewhere). Run after every feature.

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
  (Paraglide reads them directly). When adding strings, edit ALL 20
  locale files in lockstep; a sync helper at `scripts/sync-i18n.ts` is
  still TODO (item 13).

## Dev commands

- Tests: `cd projects/client && deno run -A npm:vitest run`
- Dev server: `deno task client:dev` from repo root
- Install: `deno task install`
