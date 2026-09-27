import type { YirDetail } from '$lib/requests/models/YirDetail.ts';
import type { UserStats } from '$lib/requests/models/UserStats.ts';
import { describe, expect, it } from 'vitest';
import { parseStatsYear } from './parseStatsYear.ts';
import { toDecades } from './toDecades.ts';
import { toHighestRated } from './toHighestRated.ts';
import { toMilestones } from './toMilestones.ts';
import { toPlayBars } from './toPlayBars.ts';
import { toProfileTotals } from './toProfileTotals.ts';
import { toRankedCounts } from './toRankedCounts.ts';
import { toStatsTotals } from './toStatsTotals.ts';
import { toStatsYears } from './toStatsYears.ts';

const now = new Date(2026, 8, 27);
const stat = (total: number, weekly = 0) => ({
  total,
  yearly: 0,
  monthly: 0,
  weekly,
  daily: 0,
});
const category = (overrides: Record<string, unknown>) => ({
  minutes: stat(600),
  playCounts: stat(10, 2),
  collectedCounts: stat(0),
  ratingsCounts: stat(0),
  commentsCounts: stat(3),
  ...overrides,
});
const entry = (key: string, type: 'movie' | 'show') => ({
  key,
  type,
  title: key,
});

const detail = {
  stats: {
    all: { ...category({ minutes: stat(6000) }), listsCounts: stat(1) },
    movies: category({
      itemsCount: 12,
      distributions: {
        weekly: [1, 2],
        monthly: [],
        days: [],
        yearly: [{ year: 2024, count: 5 }],
      },
    }),
    shows: category({
      itemsCount: 4,
      playCounts: stat(120, 9),
      distributions: {
        weekly: [3],
        monthly: [],
        days: [],
        yearly: [{ year: 2025, count: 40 }, { year: 2024, count: 2 }],
      },
    }),
  },
  firstWatched: {
    type: 'movie',
    watchedAt: new Date(2026, 0, 1),
    entry: entry('perfect-days', 'movie'),
  },
  mostWatched: {
    shows: [{ plays: 9, minutes: 400, entry: entry('severance', 'show') }],
    movies: [],
  },
  topRated: {
    movies: [{ rating: 9, entry: entry('sinners', 'movie') }],
    shows: [{ rating: 10, entry: entry('andor', 'show') }],
  },
  releaseYears: {
    movies: {
      years: [],
      decades: [{ decade: 1990, count: 2 }, { decade: 2020, count: 5 }],
    },
    shows: { years: [], decades: [{ decade: 2020, count: 3 }] },
  },
} as unknown as YirDetail;

describe('util: parseStatsYear', () => {
  it('should default to the current year', () => {
    expect(parseStatsYear({ value: null, now })).toBe(2026);
    expect(parseStatsYear({ value: '2099', now })).toBe(2026);
    expect(parseStatsYear({ value: 'abc', now })).toBe(2026);
  });

  it('should accept past years and all time', () => {
    expect(parseStatsYear({ value: '2024', now })).toBe(2024);
    expect(parseStatsYear({ value: 'all', now })).toBe('all');
  });
});

describe('util: toStatsYears', () => {
  it('should list the last three years and all time', () => {
    expect(toStatsYears(now)).toEqual([2024, 2025, 2026, 'all']);
  });
});

describe('util: toStatsTotals', () => {
  it('should map titles, episodes, hours and reviews', () => {
    expect(toStatsTotals(detail).map((total) => total.value)).toEqual([
      12,
      120,
      4,
      100,
      3,
    ]);
  });
});

describe('util: toProfileTotals', () => {
  it('should sum reviews across every type', () => {
    const totals = toProfileTotals({
      movies: { watched: 1, comments: 1 },
      shows: { watched: 2, comments: 2 },
      seasons: { comments: 3 },
      episodes: { watched: 30, comments: 4 },
      totalMinutes: 125,
    } as unknown as UserStats);

    expect(totals.map((total) => total.value)).toEqual([1, 30, 2, 2, 10]);
  });
});

describe('util: toPlayBars', () => {
  it('should zip weekly movie and episode plays', () => {
    expect(toPlayBars({ detail, year: 2026 })).toEqual([
      { key: '0', label: '1', movies: 1, episodes: 3 },
      { key: '1', label: '2', movies: 2, episodes: 0 },
    ]);
  });

  it('should merge yearly plays in calendar order for all time', () => {
    expect(
      toPlayBars({ detail, year: 'all' }).map((bar) => [
        bar.label,
        bar.movies,
        bar.episodes,
      ]),
    ).toEqual([['2024', 5, 2], ['2025', 0, 40]]);
  });
});

describe('util: toRankedCounts', () => {
  it('should merge groups by key and keep the top entries', () => {
    const ranked = toRankedCounts({
      groups: [
        [{ key: 'drama', label: 'Drama', count: 3 }, {
          key: 'crime',
          label: 'Crime',
          count: 1,
        }],
        [{ key: 'drama', label: 'Drama', count: 2 }, {
          key: 'comedy',
          label: 'Comedy',
          count: 4,
        }],
      ],
      limit: 2,
    });

    expect(ranked.map((item) => [item.key, item.count])).toEqual([
      ['drama', 5],
      ['comedy', 4],
    ]);
  });
});

describe('util: toDecades', () => {
  it('should sum decades across movies and shows in order', () => {
    expect(toDecades(detail).map((item) => [item.label, item.count])).toEqual([
      ['1990s', 2],
      ['2020s', 8],
    ]);
  });
});

describe('util: toHighestRated', () => {
  it('should sort movies and shows by rating', () => {
    expect(
      toHighestRated({ detail, limit: 6 }).map(({ media }) => media.key),
    ).toEqual(['andor', 'sinners']);
  });
});

describe('util: toMilestones', () => {
  it('should skip milestones without data', () => {
    const milestones = toMilestones({
      detail,
      formatDate: (date) => `${date.getFullYear()}`,
    });

    expect(milestones.map((milestone) => milestone.key)).toEqual([
      'first',
      'show',
    ]);
    expect(milestones.at(0)?.detail).toBe('2026');
  });
});
