import type { Season } from '$lib/requests/models/Season.ts';

export type SeasonStripItem = {
  season: Season;
  watched: number;
  total: number;
  ratio: number;
  isComplete: boolean;
};

type SeasonStripParams = {
  seasons: ReadonlyArray<Season>;
  watchedBySeason: ReadonlyMap<number, number>;
};

const bySpecialsLast = (left: Season, right: Season) => {
  if (left.number === 0) return 1;
  if (right.number === 0) return -1;
  return left.number - right.number;
};

export function toSeasonStrip(
  { seasons, watchedBySeason }: SeasonStripParams,
): ReadonlyArray<SeasonStripItem> {
  return [...seasons].sort(bySpecialsLast).map((season) => {
    const total = season.episodes.aired;
    const watched = Math.min(watchedBySeason.get(season.number) ?? 0, total);

    return {
      season,
      watched,
      total,
      ratio: total > 0 ? watched / total : 0,
      isComplete: total > 0 && watched >= total,
    };
  });
}
