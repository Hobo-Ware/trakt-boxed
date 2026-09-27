import type { RatingsLookup } from '$boxed/utils/RatingsLookup.ts';
import { toPlaysRating } from '$boxed/utils/toPlaysRating.ts';
import type { DiaryEntry } from './DiaryEntry.ts';

export function toEntryRating(
  { entry, ratings }: { entry: DiaryEntry; ratings: RatingsLookup | Nil },
): number | null {
  if (!ratings) return null;
  if (entry.type === 'movie') {
    return ratings.movies.get(entry.play.movie.id)?.rating ?? null;
  }

  return toPlaysRating({
    episodeIds: entry.plays.map((play) => play.episode.id),
    showId: entry.show.id,
    ratings,
  });
}
