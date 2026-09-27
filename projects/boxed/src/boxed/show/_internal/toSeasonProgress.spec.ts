import type { Season } from '$lib/requests/models/Season.ts';
import { describe, expect, it } from 'vitest';
import { toSeasonProgress } from './toSeasonProgress.ts';

const season = (number: number, aired: number): Season => ({
  id: number + 100,
  key: `season-${number}`,
  number,
  episodes: { count: aired, aired },
  airDate: new Date('2022-02-18'),
  totalRuntime: 0,
});

describe('util: toSeasonProgress', () => {
  it('should cap watched plays at the aired episode count', () => {
    expect(
      toSeasonProgress({
        season: season(1, 8),
        watchedBySeason: new Map([[1, 12]]),
      }),
    ).toEqual({ watched: 8, total: 8, ratio: 1, isComplete: true });
  });

  it('should not count a season without aired episodes as complete', () => {
    expect(toSeasonProgress({ season: season(3, 0), watchedBySeason: null }))
      .toEqual({ watched: 0, total: 0, ratio: 0, isComplete: false });
  });
});
