import { describe, expect, it } from 'vitest';
import type { DiaryEntry } from '../DiaryEntry.ts';
import { isEntryLiked } from '$boxed/profile/diary/isEntryLiked.ts';
import { toEntryMedia } from '$boxed/profile/diary/toEntryMedia.ts';
import { toEntryRating } from '$boxed/profile/diary/toEntryRating.ts';
import { toEntryTitle } from './toEntryTitle.ts';
import { toLogTarget } from './toLogTarget.ts';

const movieEntry = {
  type: 'movie',
  key: 'm',
  watchedAt: new Date(),
  isRewatch: false,
  play: { movie: { id: 1, key: 'movie-1', type: 'movie' } },
} as unknown as DiaryEntry;

const episodes = (ids: number[]) =>
  ({
    type: 'episodes',
    key: 'e',
    watchedAt: new Date(),
    isRewatch: false,
    show: { id: 9, key: 'show-9', type: 'show' },
    plays: ids.map((id) => ({ episode: { id } })),
  }) as unknown as DiaryEntry;

const ratings = {
  movies: new Map([[1, { rating: 8 }]]),
  shows: new Map([[9, { rating: 6 }]]),
  episodes: new Map([[100, { rating: 10 }]]),
};

describe('util: toEntryRating', () => {
  it('should read the movie rating', () => {
    expect(toEntryRating({ entry: movieEntry, ratings })).toBe(8);
  });

  it('should prefer the episode rating for a single episode', () => {
    expect(toEntryRating({ entry: episodes([100]), ratings })).toBe(10);
  });

  it('should fall back to the show rating', () => {
    expect(toEntryRating({ entry: episodes([101]), ratings })).toBe(6);
    expect(toEntryRating({ entry: episodes([100, 101]), ratings })).toBe(6);
  });

  it('should return null without ratings', () => {
    expect(toEntryRating({ entry: movieEntry, ratings: null })).toBeNull();
  });
});

describe('util: isEntryLiked', () => {
  const favorites = { movies: new Map([[1, {}]]), shows: new Map() };

  it('should check movie and show favorites', () => {
    expect(isEntryLiked({ entry: movieEntry, favorites })).toBe(true);
    expect(isEntryLiked({ entry: episodes([100]), favorites })).toBe(false);
  });

  it('should be false without favorites', () => {
    expect(isEntryLiked({ entry: movieEntry, favorites: undefined })).toBe(
      false,
    );
  });
});

describe('util: toEntryMedia', () => {
  it('should use the movie or the show as the poster', () => {
    expect(toEntryMedia(movieEntry).key).toBe('movie-1');
    expect(toEntryMedia(episodes([1])).key).toBe('show-9');
  });
});

describe('util: toLogTarget', () => {
  it('should log a movie entry as the movie', () => {
    expect(toLogTarget(movieEntry)).toEqual({
      type: 'movie',
      media: { id: 1, key: 'movie-1', type: 'movie' },
    });
  });

  it('should open the show on the last episode of a group', () => {
    const entry = {
      ...episodes([]),
      plays: [
        { episode: { id: 1, season: 2, number: 4 } },
        { episode: { id: 2, season: 2, number: 6 } },
      ],
    } as unknown as DiaryEntry;

    expect(toLogTarget(entry)).toMatchObject({
      type: 'show',
      season: 2,
      episode: 6,
    });
  });
});

describe('util: toEntryTitle', () => {
  it('should use the movie or show title', () => {
    expect(
      toEntryTitle({
        ...movieEntry,
        play: { movie: { title: 'Sinners' } },
      } as unknown as DiaryEntry),
    ).toBe('Sinners');
    expect(
      toEntryTitle({
        ...episodes([]),
        show: { title: 'Severance' },
      } as unknown as DiaryEntry),
    ).toBe('Severance');
  });
});
