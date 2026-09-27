import { describe, expect, it } from 'vitest';
import { toAdjacentEpisodes } from './toAdjacentEpisodes.ts';

const seasons = [
  { number: 0, episodes: { count: 2, aired: 2 } },
  { number: 1, episodes: { count: 9, aired: 9 } },
  { number: 2, episodes: { count: 10, aired: 10 } },
];

describe('util: toAdjacentEpisodes', () => {
  it('should step within a season', () => {
    expect(toAdjacentEpisodes({ seasons, season: 2, episode: 4 })).toEqual({
      previous: { season: 2, episode: 3 },
      next: { season: 2, episode: 5 },
    });
  });

  it('should cross into the neighbouring seasons', () => {
    expect(toAdjacentEpisodes({ seasons, season: 2, episode: 1 }).previous)
      .toEqual({ season: 1, episode: 9 });
    expect(toAdjacentEpisodes({ seasons, season: 1, episode: 9 }).next)
      .toEqual({ season: 2, episode: 1 });
  });

  it('should stop at the ends of the show', () => {
    expect(toAdjacentEpisodes({ seasons, season: 1, episode: 1 }).previous)
      .toBeNull();
    expect(toAdjacentEpisodes({ seasons, season: 2, episode: 10 }).next)
      .toBeNull();
  });

  it('should keep specials apart from the regular seasons', () => {
    expect(toAdjacentEpisodes({ seasons, season: 0, episode: 2 })).toEqual({
      previous: { season: 0, episode: 1 },
      next: null,
    });
  });

  it('should still step back when the season list is missing', () => {
    expect(toAdjacentEpisodes({ seasons: [], season: 3, episode: 2 }))
      .toEqual({ previous: { season: 3, episode: 1 }, next: null });
  });
});
