import type { Season } from '$lib/requests/models/Season.ts';
import { toOrderedSeasons } from './toOrderedSeasons.ts';
import { type SeasonProgress, toSeasonProgress } from './toSeasonProgress.ts';

export type SeasonStripItem = SeasonProgress & { season: Season };

type SeasonStripParams = {
  seasons: ReadonlyArray<Season>;
  watchedBySeason: ReadonlyMap<number, number>;
};

export function toSeasonStrip(
  { seasons, watchedBySeason }: SeasonStripParams,
): ReadonlyArray<SeasonStripItem> {
  return toOrderedSeasons(seasons).map((season) => ({
    season,
    ...toSeasonProgress({ season, watchedBySeason }),
  }));
}
