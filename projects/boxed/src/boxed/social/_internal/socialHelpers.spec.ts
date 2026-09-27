import type { SocialActivity } from '$lib/requests/models/SocialActivity.ts';
import type { HistoryEntry } from '$lib/sections/lists/stores/models/HistoryEntry.ts';
import { describe, expect, it } from 'vitest';
import { fromHistoryEntries } from './fromHistoryEntries.ts';
import { fromSocialActivity } from './fromSocialActivity.ts';
import { parseActivityTab } from './parseActivityTab.ts';
import { toActivityDays } from './toActivityDays.ts';

const poster = { url: { thumb: 'https://img/poster.jpg', medium: '' } };
const user = {
  id: 1,
  key: 'user-1',
  username: 'jonas',
  slug: 'jonas',
  name: { full: 'Jonas', first: 'Jonas', last: '' },
  avatar: { url: 'https://img/jonas.jpg' },
};
const actor = { name: 'Sean', href: '/profile/me', avatar: '' };

const movie = (id: number, watchedAt: string) => ({
  id,
  key: `movie-play-${id}`,
  type: 'movie',
  watchedAt: new Date(watchedAt),
  movie: { id: 100 + id, slug: `movie-${id}`, title: `Movie ${id}`, poster },
});

const episode = (id: number, number: number, watchedAt: string) => ({
  id,
  key: `episode-play-${id}`,
  type: 'episode',
  watchedAt: new Date(watchedAt),
  show: { id: 7, slug: 'severance', title: 'Severance', poster },
  episode: { id: 700 + number, season: 2, number, type: 'standard' },
});

describe('util: parseActivityTab', () => {
  it('should default to friends', () => {
    expect(parseActivityTab(null)).toBe('friends');
    expect(parseActivityTab('nope')).toBe('friends');
  });

  it('should accept the you tab', () => {
    expect(parseActivityTab('you')).toBe('you');
  });
});

describe('util: toActivityDays', () => {
  it('should group events by calendar day, newest first', () => {
    const days = toActivityDays([
      { key: 'a', at: new Date(2026, 8, 24, 10) },
      { key: 'b', at: new Date(2026, 8, 26, 9) },
      { key: 'c', at: new Date(2026, 8, 26, 21) },
    ]);

    expect(days.map((day) => day.events.map((event) => event.key))).toEqual([
      ['c', 'b'],
      ['a'],
    ]);
  });
});

describe('util: fromSocialActivity', () => {
  it('should map a movie activity with its rating and extra members', () => {
    const event = fromSocialActivity({
      key: '1',
      type: 'movie',
      activityAt: new Date(2026, 8, 26),
      users: [user, { ...user, id: 2, slug: 'mira' }],
      rating: 8,
      movie: { slug: 'sinners', title: 'Sinners', poster },
    } as unknown as SocialActivity);

    expect(event).toMatchObject({
      title: 'Sinners',
      href: '/movies/sinners',
      rating: 8,
      others: 1,
      code: null,
      actor: { name: 'Jonas', href: '/profile/jonas' },
    });
  });
});

describe('util: fromHistoryEntries', () => {
  it('should fold same-day plays of one season into a single event', () => {
    const events = fromHistoryEntries({
      entries: [
        episode(3, 6, '2026-09-26T22:00:00'),
        episode(2, 5, '2026-09-26T21:00:00'),
        movie(1, '2026-09-25T20:00:00'),
      ] as unknown as HistoryEntry[],
      actor,
      ratings: {
        movies: new Map([[101, { rating: 9 }]]),
        shows: new Map([[7, { rating: 7 }]]),
        episodes: new Map(),
      },
    });

    expect(events.map((event) => [event.title, event.rating])).toEqual([
      ['Severance', 7],
      ['Movie 1', 9],
    ]);
    expect(events.at(0)?.key).toBe('episode-play-3');
  });

  it('should keep plays from different days apart', () => {
    const events = fromHistoryEntries({
      entries: [
        episode(2, 5, '2026-09-26T21:00:00'),
        episode(1, 4, '2026-09-24T21:00:00'),
      ] as unknown as HistoryEntry[],
      actor,
      ratings: null,
    });

    expect(events).toHaveLength(2);
    expect(events.every((event) => event.rating === null)).toBe(true);
  });
});
