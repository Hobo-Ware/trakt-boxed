import { describe, expect, it } from 'vitest';
import type { RatingsLookup } from './RatingsLookup.ts';
import { toPlaysRating } from './toPlaysRating.ts';

const ratings: RatingsLookup = {
  movies: new Map(),
  shows: new Map([[10, { rating: 6 }]]),
  episodes: new Map([[1, { rating: 9 }]]),
};

describe('util: toPlaysRating', () => {
  it('should use the episode rating for a single play', () => {
    expect(toPlaysRating({ episodeIds: [1], showId: 10, ratings })).toBe(9);
  });

  it('should fall back to the show rating for several plays', () => {
    expect(toPlaysRating({ episodeIds: [1, 2], showId: 10, ratings }))
      .toBe(6);
  });

  it('should fall back to the show rating for an unrated episode', () => {
    expect(toPlaysRating({ episodeIds: [2], showId: 10, ratings })).toBe(6);
  });

  it('should return null without a show or ratings', () => {
    expect(toPlaysRating({ episodeIds: [], showId: undefined, ratings }))
      .toBeNull();
    expect(toPlaysRating({ episodeIds: [1], showId: 10, ratings: null }))
      .toBeNull();
  });
});
