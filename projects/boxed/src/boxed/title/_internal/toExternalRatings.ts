import type { MediaRating } from '$lib/requests/models/MediaRating.ts';
import { toIMDBRating } from '$lib/utils/formatting/number/toIMDBRating.ts';
import { toLetterboxdRating } from '$lib/utils/formatting/number/toLetterboxdRating.ts';
import { toPercentage } from '$lib/utils/formatting/number/toPercentage.ts';

export type ExternalRatingSource =
  | 'imdb'
  | 'rotten-critic'
  | 'rotten-audience'
  | 'tmdb'
  | 'mal'
  | 'letterboxd';

export type ExternalRating = {
  source: ExternalRatingSource;
  value: string;
  score: number;
  url: string | Nil;
};

export function toExternalRatings(
  ratings: MediaRating,
  locale: string,
  limit: number,
): ReadonlyArray<ExternalRating> {
  const { imdb, rotten, tmdb, mal, letterboxd } = ratings;

  const candidates: ReadonlyArray<ExternalRating | null> = [
    imdb?.rating
      ? {
        source: 'imdb',
        value: toIMDBRating(imdb.rating, locale),
        score: imdb.rating,
        url: imdb.url,
      }
      : null,
    rotten?.critic
      ? {
        source: 'rotten-critic',
        value: toPercentage(rotten.critic, locale),
        score: rotten.critic,
        url: rotten.url,
      }
      : null,
    rotten?.audience
      ? {
        source: 'rotten-audience',
        value: toPercentage(rotten.audience, locale),
        score: rotten.audience,
        url: rotten.url,
      }
      : null,
    tmdb?.rating
      ? {
        source: 'tmdb',
        value: toIMDBRating(tmdb.rating, locale),
        score: tmdb.rating,
        url: tmdb.url,
      }
      : null,
    mal?.rating
      ? {
        source: 'mal',
        value: toIMDBRating(mal.rating, locale),
        score: mal.rating,
        url: mal.url,
      }
      : null,
    letterboxd?.rating
      ? {
        source: 'letterboxd',
        value: toLetterboxdRating(letterboxd.rating, locale),
        score: letterboxd.rating,
        url: letterboxd.url,
      }
      : null,
  ];

  return candidates
    .filter((rating): rating is ExternalRating => rating !== null)
    .slice(0, limit);
}
