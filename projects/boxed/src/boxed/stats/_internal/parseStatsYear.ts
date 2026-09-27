import type { YirYear } from '$lib/requests/models/YirYear.ts';

const FIRST_YEAR = 2010;

export function parseStatsYear(
  { value, now }: { value: string | Nil; now: Date },
): YirYear {
  if (value === 'all') return 'all';

  const year = Number(value);
  const isKnownYear = Number.isInteger(year) && year >= FIRST_YEAR &&
    year <= now.getFullYear();

  return isKnownYear ? year : now.getFullYear();
}
