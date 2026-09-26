import { describe, expect, it } from 'vitest';
import { pickDefaultSeason } from './pickDefaultSeason.ts';

describe('util: pickDefaultSeason', () => {
  const seasons = [
    { number: 1, aired: 9 },
    { number: 2, aired: 10 },
    { number: 3, aired: 4 },
  ];

  it('should open the first season with unwatched aired episodes', () => {
    expect(
      pickDefaultSeason({ seasons, playsPerSeason: new Map([[1, 9], [2, 5]]) }),
    ).toBe(2);
  });

  it('should open season one for a show nobody has started', () => {
    expect(pickDefaultSeason({ seasons, playsPerSeason: new Map() })).toBe(1);
  });

  it('should open the latest season when everything is watched', () => {
    expect(
      pickDefaultSeason({
        seasons,
        playsPerSeason: new Map([[1, 9], [2, 10], [3, 4]]),
      }),
    ).toBe(3);
    expect(pickDefaultSeason({ seasons: [], playsPerSeason: new Map() }))
      .toBeNull();
  });
});
