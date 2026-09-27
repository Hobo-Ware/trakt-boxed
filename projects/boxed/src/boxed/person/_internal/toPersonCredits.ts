import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { MediaCredit } from '$lib/requests/models/MediaCredits.ts';
import type { PosterMedia } from '../../poster/PosterMedia.ts';
import { dedupe } from '$lib/utils/array/dedupe.ts';
import type { CreditSort } from './CreditSort.ts';

type PersonCreditsParams = {
  credits: ReadonlyArray<MediaCredit>;
  sort: CreditSort;
  history: UserHistory | Nil;
  hideWatched: boolean;
};

type PersonCredits = {
  posters: ReadonlyArray<PosterMedia>;
  seen: number;
  total: number;
};

const byYear = (direction: 1 | -1) => (a: PosterMedia, b: PosterMedia) => {
  if (a.year == null) return 1;
  if (b.year == null) return -1;
  return (a.year - b.year) * direction;
};

const SORTERS: Record<
  CreditSort,
  ((a: PosterMedia, b: PosterMedia) => number) | null
> = {
  popular: null,
  newest: byYear(-1),
  oldest: byYear(1),
};

const isWatched = (media: PosterMedia, history: UserHistory | Nil) =>
  media.type === 'movie'
    ? history?.movies.has(media.id) ?? false
    : history?.shows.has(media.id) ?? false;

export function toPersonCredits(
  { credits, sort, history, hideWatched }: PersonCreditsParams,
): PersonCredits {
  const unique = dedupe(
    (media) => media.key,
    credits.map((credit): PosterMedia => credit.media),
  );

  const sorter = SORTERS[sort];
  const sorted = sorter ? unique.toSorted(sorter) : unique;
  const seen = unique.filter((media) => isWatched(media, history)).length;

  return {
    posters: hideWatched
      ? sorted.filter((media) => !isWatched(media, history))
      : sorted,
    seen,
    total: unique.length,
  };
}
