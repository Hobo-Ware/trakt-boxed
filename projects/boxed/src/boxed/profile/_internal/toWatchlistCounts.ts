type WatchlistIds = {
  movies: ReadonlySet<number>;
  shows: ReadonlySet<number>;
};

export type WatchlistCounts = { movies: number; shows: number };

export function toWatchlistCounts(
  watchlist: WatchlistIds | Nil,
): WatchlistCounts | null {
  if (!watchlist) return null;

  return { movies: watchlist.movies.size, shows: watchlist.shows.size };
}
