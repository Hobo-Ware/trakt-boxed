import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { MediaCredit } from '$lib/requests/models/MediaCredits.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toPersonCredits } from './toPersonCredits.ts';

const credit = (id: number, year: number | null): MediaCredit => ({
  type: 'cast',
  key: `movie-${id}`,
  character: 'Mr. Reed',
  media: { ...MovieHereticMappedMock, id, key: `movie-${id}`, year },
});

const credits = [
  credit(1, 2010),
  credit(2, 2024),
  credit(3, null),
  credit(1, 2010),
];

const historyWith = (...ids: number[]): UserHistory => ({
  movies: new Map(ids.map((id) => [id, {} as never])),
  shows: new Map(),
});

describe('util: toPersonCredits', () => {
  it('should keep the api order and drop duplicate titles', () => {
    const result = toPersonCredits({
      credits,
      sort: 'popular',
      history: null,
      hideWatched: false,
    });

    expect(result.posters.map((media) => media.id)).toEqual([1, 2, 3]);
    expect(result.total).toBe(3);
  });

  it('should sort newest first with unknown years last', () => {
    const result = toPersonCredits({
      credits,
      sort: 'newest',
      history: null,
      hideWatched: false,
    });

    expect(result.posters.map((media) => media.id)).toEqual([2, 1, 3]);
  });

  it('should sort oldest first with unknown years last', () => {
    const result = toPersonCredits({
      credits,
      sort: 'oldest',
      history: null,
      hideWatched: false,
    });

    expect(result.posters.map((media) => media.id)).toEqual([1, 2, 3]);
  });

  it('should count watched titles and hide them on request', () => {
    const result = toPersonCredits({
      credits,
      sort: 'popular',
      history: historyWith(2),
      hideWatched: true,
    });

    expect(result.seen).toBe(1);
    expect(result.total).toBe(3);
    expect(result.posters.map((media) => media.id)).toEqual([1, 3]);
  });
});
