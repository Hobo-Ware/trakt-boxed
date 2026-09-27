import type { YirDetail } from '$lib/requests/models/YirDetail.ts';
import type { PosterMedia } from '../../poster/PosterMedia.ts';

export type RatedPoster = {
  media: PosterMedia;
  rating: number;
};

export function toHighestRated(
  { detail, limit }: { detail: YirDetail; limit: number },
): RatedPoster[] {
  return [...detail.topRated.movies, ...detail.topRated.shows]
    .toSorted((a, b) => b.rating - a.rating)
    .slice(0, limit)
    .map(({ entry, rating }) => ({ media: entry, rating }));
}
