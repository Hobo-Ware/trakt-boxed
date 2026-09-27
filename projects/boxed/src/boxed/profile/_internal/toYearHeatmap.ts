import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';

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
  locale: AvailableLocale;
};

function toLevel(count: number): HeatmapCell['level'] {
  const passed = LEVEL_THRESHOLDS.filter((threshold) => count >= threshold);
  return passed.length as HeatmapCell['level'];
}

export function toYearHeatmap(
  { dates, now, weeks, locale }: YearHeatmapParams,
): HeatmapCell[] {
  const counts = dates.map(getDayKey).reduce(
    (acc, key) => acc.set(key, (acc.get(key) ?? 0) + 1),
    new Map<string, number>(),
  );

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = getStartOfWeek(today, locale);
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
