import { getDayKey } from '$lib/utils/date/getDayKey.ts';

const DAYS_PER_WEEK = 7;
const LEVEL_THRESHOLDS = [1, 2, 4, 6];

export type HeatmapCell = {
  key: string;
  date: Date;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  isFuture: boolean;
};

type YearHeatmapParams = {
  dates: ReadonlyArray<Date>;
  now: Date;
  weeks: number;
};

function toLevel(count: number): HeatmapCell['level'] {
  const passed = LEVEL_THRESHOLDS.filter((threshold) => count >= threshold);
  return passed.length as HeatmapCell['level'];
}

export function toYearHeatmap(
  { dates, now, weeks }: YearHeatmapParams,
): HeatmapCell[] {
  const counts = dates.map(getDayKey).reduce(
    (acc, key) => acc.set(key, (acc.get(key) ?? 0) + 1),
    new Map<string, number>(),
  );

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const firstDay = new Date(weekStart);
  firstDay.setDate(weekStart.getDate() - (weeks - 1) * DAYS_PER_WEEK);

  return Array.from({ length: weeks * DAYS_PER_WEEK }, (_, index) => {
    const date = new Date(
      firstDay.getFullYear(),
      firstDay.getMonth(),
      firstDay.getDate() + index,
    );
    const key = getDayKey(date);
    const count = counts.get(key) ?? 0;

    return {
      key,
      date,
      count,
      level: toLevel(count),
      isFuture: date.getTime() > today.getTime(),
    };
  });
}
