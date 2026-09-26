import { describe, expect, it } from 'vitest';
import { pickDefaultEpisode } from './pickDefaultEpisode.ts';

describe('util: pickDefaultEpisode', () => {
  const episodeNumbers = [1, 2, 3, 4, 5];

  it('should prefer the requested episode when the season has it', () => {
    expect(
      pickDefaultEpisode({
        episodeNumbers,
        watchedNumbers: new Set([1]),
        preferred: 4,
      }),
    ).toBe(4);
  });

  it('should fall back to the first unwatched episode', () => {
    expect(
      pickDefaultEpisode({
        episodeNumbers,
        watchedNumbers: new Set([1, 2]),
        preferred: 9,
      }),
    ).toBe(3);
  });

  it('should pick nothing when the season is fully watched', () => {
    expect(
      pickDefaultEpisode({
        episodeNumbers,
        watchedNumbers: new Set(episodeNumbers),
      }),
    ).toBeNull();
  });
});
