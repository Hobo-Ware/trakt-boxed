import type { Season } from '$lib/requests/models/Season.ts';

const bySpecialsLast = (left: Season, right: Season) => {
  if (left.number === 0) return 1;
  if (right.number === 0) return -1;
  return left.number - right.number;
};

export function toOrderedSeasons(
  seasons: ReadonlyArray<Season>,
): ReadonlyArray<Season> {
  return [...seasons].sort(bySpecialsLast);
}
