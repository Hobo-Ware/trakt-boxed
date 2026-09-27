import { describe, expect, it } from 'vitest';
import { toExternalRatings } from './toExternalRatings.ts';

describe('util: toExternalRatings', () => {
  it('should list the sources that have a score, in a fixed order', () => {
    const ratings = toExternalRatings(
      {
        imdb: { rating: 8.5, votes: 600000 },
        rotten: { critic: 0.92, audience: 0.95 },
        tmdb: { rating: 8.2 },
        mal: { rating: 7.1 },
      },
      'en',
      10,
    );

    expect(ratings.map(({ source, value }) => [source, value])).toEqual([
      ['imdb', '8.5'],
      ['rotten-critic', '92%'],
      ['rotten-audience', '95%'],
      ['tmdb', '8.2'],
      ['mal', '7.1'],
    ]);
  });

  it('should skip missing or zero scores and respect the limit', () => {
    const ratings = toExternalRatings(
      {
        imdb: { rating: 0, votes: 0 },
        rotten: { critic: 0.4, audience: null },
        letterboxd: { rating: 4.1 },
        tmdb: { rating: 6.9 },
      },
      'en',
      2,
    );

    expect(ratings.map((rating) => rating.source)).toEqual([
      'rotten-critic',
      'tmdb',
    ]);
  });
});
