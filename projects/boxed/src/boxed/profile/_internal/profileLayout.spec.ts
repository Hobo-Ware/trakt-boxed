import type { UserStats } from '$lib/requests/models/UserStats.ts';
import { describe, expect, it } from 'vitest';
import { toProfileStats } from './toProfileStats.ts';
import { toProfileTabs } from './toProfileTabs.ts';

describe('util: toProfileTabs', () => {
  it('should include owner-only tabs for the owner', () => {
    const ids = toProfileTabs({ slug: 'me', isMe: true }).map((tab) => tab.id);

    expect(ids).toEqual([
      'profile',
      'diary',
      'films',
      'shows',
      'watching',
      'reviews',
      'watchlist',
      'lists',
      'likes',
      'network',
      'stats',
    ]);
  });

  it('should hide owner-only tabs for other members', () => {
    const ids = toProfileTabs({ slug: 'sean', isMe: false }).map((tab) =>
      tab.id
    );

    expect(ids).not.toContain('watching');
    expect(ids).not.toContain('watchlist');
    expect(ids).not.toContain('reviews');
  });

  it('should link new pages under the profile and the rest to legacy routes', () => {
    const tabs = new Map(
      toProfileTabs({ slug: 'sean', isMe: false }).map((tab) => [
        tab.id,
        tab.href,
      ]),
    );

    expect(tabs.get('diary')).toBe('/profile/sean/diary');
    expect(tabs.get('likes')).toBe('/profile/sean/favorites');
    expect(tabs.get('network')).toBe('/profile/sean/social');
    expect(tabs.get('stats')).toBe('/users/sean/year/all');
  });
});

describe('util: toProfileStats', () => {
  const stats = {
    movies: { watched: 10 },
    shows: { watched: 4 },
    episodes: { watched: 300 },
    network: { following: 2, followers: 5 },
    lists: 3,
  } as unknown as UserStats;

  it('should map stats in board order with this year', () => {
    expect(
      toProfileStats({ stats, thisYear: 42, showThisYear: true }).map((stat) =>
        stat.value
      ),
    ).toEqual([10, 4, 300, 42, 3, 2, 5]);
  });

  it('should drop this year for other members', () => {
    expect(
      toProfileStats({ stats, thisYear: null, showThisYear: false }).map((
        stat,
      ) => stat.key),
    ).not.toContain('year');
  });

  it('should mark values pending while loading and missing when hidden', () => {
    const pending = toProfileStats({
      stats: undefined,
      thisYear: null,
      showThisYear: true,
    });
    const hidden = toProfileStats({
      stats: null,
      thisYear: 3,
      showThisYear: false,
    });

    expect(pending.every((stat) => stat.value === undefined)).toBe(true);
    expect(hidden.every((stat) => stat.value === null)).toBe(true);
  });
});
