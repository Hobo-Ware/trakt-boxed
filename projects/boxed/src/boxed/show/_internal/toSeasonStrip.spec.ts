import type { Season } from '$lib/requests/models/Season.ts';
import { describe, expect, it } from 'vitest';
import { toSeasonStrip } from './toSeasonStrip.ts';

const season = (number: number, aired: number): Season => ({
  id: number + 100,
  key: `season-${number}`,
  number,
  episodes: { count: aired, aired },
  airDate: new Date('2022-02-18'),
  totalRuntime: 0,
});

describe('util: toSeasonStrip', () => {
  it('should move specials to the end', () => {
    const result = toSeasonStrip({
      seasons: [season(0, 1), season(1, 9), season(2, 10)],
      watchedBySeason: new Map(),
    });

    expect(result.map((item) => item.season.number)).toEqual([1, 2, 0]);
  });

  it('should compute watched progress per season', () => {
    const [first, second] = toSeasonStrip({
      seasons: [season(1, 9), season(2, 10)],
      watchedBySeason: new Map([[1, 9], [2, 5]]),
    });

    expect(first).toMatchObject({ watched: 9, total: 9, isComplete: true });
    expect(second).toMatchObject({ watched: 5, ratio: 0.5, isComplete: false });
  });

  it('should clamp watched counts to the aired episodes', () => {
    const [item] = toSeasonStrip({
      seasons: [season(1, 4)],
      watchedBySeason: new Map([[1, 6]]),
    });

    expect(item).toMatchObject({ watched: 4, ratio: 1 });
  });

  it('should not mark a season without aired episodes as complete', () => {
    const [item] = toSeasonStrip({
      seasons: [season(3, 0)],
      watchedBySeason: new Map(),
    });

    expect(item).toMatchObject({ ratio: 0, isComplete: false });
  });
});
