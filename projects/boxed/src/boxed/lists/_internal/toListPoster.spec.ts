import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { describe, expect, it } from 'vitest';
import { toListPoster } from './toListPoster.ts';

const show = {
  id: 7,
  key: 'show-7',
  type: 'show',
  poster: { url: { medium: 'https://show/m', thumb: 'https://show/t' } },
};

const seasonItem = (key: string, poster?: unknown) =>
  ({
    type: 'season',
    key,
    rank: 1,
    entry: { show, season: { number: 1, poster } },
  }) as unknown as ListItem;

describe('util: toListPoster', () => {
  it('should give every list item its own key, even for the same show', () => {
    const first = toListPoster(seasonItem('season-1'));
    const second = toListPoster(seasonItem('season-2'));

    expect(first.key).toBe('season-1');
    expect(second.key).toBe('season-2');
    expect(first.id).toBe(7);
  });

  it('should prefer the season poster and fall back to the show poster', () => {
    const seasonPoster = {
      url: { medium: 'https://s/m', thumb: 'https://s/t' },
    };

    expect(toListPoster(seasonItem('a', seasonPoster)).poster).toBe(
      seasonPoster,
    );
    expect(toListPoster(seasonItem('b')).poster).toBe(show.poster);
  });

  it('should keep movies and shows as their own entries', () => {
    const movieItem = {
      type: 'movie',
      key: 'list-item-1',
      entry: { id: 1, key: 'movie-1', type: 'movie' },
    } as unknown as ListItem;

    expect(toListPoster(movieItem)).toMatchObject({
      id: 1,
      key: 'list-item-1',
    });
  });
});
