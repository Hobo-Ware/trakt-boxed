const RATING_KEYS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
] as const;

type RatingKey = typeof RATING_KEYS[number];

export type HistogramBar = {
  rating: number;
  count: number;
  ratio: number;
  isPeak: boolean;
};

export function toHistogramBars(
  distribution: Partial<Record<RatingKey, number>> | Nil,
): ReadonlyArray<HistogramBar> {
  const counts = RATING_KEYS.map((key) =>
    Math.max(0, distribution?.[key] ?? 0)
  );
  const max = Math.max(...counts);

  return counts.map((count, index) => ({
    rating: index + 1,
    count,
    ratio: max > 0 ? count / max : 0,
    isPeak: max > 0 && count === max,
  }));
}
