import type { SocialActivity } from '$lib/requests/models/SocialActivity.ts';
import { describe, expect, it } from 'vitest';
import { toFriendsPosters } from './toFriendsPosters.ts';
import { toJustWatched } from './toJustWatched.ts';
import { toTimeAgo } from './toTimeAgo.ts';

const user = (id: number) => ({ id, username: `u${id}` });
const movie = (id: number) => ({ id, key: `movie-${id}`, type: 'movie' });
const show = (id: number) => ({ id, key: `show-${id}`, type: 'show' });

function activity(
  props: {
    at: string;
    users: number[];
    movieId?: number;
    showId?: number;
    rating?: number;
  },
): SocialActivity {
  const common = {
    key: `${props.at}-${props.users.join()}`,
    activityAt: new Date(props.at),
    users: props.users.map(user),
    rating: props.rating ?? null,
  };

  return (props.movieId
    ? { ...common, type: 'movie', movie: movie(props.movieId) }
    : {
      ...common,
      type: 'episode',
      show: show(props.showId ?? 0),
      episode: { id: 1 },
    }) as unknown as SocialActivity;
}

describe('util: toFriendsPosters', () => {
  it('should merge friends who watched the same title and keep the order', () => {
    const posters = toFriendsPosters([
      activity({
        at: '2026-09-26T20:00:00Z',
        users: [1],
        movieId: 10,
        rating: 8,
      }),
      activity({ at: '2026-09-26T19:00:00Z', users: [2], showId: 20 }),
      activity({ at: '2026-09-26T18:00:00Z', users: [2, 1], movieId: 10 }),
    ], 10);

    expect(posters.map((poster) => poster.media.key)).toEqual([
      'movie-10',
      'show-20',
    ]);
    expect(posters[0]?.friends.map((friend) => friend.id)).toEqual([1, 2]);
    expect(posters[0]?.rating).toBe(8);
  });

  it('should respect the limit', () => {
    const posters = toFriendsPosters([
      activity({ at: '2026-09-26T20:00:00Z', users: [1], movieId: 1 }),
      activity({ at: '2026-09-26T19:00:00Z', users: [1], movieId: 2 }),
    ], 1);

    expect(posters).toHaveLength(1);
  });
});

describe('util: toJustWatched', () => {
  const now = new Date('2026-09-26T21:00:00Z');

  it('should keep each friend once, newest first, inside the window', () => {
    const entries = toJustWatched({
      now,
      windowHours: 6,
      activities: [
        activity({ at: '2026-09-26T16:00:00Z', users: [1], movieId: 1 }),
        activity({ at: '2026-09-26T20:30:00Z', users: [1], showId: 2 }),
        activity({ at: '2026-09-26T19:00:00Z', users: [2], movieId: 3 }),
        activity({ at: '2026-09-25T20:00:00Z', users: [3], movieId: 4 }),
      ],
    });

    expect(entries.map((entry) => entry.friend.id)).toEqual([1, 2]);
    expect(entries[0]?.activity.type).toBe('episode');
  });
});

describe('util: toTimeAgo', () => {
  const now = new Date('2026-09-26T21:00:00Z');

  it('should pick the largest unit', () => {
    expect(toTimeAgo(now, new Date('2026-09-26T19:00:00Z'), 'en'))
      .toBe('2 hours ago');
    expect(toTimeAgo(now, new Date('2026-09-26T20:45:00Z'), 'en'))
      .toBe('15 minutes ago');
    expect(toTimeAgo(now, new Date('2026-09-25T21:00:00Z'), 'en'))
      .toBe('yesterday');
  });
});
