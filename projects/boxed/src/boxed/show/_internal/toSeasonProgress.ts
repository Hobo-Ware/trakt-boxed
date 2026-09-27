import type { Season } from '$lib/requests/models/Season.ts';

export type SeasonProgress = {
  watched: number;
  total: number;
  ratio: number;
  isComplete: boolean;
};

type SeasonProgressParams = {
  season: Season;
  watchedBySeason: ReadonlyMap<number, number> | Nil;
};

export function toSeasonProgress(
  { season, watchedBySeason }: SeasonProgressParams,
): SeasonProgress {
  const total = season.episodes.aired;
  const watched = Math.min(watchedBySeason?.get(season.number) ?? 0, total);

  return {
    watched,
    total,
    ratio: total > 0 ? watched / total : 0,
    isComplete: total > 0 && watched >= total,
  };
}
