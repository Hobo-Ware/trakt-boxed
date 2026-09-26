# trakt-boxed: page map and design plan

Date: 2026-09-26. Status: **signed off 2026-09-26** (user: "I trust you, make it supreme but don't deviate too much - Letterboxd users should feel at home but be delighted"). Decisions D1-D12 accepted as recommended; delight layer in 2a chosen.

Goal: a Letterboxd-style product on the Trakt API, same approach as trakt-time
(fork trakt-web, keep `lib/requests` + feature state, rebuild the UI surface).
Difference from Letterboxd: TV shows are first class (show, season and episode
pages, episode diary, progress), and every Trakt-only feature stays.

Inputs:
- `~/Git/Hoboware/letterboxd-research/screenshots/` + `notes/` - 64 public Letterboxd pages, desktop + mobile (Playwright over real Chrome; 17 in May + 47 on 2026-09-26, incl. person, studio, every film tab, profile likes/tags/network/stats/year, every browse facet, lists/reviews/members landings, Pro, Showdown, Year in Review as frames)
- `~/Git/Hoboware/letterboxd-research/screenshots-web/` + `notes-web/` - 96 signed-in Letterboxd, app and TV-app images (web)
- `~/Git/Hoboware/letterboxd-research/notes-auth/AUTHED-FEATURES.md` - signed-in feature inventory
- `research/trakt-inventory.md` - every route, feature and query in trakt-boxed today
- `research/trakt-api-map.md` - all 337 contract routes + off-contract v3 routes, used or not

Design canvas (mockups): https://claude.ai/artifact/6hxF9ouBogKi1sYkwPpJot, source in `designs/`. Build status: `LEDGER.md`.

---

## 1. The product in one paragraph

A dark, poster-first place to keep a diary of everything you watch, films and
TV alike. The spine is the **log**: one form that records a watch with a date,
a star rating, a like, a review and list additions. Every grid shows your
personal state on the poster itself (watched / watchlist / in progress). Shows
get what Letterboxd never had: rate and review seasons and episodes, a diary
that groups a binge into one entry, "up next" with one-tap check-off, and
spoiler-safe episode reviews.

## 2. Visual direction ("Night screening")

Borrow Letterboxd's page structure and interaction ideas, not its brand.
No green/orange/blue logo dots, no Graphik/Tiempos.

| Token | Value | Source |
|---|---|---|
| Page background | `--shade-950` oklch(13% 0.007 300) | existing Trakt palette |
| Raised surface / cards | `--shade-930` / `--shade-900` | existing |
| Hairlines | `--shade-800` | existing |
| Body text / muted | `--shade-10` / `--shade-300` | existing |
| Brand + primary buttons | `--purple-500` oklch(56% 0.205 314) | Trakt brand |
| Star fill | `--orange-400` family | existing orange palette |
| Watched outline + checks | `--green-500` | existing |
| Watchlist outline | `--blue-400` | existing |
| Like heart | `--red-400` | existing |
| Title face | Newsreader 600 (serif, Google Fonts) | new - film/show titles and big numbers only |
| UI face | Roboto (+ Tajawal for ar/fa) | existing |
| Codes (S02E04, runtimes) | Roboto Mono | existing |

Rules: colour means state, never decoration. Purple = brand and primary
action. Posters carry all other colour. RTL-safe logical properties throughout.

## 2a. Delight layer (signed off)

Baseline identity stays exactly as above. Three small additions, nothing else:

1. **Ambient colour (everywhere a title has a page).** Use the API's two poster colours (`MediaEntry.colors`, already mapped by `mapToColors`) for: a soft radial glow behind the hero (15-30% opacity), the poster's drop shadow, ratings histogram bars, the show progress ring/bar. Stars stay orange, watched/watchlist stay green/blue, primary buttons stay purple. Fallback to the default shade when colours are missing or too low-contrast against the page (min 3:1 for bars).
2. **Alive (home + show page + profile), within the 2b budget.** Friend faces (2-3 stacked avatars, "+N") on posters friends watched (home + title pages only); "Just watched" rail of friends' last few hours from the existing activity feed; pulsing live dot only on your own watching-now chip and the viewed profile; Up Next progress animates on mark-watched with an Undo. Motion max 2 keyframes, all behind `prefers-reduced-motion`.
3. **Binge pile + ticket stub (diary only).** Grouped TV diary entries render as a pile of 3 stills that fans out on expand; mobile diary cards use the ticket-stub divider. Desktop diary stays a dense table (Letterboxd users expect it); only the grouped TV row gets the pile.

Not adopted: film grain, card-stock poster bevels, per-title colour on buttons.

Canvas boards: Twist-A*, Twist-C*, Twist-B-mobile show the look.

## 2b. Performance budget (hard constraint, 2026-09-26)

User constraint: never lean on endpoints that aren't fast enough. Measured
2026-09-26 against api.trakt.tv, 3 calls each, public client id
(`research/api-timings-2026-09-26.txt`). Most endpoints: 150-300 ms. Outliers:

| Endpoint | First call | Rule |
|---|---|---|
| `comments/trending` | 5.2 s (500) then 9.6 s | Never on home or above the fold. Reviews page: viewport-gated, long TTL, skeleton; ask for a worker-side cache before launch |
| `comments/recent` | 3.8 s | Same as above |
| `{movie,show}/lists/popular` | 0.9 s | Below the fold only, viewport-gated (already is) |
| `{movie,show}/ratings` | 1.1 s cold | Histogram below the hero, viewport-gated; the hero shows the average from the summary |
| `movies/{id}/people` | fast, 180 KB | One fetch per page; never refetch for the tabs |
| `users/{id}/watching` | fast, 204 | Never once per friend |

Rules:
1. **No fan-out.** Never one request per poster, friend, episode or list item.
   Poster states come from the user collections the app already syncs once
   (watched, watchlist, ratings, favourites), as today.
2. **Alive layer uses data we already fetch.** "Right now" becomes **"Just
   watched"**: friends' activity from the last few hours, taken from the one
   `users/me/activities` page home already loads. The live pulse appears only
   for you (`userWatchingQuery('me')`, already polled for the now-watching
   toast) and for the profile you're viewing (one call). Friend faces on home
   posters come from the same feed. On a title page they come from the
   existing single `mediaSocialQuery`. No friend faces on browse grids.
3. **Ambient colour is free.** It comes from `colors` already in the summary
   response.
4. **Above the fold on title pages** = summary + user state only. Cast,
   ratings spread, sentiment, reviews, trivia, lists and related load as they
   scroll into view (existing viewport gating, see `performance.md`).
5. **Home above the fold** = up next + friends feed page 1. Everything else is
   viewport-gated.
6. **Diary** uses paged `users/{id}/history` (50 per page) and groups binge
   rows on the client. No per-episode lookups.
7. New pages list their requests in the PR description with measured timings.

## 2c. Zero layout shift (hard constraint, 2026-09-26)

User constraint: no content jumps on any page, from the first commit.

1. Every async region renders a skeleton with the **final dimensions** before
   data arrives: posters at locked 2:3, stills at 16:9, text lines with
   reserved line-heights, rows with fixed heights, avatars at fixed size.
2. Sections that may come back empty keep their slot until the query settles,
   then collapse only below the fold (or never, if above the fold: show an
   empty state of the same height).
3. Images always have `width`/`height` or `aspect-ratio`; fonts use metric-
   matched fallbacks (same approach as the existing Roboto / Tajawal fallback
   faces) so the Newsreader swap does not re-wrap.
4. Hero areas reserve backdrop and title height; ambient colour fades in with
   `opacity`, never by changing layout.
5. Verification: the screenshot harness records CLS per page (Layout
   Instability API, throttled network). Target CLS = 0.00, fail anything
   above 0.01. Numbers go in each wave's commit message.

## 3. Global chrome

- **Desktop top bar**: logo · Films · Shows · Lists · Members · Calendar ·
  search field · `+ Log` (purple) · avatar menu (Profile, Diary, Watching,
  Watchlist, Lists, Likes, Network, Stats, Settings, VIP, Sign out).
  Replaces today's side navbar.
- **Mobile**: slim top bar (logo, search, avatar) + bottom bar
  `Home · Browse · [+ Log] · Watching · Profile`. The centre button opens the
  log sheet with a search-first picker.
- **Poster tile** (every grid): 2:3 poster, outline = green watched / blue
  watchlist / hairline none. Shows add a thin progress bar along the bottom
  edge (episodes watched / aired). Hover (desktop) shows a bottom drawer:
  watched eye, like heart, watchlist clock, `...` (log, rate inline, add to
  list, where to watch). Long-press (touch) opens the same as a sheet.
- **Movie/show switch**: browse pages get a `Films | Shows | Both` segmented
  control, replacing today's global navbar toggle.

## 4. Every page

Legend. Status: **New** = page does not exist today; **Rebuild** = exists, new
layout; **Reskin** = keep layout, apply new tokens; **Redirect** = keep as a
redirect. LB = closest Letterboxd page. Mockup = artboard on the canvas.

### 4.1 Entry

| # | Proposed path | Today | Status | LB | What it shows | Mockup |
|---|---|---|---|---|---|---|
| 1 | `/` | `/` landing | Rebuild | homepage (signed out) | Backdrop hero, one-line pitch "Track films and TV. Keep a diary.", `Get started`; three pillars (Log / Lists / Shows done right); popular this week posters; popular reviews; import strip "Coming from Letterboxd or TV Time? Bring your history." | Landing |
| 2 | `/welcome` | `/welcome` | Rebuild | none | Onboarding: import (Letterboxd zip, TV Time, IMDb) first, then pick 4 favourite films + 4 favourite shows, follow suggestions | Onboarding |
| 3 | `/404`, errors | `+error` | Reskin | 404 | Poster-wall 404 | template |

### 4.2 Home and discovery

| # | Proposed path | Today | Status | LB | What it shows | Mockup |
|---|---|---|---|---|---|---|
| 4 | `/home` | `/home` | Rebuild | home (signed in) | "Welcome back, name. Here's what your friends have been watching." New from friends (poster + friend avatar + their stars) · **Up next** rail (episode stills, S02E04, one-tap check) · Start watching · Out this week (your shows + films) · Popular this week · Popular reviews from friends · streak chip | Home, Home-mobile |
| 5 | `/films` | `/discover?mode=movie` | Rebuild | /films | Landing: search box, filter bar, rows: popular this week, trending, anticipated, just released on your services, recommended for you, popular lists with films | Browse |
| 6 | `/shows` | `/discover?mode=show` | New | none | Same as films + "Premieres and finales this week", "Returning soon", networks strip | Browse (variant) |
| 7a | `/films/genre/[g]`, `/decade/[d]`, `/year/[y]`, `/country/[c]`, `/language/[l]`, `/network/[n]` (shows), `/studio/[s]` | none | New | /films/genre/horror, /studio/ | The same grid as 7, with the facet fixed in the URL and a plain-words banner: "There are 4,210 horror films. 312 are on your services." Uses the genres / countries / languages / networks reference APIs (unused today) | Browse-grid |
| 7 | `/films/[chart]`, `/shows/[chart]` (popular, trending, anticipated, recommended, watched, played, collected, boxoffice) | `/discover/*` | Rebuild | /films/popular | Full poster grid, filter bar: genre, decade, year, service, country, language, runtime, rating, certification, hide watched; sort; size toggle (poster / list) | Browse-grid |
| 8 | `/calendar` | `/calendar` + `/discover/releases` | Rebuild | none (Trakt only) | Week strip, day groups, episode type chips (premiere, finale, new season), "My shows / All" | Calendar |
| 9 | `/lists` | none (only `/lists/official`, `/lists/smart`) | New | /lists | Popular this week, trending lists, official lists, "lists with films you love" | Lists-browse |
| 10 | `/reviews` | none | New | /reviews/popular | Trending + recent reviews, film/show/season/episode filter, friends only toggle (API `comments/trending`, `comments/recent` - unused today) | Reviews-browse |
| 11 | `/members` | none | New (thin) | /members | Leaderboard (flagged API) + popular reviewers + people you may know. No "popular members" endpoint, so v1 is leaderboard-based | template |
| 12 | `/search` | `/search` | Rebuild | /search | One field, tabs All / Films / Shows / Episodes / People / Lists / Members; results as rows with poster + year + director/network | Search |

### 4.3 Films

| # | Proposed path | Today | Status | LB | What it shows | Mockup |
|---|---|---|---|---|---|---|
| 13 | `/movies/[slug]` | same | Rebuild | film page | Backdrop · poster (with your state + watch count) · serif title, year, director · tagline + overview · tabs Cast / Crew / Details / Genres / Releases · **action card** (Watched / Like / Watchlist, stars, Log or review, Add to lists, Where to watch, Share, Your activity) · ratings histogram (Trakt) + IMDb / RT / TMDB chips · friends who watched · **What people think** (AI sentiment pros/cons, VIP) · Popular reviews / Recent reviews (reactions, spoilers) · **Did you know** (3 trivia) · Soundtrack (VIP) · Extras (trailers) · Related + Similar · Popular lists | Film, Film-mobile |
| 14 | `/movies/[slug]/reviews` | Comments drawer | New route | film/reviews | Engagement tabs: Reviews · Members (watchers) · Likes · Lists · Friends; sort by popular / recent / rating; language filter | Facet |
| 15 | `/movies/[slug]/members` | Social drawer (friends) only | New route | film/members | Everyone who watched (API watching/watched users) with their stars | Facet |
| 16 | `/movies/[slug]/lists` | same | Rebuild | film/lists | Lists containing this film | Facet |
| 17 | `/movies/[slug]/cast` `/crew` `/details` `/releases` | drawers | Tabs in page | film tabs | In-page tabs, deep-linkable with `?tab=` | Film |
| 18 | `/movies/[slug]/trivia` `/soundtrack` `/videos` `/sentiment` `/where-to-watch` `/ratings` | drawers | Keep as drawers on mobile, side panel on desktop | none | Trakt-only extras | Film |
| 19 | `/movies/[slug]/related` | same | Reskin | film/similar | Grid | template |
| 20 | `/movies/[slug]/activity` | `/history/movies/[slug]` | Rebuild | "Show your activity" | Your plays of this film as diary rows (date, rating, rewatch, note), friends' activity below | template |

### 4.4 Shows (the difference)

| # | Proposed path | Today | Status | LB | What it shows | Mockup |
|---|---|---|---|---|---|---|
| 21 | `/shows/[slug]` | same | Rebuild | film page | Same frame as a film + status pill (Returning / Ended), network, years, **your progress ring** ("14 of 26 episodes, 9h left") + **Up next card** (S02E04 still, one-tap watched) · season strip (poster per season, avg stars, your progress bar) · season-by-season ratings chart · cast, sentiment, reviews (filter: show / season / episode), trivia, soundtrack, related, lists | Show, Show-mobile |
| 22 | `/shows/[slug]/seasons/[n]` | redirect to `?season=` | **New real page** | none (Serializd) | Season poster, "Season 2 · 2025 · 10 episodes", season stars (rate + review a season - API supports writing season ratings, client does not yet), ratings histogram, where to watch, season switcher `1 2 3 Specials`, tabs Episodes / Reviews / Friends / Lists / Cast; episode rows: still, S02E04, title, air date, runtime, community stars, your check + your stars | Season |
| 23 | `/shows/[slug]/seasons/[n]/episodes/[e]` | redirect to drawer (bots get a page) | **New real page** | none | Still as backdrop, show › season breadcrumb, S02E04 title, air date, runtime, episode type chip (premiere / finale), action card (watched / stars / log / list), episode ratings histogram, **episode-scoped reviews (spoiler-safe: only for people who watched)**, friends who watched, prev / next episode, guest cast | Episode, Episode-mobile |
| 24 | `/shows/[slug]/reviews` etc | drawers | New routes | film/reviews | Same engagement tabs as films + scope filter (show / season / episode) | Facet |
| 25 | `/shows/[slug]/activity` | `/history/shows/[slug]` | Rebuild | none | Your episode plays grouped by session | template |

### 4.5 People

| # | Proposed path | Today | Status | LB | What it shows | Mockup |
|---|---|---|---|---|---|---|
| 26 | `/people/[slug]` | same | Rebuild | /actor/ (a filtered poster grid with the bio in a side rail, not a biography page) | Headshot, name, known for, bio, born, links · role tabs (Acting / Directing / Writing / ...) · Films | Shows toggle · poster grid with your outlines · **"You've seen 34 of 87 (39%)" chip** · sort (popular, year, your rating) | Person |
| 27 | `/people/[slug]/movies` `/shows` `/history` | same | Merge into #26 with `?type=` | | | Person |

### 4.6 Your stuff (profile)

Profile tabs (one row, scrolls on mobile):
`Profile · Diary · Films · Shows · Watching · Reviews · Watchlist · Lists · Likes · Network · Stats`

| # | Proposed path | Today | Status | LB | What it shows | Mockup |
|---|---|---|---|---|---|---|
| 28 | `/profile/[slug]` | same | Rebuild | /user/ | Banner (cover image) · avatar, name, VIP chip, bio, location, links · stats row: Films · Shows · Episodes · This year · Lists · Following · Followers · Follow button / taste match pill · **Favourite films (4) + Favourite shows (4)** · **Currently watching** (live check-in + in-progress shows with progress) · recent activity (last 4 posters with stars) · recent reviews · ratings histogram · diary sidebar (this month) · streak heatmap · popular lists | Profile, Profile-mobile |
| 29 | `/profile/[slug]/diary` | `/history` (own only) + `/profile/[slug]/history` | Rebuild | /films/diary | Table: month ribbon · day · poster · title + year · stars · like · rewatch · review icon · edit. TV rows collapse a binge: "Severance · S2 E4-E6 · 3 episodes". Filters: year, films / shows, rated only. Mobile: card rows | Diary, Diary-mobile |
| 30 | `/profile/[slug]/films` | `/profile/[slug]/history` | Rebuild | /films | Every watched film as a poster grid with the user's stars underneath; sort + filters as browse | Watched-grid |
| 31 | `/profile/[slug]/shows` | none | New | none | Watched shows grid; badge per poster: completed / 14/26 / dropped | Watched-grid |
| 32 | `/profile/[slug]/watching` | `/users/me/progress` + `/profile/[slug]/progress` + `/users/me/start-watching` | Rebuild | none | Up next (episode stills, one-tap check, smart sort) · In progress · Start watching · Dropped · Completed | Watching |
| 33 | `/profile/[slug]/reviews` | none | New | /films/reviews | The user's reviews, newest first, with poster, stars, text, reactions | template (Review-page cards) |
| 34 | `/profile/[slug]/watchlist` | `/users/me/watchlist` (owner only) | Rebuild, public | /watchlist | "Name wants to see 212 films and 38 shows" + grid + sort + "on my services" filter | Watchlist |
| 35 | `/profile/[slug]/lists` | `/users/me/lists` + `/lists/view/*` | Rebuild | /lists | List cards (poster fan + title + count + likes) · tabs Personal / Collaborative / Smart / Liked | Profile-lists |
| 36 | `/profile/[slug]/likes` | favorites page + liked lists | Rebuild | /likes | Tabs Films / Shows / Lists / Reviews (liked comments) | template |
| 37 | `/profile/[slug]/network` | `/profile/[slug]/social` | Rebuild | /following | Following / Followers / Requests member rows (avatar, name, counts, follow button) | template |
| 38 | `/profile/[slug]/stats` | stats drawers + all-time YIR | New page | /stats (Pro) | Year switcher, big totals, weekly bars, genres, decades, countries map, top people, networks + studios, highest rated, list progress | Stats |
| 39 | `/profile/[slug]/year/[y]` + `/month/[y]/[m]` | `/users/[u]/year/[y]`, `/mir/*` | Reskin + share | Year in review | Keep existing YIR/MIR templates, move to the new tokens | YIR (template) |
| 40 | `/profile/[slug]/library` | `/users/me/library` | Reskin | none | Plex / collection | template |
| 41 | `/activity` | `/social/activity` + home ActivityList | Rebuild | activity | Friends / You tabs, event rows ("Ana watched Dune ★★★★ and liked it") | Activity |

### 4.7 Lists

| # | Proposed path | Today | Status | LB | What it shows | Mockup |
|---|---|---|---|---|---|---|
| 42 | `/lists/[user]/[list]` (+ `/lists/official/[list]`) | `/users/[u]/lists/[list]` | Rebuild | single list | Owner, title, essay-style description, tags-free meta, **your progress "You've watched 23 of 50"**, numbered grid (ranked) or plain grid, per-item notes (API supports, unused), like + likers, comments (list comments API unused) | List |
| 43 | `/lists/new`, `/lists/[user]/[list]/edit` | SaveListDrawer + ListReorderDrawer | New page | list editor | Full page: name, description, privacy, ranked toggle, sort, add films/shows/seasons/episodes search, drag reorder, per-item note | List-editor |
| 44 | `/lists/smart/*` | same | Reskin | none | Smart list builder (filters) | template |

### 4.8 Reviews and comments

| # | Proposed path | Today | Status | LB | What it shows | Mockup |
|---|---|---|---|---|---|---|
| 45 | `/reviews/[id]` | `/comments/[id]` redirects into a drawer | **New real page** | review page | Poster, "Review by Ana ★★★★ ♥", watched date, text (spoiler gate), reactions, replies thread, "More reviews of Dune" | Review-page |

### 4.9 Logging (modal / sheet, not a route)

| # | Surface | Today | Status | LB | What it does | Mockup |
|---|---|---|---|---|---|---|
| 46 | Log composer - film | MarkAsWatched drawer + RateNow + comment drawer + lists drawer (4 separate UIs) | **New, merges 4** | log modal | "I watched..." poster + title · date (today / release / other / unknown) or **Check in now** · "Watched before" (auto-ticked from play history) · review text + spoiler flag · stars · like · add to lists · private note · Save | Log-film |
| 47 | Log composer - episodes | mark watched / watch-until | **New** | none | Pick show → season → episodes (range select "E4 to E6"), date, one set of stars for each episode or the batch, episode review | Log-episode |
| 48 | Log sheet - mobile | drawers | New | app log sheet | Search-first picker then the same form as a sheet | Log-mobile |

### 4.10 Settings, VIP, static

| # | Proposed path | Today | Status | LB | What it shows | Mockup |
|---|---|---|---|---|---|---|
| 49 | `/settings` (+ `/profile` tab) | `/settings`, `/settings/account` | Rebuild | settings/profile | Left rail: Profile · Account · Import & export · Streaming · Plex · Connected apps · Advanced · Preview. Profile tab gets **favourite films + shows pickers** (reorder favourites API), banner, bio | Settings |
| 50 | `/settings/data` | same | Rebuild | settings/import | Import cards with **Letterboxd first**, TV Time, IMDb, Trakt; export | Settings (Import tab) |
| 51 | `/settings/general` `/account` `/apps/connected` `/streaming-services` `/streaming-services/[id]` `/plex` `/advanced` `/preview` | same | Reskin | settings | Same controls, new tokens and left rail | template |
| 52 | `/vip`, `/vip/renew` | same | Reskin | /pro | Plan cards + feature grid | template |
| 53 | `/about`, `/branding`, `/privacy`, `/terms`, `/faq/tv-time` | same | Reskin | /about, legal | Long-form template | template |
| 54 | `/callback`, `/silent-redirect`, `/callback/streaming`, `/api/*`, `/sitemap*`, `/robots.txt` | same | No UI | | Keep | - |
| 55 | Old redirect paths `/movies`, `/shows/*` charts, `/media/*`, `/users/[u]`, `/users/[u]/yir`, `/users/[u]/mir` | redirects | Redirect to new paths | | Keep every old URL working | - |

Letterboxd film tabs **Fans** (tables of who favourited) and **Ratings** (wall of avatars grouped by star value) have no Trakt endpoint for "who rated / favourited this"; Members (watchers) and Friends cover the same need.

Letterboxd pages with **no equivalent** (decided, not missed): Journal
(editorial, no content source), themes / nanogenres (no data source), Tags (no API; lists cover it), Showdown,
HQ pages, Video Store, notifications (no API - see decisions).

## 5. Trakt features: where each one lives

Nothing below is dropped. Page numbers refer to section 4.

| Trakt feature | Lives on |
|---|---|
| Up next / continue watching (+ smart sort) | Home rail (4), Watching (32), Show up-next card (21) |
| Per-episode progress, watched until here, specials | Season page (22), Log-episode (47), poster progress bar |
| Start watching | Home (4), Watching (32) |
| Drop show / dropped list | Show action menu (21), Watching tab (32) |
| Rewatching (flag) | Show action card (21), Watching (32) |
| Check-in / watching now toast | Log composer "Check in now" (46), profile "Currently watching" (28), top-bar live pill |
| Mark watched options (now / release / other / unknown) | Log composer date field (46) |
| Ratings 1-10 as half stars, popcorn at 10, rotten tomato at 1-2 | Every star widget; keep the delight |
| Ratings histogram + per-season chart | Film (13), Show (21), Season (22), Episode (23) |
| External ratings: IMDb, RT critic + audience, MAL, TMDB, Letterboxd | Film / Show ratings block |
| AI sentiment pros/cons (VIP) | "What people think" section (13, 21), upsell for free |
| Trivia (VIP full, 3 free) | "Did you know" (13, 21) |
| Soundtrack (flag, VIP) | Film / Show section |
| Post-credits scenes | Poster chip + Details tab |
| Parental guide (flag) | Details tab |
| YouTube specials (flag) | Where to watch |
| Where to watch + favourite services + country | Action card, poster menu, browse filter "on my services" |
| Plex library, Younify streaming sync | Where to watch, Library (40), Settings (51) |
| Comments: reactions, replies, spoilers, GIFs, language filter, report | Review cards everywhere, Review page (45) |
| Reviewer stats (flag) | Review cards |
| Favorites (unlimited) | Likes tab (36); top 4 on profile (28) |
| Watchlist (+ reorder) | Watchlist (34) |
| Personal, collaborative, liked, official, smart lists | Lists (35, 42, 44, 9) |
| Private notes | Log composer note field, diary row, film "Your activity" (20) |
| Hidden items | Settings > Advanced + poster `...` "Hide" |
| Stats, streaks + heatmap | Stats (38), profile heatmap (28), home streak chip (4) |
| Year in review / month in review | 39, linked from Stats + profile |
| Leaderboard (flag), taste match | Members (11), profile pill (28) |
| Social follow, requests, block, private profiles | Profile (28), Network (37) |
| Social activity feed | Activity (41), Home (4) |
| Friends on a title (social drawer) | "Friends who watched" row (13, 21, 23) |
| Recommendations | Films / Shows landing (5, 6), Home |
| Anticipated, trending, popular, releases, seasonal themes | Browse (5-8) |
| Global filters (genre, decade, runtime, country, certification, streaming) | Browse filter bar (7) |
| Imports (TV Time 5 formats, Letterboxd, IMDb, Trakt) + exports (VIP) | Onboarding (2), Settings > Import (50) |
| VIP checkout + upsells | VIP (52) + inline upsell cards |
| Settings: spoilers, multiple plays, rating prompt, genres, theme, language, cover image, blocked users | Settings (49, 51) |
| Connected apps, API apps link | Settings (51) |
| Preview features (flags) | Settings > Preview (51) |
| Halloween / Christmas themes | Keep; recolour purple only |
| Share cards (OG images) | Film, Show, Episode, Profile, List, YIR |
| 28 locales, 2 RTL | All pages |

New capabilities from unused API routes: list likes + comments + reactions,
trending / recent reviews, popular + trending lists, season rating writes,
per-play notes, list item notes, favourites reorder (top 4), box office /
played / watched charts, friends' recommendations, release dates per country.

## 6. How shows fit the Letterboxd model

| Letterboxd idea | Film | Show | Season | Episode |
|---|---|---|---|---|
| Page | yes | yes | **yes (new)** | **yes (new)** |
| Log a watch (dated) | play | via episodes | "mark season" = batch of episode plays | play |
| Star rating | yes | yes | yes (new write) | yes |
| Like | favourite | favourite | - | - |
| Review | comment | comment | comment | comment (spoiler-safe) |
| Diary row | one row | - | - | rows grouped into one binge entry per show per day |
| Poster state | outline | outline + progress bar | progress bar | check |
| Four favourites | 4 films | 4 shows | - | - |

Diary grouping rule: episode plays of the same show on the same calendar day
collapse into one diary entry ("S2 E4-E6"), expandable.

## 7. Decisions (all accepted as recommended, 2026-09-26)

| # | Decision | Recommendation |
|---|---|---|
| D1 | Season and episode become real pages (today: drawers + redirects) | Yes. This is the TV advantage and it's great for SEO |
| D2 | Title extras (reviews, members, lists) become sub-routes | Yes for the engagement tabs; trivia / soundtrack / sentiment / where-to-watch stay as drawers (mobile) or a side panel (desktop) |
| D3 | Brand colour | Trakt purple for brand + primary; green / blue / red only for watched / watchlist / like states |
| D4 | What "like" means | Like = Trakt favourite. Top 4 favourites per type = profile shelf (favourites reorder API) |
| D5 | Review attached to a watch | Public review = comment on the title. Short private text = note on the play (500 chars). Diary shows the review icon when the user has a comment on that title |
| D6 | Rewatch flag | Derived from play order; "Watched before" is ticked automatically when earlier plays exist |
| D7 | Tags | Skip (no API). Point people to lists |
| D8 | Watchlist on other people's profiles | Make it public (respecting private profiles) |
| D9 | Notifications bell | Skip in v1 (no API). Revisit with trakt-workers |
| D10 | Members directory | Leaderboard-based until an API exists |
| D11 | Navigation | Top bar on desktop (drop side navbar); bottom bar with centre Log on mobile |
| D12 | Serif for titles | Newsreader for titles and big numbers only; Roboto stays for UI |

## 8. Build order

Architecture (decided 2026-09-26, user suggestion): the new UI lives in a new
project `projects/boxed`, like trakt-time. Its `$lib` alias points at
`projects/client/src/lib`, so requests, feature state, stores, utils, models
and i18n are reused as-is and keep receiving trakt-web upstream fixes. New
routes, sections and components live under `projects/boxed/src`. The old
client keeps running for comparison until boxed reaches parity, then it stops
being deployed.


Waves, one commit per verified wave (see project memory):

1. Tokens + chrome: colours, Newsreader, top bar, mobile bar, poster tile with 3 states + progress bar + hover drawer.
2. Log composer (film, episodes, mobile sheet). Everything else depends on it.
3. Film page + engagement sub-routes.
4. Show, season, episode pages.
5. Home + browse (films, shows, charts, calendar, search).
6. Profile + diary + films / shows grids + watching + watchlist.
7. Lists (browse, single, editor) + review page + reviews browse.
8. Activity, network, likes, stats, YIR reskin.
9. Settings, onboarding, VIP, static, 404.
10. Rigor pass: skeletons, empty states, RTL, a11y, 28 locales.
