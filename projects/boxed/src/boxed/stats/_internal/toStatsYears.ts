import type { YirYear } from '$lib/requests/models/YirYear.ts';

const YEARS_SHOWN = 3;

export function toStatsYears(now: Date): YirYear[] {
  const current = now.getFullYear();
  const years = Array.from(
    { length: YEARS_SHOWN },
    (_, index) => current - (YEARS_SHOWN - 1) + index,
  );

  return [...years, 'all'];
}
