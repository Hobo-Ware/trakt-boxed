import type { RatingsLookup } from './RatingsLookup.ts';

type PlaysRatingParams = {
  episodeIds: ReadonlyArray<number>;
  showId: number | Nil;
  ratings: RatingsLookup | Nil;
};

export function toPlaysRating(
  { episodeIds, showId, ratings }: PlaysRatingParams,
): number | null {
  if (!ratings || showId == null) return null;

  const [only, ...rest] = episodeIds;
  const episodeRating = only !== undefined && rest.length === 0
    ? ratings.episodes.get(only)?.rating
    : undefined;

  return episodeRating ?? ratings.shows.get(showId)?.rating ?? null;
}
