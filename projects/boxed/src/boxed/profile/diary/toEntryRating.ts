import type { DiaryEntry } from '../DiaryEntry.ts';

type RatingMap = ReadonlyMap<number, { rating: number }>;

export type RatingsLookup = {
  movies: RatingMap;
  shows: RatingMap;
  episodes: RatingMap;
};

export function toEntryRating(
  { entry, ratings }: { entry: DiaryEntry; ratings: RatingsLookup | Nil },
): number | null {
  if (!ratings) return null;
  if (entry.type === 'movie') {
    return ratings.movies.get(entry.play.movie.id)?.rating ?? null;
  }

  const [only, ...rest] = entry.plays;
  const episodeRating = only && rest.length === 0
    ? ratings.episodes.get(only.episode.id)?.rating
    : undefined;

  return episodeRating ?? ratings.shows.get(entry.show.id)?.rating ?? null;
}
