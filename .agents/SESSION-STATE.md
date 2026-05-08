# trakt-boxed build state

Active autonomous build. After context compaction, read this file plus the
remaining build items below, then continue committing.

## Brief recap

trakt-boxed is a mobile-first, Letterboxd-flavoured Trakt client forked
from trakt-web. Tagline: "Your movie diary on Trakt." Reference repo:
https://github.com/Hobo-Ware/trakt-time. Letterboxd research at
`../letterboxd-research/` (read `notes/SUMMARY.md` first).

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

## Next, in order

Each bullet = one or more atomic conventional commits. Stop only when
context is exhausted, not after each item.

5. **Mobile shell** — bottom nav (Films / Diary / Lists / Profile),
   page-level cover hero pattern, `summary-*` shared classes in
   `style/components.css`.
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

- 21–22 pre-existing test failures (date-fixture related on
  toRelativeHumanDay / AirDateTag / MediaDetails / mapToConfirmation /
  formatSortValue). Not regressions — present before treeshake.
- VIP analytics events (`VipUpsell`, `VipUpgrade`, `VipManage`,
  `VipCancel`, `BannerDismiss`) are now dead code; safe to remove in a
  later sweep but don't block builds.
- Letterboxd research lives at `../letterboxd-research/`; sample 4–5
  screenshots before any visual call.

## Dev commands

- Tests: `cd projects/client && deno run -A npm:vitest run`
- Dev server: `deno task client:dev` from repo root
- Install: `deno task install`
