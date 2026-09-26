# Trakt API map (for the trakt-boxed redesign)

Generated 2026-09-26. Read-only research; no repo was modified.

## Sources

1. **Typed contract** - `@trakt/api` 0.6.0 (JSR, ts-rest + zod). This is the version pinned in
   `projects/client/package.json` (`npm:@jsr/trakt__api@0.6.0`). Note: the local
   `trakt-boxed/node_modules` still has a stale 0.4.14 install; 0.6.0 was read from the deno cache and
   is byte-identical to `Trakt/trakt-api` HEAD (`3008be5c`, 2026-09-23). Every route was enumerated by
   walking the live `traktContract` object: **337 routes** (includes a few duplicate path aliases such
   as `users.watched.movies` vs `users.watched.minimal.movies`).
2. **Public docs** - `docs.trakt.tv` (new, 2026) is generated from the same contract: its reference
   index (`docs.trakt.tv/reference/llms.txt`) lists exactly the contract's endpoint titles, nothing more.
   The legacy Apiary blueprint (`trakt.docs.apiary.io`, now marked deprecated) has 222 actions, all of
   which are a subset of the contract. The Apiary prose is still the best source for semantics (notes
   `attached_to`, comment rules, `watched_at: released|unknown`), quoted in the Diary section.
3. **Off-contract endpoints** - the `trakt-workers` v2 edge worker (`src/v2/index.ts`) implements a
   `/v3/*` family plus several v2 routes not in the contract (`/users/:id/leaderboard`,
   `/movies/:id/social`, `/media/recommendations`, `/people/this_month`, ...). Anything not matched
   there is proxied (`ALL '*'`) to the Rails API.
4. **Client usage** - `projects/client/src` grepped for every `api()/unauthorizedApi()` call chain
   (incl. dynamic `[method]` access and `const client = api()`), every `rawApiFetch` path, and the
   raw-export endpoint list in `lib/sections/settings/export/`.

### "Used by client?" legend

- `yes` - called through the typed SDK.
- `yes (raw fetch)` - called via `rawApiFetch` with a literal path (not the SDK).
- `yes (oidc-client-ts)` - hit by the OIDC library during sign-in, not by app code.
- `export only` - only touched by the "raw data export" in settings; no UI surfaces it.
- `no` - never called.

Totals over the 337 contract routes: **200 used**, **10 export-only**, **127 unused**.

## Contract endpoints by domain

### oauth

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/oauth/authorize` | Authorize Application (`oauth.authorize`) | yes (oidc-client-ts) | sign in |
| POST | `/oauth/device/code` | Generate new device codes (`oauth.device.code`) | no | sign in |
| POST | `/oauth/device/token` | Poll for the access_token (`oauth.device.token`) | no | sign in |
| POST | `/oauth/token` | Exchange a token (`oauth.token`) | yes (oidc-client-ts) | sign in |
| POST | `/oauth/revoke` | Revoke an access_token (`oauth.revoke`) | yes (oidc-client-ts) | sign in |

### calendars

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/calendars/:target/shows/:start_date/:days` | Get shows (`calendars.shows`) | yes | none - Trakt only (release calendar) |
| GET | `/calendars/:target/shows/new/:start_date/:days` | Get new shows (`calendars.newShows`) | no | none - Trakt only (release calendar) |
| GET | `/calendars/:target/shows/premieres/:start_date/:days` | Get season premieres (`calendars.seasonPremieres`) | no | none - Trakt only (release calendar) |
| GET | `/calendars/:target/shows/finales/:start_date/:days` | Get finales (`calendars.finales`) | no | none - Trakt only (release calendar) |
| GET | `/calendars/:target/movies/:start_date/:days` | Get movies (`calendars.movies`) | yes | none - Trakt only (release calendar) |
| GET | `/calendars/:target/streaming/:start_date/:days` | Get streaming releases (`calendars.streaming`) | no | none - Trakt only (release calendar) |
| GET | `/calendars/:target/dvd/:start_date/:days` | Get DVD releases (`calendars.dvdReleases`) | no | none - Trakt only (release calendar) |
| GET | `/calendars/:target/media/:start_date/:days` | Get media (`calendars.media`) | yes | none - Trakt only (release calendar) |
| GET | `/calendars/releases/hot/:start_date/:days` | Get hot releases (`calendars.releasesHot`) | yes | none - Trakt only (curated release calendar) |
| GET | `/calendars/releases/hot/premieres/:start_date/:days` | Get hot premieres (`calendars.releasesHotPremieres`) | no | none - Trakt only (curated release calendar) |
| GET | `/calendars/releases/hot/finales/:start_date/:days` | Get hot finales (`calendars.releasesHotFinales`) | no | none - Trakt only (curated release calendar) |
| GET | `/calendars/releases/hot/new/:start_date/:days` | Get hot new shows (`calendars.releasesHotNew`) | no | none - Trakt only (curated release calendar) |

### checkin

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| POST | `/checkin` | Check into an item (`checkin.start`) | yes | none - Trakt only ("watching now") |
| DELETE | `/checkin` | Delete any active checkins (`checkin.delete`) | yes | none - Trakt only ("watching now") |

### users

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/users/settings` | Retrieve settings (`users.settings`) | yes | settings / profile edit |
| GET | `/users/reactions/comments` | Get comment reactions (`users.reactions.comments`) | yes | likes on reviews (your reactions) |
| GET | `/users/:id/likes/:type` | Get likes (`users.likes`) | yes | likes tab (liked reviews / lists) |
| PUT | `/users/avatar` | Update avatar (`users.avatar`) | yes | settings / profile edit |
| PUT | `/users/set_cover` | Update cover image (`users.cover`) | yes | settings / profile edit |
| PUT | `/users/settings` | Update settings (`users.saveSettings`) | yes | settings / profile edit |
| GET | `/users/blocked` | Get blocked users (`users.blocked`) | yes | block |
| GET | `/users/:id/` | Get user profile (`users.profile`) | yes | profile |
| GET | `/users/:id/:type/activities` | Get social activity (`users.activities`) | yes | activity feed (friends) |
| GET | `/users/:id/stats` | Get stats (`users.stats`) | yes (raw fetch) | stats |
| GET | `/users/:id/comments/:comment_type/:type` | Get comments (`users.comments`) | yes | reviews tab |
| GET | `/users/:id/collection/:type` | Get collection (`users.collection`) | export only | none - Trakt only (owned media) |
| GET | `/users/:id/notes/:type` | Get notes (`users.notes`) | export only | diary entry text / private notes |
| GET | `/users/:id/watching` | Get watching (`users.watching`) | yes | none - Trakt only |
| POST | `/users/:id/follow` | Follow this user (`users.follow`) | yes | follow / network |
| DELETE | `/users/:id/follow` | Unfollow this user (`users.unfollow`) | yes | follow / network |
| POST | `/users/:id/block` | Block this user (`users.block`) | yes | block |
| DELETE | `/users/:id/block` | Unblock this user (`users.unblock`) | yes | block |
| POST | `/users/:id/report` | Report a user (`users.report`) | yes | report |
| GET | `/users/:id/followers` | Get followers (`users.followers`) | yes | follow / network |
| GET | `/users/:id/following` | Get following (`users.following`) | yes | follow / network |
| GET | `/users/:id/friends` | Get friends (`users.friends`) | export only | follow / network |
| GET | `/users/:id/mir/:year/:month` | Get month in review (`users.month_in_review`) | yes | year in review |
| GET | `/users/:id/yir/:year` | Get year in review (`users.year_in_review`) | yes | year in review |

### users.syncs

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/users/syncs/` | Get data syncs (`users.syncs.list`) | no | import (Letterboxd has CSV import only) |
| GET | `/users/syncs/:type` | Get data syncs by type (`users.syncs.listByType`) | yes | import (Letterboxd has CSV import only) |
| GET | `/users/syncs/:id` | Get a data sync (`users.syncs.details`) | yes | import (Letterboxd has CSV import only) |
| GET | `/users/syncs/:id/paused` | Get paused sync items (`users.syncs.paused`) | yes | import (Letterboxd has CSV import only) |
| GET | `/users/syncs/:id/skipped` | Get skipped sync items (`users.syncs.skipped`) | yes | import (Letterboxd has CSV import only) |
| DELETE | `/users/syncs/:id` | Undo a data sync (`users.syncs.undo`) | yes | import (Letterboxd has CSV import only) |

### users.plex

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/users/settings/plex/` | Get Plex settings (`users.plex.settings`) | yes | import (Letterboxd has CSV import only) |
| PUT | `/users/settings/plex/` | Update Plex settings (`users.plex.updateSettings`) | yes | import (Letterboxd has CSV import only) |
| POST | `/users/settings/plex/connect` | Connect Plex (`users.plex.connect`) | yes | import (Letterboxd has CSV import only) |
| DELETE | `/users/settings/plex/connect` | Disconnect Plex (`users.plex.disconnect`) | yes | import (Letterboxd has CSV import only) |
| GET | `/users/settings/plex/servers` | Get Plex servers (`users.plex.servers`) | yes | import (Letterboxd has CSV import only) |
| GET | `/users/settings/plex/servers/:server_id` | Get Plex server accounts and libraries (`users.plex.serverAccounts`) | yes | import (Letterboxd has CSV import only) |
| POST | `/users/settings/plex/sync` | Sync Plex now (`users.plex.sync`) | yes | import (Letterboxd has CSV import only) |

### users.watched

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/users/:id/watched/movies` | users.watched.movies (`users.watched.movies`) | export only | films (watched grid) |
| GET | `/users/:id/watched/shows` | users.watched.shows (`users.watched.shows`) | export only | films (watched grid) |
| GET | `/users/:id/watched/:type` | Get watched (`users.watched.typed`) | export only | films (watched grid) |
| GET | `/users/:id/watched/movies` | Get watched movies (`users.watched.minimal.movies`) | yes | films (watched grid) |
| GET | `/users/:id/watched/shows` | Get watched shows (`users.watched.minimal.shows`) | yes | films (watched grid) |

### users.history

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/users/:id/history/` | Get watched history (`users.history.all`) | yes | diary |
| GET | `/users/:id/history/movies` | Get movie watched history (`users.history.movies`) | yes | diary |
| GET | `/users/:id/history/shows` | Get show watched history (`users.history.shows`) | yes | diary |
| GET | `/users/:id/history/episodes` | Get episode watched history (`users.history.episodes`) | yes | diary |
| GET | `/users/:id/history/movies/:item_id` | Get history for a movie (`users.history.movie`) | yes | diary |
| GET | `/users/:id/history/shows/:item_id` | Get history for a show (`users.history.show`) | yes | diary |
| GET | `/users/:id/history/episodes/:item_id` | Get history for an episode (`users.history.episode`) | yes | diary |
| GET | `/users/:id/history/:type/:item_id` | Get watched history (`users.history.typedItem`) | no | diary |

### users.watchlist

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/users/:id/watchlist/movies/:sort` | Get movie watchlist (`users.watchlist.movies`) | yes | watchlist |
| GET | `/users/:id/watchlist/shows/:sort` | Get show watchlist (`users.watchlist.shows`) | yes | watchlist |
| GET | `/users/:id/watchlist/movie,show/:sort` | Get media watchlist (`users.watchlist.all`) | yes | watchlist |
| GET | `/users/:id/watchlist/:type/:sort_by/:sort_how` | Get watchlist (`users.watchlist.typedSorted`) | no | watchlist |
| GET | `/users/:id/watchlist/comments/:sort` | Get all watchlist comments (`users.watchlist.comments`) | no | watchlist |

### users.ratings

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/users/:id/ratings/movies` | Get movie ratings (`users.ratings.movies`) | yes | rating |
| GET | `/users/:id/ratings/shows` | Get show ratings (`users.ratings.shows`) | yes | rating |
| GET | `/users/:id/ratings/episodes` | Get episode ratings (`users.ratings.episodes`) | yes | rating |
| GET | `/users/:id/ratings/` | Get all ratings (`users.ratings.all`) | yes | rating |
| GET | `/users/:id/ratings/:type/:rating` | Get ratings (`users.ratings.typedRating`) | yes (raw fetch) | rating |

### users.favorites

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/users/:id/favorites/media/:sort` | Get favorite media (`users.favorites.media`) | yes | like (heart) / favourite films |
| GET | `/users/:id/favorites/movies/:sort` | Get favorite movies (`users.favorites.movies`) | yes | like (heart) / favourite films |
| GET | `/users/:id/favorites/shows/:sort` | Get favorite shows (`users.favorites.shows`) | yes | like (heart) / favourite films |
| GET | `/users/:id/favorites/:type/:sort_by/:sort_how` | Get favorites (`users.favorites.typedSorted`) | export only | like (heart) / favourite films |
| GET | `/users/:id/favorites/comments/:sort` | Get all favorites comments (`users.favorites.comments`) | no | like (heart) / favourite films |

### users.lists

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/users/:id/lists` | Get a user's personal lists (`users.lists.personal`) | yes | list |
| GET | `/users/:id/lists/collaborations` | Get all lists a user can collaborate on (`users.lists.collaborations`) | yes | list |
| POST | `/users/:id/lists/reorder` | Reorder a user's lists (`users.lists.reorder`) | yes (raw fetch) | list |
| POST | `/users/:id/lists` | Create personal list (`users.lists.create`) | yes | list |
| GET | `/users/:id/lists/:list_id/` | Get personal list (`users.lists.list.summary`) | yes | list |
| PUT | `/users/:id/lists/:list_id/` | Update personal list (`users.lists.list.update`) | yes | list |
| DELETE | `/users/:id/lists/:list_id/` | Delete a user's personal list (`users.lists.list.delete`) | yes | list |
| GET | `/users/:id/lists/:list_id/items/movie` | Get movie list items (`users.lists.list.items.movie`) | yes | list |
| GET | `/users/:id/lists/:list_id/items/show` | Get show list items (`users.lists.list.items.show`) | yes | list |
| GET | `/users/:id/lists/:list_id/items/movie,show` | Get media list items (`users.lists.list.items.media`) | no | list |
| GET | `/users/:id/lists/:list_id/items/movie,show,season,episode` | Get all list items (`users.lists.list.items.all`) | yes | list |
| GET | `/users/:id/lists/:list_id/items/:type/:sort_by/:sort_how` | Get items on a personal list (`users.lists.list.items.typedSorted`) | no | list |
| POST | `/users/:id/lists/:list_id/items` | Add items to personal list (`users.lists.list.add`) | yes | list |
| POST | `/users/:id/lists/:list_id/items/remove` | Remove items from personal list (`users.lists.list.remove`) | yes | list |
| POST | `/users/:id/lists/:list_id/reorder` | Reorder items on a list (`users.lists.list.reorder`) | no | list |
| POST | `/users/:id/lists/:list_id/items/reorder` | Reorder items on a list (`users.lists.list.reorderItems`) | yes (raw fetch) | list |
| PUT | `/users/:id/lists/:list_id/items/:list_item_id` | Update a list item (`users.lists.list.updateItem`) | no | list |
| GET | `/users/:id/lists/:list_id/likes` | Get all users who liked a list (`users.lists.list.likes`) | no | list like |
| POST | `/users/:id/lists/:list_id/like` | Like a list (`users.lists.list.like`) | no | list like |
| DELETE | `/users/:id/lists/:list_id/like` | Remove like on a list (`users.lists.list.unlike`) | no | list like |
| GET | `/users/:id/lists/:list_id/comments/:sort` | Get all list comments (`users.lists.list.comments`) | no | list comments |
| POST | `/users/:id/lists/:list_id/report` | Report a user's list (`users.lists.list.report`) | no | report |

### users.smartLists

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/users/:id/smart-lists` | Get a user's smart lists (`users.smartLists.personal`) | yes | none - Trakt only (rule-based lists) |
| POST | `/users/:id/smart-lists` | Create smart list (`users.smartLists.create`) | yes | none - Trakt only (rule-based lists) |
| GET | `/users/:id/smart-lists/:list_id/` | Get smart list (`users.smartLists.smartList.summary`) | yes | none - Trakt only (rule-based lists) |
| PUT | `/users/:id/smart-lists/:list_id/` | Update smart list (`users.smartLists.smartList.update`) | no | none - Trakt only (rule-based lists) |
| DELETE | `/users/:id/smart-lists/:list_id/` | Delete a user's smart list (`users.smartLists.smartList.delete`) | yes | none - Trakt only (rule-based lists) |

### users.hidden

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| POST | `/users/hidden/:section` | Add hidden items (`users.hidden.add`) | yes | none - Trakt only (hide from progress/recs) |
| GET | `/users/hidden/progress_watched` | Get hidden progress items (`users.hidden.get`) | yes | none - Trakt only (hide from progress/recs) |
| GET | `/users/hidden/:section` | Get hidden items (`users.hidden.getBySection`) | yes (raw fetch) | none - Trakt only (hide from progress/recs) |
| GET | `/users/hidden/dropped` | Get dropped shows (`users.hidden.dropped`) | yes | none - Trakt only (dropped shows) |
| POST | `/users/hidden/progress_watched/remove` | Remove hidden progress items (`users.hidden.remove.progress`) | yes | none - Trakt only (hide from progress/recs) |
| POST | `/users/hidden/calendar/remove` | Remove hidden calendar items (`users.hidden.remove.calendar`) | yes | none - Trakt only (hide from progress/recs) |
| POST | `/users/hidden/:section/remove` | Remove hidden items (`users.hidden.remove.section`) | no | none - Trakt only (hide from progress/recs) |

### users.requests

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/users/requests/` | Get follow requests (`users.requests.follow`) | yes | follow / network |
| GET | `/users/requests/following` | Get pending following requests (`users.requests.following`) | yes | follow / network |
| POST | `/users/requests/:id` | Approve follow request (`users.requests.approve`) | yes | follow / network |
| DELETE | `/users/requests/:id` | Deny follow request (`users.requests.deny`) | yes | follow / network |

### users.filters

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/users/saved_filters/:section` | Get saved filters (`users.filters.saved`) | export only | saved filters |
| POST | `/users/saved_filters` | Add saved filters (`users.filters.add`) | no | saved filters |
| DELETE | `/users/saved_filters/:id` | Delete saved filter (`users.filters.delete`) | no | saved filters |

### sync

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/sync/last_activities` | Get last activity (`sync.lastActivities`) | export only | none - sync plumbing |
| GET | `/sync/watched/:type` | Get watched (`sync.watched`) | no | films (watched grid) |

### sync.history

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/sync/history/:type/:id` | Get watched history (`sync.history.get`) | no | diary |
| POST | `/sync/history` | Add items to watched history (`sync.history.add`) | yes | diary |
| POST | `/sync/history/remove` | Remove items from history (`sync.history.remove`) | yes | diary |

### sync.progress

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/sync/progress/up_next` | Get up next (`sync.progress.upNext.standard`) | no | none - Trakt only (TV progress) |
| GET | `/sync/progress/up_next_nitro` | Get up next nitro (`sync.progress.upNext.nitro`) | yes | none - Trakt only (TV progress) |
| GET | `/sync/playback/movies` | Get movie playback progress (`sync.progress.movies`) | yes | none - Trakt only (resume playback) |
| GET | `/sync/playback/episodes` | Get episode playback progress (`sync.progress.episodes`) | no | none - Trakt only (resume playback) |
| GET | `/sync/playback` | Get playback progress (`sync.progress.playback`) | export only | none - Trakt only (resume playback) |
| DELETE | `/sync/playback/:id` | Remove a playback item (`sync.progress.drop.movie`) | yes | none - Trakt only (resume playback) |
| GET | `/sync/progress/watched` | Get watched progress (`sync.progress.watched`) | no | none - Trakt only (TV progress) |

### sync.watchlist

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/sync/watchlist/:type/:sort_by/:sort_how` | Get watchlist (`sync.watchlist.get`) | no | watchlist |
| PUT | `/sync/watchlist` | Update watchlist (`sync.watchlist.update`) | no | watchlist |
| POST | `/sync/watchlist` | Add items to watchlist (`sync.watchlist.add`) | yes | watchlist |
| POST | `/sync/watchlist/remove` | Remove items from watchlist (`sync.watchlist.remove`) | yes | watchlist |
| POST | `/sync/watchlist/reorder` | Reorder watchlist items (`sync.watchlist.reorder`) | yes (raw fetch) | watchlist |
| PUT | `/sync/watchlist/:list_item_id` | Update a watchlist item (`sync.watchlist.updateItem`) | no | watchlist |

### sync.ratings

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/sync/ratings/:type/:rating` | Get ratings (`sync.ratings.get`) | no | rating |
| POST | `/sync/ratings` | Add new ratings (`sync.ratings.add`) | yes | rating |
| POST | `/sync/ratings/remove` | Remove ratings (`sync.ratings.remove`) | yes | rating |

### sync.favorites

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/sync/favorites/:type/:sort_by/:sort_how` | Get favorites (`sync.favorites.get`) | no | like (heart) / favourite films |
| PUT | `/sync/favorites` | Update favorites (`sync.favorites.update`) | no | like (heart) / favourite films |
| POST | `/sync/favorites` | Add items to favorites (`sync.favorites.add`) | yes | like (heart) / favourite films |
| POST | `/sync/favorites/remove` | Remove items from favorites (`sync.favorites.remove`) | yes | like (heart) / favourite films |
| POST | `/sync/favorites/reorder` | Reorder favorited items (`sync.favorites.reorder`) | no | like (heart) / favourite films |
| PUT | `/sync/favorites/:list_item_id` | Update a favorite item (`sync.favorites.updateItem`) | no | like (heart) / favourite films |

### sync.collection

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/sync/collection/:type` | Get collection (`sync.collection.all`) | no | none - Trakt only (owned media) |
| GET | `/sync/collection/movies` | Get movie collection (`sync.collection.movies`) | yes | none - Trakt only (owned media) |
| GET | `/sync/collection/shows` | Get show collection (`sync.collection.shows`) | no | none - Trakt only (owned media) |
| GET | `/sync/collection/episodes` | Get episode collection (`sync.collection.episodes`) | yes | none - Trakt only (owned media) |
| GET | `/sync/collection/media` | Get media collection (`sync.collection.media`) | yes | none - Trakt only (owned media) |
| POST | `/sync/collection` | Add items to collection (`sync.collection.add`) | no | none - Trakt only (owned media) |
| POST | `/sync/collection/remove` | Remove items from collection (`sync.collection.remove`) | yes (raw fetch) | none - Trakt only (owned media) |
| GET | `/sync/collection/minimal/movies` | Get minimal movie collection (`sync.collection.minimal.movies`) | yes (raw fetch) | none - Trakt only (owned media) |
| GET | `/sync/collection/minimal/shows` | Get minimal show collection (`sync.collection.minimal.shows`) | yes (raw fetch) | none - Trakt only (owned media) |
| GET | `/sync/collection/minimal/episodes` | Get minimal episode collection (`sync.collection.minimal.episodes`) | yes (raw fetch) | none - Trakt only (owned media) |

### recommendations

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/recommendations/movies/` | Get movie recommendations (`recommendations.movies.recommend`) | no | none (Letterboxd has no personal recs) |
| DELETE | `/recommendations/movies/:id` | Hide a movie recommendation (`recommendations.movies.hide`) | yes | none (Letterboxd has no personal recs) |
| GET | `/recommendations/shows/` | Get show recommendations (`recommendations.shows.recommend`) | no | none (Letterboxd has no personal recs) |
| DELETE | `/recommendations/shows/:id` | Hide a show recommendation (`recommendations.shows.hide`) | yes | none (Letterboxd has no personal recs) |

### social_recommendations

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/social_recommendations/movies/` | Get social movie recommendations (`social_recommendations.movies.recommend`) | no | none (Letterboxd has no personal recs) |
| GET | `/social_recommendations/shows/` | Get social show recommendations (`social_recommendations.shows.recommend`) | no | none (Letterboxd has no personal recs) |

### media

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/media/trending` | Get trending media (`media.trending`) | yes | popular / browse |
| GET | `/media/anticipated` | Get anticipated media (`media.anticipated`) | yes | popular / browse |
| GET | `/media/popular` | Get popular media (`media.popular`) | yes | popular / browse |

### movies

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/movies/:id` | Get a movie (`movies.summary`) | yes | film page |
| GET | `/movies/:id/ratings` | Get movie ratings (`movies.ratings`) | yes | ratings histogram |
| GET | `/movies/:id/stats` | Get movie stats (`movies.stats`) | yes | film stats (watched by / liked by) |
| GET | `/movies/:id/aliases` | Get all movie aliases (`movies.aliases`) | no | film page (details / cast / crew) |
| GET | `/movies/:id/releases/:country` | Get all movie releases (`movies.releases`) | no | film page (details / cast / crew) |
| GET | `/movies/:id/translations` | Get all movie translations (`movies.translations`) | yes | film page (details / cast / crew) |
| GET | `/movies/:id/related` | Get related movies (`movies.related`) | yes | similar films |
| GET | `/movies/:id/watching` | Get users watching right now (`movies.watching`) | yes | none - Trakt only |
| GET | `/movies/:id/studios` | Get movie studios (`movies.studios`) | yes | film page (details / cast / crew) |
| GET | `/movies/:id/watchnow/:country` | Get movie watch now sources (`movies.watchnow`) | yes | where to watch |
| GET | `/movies/:id/watchnow/justwatch_links/:country` | Get movie JustWatch links (`movies.justwatch.link`) | yes | where to watch |
| POST | `/movies/:id/refresh/justwatch` | Refresh movie JustWatch links (`movies.justwatch.refresh`) | no | none - data maintenance |
| GET | `/movies/:id/people` | Get all people for a movie (`movies.people`) | yes | film page (details / cast / crew) |
| GET | `/movies/:id/videos` | Get all videos (`movies.videos`) | yes | film page (details / cast / crew) |
| GET | `/movies/:id/lists/:type/:sort` | Get lists containing this movie (`movies.lists`) | yes | lists containing this film |
| GET | `/movies/:id/comments/:sort` | Get all movie comments (`movies.comments`) | yes | review |
| GET | `/movies/:id/sentiments` | Get movie sentiments (`movies.sentiments`) | no | none - Trakt only (AI review summary) |
| POST | `/movies/:id/report` | Report a movie (`movies.report`) | yes | report |
| POST | `/movies/:id/refresh` | Refresh movie metadata (`movies.refresh`) | no | none - data maintenance |
| GET | `/movies/trending` | Get trending movies (`movies.trending`) | yes | popular / browse |
| GET | `/movies/watched/:period` | Get the most watched movies (`movies.watched`) | no | popular / browse |
| GET | `/movies/favorited/:period` | Get the most favorited movies (`movies.favorited`) | no | popular / browse |
| GET | `/movies/played/:period` | Get the most played movies (`movies.played`) | no | popular / browse |
| GET | `/movies/collected/:period` | Get the most collected movies (`movies.collected`) | no | popular / browse |
| GET | `/movies/boxoffice` | Get the weekend box office (`movies.boxoffice`) | no | popular / browse |
| GET | `/movies/updates/:start_date` | Get recently updated movies (`movies.updates`) | no | none - data maintenance |
| GET | `/movies/updates/id/:start_date` | Get recently updated movie Trakt IDs (`movies.updatedIds`) | no | none - data maintenance |
| GET | `/movies/anticipated` | Get the most anticipated movies (`movies.anticipated`) | yes | popular / browse |
| GET | `/movies/hot` | Get hot movies (`movies.hot`) | no | popular / browse |
| GET | `/movies/popular` | Get popular movies (`movies.popular`) | yes | popular / browse |
| GET | `/movies/streaming/:period` | Get streaming movies (`movies.streaming`) | no | popular / browse |

### notes

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| POST | `/notes` | Add notes (`notes.create`) | no | diary entry text / private notes |
| GET | `/notes/:id` | Get a note (`notes.summary`) | no | diary entry text / private notes |
| PUT | `/notes/:id` | Update a note (`notes.update`) | no | diary entry text / private notes |
| DELETE | `/notes/:id` | Delete a note (`notes.delete`) | no | diary entry text / private notes |
| GET | `/notes/:id/item` | Get the attached item (`notes.item`) | no | diary entry text / private notes |

### shows

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/shows/:id` | Get a single show (`shows.summary`) | yes | film page |
| GET | `/shows/:id/ratings` | Get show ratings (`shows.ratings`) | yes | ratings histogram |
| GET | `/shows/:id/stats` | Get show stats (`shows.stats`) | yes | film stats (watched by / liked by) |
| GET | `/shows/:id/aliases` | Get all show aliases (`shows.aliases`) | no | film page (details / cast / crew) |
| GET | `/shows/:id/certifications` | Get all show certifications (`shows.certifications`) | no | film page (details / cast / crew) |
| GET | `/shows/:id/progress/collection` | Get show collection progress (`shows.progress.collection`) | no | none - Trakt only (owned media) |
| GET | `/shows/:id/progress/watched` | Get show watched progress (`shows.progress.watched`) | yes | none - Trakt only (TV progress) |
| POST | `/shows/:id/progress/watched/reset` | Reset show progress (`shows.progress.reset`) | yes (raw fetch) | none - Trakt only (TV progress) |
| DELETE | `/shows/:id/progress/watched/reset` | Undo reset show progress (`shows.progress.undoReset`) | yes (raw fetch) | none - Trakt only (TV progress) |
| GET | `/shows/:id/translations` | Get all show translations (`shows.translations`) | yes | film page (details / cast / crew) |
| GET | `/shows/:id/related` | Get related shows (`shows.related`) | yes | similar films |
| GET | `/shows/:id/watching` | Get users watching right now (`shows.watching`) | yes | none - Trakt only |
| GET | `/shows/:id/next_episode` | Get next episode (`shows.nextEpisode`) | no | none - Trakt only (TV progress) |
| GET | `/shows/:id/last_episode` | Get last episode (`shows.lastEpisode`) | no | none - Trakt only (TV progress) |
| GET | `/shows/:id/studios` | Get show studios (`shows.studios`) | yes | film page (details / cast / crew) |
| GET | `/shows/:id/watchnow/:country` | Get show watch now sources (`shows.watchnow`) | yes | where to watch |
| GET | `/shows/:id/watchnow/justwatch_links/:country` | Get show JustWatch links (`shows.justwatch.link`) | yes | where to watch |
| POST | `/shows/:id/refresh/justwatch` | Refresh show JustWatch links (`shows.justwatch.refresh`) | no | none - data maintenance |
| GET | `/shows/:id/people` | Get all people for a show (`shows.people`) | yes | film page (details / cast / crew) |
| GET | `/shows/:id/seasons` | Get all seasons for a show (`shows.seasons`) | yes | film page |
| GET | `/shows/:id/videos` | Get all videos (`shows.videos`) | yes | film page (details / cast / crew) |
| GET | `/shows/:id/lists/:type/:sort` | Get lists containing this show (`shows.lists`) | yes | lists containing this film |
| GET | `/shows/:id/comments/:sort` | Get all show comments (`shows.comments`) | yes | review |
| GET | `/shows/:id/sentiments` | Get show sentiments (`shows.sentiments`) | no | none - Trakt only (AI review summary) |
| POST | `/shows/:id/report` | Report a show (`shows.report`) | yes | report |
| POST | `/shows/:id/refresh` | Refresh show metadata (`shows.refresh`) | no | none - data maintenance |
| GET | `/shows/trending` | Get trending shows (`shows.trending`) | yes | popular / browse |
| GET | `/shows/watched/:period` | Get the most watched shows (`shows.watched`) | no | popular / browse |
| GET | `/shows/favorited/:period` | Get the most favorited shows (`shows.favorited`) | no | popular / browse |
| GET | `/shows/played/:period` | Get the most played shows (`shows.played`) | no | popular / browse |
| GET | `/shows/collected/:period` | Get the most collected shows (`shows.collected`) | no | popular / browse |
| GET | `/shows/updates/:start_date` | Get recently updated shows (`shows.updates`) | no | none - data maintenance |
| GET | `/shows/updates/id/:start_date` | Get recently updated show Trakt IDs (`shows.updatedIds`) | no | none - data maintenance |
| GET | `/shows/anticipated` | Get the most anticipated shows (`shows.anticipated`) | yes | popular / browse |
| GET | `/shows/hot` | Get hot shows (`shows.hot`) | no | popular / browse |
| GET | `/shows/popular` | Get popular shows (`shows.popular`) | yes | popular / browse |
| GET | `/shows/streaming/:period` | Get streaming shows (`shows.streaming`) | no | popular / browse |

### shows.season

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/shows/:id/seasons/:season/info` | Get single seasons for a show (`shows.season.info`) | no | film page |
| GET | `/shows/:id/seasons/:season` | Get all episodes for a single season (`shows.season.episodes`) | yes | film page |
| GET | `/shows/:id/seasons/:season/translations` | Get all season translations (`shows.season.translations`) | no | film page (details / cast / crew) |
| GET | `/shows/:id/seasons/:season/comments/:sort` | Get all season comments (`shows.season.comments`) | yes | review |
| GET | `/shows/:id/seasons/:season/lists/:type/:sort` | Get lists containing this season (`shows.season.lists`) | no | lists containing this film |
| GET | `/shows/:id/seasons/:season/people` | Get all people for a season (`shows.season.people`) | yes | film page (details / cast / crew) |
| GET | `/shows/:id/seasons/:season/ratings` | Get season ratings (`shows.season.ratings`) | no | ratings histogram |
| GET | `/shows/:id/seasons/:season/stats` | Get season stats (`shows.season.stats`) | no | film stats (watched by / liked by) |
| GET | `/shows/:id/seasons/:season/watching` | Get users watching right now (`shows.season.watching`) | no | none - Trakt only |
| GET | `/shows/:id/seasons/:season/videos` | Get all videos (`shows.season.videos`) | yes | film page (details / cast / crew) |
| GET | `/shows/:id/seasons/:season/watchnow/justwatch_links/:country` | Get season JustWatch links (`shows.season.justwatch.link`) | yes | where to watch |
| POST | `/shows/:id/seasons/:season/report` | Report a season (`shows.season.report`) | no | report |

### shows.episode

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/shows/:id/seasons/:season/episodes/:episode` | Get a single episode for a show (`shows.episode.summary`) | yes | film page |
| GET | `/shows/:id/seasons/:season/episodes/:episode/translations` | Get all episode translations (`shows.episode.translations`) | yes | film page (details / cast / crew) |
| GET | `/shows/:id/seasons/:season/episodes/:episode/stats` | Get episode stats (`shows.episode.stats`) | yes | film stats (watched by / liked by) |
| GET | `/shows/:id/seasons/:season/episodes/:episode/ratings` | Get episode ratings (`shows.episode.ratings`) | yes | ratings histogram |
| GET | `/shows/:id/seasons/:season/episodes/:episode/watching` | Get users watching right now (`shows.episode.watching`) | yes | none - Trakt only |
| GET | `/shows/:id/seasons/:season/episodes/:episode/comments/:sort` | Get all episode comments (`shows.episode.comments`) | yes | review |
| GET | `/shows/:id/seasons/:season/episodes/:episode/people` | Get all people for an episode (`shows.episode.people`) | yes | film page (details / cast / crew) |
| GET | `/shows/:id/seasons/:season/episodes/:episode/lists/:type/:sort` | Get lists containing this episode (`shows.episode.lists`) | no | lists containing this film |
| GET | `/shows/:id/seasons/:season/episodes/:episode/videos` | Get all videos (`shows.episode.videos`) | no | film page (details / cast / crew) |
| GET | `/shows/:id/seasons/:season/episodes/:episode/watchnow/:country` | Get episode watch now sources (`shows.episode.watchnow`) | yes | where to watch |
| POST | `/shows/:id/seasons/:season/episodes/:episode/report` | Report an episode (`shows.episode.report`) | no | report |

### search

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/search/:type` | Get text query results (`search.query`) | yes | search |
| GET | `/search/:type/exact` | Get exact text query results (`search.exact`) | yes | search |
| GET | `/search/:id_type/:id` | Get ID lookup results (`search.lookup`) | no | search |
| GET | `/search/recent_by_id/global/:type` | Get trending search results (`search.trending`) | yes | search (trending searches) |
| POST | `/search/recent/` | Add recent search (`search.recent.add`) | yes | search |
| POST | `/search/recent/remove` | Remove recent search (`search.recent.remove`) | no | search |

### people

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/people/updates/:start_date` | Get recently updated people (`people.updates`) | no | none - data maintenance |
| GET | `/people/updates/id/:start_date` | Get recently updated people Trakt IDs (`people.updatedIds`) | no | none - data maintenance |
| GET | `/people/:id/` | Get a single person (`people.summary`) | yes | person page (filmography) |
| GET | `/people/:id/movies` | Get movie credits (`people.movies`) | yes | person page (filmography) |
| GET | `/people/:id/shows` | Get show credits (`people.shows`) | yes | person page (filmography) |
| GET | `/people/:id/lists/:type/:sort` | Get lists containing this person (`people.lists`) | no | lists containing this person |
| POST | `/people/:id/report` | Report a person (`people.report`) | yes | report |
| POST | `/people/:id/refresh` | Refresh person metadata (`people.refresh`) | no | none - data maintenance |

### watchnow

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/watchnow/sources` | Get watch now sources (`watchnow.sources.all`) | yes | where to watch |
| GET | `/watchnow/sources/:countryCode` | Get watch now sources by country (`watchnow.sources.country`) | no | where to watch |

### seasons

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| POST | `/seasons/:id/report` | Report a season (`seasons.report`) | yes | report |

### episodes

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/episodes/:id/watchnow/:country` | Get episode watch now sources (`episodes.watchnow`) | no | where to watch |
| POST | `/episodes/:id/report` | Report an episode (`episodes.report`) | yes | report |

### lists

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/lists/trending` | Get trending lists (`lists.trending`) | no | popular lists |
| GET | `/lists/trending/:type` | Get trending lists (`lists.trendingByType`) | no | popular lists |
| GET | `/lists/popular` | Get popular lists (`lists.popular`) | no | popular lists |
| GET | `/lists/popular/:type` | Get popular lists (`lists.popularByType`) | no | popular lists |
| GET | `/lists/:id` | Get list (`lists.summary`) | yes | list |
| GET | `/lists/:id/items/movie` | Get movie list items (`lists.items.movie`) | yes | list |
| GET | `/lists/:id/items/show` | Get show list items (`lists.items.show`) | yes | list |
| GET | `/lists/:id/items/movie,show` | Get media list items (`lists.items.media`) | no | list |
| GET | `/lists/:id/items/movie,show,episode,season` | Get all list items (`lists.items.all`) | yes | list |
| GET | `/lists/:id/items/:type/:sort_by/:sort_how` | Get items on a list (`lists.items.typedSorted`) | no | list |
| GET | `/lists/:id/comments/:sort` | Get all list comments (`lists.comments`) | no | list comments |
| GET | `/lists/:id/likes` | Get all users who liked a list (`lists.likes`) | no | list like |
| POST | `/lists/:id/like` | Like a list (`lists.like`) | yes | list like |
| DELETE | `/lists/:id/like` | Remove like on a list (`lists.unlike`) | yes | list like |
| POST | `/lists/:id/report` | Report a list (`lists.report`) | yes | report |

### smart_lists

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/smart-lists/:list_id` | Get smart list (`smart_lists.summary`) | no | none - Trakt only (rule-based lists) |
| GET | `/smart-lists/:list_id/items` | Get smart list items (`smart_lists.items`) | yes | none - Trakt only (rule-based lists) |

### comments

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/comments/:id` | Get a comment or reply (`comments.summary`) | yes (raw fetch) | review |
| GET | `/comments/:id/item` | Get the attached media item (`comments.item`) | yes (raw fetch) | review |
| GET | `/comments/:id/likes` | Get all users who liked a comment (`comments.likes`) | no | review like |
| POST | `/comments/:id/like` | Like a comment (`comments.like`) | no | review like |
| DELETE | `/comments/:id/like` | Remove like on a comment (`comments.unlike`) | no | review like |
| POST | `/comments/:id/report` | Report a comment (`comments.report`) | yes | report |
| GET | `/comments/:id/replies` | Get replies for a comment (`comments.replies`) | yes | review |
| POST | `/comments/:id/replies` | Post a reply for a comment (`comments.reply`) | yes | review |
| PUT | `/comments/:id/` | Update a comment or reply (`comments.edit`) | yes | review |
| DELETE | `/comments/:id/` | Delete a comment or reply (`comments.delete`) | yes | review |
| GET | `/comments/:id/reactions/summary` | Get reaction summary (`comments.reactions.summary`) | yes | review like (reactions: like, dislike, love, laugh, ...) |
| GET | `/comments/:id/reactions/` | Get comment reactions (`comments.reactions.all`) | no | review like (reactions: like, dislike, love, laugh, ...) |
| POST | `/comments/:id/reactions/:reaction_type` | Add comment reaction (`comments.reactions.add`) | yes | review like (reactions: like, dislike, love, laugh, ...) |
| DELETE | `/comments/:id/reactions/:reaction_type` | Remove comment reaction (`comments.reactions.remove`) | yes | review like (reactions: like, dislike, love, laugh, ...) |
| GET | `/comments/trending/:comment_type/:type` | Get trending comments (`comments.trending`) | no | popular reviews |
| GET | `/comments/recent/:comment_type/:type` | Get recently created comments (`comments.recent`) | no | recent reviews |
| GET | `/comments/updates/:comment_type/:type` | Get recently updated comments (`comments.updates`) | no | none - data maintenance |
| POST | `/comments/` | Post a comment (`comments.post`) | yes | review |

### certifications

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/certifications/:type` | Get certifications (`certifications.list`) | no | browse filters |
| GET | `/certifications/shows` | Get show certifications (`certifications.shows`) | no | browse filters |
| GET | `/certifications/movies` | Get movie certifications (`certifications.movies`) | no | browse filters |

### countries

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/countries/:type` | Get countries (`countries.list`) | no | browse filters |

### genres

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/genres/:type` | Get genres (`genres.list`) | no | browse filters |

### languages

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/languages/:type` | Get languages (`languages.list`) | no | browse filters |

### networks

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/networks` | Get networks (`networks.list`) | no | browse filters |

### scrobble

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| POST | `/scrobble/start` | Start watching in a media center (`scrobble.start`) | no | none - Trakt only (auto-log from players) |
| POST | `/scrobble/pause` | Pause watching in a media center (`scrobble.pause`) | no | none - Trakt only (auto-log from players) |
| POST | `/scrobble/stop` | Stop or finish watching in a media center (`scrobble.stop`) | no | none - Trakt only (auto-log from players) |

### team

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/team/` | Get team members (`team.members`) | yes | none (about page) |

### younify

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/younify/connections` | Get streaming connections (`younify.connections`) | yes | import (Letterboxd has CSV import only) |
| POST | `/younify/connect` | Create a streaming connection (`younify.connect`) | yes | import (Letterboxd has CSV import only) |
| POST | `/younify/users/refresh/:service_id` | Refresh a streaming service (`younify.refresh`) | yes | import (Letterboxd has CSV import only) |
| POST | `/younify/users/refresh/:service_id/:all_data` | Refresh a streaming service (full re-sync) (`younify.refreshAll`) | yes | import (Letterboxd has CSV import only) |
| DELETE | `/younify/users/services/:service_id` | Unlink a streaming service (`younify.disconnect`) | yes | import (Letterboxd has CSV import only) |

## Off-contract endpoints (not in `@trakt/api`)

Implemented in `trakt-workers/src/v2/server/routes/**` (edge worker) or only in Rails (VIP, account).
The client reaches all of these through `rawApiFetch`.

### /v3 family (edge worker)

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/v3/intl/bulk` | Bulk localized titles/overviews for many items | yes (raw fetch) | none |
| GET | `/v3/media/:type/:slug/info/:infoType/version/:v` | Generic "info" blobs. infoType 0 = sentiment summary, 5 = trivia / fun facts, 15 = soundtrack, 16 = parental guide, plus a YouTube-special type | yes (raw fetch) | film page extras (none native; trivia/soundtrack are Trakt only) |
| GET | `/v3/media/imdb/:imdb_id/streams` | Streams by IMDb id | no | where to watch |
| GET | `/v3/media/imdb/:imdb_id/parental-guide` | Parental guide by IMDb id | no | none |
| GET | `/v3/movies/:slug/me/lists` | Which of my lists contain this movie | yes (raw fetch) | "add to lists" sheet state |
| GET | `/v3/shows/:slug/me/lists` | Same for show | yes (raw fetch) | same |
| GET | `/v3/seasons/:id/me/lists` | Same for season | yes (raw fetch) | same |
| GET | `/v3/episodes/:id/me/lists` | Same for episode | yes (raw fetch) | same |
| POST | `/v3/search/match/movies` | Bulk title/year matching (importer) | yes (raw fetch) | import |
| GET | `/v3/stats/users` | Registered member count | yes (raw fetch) | none |
| GET | `/v3/users/me/lists` | My lists (minimal) | yes (raw fetch) | list |
| GET | `/v3/users/me/usage` | VIP limits / usage counters | yes (raw fetch) | Pro/Patron limits |
| GET / DELETE | `/v3/users/me/connected-apps[/:id]` | OAuth apps the user authorized; revoke | yes (raw fetch) | settings |
| GET / POST / PATCH / DELETE | `/v3/users/me/applications[/:id]` | Developer apps the user owns | no | none |
| GET | `/v3/users/me/notes/minimal` | All my note ids (for badges) | yes (raw fetch) | none |
| GET | `/v3/users/me/notes/:type/:slug` | My notes on one item | yes (raw fetch) | review draft / private note |
| POST / PUT / DELETE | `/v3/users/me/notes[/:id]` | Add / edit / delete a media-level note. Body `{ media:{type,id}, type:'note'or'favorites', notes }` (max 500 chars). **Cannot attach to a history play.** | yes (raw fetch) | private note / "why I liked it" |
| GET | `/v3/users/me/dropped/minimal` | Dropped show ids | yes (raw fetch) | none |
| GET | `/v3/users/me/watchlist/minimal` | Watchlist ids | yes (raw fetch) | watchlist state |
| GET | `/v3/users/me/watched/movies/plays` | Per-movie play counts (all) | yes (raw fetch) | rewatch count |
| GET | `/v3/users/me/watched/shows/plays` | Per-show play counts (all) | yes (raw fetch) | rewatch count |
| GET | `/v3/users/:slug/match` | Taste-match score between me and another user | yes (raw fetch) | "compatibility" (Letterboxd has none native) |

### v2 routes served by the worker but missing from the contract

| Method | Path | Purpose | Used by client? | Letterboxd equivalent |
| --- | --- | --- | --- | --- |
| GET | `/movies/:slug/social`, `/shows/:slug/social`, `/shows/:slug/seasons/:s/episodes/:e/social` | Friends' activity on this title (watched, rating, comment) | yes (raw fetch) | "Activity from friends" on film page |
| GET | `/movies/recommendations`, `/shows/recommendations`, `/media/recommendations` | Personal recommendations (discover-style) | yes (raw fetch) | none |
| GET | `/:type/recommendations/smart`, `/:type/popular/next` | Smart recs / next-page popular | no | none |
| GET | `/movies/:slug/related/smart`, `/shows/:slug/related/smart` | Embedding-based related titles | no | similar films |
| GET | `/movies/:slug/listed`, `/shows/:slug/listed`, seasons/episodes `/listed`, `/people/:slug/listed` | Lists-containing count/summary | no | "Appears in N lists" |
| GET | `/movies/:slug/watchnow/favorites/:country` (+ show/season/episode) | Watch-now filtered to my favorite services | no | where to watch |
| GET | `/people/this_month` (on `apiz.trakt.tv`) | People with birthdays / notable this month | yes (raw fetch) | none |
| GET | `/people/:slug/known_for/:type` | Person's known-for credits | no | person page |
| GET | `/users/:slug/leaderboard`, `/users/leaderboard` | User / global leaderboard | user: yes (raw fetch); global: no | none |
| GET | `/users/likes/lists` | My liked lists | yes (via contract `users.likes`) | likes tab |
| GET | `/users/reactions/:itemType/:reactionType?` | My reactions by item type | partially (`comments` only) | likes |
| GET | `/lists/:id/reactions/summary`, `/lists/:id/reactions/:type`, `/users/:slug/lists/:list/reactions/summary` | **Reactions on lists** | no | list like |
| GET | `/users/:slug/progress/up_next`, `/users/:slug/progress/:type` | Another user's progress | no | none |
| GET | `/users/:slug/watched/episodes`, `/sync/watched/episodes` | Watched episodes flat | no | none |
| GET | `/users/:slug/history/seasons[/:id]`, `/sync/history/seasons` | Season-level history filter | no | diary |
| GET | `/sync/updates/:type/:start_date`, `/sync/updates/id/...` | Incremental sync feed | no | none |
| GET | `/users/hidden/progress_watched_reset` | Shows being rewatched | yes (raw fetch) | rewatch state |
| GET | `/users/me/ratings/seasons` | Season ratings | yes (raw fetch) | rating |
| GET | `/storage`, `/storage/:id` | Stored blobs (exports) | no | export |

### Rails-only account / commerce endpoints the client calls

| Method | Path | Purpose | Used by client? |
| --- | --- | --- | --- |
| GET | `/vip/details`, `/vip/plans` | VIP subscription + plans | yes (raw fetch) |
| POST | `/vip/stripe/create`, `/vip/stripe/confirm`, `/vip/stripe/update`, `/vip/stripe/cancel` | Checkout / manage / cancel | yes (raw fetch) |
| PUT | `/users/email` | Change email | yes (raw fetch) |
| DELETE | `/users/settings` | Delete account | yes (raw fetch) |
| GET | `/users/likes/comments`, `/users/hidden/progress_collected`, `/users/hidden/recommendations`, `/users/:slug/notes/{activities,collection_items,ratings,...}` | Export-only reads | export only |

Third-party (not Trakt): Klipy GIF API (`lib/requests/queries/gifs`, GIF comments), Typesense
multi-search (`lib/requests/search/lookup.ts`), HAL analytics (`hal.trakt.tv/e`).

## Capabilities the client does NOT use yet that a Letterboxd-style product would want

Ordered roughly by value for a Letterboxd feel.

1. **Per-play diary notes** - `POST /notes` with `attached_to: { type: "history", id }` gives a
   500-char text with `privacy` (private/friends/public) and `spoiler` on a *specific watch*. This is
   the closest thing Trakt has to a per-entry review. Client only uses the v3 media-level notes.
   Also `attached_to: rating` / `collection`. `GET /notes/:id`, `PUT/DELETE /notes/:id`,
   `GET /notes/:id/item`, `GET /users/:id/notes/:type` (only in export) are all unused.
2. **Diary listing endpoints exist and are used** (`users.history.*`, per-item history), but
   `users.history.typedItem` / season history (`/users/:id/history/seasons`) and `sync.history.get`
   are not. The client does already do per-play removal (`sync.history.remove` with `ids`) and dated
   logging (`watched_at`).
3. **List likes in the classic form** - `POST/DELETE /users/:id/lists/:list_id/like`,
   `GET .../likes` (who liked) and `GET /lists/:id/likes` are unused (client likes via `lists.like`
   only, and never shows likers). **List reactions** (`/lists/:id/reactions*`) are unused.
4. **List comments** - `GET /lists/:id/comments/:sort` and `/users/:id/lists/:list_id/comments/:sort`
   unused, even though `POST /comments` accepts `{ list: { ids } }`.
5. **List item notes** - `PUT /users/:id/lists/:list_id/items/:list_item_id` (per-entry `notes`, VIP,
   500 chars) unused. Letterboxd list entries have notes. Same for watchlist item notes
   (`PUT /sync/watchlist/:list_item_id`) and favorites notes (`PUT /sync/favorites/:list_item_id`,
   "why I favorited", not VIP-gated). The client stores "favorites" notes through v3 instead.
6. **Reorder favorites** - `POST /sync/favorites/reorder` unused ("Top 4 favourite films" ordering).
   List reorder and watchlist reorder are used.
7. **Comment likers / classic likes** - `GET /comments/:id/likes`, `POST/DELETE /comments/:id/like`
   unused; client uses reactions instead (`comments.reactions.add/remove/summary`). `GET
   /comments/:id/reactions/` (who reacted) is unused.
8. **Review discovery feeds** - `GET /comments/trending/:comment_type/:type` and
   `/comments/recent/...` unused (Letterboxd "Popular reviews this week"). `comment_type` can be
   `reviews` to filter to 200+ word reviews.
9. **Popular / trending lists** - `/lists/trending[/:type]`, `/lists/popular[/:type]` unused.
10. **Lists containing a season / episode** - `shows.season.lists`, `shows.episode.lists` unused;
    `people.lists` unused.
11. **Ratings on seasons** - the client reads season ratings (raw) but `toAddRatingsPayload` only
    writes movie/show/episode. `POST /sync/ratings` accepts `seasons[]`. Season ratings distribution
    (`shows.season.ratings`) and stats are unused too.
12. **Collection** - `POST /sync/collection` (add) is unused; client only reads and removes. Useful
    for an "owned / physical media" shelf; Letterboxd has no equivalent.
13. **Watchlist / favorites comments feeds** - `users.watchlist.comments`, `users.favorites.comments`.
14. **Browse-by-period charts** - `movies.watched|played|favorited|collected/:period`,
    `movies.hot`, `movies.boxoffice`, `movies.streaming/:period` and show equivalents. Useful for
    "Popular this week / month / year" shelves.
15. **Reference data** - `genres`, `languages`, `countries`, `certifications`, `networks` lists
    unused (browse-by-genre/country/language pages).
16. **Check-in** is used; **scrobble** is not (expected on web).
17. **Saved filters** - add/delete unused (only read in export).
18. **Social recs** - `social_recommendations.movies|shows` ("what friends recommend") unused.
19. **Other** - `movies.releases/:country` (release dates per country, Letterboxd shows these),
    `movies.aliases`, `shows.certifications`, `shows.nextEpisode/lastEpisode`, `episodes.watchnow`,
    `search.lookup` (ID lookup), `search.recent.remove`, `users.lists.list.report`,
    `users.smartLists.smartList.update`, `calendars.*` beyond shows/movies/media/hot.

Not relevant / intentionally skipped for a web client: device OAuth, `*.updates` / `updatedIds`,
`*.refresh`, scrobble, `sync.lastActivities` (only in export), playback resume endpoints.

## Diary model

### How Trakt stores watches

- A watch is a **history play**: one row per watch with a unique 64-bit `id`, `watched_at` (UTC
  datetime) and `action` (`scrobble` | `checkin` | `watch`). Movies and episodes get plays; adding a
  show or season expands into episode plays.
- **Rewatches are just additional plays.** There is no rewatch flag; a rewatch is any play after the
  first for the same item. Play counts: `GET /users/:id/watched/movies` (`plays`,
  `last_watched_at`) or the v3 `/v3/users/me/watched/{movies,shows}/plays`. For shows there is also a
  progress-level "rewatching" state: `POST /shows/:id/progress/watched/reset` (client uses it; it's
  listed via `/users/hidden/progress_watched_reset`).
- **Logging**: `POST /sync/history` with `movies[] / shows[] / seasons[] / episodes[]`, each with
  `ids` and optional `watched_at`. `watched_at` accepts an ISO datetime, `"released"` (episodes: use
  air date + runtime) or `"unknown"` (no date). The API does **not** dedupe item + `watched_at`;
  the app must avoid duplicate plays. Response gives counts only (`added`, `updated`, `not_found`),
  not the new play ids, so the client must re-read history to learn the id of what it just logged.
- **Reading the diary**: `GET /users/:id/history[/movies|shows|episodes][/:item_id]` with
  `start_at` / `end_at` paging, each row = `{ id, watched_at, action, type, movie|episode+show }`.
- **Removing a single entry**: `POST /sync/history/remove` with `{ ids: [historyId] }` (client uses
  this). Sending media objects instead removes all plays of that item.
- **Editing an entry's date**: no endpoint. Edit = remove play by id + re-add with a new
  `watched_at` (which changes the play id).

### How ratings are stored

- One rating per user per item (movie, show, season, episode). Integer **1-10** (the UI's 5 stars
  with halves = rating / 2). `POST /sync/ratings` with optional `rated_at`; re-posting overwrites.
  `POST /sync/ratings/remove` deletes. Read via `GET /users/:id/ratings/:type[/:rating]`
  (`rated_at`, `rating`).
- Ratings are **not per play**: rewatching and re-rating replaces the single rating. History rows
  do not carry a rating; social activity rows and comments carry `user_rating` (the current rating,
  not the rating at the time).

### Comments and history

- Comments attach to `movie | show | season | episode | list` only (`POST /comments`, body
  `{ comment, spoiler, gif?, sharing?, <item>: { ids } }`). **They cannot attach to a history play.**
- Rules: minimum 5 words; 200+ words is auto-flagged `review: true`. `spoiler` is a boolean on
  comments (and on notes). Comments carry `user_rating` and `user_stats { rating, play_count,
  completed_count }` so a comment can display "rated X, watched N times" but not which play it was
  about. Replies, reactions (like, dislike, love, laugh, ...; client uses these) and classic likes exist.
- **Notes** are the history-attachable text: `POST /notes` with
  `attached_to: { type: "history", id: <historyId> }`, `notes` (500 chars), `privacy`
  (`private` | `friends` | `public`), `spoiler`. Notes on bare media are forced private and cannot be
  spoilers. Notes can also attach to a `rating` (so "the text behind my rating") or `collection`.

### Composing a Letterboxd log entry from Trakt primitives

| Letterboxd field | Trakt primitive | Call | Fidelity |
| --- | --- | --- | --- |
| Watched date | history play `watched_at` | `POST /sync/history` | full (plus `released` / `unknown`) |
| Rewatch flag | derived: plays for item > 1 before this `watched_at` | `GET /users/me/history/movies/:id` or v3 plays | derived only; no explicit flag, can't mark a first-log as rewatch |
| Rating | item rating 1-10 | `POST /sync/ratings` (`rated_at` = watch date) | **one per item**, not per entry; later entries overwrite |
| Like (heart) | favorites | `POST /sync/favorites` (optional `notes`) | per item, not per entry; favorites are an ordered, size-limited shelf (420 when the favorites limit is exceeded, applies to all users) |
| Review text | option A: comment | `POST /comments` (`spoiler`) | public, social (replies/reactions), but item-level, not linked to the play |
|  | option B: history note | `POST /notes` `attached_to: history` | linked to the exact play, has privacy + spoiler, but 500 chars, no replies/reactions, not in comment feeds |
| Spoiler flag | `spoiler` on comment or note | as above | full |
| Tags | none | - | **gap**. Workarounds: lists as tags (`POST /users/me/lists/:id/items`), or hashtags parsed out of note/comment text |
| Add to list | list items | `POST /users/:id/lists/:list_id/items` (+ item `notes`, VIP) | full |
| Privacy of entry | note `privacy`; profile-level privacy for history | - | partial |

Recommended composition for "Log" in the redesign: history POST (date) -> re-read history to get the
play id -> ratings POST (if rating changed) -> favorites POST (if liked) -> comment POST for a public
review and/or history-note POST for a per-entry diary line -> list item POSTs for "tags". Treat
rating and like as item-level state surfaced on the entry, not as entry properties.

### Gaps vs Letterboxd

- **No per-entry rating or like.** Only item-level. A diary showing "rating at that watch" would have
  to be client-side reconstruction (not stored).
- **No explicit rewatch flag.** Derivable from play order; cannot be set manually.
- **No tags.** Needs lists or text conventions.
- **Reviews are not tied to a diary entry.** Comments are item-level; only notes attach to plays,
  and notes are short and not social.
- **No edit-date endpoint** for a play; remove + re-add changes the id (and orphans an attached note).
- **History POST does not return play ids.**
- **Duplicate plays are not prevented server-side.**
- Things Trakt has that Letterboxd lacks: TV at episode granularity, check-in / scrobble "watching
  now", collection, calendars, watch progress, smart lists, AI sentiment summary, trivia, soundtrack,
  parental guide, taste match, leaderboards, month-in-review.
