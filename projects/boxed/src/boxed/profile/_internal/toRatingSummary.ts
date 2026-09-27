import type { RatingDistribution } from '$lib/requests/models/UserStats.ts';

const RATINGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export type RatingBar = {
  rating: number;
  count: number;
  ratio: number;
};

export type RatingSummary = {
  bars: RatingBar[];
  total: number;
  average: number | null;
  mostGiven: number | null;
};

export function toRatingSummary(
  distribution: RatingDistribution | Nil,
): RatingSummary {
  const counts = RATINGS.map((rating) => ({
    rating,
    count: distribution?.[rating] ?? 0,
  }));
  const total = counts.reduce((sum, { count }) => sum + count, 0);
  const peak = Math.max(...counts.map(({ count }) => count));

  const bars = counts.map(({ rating, count }) => ({
    rating,
    count,
    ratio: peak > 0 ? count / peak : 0,
  }));

  if (total === 0) return { bars, total, average: null, mostGiven: null };

  const weighted = counts.reduce(
    (sum, { rating, count }) => sum + rating * count,
    0,
  );
  const mostGiven = counts.reduce((best, entry) =>
    entry.count > best.count ? entry : best
  );

  return {
    bars,
    total,
    average: weighted / total,
    mostGiven: mostGiven.rating,
  };
}
