# trakt-boxed: page builders' guide

Generated 2026-09-26 against the then-separate client; since 2026-09-27 everything lives in `projects/boxed` (`$lib` = `src/lib`, `$routes` = `src/routes`, formerly `$routes`).

## 0. Setup (read first)

### Aliases available in `projects/boxed` (`svelte.config.js`)

| Alias | Resolves to |
|---|---|
| `$lib` | `projects/boxed/src/lib` |
| `$routes` | `projects/boxed/src/routes` (route-folder hooks: `useMovie`, `useShow`, `useProfile`, ...) |
| `$boxed` | `projects/boxed/src/boxed` (our new components) |
| `$mocks`, `$test`, `$worker`, `$style`, `$static`, `$e2e` | `src/mocks`, `test`, `src/worker`, `src/style`, `static`, `e2e` |

`hooks.server` / `hooks.client` are the client's, so auth, typesense config, theme, and the image dev fallback work unchanged.

### Providers

`projects/boxed/src/routes/+layout.svelte` already mounts the client's whole provider tree (QueryClient, Auth, FeatureFlag, Player, Locale, Search, Filter, Cover, Toast, Confirmation, MarkAsWatchedDrawer, ManageListsDrawer, ActionToastHost, AddNoteDrawer, ReportDialog, Theme, OfflineSync ...). Things it does NOT give you:

| Need | Mount it where |
|---|---|
| Calendar hooks (`useCalendarPeriod`) | `CalendarProvider` in the calendar route layout (throws otherwise) |
| Global filters actually applied (`useFilter().filterMap`) | the page must mount `NavbarStateSetter hasFilters` (otherwise `filterMap` is `{}` and filters silently do nothing) - see section 2 |
| Drop-show note prompt | only mounted by the client's up-next lists - see section 4 |

### Conventions every hook follows

- Hooks return **RxJS Observables**. Read them with `$store` syntax in templates/`$derived`; call hooks during component setup (they use `getContext`), never inside effects or event handlers.
- Queries are TanStack `query-core` wrapped by `$lib/features/query/useQuery.ts` (`useQuery`, `useInfiniteQuery`, `useAllPagesInfiniteQuery`) and persisted to IndexedDB.
- The per-user synced collections (history, watchlist, ratings, favorites, notes, ...) come from `useUser()` (`$lib/features/auth/stores/useUser.ts`) and are loaded once per session. Anything that reads them is grid-safe; anything else is one request per item (see section 3).

### Cross-cutting gotchas

1. **Per-item requests to keep off grids:** `useListedOnIds` (and so the `ListAction` button), `useNotes`, `useShowProgress`. `useRatings` / `useFavorites` build mutations per instance - use them on detail pages, read `useUser().ratings/favorites` in grids.
2. **Sentinels, not Nil:** `rating` is 0-1, `runtime` / `episode.count` can be `NaN`, `overview` falls back to `'TBD'`, unknown dates are `MAX_DATE`, missing images are placeholder URLs (check `PLACEHOLDERS.includes(url)`). Section 5.
3. **`history` is `null` until loaded** - don't render "unwatched" before it resolves.
4. **Seasons and episodes have no standalone page in the client:** season route only redirects, episode page 307s non-bots to the show drawer (`?view=`). Boxed builds these pages from show hooks (section 1). `UrlBuilder` has no season or comment builders (section 9).
5. **Offline queue covers only** history, watchlist, rating and favorites writes. Check-in, drop, lists, notes, comments, follow and single-play removal fail offline.
6. **No season-level write:** mark a season watched by passing its episodes array.
7. **Useful internals live in `_internal/`** (`RatingStars`, watch-until-here, `useFollowUserRequest`). Importing them from boxed breaks the feature boundary; uplift in lib first (one small lib commit each).
8. **Rule-file drift:** `components.md` mentions `audience="member"` and `flag="notes"` (neither exists); `utils.md` shows `toHumanDay` with positional args (it takes one object). Trust section 7.
9. **i18n in boxed** needs the client compile step: boxed's `i18n` script must run `deno task i18n:prepare` (generate + paraglide compile). Section 8.

## 1. Media pages

Verified against `projects/client/src` (`$lib` = `client/src/lib`, `$routes` = `client/src/routes`, alias defined in `projects/boxed/svelte.config.js`).

### 1.0 Ground rules (apply to every hook below)

| Rule | Detail |
|---|---|
| Everything is an RxJS `Observable` | Read with `$obs` in `.svelte` (RxJS subscribe contract = Svelte store contract). Never `await`. |
| Call at component setup | `useQuery` / `useInfiniteQuery` call `useQueryClient()` = `getContext` (`$lib/features/query/_internal/queryClientContext.ts`). Call in `<script>` top level, or inside `$derived(useX(...))` like the client does (e.g. `MediaStats.svelte`, `Lists.svelte`). Never from event handlers / `setTimeout` / after `await`. |
| Required context | QueryClient (`setQueryClient`), auth context (`getAuthContext`, used by `useAuth`), `useUser` context (memoized per AuthProvider). The boxed root layout must reuse the client providers. `useStreamingPreferences` -> `useUser` -> context, so any hook with `streamOn` needs it too. |
| Reactive params | Route hooks take `Observable` params. Build them with `fromRune` (`$lib/utils/store/fromRune.svelte.ts`), once, at setup: `fromRune(() => params.slug)`. It uses `$effect.pre` + `onDestroy`, so component-only. |
| Loading | `toLoadingState(q) = q.isEnabled && (q.isPending \|\| q.isFetching)` (`$lib/utils/requests/toLoadingState.ts`). Disabled queries never count as loading. |
| Prefetch | Route `+page.ts` only prefetches the summary query when `shouldPrefetch({ isBot, url })` (bots). Reuse via `export { load } from '$clientRoutes/movies/[slug]/+page.ts'` if you want the same SSR/SEO behavior. |
| Intl | `intl` locale is skipped when `languageTag() === 'en'` (query disabled); `findRegionalIntl` then returns the fallback title/overview from the entry, so `$intl` is still defined. |
| Paginated lists | `usePaginatedListQuery` (`$lib/sections/lists/stores/usePaginatedListQuery.ts`) returns `{ list, isLoading, hasNextPage, fetchNextPage }` (dedupes by `key`, `isLoading` includes `isFetchingNextPage`). |

Shared model paths (all `$lib/requests/models/*.ts`): `MovieEntry` (= `MediaEntry`), `ShowEntry`, `Season`, `EpisodeEntry`, `MediaCrew`, `MediaIntl`, `EpisodeIntl`, `MediaStudio`, `MediaVideo`, `StreamOn`, `StreamingServiceOptions`, `MediaRating`, `MediaStats`, `EpisodeStats`, `SentimentAnalysis`, `MediaTrivia`, `SoundtrackTrack`, `MediaSocial`, `MediaListSummary`, `MediaComment`, `PersonSummary`, `MediaCredits`, `CrewPosition`.

Key fields:

```ts
MediaEntry  { id, slug, key, type: 'movie'|'show', title, originalTitle?, tagline, overview, year?, runtime,
              genres[], status, certification?, country?, languages?, airDate, releaseDate, effectiveReleaseDate: Date,
              poster.url / cover.url / logo.url (ImageUrls: .thumb/.medium/...), thumb.url, trailer?, colors?: [string,string],
              votes, rating?, imdbId?, tmdbId?, homepage?, socialMedia?, postCredits[], plexSlug? }
ShowEntry   = MediaEntry & { episode: { count }, network?, totalRuntime, airs?: {day,time,timezone}, lastAired? }
Season      { id, key, number, title?, episodes: { count, aired }, poster?, airDate, overview?, rating?, network?, totalRuntime }
EpisodeEntry{ id, key, season, number, title, overview, cover.url?, airDate, releaseDate, type, runtime, year, rating?, votes?, postCredits[] }
MediaCrew   { directors: CrewMember[], writers, creators, cast: CastMember[] }
            CrewMember { name, key, jobs[], episodeCount? }  CastMember { name, key, characterName, characters?, headshot.url }
            NOTE: crew/cast members carry `key` (person slug-ish key), not a full PersonSummary.
intl        { title, overview, country, tagline? }  // tagline only for movie/show
StreamOn    { services?: { streaming[], onDemand[], free[], streamingRank?: {current,delta} }, preferred?: StreamNow }
            each service: { link, source, is4k, type, key } (+ onDemand: prices {rent?,purchase?}, currency?, deepLink?)
MediaStudio { name, country?, ids: { slug } }
MediaVideo  { key, type, url, thumbnail, title, publishedAt }
SentimentAnalysis { analysis, highlight, aspect: { pros[], cons[] } }
```

---

### 1.1 Movie summary `/movies/[slug]`

**Core hook**: `import { useMovie } from '$clientRoutes/movies/[slug]/useMovie.ts';`
`useMovie(slug$: Observable<string>)` - fans out **7 queries** (summary, studios, people, sentiment, videos, intl, streamMovie) + youtubeSpecial (flag-gated).

| Field | Type | Notes |
|---|---|---|
| `movie` | `Observable<MovieEntry \| undefined>` | `movieSummaryQuery` |
| `intl` | `Observable<MediaIntl-like>` `{title, overview, country, tagline}` | always defined once movie loads |
| `studios` | `Observable<MediaStudio[]>` | defaults `[]` |
| `crew` | `Observable<MediaCrew>` | defaults `EMPTY_CREW` (`$lib/requests/_internal/mapToMediaCrew.ts`) |
| `videos` | `Observable<MediaVideo[]>` | trailers/extras; `movie.trailer` also exists |
| `streamOn` | `Observable<StreamOn \| undefined>` | uses user country (default `'us'`) + favorites |
| `sentiment` | `Observable<SentimentAnalysis \| null \| undefined>` | query **enabled only when authorized**; `undefined` for anon |
| `youtubeSpecial` | `Observable<YouTubeSpecial \| null \| undefined>` | authed + `FeatureFlag.YouTubeSpecials` + comedy genre |
| `isLoading` | `Observable<boolean>` | true until movie data present and summary/studios/crew/intl/videos/sentiment settle. Excludes streamOn. |

```svelte
<script lang="ts">
  import { useMovie } from '$clientRoutes/movies/[slug]/useMovie.ts';
  import { fromRune } from '$lib/utils/store/fromRune.svelte.ts';
  const { params } = $props();
  const { movie, intl, crew, streamOn, isLoading } = useMovie(fromRune(() => params.slug));
</script>
{#if !$isLoading && $movie}<h1>{$intl.title}</h1>{/if}
```

Client page gates on `!$isLoading && $movie && $studios && $crew && $intl` and passes everything into `$lib/sections/summary/MovieSummary.svelte`.

**Per-section hooks** (take plain values, not observables, unless noted; call from a child component that receives `movie`):

| Data | Import | Signature -> returns |
|---|---|---|
| Ratings (trakt dist + imdb/tmdb/rt/mal/letterboxd) | `$lib/sections/summary/components/media/useMediaMetaInfo.ts` | `useMediaMetaInfo({ type: 'movie', media })` -> `{ ratings: Obs<MediaRating>, isLoading: Obs<boolean> }` (defaults `EMPTY_RATINGS`) |
| Stats | `$lib/sections/summary/components/details/_internal/useStats.ts` (`_internal`, import anyway or call `movieStatsQuery` directly) | `useStats({ type: 'movie', media, studios, crew })` -> `{ stats: Obs<MediaStats>, isLoading }`. Unreleased titles get zeroed stats except `lists`. |
| Related (paginated) | `$lib/sections/lists/stores/useRelatedList.ts` | `useRelatedList({ type: 'movie', slug, page?, limit? })` -> `{ list: Obs<RelatedEntry[]>, isLoading, hasNextPage, fetchNextPage }` (intl-overlaid titles; limit forced to `DEFAULT_RELATED_LIMIT`) |
| Lists containing it | `$lib/sections/summary/components/lists/useListSummary.ts` | `useListSummary({ slug, type: 'movie', limit? })` -> `{ list: Obs<MediaListSummary[]>, isLoading, hasNextPage, fetchNextPage }` - **2 infinite queries** (official first, then personal), sort `popular` |
| Comments | `$lib/sections/summary/components/comments/_internal/useComments.ts` | `useComments({ type: 'movie', slug, sort: 'likes'\|'newest', limit?, language? })` -> paginated `{ list: Obs<MediaComment[]>, ... }` |
| Trivia | `$lib/sections/summary/components/trivia/useTrivia.ts` | `useTrivia({ type: 'movie', slug, variant: 'spoilers'\|'no-spoilers' })` -> `{ list: Obs<MediaTrivia[]>, categories: Obs<TriviaCategory[]>, summary: Obs<string[]>, hasSpoilers: Obs<boolean> }`. No `isLoading`. |
| Soundtrack | `$lib/sections/summary/components/soundtrack/useSoundtrack.ts` | `useSoundtrack(target$: Obs<{ slug, type }>)` -> `{ tracks: Obs<SoundtrackTrack[]>, isLoading }`. Client gates UI on `RenderForFeature Soundtrack` + VIP. |
| Social (friends watched/rated/commented/watchlisted) | `$lib/sections/summary/components/_internal/useSocialActivities.ts` | `useSocialActivities(target$: Obs<{ type: 'movie', slug }>, { mode?: 'default'\|'all' })` -> `{ entries: Obs<MediaSocial[]>, isLoading, hasNextPage }`. `'all'` walks all pages. Authed-only in UI. |
| Where to watch, all countries | `$lib/sections/lists/where-to-watch/_internal/useAllStreamOn.ts` | `useAllStreamOn({ type: 'movie', media })` -> `{ list: Obs<(CountryOptions & { countryName })[]>, isLoading }` |
| Parental guide | `$lib/sections/summary/components/_internal/useParentalGuideCategories.ts` | `useParentalGuideCategories(target$)` with `{ type, slug }` -> `{ categories, isError, isLoading }` (flag `ParentalGuide`) |
| Watchers now | query only: `$lib/requests/queries/movies/movieWatchersQuery.ts` | `useQuery(movieWatchersQuery({ slug }))` -> `UserProfile[]`. Not used by any client UI. |
| JustWatch deep link | query only: `$lib/requests/queries/movies/movieJustWatchUrlQuery.ts` | |

Full paginated pages already exist: `$clientRoutes/movies/[slug]/related/+page.svelte` (`RelatedPaginatedList type="movie" slug`), `$clientRoutes/movies/[slug]/lists/+page.svelte` (`ListsPaginated type="movie" slug`). Both use `params.slug` directly (no hook).

```svelte
<script lang="ts">
  import { useMediaMetaInfo } from '$lib/sections/summary/components/media/useMediaMetaInfo.ts';
  import { useComments } from '$lib/sections/summary/components/comments/_internal/useComments.ts';
  const { movie } = $props();
  const { ratings } = $derived(useMediaMetaInfo({ type: 'movie', media: movie }));
  const { list: comments, fetchNextPage } = $derived(useComments({ type: 'movie', slug: movie.slug, sort: 'likes' }));
</script>
{$ratings.trakt?.rating} / {$ratings.imdb?.rating} / RT {$ratings.rotten?.critic}
```

`MediaRating` = `{ trakt?: { rating, votes, distribution: Record<'1'..'10', number> }, rotten?: { critic, audience?, url? }, imdb?: { rating, votes, url? }, tmdb?, mal?, letterboxd? }` (external = `{ rating, votes?, url? }`; letterboxd is 0-5). **No Metacritic** in the model.
`MediaStats` = `{ watchers, plays, collectors, comments, lists, votes, favorited }`.

User state for the item (all `Observable`, context = `useUser`):
`useWatchCount` (`$lib/stores/useWatchCount.ts`, `{ type:'movie', media }` -> `watchCount`), `useIsWatched` (`$lib/sections/media-actions/mark-as-watched/useIsWatched.ts`), `useIsWatchlisted` (`$lib/stores/useIsWatchlisted.ts`), `useUser().ratings` / `.history` (`$lib/features/auth/stores/useUser.ts`).

---

### 1.2 Show summary `/shows/[slug]`

**Core hook**: `import { useShow } from '$clientRoutes/shows/[slug]/useShow.ts';`
`useShow(slug$: Observable<string>)` - fans out **7 queries** (summary, seasons, studios, people, streamShow, sentiment, intl).

| Field | Type | Notes |
|---|---|---|
| `show` | `Obs<ShowEntry \| undefined>` | |
| `seasons` | `Obs<Season[] \| undefined>` | includes season 0 (specials) if present |
| `intl` | `Obs<{title, overview, country, tagline}>` | |
| `studios` | `Obs<MediaStudio[]>` | |
| `crew` | `Obs<MediaCrew>` | creators populated for shows |
| `streamOn` | `Obs<StreamOn \| undefined>` | |
| `sentiment` | `Obs<SentimentAnalysis \| null \| undefined>` | authed only |
| `isLoading` | `Obs<boolean>` | unlike movie, does **not** wait for `show.data != null`; client adds its own `hasCoreData` check |

Videos are separate: `import { useShowVideos } from '$clientRoutes/shows/[slug]/useShowVideos.ts';` `useShowVideos({ slug: slug$ })` -> `Obs<MediaVideo[]>` (1 query that fans into 2 requests: show videos + all-season videos).

Client page (`$clientRoutes/shows/[slug]/+page.svelte`) does more than bind: it reads `?season=` from `page.url.searchParams`; if missing, it computes `findActiveSeason({ seasons, lastWatchedSeason })` (`$lib/utils/media/findActiveSeason.ts`) using `useUserSeason(showId$)` (`$lib/sections/lists/stores/useUserSeason.ts`) and `goto(UrlBuilder.show(slug, { ...params, season }), { replaceState: true })`. Page renders only when `!isNaN(currentSeason)`.

```ts
const slug$ = fromRune(() => params.slug);
const { show, seasons, intl, crew, streamOn, isLoading } = useShow(slug$);
const videos = useShowVideos({ slug: slug$ });
const currentSeason = $derived(parseInt(page.url.searchParams.get('season') ?? ''));
const lastWatched = useUserSeason(fromRune(() => $show?.id));
// $effect.pre: if isNaN(currentSeason) && $seasons?.length -> goto(... season: findActiveSeason(...))
```

Same per-section hooks as movie with `type: 'show'`: `useMediaMetaInfo`, `useStats({ type:'show', media, studios, crew })`, `useRelatedList({ type:'show', slug })` (`RelatedShow` entries), `useListSummary({ type:'show', slug })`, `useComments({ type:'show', slug, sort })`, `useTrivia({ type:'show', ... })`, `useSoundtrack`, `useSocialActivities({ type:'show', slug })`, `useAllStreamOn({ type:'show', media })`. Networks for details: `show.network` + distinct `season.network`.

**Seasons & episodes**

| Data | Import | Signature -> returns |
|---|---|---|
| Season list | from `useShow().seasons` or `$lib/requests/queries/shows/showSeasonsQuery.ts` `({ slug })` | `Season[]` |
| Episodes of one season | `$lib/sections/lists/stores/useSeasonEpisodes.ts` | `useSeasonEpisodes(slug: string, season: number)` -> `{ list: Obs<EpisodeEntry[]>, isLoading }` (intl overlay on titles). Plain args, so wrap in `$derived(...)` to react to season change (client: `SeasonList.svelte`). |
| Per-season ratings | `Season.rating` (used by `SeasonRatingsChart`) | no extra query |

**User progress for the show** (authed; anon returns empty/`EMPTY_SEASON_INFO`):

| Data | Import | Returns |
|---|---|---|
| Watched history map | `useUser().history` (`$lib/features/auth/stores/useUser.ts`) | `Obs<UserHistory \| null>`; `history.shows.get(show.id)` -> `WatchedShow { episodes: {season, episodeId, plays,...}[], watchedDates, playsPerSeason: Map<season, count>, ... }`. Count with `countWatchedEpisodes` (`$lib/utils/media/countWatchedEpisodes.ts`). |
| Last watched season | `useUserSeason(showId$)` (above) | `Obs<{ number, episodes: { count } }>` |
| Watched episode numbers by season | `$lib/sections/lists/season/_internal/useShowWatchedEpisodes.ts` | `useShowWatchedEpisodes({ showId })` -> `{ watchedBySeason: Obs<Map<season, Set<number>>>, isLoading }` - **walks all pages** of `showActivityHistoryQuery` (slug `'me'`, limit 100). Feeds `SeasonProgressCard` (`$lib/sections/summary/components/seasons/SeasonProgressCard.svelte`: props `seasonNumber, watched, total, minutesLeft, loading`). Minutes left: `sumRemainingRuntime` (`$lib/utils/media/sumRemainingRuntime.ts`). |
| Watch count / started | `useWatchCount({ type:'show', media })`, `$lib/sections/summary/components/_internal/useIsStarted.ts` | |
| **Up next episode** | `$lib/stores/useShowProgress.ts` | `useShowProgress(slug: string)` -> `{ progress: Obs<EpisodeProgressEntry \| undefined> }` = next episode (`id, season, number, title, overview, cover.url, runtime, airDate`) + `total, completed, remaining, minutesLeft, isLatestAired`. Wraps `showProgressQuery` (GET `/shows/:id/progress/watched`). **Not used anywhere in client UI** and has **no `enabled` gate**: only mount it for authed users (`RenderFor audience="authenticated"`). |

```svelte
<script lang="ts">
  import { useSeasonEpisodes } from '$lib/sections/lists/stores/useSeasonEpisodes.ts';
  import { useShowProgress } from '$lib/stores/useShowProgress.ts';
  const { show, season }: { show: ShowEntry; season: number } = $props();
  const { list: episodes, isLoading } = $derived(useSeasonEpisodes(show.slug, season));
  const { progress } = useShowProgress(show.slug); // authed-only child
</script>
{#if $progress}Next: S{$progress.season}E{$progress.number} {$progress.title}{/if}
```

---

### 1.3 Season page `/shows/[slug]/seasons/[season]`

There is **no season hook or page**: `$clientRoutes/shows/[slug]/seasons/[season]/+page.svelte` is a `<Redirect to={UrlBuilder.show(slug, { season })}>`. Season content lives in the show page (`SeasonList`) and the Seasons drawer (`SeasonsDrawerHost`, tabs Episodes / Overview / Reviews). Build a boxed season page from:

| Data | Source |
|---|---|
| Show + season meta | `useShow(slug$)` -> `show`, `seasons.find(s => s.number === n)` |
| Episodes | `useSeasonEpisodes(slug, n)` |
| Season cast/crew | `$lib/sections/summary/components/seasons/_internal/useSeasonPeople.ts` `useSeasonPeople(slug, n)` -> `{ crew: Obs<MediaCrew>, isLoading }` |
| Season comments | `useComments({ type: 'season', slug, season: n, id: show.id, episodeCount, sort })` (`showSeasonCommentsQuery`) |
| Progress card | `useShowWatchedEpisodes({ showId })` + `SeasonProgressCard` (see 1.2) |
| Season videos | included in `useShowVideos` (all seasons merged) |
| Season JustWatch | `$lib/requests/queries/shows/showSeasonJustWatchUrlQuery.ts` |

No season-level stats/ratings/intl queries exist (rating comes from `Season.rating`).

---

### 1.4 Episode `/shows/[slug]/seasons/[season]/episodes/[episode]`

Humans never see this page: `+page.ts` does `redirect(307, UrlBuilder.episodeDrawer(slug, s, e))` when `!isBot` (-> `/shows/[slug]?view=episode&season=S&episode=E`). Do **not** re-export that `load` in boxed if you want a real episode page.

**Page hook**: `import { useEpisode, type UseEpisodeParams } from '$clientRoutes/shows/[slug]/seasons/[season]/episodes/[episode]/useEpisode.ts';`
`useEpisode(params$: Observable<{ slug: string; season: number; episode: number }>)` - fans out **7 queries** (episode summary, show summary, show seasons, episode people, episode intl, show intl, streamEpisode).

| Field | Type |
|---|---|
| `episode` | `Obs<EpisodeEntry \| undefined>` |
| `show` | `Obs<ShowEntry \| undefined>` |
| `seasons` | `Obs<Season[] \| undefined>` |
| `crew` | `Obs<MediaCrew>` (guest cast/crew) |
| `intl` | `Obs<{ title, overview, country }>` (no tagline) |
| `showIntl` | `Obs<{ title, overview, country, tagline }>` |
| `streamOn` | `Obs<StreamOn \| undefined>` |
| `isLoading` | `Obs<boolean>` - waits for episode + show data |

```ts
const params$ = fromRune(() => ({
  slug: params.slug, season: parseInt(params.season), episode: parseInt(params.episode),
}));
const { episode, show, intl, crew, isLoading } = useEpisode(params$);
```

Lighter drawer hooks (`$lib/sections/summary/components/episode-drawer/_internal/`, all take `params$: Obs<EpisodeSummaryParams>` = `{ slug, season, episode }`): `useEpisodeSummary` -> `{ episode, isLoading }`, `useEpisodePeople` -> `{ crew, isLoading }`, `useEpisodeStreamOn` -> `{ streamOn, isLoading }`, `useEpisodeAired` -> `{ isAired: Obs<boolean \| undefined> }` (reads season episodes list), `useEpisodeRating` -> `{ ratings: Obs<MediaRating>, isLoading }`. `EpisodeSummaryParams` type is exported from `useEpisodeSummary.ts`.

Other episode data:

| Data | Call |
|---|---|
| Ratings | `useMediaMetaInfo({ type: 'episode', media: show, episode })` or `useEpisodeRating(params$)` |
| Stats | `useStats({ type: 'episode', show, episode, crew })` -> `EpisodeStats { watchers, plays, collectors, comments, lists }` |
| Comments | `useComments({ type: 'episode', slug, season, episode, id: episode.id, sort })` |
| Social | `useSocialActivities(of/fromRune({ type: 'episode', slug, season, episode }))` |
| All-country streaming | `useAllStreamOn({ type: 'episode', media: show, episode })` |
| Watchers now | `$lib/requests/queries/episode/episodeWatchersQuery.ts` (unused in UI) |
| Watch count | `useWatchCount({ type: 'episode', show, episode })` |
| Related | related **shows** of parent (`useRelatedList({ type: 'show', slug })`) |

No episode sentiment / trivia / soundtrack / videos / lists queries exist.

---

### 1.5 Person `/people/[slug]`

**Hook**: `import { usePerson } from '$clientRoutes/people/[slug]/usePerson.ts';`
`usePerson(slug$: Observable<string>)` -> `{ person: Obs<PersonSummary \| undefined>, isLoading: Obs<boolean> }` (1 query, `isLoading = isPending`).

`PersonSummary` = `{ id, key, slug, name, biography, headshot.url (ImageUrls), knownFor?: CrewPosition, height?, birthday?: Date, deathDate?: Date, imdb?, socialMedia? }`.

**Credits**: `import { useCreditsList } from '$lib/sections/lists/stores/useCreditsList.ts';`

```ts
useCreditsList({ type$: Obs<'movie'|'show'>, slug$: Obs<string>, filter$: Obs<Record<string,string>>, mode$: Obs<DiscoverMode> })
// -> { credits: Obs<MediaCredits>, positions: Obs<CrewPosition[]>, isLoading: Obs<boolean> }
```

- `MediaCredits` = `Map<CrewPosition, MediaCredit[]>`; `MediaCredit` = `{ key, media: MediaEntry, episodeCount?, type: 'cast', character } | { ..., type: 'crew', job }`. Titles are intl-overlaid.
- `CrewPosition` enum: `acting, production, art, crew, costume & make-up, directing, writing, sound, camera, lighting, visual effects, editing, creator, created by, self, narrator, unknown`.
- `filter$` / `mode$` normally come from `useFilter().filterMap` (`$lib/features/filters/useFilter.ts`) and `useDiscover().mode` (`$lib/features/filters/useDiscover.ts`); pass `of({})` / `of('media')` to ignore global filters. `mode` other than `'media'` drops credits of the other type.
- **Sorting**: no client-side sort; order is the API's order within each position bucket. Selected position = `?movies=` / `?shows=` URL param, else `person.knownFor`, else `'acting'`, resolved with `resolveSelectedPosition({ requested, credits })` (`$lib/sections/lists/utils/resolveSelectedPosition.ts`, falls back if the bucket is empty).
- Page-level helper: `$lib/sections/lists/stores/useCreditsPositionSelector.ts` `useCreditsPositionSelector({ slug$, type })` -> `{ allPositions, selectedPosition, buildPositionHref(position) }` (uses `useFilter`, `useDiscover`, `useParameters`, `page` from `$app/state`).
- Raw queries: `$lib/requests/queries/people/personMovieCreditsQuery.ts` / `personShowCreditsQuery.ts` `({ slug, filter })`.

**From my history**: `$lib/sections/lists/history/_internal/useHistoryCreditsList.ts` `useHistoryCreditsList({ slug$, filter$, mode$ })` -> `{ list: Obs<MediaCredit[]>, isLoading }` - **2 credit queries + user history**, deduped by media id, cast before crew, sorted by your `watchedAt` desc. Empty for anon (`isLoading` stays true while `history` is null).

Client page (`$clientRoutes/people/[slug]/+page.svelte`): `usePerson(fromRune(() => params.slug))`, parses `positions = { movies, shows }` from URL via `crewPositionSchema.safeParse(value?.toLowerCase())`, renders `PeopleSummary person positions` when `!$isLoading && $person`. Sub-pages `/people/[slug]/movies|shows` reuse `usePerson` via relative import + `useCreditsPositionSelector` + `CreditsPaginatedList slug type`; `/history` uses `CreditsHistoryPaginatedList`.

```svelte
<script lang="ts">
  import { usePerson } from '$clientRoutes/people/[slug]/usePerson.ts';
  import { useCreditsList } from '$lib/sections/lists/stores/useCreditsList.ts';
  import { of } from 'rxjs';
  const { params } = $props();
  const slug$ = fromRune(() => params.slug);
  const { person } = usePerson(slug$);
  const { credits, positions } = useCreditsList({ type$: of('movie'), slug$, filter$: of({}), mode$: of('media') });
</script>
{#each $credits.get($person?.knownFor ?? 'acting') ?? [] as c (c.key)}{c.media.title}{/each}
```

---

### 1.6 Fan-out summary

| Page | Requests on mount (core hook) | Plus typical sections |
|---|---|---|
| Movie | 7 (+1 YouTube special if flagged comedy) | ratings 1, stats 1, related 1, lists 2, comments 1, trivia 1, soundtrack 1, social 1 (authed) |
| Show | 7 + videos (2 HTTP) | same as movie + season episodes 1 per rendered season + `useShowWatchedEpisodes` (all pages, authed) |
| Episode | 7 | ratings 1, stats 1, comments 1, social 1 |
| Person | 1 | credits 1 per type, history credits 2 (same keys as credits, cached) |

All raw queries are cached by TanStack keys, so repeated hooks with the same params share one request.

## 2. Collections, profile, home, discover, search

All paths verified against `projects/client/src`. `$lib/...` = client lib,
`$clientRoutes/...` = client `src/routes`. Every hook below returns **RxJS
Observables** (read with `$obs` in Svelte templates / `$derived`), except
`fetchNextPage` (plain async fn). Hooks must be called during component init
(they use `getContext` via `useQueryClient()` / `useUser()`); wrap in
`$derived(useX(...))` when params are reactive (client pattern everywhere).

### 2.0 Shared plumbing (read first)

| Thing | Path | Notes |
|---|---|---|
| `useQuery(opts \| Observable<opts>)` | `$lib/features/query/useQuery.ts` | returns `Observable<QueryObserverResult>` (`.data`, `.isPending`, `.isFetching`...). Accepts an Observable of options for reactive params (see `useProfile`). |
| `useInfiniteQuery(opts)` | same file | `Observable<InfiniteQueryObserverResult>`; `.data.pages[].entries`, `.hasNextPage`, `.fetchNextPage()` |
| `useAllPagesInfiniteQuery(opts)` | same file | auto-fetches every page (use for "need ALL"), never hand-roll `tap(fetchNextPage)` |
| `usePaginatedListQuery(infiniteOpts)` | `$lib/sections/lists/stores/usePaginatedListQuery.ts` | the workhorse. Returns `{ list: Obs<T[]>, isLoading: Obs<boolean>, hasNextPage: Obs<boolean>, fetchNextPage: () => Promise<void> }`. `list` = flattened pages deduped by `entry.key`. `isLoading` includes `isFetchingNextPage`. |
| `PaginatableStore<T,M>` type | `$lib/sections/lists/drilldown/PaginatableStore.ts` | contract of every `use*List`: `(params: {type, limit} & FilterParams) => {list,isLoading,fetchNextPage,hasNextPage}` |
| `useStablePaginated({useList, compareFn, type, limit, ...filter})` | `$lib/sections/lists/stores/useStablePaginated.ts` | keeps item order stable across refetch (used by Up Next) |
| `useInMemoryPagination(source$, {page, limit})` | `$lib/stores/useInMemoryPagination.ts` | client-side paging over a full array (recommended) |
| `useLazyLoader({loadMore, parent})` | `$lib/sections/lists/drilldown/_internal/useLazyLoader.ts` | `{ observeDimension }` action for infinite scroll (see `$lib/components/lists/PaginatedList.svelte`) |
| `toLoadingState(q)` | `$lib/utils/requests/toLoadingState.ts` | `isEnabled && (isPending \|\| isFetching)` |
| `flattenQueryPages(q)` | `$lib/features/query/flattenQueryPages.ts` | `q.data?.pages.flatMap(p => p.entries) ?? []` |
| Page meta | `$lib/requests/models/Paginatable.ts` | `{ entries: T[], page: {type:'paginated', current, total} \| {type:'infinite', current} }` |
| `PaginationParams` | `$lib/requests/models/PaginationParams.ts` | `{ page?: number; limit: number }` |

Page-size constants (`$lib/utils/constants.ts`): `DEFAULT_PAGE_SIZE=10`
(carousels), `DEFAULT_DRILL_SIZE=100` (drilled grid pages, `PaginatedList`),
`RECOMMENDED_UPPER_LIMIT=100`, `DEFAULT_SEARCH_LIMIT=50`,
`HISTORY_UPPER_LIMIT=250` (calendar-layout history/activity),
`DEFAULT_LISTS_PAGE_SIZE=5`, `DEFAULT_LISTS_DRILL_SIZE=10`,
`DEFAULT_SMART_LIST_LIMIT=5`, `COMMENTS_DRILL_SIZE=25`.

Every `defineQuery`/`defineInfiniteQuery` export is a factory:
`fooQuery(params)` -> options object; pass to `useQuery`/`usePaginatedListQuery`.
`fetch` is optional in `ApiParams`.

### 2.1 Discover mode + global filters

| Hook | Path | Returns |
|---|---|---|
| `useDiscover()` | `$lib/features/filters/useDiscover.ts` | `{ mode: Obs<DiscoverMode>, current: Obs<{value,text}>, options, onModeChange(v), useSeasonalFilters: Obs<boolean>, setSeasonalFilters(b) }` |
| `useFilter()` | `$lib/features/filters/useFilter.ts` | `{ filterMap: Obs<Record<string,string>>, filters: FILTERS, getFilterValue(key), activeFilterCount, hasActiveFilter, isFiltered, hasAnyAdvancedFilter }` (all Obs) |
| `useStoredFilters()` | `$lib/features/filters/useStoredFilters.ts` | saved default filters |

- `DiscoverMode = 'movie' | 'show' | 'media'` (`$lib/features/filters/models/DiscoverMode.ts`).
  Mode read from URL `?mode=` (`DISCOVER_MODE_PARAM`), else persisted toggler
  `useToggler('discover')` (localStorage `trakt_toggler_discover`).
- `useDiscover` calls `getDiscoverContext()` -> **throws** outside `FilterProvider`
  (`$lib/features/filters/FilterProvider.svelte`, mounted in boxed root layout).
- Filter URL keys (`FilterKey`, `$lib/features/filters/models/Filter.ts`):
  `genres, certifications, countries, ignore_watched, ignore_watchlisted,
  watchnow, years, ratings, runtimes, imdb_ratings, rt_meters, rt_user_meters,
  statuses, parental_*` (parental keys stripped unless VIP + flag `parental-guide`).
- Pass to queries as `filter: $filterMap` (type `FilterParams` =
  `{ filter?: Partial<FilterParam>, filterOverride?: {movie?, show?} }`,
  `$lib/requests/models/FilterParams.ts`). `SearchParams = { search?: Record<string,...> }`
  (extra raw query params, trending/popular/anticipated only).
- **GOTCHA:** `filterMap` emits `{}` unless the navbar state has
  `hasFilters: true`. Mount `<NavbarStateSetter hasFilters />`
  (`$lib/sections/navbar/NavbarStateSetter.svelte`) or
  `ResponsiveNavbarStateSetter hasFilters` on the page, or build your own map.
  `TraktPage filterScope="global"` (`$lib/sections/layout/TraktPage.svelte`) sets scope via `FilterScopeSetter`.

```svelte
<script lang="ts">
  const { mode } = useDiscover();
  const { filterMap } = useFilter();
  const { list, isLoading, hasNextPage, fetchNextPage } = $derived(
    useTrendingList({ type: $mode, limit: DEFAULT_DRILL_SIZE, filter: $filterMap }),
  );
</script>
```

### 2.2 Discover lists (trending / popular / anticipated / recommended)

All: `$lib/sections/lists/<name>/use<Name>List.ts`. Props =
`{ type: DiscoverMode } & PaginationParams & FilterParams (& SearchParams)`.
Return `{ list, isLoading, hasNextPage, fetchNextPage }`; list is intl-overlaid
(localized titles; `isLoading` stays true until overlay settles).

| Hook | Entry type (extends Movie/ShowEntry) | Query per mode (movie/show/media) | Notes |
|---|---|---|---|
| `useTrendingList` | `TrendingEntry` (+`watchers`) | `movieTrendingQuery` / `showTrendingQuery` / `mediaTrendingQuery` | filters out `id===0 \|\| slug===null` |
| `usePopularList` | `PopularEntry` = Show\|MovieEntry | `moviePopularQuery` / `showPopularQuery` / `mediaPopularQuery` | if no `filter.years`, injects last-12-months `start_date/end_date` (mutates params) |
| `useAnticipatedList` | `AnticipatedEntry` (+`score`) | `movieAnticipatedQuery` / `showAnticipatedQuery` / `mediaAnticipatedQuery` | injects `end_date = now+1y` if no years |
| `useRecommendedList` | `RecommendedEntry` (+`sources[]`) | `recommendedMoviesQuery` / `recommendedShowsQuery` (`$lib/requests/queries/recommendations/`) / `recommendedMediaQuery` (`$lib/requests/queries/media/mediaRecommendedQuery.ts`) | **auth**. Loads all 100 once (`useQuery`), daily-shuffled order (`dailyOrderArray`, localStorage), paged in memory via `useInMemoryPagination` |

Query files: `$lib/requests/queries/{movies,shows,media}/<x>Query.ts`. Existing
UI: `$lib/sections/lists/<name>/<Name>List.svelte` (carousel, limit 10) and
`<Name>PaginatedList.svelte` (grid, limit 100 via `PaginatedList`). Route
drilldowns `/discover/{trending,popular,anticipated,recommended,releases}` are
`audience="authenticated"`; `/discover` is public.

Releases (landscape strip): `useReleasesItems({ type, limit, episodeType, filter, filterOverride })`
at `$lib/sections/lists/stores/useReleasesItems.ts` -> `{ list: Obs<ReleasesCalendarEntry[]>, isLoading }`
(no pagination; 30 days from today, `releasesCalendarQuery`). Full releases
calendar: see 2.5 (`useReleasesCalendar`).

### 2.3 Home lists (`$clientRoutes/home/+page.svelte`, auth; server redirect via `redirectForAudience`)

Home order: Banner, UpNext, WatchList(intent start), StreakCallout, Upcoming,
Recommended, PersonalHistory, Activity. All read current user (`me`).

| List | Hook (path) | Props | Returns / entry |
|---|---|---|---|
| Up next | `useUpNextList` `$lib/sections/lists/progress/useUpNextList.ts` | `{ type: DiscoverMode, sortBy?: UpNextSortBy, sortHow?, limit, page?, filter? }` | paginated; `UpNextEntry` (episode + `show`, `total/completed/remaining/minutesLeft`, `lastWatchedAt`) or `MovieProgressEntry` (`progress, minutesLeft, playbackId`). show->`upNextNitroQuery`, movie->`movieProgressQuery`, media->`mediaProgressQuery` (`$lib/requests/queries/sync/`) |
| Up next sort | `useUpNextSorting(userSlug)` `$lib/sections/lists/progress/useUpNextSorting.ts` | reads `?sort_by=&sort_how=` | `{ current: Obs<{sorting, sortHow}>, options: Obs<Sorting[]>, urlBuilder }`; `smart` only with flag `up-next-smart-sort` |
| Start watching / Watchlist | `useWatchList` `$lib/sections/lists/watchlist/useWatchList.ts` | `{ type?, intent?: 'default'\|'start', sortBy?: SortBy, sortHow?, limit?, filter? }` | paginated `WatchlistedItem` (= `ListItem`: `{type:'movie'\|'show', entry, rank, listedAt, notes}`). `intent:'start'` = `hide:'unreleased'` + **also runs `useUpNextList`** and removes in-progress items (fan-out 2 queries). Default sort `added` (default) / `released` (start). Always `id:'me'`. |
| Watchlist count | `useWatchListItemCount(props)` same dir | same props | `{ itemCount: Obs<number\|undefined> }` from `useUser().watchlist`; undefined for start/filtered |
| Upcoming | `useUpcomingItems` `$lib/sections/lists/stores/useUpcomingItems.ts` | `{ type, limit, episodeType: Obs<EpisodeTypeFilter>, filter? }` | `{ list: Obs<(MediaEntry\|UpcomingEpisodeEntry)[]>, isLoading }`; 14 days from today, sliced to `limit`, no pagination |
| Recommended | `useRecommendedList` (2.2) | | |
| Personal history | `useRecentlyWatchedList` `$lib/sections/lists/stores/useRecentlyWatchedList.ts` | `{ type: 'movie'\|'show'\|'episode'\|'media', id?, slug? ='me', limit? =10, page?, syncId?, filter? }` | paginated + `periods: Obs<CalendarPeriods>` (day-grouped). `HistoryEntry` = `{id,key,watchedAt,type,movie}` / show / episode variants. media->`activityHistoryQuery`, movie/show/episode->`<x>ActivityHistoryQuery` (`$lib/requests/queries/users/`) |
| Social activity | `useActivityList` `$lib/sections/lists/activity/_internal/useActivityList.ts` | `{ type: DiscoverMode, range?: {startDate,endDate}, limit, page?, filter? }` | paginated `SocialActivity` (`{key, activityAt, type:'movie'\|'episode', users: UserProfile[], movie \| {episode, show}, rating?}`) + `activityCalendar`. Mode filter is client-side. |
| Streak | `useStreak({ mode })` `$lib/sections/stats/_internal/useStreak.ts` | | `{ streakCount: Obs<number>, isLoading }` derived from `useUser().history` (no request) |

`episodeType` source: `useEpisodeType()` `$lib/features/calendar/useEpisodeType.ts`
-> `{ episodeType: Obs<'all'|'premieres'|'finales'>, current, options, isApplicable, onEpisodeTypeChange }`
(forced `'all'` in movie mode; needs FilterProvider via `useDiscover`).

```ts
const { mode } = useDiscover();
const { filterMap } = useFilter();
const upNext = $derived(useStablePaginated({
  useList: useUpNextList, type: $mode, limit: DEFAULT_PAGE_SIZE, filter: $filterMap,
  compareFn: (l, r) => ('show' in l && 'show' in r ? l.show.id === r.show.id : l.id === r.id),
}));
const start = $derived(useWatchList({ type: $mode, intent: 'start', filter: $filterMap }));
```

### 2.4 Profile (`/profile/[slug]`, `/profile/me`)

Route hook: `useProfile(slug$: Observable<string>)` at
`$clientRoutes/profile/[slug]/useProfile.ts` -> `{ user: Obs<UserProfile|undefined>, isLoading }`
(`userProfileQuery({slug})`, ttl 30m). Usage in client:

```ts
const slug$ = fromRune(() => params.slug);          // $lib/utils/store/fromRune.svelte
const { user, isLoading } = useProfile(slug$);
const { isMe } = $derived(useIsMe(params.slug));     // $lib/features/auth/stores/useIsMe.ts
const { isFollowing } = $derived(useIsFollowing(params.slug)); // .../useIsFollowing.ts
const isPrivate = $derived($user?.private === true && !$isMe && $isFollowing === false);
```

`UserProfile` (`$lib/requests/models/UserProfile.ts`): `id, key, username, name,
private, isVip, isDirector, isDeleted, slug?, avatar.url, location?, about?,
cover?.url, joinedAt?`.

**Me vs other:** slug `"me"` is accepted by every `users/*` endpoint. `useIsMe(slug)`
is true when authorized and `slug === 'me' || slug === user.slug`.
`useIsFollowing(slug)` -> `Obs<boolean|undefined>` from `useUser().network`
(undefined when logged out). Current-user data: `useUser()`
(`$lib/features/auth/stores/useUser.ts`) -> Obs `user, history, watchlist,
collection, ratings, reactions, favorites, network, plexLibrary, likes, limits,
notes, dropped, rewatching, blocked` (context-memoized under AuthProvider).

| Data | Hook / query (path) | Params | Returns | Me/other |
|---|---|---|---|---|
| Stats | `userStatsQuery` `$lib/requests/queries/users/userStatsQuery.ts` | `{ slug }` | `UserStats \| null`: `movies{plays,watched,minutes,ratings,comments}`, `shows`, `seasons`, `episodes`, `network{followers,following}`, `ratings{total,distribution{1..10}}`, `progress{started,finished,dropped}\|null`, `lists`, `totalMinutes`, `totalPlays` | any slug; client UI only calls with `'me'` |
| All-time stats (me) | `useAllTimeStats()` `$lib/sections/profile/stores/useAllTimeStats.ts` / `useAllTimeStatsDetails()` | none | `{ stats: Obs<{playCount,movieCount,showCount,episodeCount,ratingCount,commentCount}>, isLoading }` | **me only (hardcoded)** |
| Month to date | `useMonthToDate({ slug })` `$lib/sections/profile/stores/useMonthToDate.ts` | | `{ monthToDate: Obs<MonthToDateDetails>, isLoading }`; fan-out 2 history queries (limit 1000) + ratings if me | any |
| Favorites | `useFavoritesList` `$lib/sections/lists/stores/useFavoritesList.ts` | `{ slug, type?: DiscoverMode, limit? =10, sortBy?, sortHow?, filter? }` | paginated `FavoritedEntry` `{key, rank, favoritedAt, item: Movie\|ShowEntry}` | any, public |
| History | `useRecentlyWatchedList({ type, slug })` (2.3) | | | any (private profiles gated in UI) |
| Ratings / reviews | `useMyActivityList` `$lib/sections/profile/components/_internal/useMyActivityList.ts` | `{ type: 'ratings'\|'reviews', mode: DiscoverMode, slug? ='me', limit, page? }` | paginated `UserRatingEntry` (`{key, activityType:'ratings', ratedAt, rating, type, movie\|show\|{show,episode}\|{show,season}}`) or `UserCommentEntry` (`{activityType:'reviews', comment: MediaComment, media, episode?}`) | any; UI shows for me |
| Raw queries | `userRatingsQuery({slug,limit,page})`, `userCommentsQuery({slug,limit,page})` | | infinite | |
| Following/followers | `useFollowing(slug, type)` `$lib/sections/profile/stores/useFollowing.ts` | `type: 'following'\|'followers'\|'requests'` | `{ profiles: Obs<UserProfile[]>, isLoading }` (not paginated). `requests` = `currentUserFollowRequestsQuery` (me) | any |
| Social toggler | `useProfileSocialToggler(slug)` `$lib/sections/profile/stores/useProfileSocialToggler.ts` | | `{ current, options, followRequests, set }` (`requests` option only for me with pending requests) | |
| Personal/collab/liked lists | `usePersonalListsSummary` `$lib/sections/lists/user/usePersonalListsSummary.ts` | `{ type: 'personal'\|'collaboration'\|'liked', slug, limit? =5, sortBy?: 'rank'\|'name'\|'updated_at'\|'created_at', sortHow? }` | paginated `MediaListSummary[]` (deduped) | `liked` ignores slug (always me); `collaboration` ignores limit/sort |
| Lists sort | `useUserListsSorting({ slug })` `$lib/sections/lists/user/useUserListsSorting.ts` | reads `?sort_by/sort_how` | `{ current, options, urlBuilder }` default `rank` asc | |
| All my lists (flat) | `useAllPersonalLists()` `$lib/stores/useAllPersonalLists.ts` | | `{ lists: Obs<UserList[]>, isLoading }` (`userListsQuery`, me) | me |
| Progress tabs | `useProgressList` `$lib/sections/profile/components/_internal/useProgressList.ts` | `{ type: 'in-progress'\|'completed'\|'ended'\|'dropped', limit?, sortBy?, sortHow? }` | paginated `ProgressEntry`; completed/ended share one query split by show status | **me only** (route redirects others) |
| Match % | `useMatch({ slug, mode })` `$lib/sections/profile/_internal/useMatch.ts` | | `{ match: Obs<UserMatch>, band: Obs<'high'\|'mid'\|'low'>, isLoading }` | auth, other user |
| Leaderboard | `useLeaderboard` `$lib/sections/profile/stores/useLeaderboard.ts` (`userLeaderboardQuery`) | | | me + flag `leaderboard` |
| Now watching | `userWatchingQuery({ slug })` `$lib/requests/queries/users/userWatchingQuery.ts` | | `NowPlayingItem \| undefined`, ttl 1m | any |
| Library | `useLibraryList({ library, type?, limit?, page? })` `$lib/sections/lists/library/useLibraryList.ts` | | paginated `LibraryItem` | me only (route redirects) |

Stats/heatmaps from local history (me only, no request): `useMonthlyStats({mode})`,
`useActivityHeatmap({mode, period})`, `useWeeklyPulse({mode})` in `$lib/sections/stats/_internal/`.

### 2.5 Calendar

Needs `CalendarProvider` (`$lib/features/calendar/CalendarProvider.svelte`,
prop `initialDate?`) - `getCalendarContext()` throws otherwise
(`$clientRoutes/calendar/+layout.svelte` wraps it). Route is `authenticated`.

| Hook | Path | Signature / returns |
|---|---|---|
| `useCalendarPeriod({ order? })` | `$lib/features/calendar/context/useCalendarPeriod.ts` | `{ startDate: Obs<Date>, endDate: Obs<Date> (start+1w), next(), previous(), reset(), loadMore(), accumulate({calendar, fingerprint,...}), activeDate: BehaviorSubject }`. Week start is locale-aware. `order: 'chronological' \| 'reverse-chronological'` |
| `useCalendar(props)` | `$lib/features/calendar/_internal/useCalendar.ts` | props `{ start: Date, days: number, type: DiscoverMode, episodeType: Obs<EpisodeTypeFilter>, filter? }` -> `{ calendar: Obs<{date, items: CalendarItem[]}[]>, isLoading, hasUpstreamItems }`. `CalendarItem = UpcomingEpisodeEntry \| MediaEntry` sorted by `effectiveReleaseDate` |
| `useReleasesCalendar(props)` | `$lib/features/calendar/_internal/useReleasesCalendar.ts` | same props -> `calendar: Obs<Calendar<ReleasesCalendarEntry>>` (global releases, `/discover/releases`) |

Underlying queries (`$lib/requests/queries/calendars/`): `upcomingEpisodesQuery`,
`upcomingMoviesQuery`, `upcomingMediaQuery` - params `{ startDate: 'YYYY-MM-DD', days, filter? }`
(my calendar, auth); `releasesCalendarQuery({ startDate, days, type, filter, filterOverride })`.

```ts
// getDaysDifference: $lib/utils/date/getDaysDifference.ts
const { startDate, endDate, next, previous } = useCalendarPeriod();
const { episodeType } = useEpisodeType();
const { mode } = useDiscover();
const { filterMap } = useFilter();
const { calendar, isLoading } = $derived(useCalendar({
  start: $startDate, days: getDaysDifference($startDate, $endDate),
  type: $mode, episodeType, filter: $filterMap,
}));
```

### 2.6 Search (Typesense)

`useSearch()` `$lib/features/search/useSearch.ts`. Requires `SearchProvider config={data.typesense}`
(`$lib/features/search/SearchProvider.svelte`; config from root `+layout.server.ts`
`locals.typesense`) - `getSearchContext()` otherwise throws. Route `/search` is `authenticated`.

Returns: `{ search(term, mode), clear(), results: Obs<SearchResponse|null>, coverSrc: Obs,
mode: BehaviorSubject<SearchMode>, isSearching: BehaviorSubject<boolean>, query: BehaviorSubject<string>,
pathName, config, postRecentSearch(item, query) }`.

- `SearchMode = 'media' | 'movie' | 'show' | 'people' | 'lists'` (`$lib/requests/queries/search/models/SearchMode.ts`).
- URL: `?q=` term, `?m=` mode. Provider syncs URL -> `query`/`mode`; the page must call
  `search(q, $mode)` itself (see `$clientRoutes/search/+page.svelte`). `useSearchMode()`
  (`$lib/features/search/useSearchMode.ts`) -> `{ mode, setMode(v) }` writes `?m=` with replaceState.
- `SearchResponse` (`$lib/features/search/models/SearchResponse.ts`) discriminated on `type`:
  `{type:'media', items: (MediaEntry & {score})[]}` | `{type:'people', items: PersonSummary[]}` |
  `{type:'lists', items: MediaListSummary[]}`. `null` when term empty or on error.
- Fan-out for media modes: 3 fetches (exact, fuzzy, `searchTrendingQuery`), merged/deduped by `key`,
  debounced 250ms. people/lists = 1 fetch. limit 50.
- Recent searches: **write only** - `postRecentSearch(item, query)` -> `recentSearchRequest`
  (`$lib/requests/queries/search/recentSearchRequest.ts`, POST). No read hook exists.
- Empty-state list: `useTrendingSearchesList(mode)` `$lib/features/search/_internal/useTrendingSearchesList.ts`
  (media: trending searches; people: `peopleThisMonthQuery` birthdays; lists: popular lists).

```ts
const q = $derived(page.url.searchParams.get('q')?.trim());
const { search, clear, results, mode, postRecentSearch } = useSearch();
$effect(() => { if (!q) { clear(); return; } search(q, $mode); });
// {#if $results?.type === 'media'} {#each $results.items as item (item.key)} ...
```

### 2.7 Lists (detail + items + smart lists)

| Hook | Path | Params | Returns |
|---|---|---|---|
| `useUserListSummary` | `$lib/sections/lists/user/useUserListSummary.ts` | `{ userId?: string, listId?: string }` (user slug + list slug) | `{ list: Obs<MediaListSummary\|undefined>, isLoading }`; returns `of(undefined)` if either missing |
| `useListSummary` (official) | `$clientRoutes/lists/official/[list]/useListSummary.ts` | `{ listId }` (numeric id string) | same shape (`listSummaryQuery`) |
| `useSmartListSummary` | `$clientRoutes/lists/smart/view/[list]/useSmartListSummary.ts` | `{ listId }` | `{ list: Obs<SmartList\|undefined>, isLoading }` |
| `useListItems` | `$lib/sections/lists/user/useListItems.ts` | `{ list: { slug?, user?: {slug?}, id? }, type?: DiscoverMode, sortBy?: SortBy, sortHow?, limit? =10, page?, filter? }` | paginated `ListItem`. `list.user.slug` set -> `userListItemsQuery({userId, listId: slug})`, else `listItemsQuery({listId: String(id)})` |
| `useListSorting` | `$lib/sections/lists/user/_internal/useListSorting.ts` | `{type:'user-list', list}` \| `{type:'watchlist', intent}` \| `{type:'favorites', slug}` \| `{type:'progress', slug}` | `{ current: Obs<{sorting:{value,...}, sortHow}>, options, urlBuilder }`; reads `?sort_by/sort_how`, default dir = `list.sortHow` |
| `useSort(sortBy)` | `$lib/sections/lists/user/useSort.ts` | | `{ groupBy?, toTag }` group headers for title/added/released |
| `useSmartLists` | `$lib/sections/lists/smart/useSmartLists.ts` | `{ mode, limit? =5 }` | `{ list: Obs<SmartList[]>, isLoading }` (me, sorted by updatedAt) |
| Smart list items | `smartListItemsQuery({ slug, limit, page?, filter? })` `$lib/requests/queries/smart-lists/smartListItemsQuery.ts` | | infinite; wrap with `usePaginatedListQuery` |

`MediaListSummary` (`$lib/requests/models/MediaListSummary.ts`): `id, key, slug, name,
description, user: UserProfile, count, likeCount, posters[{url}], updatedAt, sortBy,
sortHow, type, privacy`. `ListItem` (`$lib/requests/models/ListItem.ts`): union on
`type` `movie|show|episode|season` with `entry` (`MovieEntry` / `ShowEntry` /
`{episode, show}` / `{season, show}`) + `id, key, rank, notes?, listedAt`.
`SmartList` (`$lib/requests/queries/users/smartListQuery.ts`): `key, title, slug, id,
source, mediaType ('movies'|'shows'), privacy, filters, posters[], updatedAt`.
`SortBy = 'rank'|'added'|'runtime'|'percentage'|'my_rating'|'released'|'title'`.

```ts
const { list, isLoading } = $derived(useUserListSummary({ userId: params.user, listId: params.list }));
const { current } = $derived(useListSorting({ list: $list, type: 'user-list' }));
const items = $derived($list && useListItems({
  list: $list, type: $mode, sortBy: $current.sorting.value, sortHow: $current.sortHow,
  limit: DEFAULT_DRILL_SIZE, filter: $filterMap,
}));
```

Auth: user list detail is public (`all`); smart lists, liked lists, `/users/[user]/lists`
hub are `authenticated` + owner-only (client `Redirect` when `!isMe`).

### 2.8 Comments (read side)

| Hook | Path | Params | Returns |
|---|---|---|---|
| `useComments` | `$lib/sections/summary/components/comments/_internal/useComments.ts` | `{ slug, sort: 'likes'\|'newest', limit? =10, language? } & ({type:'movie'\|'show'} \| {type:'season', season, id, episodeCount} \| {type:'episode', season, episode, id})` | `usePaginatedListQuery` shape, `MediaComment[]` |
| `useCommentReplies` | `$lib/sections/summary/components/comments/drawers/useCommentReplies.ts` | `{ id }` | paginated `MediaComment[]` (limit 500, effectively one page) |
| `useCommentReactions` | `$lib/sections/summary/components/comments/_internal/comment-actions/useCommentReactions.ts` | `{ id }` | `{ currentReaction: Obs<Reaction\|null>` (from `useUser().reactions`), `summary: Obs<{count, top: Reaction[] (<=3), distribution}>`, `isLoading }` |
| `useCommentItem` | `$clientRoutes/comments/[id]/useCommentItem.ts` | `id$: Observable<number>` | `{ target: Obs<DirectCommentTarget>, isLoading }` - resolves comment -> `{type:'movie'\|'show', slug}` / season / episode / `{type:'list', user, list}` for redirect |
| Single comment | `commentQuery({ id })` `$lib/requests/queries/comments/commentQuery.ts` | | `MediaComment` |

Raw queries: `movieCommentsQuery`, `showCommentsQuery`, `showSeasonCommentsQuery`,
`episodeCommentsQuery`, `commentRepliesQuery`, `commentReactionsQuery`.
`MediaComment` (`$lib/requests/models/MediaComment.ts`): `id, key, parentId, createdAt,
updatedAt, comment, gif?{url,size?}, isSpoiler, isReview, replyCount, likeCount,
user: UserProfile & {stats:{rating?, playCount, completedCount}}`.
List comments: no list-comments read hook found in client (list comment target only via `useCommentItem`).

### 2.9 Year / Month in Review

Routes: `/users/[user]/year/[year]` (`year` = number or `all`), `/users/[user]/mir/[year]/[month]`;
`/users/[user]/yir` and `/mir` are 307 redirects (`+page.ts`). Audience `isMe ? authenticated : all`.

| Hook | Path | Params | Returns |
|---|---|---|---|
| `useYirDetail` | `$lib/sections/yir/_internal/useYirDetail.ts` | `{ slug, year: number \| 'all' }` | `{ detail: Obs<YirDetail\|undefined>, isLoading }` (intl-overlaid) |
| `useMirDetail` | `$lib/sections/yir/_internal/useMirDetail.ts` | `{ slug, year, month }` | same shape |
| `useYirPeople` | `$lib/sections/yir/_internal/useYirPeople.ts` | `{ slug, year, type: YirPeopleType }` | `{ people, isLoading }` |
| `useYearInReview` (banner summary) | `$lib/sections/banner/year-in-review/_internal/useYearInReview.ts` | `{ slug, year }` | `{ review, isLoading }` (`yearInReviewQuery`) |
| MIR summary | `monthInReviewQuery({ slug, year, month })` `$lib/requests/queries/users/monthInReviewQuery.ts` | | `UserReview` |

`YirDetail` (`$lib/requests/models/YirDetail.ts`): `stats.{all,shows,movies}.{minutes,
playCounts, collectedCounts, ratingsCounts, commentsCounts}` each `{total,yearly,monthly,weekly,daily}`,
`distributions{weekly,monthly,days,hourly?,daily?,yearly?}`, `images{cover,story}`,
`firstWatched/lastWatched`, `mostWatched{shows,movies}`, `genres`, `networks`, `studios`,
`topRated`, `countries`, `releaseYears?` / `listProgress?` (all-time only), ...
All three detail hooks append `slurm` from `resolveSlurm()` (webview session).
Own page + non-VIP: client skips the query and shows upsell (`YirPage`/`MirPage`).

### 2.10 Gotchas

- **Providers:** `useDiscover`/`useEpisodeType` need `FilterProvider`; `useCalendarPeriod` needs
  `CalendarProvider`; `useSearch` needs `SearchProvider` + typesense config; all queries need
  `QueryClientProvider`; `useUser`/`useIsMe` need `AuthProvider`. The boxed root layout mounts
  all of these except `CalendarProvider` (per-route).
- **`filterMap` is `{}` without navbar `hasFilters`** (2.1). Easy to miss: filters silently do nothing.
- **Watchlist, up next, upcoming calendar, progress, library, smart lists, liked lists, all-time stats
  are current-user only** (hardcoded `me`); there is no `slug` param. Other-user profile data =
  profile, stats (`userStatsQuery({slug})`), favorites, history, ratings/reviews, followers/following,
  personal + collaboration lists, match, now-watching, yir/mir.
- Start-watching (`intent:'start'`) fans out to watchlist + up next; `useMonthToDate` fans out to 2
  x 1000-item history queries.
- Popular/anticipated mutate `params.filter` to inject date ranges when no `years` filter.
- Recommended is not server-paginated (one 100-item fetch, in-memory paging, daily shuffled).
- `mode` in `media` is merged server-side by `media*Query`; activity/ratings filter by mode client-side.
- Hooks create new queries per call; call them in `$derived(...)` keyed on reactive params, not in
  `$effect`, or you leak subscriptions.

## 3. User state per item

All paths are relative to `projects/client/src/lib` and imported as `$lib/...`.
Every hook returns **RxJS Observables**. In Svelte, read them with `$obs` and
create them at component init time: `const { isWatched } = $derived(useIsWatched({...}))`.
Hooks call `getContext`/`useQuery`, so they must run at component init or inside `$derived`, never in event handlers.

### 3.1 The one source of truth: `useUser()`

`$lib/features/auth/stores/useUser.ts` has the signature `useUser(): {...observables}`. It's memoised per `AuthProvider`
scope through `setContext`, and each underlying `useQuery` is deduped by key, so N
posters calling it cost **zero extra requests**. When signed out, every slice emits an
empty Map/Set (no requests).

| slice | shape | backing request (once per session, all ids) | ttl | invalidated by |
|---|---|---|---|---|
| `history` | `UserHistory \| null` = `{ movies: Map<id, WatchedMovie>, shows: Map<id, WatchedShow> }`. It's **`null` until both pages settle** | `useAllPagesInfiniteQuery` over `/users/me/watched/minimal/movies` (limit 10000) + `/shows` (limit 1000, specials, season_numbers) | 12h | `MarkAsWatched('movie'\|'show'\|'episode')` |
| `watchlist` | `{ movies: Set<id>, shows: Set<id> }` (undefined while loading) | `GET /v3/users/me/watchlist/minimal` | 12h | `Watchlisted('movie'\|'show')` |
| `ratings` | `{ movies, shows, seasons, episodes: Map<id, { rating, ratedAt, id }> }` | 4 parallel `/users/me/ratings/{movies,shows,seasons,episodes}` | 3h, refetch on focus | `Rated(type)` |
| `favorites` | `{ movies, shows: Map<id, { favoritedAt, id }> }` | `/users/me/favorites/{movies,shows}` | 12h | `Favorited(type)` |
| `dropped` | `{ shows: Set<id> }` | `GET /v3/users/me/dropped/minimal` | 3h | `Drop('show')` |
| `rewatching` | `{ shows: Set<id> }` | `/users/hidden/progress_watched_reset?type=show&limit=1000` | 5m | `Rewatching('show')` |
| `notes` | `{ movies, shows: Map<id, NoteType[]> }` where `NoteType = 'favorites' \| 'note'` | `GET /v3/users/me/notes/minimal` | 3h | `Note.Add/Edit/Delete` |
| `collection` | `{ movies: Set<id>, episodes: Set<id> } \| null` | `/sync/collection/minimal/{movies,episodes}` (all pages) | - | `Collected(movie\|episode)` |
| `reactions` | `Map<commentId, { reaction }>` | current user comment reactions | - | `React` |
| `network` | `{ following: UserProfile[] }` | current user following | 12h | `User.Follow` |
| `likes` | `{ lists: Map }` | current user likes | - | `List.Like` |
| `user` | `UserSettings` (`isVip`, `preferences.watch.action`, `isSpoilerHidden` ...) | `api().users.settings` | - | `User.Settings/Avatar/CoverImage` |
| also | `plexLibrary`, `limits`, `blocked: Set<slug>` | | | |

`WatchedMovie` = `{ id, plays, watchedAt, watchedDates[] }`.
`WatchedShow` = `{ id, watchedAt, episodes: { episodeId, season, plays, watchedAt }[], watchedDates[], playsPerSeason: Map<season, count> }`.

### 3.2 Per-item hooks: which are safe for a grid

| need | hook (exact import) | signature / return | backing | grid safe |
|---|---|---|---|---|
| watched / partially watched | `useIsWatched` from `$lib/sections/media-actions/mark-as-watched/useIsWatched.ts` | `(ExtendedMediaStoreProps) => { isWatched: Obs<bool>, isPartiallyWatched: Obs<bool> }`. It overlays queued offline actions | `history` | **yes** (used by `DefaultMediaItem`) |
| watchlisted | `useIsWatchlisted` from `$lib/stores/useIsWatchlisted.ts` | `(MediaStoreProps) => { isWatchlisted }`. Always `false` for episodes. Has an offline overlay | `watchlist` | **yes** |
| play count | `useWatchCount` from `$lib/stores/useWatchCount.ts` | `({type:'movie',media} \| {type:'show',media:ShowEntry} \| {type:'episode',show,episode}) => { watchCount: Obs<number> }` | `history` | **yes** |
| dropped | `useIsDropped` from `$lib/sections/media-actions/drop/useIsDropped.ts` | `(media: MediaEntry) => { isDropped }`. Shows only | `dropped` | **yes** |
| rewatching | `useIsRewatching` from `$lib/sections/media-actions/rewatching/useIsRewatching.ts` | `(MediaStoreProps) => { isRewatching }` | `rewatching` | **yes** |
| rateable | `useIsRateable` from `$lib/sections/summary/components/rating/_internal/useIsRateable.ts` | `(ExtendedMediaStoreProps) => { isRateable }` (show: any non-special ep watched, else `isWatched`) | `history` | yes (`_internal`) |
| rating (+ write) | `useRatings` from `$lib/sections/summary/components/rating/useRatings.ts` | `({type, id}) => { current: Obs<{rating, isFavorited} \| undefined>, pendingRating, isSubmitting, isQueued, addRating, removeRating }` | `ratings` | read ok, **but** it builds 2 mutations + an rxjs subscription per instance. For grid badges read `useUser().ratings` directly |
| favorited (+ write) | `useFavorites` from `$lib/sections/media-actions/favorite/useFavorites.ts` | `({type,id,title,isToastEnabled?}) => { isFavorited, isQueued, isUpdatingFavorite, addToFavorites, removeFromFavorites }` | `favorites` | read ok, same caveat. Prefer `useUser().favorites` in grids |
| has notes | `useUser().notes` | `Map<id, NoteType[]>` | `notes` | **yes** |
| note contents | `useNotes` from `$lib/sections/summary/components/notes/_internal/useNotes.ts` | `({ media: MediaEntry }) => { notes, isLoading }` | **per item** `GET /v3/users/me/notes/{type}/{slug}` | **no** |
| in which of my lists | `useListedOnIds` from `$lib/stores/useListedOnIds.ts` | `({ target$: Observable<ListTarget> }) => { listedOnIds: Obs<number[]>, isLoading }` | **per item** `GET /v3/{movies\|shows}/{slug}/me/lists` (season/episode by id) | **no**. Detail page / lists drawer only |
| my lists | `useAllPersonalLists` from `$lib/stores/useAllPersonalLists.ts` | `() => { lists, isLoading }` | one `userListsQuery()` | yes |
| show progress + next ep | `useShowProgress` from `$lib/stores/useShowProgress.ts` | `(slug) => { progress: Obs<EpisodeProgressEntry \| undefined> }`: next episode fields + `total, completed, remaining, minutesLeft, isLatestAired` | **per item** `/shows/{slug}/progress/watched` | **no** |
| following user | `useIsFollowing` from `$lib/features/auth/stores/useIsFollowing.ts` | `(slug) => { isFollowing: Obs<bool \| undefined> }` | `network` | yes |
| comment reaction | `useCommentReactions` from `.../comments/_internal/comment-actions/useCommentReactions.ts` | `({id}) => { currentReaction (from reactions), summary (per-comment request), isLoading }` | mixed | no |

`MediaStoreProps` (`$lib/models/MediaStoreProps.ts`): `{type:'movie', media: T|T[]}` \|
`{type:'show', media}` \| `{type:'episode', media: {id,season,number}|[], show: {id,title}}`. `ExtendedMediaStoreProps` adds
`{type:'season', media: {id,number,episodes:{count,aired}}, show:{id}}`. Passing an array means "all of them" (`every`).

### 3.3 Cheap progress for grids (no per-item request)

- **Show % watched**: use `getShowWatchState({ watchedShow: $history.shows.get(id), episodeCount: show.episode.count })`
  from `$lib/utils/media/getShowWatchState.ts`. It returns `{ watchedEpisodeCount, isWatched, isStarted, minPlays }`.
  Specials (season 0) are excluded. % = `watchedEpisodeCount / show.episode.count`.
- **Next episode / continue watching list**: use one paginated query instead of per-item calls.
  `upNextNitroQuery` (`$lib/requests/queries/sync/upNextNitroQuery.ts`, `/sync/progress/up_next_nitro`) returns
  `UpNextEntry` = episode + `show` + `total/completed/remaining/minutesLeft/lastWatchedAt`. The `useUpNextList` hook is in
  `$lib/sections/lists/progress/useUpNextList.ts`. Paused movies: `movieProgressQuery` (`/sync/playback/movies`),
  `MovieProgressEntry.progress` (0-100) + `playbackId` (needed to drop a movie). Combined: `mediaProgressQuery`.
- **Episode watched**: `$history.shows.get(showId)?.episodes.some(e => e.episodeId === epId)`.

```svelte
<script lang="ts">
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import { useIsWatchlisted } from "$lib/stores/useIsWatchlisted";
  import { useUser } from "$lib/features/auth/stores/useUser";
  const { media }: { media: MediaEntry } = $props();
  const { isWatched, isPartiallyWatched } = $derived(useIsWatched({ type: media.type, media }));
  const { isWatchlisted } = $derived(useIsWatchlisted({ type: media.type, media }));
  const { ratings } = useUser();
  const rating = $derived(($ratings?.[`${media.type}s`] as Map<number, RatedEntry> | undefined)?.get(media.id)?.rating);
</script>
```

### 3.4 Refresh after actions

- Mutations are defined via `defineMutation({ key, request, invalidations })` (`$lib/features/query/defineMutation.ts`)
  and run through `useMutation` (`$lib/features/query/useMutation.ts`: `{ mutate, reset, result, isPending }`).
  When a mutation succeeds, `invalidateActions` invalidates every query whose key **contains** one of the
  `InvalidateAction.*` tokens (`$lib/requests/models/InvalidateAction.ts`). The synced collections above
  refetch, and every subscribed poster updates. There is no manual cache patching.
- Manual refresh: `useInvalidator()` from `$lib/stores/useInvalidator.ts` gives `{ invalidate(action), invalidateAll(actions) }`.
- For offline-capable writes, invalidation is gated by `whenExecuted(...)`: nothing is invalidated while
  the action is queued, and the UI shows the queued state through the offline overlay (see 4.0).
- Gotcha: `history` emits `null` while loading. Treat `null` as "unknown", not "unwatched", if you
  render a watched check before the fetch settles.

## 4. Actions

### 4.0 Shared plumbing (the boxed root layout already mounts all of these)

| concern | how |
|---|---|
| pending | every hook exposes an `Observable<boolean>` (`isMarkingAsWatched`, `isWatchlistUpdating`, ...), built from `useMutation(...).isPending` and combined with `anyTrue([...])` (`$lib/utils/store/anyTrue.ts`) |
| offline queue | `executeOrEnqueue` (`$lib/features/offline/executeOrEnqueue.ts`) returns `'executed' \| 'queued'`. It queues when offline or on a network error. The queue lives in IndexedDB (`idb-keyval`) and is replayed by `<OfflineSync/>`. **Only these endpoints are queueable:** `history:add/remove`, `watchlist:add/remove`, `rating:add/remove`, `favorites:add/remove` (`features/offline/models/OfflineActionEndpoint.ts`). Queued state: `useIsQueued({ domain, keys })` (`$lib/features/offline/useIsQueued.ts`), with keys from `toMediaKey(type, id)`. Every other action (check-in, drop, lists, notes, comments, follow, single-play removal) is a direct request that throws when offline |
| confirmations | `useConfirm()` (`$lib/features/confirmation/useConfirm.ts`) returns `confirm({ type: ConfirmationType.X, title, ..., onConfirm })`, which returns `(ev?) => void`. If the mapped message is empty it runs `onConfirm` immediately. Needs `<ConfirmationProvider>` |
| toasts | `useActionToast().notify({ message, action })` (`$lib/features/action-toast/useActionToast.ts`) + `<ActionToastHost/>`. Hooks default to `isToastEnabled: true`. The wrapper `*Action.svelte` components only enable toasts for `style="dropdown-item"` (`isToastEnabledForStyle`). Undo is provided by `undoToastAction(fn)` |
| drawers | global stores + providers: `markAsWatchedDrawerStore` (via `<MarkAsWatchedDrawerProvider/>`), `manageListsDrawerStore` (`<ManageListsDrawerProvider/>`), `addNoteDrawerStore` (`<AddNoteDrawerProvider/>`) |
| gating | wrap UI in `<RenderFor audience="authenticated">` (`$lib/guards/RenderFor.svelte`). Hooks also no-op when `useUser().user` is empty |

### 4.1 Mark watched / unwatch (movie, show, episode(s))

`useMarkAsWatched` from `$lib/sections/media-actions/mark-as-watched/useMarkAsWatched.ts`

- props: `MediaStoreProps<{ id, effectiveReleaseDate: Date, status? }> & { isToastEnabled? }`
- returns `{ markAsWatched(at?), removeWatched(), isWatched, isMarkingAsWatched, isQueued, isWatchable: boolean }`
- `at: MarkAsWatchedAt = 'now' | 'released' | 'unknown' | Date` (`$lib/models/MarkAsWatchedAt.ts`), or a
  `Map<id, Date>` for per-item dates. It is sent as `watched_at` to `POST /sync/history`. The default is `'now'`.
- `removeWatched()` wipes **all plays** (`/sync/history/remove`). It also removes the now-orphaned rating and shows an
  undo toast that restores the dates and rating (whole shows get no undo).
- Offline: queueable (`history`). `isWatchable` is false for unaired items (`hasAired`).

```ts
const { markAsWatched, removeWatched, isMarkingAsWatched, isWatched } =
  $derived(useMarkAsWatched({ type: 'movie', media: movie }));
await markAsWatched('released');           // or 'now' | 'unknown' | new Date(...)
```

The **full option sheet** (check-in / now / release date / other date via `HistorySlotDrawer` / unknown) is
`markAsWatchedDrawerStore.open({ title, mediaStore: target, onWatched? })` from
`$lib/sections/media-actions/mark-as-watched/_internal/markAsWatchedDrawerStore.ts`. Check-in only appears for a single
movie or episode. After "now" on an already-watched episode, it may prompt `StartRewatching` (behind a feature flag).

Confirmation `ConfirmationType.MarkAsWatched` only has a message (and shows a dialog) for a **show** or **multiple episodes**
(`getWarningMessage`). Movies and single episodes go through immediately. `RemoveFromWatched` always confirms.

Components:

| component | props | behavior |
|---|---|---|
| `mark-as-watched/MarkAsWatchedAction.svelte` | `MarkAsWatchedActionProps`: `style: 'normal'\|'action'\|'dropdown-item'`, `title`, `size?`, `i18n?`, `mode?: 'act'\|'hybrid'\|'ask'` (default hybrid), `isLoading?`, `onWatched?` + store props | `act`: mark now. `hybrid`: mark now, or confirm-remove if watched. `ask`: always open the drawer (used for "watch again") |
| `mark-as-watched/TrackAction.svelte` | `MarkAsWatchedStoreProps & { title, i18n? }` | summary action bar: opens the drawer, or confirm-remove if watched. No toasts |
| `mark-as-watched/MarkAsWatchedSwipeIndicator.svelte` | swipe affordance | |

**Season watched**: there is no season type for writes. Pass the season's episodes:
`<MarkAsWatchedAction style="dropdown-item" type="episode" media={episodes} show={show} title=... />`
(see `sections/lists/season/SeasonActions.svelte`, props `{ title, episodes, show, season, isLoading? }`).
**Episode watched**: `type="episode" media={episode} show={show}` (`show` needs `{ id, title }`).

**Watch until here**: `WatchedUntilHereDrawer` (`mark-as-watched/_internal/watch-until-here/WatchedUntilHereDrawer.svelte`,
props `{ show, title, episodes: WatchUntilEpisode[], isResolvingEpisodes, onClose }`) is fed by
`useWatchUntilHereEpisodes({ showSlug, targetEpisode:{season,number}, previousSeasons, currentSeasonEpisodes, watchedBySeason })`.
It is `_internal`, and its only consumer is `sections/lists/season/_internal/SeasonEpisodeItem.svelte`, which also offers a
gap-fill `ConfirmationType.WatchedUntilHere` after a single episode is marked. Reuse `SeasonEpisodeItem`, or copy that wiring.

### 4.2 Check-in

`useCheckIn` from `$lib/sections/media-actions/check-in/useCheckIn.ts`: `(MarkAsWatchedStoreProps)` for a **single**
movie or episode (it throws on arrays or shows). Returns `{ checkin(), isCheckingIn, isCheckedIn (any now-playing), isWatchable }`.
Invalidates `CheckIn`. Not queueable. Component: `check-in/CheckInAction.svelte` (`CheckInActionProps`: `style`, `title`, `size?`,
`variant?`, `disabled?`, `onCheckIn?` + store props). Stop: `sections/toast/_internal/StopButton.svelte` →
`useStopNowPlaying` + `ConfirmationType.StopCheckin` (`requests/queries/checkin/deleteCheckinRequest.ts`).

### 4.3 Remove a single play (history entry)

`useRemoveFromHistory` from `$lib/sections/media-actions/remove-from-history/useRemoveFromHistory.ts`

```ts
const { removeFromHistory, isRemoving } = useRemoveFromHistory({
  type: 'movie', id: entry.id /* play id */, movie: { id: movieId }, watchedAt, title,
}); // episode variant: { type:'episode', id, episode:{id}, show:{id}, watchedAt }
```
It removes the rating too if this was the last play, and shows an undo toast. Not queueable. Component:
`remove-from-history/RemoveFromHistoryAction.svelte` `{ entry: HistoryEntry, style, title, size? }` (confirms with `RemoveFromHistory`).

### 4.4 Watchlist

`useWatchlist` from `$lib/sections/media-actions/watchlist/useWatchlist.ts`: `(MediaStoreProps & { isToastEnabled? })` returns
`{ addToWatchlist, removeFromWatchlist, isWatchlisted, isWatchlistUpdating, isQueued }`. It no-ops for episodes and is queueable.
The add toast offers "Change list" (opens `manageListsDrawerStore`). The remove toast offers undo.
Component: `watchlist/WatchlistAction.svelte` (`WatchlistActionProps`: `style?`, `size?`, `title` + store props). Remove confirms
with `RemoveFromWatchList`. It also has `WatchlistIndicator.svelte` and `WatchlistSwipeIndicator.svelte`.

### 4.5 Rating (1-10) and remove

`useRatings({ type: 'movie'|'show'|'season'|'episode', id })` from `$lib/sections/summary/components/rating/useRatings.ts`

- `addRating(n)`: **debounced 500ms**, so the last value wins. `pendingRating` (a BehaviorSubject) holds the optimistic value.
- `removeRating()` sets `pendingRating` to 0 and posts `/sync/ratings/remove`.
- `isSubmitting`, `isQueued`, `current: Obs<{ rating, isFavorited } | undefined>`. Queueable. No toast and no confirm.
- Components: `sections/summary/components/rating/RateNow.svelte` (`RateNowProps` = `{type, media, show?}` + `variant?: 'allow'|'guard'`,
  guarded by `useIsRateable`). Also `media-actions/rating/RateAction.svelte` `{ target: RateNowProps, title, style?: 'cover'|'summary' }`.

```ts
const { current, addRating, removeRating, isSubmitting } = useRatings({ type: 'movie', id: movie.id });
addRating(8); // $current?.rating === 8 after sync
```

### 4.6 Favorite toggle

`useFavorites({ type: 'movie'|'show', id, title, isToastEnabled? })` returns `{ addToFavorites, removeFromFavorites,
isFavorited, isUpdatingFavorite, isQueued }`. Queueable. The toast offers undo.
Component: `favorite/FavoriteAction.svelte` `{ style?, size?, title, type, id, onAction?(pending), navigationType?, onclick? }`.
Remove confirms with `RemoveFavorite`. After an add it opens `NotePrompt` (noteType `favorites`, "why do you love it").

### 4.7 Lists

- Open the picker: `manageListsDrawerStore.open({ target: ListTarget, title, metaInfo? })` from
  `$lib/sections/components/lists-drawer/manageListsDrawerStore.ts`. `ListTarget` (`$lib/models/ListTarget.ts`) =
  `{type:'movie'|'show', media: MediaEntry} | {type:'season', media: Season} | {type:'episode', media: EpisodeEntry}`.
  `ListsDrawer.svelte` shows the watchlist row plus every personal list (`useAllPersonalLists` + `useListedOnIds`), and enforces item limits.
- Per list: `useList({ list: UserList, ...ListTarget })` from `lists-drawer/useList.ts` returns `{ addToList, removeFromList, isListUpdating }`.
  Invalidates `Listed(type)`. Not queueable. Remove confirms with `RemoveFromList` (in `ListDropdownItem.svelte`).
- Trigger button: `lists-drawer/ListAction.svelte` `{ size?, style?, variant?, title, target: ListTarget, onClick, disabled? }`.
  Note that it does a per-item `useListedOnIds` lookup (loading state), so don't put it on every grid poster. Call the store directly instead.

```ts
manageListsDrawerStore.open({ target: { type: 'movie', media: movie }, title: movie.title });
```

### 4.8 Notes

- The add drawer: `useAddNoteDrawer().open({ type: 'drop'|'favorites', title, id, mediaType })` from
  `$lib/features/notes/useAddNoteDrawer.ts`. It silently no-ops at the VIP/free note limit, or if a note of that type already exists.
- Low-level (all `_internal`): `usePostNote()` returns `{ postNote({ media:{type,id}, notes, type: NoteType }), isPosting }`,
  `useEditNote()` returns `{ editNote({id, notes, media, type}), isEditing }`, and `useDeleteNote()` returns `{ deleteNote({id, media, type}), isDeleting }`
  (confirm with `DeleteNote`, see `summary/components/notes/_internal/note-actions/DeleteNoteButton.svelte`). Reading notes: `NotesDrawerHost.svelte`.

### 4.9 Drop / undrop (restore)

- `useDrop({ type:'show', id, title, context? } | { type:'movie', id, playbackId, title })` from
  `$lib/sections/media-actions/drop/useDrop.ts` returns `{ drop, isDropping }`. For a show it calls drop + hides the show from the calendar.
  For a movie it drops the paused playback (it needs a `playbackId` from `movieProgressQuery`). Invalidates `Drop(type)`. There's no toast. When
  `context === 'drop'` and a `<DropNotePromptProvider>` is present (only up-next lists mount one) it prompts for a note.
- `useRestore({ ids: number[] })` from `restore/useRestore.ts` returns `{ restore, isRestoring }` (it restores progress and calendar for shows).
- Components: `drop/DropAction.svelte` `{ style, size?, variant?, title, ...DropStoreProps }` (confirms `DropShow`/`DropMovie`).
  `restore/RestoreAction.svelte` `{ style, title, size?, id }` (confirms `RestoreShow`).

### 4.10 Rewatching

`useRewatching({ show: { id, ... } })` (`rewatching/useRewatching.ts`) returns `{ startRewatching, stopRewatching, isRewatching, ... }`.
It's behind `FeatureFlag.Rewatching`. Components: `RewatchingAction.svelte`, `RewatchingDrawerHost.svelte`.

### 4.11 Comments (all in `sections/summary/components/comments/_internal/`)

| action | hook | notes |
|---|---|---|
| post / reply / edit | `usePostComment()` returns `{ postComment(props), isCommenting, error: BehaviorSubject<CommentError\|null> }` | `props = { comment, gif: {url,width?,height?}\|null, isSpoiler } & ({commentType:'post', media, type, ...CommentTypeProps} \| {commentType:'reply', id, type} \| {commentType:'edit', id, type})`. HTTP errors are mapped into `error`. It returns null on failure |
| react / unreact | `comment-actions/useCommentReaction({ id })` returns `{ react(reaction), remove(), isReacting }` | `Reaction` comes from `@trakt/api` `reactionsSchema`. It removes the old reaction and then adds the new one |
| delete | `comment-actions/useDeleteComment({ comment: MediaComment, type })` returns `{ deleteComment, isDeleting }` | confirms `DeleteComment` in `DeleteCommentButton.svelte` `{ comment, type }` |

UI pieces: `comment-input/CommentInput.svelte` (`{ label, placeholder, onCommentPost, sizing?, gifSuggestedQuery? } & UseAddCommentProps`),
`ReactAction.svelte` `{ comment }`, `ReplyButton`, `EditCommentButton`, `AddCommentAction`. `CommentsProps` is in
`sections/summary/components/comments/CommentsProps.ts`. Invalidates `Comment.Post/Reply(type)`. None of this is queueable.

### 4.12 Follow / unfollow

`useFollowUserRequest(slug)` from `$lib/sections/profile-banner/_internal/useFollowUser.ts` (`_internal`) returns
`{ followStatus: Obs<'none'|'pending'|'following'>, followUser, unfollowUser, cancelFollowRequest, isRequestingFollow,
incomingFollowRequest, approveIncomingFollowRequest(id), denyIncomingFollowRequest(id) }`. Invalidates `User.Follow`.
Unfollow confirms with `ConfirmationType.UnfollowUser` in `ProfileOverflowMenu.svelte`. For read-only checks, use `useIsFollowing(slug)`.

### 4.13 Gotchas

- Hooks capture props at creation. Wrap them in `$derived(useX(...))` so they rebuild when the item changes (the pattern is used everywhere).
- The `media` passed to watched/watchlist hooks needs `effectiveReleaseDate` (for `isWatchable`) and, for shows,
  `episode.count` (for watched state). Minimal `{ id }` objects make shows never count as "watched".
- `useRatings` and `useFavorites` build mutations per instance. Keep them on detail and summary surfaces, not on every poster.
- Rating removal and history removal cascade: removing all plays deletes the rating (and undo restores it).

## 5. Models

All domain models live in `$lib/requests/models/*.ts`. Each file exports a **zod schema** (`XSchema`) plus a **TS type** derived via `z.infer` (`X`). Import the type for props, the schema only for validation. Mappers that build them live in `$lib/requests/_internal/mapTo*.ts` (called by queries, you never call them from UI).

Globals (from `projects/client/src/app.d.ts`, referenced by boxed's `app.d.ts`): `type Nil = null | undefined`, `type HttpsUrl = \`https://${string}\``.

`.nullish()` = `T | null | undefined`; `.optional()` = `T | undefined`. Both marked `?` below.

### Import paths

| Type | Path | Notes |
|---|---|---|
| `MediaEntry` | `$lib/requests/models/MediaEntry.ts` | base for movie + show |
| `MovieEntry` | `$lib/requests/models/MovieEntry.ts` | `= MediaEntry` (same schema) |
| `ShowEntry`, `ShowAirs` | `$lib/requests/models/ShowEntry.ts` | MediaEntry + EpisodeCount + extras |
| `EpisodeEntry` | `$lib/requests/models/EpisodeEntry.ts` | |
| `Season` | `$lib/requests/models/Season.ts` | no "SeasonEntry" type exists |
| `PersonSummary` | `$lib/requests/models/PersonSummary.ts` | person page |
| `MediaCredits`, `MediaCredit` | `$lib/requests/models/MediaCredits.ts` | person filmography |
| `MediaCrew`, `CastMember`, `CrewMember` | `$lib/requests/models/MediaCrew.ts` | cast/crew of a title |
| `CrewPosition` | `$lib/requests/models/CrewPosition.ts` | `acting, directing, writing, ...` |
| `UserProfile` | `$lib/requests/models/UserProfile.ts` | |
| `UserName` | `$lib/requests/models/UserName.ts` | `{ full, first, last }` |
| `MediaComment` | `$lib/requests/models/MediaComment.ts` | comments + reviews |
| `Reaction`, `ReactionsSummary` | `$lib/requests/queries/comments/commentReactionsQuery.ts` | types live in the query file |
| `MediaListSummary` | `$lib/requests/models/MediaListSummary.ts` | a list (header/card) |
| `ListItem` | `$lib/requests/models/ListItem.ts` | discriminated union |
| `ListType` / `ListPrivacy` / `ListId` | `$lib/requests/models/ListType.ts` etc. | |
| `MediaType` | `$lib/requests/models/MediaType.ts` | `'movie' \| 'show'` |
| `ExtendedMediaType` | `$lib/requests/models/ExtendedMediaType.ts` | `MediaType \| 'episode'` (type only) |
| `MediaStatus` | `$lib/requests/models/MediaStatus.ts` | `@trakt/api` status enum + `'unknown'` |
| `EpisodeType` (+ `EpisodePremiereType`, `EpisodeFinaleType`, `EpisodeUnknownType`, `EpisodeComputedType` enums) | `$lib/requests/models/EpisodeType.ts` | |
| `MediaRating` | `$lib/requests/models/MediaRating.ts` | community + external ratings |
| `MediaVideo` | `$lib/requests/models/MediaVideo.ts` | `{ key, type, url, thumbnail, title, publishedAt }` |

### MediaEntry / MovieEntry / ShowEntry fields

| Field | Type | Notes |
|---|---|---|
| `type` | `'movie' \| 'show'` | discriminator (literal set by mapper) |
| `id` | `number` | trakt id |
| `key` | `string` | `movie-<id>` / `show-<id>`, use as `{#each}` key |
| `slug` | `string` | use for URLs |
| `imdbId?` | `string` | `tt...` |
| `tmdbId?` | `number` | |
| `title` | `string` | |
| `originalTitle?` | `string` | |
| `year?` | `number` | |
| `runtime` | `number` | minutes; **`NaN` when unknown** (not Nil) |
| `tagline` | `string` | `''` when missing |
| `overview` | `string` | **`'TBD'`** when missing |
| `genres` | `GenreOption[]` (`@trakt/api`) | `[]` when missing |
| `certification?` | `string` | movie: `'undefined'` string stripped |
| `status` | `MediaStatus` | `'unknown'` fallback |
| `country?` | `string` | |
| `languages?` | `string[]` | |
| `airDate` / `releaseDate` / `effectiveReleaseDate` | `Date` | all three identical for movie (`released`) and show (`first_aired`); `MAX_DATE` (9999-12-31) when unknown |
| `rating?` | `number` | **0-1** (`mapToTraktRating`: API 0-10 float / 10). x100 for %, x10 for a 10-scale. |
| `votes` | `number` | `0` fallback |
| `trailer?` | `HttpsUrl` | only kept if it is a YouTube URL with `?v=` |
| `homepage?` | `HttpsUrl` | |
| `socialMedia?` | `{ x?, instagram?, facebook?, wikipedia? }` | ids, build links with `UrlBuilder.external.*` |
| `poster` / `cover` / `logo` | `{ url: { medium: HttpsUrl, thumb: HttpsUrl } }` | never Nil, placeholder when missing (see 6) |
| `thumb` | `{ url: HttpsUrl }` | landscape still; movie = `cover.url.thumb`, show = `images.thumb` falling back to cover thumb |
| `colors?` | `[string, string]` | poster palette hex, see 6 |
| `postCredits` | `('during' \| 'after')[]` | always `[]` for shows |
| `plexSlug?` | `string` | |
| `updatedAt?` | `Date` | |

ShowEntry extras:

| Field | Type | Notes |
|---|---|---|
| `episode.count` | `number` | = `aired_episodes`, `NaN` when unknown |
| `totalRuntime` | `number` | `total_runtime` or `runtime * episode.count` |
| `network?` | `string` | |
| `airs?` | `{ day, time, timezone }` | only when all three present |
| `lastAired?` | `Date` | |

```ts
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
const isShow = (m: MediaEntry | ShowEntry): m is ShowEntry => m.type === 'show';
```

Movie vs show is **not** a discriminated union at type level: `MovieEntry` is literally `MediaEntry`; a `ShowEntry` has the extra fields. Narrow on `type` with a guard like the above.

### EpisodeEntry

| Field | Type | Notes |
|---|---|---|
| `id`, `key` (`episode-<id>`), `imdbId?` | | no slug, no tmdbId |
| `season`, `number` | `number` | |
| `title` | `string` | `''` when missing |
| `overview` | `string` | `''` when missing |
| `type` | `EpisodeType` | `standard`, `series_premiere`, `season_premiere`, `mid_season_premiere`, `series_finale`, `season_finale`, `mid_season_finale`, `unknown`, computed: `full_season`, `multiple_episodes` |
| `cover.url?` | `HttpsUrl` | **thumb-size only, Nil when missing** (no placeholder) |
| `runtime` | `number` | `NaN` fallback |
| `year` | `number` | from effectiveReleaseDate |
| `airDate` (`first_aired`) / `releaseDate` (`released`) / `effectiveReleaseDate` | `Date` | may differ; `MAX_DATE` when unknown |
| `rating?` (0-1), `votes?` | `number` | |
| `genres` | `[]` | always empty |
| `certification?` | `null` | |
| `postCredits`, `updatedAt?` | | |
| `episodes?` | `EpisodeEntry[]` | only on coalesced calendar/activity cards |

### Season

`id, key ('season-<id>'), number (0 = specials), title? (null for generic "Season N"/"Specials"), episodes: { count, aired }, poster?: { url: { medium, thumb } } (undefined when no poster; fall back to show poster), airDate: Date, overview?, rating? (0-1), network?, totalRuntime`.

### PersonSummary / credits / crew

| PersonSummary field | Type |
|---|---|
| `id`, `key`, `slug`, `name`, `biography` | `string`/`number` |
| `headshot` | `{ url: { medium, thumb } }` (portrait placeholder when missing) |
| `knownFor?` | `CrewPosition` |
| `height?` | `number` |
| `birthday?`, `deathDate?` | `Date` |
| `imdb?` | `string` |
| `socialMedia?` | `SocialMedia` |

`MediaCredits` = `Map<CrewPosition, MediaCredit[]>`; `MediaCredit` = `{ media: MediaEntry, key, episodeCount?, type: 'cast', character } | { ..., type: 'crew', job }`.

`MediaCrew` (title page) = `{ directors, writers, creators: CrewMember[], cast: CastMember[] }`; `CrewMember = { name, key, episodeCount?, jobs: string[] }` (no headshot, no slug); `CastMember = { name, key, episodeCount?, characterName, characters?, headshot: { url: { medium, thumb } } }`. Note: cast/crew have no `slug` field, but **`key` IS the person slug** (`mapToMediaCrew`: `key: person.ids.slug`), so link with `UrlBuilder.people(castMember.key)` (as `CastMemberItem.svelte` does).

### UserProfile

| Field | Type | Notes |
|---|---|---|
| `id`, `key` (`user-<id>`) | | |
| `username` | `string` | display handle |
| `slug?` | `string` | **use for URLs** (`UrlBuilder.profile.user(slug)`) |
| `name` | `{ full, first, last }` | |
| `avatar.url` | `string` | https, falls back to `DEFAULT_AVATAR` (zoidberg) |
| `cover?.url?` | `string` | only for VIPs with `vip_cover_image` |
| `private`, `isVip`, `isDirector`, `isDeleted` | `boolean` | |
| `location?`, `about?` | `string` | |
| `joinedAt?` | `Date` | |

### MediaComment (+ reactions)

`id, key ('comment-<id>'), parentId (0 = top level), createdAt, updatedAt: Date, comment: string (markdown-ish), gif?: { url, size?: { width, height } }, isSpoiler, isReview: boolean, replyCount, likeCount: number, user: UserProfile & { stats: { rating?: number (user's rating 1-10, raw), playCount, completedCount } }`.

Reactions: fetched separately.

```ts
import { commentReactionsQuery, type Reaction, type ReactionsSummary }
  from '$lib/requests/queries/comments/commentReactionsQuery.ts';
// Reaction = 'like' | 'dislike' | 'love' | 'laugh' | 'shocked' | 'bravo' | 'spoiler'
// ReactionsSummary = { count: number; distribution: Record<Reaction, number> }  (404 -> empty)
// mutations: reactCommentRequest({ fetch, id, reaction_type }), removeReactionCommentRequest (same dir)
```

### Lists

`MediaListSummary`: `id, key ('list-<id>'), slug, name, description ('' fallback), user: UserProfile, count (items), likeCount, posters: { url: { medium, thumb } }[] (collage), updatedAt: Date, sortBy: string, sortHow: 'asc'|'desc', type: 'all'|'personal'|'official'|'watchlist'|'favorites', privacy: 'public'|'private'|'link'|'friends'`.

`ListItem` is a real zod discriminated union on `type`:

```ts
type ListItem = { id; key; rank; notes?; listedAt: Date } & (
  | { type: 'movie';   entry: MovieEntry }
  | { type: 'show';    entry: ShowEntry }
  | { type: 'episode'; entry: { episode: EpisodeEntry; show: ShowEntry } }
  | { type: 'season';  entry: { season: Season; show: ShowEntry } }
);
```

## 6. Images

### URL pipeline (mappers)

Source: API `images.{poster|fanart|logo|thumb|headshot|screenshot}: string[]` - scheme-less candidate URLs, first is trakt CDN, later ones are fallbacks (tmdb, fanart.tv):

```
'media.trakt.tv/images/movies/000/916/302/posters/thumb/db9d66deb8.jpg.webp',
'image.tmdb.org/t/p/w342/ojQOGq9zMiW976jGE4etunK9Wuv.jpg'
```

| Helper | Path | What |
|---|---|---|
| `findDefined(...values)` | `$lib/utils/string/findDefined.ts` | first non-blank candidate (so trakt CDN wins) |
| `mediumUrl(url)` | `$lib/requests/_internal/mediumUrl.ts` | swaps `/thumb/` or `/original/` -> `/medium/` |
| `thumbUrl(url)` | `$lib/requests/_internal/thumbUrl.ts` | swaps `/medium/` or `/original/` -> `/thumb/` |
| `prependHttps(url, placeholder?)` | `$lib/utils/url/prependHttps.ts` | trims, adds/upgrades to `https://`, returns placeholder when blank |
| `appendWebp(url)` | `$lib/utils/url/appendWebp.ts` | appends `.webp` if absent; only used for YIR images |
| `mapToPoster(images)` | `$lib/requests/_internal/mapToPoster.ts` | `{ url: { medium, thumb } }`, portrait placeholder |
| `mapToCover(images)` | `.../mapToCover.ts` | from `fanart`; medium -> purple large placeholder, thumb -> landscape placeholder |
| `mapToLogo(images)` | `.../mapToLogo.ts` | from `logo`; **uses the cover placeholders** |
| `mapToHeadshot(images)` | `.../mapToHeadshot.ts` | portrait placeholder |
| `mapToColors(colors)` | `.../mapToColors.ts` | see below |

Variants: only **`thumb`** and **`medium`** (no full/original in models). CDN URLs are already `.jpg.webp` / `.png.webp`. The size swap is a string replace on the trakt CDN path, so a tmdb fallback URL (`/w342/`) stays the same size in both variants.

Usage convention in client: cards use `poster.url.thumb` / `cover.url.thumb`; hero, backdrops, landing, YIR use `.medium`; logo overlays use `logo.url.medium`.

### Placeholders (`$lib/utils/assets.ts`)

| Const | File (served from client `static/`, boxed uses the same `assets`) |
|---|---|
| `MEDIA_POSTER_PLACEHOLDER` | `/placeholders/portrait_placeholder.png` |
| `MEDIA_COVER_LARGE_PLACEHOLDER` | `/placeholders/purple_placeholder.png` |
| `MEDIA_COVER_THUMB_PLACEHOLDER` | `/placeholders/landscape_placeholder.png` |
| `EPISODE_COVER_PLACEHOLDER` | `/placeholders/landscape_placeholder.png` |
| `PLACEHOLDERS: string[]` | all four, test with `PLACEHOLDERS.includes(src)` |

Also `DEFAULT_AVATAR` and `DEFAULT_COVER` in `$lib/utils/constants.ts`; `DEFAULT_SHARE_COVER` / `DEFAULT_SHARE_{SHOW,MOVIE}_COVER` (random `trakt_share_*.webp`) in `assets.ts`.

Gotcha: a missing logo is **not Nil**, it is the purple placeholder. Always guard: `{#if !PLACEHOLDERS.includes(media.logo.url.medium)}` (pattern from `YirMostWatchedSection.svelte`, `CardCover.svelte`). Same for "has a real poster/cover" checks.

### colors

API returns `colors.poster: string[]` (hex, e.g. `['#A57B5D', '#1C130C']`) on movie/show responses. `mapToColors` returns `undefined` for empty/missing, else `[first, second ?? 'transparent']`. Not computed client side. Only on `MediaEntry` (not episode/season/person). Client consumes it via CSS vars (`CoverImage.svelte`: `style:--trakt-cover-primary-color={colors?.at(0)}`).

### Components

| Component | Path | Props |
|---|---|---|
| `CrossOriginImage` | `$lib/features/image/components/CrossOriginImage.svelte` | `ImageProps` = all `<img>` attrs + `animate?: boolean` (default `true`, fade-in on load) + `classList?: string`. Defaults `loading="lazy"`, `decoding="async"`. Adds `.image-placeholder` (bg `--shade-800`) when src is a placeholder. |
| `ImageProps` | `$lib/features/image/components/ImageProps.ts` | type above |
| `EditableImage` | `$lib/features/image/components/EditableImage.svelte` | avatar/cover upload (profile) |
| `CardCover` | `$lib/components/card/CardCover.svelte` | `{ src, overlaySrc?, alt, title, badge?: Snippet, tag?: Snippet }` - card image + optional logo overlay, loading shimmer |
| `SummaryPoster` | `$lib/components/summary/SummaryPoster.svelte` | `{ src, alt, href?, target? ('_blank'), hoverOverlay?, actions?, tags?: Snippet, variant?: 'portrait'\|'landscape' }` |
| `CoverImageSetter` | `$lib/components/background/CoverImageSetter.svelte` | `{ src?, type: MediaType \| 'main', colors?: [string,string] }` - pushes into shared cover store |
| `CoverImage` | `$lib/components/background/CoverImage.svelte` | no props; renders the page backdrop from the store with `loading="eager"` |

```svelte
<CrossOriginImage src={media.poster.url.thumb} alt={media.title} />
<CoverImageSetter src={media.cover.url.medium} type={media.type} colors={media.colors} />
```

Error fallback: on `onerror`, `CrossOriginImage` calls `resolveEnvironmentUri(src)` (`.../components/resolveEnvironmentUri.ts`). Prod: no-op (same URI). Dev: POSTs to `/_features/image/gimme` (`ImageEndpoint.Gimme`), handled by `$lib/features/image/handle.ts` which fetches server side and returns a base64 data URI (dodges CDN hotlink/CORS locally). Boxed gets this for free: `projects/boxed/svelte.config.js` points `hooks.server` at the client's `src/hooks.server`, which includes `handleImage`.

Helpers: `trackImageLoaded` action (`$lib/utils/actions/trackImageLoaded.ts`), `isImageComplete(src)` (`$lib/utils/image/isImageComplete.ts`). Episode card images with spoiler logic: `useEpisodeSpoilerImage({ episode, show, variant })` (`$lib/features/spoilers/useEpisodeSpoilerImage.ts`) returns an Observable of `episode.cover.url ?? show.cover.url.thumb` (or show cover when hidden / coalesced / `next`/`upcoming` variants).


## 7. Reusable primitives

All paths are under `projects/client/src/lib` and are imported as `$lib/...`. Every
entry below was checked against the code. Two ground rules apply throughout:

- **Providers**: boxed `src/routes/+layout.svelte` copies the client's root provider tree:
  QueryClient, Auth, FeatureFlag, Player, Analytics, Navigation, Locale, Search, Filter,
  Toast, ActionToastHost, Confirmation, OfflineSync and the rest. Anything marked
  "needs X provider" works in a boxed page for free. It only matters in tests, where the
  test bed has a smaller tree (see section 10).
- **`_internal/` rule** (`.agents/rules/components.md`): never import from another folder's
  `_internal/`. No lint rule enforces this, so it relies on review. If you need something
  that lives in an `_internal/` folder, wrap it or uplift it. Don't reach into it.

### 7.1 Images and skeletons

| Primitive | Import | Key props | Notes |
| --- | --- | --- | --- |
| `CrossOriginImage` | `$lib/features/image/components/CrossOriginImage.svelte` | `ImageProps` = all `<img>` attrs + `animate?` (default `true`, fades in on load) + `classList?`. `loading` defaults to `"lazy"`. | The only generic image primitive. Always sets `decoding="async"` and `content-visibility:auto`. `onerror` retries through `resolveEnvironmentUri`. Placeholder URLs (`PLACEHOLDERS` in `$lib/utils/assets`) get a `--shade-800` background. Pass `width`/`height` yourself (performance.md). |
| `EditableImage` | `$lib/features/image/components/EditableImage.svelte` | `ImageProps & { onchange(ev: ImageChangeEvent) }` | Drag-and-drop wrapper that emits `{ base64 }`. |
| `CardCover` | `$lib/components/card/CardCover.svelte` | `src, alt, title, overlaySrc?, badge?: Snippet, tag?: Snippet` | Card poster slot with a loading shimmer, built on CrossOriginImage. |
| `Card` | `$lib/components/card/Card.svelte` | `variant?: "transparent"\|"opaque"`, `eager?`, `action?`, `classList?` | **Lazy-mounts its children** through `whenInViewport` unless `eager`. |
| `PortraitCard` / `LandscapeCard` | `$lib/components/media/card/*.svelte` | `children` | `Card` with the portrait/landscape size tokens (`--width-portrait-card` etc.). |
| `Skeleton` | `$lib/components/skeleton/Skeleton.svelte` | `width?, height?, radius?` (CSS strings) | Pulse block. Defaults: `100%` x `--ni-16`, `--border-radius-s`. Static under reduced motion. |
| `SkeletonCard` | `$lib/sections/lists/components/SkeletonCard.svelte` | `variant?: "portrait"\|"landscape"`, `index`, `listIndex` | Staggered shimmer card. |
| `SkeletonList` | `$lib/components/lists/SkeletonList.svelte` | `id`, `variant?` | A row of `DEFAULT_PAGE_SIZE` SkeletonCards. |

```svelte
<CrossOriginImage src={media.poster.url.thumb} alt={media.title} width={154} height={231} />
<Skeleton width="var(--ni-120)" height="var(--ni-180)" radius="var(--border-radius-m)" />
```

### 7.2 Links, buttons, menus

| Primitive | Import | Key props |
| --- | --- | --- |
| `Link` | `$lib/components/link/Link.svelte` | `href`, `color?: "default"\|"classic"\|"inherit"`, `focusable?`, `noscroll?`, `replacestate?`, `label?`, `activeMatch?: "exact"\|"nested"`, `navigationType?`, `target?`. Auth-guards the href (`useGuardedHref`), appends global params, and exposes the active state. |
| `MessageWithLink` | `$lib/components/link/MessageWithLink.svelte` | Renders the `<a>` inside an i18n message. Never use `{@html}`. |
| `Button` | `$lib/components/buttons/Button.svelte` | `TraktButtonProps` (`buttons/TraktButtonProps.ts`): `label` (required, aria), `color?: purple\|red\|blue\|orange\|default\|custom` (default `custom`), `variant?: primary\|secondary`, `style?: flat\|ghost\|underlined\|outline`, `size?: normal\|small\|tag`, `text?: capitalize\|uppercase\|none`, `icon?`/`subtitle?` snippets. Pass `href` and it renders an `<a>`. Also takes `onclickoutside`. |
| `ActionButton` | `$lib/components/buttons/ActionButton.svelte` | `TraktActionButtonProps`: icon-only, `label` doubles as the tooltip (`tooltip?` default `true`, pointer devices only). `size?: normal\|small\|large`, `style?: flat\|ghost`, `color?`, `variant?`, `classList?`. |
| `DropdownItem` | `$lib/components/dropdown/DropdownItem.svelte` | `color?` (default `purple`), `style?: ghost\|flat`, `variant?`, `selected?`, `icon?`/`end?`/`subtitle?` snippets. With `href` it renders a Link (`noscroll`/`replacestate`/`target` are forwarded). With an `on*` handler it gets `role=button`. Group items with `DropdownGroup.svelte`. |
| `PopupMenu` | `$lib/components/buttons/popup/PopupMenu.svelte` | `items: Snippet` (required), `title` (required), `label`, `mode?: overlay\|standalone`, `size?: small\|normal`, `icon?` (default MoreIcon). A portal popup on desktop that turns into a **Drawer on mobile** automatically. Closes on select. |
| `ShareButton` | `$lib/components/buttons/share/ShareButton.svelte` | `title`, `textFactory: ({title}) => string`, `source: { id, type? }` (DrilldownSource), `urlOverride?`, `style?: action\|dropdown-item`, `variant?`. |

```svelte
<PopupMenu label={m.button_label_sync_options()} title={m.button_label_sync_options()} mode="standalone">
  {#snippet items()}
    <DropdownItem color="red" onclick={remove}>{m.button_text_remove_from_history()}</DropdownItem>
  {/snippet}
</PopupMenu>
<ShareButton title={list.name} textFactory={({ title: name }) => m.text_share_list({ name })} source={{ id: "list" }} />
```

**Gotcha:** `ShareButton` renders **nothing** unless `navigator.canShare(data)` is true (Web Share API). On desktop Chrome and Firefox that is usually false, and there is no copy-link fallback. It adds `PREFETCH_SHARE_PARAM` to the URL and tracks `AnalyticsEvent.Share`. The hook `useShare(source)` lives in `buttons/share/useShare.ts`.

### 7.3 Drawer, dialogs, toggles

**Drawer**: `$lib/components/drawer/Drawer.svelte`. On desktop it is a side sheet from inline-end; on mobile it is a bottom sheet with vertical drag.

| Prop | Values |
| --- | --- |
| `onClose` (req), `children` (req) | |
| `title?`, `metaInfo?: string\|Snippet`, `badge?`, `actions?` | header slots |
| `size?` | `normal` (default) \| `large` \| `auto` |
| `dismissal?` | `auto` (default) \| `escape-only` \| `manual` |
| `variant?` | `default` \| `vip` |
| `headerVariant?` | `default` \| `overlay` |
| `elevated?` | stacks above a base-layer drawer |
| `drilldown?`, `trapSelector?`, `onOpened?`, `classList?` | |

Drawers are driven by the URL through `drawerNavigation` (`$lib/components/drawer/drawerNavigation.ts`, param `DRAWER_VIEW_PARAM = "view"`):

```ts
const { buildDrawerLink, openDrawer, close } = drawerNavigation<"reviews" | "lists">();
// <Link {...buildDrawerLink("reviews")}>  -> ?view=reviews, noscroll + replacestate
```

Name a drawer `*Drawer` when it receives everything as props, and `*DrawerHost` when it calls `use*` itself.

**Dialogs** (`$lib/components/dialogs/`): `Modal.svelte` (`onClose?, children, footer?`) and `ConfirmationDialog.svelte`. Don't render ConfirmationDialog yourself. Go through `useConfirm`:

```ts
import { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
const { confirm } = useConfirm();
const onBlock = confirm({ type: ConfirmationType.BlockUser, username, onConfirm: () => block(slug) });
// onclick={onBlock}  (confirm returns an (event?) => void handler)
```

`ConfirmationType` is a closed enum of 36 cases (MarkAsWatched, RemoveFromList, DeleteList, UnfollowUser, Logout, ...). Copy is resolved by `_internal/mapToConfirmation.ts`. **A new confirmation kind means editing lib** (enum + params map + mapper). If the mapped message is empty, `confirm` runs `onConfirm` immediately. Needs `ConfirmationProvider`.

**Toggles** (`$lib/components/toggles/`):

- `Switch.svelte`: checkbox switch. `SwitchProps` = checkbox props + `checked?`, `indeterminate?`, `innerText?`, `color?`, `icon?`.
- `Toggler.svelte` (generic `T extends string`): `value`, `onChange(value)`, `options: ToggleOption<T>[]` (`{ value, text: () => string, label: () => string, icon?, href? }`), `variant?: icon|text`, `ariaLabel?`. It is a SegmentedSelect under the hood.
- `useToggler(id)` gives you `{ current: Observable<{value,text}>, set, options, default }`. The value is persisted to localStorage as `trakt_toggler_<id>`. Valid ids (`_internal/constants.ts`): `social`, `discover`, `comment`, `trivia`, `progress`, `activity`, `library`, `episodeType`. Adding an id means editing lib.

```svelte
const { current, set, options } = useToggler("progress");
<Toggler value={$current.value} onChange={set} {options} ariaLabel={m.list_title_progress()} />
```

### 7.4 Text: Spoiler, ClampedText, markup messages

| Primitive | Import | Props / usage |
| --- | --- | --- |
| `Spoiler` | `$lib/features/spoilers/components/Spoiler.svelte` | `IsWatchedProps` (= `ExtendedMediaStoreProps`: `{ type, media, show? }`) + `variant?: "dismissible"\|"persistent"`. Blurs the text children when the user has spoiler-hiding on AND the item is unwatched. `dismissible` lets a click reveal it. |
| `useMediaSpoiler(props)` | `$lib/features/spoilers/useMediaSpoiler.ts` | `{ isSpoilerHidden: Observable<boolean> }` for custom UI |
| `useSpoilerFreeEpisodeTitle({episode, show})` | `$lib/features/spoilers/useSpoilerFreeEpisodeTitle.ts` | Observable string. Falls back to "S1 • E3" when hidden. |
| `useEpisodeSpoilerImage({episode, show, variant})` | `$lib/features/spoilers/useEpisodeSpoilerImage.ts` | Observable URL (the show cover when hidden) |
| `ClampedText` | `$lib/components/text/ClampedText.svelte` | `label` (required, for the more button), `lineCount?` (default 3), `classList?`, children. Adds a "more" toggle only when the text actually overflows. |
| `lineClamp` action | `$lib/components/text/lineClamp.ts` | `use:lineClamp={{ lines, isClamped? }}` |
| `MessageWithBold` | `$lib/components/text/MessageWithBold.svelte` | `message={m.key(...)}`. Renders `<b>` in the message. |

```svelte
<Spoiler media={episode} {show} type="episode">{episode.title}</Spoiler>
<ClampedText label={m.button_label_read_more()} lineCount={4}><p>{overview}</p></ClampedText>
```

Spoiler depends on `useIsWatched` (the user's history) and the offline queue, so it needs the Auth and Query providers.

### 7.5 Guards

`$lib/guards/RenderFor.svelte`. Props: `audience` (required), `device?`, `input?`, children. The props combine.

| Prop | Values (verified: `src/app.d.ts` `AudienceProps`, `guards/_internal/*Props.ts`) |
| --- | --- |
| `audience` | `all` · `authenticated` (authorized + user loaded) · `public` (anonymous) · `vip` · `free` (authed, non-VIP) · `director` (director account or `IS_DEV`) |
| `device` | array of `mobile` \| `tablet-sm` \| `tablet-lg` \| `desktop` |
| `input` | array of `mouse` \| `touch` |

`$lib/guards/RenderForFeature.svelte`. Props: `flag: FeatureFlag`, `enabled: Snippet` (required), `audience?: "vip"\|"director"` (default `vip`), and children as the fallback. It renders `enabled` only when the flag is on AND the audience matches. **A flag defaults to ON only for director accounts.** localStorage overrides always win.

`FeatureFlag` (`$lib/features/feature-flag/models/FeatureFlag.ts`): `EditMode 'edit-mode'`, `ScopedFavorites`, `UpNextSmartSort`, `Rewatching`, `Leaderboard`, `ParentalGuide`, `Soundtrack`, `ListCounts`, `ReviewerStats`, `GenrePicker`, `ActionConfirmations`, `YouTubeSpecials`. The enum is closed, so a new flag means editing lib. `useFeatureFlag()` needs `FeatureFlagProvider`.

```svelte
<RenderFor audience="authenticated" device={["mobile", "tablet-sm"]}><MobileRateBar /></RenderFor>
<RenderForFeature flag={FeatureFlag.Soundtrack}>{#snippet enabled()}<Soundtrack />{/snippet}</RenderForFeature>
```

**Gotcha:** the example in `components.md` (`audience="member"`, `flag="notes"`) is **stale**. Neither value exists. For JS branching on screen size, use `useMedia(WellKnownMediaQuery.mobile)` from `$lib/stores/css/useMedia.ts`, which returns `Observable<boolean>`. The keys are `mobile, tabletSmall, tabletLarge, desktop, mouse, touch, reducedMotion`.

### 7.6 Viewport gating and pagination

There is **no** `RenderInView` or `useVisibility` component. The only IntersectionObserver helper is:

```svelte
<script lang="ts">
  import { whenInViewport } from '$lib/utils/actions/whenInViewport.ts';
  let isVisible = $state(false);
</script>
<div use:whenInViewport={() => (isVisible = true)}>{#if isVisible}<Heavy />{/if}</div>
```

It fires once and then unobserves. All callers share one pooled observer (`threshold: 0.1`). `Card` and `SectionList` already use it. For images, prefer native `loading="lazy"` (performance.md). In tests the IntersectionObserver mock reports every element as intersecting immediately, so gated content renders straight away.

**Pagination** (`$lib/features/query/useQuery.ts`):

| Need | Use |
| --- | --- |
| A single query | `useQuery(opts \| Observable<opts>)`, which returns `Observable<QueryObserverResult>` |
| Pages on demand | `useInfiniteQuery(opts)` |
| All pages, fetched automatically | `useAllPagesInfiniteQuery(opts)`. Never hand-roll `tap + fetchNextPage`. |
| A list store with dedupe | `usePaginatedListQuery(opts)` (`$lib/sections/lists/stores/usePaginatedListQuery.ts`), which returns `{ list, isLoading, hasNextPage, fetchNextPage }`, deduped by `entry.key` |
| Infinite-scroll container | `PaginatedList` (`$lib/components/lists/PaginatedList.svelte`) |

`PaginatedList` props: `useList: PaginatableStore<T,M>` (a `({type, limit, ...filter}) => {list, isLoading, fetchNextPage, hasNextPage}` function), `type`, `items: Snippet<[T[], boolean]>`, `target?: "default"|"parent"` (which element scrolls), plus `FilterParams`. It loads the next page when you scroll near the bottom, or when the page isn't filled yet (`sections/lists/drilldown/_internal/useLazyLoader.ts`). Page size is `DEFAULT_DRILL_SIZE`.

```svelte
<PaginatedList {type} {filter} {useList}>
  {#snippet items(items, isLoading)}<GridList {items} ... />{/snippet}
</PaginatedList>
```

The other list shells live in `$lib/components/lists/`: `section-list/SectionList.svelte` (horizontal row), `grid-list/GridList.svelte`, `LetterGroupHeader.svelte`.

### 7.7 Formatting utils (`$lib/utils/formatting/...`, all locale-aware)

Pass `getLocale()` where the type is `AvailableLocale` ("en", "fr-FR", ...). Pass `languageTag()` where it is `AvailableLanguage`. Both come from `$lib/features/i18n/index.ts`.

| Need | Function (file) | Signature |
| --- | --- | --- |
| Date + time, relative when near | `date/toHumanDate.ts` | `toHumanDate(today, date, getLocale())` gives "tomorrow at 3 PM", otherwise `PPPp` |
| Day, relative when near | `date/toRelativeHumanDay.ts` | `toRelativeHumanDay(today, date, getLocale())` gives today / "last Monday", otherwise `PPP` |
| Plain day | `date/toHumanDay.ts` | **object param**: `toHumanDay({ date, locale: getLocale(), format?: "short"\|"long" })`. utils.md shows it as positional, which is wrong. |
| Short / long date, month | `toHumanShortDate(date, lang)`, `toHumanLongDate(date, lang)`, `toHumanMonth(date, lang, "short"\|"long")` | also `toHumanTime`, `toHumanDayOfWeek`, `toHumanClockTime` |
| Countdown (future only) | `date/toHumanETA.ts` | `toHumanETA(today, target, getLocale())` gives "in 3 hours". **For past dates it returns just the year.** There is no "x ago" helper. |
| Runtime / duration | `date/toHumanDuration.ts` | `toHumanDuration({ minutes, hours?, days?, unitDisplay?, separator?, clampAt? }, languageTag())` gives "2h 16m" |
| Compact number | `number/toHumanNumber.ts` | `toHumanNumber(1234, lang)` gives "1.2K" |
| Count | `number/toHumanCount.ts` | grouped below 100K ("12,345"), compact above |
| Percent / Trakt rating | `number/toPercentage.ts`, `number/toTraktRating.ts` | `toTraktRating(0.87)` gives "87%". The input is a **0..1 fraction**. |
| User rating as stars | `number/toUserRating.ts` | `toUserRating(8)` gives "4" (1..10 mapped to 5 stars) |
| Other rating scales | `toIMDBRating`, `toLetterboxdRating`, `toRottenTomatoRating`, `toVotesBasedRating` | |
| Currency | `currency/toHumanCurrency.ts` | `toHumanCurrency({ price, currency, locale })` |
| Language / country name | `intl/toLanguageName.ts`, `intl/toCountryName.ts` | `(code, languageTag())` |
| API enum to text | `string/toTranslatedGenre`, `...Status`, `...Job`, `...Type`, `...VideoType`, ... | falls back to the raw value |

**Episode codes** (`$lib/utils/intl/`):

- `episodeNumberLabel({ seasonNumber, episodeNumber })` gives **"S1 • E3"** (message `episode_footer_season_episode`). This is not `S01E03`.
- `episodeSubtitle(episode)` handles full season, multi-episode ranges and single episodes.
- `seasonLabel(n, showTitle?)` returns "Specials" for season 0.
- Also here: `multiEpisodeLabel`, `episodeMetaInfo`.

Tag components already wire these formatters through `TagIntlProvider` (`$lib/components/media/tags/TagIntlProvider.ts`). For example, `<DurationTag runtime={m} i18n={TagIntlProvider} />`.

Other helpers:

- `toDisplayableName(profile)` (`$lib/utils/profile/toDisplayableName.ts`) for every user name.
- `time.minutes(5)` (`$lib/utils/timing/time.ts`) for every millisecond value.

### 7.8 Toasts

- **Undo/info toast**: use `useActionToast()` (`$lib/features/action-toast/useActionToast.ts`), which returns `{ notify, dismiss }`.
  - `notify({ message, action?, variant?: "default"|"error" })`, where `action` is `{ text, label, onAction }`.
  - `undoToastAction(fn)` (`$lib/features/action-toast/undoToastAction.ts`) builds a standard Undo action.
  - A toast lasts `ACTION_TOAST_DURATION` (6s).
  - It is rendered by `ActionToastHost`, which is already in the boxed layout.

  ```ts
  const { notify } = useActionToast();
  notify({ message: m.action_toast_added_to_favorites({ title }), action: undoToastAction(undo) });
  ```

- **Static snackbar**: `$lib/components/snackbar/Snackbar.svelte`. Takes `message` + `href?` or `children`, plus an optional action.
- `ToastProvider` and `NavbarToastContent` are the now-playing / post-watch "rate it" toast. That one is domain UI, not a generic primitive.

### 7.9 Rating widget (`$lib/sections/summary/components/rating/`)

- **Public entry point: `RateNow.svelte`**. Props: `RateNowProps` (`models/RateNowProps.ts`) = `{ type: MediaType, media: MediaEntry }` | `{ type: "episode", media: EpisodeEntry, show: ShowEntry }` | `{ type: "season", media: Season, show }`, plus `onclick?` and `variant?: "guard"|"allow"`.
  - `guard` (default) renders only if `useIsRateable` passes. For a show that means at least one non-special episode watched; for anything else it means watched.
  - It wires `useRatings({ type, id })` (offline-queued mutation, 0.5s debounce, analytics), a QueuedTag, a FavoriteAction (movie/show only) and the popcorn / rotten-tomato delight.
  - Needs the Auth, Query, OfflineSync and Analytics providers.
- **`_internal/RatingStars.svelte` is prop-pure.** Props: `rating?` (0..10), `isRating`, `onAddRating(rating, starEl?)`, `onRemoveRating()`, `variant?: "half"|"full"`. Its only dependencies are `bits-ui` `RatingGroup`, `StarIcon` and `m`. It has **no context requirements**. But it sits in `_internal/`, so boxed must not import it directly. To reuse the scrub standalone, uplift it (move it up one level, or to `$lib/components/rating/`). That is a lib change.
  - Its colors are hardcoded to trakt tokens (`--orange-400` for preview, `--red-500` for clearing, `--color-tooltip-*`). Restyle through a wrapper class, following the "Restyling a Shared Component" section of components.md.
- `useRatings` (`useRatings.ts`) is public: `{ current, pendingRating, isSubmitting, isQueued, addRating(n), removeRating() }`.
- Scale: the app stores ratings as integers 1..10, and a star is 2 points (`STAR_RATINGS` in `constants/index.ts`).
- For read-only display, boxed already has `projects/boxed/src/boxed/components/Stars.svelte` (in progress, uses `m.boxed_label_rated_stars`).

### 7.10 Trailer player

- `usePlayer()` (`$lib/features/player/stores/useYoutubePlayer.ts`) returns `{ play(url), preload(url), isLoading: Observable<boolean> }`.
  - `url` is a YouTube watch URL (it reads `?v=`), which is `media.trailer` (`string | Nil`).
  - `play` autoplays in the Plyr overlay that `YoutubePlayerProvider` mounts. That provider is already in the boxed layout.
- Reference button: `$lib/sections/summary/components/media/v2/_internal/TrailerButton.svelte`. It is internal, so copy the pattern:

```ts
const { play, preload, isLoading } = usePlayer();
$effect(() => { if (trailer) preload(trailer); });
const onclick = () => trailer && (play(trailer), track({ slug })); // track = useTrack(AnalyticsEvent.Trailer)
```

`sections/summary/components/overlay/TrailerOverlay.svelte` is only the play-icon hover overlay for the poster.

---

## 8. i18n

### 8.1 Files

| File | Role | Edit? |
| --- | --- | --- |
| `projects/client/i18n/meta/en.json` | **Source of truth.** `{ $schema, meta, messages }`, ~2,277 keys. Schema: `i18n/schema/meta-messages.schema.json`. | **Yes, add keys here only** |
| `projects/client/i18n/messages/en.json` | Generated from meta (flat `key: default`). Gitignored. | No |
| `projects/client/i18n/messages/<locale>.json` (27 others) | Translations, synced from CrowdIn ("feat(i18n): update translations" commits). Committed. | No, let CrowdIn fill them |
| `projects/client/i18n/project.inlang/settings.json` | `baseLocale: "en"`, 28 locales, message-format plugin with `pathPattern ./messages/{languageTag}.json` | No |
| `projects/client/src/lib/paraglide/` | Compiled output (`messages/_index.js` + one file per locale). Gitignored. | Never |

### 8.2 Message format (from meta/en.json)

```json
"episode_footer_season_episode": {
  "default": "S{seasonNumber} • E{episodeNumber}",
  "description": "Footer text for an episode, showing the season and episode number. ...",
  "variables": {
    "seasonNumber": { "type": "number" },
    "episodeNumber": { "type": "number" }
  }
}
```

- The allowed fields are only `default`, `description` and `variables`. A variable `type` is one of `string|number|date|time|currency`, and a variable may also have `description` and `required`. Every existing entry has a `description` (the CrowdIn context), so always write one.
- Keys match `^[a-zA-Z][a-zA-Z0-9_]*$` and are snake_case. The common prefixes are `button_label_` (aria), `button_text_` (visible), `translated_value_` (enum maps), `list_title_`, `page_title_`, `tag_text_`, `text_`, `header_`, `link_text_`, `confirmation_title_`, `error_text_`, `input_placeholder_`, `action_toast_`.
- Plurals are **separate keys**, e.g. `tag_text_play` and `tag_text_plays`. Nearly no ICU plural is used.
- Inline `<b>` / `<a>` markup is allowed, rendered through `MessageWithBold` / `MessageWithLink`.
- Never put `@` in a default. It breaks the generated JSDoc. Pass `toDisplayableName(...)` as a variable instead.

### 8.3 Commands (run from `projects/client`, defined in its package.json)

| Task | Does |
| --- | --- |
| `deno task i18n:web` | Turns meta into `messages/en.json` (`i18n/generator/cli.ts -i i18n/meta/ -o i18n/ --platforms web`) |
| `deno task i18n:web:watch` | Same, in watch mode. Part of the client `dev`. |
| `deno task i18n:compile` | paraglide-js compile into `src/lib/paraglide` |
| `deno task i18n:prepare` | `i18n:web` then `i18n:compile` |
| `deno task i18n:check` | Checks placeholder consistency across locales (`.scripts/check-i18n-placeholders.ts`) |
| `deno task i18n:resolve` | Resolves git conflict markers in the i18n JSON (also available as root `deno task client:i18n:resolve`) |

The client's vite config runs `paraglideVitePlugin`, so client dev/build compile on the fly.

**Boxed has no paraglide plugin** in `projects/boxed/vite.config.ts`. Boxed's `i18n` script (`projects/boxed/package.json`) runs before `dev`/`build`. The committed version calls `i18n:web`, which does not compile. The working tree currently has an uncommitted change to `i18n:prepare`, which does compile. Without a compile step, **new keys are not visible to boxed** until something recompiles `src/lib/paraglide`.

### 8.4 Fallback when a locale lacks a key

Paraglide builds a fallback map (`getFallbackMap` in `@inlang/paraglide-js/dist/compiler/compile-project.js`). Each locale falls back to its closest locale by BCP-47 lookup, and in the end to `en`. A locale module that lacks a key re-exports it from its fallback locale file.

So a new key shows **English in all 27 other locales** until CrowdIn delivers translations. Nothing crashes. `i18n:check` only compares placeholders.

### 8.5 Using messages

```svelte
<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';   // dominant form (~440 files); `{ m }` also works
  import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
</script>
<button aria-label={m.button_label_retry()}>{m.button_text_retry()}</button>
<p>{m.tag_text_remaining_duration({ duration })}</p>
```

- RTL locales are `fa-IR` and `ar-SA` (`RTL_LOCALES`). Use `getTextDirection(locale)` from the same index.
- Wrap mixed-direction values in `<bdi dir="auto">`.

### 8.6 Can boxed add its own messages?

Yes, but only in the shared `projects/client/i18n/meta/en.json`. There is no separate boxed catalog, and boxed imports `m` from the client's compiled paraglide.

The working tree already follows the convention of a **`boxed_` prefix** (`boxed_label_rated_stars`, used in `projects/boxed/src/boxed/components/Stars.svelte`). Keep that prefix, so boxed-only keys are greppable and can be pruned or upstreamed. Reuse existing keys whenever the copy matches.

In tests, `test/mocks/messages.mock.ts` spreads the real module, so new keys work in specs once they are compiled.

---


## 9. URL builders

`import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';` - a plain object, all methods return relative path strings (except external/og). Query strings via `buildParamString` (`$lib/utils/url/buildParamString.ts`, drops `null`/`undefined`, returns `''` or `?a=1&b=2`).

Param types: `UrlBuilderParams = { type: ExtendedMediaType | 'media' } & { page?, watch_window?, status?, display?, sort_by?, sort_how?, mode?, section?, search?: Record<string, string|number|boolean> }`. `search` is JSON-encoded into one `search=` param. `DiscoverUrlParams = { search?, mode?: 'movie'|'show'|'media' }`. `sanitizeParams` whitelists keys, so arbitrary keys are **dropped** for methods that use it (profile/favorites/progress/watchlist/users.lists) - only `show`/`movie`/`people`/`settings.streamingServices` pass raw params.

### Media

| Method | Example output |
|---|---|
| `movie(slug, params?)` | `/movies/heretic-2024` / `?view=review&comment_id=1` |
| `show(slug, params?)` | `/shows/silo` |
| `media(type, slug)` | delegates to movie/show |
| `episode(slug, season, episode)` | `/shows/silo/seasons/1/episodes/3` |
| `episodeDrawer(slug, s, e)` | `/shows/silo?view=episode&season=1&episode=3` |
| `seasonDrawer(slug, s)` | `/shows/silo?view=seasons&season=1` |
| _(no season builder)_ | route `/shows/[slug]/seasons/[season]` exists but only redirects to `show(slug, { season })` -> `/shows/silo?season=1` |
| `related.movie(slug)` / `related.show(slug)` | `/movies/x/related`, `/shows/x/related` |
| `related.episode(slug, s, e)` | `/shows/x/seasons/1/episodes/3/related` |
| `popularLists.movie(slug)` / `.show(slug)` | `/movies/x/lists`, `/shows/x/lists` |
| `movies()` / `shows()` | `/movies`, `/shows` |

Drawer param keys: `DRAWER_VIEW_PARAM = 'view'` (`$lib/components/drawer/constants/index.ts`), values from `SummaryDrawers` enum (`$lib/sections/summary/SummaryDrawers.ts`): `sentiment, details, cast, videos, trivia, soundtrack, history, social, where-to-watch, seasons, episode, notes, comments, review, ratings, rewatching`. `COMMENT_ID_PARAM = 'comment_id'` (`$lib/sections/summary/constants.ts`).

### People

| Method | Example |
|---|---|
| `people(slug, positions?)` | `/people/cillian-murphy` or `?movies=acting&shows=acting` (`CrewPositions`) |
| `credits.movies(slug)` / `.shows(slug)` / `.history(slug)` | `/people/x/movies`, `/people/x/shows`, `/people/x/history` |

### Comments

No `UrlBuilder.comment`. Use `directCommentTargetUrl({ commentId, target })` (`$lib/sections/summary/directCommentTargetUrl.ts`, `target: DirectCommentTarget` from `$lib/requests/models/DirectCommentTarget.ts`): movie -> `/movies/x?view=review&comment_id=N`; season adds `&season=S`; episode -> `/shows/x?view=episode&comment_id=N&season=S&episode=E`; list -> `/users/u/lists/slug`. Route `/comments/[id]` resolves the target and redirects (hardcode `/comments/${id}` for share links).

### Users / profile

| Method | Example |
|---|---|
| `profile.user(slug)` / `profile.me()` | `/profile/vlad`, `/profile/me` |
| `profile.favorites(slug, params?)` | `/profile/vlad/favorites?display=movie` |
| `profile.history(slug)` / `profile.social(slug)` | `/profile/vlad/history`, `/profile/vlad/social` |
| `profile.progress(slug, params?)` | `/profile/vlad/progress` |
| `progress(user, params?)` | `/users/vlad/progress` |
| `startWatching(user, params?)` | `/users/vlad/start-watching` |
| `users(user).lists(listSlug, params?)` | `/users/vlad/lists/my-list?sort_by=rank&sort_how=asc` |
| `users(user).yearToDate(2025)` / `.allTime()` | `/users/vlad/year/2025`, `/users/vlad/year/all` |
| `users(user).monthInReview(2025, 3)` | `/users/vlad/mir/2025/3` |
| `library.home()` / `library.me(lib)` | `/users/me/library`, `/users/me/library?library=plex` |

### Lists

| Method | Example |
|---|---|
| `lists.user(user)` | `/users/vlad/lists` |
| `lists.user(user, { type: 'movie', ... })` | `/users/vlad/lists/movies?...` |
| `lists.watchlist(user, params?)` | `/users/vlad/watchlist?display=show` |
| `lists.all(user, 'personal' \| 'liked' \| 'collaboration', { sort_by?, sort_how? })` | `/users/vlad/lists/view/personal`, `/.../view/liked`, `/.../view/collaborations` |
| `lists.official(slug, params?)` | `/lists/official/marvel?type=movie` |
| `lists.smart.all()` / `.view(slug)` / `.create()` | `/lists/smart/view`, `/lists/smart/view/x`, `/lists/smart/create` |

`ListUrlBuilder<T>` (`$lib/sections/lists/user/models/ListUrlBuilder.ts`) is just a type `(params: { sortBy?, sortHow? }) => string` for sort-aware list links.

### Discover / search / calendar / history / social

| Method | Example |
|---|---|
| `discover(params?)` | `/discover`, `/discover?mode=movie` |
| `trending / popular / anticipated / recommended / releases(params?)` | `/discover/trending?mode=show` |
| `search()` | `/search` (query read from `?q=` by `SearchProvider`; navbar also uses `?m=` for mode) |
| `calendar()` | `/calendar` |
| `history.home()` / `history.all({ type, page })` | `/history`, `/history?page=2` |
| `history.category({ type: 'movie', ... })` | `/history/movies?...` |
| `history.sync(id)` | `/history?sync_id=12` |
| `history.movie(slug)` / `.show(slug)` / `.episode(slug, s, e)` | `/history/movies/x`, `/history/shows/x/seasons/1/episodes/3` |
| `watched({ type: 'show' })` | `/watched/shows` |
| `social.activity()` | `/social/activity` |
| `landing()` / `home()` / `welcome()` | `/`, `/home`, `/welcome` |

### Settings / static pages

| Method | Output |
|---|---|
| `settings.general()` / `.generalDetail()` | `/settings`, `/settings/general` |
| `settings.account()` / `.data()` / `.advanced()` / `.preview()` / `.plex()` | `/settings/account` ... |
| `settings.appsConnected()` | `/settings/apps/connected` |
| `settings.streamingServices({ connection?, service? })` / `.streamingServicesDetail(id)` | `/settings/streaming-services?...`, `/settings/streaming-services/12` |
| `vip()` / `terms()` / `privacy()` / `about()` / `branding()` / `faq.tvTime()` | `/vip`, `/terms`, ... `/faq/tv-time` |
| `renewVip()` | `'vip/renew'` (**relative, no leading slash**) |

### OG / external / API

| Method | Output |
|---|---|
| `api.shareableImage(type, slug).openGraph()` / `.feed()` / `.story()` | `/api/shareable-image?type=movie&slug=x&variant=open-graph` |
| `openGraphUrlBuilder({ url, type, slug })` (`$lib/sections/layout/_internal/openGraphUrlBuilder.ts`) | absolute `https://<origin>/api/shareable-image?...&variant=open-graph` |
| `og.widgets.yir(slug, year)` | `https://widgets.trakt.tv/users/x/yir.jpg?year=2025` |
| `og.watchnow(id)` | `https://watchnow.trakt.tv/watchnow/<id>` |
| `og.support(username?)` / `og.forums()` | forums or `mailto:` |
| `external.imdb.media(tt)` / `.person(nm)` | `https://www.imdb.com/title/tt...` |
| `external.tmdb.media(id, 'tv' \| 'movie')` | `https://www.themoviedb.org/tv/123` (note `tv`, not `show`) |
| `external.x / instagram / facebook / wikipedia(id)` | social profile URLs |
| `app.android/ios/tvTime()`, `developer.*`, `github.*`, `status()`, `feedback()`, `admin()` | external |

### Gotchas

- Cast/crew `key` = person slug (other models' `key` is `<type>-<id>`, not a slug).
- Links use `slug` everywhere (`media.slug`, `user.slug`), never `id`; `UserProfile.slug` is nullish, `username` is the fallback the client uses in places.
- `rating` is 0-1, `runtime`/`episode.count` can be `NaN`, `overview` can be `'TBD'`, dates can be `MAX_DATE` - check before rendering ("TBA" states).
- Placeholder images are real URLs, never Nil (except `EpisodeEntry.cover.url` and `Season.poster`). Check `PLACEHOLDERS.includes(...)`.
- No season or comment page builders; seasons and comments are drawers on the show/movie page.

## 10. Testing

### 10.1 Setup

| Item | Location |
| --- | --- |
| Client vitest config | `projects/client/vite.config.ts` `test:`. Includes `src/**`, `.scripts/**` and `i18n/**` `*.{test,spec}.{js,ts}`. Uses jsdom and `setupFiles: ./vitest-setup.ts`. |
| Boxed vitest config | `projects/boxed/vite.config.ts` `test:`. Includes `src/**/*.{test,spec}.{js,ts}` and reuses **the client's `vitest-setup.ts`**. `$test` / `$mocks` resolve to the client folders (`boxed/svelte.config.js` aliases). |
| Global setup | `projects/client/vitest-setup.ts` |

`vitest-setup.ts` does the following:

- Loads jest-dom.
- Loads the mocks in `test/mocks/`: `IntersectionObserver` (always intersecting), `ResizeObserver`, `matchMedia`, `localStorage`, `$app/state`, `$app/navigation`, navigator, oidc-client-ts, `messages`, env, animate, scrollTo.
- Sets `TZ=UTC`.
- Starts the MSW server (`beforeAll server.listen`).
- After each test: `server.resetHandlers()`, `vi.clearAllMocks()`, `setAuthorization(false)`.

### 10.2 Run commands

- **Client**: `cd projects/client && deno task test:unit`. That is `vitest`, and the `pretest:unit` script runs the i18n prebuild. Add `-- --run <path>` for a single file.
- **Boxed**: `cd projects/boxed && deno task test:unit`, which runs `vitest` over boxed `src` only. If you changed messages, compile i18n first (8.3).
- Other client scripts: `test:cov` (istanbul) and `test:doctor` (`--run --reporter=dot`).

### 10.3 Test beds (`projects/client/test/beds/`, import as `$test/beds/...`)

| Bed | File | Use |
| --- | --- | --- |
| `renderComponent(Comp, { props })` | `component/renderComponent.ts` | Renders inside `ComponentTestBed`, which is `TestProvider` + `ConfirmationProvider` |
| `runQuery({ factory, waitFor?, mapper? })` | `query/runQuery.ts` | Awaits the first matching emission of any Observable (a `use*` hook) |
| `createTestBedQuery(queryDef)` / `createTestBedInfiniteQuery` | `query/createTestBedQuery.ts`, `query/createTestBedInfiniteQuery.ts` | Wraps a `defineQuery` result so `runQuery` can consume it |
| `renderStore(factory)`, `setAuthorization(bool)` | `store/renderStore.ts` | Store in a context. `setAuthorization(true)` puts the mock OIDC user into storage. |
| `captureInvalidations`, `captureRequests` | `query/captureInvalidations.ts`, `request/captureRequests.ts` | Assert mutation side effects |
| `lastActionToast` | `action-toast/lastActionToast.ts` | Assert toasts |
| `runInDerived`, `createStateWriter` | `svelte/*.svelte.ts` | Rune-driven hooks |

The provider tree in `TestProvider` (`test/beds/_internal/TestProvider.svelte`) is: QueryClient, Auth, FeatureFlag, Toast, Search, Navigation, Analytics.

It does **not** include Player, OfflineSync, Filter, Locale, Theme, or the drawer providers. A component that calls `usePlayer()` or `useFilter` will throw under `renderComponent`. You would have to wrap it or mock it.

### 10.4 MSW mocks

- Handlers are in `projects/client/src/mocks/handlers/{domain}.ts`: apps, auth, calendars, comments, intl, klipy, lists, movies, people, plex, recommendations, search, shows, streamingSync, sync, team, users, vip, watchNow.
- They are aggregated by spread into `setupServer` in **`src/mocks/server.ts`**. A new domain file must be added to that array.
- Fixtures live in `src/mocks/data/{domain...}/response/*ResponseMock.ts` (raw API) and `mapped/*MappedMock.ts` (mapper output). For example, `data/summary/movies/heretic/response/MovieHereticResponseMock.ts`.
- Handler URLs use the `http://localhost/...` origin.
- To override a handler for one test, call `server.use(http.get(...))`. It is reset after each test.

### 10.5 Real examples

Pure function (`lib/sections/summary/components/rating/_internal/starFill.spec.ts`):

```ts
import { describe, expect, it } from 'vitest';
import { starFill } from './starFill.ts';

describe('util: starFill', () => {
  it('should half-fill the star straddled by a half value', () => {
    expect(starFill({ value: 2.5, index: 2, allowHalf: true })).toBe('half');
  });
});
```

Boxed has its own pure spec in the same style: `projects/boxed/src/boxed/chrome/_internal/siteSectionFor.spec.ts`.

Query (`lib/features/auth/queries/currentUserSettingsQuery.spec.ts`):

```ts
const result = await runQuery({
  factory: () => createTestBedQuery(currentUserSettingsQuery()),
  mapper: (response) => response?.data,
});
expect(result).to.deep.equal(ExtendedUserMappedMock);
```

Component with auth + a per-test MSW override (`lib/sections/settings/_internal/ResetCoverImageRow.spec.ts`):

```ts
beforeEach(() => setAuthorization(true));

it('should confirm before clearing the cover', async () => {
  const user = userEvent.setup();
  server.use(http.put('http://localhost/users/set_cover', async ({ request }) => {
    requests.push(await request.json());
    return new HttpResponse(null, { status: 204 });
  }));
  renderComponent(ResetCoverImageRow, { props: {} });
  await user.click(await screen.findByRole('button', { name: 'Reset your cover image to the default artwork.' }));
  await waitFor(() => expect(screen.getByText('Reset cover image?')).toBeInTheDocument());
});
```

Snippet props (`lib/components/buttons/Button.spec.ts`): `children: createRawSnippet(() => ({ render: () => '<span>Test</span>' }))`.

### 10.6 Conventions

- The top-level `describe` names the unit: `'util: x'`, `'store: useX'`, or the component name.
- `it('should ...')`.
- Specs are colocated `*.spec.ts`.
- Always import beds and fixtures through `$test` / `$mocks`. Never use relative paths into `test/` or `src/mocks/`. Some older specs, such as `currentUserSettingsQuery.spec.ts`, still use relative mock imports. Don't copy that.
- Mock the API with MSW, never `fetch` directly.
- Query assertions compare against the `mapped/` fixtures.
