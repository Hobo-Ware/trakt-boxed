import type { PosterMedia } from '$boxed/poster/PosterMedia.ts';
import type { WatchlistedItem } from '$lib/requests/queries/users/watchlistQuery.ts';

export function toWatchlistPosters(
  list: ReadonlyArray<WatchlistedItem>,
): PosterMedia[] {
  return list.flatMap((item): PosterMedia[] =>
    item.type === 'movie' || item.type === 'show'
      ? [{ ...item.entry, type: item.type }]
      : []
  );
}
