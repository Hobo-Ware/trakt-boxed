import { describe, expect, it } from 'vitest';
import { findUpNextEpisode } from './findUpNextEpisode.ts';

const now = new Date('2025-03-01');
const episode = (id: number, date: string) => ({
  id,
  effectiveReleaseDate: new Date(date),
});

const episodes = [
  episode(1, '2025-01-17'),
  episode(2, '2025-01-24'),
  episode(3, '2025-01-31'),
  episode(4, '2025-03-21'),
];

describe('util: findUpNextEpisode', () => {
  it('should return the first unwatched aired episode', () => {
    expect(
      findUpNextEpisode({ episodes, watchedIds: new Set([1]), now })?.id,
    ).toBe(2);
  });

  it('should skip gaps the user already filled', () => {
    expect(
      findUpNextEpisode({ episodes, watchedIds: new Set([1, 3]), now })?.id,
    ).toBe(2);
  });

  it('should ignore episodes that have not aired', () => {
    expect(
      findUpNextEpisode({ episodes, watchedIds: new Set([1, 2, 3]), now }),
    ).toBeNull();
  });

  it('should return nothing for a season the user has not started', () => {
    expect(findUpNextEpisode({ episodes, watchedIds: new Set(), now }))
      .toBeNull();
  });
});
