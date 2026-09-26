import { describe, expect, it } from 'vitest';
import { toShowProgress } from './toShowProgress.ts';

describe('util: toShowProgress', () => {
  it('should return the watched share of a started show', () => {
    expect(
      toShowProgress({
        watchedEpisodeCount: 14,
        episodeCount: 19,
        isWatched: false,
      }),
    ).toBeCloseTo(14 / 19);
  });

  it('should hide the bar for completed or unstarted shows', () => {
    expect(
      toShowProgress({
        watchedEpisodeCount: 19,
        episodeCount: 19,
        isWatched: true,
      }),
    ).toBeNull();
    expect(
      toShowProgress({
        watchedEpisodeCount: 0,
        episodeCount: 19,
        isWatched: false,
      }),
    ).toBeNull();
  });

  it('should ignore a missing episode count and clamp overshoot', () => {
    expect(
      toShowProgress({
        watchedEpisodeCount: 3,
        episodeCount: null,
        isWatched: false,
      }),
    ).toBeNull();
    expect(
      toShowProgress({
        watchedEpisodeCount: 25,
        episodeCount: 19,
        isWatched: false,
      }),
    ).toBe(1);
  });
});
