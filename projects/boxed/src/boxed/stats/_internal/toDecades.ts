import type { YirDetail } from '$lib/requests/models/YirDetail.ts';
import type { RankedCount } from './toRankedCounts.ts';

export function toDecades(detail: YirDetail): RankedCount[] {
  const decades = [
    ...(detail.releaseYears?.movies.decades ?? []),
    ...(detail.releaseYears?.shows.decades ?? []),
  ].reduce((acc, { decade, count }) => {
    acc.set(decade, (acc.get(decade) ?? 0) + count);
    return acc;
  }, new Map<number, number>());

  return [...decades.entries()]
    .toSorted(([a], [b]) => a - b)
    .map(([decade, count]) => ({
      key: `${decade}`,
      label: `${decade}s`,
      count,
    }));
}
