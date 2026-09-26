# trakt-boxed: full inventory of projects/client (for the Letterboxd-style redesign)

Generated 2026-09-26 from `main` @ 383cb54dd. Read-only recon; paths relative to `projects/client/src` unless noted.

Contents:
1. Routes part A: root, home, movies, shows, seasons/episodes, media redirects, discover, people, search, calendar, history, comments, lists (official/smart)
2. Routes part B: profile, users/*, settings/*, vip, welcome, social, static pages, api/SEO endpoints, _design_system (excluded)
3. lib/features, lib/sections, lib/guards
4. lib/requests by domain (API paths), keyword scan, Trakt-unique vs Letterboxd matrix
5. Shows depth, current design system (tokens, navbar, components, rating widget), i18n

NOTE: memory index says "redesign waves 1-4 done", but that is stale. The June redesign commits were dropped when the repo was re-synced with trakt-web, so main is effectively stock trakt-web (see section 5, B.0).

---

# Route inventory (part A)

App root: `projects/client/src/routes`. Components referenced relative to `src/lib` unless noted.

## Conventions / gating primitives (read first)

- **`TraktPage audience=...`** (`sections/layout/TraktPage.svelte`) wraps every page. Content renders only for that audience. Client-side redirects: `audience="authenticated"` page viewed anonymously -> `<Redirect to="/">` (landing); `audience="public"` page viewed while logged in -> `/home` (keeps search). Robots: `all`/`public` indexable, everything else `noindex`. Also emits OG/JSON-LD (movie/show/episode get generated OG image).
- **Server redirect** `redirectForAudience` (`features/auth/redirectForAudience.ts`): only used by `/` (public) and `/home` (authenticated). 307, keyed on session-cookie presence, skipped for data requests.
- **`RenderFor audience`** (`guards/_internal/RenderForAudience.svelte`): `all`; `authenticated` (authorized + user loaded); `public` (anonymous); `vip`; `free` (authed non-VIP); `director` (or dev). Also `device` (`mobile`, `tablet-sm`, `tablet-lg`, `desktop`) and `input` gates.
- **`RenderForFeature flag`** (`guards/RenderForFeature.svelte`): flag must be on AND audience (default `vip`, else `director`). Flags (`features/feature-flag/models/FeatureFlag.ts`) default ON only for director accounts (localStorage overrides win). So flag-gated UI = effectively director+VIP unless manually toggled.
- **Summary drawers** are URL-driven: `?view=<SummaryDrawers value>` (+ `comment_id` / `season` / `episode`), parsed by `sections/summary/summaryDrawerNavigation.ts`, rendered by `sections/summary/SummaryDrawer.svelte`.
- Responsive split everywhere on summary pages: **V2** components (`.../v2/...`) on `mobile`/`tablet-sm`, classic components on `tablet-lg`/`desktop`.

---

## Root

| Path | What it shows | Key components | Auth | Type |
|---|---|---|---|---|
| `+layout.server.ts` | Loads theme, OIDC auth (`token`, `expiresAt`, `isAuthorized`, `hasSession`), `isBot`, `isLegitimateBot`, device type, typesense config | `features/auth/hasAuthSession.ts`, `isAuthorizedToken.ts` | n/a | - |
| `+layout.ts` | Creates TanStack `QueryClient` (IDB persister when available, mutation cache, retry 3, no focus/reconnect refetch), sets token | `features/query/_internal/createIdbPersister.ts`, `createMutationCache.ts` | n/a | - |
| `+layout.svelte` | Provider stack: Error, QueryClient, GlobalParameter(+Escaper for crawlers), Bot, Auth, FeatureFlag, YouTube Player, Analytics, Redirect, Navigation, NavigationHistory, Locale(+SettingSync), Search(typesense), Filter, Cover, Toast, Confirmation, EditMode, Theme, ListScrollHistory, Spotlight. Global hosts: `MarkAsWatchedDrawerProvider`, `ManageListsDrawerProvider`, `ActionToastHost`, `AddNoteDrawerProvider`, `ReportDialogProvider`, `CoverImage`, `SeasonalFlair`. Navbars: `TopNavbar` (mobile/tablet-sm), `SideNavbar` (desktop/tablet-lg), page content, `MobileNavbar` (mobile/tablet-sm). Authed only: `NavbarToastContent` (now-watching/check-in toast), `OfflineSync`. Always: `LoginErrorSnackbar`, `EmailUnsubscribeSnackbar`, `PageView` (keyed on pathname). Dev: Devtools / QueryDevtools. onMount: deploy SHA check -> worker cache bust. | `sections/navbar/{TopNavbar,SideNavbar,MobileNavbar}.svelte`, `sections/toast/NavbarToastContent.svelte`, `features/offline/OfflineSync.svelte` | all | - |
| `/` (`+page.server.ts`, `+page.svelte`) | **Landing** (anonymous). Server 307 -> `/home` if session cookie present. Navbar hidden, `mode="content-only"` (no footer). Landing: hero (spotlight backdrop, logo, `LoginButton`, platforms chip, hero title/subtitle, `GetStartedButton`, `SpotlightStack` carousel), `LandingPillars`, `LandingApps`. | `sections/landing/Landing.svelte` + `components/{GetStartedButton,LoginButton,LandingPillars,LandingApps,SpotlightBackdrop,SpotlightStack}.svelte` | `public` (server + client redirect to /home when logged in) | - |
| `/home` (`home/+page.server.ts`, `+page.svelte`) | **Dashboard**. Server 307 -> `/` if no session. Global filter scope, navbar with discover content toggle (media/show/movie) + filters. Order: `TraktPageCoverSetter`, `Banner` (authed: Welcome, TvTime, TvTimeImport banners; VIP: ReviewBanners; promotion banners), `UpNextList` (continue watching), `WatchList intent="start"` (start watching), `StreakCallout` (streak count + heatmap accumulator, link to streak drawer; hideable in edit mode), `UpcomingList` (calendar items + episode type toggles), `RecommendedList`, `PersonalHistoryList` (recently watched), `ActivityList` (social activity), `DashboardDrawer` (URL drawer: Streak). Lists show CTA items when empty. | `sections/banner/Banner.svelte`, `sections/lists/progress/UpNextList.svelte`, `lists/watchlist/WatchList.svelte`, `stats/StreakCallout.svelte`, `lists/UpcomingList.svelte`, `lists/recommended/RecommendedList.svelte`, `lists/history/PersonalHistoryList.svelte`, `lists/activity/ActivityList.svelte`, `dashboard/DashboardDrawer.svelte` | `authenticated` (server + client) | both (mode toggle) |
| `+error.svelte` | 404 -> `Error404Page`; else `ErrorStatusPage` with message | `pages/errors/Error404Page.svelte`, `ErrorStatusPage.svelte` | all | - |

---

## Movies

| Path | What it shows | Key components | Auth | Type |
|---|---|---|---|---|
| `/movies` | **Redirect** 301 -> `/discover?mode=movie` | `+page.ts` | - | movie |
| `/movies/anticipated` | **Redirect** 301 -> `/discover/anticipated?mode=movie` | `+page.ts` | - | movie |
| `/movies/popular` | **Redirect** 301 -> `/discover/popular?mode=movie` | `+page.ts` | - | movie |
| `/movies/recommended` | **Redirect** 301 -> `/discover/recommended?mode=movie` | `+page.ts` | - | movie |
| `/movies/trending` | **Redirect** 301 -> `/discover/trending?mode=movie` | `+page.ts` | - | movie |
| `/movies/[slug]` | Movie summary (see detailed breakdown below). `+page.ts` prefetches `movieSummaryQuery` (bots / `shouldPrefetch`). Authed: navbar `mode="minimal"`. Placeholder 100dvh block while loading. | `routes/movies/[slug]/useMovie.ts`, `sections/summary/MovieSummary.svelte` | all | movie |
| `/movies/[slug]/lists` | "Popular lists" containing the movie, paginated. Responsive navbar with discover toggle + header title. | `sections/lists/ListsPaginated.svelte`, `sections/navbar/ResponsiveNavbarStateSetter.svelte` | all | movie |
| `/movies/[slug]/related` | "Related movies", paginated grid. | `sections/lists/RelatedPaginatedList.svelte` | all | movie |

### Movie summary `/movies/[slug]` - sections in render order

Data (`useMovie.ts`): movie, intl, studios, crew (people), streamOn, videos, sentiment (**query only enabled when authorized**), youtubeSpecial (**authorized + `YouTubeSpecials` flag + comedy genre**).

`MovieSummary.svelte`:
1. `SummaryDrawer` (URL-driven drawer host, see drawer list below).
2. **Header** - mobile/tablet-sm: `components/media/v2/MediaSummary.svelte`; tablet-lg/desktop: `components/media/MediaSummary.svelte`.
   - Cover backdrop (`SummaryCover` / `CoverImageSetter`) using media colors.
   - Poster (`components/summary/SummaryPoster.svelte`) with `SummaryPosterTags`: watched/watch count (-> History drawer), started, rewatching, dropped, watchlisted, post-credits count. Desktop poster links to preferred streaming service or trailer; hover overlay `StreamOnOverlay` or `TrailerOverlay`.
   - `SummaryTitle`: title, main credit (director) link to person, subtitle (year/TBA, runtime, genre; shows use episode count), `DetailsButton` (-> Details drawer), translated status.
   - `RatingList`: Trakt (votes), IMDb, MAL (anime), Rotten Tomatoes critic + audience; drilldown -> Ratings drawer.
   - Authed: `SocialActivitiesButton` (avatar pill of friends' activity -> Social drawer).
   - Overview (spoiler-guarded: `Spoiler` desktop / `SpoilerSection` mobile).
   - Authed only: action bar `SummaryActionsBar` -> `MediaActions` = `TrackAction` (mark watched: opens mark-as-watched drawer, or confirm-remove if watched), `BookmarkAction` (`WatchlistAction`), `TrailerButton` (YouTube player), plus popup menu `MediaPopupActions`.
   - Authed only: `RateNow` (desktop, contextual action slot) / `SummaryRateNow` in navbar contextual actions (mobile) - both only when rateable (movie watched). RateNow = star scrub `RatingStars` (+ popcorn/rotten-tomato delight), queued tag, `FavoriteAction`.
   - Mobile only: `SideActions` (visible to all): `ShareButton`, `NotesButton` (only if user has notes -> Notes drawer).
3. Desktop only (inline in header's contextual column): `WhereToWatchList variant="inline"` + `Sentiment variant="inline"`.
4. mobile/tablet: `WhereToWatchList` (streaming services, JustWatch rank meta, drilldown -> Where-to-watch drawer; hidden if not aired) + `Sentiment` (community sentiment card; only renders when sentiment data exists -> effectively authed only; drilldown -> Sentiment drawer).
5. `CastList` "Actors" (drilldown -> Cast drawer).
6. `Comments` (section list: sort toggler, comment language select, `AddCommentAction` (authed) -> `AddReviewDrawerHost`; cards `CommentCard`; drilldown -> Comments drawer).
7. `VideoList` "Extras" (if videos; video-type dropdown; drilldown -> Videos drawer).
8. `SoundtrackList` - `RenderForFeature Soundtrack` (flag + VIP) and internally `RenderFor vip`; drilldown -> Soundtrack drawer. (`SoundtrackUpsell` for free/public is inside the VIP-gated block, so effectively unreachable.)
9. `RelatedList` "Related movies" (drilldown `/movies/[slug]/related`).
10. `Lists` "Popular lists" (tablet+/desktop: section list, drilldown `/movies/[slug]/lists`; mobile: single top `UserList` card).
11. `TriviaList` (up to 3 non-spoiler facts via `TriviaSummaryCard`; opens Trivia drawer).

`MediaPopupActions` (authed popup menu from action bar):
- Mark as watched again (`MarkAsWatchedAction mode="ask"`, only if already watched)
- Rewatching (shows only; `RenderForFeature Rewatching`) -> Rewatching drawer
- Add to list (`ListAction` -> global `ManageListsDrawer`)
- Share, Notes (via `SideActions`)
- Set cover image (`SetCoverImageAction`)
- History (`HistoryButton`, authed -> History drawer)
- Drop show (shows only, if not dropped)
- Report (authed -> `ReportDialog`)
- Moderate (`ModerateAction`, `director` only; opens admin URL)

Mark-as-watched drawer (global, `sections/media-actions/mark-as-watched/_internal/MarkAsWatchedDrawerHost.svelte`): **Check in** (`CheckInAction`, single media only), Watched now, Watched at release date, Other date (`HistorySlotDrawer` picker), Unknown date. After check-in may prompt rewatching.

### Summary drawers (shared by movie/show/episode; `sections/summary/SummaryDrawer.svelte`)

| Drawer (`SummaryDrawers`) | Content | Gate | Applies to |
|---|---|---|---|
| `sentiment` | `SentimentDrawer` (variant vip): VIP -> `SentimentContent`; free -> `SentimentUpsell` (anon: empty) | needs sentiment data (authed) | movie, show |
| `details` | `DetailsDrawer`: `MediaStats` (plays, watchers, lists, favorited), `MediaDetails` grid (show: airs, total runtime; premiere/expected, status, runtime, networks, creator/director, writer, country, language, original title, studio, genre, post-credits; episode: air date, network, runtime, episode type, credits, post-credits), `MediaLinks` (official / other links; not episode), `MediaParentalGuide` (`RenderForFeature ParentalGuide`; not episode) | all | all |
| `cast` | `CastDrawerHost`: search, cast/crew credit list | all | all |
| `videos` | `VideoDrawerHost`: grid + video type dropdown | all | movie, show |
| `trivia` | `TriviaDrawerHost` (variant vip): spoiler toggler, category filter; VIP list of `TriviaCard`; free -> `UpsellCta` | VIP content | movie, show |
| `soundtrack` | `SoundtrackDrawerHost` (VIP board, free upsell) | `RenderForFeature Soundtrack` | movie, show |
| `history` | `HistoryDrawerHost`: user's plays for this item (`HistoryList`) or placeholder | authed | all |
| `social` | `SocialDrawerHost`: summary header (activity count, friends' ratings) + `SocialActivityRow` list | authed | all |
| `notes` | `NotesDrawerHost` (Preview badge): user notes | (user-only entry point) | movie, show |
| `where-to-watch` | `WhereToWatchDrawerHost`: search, YouTube special tile, Plex library (authed + mobile), grouped streaming categories | all | all |
| `seasons` | `SeasonsDrawerHost`: season dropdown badge, season poster strip, tabs Episodes (`SeasonEpisodesTab`: authed `SeasonProgressCard`, episode grid) / Overview (`SeasonOverviewTab`: season info + cast) / Reviews (`SeasonReviewsTab`) | all | show, episode |
| `episode` | `EpisodeDrawerHost` (see Episode section) | all | show (and episode route) |
| `comments` | `CommentsDrawerHost`: full threaded comments (`ReviewsDrawerShell`), sort toggler + language select | all (posting authed) | all |
| `review` | `ReviewDrawerHost`: single comment + replies (deep link `?comment_id=`) | all | all |
| `ratings` | `RatingsDrawer`: Trakt `RatingsDistribution`, `SeasonRatingsChart` (shows), official ratings breakdown | all | all |
| `rewatching` | `RewatchingDrawerHost` | `RenderForFeature Rewatching` | show |

Comment actions (in cards/drawers): React (authed interactive; anon sees read-only reaction summary), Reply (authed), Add comment (authed), Edit/Delete (own), Report, reviewer stats tag (`RenderForFeature ReviewerStats`), spoiler switch, GIFs, markdown with spoilers.

---

## Shows

| Path | What it shows | Key components | Auth | Type |
|---|---|---|---|---|
| `/shows` | **Redirect** 301 -> `/discover?mode=show` | `+page.ts` | - | show |
| `/shows/anticipated`, `/popular`, `/recommended`, `/trending` | **Redirect** 301 -> `/discover/<cat>?mode=show` | `+page.ts` | - | show |
| `/shows/[slug]` | Show summary (below). Prefetch `showSummaryQuery`. If no `?season=`, client `goto(..., replaceState)` to active season (`findActiveSeason` using user's last watched season). Authed: navbar minimal. | `routes/shows/[slug]/{useShow,useShowVideos}.ts`, `sections/summary/ShowSummary.svelte` | all | show |
| `/shows/[slug]/lists` | Popular lists containing show (paginated) | `sections/lists/ListsPaginated.svelte` | all | show |
| `/shows/[slug]/related` | Related shows (paginated) | `sections/lists/RelatedPaginatedList.svelte` | all | show |
| `/shows/[slug]/seasons/[season]` | **Redirect** (client `<Redirect>`) -> `/shows/[slug]?season=N` | `components/router/Redirect.svelte` | - | show |
| `/shows/[slug]/seasons/[season]/episodes/[episode]` | **Redirect for humans**: `+page.ts` 307 -> `/shows/[slug]?view=episode&season=S&episode=E` (episode drawer on show page). Bots get the server-rendered `EpisodeSummary` page (SEO/OG). | `+page.ts`, `useEpisode.ts`, `sections/summary/EpisodeSummary.svelte` | all | show/episode |
| `/shows/[slug]/seasons/[season]/episodes/[episode]/related` | Related **shows** for the parent show (paginated; same as show related) | `RelatedPaginatedList type="show"` | all | show |

### Show summary `/shows/[slug]` - render order

Data (`useShow.ts`): show, intl, studios, crew, seasons, streamOn, sentiment (authed only), videos (`useShowVideos`). Networks = show network + distinct season networks (passed to Details drawer).

`ShowSummary.svelte`:
1. `SummaryDrawer` (with networks, videos, seasons, currentSeason).
2. Header: same as movie (V2 mobile / classic desktop). Differences: subtitle shows episode count instead of runtime; main credit = creator; poster tags link to History and Seasons drawers; popup adds Rewatching (flag) and **Drop** action; rateable only if user has watched any non-special episode; no youtube special.
3. Desktop inline: `WhereToWatchList` + `Sentiment`.
4. mobile/tablet: `WhereToWatchList` + `Sentiment`.
5. **`SeasonList`** (`sections/lists/season/SeasonList.svelte`): mobile/tablet-sm `SeasonPosterList` (if >1 season); `SeasonEpisodeList` for `currentSeason` (landscape episode cards, header `SeasonDropdown` on large screens, drilldown -> Seasons drawer; clicking an episode opens Episode drawer). Episode item popup (authed): mark watched (hybrid, gap-fill offer), "Watched until here" (bulk -> watch-until drawer), add to list. Season-level `SeasonActions`: mark season watched, add to list, report (authed).
6. `CastList`.
7. `Comments type="show"`.
8. `VideoList`.
9. `SoundtrackList` (flag + VIP).
10. `RelatedList` "Related shows".
11. `Lists` popular lists.
12. `TriviaList`.

### Episode (drawer on show page, or bot-only page)

**Episode drawer** (`components/episode-drawer/EpisodeDrawerHost.svelte`, reached via `?view=episode&season&episode`, e.g. from episode cards and the redirected canonical URL):
- Title = show title, meta = `SxE - episode title` (spoiler-guarded).
- `EpisodeInfoHeader`: `EpisodeInfoPoster` (spoiler-aware), swipe/prev/next episode links, season/episode number, `RatingList` (-> stacked Ratings), main credit; **authed**: `EpisodeActions` (`TrackAction` + popup `EpisodePopupActions`: mark watched again, add to list, share, set cover image, history, report, moderate[director]), `SocialActivitiesButton` (-> stacked Social), `RateNow` (when rateable, no favorite for episodes); overview (`SpoilerSection` + `ClampedText`).
- Tabs: **Info** (`MediaStats`, inline `WhereToWatchList` -> stacked Where-to-watch drawer, `DrawerCastSection`), **Reviews** (`EpisodeReviewsTab`), **Episodes** (`SeasonEpisodesTab` with season selector, authed progress card).
- Stacked (elevated) drawers: Ratings, Social, History, Where-to-watch; Review drawer elevated when `comment_id` present.

**Bot-rendered `EpisodeSummary.svelte`** (order): `SummaryCover` (show colors, spoiler image), header (V2 mobile `components/episode/v2/EpisodeSummary.svelte` / desktop `components/episode/EpisodeSummary.svelte`: poster + post-credits/watch tags, `EpisodeTitle`, `SummaryTitle`, `RatingList`, authed social pill, spoiler overview, authed `EpisodeActions` + `RateNow`), desktop inline `WhereToWatchList`, mobile/tablet `WhereToWatchList`, `CastList`, `Comments type="episode"`, `SeasonList` (current season only, current episode highlighted), `RelatedList` (related shows), `SummaryDrawer type="episode"` (drawer season from `?season`). No sentiment/videos/trivia/soundtrack/lists for episodes.

### Auth differences on media summaries (movie/show/episode)

| Element | Anonymous | Authenticated (free) | VIP | Director |
|---|---|---|---|---|
| Action bar (track/check-in, watchlist, trailer, popup) | hidden | yes | yes | + Moderate item |
| RateNow / favorite | hidden | when rateable | same | same |
| Social activity pill + drawer | hidden | yes | yes | yes |
| History drawer / button | hidden | yes | yes | yes |
| Sentiment section | hidden (query disabled) | card; drawer shows upsell | full drawer | full |
| Trivia section (3 facts) | yes | yes; drawer upsell | full drawer | full |
| Soundtrack | no | no | only with flag | flag defaults on |
| Parental guide (Details) | no | no | only with flag | flag defaults on |
| Rewatching action/drawer (shows) | no | no | only with flag | flag defaults on |
| YouTube special tile (comedy movies) | no | only with flag | only with flag | flag defaults on |
| Plex library row in Where-to-watch drawer | no | mobile only | mobile only | mobile only |
| Comments: add/reply/react | read-only (reaction summary preview) | yes | yes | yes |
| Share button (mobile side actions) | yes | yes | yes | yes |
| Report | hidden | yes | yes | yes |
| Season progress card / episode popup actions | hidden | yes | yes | yes |
| Navbar | default | `minimal` | `minimal` | `minimal` |

---

## Media redirects

| Path | Behavior |
|---|---|
| `/media/anticipated` | **Redirect** 301 -> `/discover/anticipated?mode=media` |
| `/media/popular` | **Redirect** 301 -> `/discover/popular?mode=media` |
| `/media/recommended` | **Redirect** 301 -> `/discover/recommended?mode=media` |
| `/media/trending` | **Redirect** 301 -> `/discover/trending?mode=media` |

## Discover

Mode (`media`/`show`/`movie`) comes from `useDiscover()` (`features/filters/useDiscover`), URL `mode` param.

| Path | What it shows | Key components | Auth | Type |
|---|---|---|---|---|
| `/discover` | Title/overview per mode. Global filter scope, discover content toggle, filters (hidden when seasonal filters on), header `SeasonalToggle`. Order: `TraktPageCoverSetter`, `TrendingList`, `ReleasesList` (landscape release calendar items, episode type toggles, drilldown `/discover/releases`), `AnticipatedList`, `PopularList`. Trending/anticipated/popular accept seasonal-theme filter overrides. | `sections/lists/trending/TrendingList.svelte`, `lists/ReleasesList.svelte`, `lists/anticipated/AnticipatedList.svelte`, `lists/popular/PopularList.svelte`, `features/theme/components/SeasonalToggle.svelte` | all (indexable) | both |
| `/discover/anticipated` | Header "Most anticipated" + mode meta + Share; filters; `AnticipatedPaginatedList` | `AnticipatedPaginatedList` | `authenticated` (client redirect to `/` for anon) | both |
| `/discover/popular` | Header "Most popular" + Share; `PopularPaginatedList` | `PopularPaginatedList` | `authenticated` | both |
| `/discover/recommended` | Header "Recommended"; `RecommendedPaginatedList` (no share) | `RecommendedPaginatedList` | `authenticated` | both |
| `/discover/releases` | `CalendarProvider`; header "Releases" + episode type toggles (meta = episode type or mode); `ReleasesCalendar` | `features/calendar/ReleasesCalendar.svelte`, `EpisodeTypeToggles.svelte` | `authenticated` | both |
| `/discover/trending` | Header "Trending" + Share; `TrendingPaginatedList` | `TrendingPaginatedList` | `authenticated` | both |

Note: drilldowns from the public `/discover` page land on auth-only pages (anon gets bounced to landing).

---

## People

| Path | What it shows | Key components | Auth | Type |
|---|---|---|---|---|
| `/people/[slug]` | Prefetch `peopleSummaryQuery`. Authed: navbar full (tablet-lg/desktop) or minimal + filters. `PeopleSummary`: header (mobile V2: headshot + IMDb tag, side actions `FilterButton`, Share, social media links, authed popup Report; desktop: compact container, headshot + IMDb, popup Share + Report, `PersonTitle` (known for), biography, `PersonDetails` (height, birthday, death date), social links). Then `CreditsList` Movie credits (mode media/movie) and Show credits (mode media/show), honoring `?movies=`/`?shows=` crew position params; `CreditsHistoryList` "From my history" (derived from user history; empty for anon). | `sections/summary/PeopleSummary.svelte`, `components/people/PeopleSummary.svelte`, `components/people/v2/PeopleSummary.svelte`, `CreditsList`, `sections/lists/history/CreditsHistoryList.svelte` | all | both |
| `/people/[slug]/history` | "Name - From my history" paginated | `CreditsHistoryPaginatedList` | `authenticated` | both |
| `/people/[slug]/movies` | "Name - Movie credits" paginated; header `CreditsPositionDropdown` (acting/directing/...) | `CreditsPaginatedList type="movie"`, `useCreditsPositionSelector` | all | movie |
| `/people/[slug]/shows` | "Name - Show credits" paginated; position dropdown | `CreditsPaginatedList type="show"` | all | show |

---

## Search

| Path | What it shows | Key components | Auth | Type |
|---|---|---|---|---|
| `/search?q=` | Navbar content toggle `search`; desktop navbar full; mobile: iOS -> full navbar with `SearchModePanel` + inline `SearchInput`, else minimal navbar with `SearchModePanel`. Results: `SearchResultsGrid` (click posts recent search) or, with no query, `SearchPlaceHolder` (trending searches; people mode = birthdays this month; lists mode = popular lists). Cover from results. Modes: media/show/movie/people/lists. | `features/search/{useSearch,SearchInput,SearchModePanel,SearchResultsGrid,SearchPlaceHolder}` | `authenticated` | both + people + lists |

## Calendar

| Path | What it shows | Key components | Auth | Type |
|---|---|---|---|---|
| `/calendar` (`+layout.svelte` wraps in `CalendarProvider`) | Responsive navbar: discover toggle, filters, header "Calendar" + episode type toggles. `Calendar`: sticky `CalendarHeader` (prev/next/reset) + `CalendarDays` strip, scroll-spy day anchors, chronological periods of `CalendarItem variant="summary"`, load-more, empty-period placeholders. | `features/calendar/{Calendar,CalendarLayout,CalendarItem,EpisodeTypeToggles,CalendarProvider}.svelte` | `authenticated` | both |

## History

| Path | What it shows | Key components | Auth | Type |
|---|---|---|---|---|
| `/history` | Responsive navbar (discover toggle, filters). Header "History" with mode meta; `?sync_id=` filters to a streaming-sync batch (meta shows sync source, back link to all history). `PersonalHistoryPaginatedList` in `CalendarProvider`: day-grouped list layout of `RecentlyWatchedItem` (actionable), maxDate now. | `sections/lists/history/PersonalHistoryPaginatedList.svelte`, `dataSyncQuery` | `authenticated` | both |
| `/history/movies/[slug]` | Minimal navbar; `MediaWatchHistoryPaginatedList type="movie"` (all plays of this movie) | `MediaWatchHistoryPaginatedList`, `useMovie` | `authenticated` | movie |
| `/history/shows/[slug]` | Plays of this show | same, `useShow` | `authenticated` | show |
| `/history/shows/[slug]/seasons/[season]/episodes/[episode]` | Plays of this episode | same, `useEpisode` | `authenticated` | show (episode) |

## Comments

| Path | What it shows | Key components | Auth | Type |
|---|---|---|---|---|
| `/comments/[id]` | **Redirect** (client) after `commentItemQuery` resolves: movie -> `/movies/slug?view=review&comment_id=`; show -> show page same; season -> show page + `season`; episode -> show page `view=episode&season&episode&comment_id`; list -> `/users/<user>/lists/<list>`. Spinner while loading, `Error404Page` if not found. No TraktPage. | `routes/comments/[id]/useCommentItem.ts`, `sections/summary/directCommentTargetUrl.ts` | all | both |

## Lists

| Path | What it shows | Key components | Auth | Type |
|---|---|---|---|---|
| `/lists/official/[list]` | Official list: responsive navbar (discover toggle, filters), header list name + `ListMeta` (owner hidden) + `ListActions` (authed: Like; popup Share/Reorder/Edit/Delete if owner, else Report; edit `SaveListDrawer`, reorder `ListReorderDrawer`), header `ListSortActions`; body `UserListPaginatedList` (by mode, sort). | `sections/lists/user/{ListActions,ListSortActions,UserListPaginatedList}.svelte`, `lists/components/ListMeta.svelte`, `useListSummary.ts` | all (actions authed) | both |
| `/lists/smart/create` (`+layout.svelte` adds `SmartListFilterPreserver`) | Minimal navbar + filters; `SmartListCreator`: target dropdown, media type toggler, `TargetPreview`, drawer form (name input, `FilterTabs`), `LimitWarning` when at limit (limit = VIP vs free `dynamicLists` quota). | `sections/smart-lists/SmartListCreator.svelte` | `authenticated` (VIP gets higher limit) | both |
| `/lists/smart/view` | Header "Smart lists" + `CreateSmartListButton`; `SmartListRenderer` (limit 100), empty -> smart-list `CtaItem` placeholder | `sections/lists/smart/SmartListRenderer.svelte` | `authenticated` | both |
| `/lists/smart/view/[list]` | Header smart list title + filter summary + `SmartListActions` (popup Delete); `SmartListPaginatedRenderer`. **Redirect** (client) to `/users/me/lists` if list not found. | `SmartListPaginatedRenderer`, `useSmartListSummary.ts` | `authenticated` | both |


---

# Route inventory, part B (profile, users, settings, vip, static, api)

Root: `projects/client/src/routes`. Sections under `src/lib/sections`, features under `src/lib/features`.

## Shared mechanics (apply to every row below)

- **`TraktPage audience`** (`sections/layout/TraktPage.svelte`): children wrapped in `RenderFor {audience}`, so nothing renders for the wrong audience. Client-side redirects:
  - `audience="authenticated"` + logged out (`public` viewer) -> `Redirect` to `UrlBuilder.landing()` (search dropped).
  - `audience="public"` + logged in -> `UrlBuilder.home()` (search kept).
  - `all` = no redirect. robots: `all`/`public` index; `authenticated`/`free`/`vip`/`director` noindex.
  - Server-side `redirectForAudience` is only used by `/` and `/home` (not by routes here).
- **`RenderFor` audiences** (`guards/_internal/RenderForAudience.svelte`): `all`, `authenticated` (authorized + user loaded), `public` (logged out), `free` (authed non-VIP), `vip` (authed VIP), `director` (authed director or dev). Also `device` (`mobile`, `tablet-sm`, `tablet-lg`, `desktop`) and `input` gates.
- **`RenderForFeature flag=`** reads `FeatureFlag` (VIP preview toggles): `edit-mode`, `scoped-favorites`, `up-next-smart-sort`, `rewatching`, `leaderboard`, `parental-guide`, `soundtrack`, `list-counts`, `reviewer-stats`, `genre-picker`, `action-confirmations`, `youtube-specials` (director only).
- **Movie/show mode:** pages with `ResponsiveNavbarStateSetter/NavbarStateSetter contentToggle="discover"` get the navbar movie/show/media toggle (`useDiscover().mode`: `movie | show | media`). `hasFilters` adds the filter button. Title meta text = current discover mode.
- **`TraktPageCoverSetter`** = page cover backdrop; `CoverImageSetter` = explicit cover url.
- `ResponsiveNavbarStateSetter header={title, metaInfo, actions}` + `headerActions` snippet (usually `ListSortActions` sort dropdown).

---

## profile/*

| Path | Shows (render order) | Key components | Auth / gating | Media |
|---|---|---|---|---|
| `/profile/[slug]` | 1. NavbarStateSetter(discover toggle, authed only) 2. `CoverImageSetter` (user cover) 3. `PrivateProfile` **or** `Profile` (see below). Nothing while loading. | `+page.svelte`, `useProfile.ts` (`userProfileQuery`), `sections/profile/Profile.svelte`, `PrivateProfile.svelte`, `useIsMe`, `useIsFollowing` | `audience="all"`, `filterScope="global"`. **Private** view when `user.private && !isMe && isFollowing===false`. Full profile when `isMe \|\| isFollowing \|\| !private`. | both (discover mode) |
| `/profile/me` | 1. NavbarStateSetter(discover, authed) 2. TraktPageCoverSetter 3. `Profile slug="me"` | `profile/me/+page.svelte`, `useUser` | `audience="authenticated"` -> landing when logged out | both |
| `/profile/[slug]/favorites` | CoverSetter; header "Favorites" + discover meta + `ListSortActions`; `FavoritesListPaginated` | `sections/lists/favorites/FavoritesListPaginated.svelte`, `useListSorting({type:"favorites"})` | `all` (public) | both |
| `/profile/[slug]/history` | CoverSetter; header "History" + discover meta; `RecentlyWatchedPaginatedList` | `sections/lists/history/RecentlyWatchedPaginatedList.svelte` | `all` | both |
| `/profile/[slug]/progress` | CoverSetter; header "Progress" + progress Toggler (`in-progress`/`dropped`/`completed`/`ended`) + `ListSortActions` (hidden on `dropped`, `added` sort removed); `ProgressPaginatedList` | `sections/profile/components/ProgressPaginatedList.svelte`, `useToggler("progress")` | **Owner only**: `!isMe` -> `Redirect` to `/profile/[slug]`. Then `audience="authenticated"`. | shows (progress) |
| `/profile/[slug]/social` | CoverSetter; header "Social" + Toggler (`following`/`followers`/`requests`) + ListMetaInfo; `ProfileListPaginated` | `sections/profile/components/ProfileListPaginated.svelte`, `useProfileSocialToggler` | `all`. `requests` option only when isMe and has follow requests. | n/a |

### `Profile.svelte` (full profile) render order
1. `ProfileContainer` (card; `is-vip` glow if profile VIP; `is-narrow` for free other-user) > `ProfileDetails`:
   - `ProfilePageBanner`: `ProfileImage` (editable if isMe; badge slot: authed-only `BlockedUserTag`/`PendingFollowTag` for others, else `VipBadge` on tablet-lg/desktop if VIP) · display name · location · `MatchPill` (authed, not me, not blocked) **or** `LeaderboardPill` (me + flag `leaderboard`) · `ShareButton` · authed: `ProfileOverflowMenu` (others: follow/unfollow/cancel request, approve/reject request, block/unblock, report) or `SettingsButton` (me) · `ProfileAbout` (clamped on mobile).
   - Stats only if `profile.isVip || isMe`: desktop = `ThisMonth` + (`AllTimeStats` if me, else `ThisYear`); tablet-lg = `Carousel` of the two; mobile/tablet-sm = `MonthToDate`.
2. `FavoritesList` (all profiles; year tag in meta when flag `scoped-favorites`; items actionable only for owner).
3. **Owner (`isMe`)**: `ScreenTime` -> `PersonalHistoryList` -> `MyActivityList` (ratings/reviews activity) -> `ProgressList`.
   **Other user**: `RecentlyWatchedList` (History).
4. **Other user only**: `PersonalLists type="personal"` -> `PersonalLists type="collaboration"`.
5. `LibraryList` only when `slug === "me"` (FIXME: no library for other users).
6. `ProfilesList` (Social: following/followers).
7. `ProfileDrawer` (URL-param drawers): `ScreenTimeDrawerHost`, `ActivityDrawerHost`, `MatchDrawerHost`, `LeaderboardDrawerHost` (flag `leaderboard`), `AllTimeStatsDrawerHost`.

### `PrivateProfile.svelte`
`ProfileContainer` > `ProfilePageBanner variant="private"` (no location, no share, no about) + "Private profile" header + divider + description text.

---

## users/[user]/*

| Path | Shows (render order) | Key components | Auth / gating | Media |
|---|---|---|---|---|
| `/users/[user]` | **Redirect** (load, 307) -> `/profile/[user]` + query string | `+page.ts` | none | - |
| `/users/[user]/library` | header "Library" + meta (library name) + `LibraryToggler` (`plex` / `other`, links); CoverSetter; `LibraryListPaginated` | `sections/lists/library/*`, `useLibrarySelection` | **Redirect** (load, 307) -> home if `user !== "me"`. `audience="authenticated"`. | both |
| `/users/[user]/lists` | Redirect to profile if `!isMe`; CoverSetter; navbar(discover, filters); `WatchList` -> `SmartLists` (+`CreateSmartListButton`, CTA placeholder when empty) -> `PersonalLists` compact x3 (`personal`, `liked`, `collaboration`) | `sections/lists/watchlist/WatchList.svelte`, `sections/lists/smart/SmartLists.svelte`, `sections/lists/user/PersonalLists.svelte` | `authenticated`, **owner only** (client `Redirect` -> `/profile/[user]`) | both |
| `/users/[user]/lists/[list]` | header: list name + `ListMeta` (discover text, no owner) + `ListActions`; `ListSortActions` (disabled while loading); CoverSetter; `UserListPaginatedList` | `sections/lists/user/UserListPaginatedList.svelte`, `ListActions.svelte`, `useUserListSummary` | `all` (public). `isIndexable=false` if missing. `ListActions` authed only: Like (disabled for owner) + popup: owner = Share/Reorder/Edit/Delete (deleted -> Redirect to `/users/me/lists`); non-owner = Report | both |
| `/users/[user]/lists/view/personal` | CoverSetter; header "Personal lists" + discover meta + `UserListsActions` (owner only: create list, reorder lists drawers) + `ListSortActions`; `PersonalListsPaginated type="personal"` | `PersonalListsPaginated.svelte`, `useUserListsSorting`, `UserListsActions.svelte` | `authenticated`; viewable for any slug, actions owner-only | both |
| `/users/[user]/lists/view/liked` | Redirect if `!isMe`; CoverSetter; header "Liked lists"; `PersonalListsPaginated type="liked"` (current user slug) | same | `authenticated`, **owner only** | both |
| `/users/[user]/lists/view/collaborations` | CoverSetter; header "Collaborative lists"; `PersonalListsPaginated type="collaboration"` | same | `authenticated` (any slug) | both |
| `/users/[user]/mir` | **Redirect** (load, 307) -> `/users/[user]/mir/{prevYear}/{prevMonth}` + query (e.g. `standalone_mode=1`) | `+page.ts` | none | - |
| `/users/[user]/mir/[year]/[month]` | `ReviewRouteLayout` > `MirPage` (see YIR below, MIR mode) | `sections/yir/MirPage.svelte`, `ReviewRouteLayout.svelte` | `audience = isMe ? "authenticated" : "all"`; own page + non-VIP skips query (upsell only) | both |
| `/users/[user]/progress` | CoverSetter; header "Up next" + discover meta + sort (`useUpNextSorting`); `UpNextPaginatedList` | `sections/lists/progress/UpNextPaginatedList.svelte` | `authenticated` (always current user's data) | shows (episodes) + movies per discover mode |
| `/users/[user]/start-watching` | CoverSetter; header "Start watching" + sort; `WatchlistPaginatedList intent="start"` | `sections/lists/watchlist/WatchlistPaginatedList.svelte` | `authenticated` | both |
| `/users/[user]/watchlist` | CoverSetter; header "Watchlist" + `ListMeta` (item count) + popup (Reorder) + sort; `WatchlistPaginatedList`; `ListReorderDrawer` on demand | `useWatchListItemCount`, `ListReorderDrawer.svelte` | `authenticated` (current user) | both |
| `/users/[user]/year/[year]` | `ReviewRouteLayout` > `YirPage` (year number or `all`). Title: all-time / year-to-date (current year, Feb-Nov) / year in review. OG image = yir widget unless `me`. | `sections/yir/YirPage.svelte` | `isMe ? authenticated : all` | both |
| `/users/[user]/yir` | **Redirect** (load, 307) -> `/users/[user]/year/{getYearInReviewYear}` (previous year in Jan/Feb) + query | `+page.ts` | none | - |

### Review pages (`sections/yir/*`)
- `ReviewRouteLayout`: `TraktPage mode="content-only"`, navbar `minimal` (or `hidden` in WebView standalone mode, `useWebviewSession`), fixed sidebar, CoverSetter.
- `YirPage`: `ReviewPageShell` > `YirHeader` (`ReviewHeader`: prev/next period links, title/subtitle, user avatar + profile link, share) > template:
  - `year === "all"` -> `YirAllTime`: Title, Totals, first watched calendar, **Shows**: stats, top (mostWatched/globalTop), genres, release years, countries, networks, list progress, top rated; **Movies**: stats, top, genres, release years, countries, studios, list progress, top rated; People; last watched; closing Totals; `YirUpgradeSection`.
  - `2024` -> `Yir2024`; else `YirDefault`: Title, Totals, first watched, **Shows**: stats, most watched, genres, networks, top rated; **Movies**: stats, most watched, genres, studios, top rated; People; last watched; closing Totals; `YirUpgradeSection`.
  - `Yir2024` order: TopSection, first play card, [MIR: streaming services], Shows stats (MIR = monthly stats), most played, [YIR: networks], genres, [YIR: rated, countries, trends], Movies same pattern (studios), [YIR: people], last play, [YIR: thanks], upgrade.
- `MirPage`: `ReviewPageShell spacious` > `MirHeader` > `Yir2024 mode="mir"` (top-3 most played).
- Gating: own page while non-VIP skips detail query (identity + upsell only). `YirUpgradeSection` = `RenderFor audience="free"` + isMe -> `UpsellCta` (source `yir`/`mir`).

---

## settings/*

### Layout `settings/+layout.svelte`
- `TraktPage audience="authenticated"` (logged out -> landing). Navbar: no filters, header from `settingsNavbarHeader` (compact on mobile/tablet-sm), header action `LogoutButton` (authed, tablet-lg/desktop).
- `Settings.svelte` (RenderFor authenticated): `SettingsNavbar` (sidebar links, tablet-lg/desktop only) + content.
- Pages (`_internal/settingsPages.ts`, order): General, Account, Data, Apps (connected), Streaming sync, Plex, Advanced, Preview. Pages can carry a `flag` (none currently do).

| Path | Shows | Every setting / control | Gating |
|---|---|---|---|
| `/settings` | desktop/tablet-lg: `GeneralSettings` (= `Profile` card + `GeneralSettingsBody`). mobile/tablet-sm: `SettingsHub` (`Profile` card + link rows to every settings page; General row -> `/settings/general`) | see General | device split via RenderFor |
| `/settings/general` | `GeneralSettingsBody` only | **Behavior**: Show spoilers (switch), Enable multiple plays / watch again (switch), Show rating prompt (switch). **Genres**: flag `genre-picker` on -> `GenreSlots` (loved genres slots -> `GenresDrawer`); off -> `GenreTags` (toggle tags, limit `GENRE_LIMIT`). **Blocked users**: list of `BlockedUserRow` (avatar/link + Unblock) or empty text. **Appearance**: Theme (`ThemePicker`), Language (`LocalePicker`), Cover image reset button (`ResetCoverImageRow`, disabled if none). Mobile/tablet-sm: `LogoutButton` at bottom. | authed |
| (Profile card, used by `/settings` + hub) | avatar (editable, `ProfileImage`), display name, location, VIP: `VipBadge` link to `/vip`; free: `GetVIPLink source="profile-settings"` | card variant `vip` vs `muted` | - |
| `/settings/account` | `AccountSettings` "Account details" card | Display name (drawer input), Username (input), Email (input, only if email present), Birthday (datepicker), Location (input), About (textarea), Private account (switch), Manage subscription (link -> `/vip`). Edits via `SettingInputDrawer`. | authed |
| `/settings/data` | `SettingsDrawer` (JSON / CSV guideline drawers via URL) -> `RawImport` -> `RawExport` | **Import**: source tabs (desktop/tablet-lg) or select (mobile): TV Time (.csv/.zip), IMDb (.csv), Letterboxd (.zip), Trakt JSON (.json/.zip), Trakt CSV (.csv). Flow: `ImportGuide` + `ImportDropzone` -> parsing -> `ImportSummary` (per-action switches: history / watchlist / ratings / list; "match episodes positionally" switch when episodes; Start import; VIP-limit exceeded -> `UpsellCta source="import"`) -> matching/syncing progress -> `ImportComplete` / `ImportError`. **Export**: Raw export button + `ExportProgressSnackbar`. `NavigationGuard` while running. | authed; free import cap -> upsell |
| `/settings/apps` | **Redirect** (load, 301) -> `/settings/apps/connected` | - | - |
| `/settings/apps/api`, `/api/new`, `/api/[id]`, `/api/[id]/edit` | **Redirect** (load, 301) -> `UrlBuilder.developer.apps()` / `.newApp()` / `.app(id)` / `.editApp(id)` (external developer site) | - | - |
| `/settings/apps/connected` | `ConnectedAppsSettings` section "Connected community apps" | Usage meter (free only, when apps exist). Skeleton rows while loading; empty text; at limit: `ConnectedAppsLimitWarning` (free -> `UpsellCta source="connected-apps"`, vip -> warning text). Per app: `ConnectedAppRow` + Revoke button. | free vs vip copy |
| `/settings/streaming-services` | `ConnectionResultHandler` (handles `?connection=&service=` from callback) -> `FavoriteServices` -> `StreamingSyncSection` (Beta badge) { `StreamingConnectionStatusSnackbar`, `StreamingServices` } -> `LockedStreamingServices` -> `DataSyncs` | **Favorite services**: Streaming country (select), Favorites Manage button -> `FavoriteServicesDrawerHost`, logo strip. **Streaming sync**: reconnect warning for inactive; per service tile: Connect (whole tile button) / Reconnect + popup Unlink (inactive) / popup Sync new data, Sync all data, Unlink (active); shows profile + last synced. **Locked services** (not connectable, i.e. VIP-only): list + `GetVIPLink source="streaming-services-settings"`. **Data syncs**: `DataSyncsBanner` (count + latest), `DataSyncList` rows (undo, link to detail), Load more. | authed; locked list implies VIP gate |
| `/settings/streaming-services/[id]` | only if numeric id: `StreamingServicesDetail`: section w/ crumb back to streaming -> single `DataSyncRow` (undo) or `SyncLoadError` retry -> `SyncItemsSection kind="paused"` (if count>0) -> `SyncItemsSection kind="skipped"` (if count>0), each with Load more | undo, retry, load more | authed |
| `/settings/plex` | `PlexSettings` `TabView` (URL param tab): **Sync** / **Webhook** | **Sync tab (`PlexSync`)**: free + not connected -> `SettingsVipUpsell` (free limits); Plex connection row (Connected badge; Connect / Disconnect w/ confirm). If connected: `PlexSyncedServers` (add server popup or VIP upsell at server limit; per server row: Syncing badge, Sync now (VIP only), Manage -> `PlexServerDrawerHost` library picker, forget; error retry; empty state) -> `PlexSyncSettings` (if synced servers; tag toggles: Movies watched/ratings/watchlist/library; Shows ratings/watchlist; Seasons ratings; Episodes watched/ratings/library) -> `PlexSyncHistory` (DataSyncList). **Webhook tab**: free -> `SettingsVipUpsell source="plex-settings-webhook"`; vip -> `PlexWebhook`: webhook URL + copy (or connect hint); if URL: `PlexHomeUsers` (home users input drawer) + `PlexScrobblerSettings` (Movies scrobble/watched/ratings/library; Shows ratings; Seasons ratings; Episodes scrobble/watched/ratings/library) | webhook = VIP; sync now = VIP; extra servers = VIP |
| `/settings/advanced` | `ExportGateProvider` > `HistoryAnalysis` -> `ClearData` -> `DeleteAccount` | **History analysis**: free history `UsageLimitItem`, keep oldest/newest Toggler (`PlayRetentionToggler`), cards Movies / Episodes (duplicates, unique, total, Clean up button w/ confirm + optional export, progress). **Clear data**: source select (Watchlist, Ratings, History, Custom library) + Clear now (confirm; library variant = export+clear), progress/status. **Delete account**: VIP active notice (link to /vip), Delete account button (disabled while VIP active), error. `NavigationGuard`s. | authed; delete blocked for active VIP |
| `/settings/preview` | `PreviewFeatures` section | VIP: `FeatureFlagItems` - one switch (On/Off) per flag, "New" tag, link to feature when on; each item further gated by definition audience (default `vip`; `youtube-specials` = `director`). Free: `UpsellCta source="preview-features"`. | VIP only content |

---

## vip / welcome / social

| Path | Shows (render order) | Key components | Auth / gating |
|---|---|---|---|
| `/vip` | navbar `minimal`; `StripeReturnHandler` (no markup); free: `VipSubscribe`; vip: `VipManage` | `sections/vip/*` | `authenticated` (landing if logged out) |
| - `VipSubscribe` | `VipContent` > `Subscriptions` (hero "Unlock more with Trakt VIP", `TwoYearDealCard` if deal + divider, plan `SubscriptionCard`s `#vip-plans`) -> `VipFeatures` (feature grid) -> `UpsellFooter` (`IncreasedLimits`, `BuiltToLast`, `JoinNow`) | | free |
| - `VipManage` | `AccountDetails` (avatar, name, VipBadge, member since, `LifetimeBadge`; `SubscriptionActions` + `SubscriptionDetails` unless lifetime/director) + `PaypalSwitchCard` (PayPal only, link to `/vip/renew`) -> `UsageTabs` (Usage `UsageLimits` / History `PaymentHistory` tabs if transactions) -> `VipFeatures` | | vip |
| `/vip/renew` | **Redirect** -> `/vip` if subscription exists and not (cancelled or PayPal). Else navbar minimal + `VipSubscribe` | `useVip`, `isPaypalGateway` | `authenticated` |
| `/welcome` | navbar hidden, content-only: `WelcomeBackdrop` (posters) -> `WelcomeIntro` (heading + intro) -> `WelcomeImport` (heading, `TvTimeNotice`, `ImporterCard` imdb + letterboxd, "Browse all" -> `/settings/data`) -> `WelcomeOutro` (heading, `WelcomeVipUpsell` (free only, `GetVIPLink source="welcome"`), "Get started" -> home) | `sections/welcome/*` | `all` (post-signup onboarding) |
| `/social/activity` | CoverSetter; header "Social activity" + discover meta (filters); after first load: `CalendarProvider(initialDate = latest activity)` > `ActivityPaginatedList` | `sections/lists/activity/*`, `features/calendar/CalendarProvider.svelte` | `authenticated` | 

Media: `/social/activity` both (discover mode).

---

## Static / auth plumbing

| Path | Shows | Key components | Auth |
|---|---|---|---|
| `/about` | `About`: `WhatIsTrakt` -> `MemberCountHero` -> `MeetTheTeam` | `sections/about/*` | `all` |
| `/branding` | `Branding`: `BrandingRequirements` -> `BrandingLogos` -> `BrandingQuestions` | `sections/branding/*` | `all` |
| `/faq/tv-time` | content-only, navbar minimal, CoverSetter; `TvTimeFaq`: title -> `TvTimeFaqList` -> `TvTimeReportForm` (authed only, posts to `/api/tv-time-report`) | `sections/faq/*` | `all`; form `authenticated` |
| `/privacy` | `Privacy` in `LegalPage` (numbered sections 1-10+) | `sections/privacy/Privacy.svelte` | `all` |
| `/terms` | `Terms` in `LegalPage` (sections 1-20) | `sections/terms/Terms.svelte` | `all` |
| `/callback` | no markup; onMount OIDC `signinCallback` -> `postToken` (`/api/store-token`) -> `location.replace(home + cache buster)`; 429 -> fetch error event | `callback/_internal/claimSigninCallback.ts` | - |
| `/callback/streaming` | **Redirect** (load, 303) -> `/settings/streaming-services?connection=&service=` (normalises Younify `yc_status`, `yc_service_id`) | `+page.ts` | - |
| `/silent-redirect` | no markup; OIDC `signinSilentCallback` (iframe token refresh) | - | - |

## API / SEO endpoints

| Path | Method | Purpose |
|---|---|---|
| `/api/search-keys` | GET | Re-mint scoped Typesense search keys (`mintSearchKeysFromEnv`) |
| `/api/shareable-image` | GET `?type=movie\|show&slug=&variant=` (`timing`, `debug`) | Renders share card PNG (Takumi/WASM), posters + fonts from R2 `R2_WALTER`; movie/show only |
| `/api/store-token` | POST | Writes httpOnly OIDC auth cookie (1y) |
| `/api/tv-time-report` | POST (multipart) | Authed (401 otherwise); validates, stores files in R2 `R2_IMPORT_REPORTS`, opens GitHub issue (import-reports) |
| `/robots.txt` | GET | Disallows `/calendar`, `/history`, `/settings`, `/social`, `/callback`, `/silent-redirect`, `/api/`, `/_design_system`; blocked params; sitemap link |
| `/sitemap.xml` | GET | Index: `/sitemap/pages.xml` + `/sitemap/catalog/{movies,shows}.xml` |
| `/sitemap/pages.xml` | GET | Static routes: `/`, movies/shows/media (popular, trending, anticipated, recommended), `/discover`, `/search`, `/vip`, `/about`, `/privacy`, `/terms` |
| `/sitemap/catalog/[type].xml` | GET | Catalog slugs -> `/{movie\|show}s/{slug}`; 404 bad type, 503 fetch fail |

## `_design_system/*` (excluded from redesign)
Index redirects (307) to first page; layout noindex + theme toggle. Pages: colors, icons, typography, items, buttons, charts, drawers, dropdown, errors, member-counter, links, select, share-card, snackbar, toggles, formatting/dates, formatting/numbers, pwa/android, pwa/ios.


---

# lib/features, lib/sections, lib/guards inventory

Root: `projects/client/src/lib`

## 1. lib/features

| name | what it does | user-visible? | notable public files |
| --- | --- | --- | --- |
| action-toast | Undo-able action toasts (e.g. "added to watchlist - undo") | yes | ActionToastHost.svelte, useActionToast.ts, undoToastAction.ts, toGatedNotify.ts |
| analytics | Event tracking / page views (HAL engine) | no | AnalyticsProvider.svelte, PageView.svelte, useTrack.ts, useAnalytics.ts, events/AnalyticsEvent.ts |
| asset-fallback | Server handle serving `/_app/immutable/*` with content-type + immutable cache headers | no | handle.ts |
| auth | OIDC auth, token renew, current-user queries (watchlist, ratings, favorites, likes, notes, collection, network, plex library, dropped, rewatching, settings...) | partly (login/errors) | handle.ts, getOidcConfig.ts, renewAccessToken.ts, redirectForAudience.ts, stores/createAuthContext.ts, stores/useIsMe.ts, queries/currentUser*Query.ts |
| boot-loader | Initial boot splash HTML, marks app ready | yes (splash) | handle.ts, markAppReady.ts, _internal/bootLoader.html |
| bot-verification | Bot detection context (crawler vs human) | no | BotProvider.svelte, handle.ts, stores/useBotContext.ts |
| cache-control | Resolves Cache-Control header per request (session/bot/webview) | no | resolveCacheControl.ts |
| calendar | Personal + releases calendars, episode-type filter, swipe/scrollspy | yes | Calendar.svelte, ReleasesCalendar.svelte, CalendarProvider.svelte, CalendarLayout.svelte, CalendarItem.svelte, CalendarMediaCard.svelte, EpisodeTypeToggles.svelte, useEpisodeType.ts |
| confirmation | Confirmation dialogs for destructive/ambiguous actions (incl. set-cover preview) | yes | ConfirmationProvider.svelte, useConfirm.ts, models/ConfirmationType.ts |
| deployment | Serves git SHA endpoint, injects SHA into HTML | no | handle.ts, DeploymentEndpoint.ts |
| devices | Injects device type/scale into HTML from UA | no | handle.ts |
| devtools | Director/dev devtools drawer, query devtools panel, spotlight actions | yes (dev/director) | DevtoolsProvider.svelte, devtoolsStore.ts, devtoolsSpotlightActions.ts |
| edit-mode | Page edit mode (hide/show sections), bar + toggles | yes (flagged) | EditModeProvider.svelte, EditModeBar.svelte, EditModeButton.svelte, EditModeVisibilityButton.svelte, useEditMode.ts |
| email-unsubscribe | Snackbar confirming email unsubscribe | yes | EmailUnsubscribeSnackbar.svelte |
| errors | Global error handling, well-known error mapping, injected-script filtering | yes (error pages) | ErrorProvider.svelte, models/WellKnownErrors.ts, models/CustomFetchError.ts |
| events | Generic time-window scheduler for date-based events (used by promotions/seasonal themes) | no | initializeEvents.ts |
| feature-flag | Preview features (user-toggleable flags) + settings UI | yes | FeatureFlagProvider.svelte, FeatureFlagItems.svelte, FeatureFlagTool.svelte, useFeatureFlag.ts, useUnreadPreviewFeatures.ts, isRecentlyAddedFeature.ts, models/featureFlagDefinitions.ts |
| filters | Discover filters (simple/advanced), discover mode, stored filters, filter scope | yes | FilterProvider.svelte, FilterScopeSetter.svelte, useFilter.ts, useDiscover.ts, useStoredFilters.ts, discoverModeOptions.ts, parentalGuideFilters.ts |
| gif-picker | Klipy GIF picker drawer for comments | yes | GifButton.svelte, GifPickerDrawerHost.svelte |
| i18n | Locale resolution, Paraglide messages, locale picker | yes | messages.ts, handle.ts, components/LocalePicker.svelte, components/LocaleProvider.svelte, components/useLocale.ts |
| image | Image proxy endpoint, cross-origin + editable images | yes | handle.ts, ImageEndpoint.ts, components/CrossOriginImage.svelte, components/EditableImage.svelte |
| intl-overlay | Bulk-fetches translated titles/overviews and overlays onto lists/activity/progress | yes (translated text) | createBulkIntlOverlay.ts, createBulkMediaIntl.ts, createBulkEpisodeIntl.ts, *Targets.ts, withOverlayLoading.ts |
| legacy-redirects | Maps legacy trakt.tv v2 paths to trakt-web routes | no (redirects) | handle.ts, resolveLegacyRedirect.ts |
| member-count | Registered member count with animated projected count | yes (about/landing) | useRegisteredMemberCount.svelte.ts, useProjectedCount.svelte.ts |
| mobile-os | Injects mobile OS into HTML from UA | no | handle.ts |
| navigation | D-pad / keyboard spatial navigation (TV), navbar navigation, focus trap | yes (TV/keyboard) | NavigationProvider.svelte, useNavigation.ts, useNavbarNavigation.ts, navigationTrap.ts |
| navigation-history | Tracks in-app history (back button behavior) | no | NavigationHistoryProvider.svelte, useNavigationHistory.ts |
| notes | Add/edit/delete notes drawer (media, ratings, drops) | yes | AddNoteDrawerProvider.svelte, AddNoteDrawer.svelte, useAddNoteDrawer.ts |
| offline | Offline action queue + replay on reconnect | yes (queued state) | OfflineSync.svelte, useOfflineActions.ts, executeOrEnqueue.ts, useIsQueued.ts, whenExecuted.ts |
| parameters | Global URL param propagation / whitelisting | no | GlobalParameterProvider.svelte, GlobalParameterSetter.svelte, GlobalParameterEscaper.svelte, useParameters.ts, whiteListedParams.ts, localParams.ts |
| player | YouTube player (Plyr) for trailers | yes | YoutubePlayerProvider.svelte, stores/useYoutubePlayer.ts |
| plex | Plex library lookup + deep links | yes | usePlexLibrary.ts, buildPlexLink.ts |
| portal | Popup/portal positioning engine (menus, tooltips) | yes (infra) | usePortal.ts |
| promotions | Time-boxed promotions (e.g. Black Friday) with audience | yes | initializePromotions.ts, usePromotion.ts, constants/index.ts |
| query | TanStack Query wrapper: defineQuery/defineMutation, useQuery, invalidation, IDB persister, devtools | no | defineQuery.ts, defineMutation.ts, useQuery.ts, useMutation.ts, QueryClientProvider.svelte, invalidateActions.ts, refetchQuery.ts |
| redirect | Client redirect helper/provider | no | RedirectProvider.svelte, useRedirect.ts |
| report | Report content dialog (comments, lists, users...) with reasons | yes | ReportButton.svelte, ReportDialog.svelte, ReportDialogProvider.svelte, useReportDialog.ts, models/ReportableType.ts, models/ReportReason.ts |
| search | Search input, modes (media/show/movie/people/lists), results grid, trending searches, search key minting | yes | SearchProvider.svelte, SearchInput.svelte, SearchModePanel.svelte, SearchResultsGrid.svelte, SearchPlaceHolder.svelte, useSearch.ts, useSearchMode.ts, searchModeOptions.ts, handle.ts |
| sentry | Sentry tunnel endpoint | no | handle.ts, SentryEndpoint.ts |
| seo | Sitemaps + robots.txt generation | no | buildSitemapIndex.ts, buildUrlSet.ts, buildRobotsTxt.ts, catalogSitemapConfig.ts |
| share | Share card rendering (story/feed/OpenGraph) with poster, credits, ratings | yes | ShareCard.svelte, models/ShareType.ts |
| spoilers | Spoiler hiding for episode titles/images/text | yes | components/Spoiler.svelte, useMediaSpoiler.ts, useSpoilerFreeEpisodeTitle.ts, useEpisodeSpoilerImage.ts |
| spotlight | Command palette (keyboard-triggered) for routes, media, actions | yes | SpotlightProvider.svelte, models/SpotlightAction.ts |
| team | Fetches Trakt team members (unfollowed, shuffled) | yes (CTA cards/about) | useTraktTeam.ts |
| theme | Light/dark/system theme + seasonal themes (Halloween, Christmas snow/splash) | yes | components/ThemeProvider.svelte, components/ThemePicker.svelte, components/SeasonalToggle.svelte, components/SeasonalFlair.svelte, useTheme.ts, useSeasonalTheme.ts, handle.ts |
| toast | Now playing / last watched (rate now) toast state + dismissals | yes | ToastProvider.svelte, useNowPlaying.ts, useLastWatched.ts, useDismissals.ts |
| tv-time-report | Submit TV Time import failure reports (files + message) | yes | useTvTimeReport.ts |
| upsell | VIP upsell CTA | yes | UpsellCta.svelte |
| webview | Native-app WebView session detection (slurm, standaloneMode params) | no | useWebviewSession.ts, captureWebviewSession.ts, resolveStandalone.ts, resolveSlurm.ts |

### filters: every filter option (`_internal/constants.ts` FILTERS)

| filter | key | type | options |
| --- | --- | --- | --- |
| Genre | `genres` | list / advanced multi-select | My favorites (loved genres), action, adventure, animation, anime, biography, children, comedy, crime, documentary, drama, family, fantasy, history, holiday, horror, musical, mystery, romance, science-fiction, superhero, suspense, thriller, war, western |
| Streaming | `watchnow` | list / multi-select (no exclusion) | My favorites, Streaming now (subscriptions), Free, All digital releases (any) |
| Decade | `years` | list / advanced slider 1930-2030 | This year, then each decade from current back to 1960s |
| Runtime | `runtimes` | list / advanced slider 0-500 | 0-30, 31-60, 61-90, 91-120, 121+ |
| Ratings | `ratings` (+ advanced `imdb_ratings`, `rt_meters`, `rt_user_meters`) | slider 0-100% | range |
| Certification | `certifications` | list / multi-select | All ages (g,tv-y,tv-y7,tv-g), Parental guidance (pg,tv-pg), Teens (pg-13,tv-14), Mature (r,tv-ma), Unrated (nr) |
| Region / Country | `countries` | list regions / advanced country multi-select | North America, Europe, Asia, Middle East, Oceania, Latin America, Africa |
| Status | `statuses` | list / multi-select | Simple: Released, Upcoming, Ended, Canceled, Rumored. Advanced: returning series, released, continuing, upcoming, in production, post production, planned, ended, canceled, rumored |
| Parental guide (advanced only, x5) | `parental_nudity`, `parental_violence`, `parental_profanity`, `parental_alcohol`, `parental_frightening` | slider | none / mild / moderate / severe |
| Ignore watched | `ignore_watched` | toggle (inverted) | - |
| Ignore watchlisted | `ignore_watchlisted` | toggle (inverted) | - |

Other filter-feature enums: FilterMode = simple / advanced; FilterScope = local / global; DiscoverMode = movie / show / media.

Sort options (not in filters; live in sections/lists):
- Up Next (`lists/progress/UpNextSortBy.ts`): released, remaining, smart
- List items (`lists/user/models/SortBy.ts`): rank, added, runtime, percentage, my_rating, released, title (+ asc/desc direction)
- User lists (`lists/user/constants/userListsSortOptions.ts`): rank, name, updated_at, created_at

Search modes (`features/search/searchModeOptions.ts`): media, show, movie, people, lists.

### feature-flag: every flag (`models/FeatureFlag.ts`)

| flag | value | audience | added |
| --- | --- | --- | --- |
| EditMode | edit-mode | vip (default) | 2026-04-30 |
| ScopedFavorites | scoped-favorites | vip | 2026-06-11 |
| UpNextSmartSort | up-next-smart-sort | vip | 2026-07-09 |
| Rewatching | rewatching | vip | 2026-06-19 |
| Leaderboard | leaderboard | vip | 2026-07-09 |
| ParentalGuide | parental-guide | vip (explicit) | 2026-06-30 |
| Soundtrack | soundtrack | vip | 2026-08-03 |
| ListCounts | list-counts | vip | 2026-08-21 |
| ReviewerStats | reviewer-stats | vip | 2026-08-22 |
| GenrePicker | genre-picker | vip | 2026-08-24 |
| ActionConfirmations | action-confirmations | vip | 2026-08-25 |
| YouTubeSpecials | youtube-specials | director | 2026-09-26 |

Theme values: system, light, dark (+ seasonal: halloween, christmas).

## 2. lib/sections

- **about**: About page
  - About.svelte; components/WhatIsTrakt, MemberCountHero (live member count), MeetTheTeam
- **banner**: Top-of-page promo/status banners
  - Banner.svelte (picks banner); _internal/PromotionBanners, ReviewBanners, BannerContainer/Cta/Link, DismissButton
  - black-friday (deal banner, claim offer, countdown), month-in-review, year-in-review (stats + upsell), tv-time, tv-time-import, welcome
- **branding**: Brand guidelines page
  - Branding.svelte; components/BrandingLogos, BrandingRequirements, BrandingQuestions
- **components**: Shared section-level widgets
  - lists-drawer (ListsDrawer, ManageListsDrawerProvider, ListAction, list/watchlist dropdown items): add-to-list drawer
  - text-card (TextCard, TextCardHeader); admin/ModerateAction
  - DateWithAnniversary, ListMetaInfo, MonthInReviewLink, ReviewContent, ShadowScroller, ToggleTag, UserRating
- **dashboard**: Only the dashboard drawer shell (home page composition lives in routes)
  - DashboardDrawer.svelte; _internal/dashboardDrawerNavigation.ts
- **discover**: DiscoverToggles.svelte (movie/show/media mode toggle)
- **faq**: TV Time FAQ page
  - TvTimeFaq.svelte; _internal/TvTimeFaqList, TvTimeReportForm
- **footer**: Site footer
  - Footer.svelte; components/FooterContent, FooterLogo, PageLinks, ExternalLinks, CopyRight; stores/
- **landing**: Public landing page
  - Landing.svelte; components/SpotlightStack + SpotlightBackdrop (trending carousel), LandingPillars, LandingApps, GetStartedButton, LoginButton; assets/AppStore + GooglePlay badges; useSpotlightItems, useTrendingItems, useSpotlightTick
- **layout**: Page shell
  - TraktPage.svelte (head/SEO/OG/JSON-LD), TraktPageCoverSetter.svelte; _internal/createMediaLd, isNoIndexPath, openGraphUrlBuilder
- **lists**: All media lists / carousels / paginated grids
  - root: CastList, CreditsList, CreditsPaginatedList, RelatedList, RelatedPaginatedList, ReleasesList, UpcomingList, VideoList, ListsPaginated
  - activity: social activity list + paginated
  - anticipated: anticipated list/item/paginated
  - components: MediaCard, MediaItem, MediaSummaryCard, ListSummaryCard, ActivitySummaryCard, EpisodeCard/Item, SeasonItem, CastMemberItem, Credit*Item, DefaultMediaItem, DefaultPersonItem, VideoItem, MediaSwipe, SkeletonCard, UserAvatar, UserProfileLink, VideoTypeDropdown, CreditsPositionDropdown; cta/ (empty-state CTA cards: activity, list, media, Trakt team, placeholders); list-summary/ (ListSummaryItem, header, posters)
  - drilldown: DrillableMediaList, DrilledMediaList, MediaList, lazy loader, no-filter-results placeholder
  - favorites: FavoritesList + paginated
  - history: RecentlyWatched list/item/paginated, PersonalHistory, CreditsHistory, MediaWatchHistoryPaginatedList
  - library: LibraryList + paginated, toggler, empty state (collection/plex)
  - popular: popular list/item/paginated
  - progress: UpNextList + paginated, UpNextItem, ContinueWatchingItem, MovieProgressItem, swipes, MarkAsCompleted, hidden shows, sorting
  - recommended: RecommendedList + paginated, recommendation sources drawer
  - season: SeasonList, SeasonDropdown, SeasonActions, episode/poster lists
  - smart: SmartLists, SmartListRenderer (+ paginated), create/delete, preview, filter summary
  - stores: shared list hooks (credits, favorites, releases, upcoming, related, recently watched, season episodes, sort params, stable pagination, history calendar)
  - trending: trending list/item/paginated
  - user: UserList + paginated, PersonalLists + paginated, PinnedList, ListActions, sort drawer, reorder drawers/rank editor, create/edit/delete/like/save list
  - utils: card width / list height resolvers, video types
  - watchlist: WatchList + paginated, WatchListItem, StartWatchingItem, released tag, swipe
  - where-to-watch: WhereToWatchList + drawer host, country tiles, service sections, JustWatch info, YouTube specials option
- **media-actions**: Per-item action buttons + hooks
  - check-in: CheckInAction, useCheckIn
  - cover-image: SetCoverImageAction, useCoverImage, useIsCover
  - drop: DropAction, DropButton, DropNotePromptProvider, DropSwipeIndicator, useDrop, useIsDropped
  - favorite: FavoriteAction, useFavorites
  - hide-recommendation: HideRecommendationAction
  - mark-as-watched: MarkAsWatchedAction, TrackAction, MarkAsWatchedDrawerProvider, history slot picker/drawer, watch-until-here drawer, swipe indicator, useMarkAsWatched, useIsWatched
  - rating: RateAction
  - remove-from-history: RemoveFromHistoryAction
  - restore: RestoreAction, RestoreButton (undrop/unhide)
  - rewatching: RewatchingAction, RewatchingDrawerHost, useRewatching
  - watchlist: WatchlistAction, WatchlistIndicator, WatchlistSwipeIndicator, useWatchlist
  - _internal: NotePrompt, StemSwipeIndicator, toBulkPayload, attachWarning
- **navbar**: Navigation chrome
  - TopNavbar, SideNavbar, MobileNavbar, NavbarStateSetter, ResponsiveNavbarStateSetter, useNavbarState
  - _internal: NavbarHeader, NavbarActions, NavGroup, SideNavbarContent, NavbarContentToggle, DevtoolsNavItem
  - components: UserMenu, ProfileLink, TraktLogo, GetVIPLink, JoinTraktButton
  - components/filter: FilterButton, FilterSidebar, FilterTabs, SaveFiltersButton, ResetAllButton; filters/ SimpleFilters, AdvancedFilters, FiltersPopupMenu, ListFilter, SliderFilter, ToggleFilter, MultiSelectFilter, StreamingServicesFilter, StreamingAvailabilityFilter
  - models: NavbarHeaderState, NavbarStateSetterProps
- **privacy**: Privacy.svelte (privacy policy page)
- **profile**: User profile page
  - Profile.svelte, PrivateProfile.svelte, ProfileDrawer.svelte
  - components: ProfileContainer, ProfileCard, ProfileDetails, ProfileAbout, ProfileItem, ProfilesList, ProfileListPaginated, MyActivityList, ProgressList + paginated, AllTimeStats, AllTimeLink, ThisMonth, ThisYear, MonthToDate, YearToDateLink, MatchPill, MatchDrawer, SwipeCarousel; _internal: StatsCard, WatchStats, AllTimeStatTile, activity comment/rating items, activity + all-time-stats drawers, SharedMediaPoster
  - leaderboard: LeaderboardPill, LeaderboardDrawerHost, item, viewer card
  - stores: useAllTimeStats(+Details), useMonthToDate, useFollowing, useLeaderboard(+Viewer), useProfileSocialToggler, useSwipeCarousel
  - _internal: MatchDrawerHost, useMatch (taste match), profileDrawerNavigation
- **profile-banner**: Profile header
  - ProfilePageBanner, ProfileImage; _internal: crop/view dialogs, image context menu, overflow menu, BlockedUserTag, PendingFollowTag
- **settings**: Settings pages
  - Settings, SettingsHub, SettingsDrawer, GeneralSettings(+Body), AccountSettings, AdvancedSettings, DataSettings, ConnectedAppsSettings, PlexSettings, PreviewFeatures, StreamingServicesSettings, StreamingServicesDetail
  - _internal: Appearance, Behavior, Genres (+drawer/slots/tags), Profile, BlockedUsers, ClearData, DeleteAccount, HistoryAnalysis, Raw import/export, import/ (dropzone, guide, summary), plex/ (connect, servers, sync, scrobbler, webhook), streaming-services/ (favorites, data syncs, tiles), apps/ (connected apps, usage meter), settings row/section primitives
  - subfolders export, import, sync (logic)
- **smart-lists**: Smart list creator from filters
  - SmartListCreator, SmartListFilterPreserver, useCreateSmartList, toSmartListFilters; _internal: MediaTypeToggler, TargetDropdown, TargetPreview, LimitWarning
- **stats**: Watch stats widgets
  - ActivityHeatmap, ScreenTime + ScreenTimeDrawerHost, StreakCallout + StreakDrawerHost
  - _internal: PulseGraph, PulseGraphPeakHours, PulseGraphScreenTimeDaily, PulseCell, PulseDeltaTag, StreakAccumulator, icons/StreakIcon; hooks useActivityHeatmap, useStreak, useWeeklyPulse, useMonthlyStats; computeActivityHeatmap, getGraphItems, getStatItems, strengthRampColor; constants/, models/, utils/
- **summary**: Movie/show/episode/person summary pages + drawers
  - root: MovieSummary, ShowSummary, EpisodeSummary, PeopleSummary, SummaryDrawer, SummaryDrawers, summaryDrawerNavigation, directCommentTargetUrl
  - components/_internal: Summary, SummaryCover, SummaryTitle, SummaryPosterTags, SummaryActionsBar/Drawer/Popup/Slider, SummarySideActions, SummaryRateNow, SpoilerSection, InfoCard, CollapsableContent, drawer cast section, social activities button, useParentalGuideCategories
  - cast: CastDrawerHost
  - comments: Comments, InlineComments, CommentCard, CommentActions; comment-actions (react/reply/edit/delete/report, reactions picker/summary/distribution), comment-input (CommentInput, spoiler switch, GIF), marked (spoiler markdown), language select, ReviewerStatsTag; drawers (CommentsDrawerHost, ReviewDrawerHost, AddReviewDrawerHost, CommentReplies, CommentThreadCard)
  - details: DetailsDrawer; MediaDetails, DetailsGrid, MediaStats, MediaLinks, MediaParentalGuide, HistoryList
  - episode: EpisodeSummary + v2 (EpisodeActions, side/popup actions)
  - episode-drawer: EpisodeDrawerHost; info header/poster, reviews tab, hooks (aired, people, rating, stream on)
  - history: HistoryButton, HistoryDrawerHost
  - lists: Lists (lists containing this media), useListSummary
  - media: MediaSummary + v2 (MediaActions, SideActions, PopupActions, BookmarkAction, DetailsButton, NotesButton, TrailerButton), useMediaMetaInfo
  - notes: NotesDrawerHost; Notes, NoteCard, NoteHeader, note actions (edit/delete)
  - overlay: StreamOnOverlay (where-to-watch/streaming), TrailerOverlay
  - people: PeopleSummary + v2 (PersonDetails, SocialMediaLinks, ImdbLink, Celebration)
  - rating: RateNow, RatingsDrawer, useRatings; RatingStars (scrub), RatingsDistribution, SeasonRatingsChart, PopcornBurst, RottenTomato, rating delight
  - seasons: SeasonsDrawerHost, SeasonEpisodesTab, SeasonProgressCard; overview/reviews tabs
  - sentiment: Sentiment, SentimentDrawer; SentimentSummary, SentimentAspects, SentimentCard, SentimentUpsell
  - social: SocialDrawerHost (friends' activity on this media)
  - soundtrack: SoundtrackList, SoundtrackDrawerHost, useSoundtrack; board/panel/track row, Spotify iframe, upsell
  - summary: SummaryContainer, SummaryHeader, SummaryOverview, SummaryActions
  - trivia: TriviaList, TriviaDrawerHost, useTrivia; TriviaCard, TriviaSummaryCard
  - videos: VideoDrawerHost
  - (no dedicated `streaming` folder: streaming = overlay/StreamOnOverlay + lists/where-to-watch)
- **terms**: Terms.svelte (terms of service)
- **toast**: Now playing / rate-now toast UI
  - Toast, NavbarToastContent; _internal: NowPlayingContent, RateNowContent, ProgressBar, StopButton, ToastItemCard, episode/movie/show covers
- **vip**: VIP subscribe + manage
  - VipSubscribe, VipManage, StripeReturnHandler, UsageLimitItem
  - _internal: VipHeader, VipFeatures/VipFeature, IncreasedLimits, BuiltToLast, JoinNow, UpgradeButton, TwoYearDealCard, LifetimeBadge, Subscriptions/SubscriptionCard/Detail/Actions/Tag, PaymentHistory, PaymentMethodDetail, PaypalSwitchCard, UsageLimits/UsageBar/UsageTabs, GlassCard, icons/
- **welcome**: Post-signup onboarding
  - Welcome.svelte; components/WelcomeIntro, WelcomeImport (importer cards, TV Time notice), WelcomeVipUpsell, WelcomeOutro, WelcomeBackdrop
- **yir**: Year / month in review
  - root: YirPage, MirPage, ReviewRouteLayout, getYirTemplate, ReviewMode
  - _internal (current template): YirPageInner, YirHeader, MirHeader, ReviewPageShell, sections Totals/Stats/Title/MostWatched/Rated/Genres/People/Networks/Studios/Calendar/Upgrade, charts Daily/Weekly/Monthly/Hourly plays, YearBar, GenreBars, RatingsBar, Networks, Companies/Streaming bubble charts, CountriesMap, tooltip; useYirDetail, useMirDetail, useYirPeople, withYirIntlOverlay
  - 2024: Yir2024 legacy template (hero, stats, most played, trends, genres, people, countries, companies, streaming, rated, membership, thanks)
  - all-time: YirAllTime (top section, countries, release years, list progress)
  - default: YirDefault

## 3. lib/guards

| component | props | values |
| --- | --- | --- |
| RenderFor.svelte | `audience` (required), `device?`, `input?`, children | audience: `authenticated` (authorized + user loaded), `public` (not authorized), `all`, `director` (authorized + isDirector, or IS_DEV), `vip` (authorized + isVip), `free` (authorized + not VIP). device: array of `mobile`, `tablet-sm`, `tablet-lg`, `desktop`. input: array of `mouse`, `touch`. SSR renders with CSS media-class fallbacks. |
| RenderForFeature.svelte | `flag: FeatureFlag`, `enabled: Snippet`, `audience?` (default `vip`), children (fallback) | audience: `director` / `vip`. Renders `enabled` when flag on AND audience matches, else children. |
| _internal/RenderForAudience.svelte | `audience`, children, `fallback?` | same audience set as above |
| _internal/RenderForDevice.svelte | `device` | as above (useMedia, debounced 60fps) |
| _internal/RenderForInput.svelte | `input` | as above |

AudienceProps is a global type in `src/app.d.ts`; also used by promotions (`Promotion` = id/start/end + audience).


---

# trakt-boxed: request inventory + feature scan

Scope: `projects/client/src/lib/requests` (no `*.spec.ts`, no `_internal/` mappers, no `models/`).
Paths resolved by walking the `@trakt/api@0.6.0` ts-rest contract (the version `package.json` pins; the root `node_modules` has a stale 0.4.14 install that lacks plex/smart-lists/releasesHot routes).

Legend:
- **SDK** paths are relative to the Trakt API host (`api.trakt.tv`-style) via `api({ fetch })` / `unauthorizedApi`.
- **raw** = `rawApiFetch({ path })`, same host but the path isn't in the SDK. Includes `/v3/...` endpoints.
- **info/N** = `GET /v3/media/:type/:slug/info/:N/version/:v?locale=` (`_internal/toMediaInfoPath.ts`). N: 0 sentiment, 5 trivia, 15 soundtrack, 16 parental guide, 17 YouTube special.
- **TU** = Trakt-unique vs Letterboxd: `Y` means Letterboxd has nothing like it, `~` means Letterboxd has a partial or different-shaped version, blank means Letterboxd has it.

Counts: 234 `.ts` files in scope, including a few infra and payload helpers (plus ~60 `_internal` mappers and 8 `search/response` mappers, which are not listed one by one).

## Movies (`queries/movies`)
| file | call | purpose | TU |
|---|---|---|---|
| movieSummaryQuery | GET /movies/:id (extended full,images,colors,streaming_ids) | movie detail | |
| movieAnticipatedQuery | GET /movies/anticipated | most-watchlisted upcoming | Y |
| movieTrendingQuery | GET /movies/trending | watching-now trending | ~ |
| moviePopularQuery | GET /movies/popular | popular | |
| movieCommentsQuery | GET /movies/:id/comments/:sort | comments/reviews on movie | |
| movieFavoritesQuery | GET /users/:id/favorites/movies/:sort | user favorite movies | ~ |
| movieIntlQuery | GET /movies/:id/translations/:language | localized title/overview | |
| movieJustWatchUrlQuery | GET /movies/:id/watchnow/justwatch_links/:country | JustWatch deep link | ~ |
| movieListsQuery | GET /movies/:id/lists/:type/:sort | lists containing movie | |
| moviePeopleQuery | GET /movies/:id/people | cast/crew | |
| movieRatingQuery | GET /movies/:id/ratings | rating distribution + external (IMDb/RT/etc) | ~ |
| movieRelatedQuery | GET /movies/:id/related | related titles | |
| movieStatsQuery | GET /movies/:id/stats | watchers/plays/lists/comments counts | ~ |
| movieStudiosQuery | GET /movies/:id/studios | studios | |
| movieVideosQuery | GET /movies/:id/videos | trailers/videos | |
| movieWatchersQuery | GET /movies/:id/watching | users watching right now | Y |
| movieSentimentQuery | raw info/0 | AI sentiment pros/cons | Y |
| movieTriviaQuery | raw info/5 | trivia + summary bullets | Y |
| movieSoundtrackQuery | raw info/15 | Spotify-resolved soundtrack | Y |
| movieYouTubeSpecialQuery | raw info/17 | YouTube special (flagged) | Y |
| streamMovieQuery / streamAllMovieQuery | GET /movies/:id/watchnow/:country | where to watch (one country / all) | ~ |
| showVideosQuery (misfiled here) | GET /shows/:id/videos, /shows/:id/seasons/:season/videos | show + season videos | |

## Shows (`queries/shows`)
| file | call | purpose | TU |
|---|---|---|---|
| showSummaryQuery | GET /shows/:id | show detail | Y (TV) |
| showAnticipatedQuery | GET /shows/anticipated | anticipated shows | Y |
| showTrendingQuery / showPopularQuery | GET /shows/trending, /shows/popular | discovery | Y |
| showCommentsQuery | GET /shows/:id/comments/:sort | comments | Y |
| showFavoritesQuery | GET /users/:id/favorites/shows/:sort | favorites | Y |
| showIntlQuery | GET /shows/:id/translations/:language | intl | Y |
| showJustWatchUrlQuery | GET /shows/:id/watchnow/justwatch_links/:country | JustWatch link | Y |
| showSeasonJustWatchUrlQuery | GET /shows/:id/seasons/:season/watchnow/justwatch_links/:country | season JustWatch link | Y |
| showListsQuery | GET /shows/:id/lists/:type/:sort | lists containing show | Y |
| showPeopleQuery | GET /shows/:id/people | cast/crew | Y |
| showProgressQuery | GET /shows/:id/progress/watched | per-show watched progress | Y |
| showRatingQuery | GET /shows/:id/ratings | ratings | Y |
| showRelatedQuery | GET /shows/:id/related | related | Y |
| showSeasonsQuery | GET /shows/:id/seasons | season list | Y |
| showSeasonEpisodesQuery | GET /shows/:id/seasons/:season | season episodes | Y |
| showSeasonCommentsQuery | GET /shows/:id/seasons/:season/comments/:sort | season comments | Y |
| showSeasonPeopleQuery | GET /shows/:id/seasons/:season/people | season cast | Y |
| showStatsQuery / showStudiosQuery | GET /shows/:id/stats, /shows/:id/studios | stats / networks+studios | Y |
| showWatchersQuery | GET /shows/:id/watching | watching now | Y |
| showSentimentQuery / showTriviaQuery / showSoundtrackQuery | raw info/0, info/5, info/15 | sentiment / trivia / soundtrack | Y |
| startShowRewatchingRequest | raw POST /shows/:id/progress/watched/reset | start rewatch (reset progress) | Y |
| stopShowRewatchingRequest | raw DELETE /shows/:id/progress/watched/reset | stop rewatch | Y |
| streamShowQuery / streamAllShowQuery | GET /shows/:id/watchnow/:country | where to watch | Y |

## Episodes (`queries/episode`) - all Y (TV)
| file | call | purpose |
|---|---|---|
| episodeSummaryQuery | GET /shows/:id/seasons/:s/episodes/:e | episode detail |
| episodeCommentsQuery | GET .../episodes/:e/comments/:sort | comments |
| episodeIntlQuery | GET .../episodes/:e/translations/:language | intl |
| episodePeopleQuery | GET .../episodes/:e/people | guest cast/crew |
| episodeRatingQuery | GET .../episodes/:e/ratings | ratings |
| episodeStatsQuery | GET .../episodes/:e/stats | stats |
| episodeWatchersQuery | GET .../episodes/:e/watching | watching now |
| streamEpisodeQuery / streamAllEpisodeQuery | GET .../episodes/:e/watchnow/:country | where to watch |

## Media (combined movie+show) (`queries/media`)
| file | call | purpose | TU |
|---|---|---|---|
| mediaAnticipatedQuery | GET /media/anticipated | mixed anticipated | Y |
| mediaTrendingQuery / mediaPopularQuery | GET /media/trending, /media/popular | mixed discovery | ~ |
| mediaFavoritesQuery | GET /users/:id/favorites/media/:sort | mixed favorites | ~ |
| mediaRecommendedQuery | raw GET /media/recommendations?... | personalized recs (mixed) | ~ |
| mediaParentalGuideQuery | raw info/16 | parental guide (flagged) | Y |
| mediaSocialQuery | raw GET /movies/:slug/social, /shows/:slug/social, /shows/:slug/seasons/:s/episodes/:e/social | friends' activity/ratings/comments on a title | ~ |

## Calendars (`queries/calendars`) - all Y
| file | call | purpose |
|---|---|---|
| upcomingEpisodesQuery | GET /calendars/:target/shows/:start_date/:days | my/all upcoming episodes |
| upcomingMoviesQuery | GET /calendars/:target/movies/:start_date/:days | upcoming movies |
| upcomingMediaQuery | GET /calendars/:target/media/:start_date/:days | mixed calendar |
| releasesCalendarQuery | GET /calendars/releases/hot/:start_date/:days (unauth) | "hot releases" discover feed |

## Check-in (`queries/checkin`) - all Y
| file | call | purpose |
|---|---|---|
| checkinMovieRequest / checkinEpisodeRequest | POST /checkin | check in (watching now) |
| deleteCheckinRequest | DELETE /checkin | cancel check-in |

## Comments (`queries/comments`)
| file | call | purpose | TU |
|---|---|---|---|
| commentQuery | raw GET /comments/:id?extended=images | single comment | |
| commentItemQuery | raw GET /comments/:id/item | media the comment belongs to | |
| commentRepliesQuery | GET /comments/:id/replies | replies | |
| commentReactionsQuery | GET /comments/:id/reactions/summary | reaction counts by type | ~ |
| postCommentRequest | POST /comments/ | post comment/review | |
| editCommentRequest / deleteCommentRequest | PUT / DELETE /comments/:id/ | edit/delete | |
| replyCommentRequest | POST /comments/:id/replies | reply | |
| reactCommentRequest / removeReactionCommentRequest | POST / DELETE /comments/:id/reactions/:reaction_type | multi-type reactions | ~ |

## GIFs (`queries/gifs`) - Klipy, `https://api.klipy.com/api/v1/:key/...`
| file | call | purpose | TU |
|---|---|---|---|
| gifCategoriesQuery | GET gifs/categories | picker categories | Y |
| gifSearchQuery | GET gifs/search | GIF search (infinite) | Y |
| gifTrendingQuery | GET gifs/trending | trending GIFs | Y |
| gifShareRequest | POST gifs/share/:slug | Klipy share ping | Y |

## Intl (`queries/intl`)
| bulkIntlQuery | raw GET /v3/intl/bulk?... | batch translations for movie/show/episode ids | |
|---|---|---|---|

## Lists (`queries/lists`)
| file | call | purpose | TU |
|---|---|---|---|
| listSummaryQuery | GET /lists/:id | list meta (official/public) | |
| listItemsQuery | GET /lists/:id/items/{movie,show,movie+show,...} (sort_by/how, filters) | list items | |
| likeListRequest / unlikeListRequest | POST / DELETE /lists/:id/like | list likes | |

## People (`queries/people`)
| file | call | purpose | TU |
|---|---|---|---|
| peopleSummaryQuery | GET /people/:id/ | person detail | |
| personMovieCreditsQuery | GET /people/:id/movies | movie credits | |
| personShowCreditsQuery | GET /people/:id/shows | show credits | Y (TV) |
| peopleThisMonthQuery | raw fetch `https://apiz.trakt.tv/people/this_month` | trending/birthday people this month | Y |

## Recommendations (`queries/recommendations`)
| file | call | purpose | TU |
|---|---|---|---|
| recommendedMoviesQuery | raw GET /movies/recommendations?... | personalized movie recs | ~ |
| recommendedShowsQuery | raw GET /shows/recommendations?... | personalized show recs | Y |
| hideRecommendedMovieRequest / hideRecommendedShowRequest | DELETE /recommendations/{movies,shows}/:id | dismiss rec | Y |

## Reports (`queries/reports`)
| reportRequest | POST /{comments,movies,shows,seasons,episodes,people,lists,users}/:id/report | report content/user | ~ |
|---|---|---|---|

## Search (`queries/search`, `lib/requests/search`)
| file | call | purpose | TU |
|---|---|---|---|
| searchMediaQuery | GET /search/:type, GET /search/:type/exact | movie/show search | |
| searchPeopleQuery / searchListsQuery | GET /search/:type | people / list search | |
| searchTrendingQuery | GET /search/recent_by_id/global/:type | trending searches | Y |
| recentSearchRequest | POST /search/recent/ | record recent search | ~ |
| getMedia / getPeople | Typesense (host from config, `https`) | instant search via Typesense keys | |
| search/createSearcher, search/lookup, search/hasSlug | Typesense client + multi-search helpers | infra | |
| search/response/* (8 files) | mappers Typesense hit -> Media/Person | infra | |

## Streaming services / watch-now (`queries/services`)
| file | call | purpose | TU |
|---|---|---|---|
| streamingSourcesQuery | GET /watchnow/sources | all streaming sources by country | ~ |
| saveStreamingPreferencesRequest | PUT /users/settings (browsing.watchnow) | default country + favorite services | ~ |

## Streaming sync (Younify) (`queries/streaming-sync`) - all Y
| file | call | purpose |
|---|---|---|
| streamingConnectionsQuery | GET /younify/connections | connected streaming accounts |
| connectStreamingRequest | POST /younify/connect | connect a service (Netflix etc) |
| disconnectStreamingRequest | DELETE /younify/users/services/:service_id | disconnect |
| refreshStreamingRequest | POST /younify/users/refresh/:service_id[/:all_data] | re-sync (incremental/full) |
| dataSyncsQuery / dataSyncsSummaryQuery | GET /users/syncs/:type | sync runs list/summary |
| dataSyncQuery | GET /users/syncs/:id | one sync run |
| syncPausedItemsQuery / syncSkippedItemsQuery | GET /users/syncs/:id/{paused,skipped} | items needing review |
| undoSyncRequest | DELETE /users/syncs/:id | undo a sync |

## Plex (`lib/requests/plex`) - all Y
| file | call | purpose |
|---|---|---|
| plexSettingsQuery / plexUpdateSettingsRequest | GET / PUT /users/settings/plex/ | Plex scrobble/sync settings |
| plexConnectRequest / plexRevokeRequest | POST / DELETE /users/settings/plex/connect | link/unlink Plex |
| plexServersQuery | GET /users/settings/plex/servers | Plex servers |
| plexServerAccountsQuery | GET /users/settings/plex/servers/:server_id | server accounts |
| plexSyncRequest | POST /users/settings/plex/sync | trigger library sync |
| plexDataSyncsQuery / plexUndoSyncRequest | GET /users/syncs/:type, DELETE /users/syncs/:id | Plex sync history/undo |
| PlexErrorCode | enum | error codes |

## Smart lists (`queries/smart-lists` + users) - all Y
| file | call | purpose |
|---|---|---|
| smartListItemsQuery | GET /smart-lists/:list_id/items | filter-driven list items |
| smartListSummaryQuery | GET /users/:id/smart-lists/:list_id/ | smart list meta |
| users/smartListQuery | GET /users/:id/smart-lists | my smart lists |
| users/createSmartListRequest | POST /users/:id/smart-lists | create |
| users/deleteSmartListRequest | DELETE /users/:id/smart-lists/:list_id/ | delete |

## Stats / team / apps
| file | call | purpose | TU |
|---|---|---|---|
| stats/registeredMemberCountQuery | raw GET /v3/stats/users | live member counter | Y |
| team/traktTeamQuery | GET /team/ | about-page team | |
| apps/connectedAppsQuery | raw GET /v3/users/me/connected-apps | OAuth apps list | Y |
| apps/revokeConnectedAppRequest | raw DELETE /v3/users/me/connected-apps/:id | revoke app | Y |

## Sync / library / progress (`queries/sync`, `lib/requests/sync`)
| file | call | purpose | TU |
|---|---|---|---|
| queries/sync/libraryQuery | GET /sync/collection/{media,movies,episodes} (available_on) | collection/library (by format/source) | Y |
| queries/sync/upNextNitroQuery | GET /sync/progress/up_next_nitro | Up Next (continue watching) | Y |
| queries/sync/progressWatchedQuery | GET /sync/progress/up_next_nitro | show progress list | Y |
| queries/sync/movieProgressQuery | GET /sync/playback/movies | paused/in-progress movies | Y |
| queries/sync/mediaProgressQuery | composes upNext + movieProgress | unified continue-watching | Y |
| sync/markAsWatchedRequest / removeWatchedRequest | POST /sync/history, /sync/history/remove | log / unlog watches | |
| sync/addRatingRequest / removeRatingRequest | POST /sync/ratings, /sync/ratings/remove | rate / unrate | |
| sync/addToWatchlistRequest / removeFromWatchlistRequest | POST /sync/watchlist, /sync/watchlist/remove | watchlist | |
| sync/addToFavoritesRequest / removeFromFavoritesRequest | POST /sync/favorites, /sync/favorites/remove | favorites | ~ |
| sync/toAddRatingsPayload, toRemoveRatingsPayload | payload builders | infra | |

## Users (`queries/users`)
| file | call | purpose | TU |
|---|---|---|---|
| userProfileQuery | GET /users/:id/ | profile | |
| userStatsQuery | raw GET /users/:slug/stats | lifetime stats | ~ |
| userLeaderboardQuery | raw GET /users/:slug/leaderboard?page&limit | friends leaderboard (flagged) | Y |
| userMatchQuery | raw GET /v3/users/:slug/match | taste match/compatibility | Y |
| userRatingsQuery | GET /users/:id/ratings/ | user ratings | |
| userCommentsQuery | GET /users/:id/comments/:comment_type/:type | user's comments/reviews | |
| userWatchingQuery | GET /users/:id/watching | currently watching (check-in/scrobble) | Y |
| activityHistoryQuery | GET /users/:id/history/ | full watch history (diary) | |
| movieActivityHistoryQuery | GET /users/:id/history/movies[/:item_id] | movie history | |
| showActivityHistoryQuery / episodeActivityHistoryQuery | GET /users/:id/history/{shows,episodes}[/:item_id] | TV history | Y |
| currentUserWatchedMoviePlaysQuery / ...ShowPlaysQuery | raw GET /v3/users/me/watched/{movies,shows}/plays?limit=all | play counts for badges | ~ |
| socialActivityQuery | GET /users/:id/:type/activities | friends/following activity feed | |
| followersQuery / followingQuery | GET /users/:id/{followers,following} | social graph | |
| followUserRequest / unfollowUserRequest | POST / DELETE /users/:id/follow | follow | |
| approveFollowRequest / denyFollowRequest | POST / DELETE /users/requests/:id | private-profile follow requests | ~ |
| blockUserRequest / unblockUserRequest | POST / DELETE /users/:id/block | block | |
| blockedUsersQuery | GET /users/blocked | blocked list | |
| watchlistQuery | GET /users/:id/watchlist/{movies,shows,movie+show}/:sort | watchlist | |
| reorderWatchlistRequest | raw POST /sync/watchlist/reorder | rank watchlist | |
| personalListsQuery | GET /users/:id/lists | user lists | |
| userListsQuery | raw GET /v3/users/me/lists | my lists (lightweight) | |
| collaborationListsQuery | GET /users/:id/lists/collaborations | collaborative lists | ~ |
| likedListsQuery | GET /users/likes/lists (+ /users/likes/comments) | liked lists | |
| userListSummaryQuery / userListItemsQuery | GET /users/:id/lists/:list_id/[items/...] | list detail/items | |
| createListRequest / updateListRequest / deleteListRequest | POST/PUT/DELETE /users/:id/lists[/:list_id] | list CRUD | |
| addToListRequest / removeFromListRequest | POST /users/:id/lists/:list_id/items[/remove] | list items | |
| reorderListRequest | raw POST /users/:id/lists/:list_id/items/reorder | rank list items | |
| reorderUserListsRequest | raw POST /users/:id/lists/reorder | order lists | Y |
| userMovieListIds / userShowListIds / userSeasonListIds / userEpisodeListIdsQuery | raw GET /v3/{movies,shows,seasons,episodes}/:id/me/lists | which of my lists contain item | ~ |
| userNotesQuery | raw GET /v3/users/me/notes/:type/:slug | private notes on item | Y |
| postNoteRequest / editNoteRequest / deleteNoteRequest | raw POST /v3/users/me/notes, PUT/DELETE /v3/users/me/notes/:id | notes CRUD | Y |
| hiddenShowsQuery | GET /users/hidden/progress_watched | hidden from progress | Y |
| droppedShowsQuery | GET /users/hidden/dropped | dropped shows | Y |
| dropShowRequest / hideShowCalendarRequest | POST /users/hidden/:section | drop show / hide from calendar | Y |
| restoreShowProgressRequest / restoreShowCalendarRequest | POST /users/hidden/{progress_watched,calendar}/remove | unhide | Y |
| dropMovieRequest | DELETE /sync/playback/:id | drop paused movie | Y |
| yearInReviewQuery | GET /users/:id/yir/:year | Year in Review | ~ |
| yirDetailQuery | raw GET /users/:slug/yir/:year (slurm) | YIR detail sections | ~ |
| yirPeopleQuery | raw GET /users/:slug/yir/:year/people/:type | YIR top people | ~ |
| monthInReviewQuery | GET /users/:id/mir/:year/:month | Month in Review | Y |
| mirDetailQuery | raw GET /users/:slug/mir/:year/:month | MIR detail | Y |
| saveSettingsRequest | PUT /users/settings | settings | |
| changeEmailRequest | raw PUT /users/email | change email | |
| deleteAccountRequest | raw DELETE /users/settings | delete account | |
| uploadAvatarRequest | PUT /users/avatar | avatar | |
| setCoverImageRequest / resetCoverImageRequest | PUT /users/set_cover | profile cover/backdrop | ~ |

## VIP (`lib/requests/vip`, `queries/vip`) - all Y
| file | call | purpose |
|---|---|---|
| vipPlansQuery | raw GET /vip/plans | plans/prices |
| vipSubscriptionQuery | raw GET /vip/details | current subscription |
| startCheckoutQuery | raw POST /vip/stripe/create?duration&success_url&cancel_url | Stripe checkout |
| confirmCheckoutQuery | raw POST /vip/stripe/confirm?session_id | confirm checkout |
| manageSubscriptionQuery | raw POST /vip/stripe/update | Stripe portal |
| cancelSubscriptionQuery | raw POST /vip/stripe/cancel | cancel |
| queries/vip/userLimitsQuery | raw GET /v3/users/me/usage | free-tier usage limits (lists/items) |

## Infra (not endpoints)
`api.ts` (SDK client + `rawApiFetch`, auth via `_internal/createAuthenticatedFetch.ts`), `ClientEnvironment.ts`, `_internal/fetchReviewResource.ts` (YIR/MIR with `?extended=images&slurm=`), `queries/users/_internal/postReorderRequest.ts` (POST rank), `queries/users/_internal/listIdsRequest.ts`.

---

## Keyword scan (all of `src`, excluding paraglide/specs/mocks)

| keyword | verdict |
|---|---|
| sentiment | Real: AI pros/cons drawer, `lib/sections/summary/components/sentiment/`, movie+show queries (info/0), used in `routes/{movies,shows}/[slug]` |
| trivia | Real: `summary/components/trivia/`, `SummaryDrawers.ts`, info/5 queries |
| reaction | Real: comment reactions (`summary/components/comments/_internal/comment-actions/ReactButton`, `ReactionsSummary`, `ReactionsDistribution`, `useCommentReactions`) |
| vibe | Not found (only incidental in `isBotAgent.ts`) |
| mood | Not found |
| badge | Mostly UI chips: `VipBadge`, `StreamingServiceBadge`, `SettingsStatusBadge`, YIR badge colors. No achievement badges |
| streak | Real: watch streak, `lib/sections/stats/StreakCallout`, `StreakDrawerHost`, `_internal/useStreak.ts`, home + dashboard |
| leaderboard | Real (flag `leaderboard`): `lib/sections/profile/leaderboard/` (`LeaderboardPill`, drawer), `userLeaderboardQuery` |
| achievement | Not found |
| spotlight | Real but not a content feature: `lib/features/spotlight/` = command palette overlay (Cmd-K style); `sections/landing/useSpotlight*` = landing hero carousel |
| yir | Real: Year in Review, `lib/sections/yir/{2024,all-time,default,_internal}`, `routes/users/[user]/year/[year]`, banner `sections/banner/year-in-review` |
| mir | Real: Month in Review, `routes/users/[user]/mir/[year]/[month]`, `sections/banner/month-in-review`, `monthInReviewQuery`/`mirDetailQuery` (other hits incidental, e.g. "mirror") |
| month | Real in MIR + `stats/_internal/useMonthlyStats.ts`, `peopleThisMonthQuery`; rest date formatting |
| wrap | Incidental (CSS wrap / wrapper). No "wrapped" feature besides YIR |
| drop | Real: drop show/movie, `lib/sections/media-actions/drop/`, `droppedShowsQuery`, `dropShowRequest`, `dropMovieRequest`; also incidental dropdown/dropzone |
| lounge | Not found |
| smart | Real: smart lists, `lib/sections/lists/smart/`, `lib/sections/smart-lists/`, `routes/lists/smart/{create,view,view/[list]}`; also `UpNextSmartSort` flag |
| collaborat | Real: collaborative lists, `routes/users/[user]/lists/view/collaborations`, `collaborationListsQuery`, export includes them |
| note | Real: private notes, `lib/features/notes/`, `summary/components/notes/`, `media-actions/drop` (note on drop), notes queries |
| hidden | Real: hidden items (progress/calendar/dropped/recommendations), settings sections; many incidental `hidden` CSS/attr hits |
| check-in | Real: `components/buttons/check-in`, `sections/media-actions/check-in`, `queries/checkin` |
| scrobble | Real via Plex scrobble settings + `NowPlayingItem` model; settings/privacy/about copy. No browser scrobbler |
| plex | Real: `routes/settings/plex`, `sections/settings/_internal/plex`, `lib/features/plex`, `lib/requests/plex`, library "available on Plex", where-to-watch Plex |
| import | Real feature: `lib/sections/settings/import/` with parsers TvTime (GDPR, native, export, CSV, Liberator), IMDb, Letterboxd, Trakt JSON/CSV; `ImportDropzone`, matching engine (rest = TS imports) |
| export | Real feature: `lib/sections/settings/export/` (`runRawExport`, `runCustomLibraryExport`, `runExportGate`, SVG export), `_internal/export-gate`, `RawExport.svelte` |
| filter | Real: `lib/features/filters/` global discover filters (genres, decades, runtime, countries, regions, certifications, parental guide, streaming), `FilterProvider`, `useStoredFilters` |
| sort | Real: Up Next sorting (`progress/useUpNextSorting.ts`, `UpNextSortProps`), list `sort_by/sort_how`, watchlist sort, favorites sort |
| spoiler | Real: `lib/features/spoilers/` (spoiler-free episode titles/images, `useMediaSpoiler`), comment spoilers, settings toggle |
| justwatch | Real: JustWatch deep links, `sections/lists/where-to-watch/`, movie/show/season JustWatch queries |
| favorite | Real: favorites (movies/shows/media), `components/buttons/favorite`, `sections/lists/favorites`, `routes/profile/[slug]/favorites`, favorite streaming services in settings; flag `scoped-favorites` |
| watch-now | Real: `/watchnow` sources + per-title watchnow; settings streaming-services |
| trailer | Real: trailer URL mapping (`mapToTrailerUrl`), `summary/components/videos`, YouTube player (`lib/features/player`) |
| soundtrack | Real (flag `soundtrack`): `summary/components/soundtrack/`, info/15 queries |
| post-credit | Real: post-credits scene tags (`PostCreditsSchema`, `components/media/tags`, summary) |
| anticipated | Real: `sections/lists/anticipated`, `routes/{movies,shows,media}/anticipated`, `/discover/anticipated` |
| trending | Real: `sections/lists/trending`, `/discover/trending`, trending searches, trending GIFs |
| recommend | Real: `sections/lists/recommended`, `/discover/recommended`, `media-actions/hide-recommendation`, rec queries |
| certification | Real as filter + summary detail + smart-list filter (`toSmartListFilters.ts`); no separate certifications page |
| genre | Real: genre filters (`features/filters/_internal/genres.ts`), genre picker settings (`Genres.svelte`, `GenreSlots`, flag `genre-picker`), genre icons, YIR genres |
| network | Mostly incidental (network/offline); real hits: networks in YIR + summary details (via studios) |
| studio | Real: studios shown on summary (`movieStudiosQuery`, `showStudiosQuery`), YIR top studios. No studio browse page |
| notification | Not found as feature (only import copy / token renewal). No notifications inbox |
| follow | Real: follow/unfollow, follow requests, followers/following in profile |
| activity | Real: `routes/social/activity`, `sections/lists/activity`, activity history, `ActivityHeatmap` stats |
| block | Real: block users (`BlockedUsers.svelte`, block queries); many incidental CSS `block` hits |
| report | Real: `lib/features/report/` (ReportForm, reasons per type) + `reportRequest`; also `routes/api/tv-time-report` (import failure reports) |
| vip | Real: `lib/sections/vip/`, `routes/vip`, `/vip/renew`, VIP queries, VIP-only preview flags |
| upsell | Real: `lib/features/upsell`, `SettingsVipUpsell`, `VipUpsellBadge`, YIR/list upsells |
| tv-time | Real: TV Time import (5 parsers), `routes/faq/tv-time`, banners `tv-time`/`tv-time-import`, `routes/api/tv-time-report` |
| letterboxd | Real: `LetterboxdParser.ts` import; Letterboxd rating in `RatingList`/`mapToMediaRating` (external rating source) |
| imdb | Real: IMDb import parser, IMDb rating/links, smart-list IMDb rating filter |
| rotten | Real: Rotten Tomatoes rating (`RatingList`, `rating/_internal/RottenTomato.svelte`) |
| popcorn | Real: RT audience popcorn (`PopcornBurst.svelte`, `RatingList`) |
| ratings distribution | Real: `summary/components/rating/_internal/RatingsDistribution.svelte`, `SeasonRatingsChart`, comment `ReactionsDistribution` |

---

## Trakt-unique vs Letterboxd

| feature | exists? | where | notes |
|---|---|---|---|
| Sentiment (AI pros/cons) | Yes | `summary/components/sentiment/`, `movieSentimentQuery`/`showSentimentQuery` (info/0) | Letterboxd has nothing like it |
| Trivia / fun facts | Yes | `summary/components/trivia/`, info/5 | Letterboxd doesn't have it |
| Comments + reactions + replies + spoilers | Yes | `queries/comments/*`, `summary/components/comments/`, `features/spoilers` | Multi-type reactions, reaction distribution, GIF picker (Klipy), spoiler flag. Letterboxd has reviews + likes + comments |
| Where to watch + JustWatch | Yes | `sections/lists/where-to-watch/`, `stream*Query`, `*JustWatchUrlQuery`, `/watchnow/sources` | Letterboxd has a JustWatch panel too, but Trakt covers episodes/seasons and favorite services |
| Calendar | Yes | `routes/calendar`, `features/calendar`, `queries/calendars/*`, `/discover/releases` (hot releases) | Letterboxd doesn't have it |
| Up Next / progress / continue watching | Yes | `sections/lists/progress/`, `upNextNitroQuery`, `movieProgressQuery`, `mediaProgressQuery`, `routes/users/[user]/progress`, `/start-watching` | TV core, smart sort flag, rewatching (flag) |
| Check-in / watching now | Yes | `queries/checkin`, `media-actions/check-in`, `*WatchersQuery`, `userWatchingQuery` | Letterboxd doesn't have it |
| Collection / library | Yes | `libraryQuery`, `sections/lists/library`, `routes/users/[user]/library` | Tracks format/source (Plex `available_on`) |
| Hidden items | Yes | `users/hidden*`, `restoreShow*`, `droppedShowsQuery`, settings | Hide from progress/calendar/recs; drop shows |
| Notes | Yes | `lib/features/notes`, `/v3/users/me/notes` | Private per-item notes. Letterboxd only has diary review text |
| Ratings 1-10 vs stars | Both | `rating/constants` STAR_RATINGS maps 5 stars to 2/4/6/8/10, half stars when allowed (`starFill.ts`) | Stored on 1-10, shown as Letterboxd-style stars; external IMDb/RT/popcorn/Letterboxd ratings shown |
| Favorites | Yes | `sync/*Favorites*`, `sections/lists/favorites`, `routes/profile/[slug]/favorites` | Unlimited, sortable. Letterboxd caps at 4 "favorite films" |
| Smart lists | Yes | `sections/lists/smart`, `sections/smart-lists`, `routes/lists/smart/*`, `smart-lists` queries | Filter-driven dynamic lists |
| Official lists | Yes | `routes/lists/official/[list]`, `listSummaryQuery`/`listItemsQuery` | Trakt-curated |
| Collaborative lists | Yes | `collaborationListsQuery`, `routes/users/[user]/lists/view/collaborations` | Letterboxd doesn't have it |
| List likes | Yes | `like/unlikeListRequest`, `likedListsQuery`, `/lists/view/liked` | Letterboxd has this too |
| VIP features | Yes | `lib/sections/vip`, `routes/vip`, Stripe queries, `userLimitsQuery`, VIP preview flags, upsells | Similar to Letterboxd Pro/Patron, but gates different things |
| Year in review / month in review | Yes | `sections/yir`, `routes/users/[user]/year/[year]`, `routes/users/[user]/mir/[year]/[month]` | Letterboxd has a yearly review; month in review is Trakt-only |
| Stats | Yes | `sections/stats` (heatmap, streak, screen time, weekly pulse, peak hours), `userStatsQuery` | Streaks and screen time are Trakt-only |
| Recommendations | Yes | `recommended*Query`, `mediaRecommendedQuery`, `/discover/recommended`, hide rec | Personalized, can be dismissed |
| Social / following / activity feed | Yes | follow queries, `socialActivityQuery`, `routes/social/activity`, `mediaSocialQuery`, `userMatchQuery` (taste match) | Follow requests for private profiles; taste match |
| Notifications | No | - | No inbox or notification center |
| Plex / scrobble | Yes | `lib/requests/plex`, `routes/settings/plex`, `features/plex` | Plus Younify streaming sync (`queries/streaming-sync`, Netflix etc) |
| Imports (TV Time, Letterboxd) | Yes | `sections/settings/import/parsers/*` | TV Time x5 formats, Letterboxd, IMDb, Trakt JSON/CSV, with an unresolved-items CSV |
| Exports | Yes | `sections/settings/export/*`, `export-gate` | Raw JSON export + custom library export, VIP-gated |
| Anticipated / trending / popular / recommended | Yes | `/discover/*`, `routes/{movies,shows,media}/{anticipated,trending,popular,recommended}` | Anticipated is Trakt-only |
| Streaming services settings | Yes | `routes/settings/streaming-services[/id]`, `saveStreamingPreferencesRequest` | Country + favorite services |
| Watch-now | Yes | `stream*Query` | Per movie/show/episode |
| Trailers | Yes | `movieVideosQuery`, `showVideosQuery`, `summary/components/videos`, `features/player` | Plus YouTube specials (flag) |
| Related | Yes | `routes/{movies,shows}/[slug]/related`, episode related | Letterboxd has "similar" too |
| People credits | Yes | `routes/people/[slug]/{movies,shows,history}` | Show credits and per-person history are Trakt-only |
| Studios / networks | Partial | shown on summary + YIR | No browse-by-studio/network page (Letterboxd has studio pages) |
| Certifications | Partial | filter + summary detail + smart-list filter | No certifications page. Parental guide (flag) is Trakt-only |
| Genre filters | Yes | `features/filters`, genre picker settings (flag) | Global filters apply across discover |
| Drops | Yes | `media-actions/drop`, `drop*Request`, `droppedShowsQuery` | Drop a show/movie, optionally with a note |
| Badges / achievements | No | - | "badge" hits are only UI chips (VIP, streaming, status) |
| Leaderboards | Yes (flagged) | `sections/profile/leaderboard`, `userLeaderboardQuery` | Behind the `leaderboard` preview flag |
| Extra Trakt-only | Yes | soundtrack (info/15), post-credits tags, parental guide (info/16), live member counter, connected apps, command-palette spotlight | |


---

# trakt-boxed: shows depth, design system, i18n (recon)

App root: `projects/client/src`. All paths below are relative to it unless noted.

---

## A. Shows depth

### A.1 Models (`lib/requests/models/`)

**MediaEntry** (base for ShowEntry/MovieEntry)
`id, imdbId?, tmdbId?, key, slug, type ('movie'|'show'), year?, runtime, title, originalTitle?, tagline, country?, languages?, poster{url}, cover{url}, logo{url}, thumb{url}, genres[], status: MediaStatus, overview, trailer?, airDate, releaseDate, effectiveReleaseDate, certification?, votes, colors?[2], plexSlug?, postCredits[], rating? (0-1), homepage?, socialMedia?, updatedAt?`

**ShowEntry** = MediaEntry + EpisodeCount +
| field | type | notes |
|---|---|---|
| `episode.count` | number | = `aired_episodes` |
| `network` | string? | single network string |
| `totalRuntime` | number | `total_runtime` or runtime x aired eps |
| `airs` | `{day, time, timezone}`? | only when all three present |
| `lastAired` | Date? | |

**MediaStatus** (from `@trakt/api` statusResponseSchema + `'unknown'`): `released, planned, post production, canceled, in production, rumored, ended, returning series, pilot, continuing, upcoming, unknown`. `ended`/`canceled` treated as "not airing" (`useMediaDetails.ts` ENDED_STATUSES).

**EpisodeEntry** (`EpisodeEntry.ts`)
`id, imdbId?, key ('episode-<id>'), season, number, title, overview, cover{url?}, genres[], airDate, releaseDate, effectiveReleaseDate (min of the two), type: EpisodeType, runtime, year, certification (null), postCredits[], rating? (0-1), votes?, updatedAt?, episodes?: EpisodeEntry[]` (the last is only for computed/coalesced cards; flagged FIXME for a discriminated union).

**EpisodeType** (`EpisodeType.ts`)
- premieres: `series_premiere, season_premiere, mid_season_premiere`
- finales: `series_finale, season_finale, mid_season_finale`
- `standard`, `unknown`
- computed (client only): `full_season`, `multiple_episodes`

**Season** (`Season.ts`)
`id, key ('season-<id>'), number (0 = specials), title? (null if "Specials"/"Season N", only distinct names kept), episodes{count, aired}, poster?{url}, airDate, overview?, rating? (0-1), network?, totalRuntime`

**ShowProgress**: `total (aired), completed, remaining, minutesLeft, lastWatchedAt: Date|null`

**EpisodeProgressEntry** = EpisodeEntry + `total, completed, remaining, minutesLeft, isLatestAired` (isLatestAired is a proxy: `aired - completed <= 1`, FIXME in code).

**UpNextEntry** = EpisodeProgressEntry + `show: ShowEntry, lastWatchedAt`.

**ProgressEntry** (profile progress, discriminated on `type`):
- `watched`: `key, show` + ShowProgress fields
- `dropped`: `key, show, hiddenAt`

**HiddenShow**: `hiddenAt, show`. **EpisodeStats**: `watchers, plays, collectors, comments, lists`.

**MediaRating** (community): `trakt{rating, votes, distribution{'1'..'10': n}}`, `rotten{critic, audience?, url?}`, `imdb{rating, votes, url?}`, `tmdb` (0-10), `mal` (0-10, anime only), `letterboxd` (0-5, films only).

**MediaNetwork**: `{name}`. ShowSummary unions `show.network` + all `season.network` into a deduped networks list.

### A.2 Mappers / queries (`lib/requests/_internal`, `lib/requests/queries`)

| file | what |
|---|---|
| `mapToShowEntry.ts` | show response to ShowEntry; rating /10 via `mapToTraktRating` (0-100 to 0-1); `airs` only if day+time+tz |
| `mapToSeason.ts` | strips generic titles; `aired = min(aired_episodes, episode_count)` |
| `mapToEpisodeEntry.ts` | episode response to EpisodeEntry |
| `mapToShowProgress.ts` | UpNext `progress` to ShowProgress |
| `mapToUpcomingEpisodeEntry.ts` | calendar show response; `group=day` grouped episodes land on `episodes` |
| `coalesceEpisodes.ts` | groups by `showId-season-day`; premiere+finale same day = `full_season`, >1 ep = `multiple_episodes` |
| `coalesceBinges.ts` | social activity: groups a user's episode plays of one show per day, then runs coalesceEpisodes |
| `queries/shows/showProgressQuery.ts` | `/shows/:id/progress/watched` with `specials:false, count_specials:false, hidden:false`; maps `next_episode` to EpisodeProgressEntry |
| `queries/sync/upNextNitroQuery.ts` | `/sync/progress/up_next/nitro` `intent=continue`, sort (`released` maps to `aired`), filters; drops items with no next_episode; ttl 30m, refetch on focus |
| `queries/shows/showSeasonsQuery`, `showSeasonEpisodesQuery`, `showSeasonCommentsQuery`, `showSeasonPeopleQuery` | season data |
| `queries/episode/*` | `episodeSummary, episodeRating, episodeComments, episodeStats, episodePeople, episodeWatchers, episodeIntl, streamEpisode` |
| `queries/calendars/upcomingEpisodesQuery.ts` | calendar / upcoming |
| `queries/users/hiddenShowsQuery`, `droppedShowsQuery`, `dropShowRequest`, `restoreShowProgressRequest`, `hideShowCalendarRequest`, `restoreShowCalendarRequest` | hide/drop/restore |
| `queries/shows/startShowRewatchingRequest`, `stopShowRewatchingRequest` | rewatching |

Invalidation keys (`InvalidateAction.ts`): `mark_as_watched:{movie|show|episode}`, `rated:{...|season}`, `dropped:*`, `restored:show`, `rewatching:show`, `watchlisted:*`, `commented:*`, etc.

### A.3 Specials (season 0)
- Progress query excludes specials (`specials:false`).
- `SeasonList` "previous seasons" and `SeasonRatingsChart` filter `number > 0`.
- `seasonLabel(0)` renders a "Specials" label (`utils/intl/seasonLabel.ts`).
- `useIsRateable` for a show requires at least one watched episode with `season !== 0`.

### A.4 Where it is shown

**Routes (`routes/shows/**`)**
- `/shows` + `/shows/{trending,popular,anticipated,recommended}` (loaders only, lists).
- `/shows/[slug]` -> `ShowSummary`. The season is kept in the `?season=` search param (replaceState). With none set, `findActiveSeason` picks one from the user's last watched season.
- `/shows/[slug]/seasons/[season]` redirects to `/shows/[slug]?season=N` (so there is no standalone season page).
- `/shows/[slug]/seasons/[season]/episodes/[episode]` -> `EpisodeSummary` (+ `/related`).
- `/shows/[slug]/lists`, `/shows/[slug]/related`.

**ShowSummary composition (in order)**: `SummaryDrawer` (URL-driven drawers) -> MediaSummaryV2 (mobile/tablet-sm) or MediaSummary (tablet-lg/desktop, inline WhereToWatch + Sentiment on desktop) -> WhereToWatch + Sentiment (non-desktop) -> `SeasonList` -> CastList -> Comments -> VideoList -> Soundtrack (flag) -> RelatedList -> Lists -> TriviaList.

**SummaryDrawers enum** (`sections/summary/SummaryDrawers.ts`): sentiment, details, cast, videos, trivia, soundtrack, history, social, where-to-watch, **seasons**, **episode**, notes, comments, review, **ratings**, rewatching.
- Seasons drawer (`summary/components/seasons/`): SeasonDrawerItem, tabs Overview / Episodes / Reviews, SeasonProgressCard, SeasonInfoSection (has RateNow for season).
- Episode drawer (`summary/components/episode-drawer/`): EpisodeInfoHeader (RateNow for episode), EpisodeInfoPoster, EpisodeReviewsTab (episode comments), useEpisodeAired/Rating/StreamOn/People.
- Details drawer (`details/_internal/useMediaDetails.ts`) rows: premiered/expected premiere (TBA), status (`toTranslatedStatus`), episode type, aired/airs, runtime, network(s), airs (local day+time via `toHumanDayTime`, only while currently airing), total runtime + "N episodes", post-credits, director/creator, etc.

**Season UI** (`sections/lists/season/`): `SeasonList` -> SeasonPosterList (mobile, when >1 season), SeasonEpisodeList + SeasonEpisodeItem, SeasonDropdown (desktop header action, `variant="detailed"`), SeasonActions (mark season watched = mark all its episodes, add to list, report). `useShowWatchedEpisodes`, `getEpisodesUntil`.

**Episode cards** (`sections/lists/components/EpisodeItem.svelte`, `EpisodeCard.svelte`, `EpisodeTypeMetaInfo.svelte`): variants `next | default | upcoming | calendar | activity | list-item`, styles `cover | summary | compact | minimal`, `status: watching | hidden`.
- Episode status tag (`components/episode/getEpisodeStatus.ts`): `premiere | finale | new | new-premiere | new-finale`. "New" = released within 7 days. Mid-season types only count as a milestone when the episode is the latest aired. For coalesced cards, a premiere child wins over a finale child.
- Episode tags (`components/episode/tags/`): EpisodeStatusTag, EpisodeRemainingTag, ShowProgressTag, EpisodeDurationTag, EpisodeTimeTag. Media tags (`components/media/tags/`): AirDateTag, AirTimeTag, EpisodeCountTag, EpisodeNumberTag, SeasonLabelTag, ProgressTag, RewatchingTag, DroppedTag, MediaStatusTag (only "new" = within 7 days or pre-release), PostCreditsTag, PlaysTag, etc.
- Spoilers (`features/spoilers/`): spoiler-free episode titles and blurred episode images.

**Dashboard / home (`routes/home/+page.svelte`, authenticated)**, in order: Banner, **UpNextList** (continue watching), WatchList `intent="start"` (start watching), StreakCallout, **UpcomingList**, RecommendedList, PersonalHistoryList, ActivityList, DashboardDrawer (only drawer: `streak`). A discover toggle (show/movie `mode`) in the navbar drives the lists.

**Up Next** (`sections/lists/progress/`): UpNextList (home) / UpNextPaginatedList (`/users/[user]/progress`, sortable via `useUpNextSorting` + ListSortActions). Items: `_internal/UpNextItem.svelte` (episode via EpisodeItem `variant="next"`, or MovieProgressItem for in-progress movies), ContinueWatchingItem, UpNextSwipe / UpNextMovieSwipe (swipe gestures), MarkAsCompletedAction. Popup actions: mark episode watched, drop show, restore (only when `status==='hidden'`). `useHiddenShows` returns hidden show ids.

**Other surfaces**
- `/users/[user]/start-watching` -> WatchlistPaginatedList (watchlist with a "start" intent).
- `/profile/[slug]/progress` -> profile progress list (`useProgressList`, ProgressItem, watched vs dropped entries).
- `/calendar` -> `features/calendar/Calendar.svelte` + `EpisodeTypeToggles` (filter all / premieres / finales; `full_season` counts as both) + ReleasesCalendar. Drop also hides the show from the calendar.
- `/history/shows`, social activity (binges coalesced).

### A.5 Actions (`sections/media-actions/`)
| action | granularity / behavior |
|---|---|
| mark-as-watched | `type: movie|show|episode`. Episode takes one or many (season = array of its episodes). Show = whole show, or a `seasons[{number, episodes[{number, watched_at}]}]` subset. Modes `act|hybrid|ask`. When-watched picker (HistorySlotPicker/Drawer: now / release date / custom slots). **Watch until here** (`_internal/watch-until-here/`): marks all prior episodes with interpolated timestamps and counts the ones skipped. |
| remove-from-history | removes plays (per-play, from HistoryList in the details/history drawer, RecentlyWatchedItem) |
| rewatching | feature flag `Rewatching`: start/stop show rewatch (resets progress server-side); RewatchingDrawerHost + RewatchingEpisodeItem; `useHasWatchedShowEpisodes` |
| drop | show: `dropShowRequest` + `hideShowCalendarRequest`; movie: drop playback. Optional drop note prompt; `context: drop|complete` |
| restore | undo drop/hide (progress + calendar) |
| hidden | `hiddenShowsQuery`: hidden items show up in Up Next with `status="hidden"` and a Restore option |
| rating | `RateAction` / `RateNow` for movie, show, season, episode |
| check-in, watchlist, favorite, hide-recommendation, cover-image | movie/show level |

Rateability: show = has at least one non-special watched episode; others = `isWatched`.

---

## B. Current design system

### B.0 Redesign status (important)
- Memory `project_progress.md` (2026-09-26): **main has no Letterboxd-redesign commits.** The June 2026 waves (LetterboxdNav, PosterGrid, MegaComposer) were dropped when the repo was re-synced with trakt-web. The MEMORY.md index line ("waves 1-4 done") is stale.
- The last 60 commits are all upstream trakt-web work, not redesign:
  - landing rebuilt around a "spotlight" poster stack with swipe/tap and backdrop; hero CTA changed to "Get started"
  - boot loader / first-load state (square trakt mark, font fallback metrics)
  - share cards moved from satori/resvg to the takumi wasm renderer (perf)
  - review/comments: gif picker (klipy), reply UX
  - rating: smoother star scrub, rotten tomato + popcorn effects (below)
  - streaming (free YouTube stand-up), stats skeletons, CrowdIn i18n syncs
- Design decisions carried over from June (approved then, not built): 3-state poster outline (green watched / blue watchlist / white), hover action drawer + mobile long-press, orange stars, green like heart, one log composer, per-entity engagement sub-routes.

### B.1 Tokens (`src/style/`)
Files: `palette/{purple,orange,red,green,blue,yellow,shade}.css` (all oklch, 50..900/1000 scales), `theme/global.css` (theme-independent), `theme/modes.scss` (light/dark mixins, `[data-theme=light|dark|system]`, TV forced dark, OG frames forced dark), `theme/seasonal/{halloween,christmas}.css`, `typography/index.css`, `sizing/index.css`, `numeric-increments/index.css` (`--ni-X`, X px in rem), `layers/index.css`, `layout/index.scss` + `layout/modes.scss`, `transitions`, `animations`, `states`, `direction`, `scss/mixins`, `scss/variables`.

**Brand palette (key steps)**
| token | value |
|---|---|
| `--purple-300` | oklch(71.0% 0.1599 314.2) |
| `--purple-500` (brand) | oklch(56.1% 0.205 314.2) |
| `--purple-700` | oklch(43.0% 0.1681 314.2) |
| `--red-500` | oklch(56.0% 0.18 25.0) |
| `--orange-400` (star preview) | oklch(68.0% 0.186 47.0) |
| `--orange-600` | oklch(58.0% 0.1541 47.0) |
| `--green-500` | oklch(65.0% 0.142 161.0) |
| `--blue-500` | oklch(66.0% 0.155 245.0) |
| `--yellow-500` | oklch(76.0% 0.1496 85.0) |
| `--shade-10` | oklch(99.0% 0.004 300) |
| `--shade-300` | oklch(67.0% 0.013 300) |
| `--shade-700` | oklch(38.0% 0.012 300) |
| `--shade-920` | oklch(19.5% 0.009 300) |
| `--shade-930` | oklch(16.5% 0.008 300) |

Shades carry a slight purple hue (300).

**Semantic (light / dark)**
| token | light | dark |
|---|---|---|
| `--color-background` | shade-10 | shade-920 97% mixed with purple-900 |
| `--color-foreground` | shade-920 | shade-10 |
| `--color-floating-background` (cards, navbar base) | shade-10 | shade-930 |
| `--color-text-primary` | shade-900 | shade-10 |
| `--color-text-secondary` | shade-800 | shade-300 |
| `--color-text-emphasis` / `--color-link-active` | purple-700 | purple-300 / purple-400 |
| `--color-accent-{purple,red,blue,orange}` | *-700 | *-300 |
| `--color-border` | shade-200 | shade-700 |

Global (`global.css`): VIP badge red-500 on shade-10; button colors `purple|red|blue|orange|default` (purple-500 / hover purple-700, etc.); `--color-ratings-trakt: purple-500`; input focus purple-500; card border hover purple-500; segmented selector purple-400 to purple-600 gradient; viz palette `--viz-1..8` alternates purple/blue.

**Seasonal**: `[data-seasonal-theme=halloween]` remaps every `--purple-*` to orange; `christmas` remaps it to red. Triggered from `lib/features/theme/constants.ts`.

**Typography**: Google Fonts **Roboto** (300..700), **Roboto Mono** (code), **Tajawal** (Arabic/Persian), with metric-matched fallbacks declared in `app.html`. Body stack: `"Roboto", "Tajawal", fallbacks, Arial, sans-serif`. Sizes: `--font-size-title` 18px (h1..h6 all 600), `--font-size-separator` 16px, `--font-size-text` 14px, `--font-size-text-small` 12px, `--font-size-tag` 10px. Utility classes: `.secondary .bold .small .tag .uppercase .capitalize .ellipsis`.

**Sizing**: gaps `micro 2 / xxs 4 / xs 8 / s 12 / m 16 / l 24 / xl 32 / xxl 44` (px via ni); radii `xs 4 / s 8 / m 12 / l 16 / xl 20 / xxl 24`; borders 1/2/4/8. Transitions `--transition-increment 150ms`, `--transition-duration-short 300ms` (0 under reduced motion).

**Layers**: background -1, base 1, raised 2, floating 3, dialog 666, overlay 777, menu 778, top 999. Shadows: base, floating, raised, menu, dialog, navbar.

**Layout**: `--layout-distance-side` 24px (12px mobile); `--navbar-height` 72; side navbar collapsed 48 / expanded 180; `--mobile-navbar-height` 56 + safe area. Card sizes: portrait cover = width x 1.5; landscape cover = width / 1.786; person, summary (276 wide), list (256 tall), comment, trivia, toast cards.

**Breakpoints** (`scss/variables`): mobile <= 480, tablet-sm 481-768, tablet-lg 769-1023, desktop >= 1024. Mixins: `for-mobile, for-tablet-sm, for-tablet-sm-and-below, for-tablet-lg, for-tablet-lg-and-below, for-desktop, for-mouse, for-touch`, plus `adaptive-gap, dynamic-item-count, dynamic-card-width, list-mask, card-tile-surface, muted-card, vip-glow-card, icon-button-ghost, flat-outline-button, flair-chip, spoiler-blur, backdrop-filter-blur`.

### B.2 Navigation (`lib/sections/navbar/`, mounted in `routes/+layout.svelte`)
- **Desktop / tablet-lg: `SideNavbar`** (collapsible 48/180, or fixed with a logo). Top: menu toggle + logo. Items (`_internal/SideNavbarContent.svelte`), in order:
  1. Search (auth only)
  2. Home, with sublinks Up Next, Calendar, Recommended (auth)
  3. Discover (auth), with sublinks Trending, Releases, Most Anticipated, Most Popular
  4. Lists (auth), with sublinks Watchlist, Smart Lists, Personal, Liked, Collaborative
  5. Devtools (dev only)

  Bottom: `UserMenu` (hover flyout: History, Library, Settings) around `ProfileLink` (avatar, VIP ring via `isVip`, username when expanded). Plus `NavbarActions`, a top action strip: NavbarHeader (left), content toggle (discover show/movie) + page actions (center), page header actions + FilterButton + `GetVIPLink` (free users) + JoinTrakt (public) (right).
- **Mobile / tablet-sm: `TopNavbar`** (NavbarHeader, DiscoverToggles, page actions, Filter, GetVIPLink, Join button; hides in `minimal` mode, e.g. on summary pages) plus **`MobileNavbar`** bottom bar, in order: Home, Discover, Lists, Search, Profile (avatar). The last four are auth only. Above the bar sits a contextual/toast action area.
- Page-level state comes from `NavbarStateSetter` / `ResponsiveNavbarStateSetter` (`mode`, `contentToggle`, `hasFilters`, actions snippets).

### B.3 Reusable components (`lib/components/`)
- **Cards**: `card/` (Card `transparent|opaque`, CardCover, CardFooter, CardActionBar); `media/card/PortraitCard`, `LandscapeCard`; list-level cards in `sections/lists/components/`: MediaCard / MediaItem (variants: default, `activity`, `next`, `start`, `progress`, `credit`), EpisodeCard / EpisodeItem (see A.4), SeasonItem, MediaSummaryCard, ListSummaryCard, ActivitySummaryCard, CastMemberItem, CreditMediaItem, VideoItem, SkeletonCard, CtaItem; styles `cover | summary | compact | minimal`; MediaSwipe (swipe actions). `summary/SummaryPoster`.
- **Buttons**: `Button` (color `purple|red|blue|orange|default|custom`, variant `primary|secondary`, style `flat|ghost|underlined|outline`, size `normal|small|tag`), `ActionButton` (icon-only, tooltip, size `normal|small|large`), BackButton, AutoCloseButton, PopupMenu, MoreButton, and domain buttons (MarkAsWatched, Watchlist, Favorite, CheckIn, Share, RemoveFromHistory, Logout, Settings).
- **Drawers / dialogs**: `drawer/Drawer.svelte` (side sheet from inline-end on desktop, bottom sheet on mobile; size `normal 380 | large 480 | auto`; variant `default|vip`; `elevated` stacking; URL-driven via `drawerNavigation` + a view param), DrawerSearchInput; `dialogs/Modal`, `ConfirmationDialog`.
- **Lists**: `lists/section-list/SectionList` (horizontal scroll with scroll-history provider), `grid-list/GridList`, `PaginatedList`, SkeletonList, LetterGroupHeader, `carousel/Carousel`, `tabs/TabView`.
- **Tags / badges**: `tags/` (StemTag, TextTag, TagBar, IndicatorTags), `media/tags/*`, `episode/tags/*`, `badge/` (VipBadge, VipUpsellBadge, QueuedTag, Preview).
- Also: `charts/` (DistributionBar, LineChart), tooltip, popover, dropdown, select, slider, toggles, skeleton, avatar-pill, kpi, stat, gestures, snackbar.
- A `/_design_system` route exists (buttons, charts, colors, drawers, dropdown, icons, items, links, typography, etc.).

### B.4 Rating widget (commit ba7d3ef8c)
Files (`lib/sections/summary/components/rating/`):
- `RateNow.svelte`: container; `useRatings` (pending/current/queued/add/remove); shows FavoriteAction next to the stars for movie/show (not season/episode); QueuedTag when offline; hosts the delight effect. Rendered only when `useIsRateable` passes (or `variant="allow"`).
- `_internal/RatingStars.svelte`: bits-ui `RatingGroup` + RxJS pointer pipeline.
- `_internal/createScrubInteraction.ts`: pure streams (`preview$`, `commit$`), marble-tested.
- `_internal/starsFromRects.ts`: clientX to stars (nearest star center, half decided by which half of the star, RTL aware).
- `_internal/starFill.ts`: none/half/full per star.
- `_internal/ratingDelight.ts`: 10 = `popcorn`; 1-2 = `rotten-tomato`.
- `_internal/PopcornBurst.svelte`, `_internal/RottenTomato.svelte`: CSS-only effects that start at the rated star, hidden under reduced motion (they replace StarsConfetti, now deleted).
- `models/RatingDelight.ts`, `components/icons/StarIcon.svelte` (fill prop).

**Scale**: 5 stars with half steps (`variant="half"` default; a `full` variant exists pending issue trakt-web#1466). The app stores ratings as integers 1-10, and `toRating = stars*2`, so 0.5 star = 1 and 5 stars = 10. Scrubbing to 0 clears the rating.

**Interactions**
- Hover/drag preview: a tooltip bubble shows "x.0" (or "No rating") and moves with translate to the active star's center. While previewing, stars turn orange-400 and the active star scales to 1.15. It ticks (1.2 pulse) on each half-step change, with a 4ms vibration on touch.
- Commit on pointerup (pointer capture keeps the scrub alive off-row). Mouse clicks can land on a half. A touch tap (under 8px travel) snaps up to a whole star; a touch drag keeps the half.
- Clearing: only a press dragged past the leading edge of the first star. The row tints red-500 while in the clearing zone.
- `touch-action: pan-y`, so vertical page scrolls still work; the hit area grows to 44px tall without shifting layout.
- Touch scrub lifts the active star and the bubble above the thumb.
- Keyboard: bits-ui handles arrows/keys and commits via `onValueChange` (pointer commits are deduplicated with a flag).
- On commit the star pulses to 1.3, and the delight effect fires for 10 (popcorn) or 1-2 (rotten tomato) on both pointer and keyboard input.

**Used in**: `summary/components/media/MediaSummary` + `v2/MediaSummary` (movie/show), `_internal/SummaryRateNow`, `episode/EpisodeSummary` + v2, `episode-drawer/EpisodeInfoHeader` + EpisodeDrawerHost (episode), `seasons/_internal/SeasonInfoSection` (season), `media-actions/rating/RateAction`, `lists/history/RecentlyWatchedItem`, toast `NavbarToastContent` / `RateNowContent` (post-watch rate prompt).

**Community ratings display**
- `components/summary/RatingList.svelte` + `RatingItem.svelte`. Variant `summary` (row) shows Trakt %, IMDb, MAL (anime), RT critic (tomato: fresh >= 60% / rotten / unrated) and RT audience (popcorn: hot / stale). Variant `breakdown` (tiles in the Ratings drawer) drops Trakt (shown separately) and adds Letterboxd (movies) and TMDB. Vote counts appear as a superscript. Icons dim to `unrated` when there are no votes.
- `getDisplayableRatings`: nothing is shown before air date; TMDB is hidden when it has fewer votes than Trakt.
- Trakt rating is formatted as a percent (`toTraktRating` -> `toPercentage`); IMDb/TMDB/MAL on a 10-point scale; Letterboxd on its own scale.
- **RatingsDrawer** (`SummaryDrawers.Ratings`): `RatingsDistribution` (big Trakt %, "N votes", 5-column histogram folding distribution 1-10 into star buckets {1-2, 3-4, 5-6, 7-8, 9-10} via `STAR_RATINGS`, tooltips with counts); `SeasonRatingsChart` (shows only: LineChart of season ratings, seasons > 0, aired, rated); an "Official" grid of RatingList breakdown tiles.

---

## C. i18n
- **Source of truth**: `projects/client/i18n/meta/en.json` (`$schema`, `meta`, `messages`: **~2,275** meta messages, with variables, descriptions and per-platform overrides). Schema: `i18n/schema/meta-messages.schema.json`.
- **Generator**: `i18n/generator/cli.ts` (Deno; `core/ factory/ model/ platform/ utils/`) turns meta into web (inlang message-format JSON), Android and iOS. Tasks: `i18n:generate[:watch]`, `i18n:web`, `i18n:compile` (paraglide-js -> `src/lib/paraglide/`, generated, do not edit), `i18n:prepare`, `i18n:check` (placeholders), `i18n:resolve`. Runs pre-dev/pre-build.
- **Web messages**: `i18n/messages/{locale}.json`. `en.json` holds **~1,810** keys; the rest are platform-only. Translations sync via CrowdIn ("feat(i18n): update translations" commits).
- **Project**: `i18n/project.inlang/settings.json`, baseLocale `en`, plugins message-format + m-function-matcher + lint rules.
- **Locales (28)**: en, en-AU, fr-FR, fr-CA, ja-JP, pt-BR, es-ES, es-MX, ro-RO, de-DE, nl-NL, uk-UA, ru-RU, pl-PL, it-IT, bg-BG, sv-SE, nb-NO, da-DK, zh-CN, tr-TR, hu-HU, el-GR, fa-IR, pt-PT, ca-ES, id-ID, ar-SA.
- **RTL**: `fa-IR`, `ar-SA` (`RTL_LOCALES` in `lib/features/i18n/index.ts`). Tajawal font covers the Arabic script. Styles must use logical properties.
- Runtime usage: `import * as m from "$lib/features/i18n/messages"` -> `m.key(params)`; `getLocale()` / `languageTag()`.


---

