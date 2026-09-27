import type { DiaryEntry } from '../DiaryEntry.ts';

export type FavoritesLookup = {
  movies: ReadonlyMap<number, unknown>;
  shows: ReadonlyMap<number, unknown>;
};

export function isEntryLiked(
  { entry, favorites }: { entry: DiaryEntry; favorites: FavoritesLookup | Nil },
): boolean {
  if (!favorites) return false;

  return entry.type === 'movie'
    ? favorites.movies.has(entry.play.movie.id)
    : favorites.shows.has(entry.show.id);
}
