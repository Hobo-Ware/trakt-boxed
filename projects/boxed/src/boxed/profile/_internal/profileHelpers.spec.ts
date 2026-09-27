import type { HistoryEntry } from '$lib/sections/lists/stores/models/HistoryEntry.ts';
import { describe, expect, it } from 'vitest';
import { countPlaysInYear } from './countPlaysInYear.ts';
import { parseListsTab } from './parseListsTab.ts';
import { parseWatchingTab } from './parseWatchingTab.ts';
import { parseWatchlistSort } from './parseWatchlistSort.ts';
import { toRatingSummary } from './toRatingSummary.ts';
import { toShowBadge } from './toShowBadge.ts';
import { toWatchedTitles } from './toWatchedTitles.ts';
import { toWatchlistCounts } from './toWatchlistCounts.ts';
import { toYearHeatmap } from './toYearHeatmap.ts';

const moviePlay = (key: string, movieId: number) =>
  ({
    key,
    type: 'movie',
    watchedAt: new Date(2026, 8, 1),
    movie: { id: movieId, key: `movie-${movieId}`, type: 'movie' },
  }) as unknown as HistoryEntry;

const episodePlay = (key: string, showId: number) =>
  ({
    key,
    type: 'episode',
    watchedAt: new Date(2026, 8, 1),
    show: { id: showId, key: `show-${showId}`, type: 'show' },
    episode: { id: 1, season: 1, number: 1 },
  }) as unknown as HistoryEntry;

describe('util: toWatchedTitles', () => {
  it('should keep each title once in first-seen order', () => {
    const titles = toWatchedTitles([
      moviePlay('p1', 1),
      moviePlay('p2', 2),
      moviePlay('p3', 1),
    ]);

    expect(titles.map((title) => title.key)).toEqual(['movie-1', 'movie-2']);
  });

  it('should turn episode plays into their show', () => {
    const titles = toWatchedTitles([
      episodePlay('p1', 5),
      episodePlay('p2', 5),
      episodePlay('p3', 6),
    ]);

    expect(titles.map((title) => title.key)).toEqual(['show-5', 'show-6']);
    expect(titles.every((title) => title.type === 'show')).toBe(true);
  });
});

describe('util: toYearHeatmap', () => {
  const now = new Date(2026, 8, 23, 12);

  it('should build whole weeks ending with the current week', () => {
    const cells = toYearHeatmap({ dates: [], now, weeks: 2 });

    expect(cells).toHaveLength(14);
    expect(cells.at(0)?.date.getDay()).toBe(0);
    expect(cells.at(-1)?.date.getDay()).toBe(6);
    expect(cells.some((cell) => cell.key === '2026-9-23')).toBe(true);
  });

  it('should count plays per day and map them to levels', () => {
    const cells = toYearHeatmap({
      dates: [
        new Date(2026, 8, 22, 9),
        new Date(2026, 8, 22, 21),
        new Date(2026, 8, 21, 20),
        ...Array.from({ length: 6 }, () => new Date(2026, 8, 20, 20)),
      ],
      now,
      weeks: 1,
    });
    const byKey = new Map(cells.map((cell) => [cell.key, cell]));

    expect(byKey.get('2026-9-22')).toMatchObject({ count: 2, level: 2 });
    expect(byKey.get('2026-9-21')).toMatchObject({ count: 1, level: 1 });
    expect(byKey.get('2026-9-20')).toMatchObject({ count: 6, level: 4 });
    expect(byKey.get('2026-9-23')).toMatchObject({ count: 0, level: 0 });
  });

  it('should mark days after today as future', () => {
    const cells = toYearHeatmap({ dates: [], now, weeks: 1 });

    expect(cells.filter((cell) => cell.isFuture).map((cell) => cell.key))
      .toEqual(['2026-9-24', '2026-9-25', '2026-9-26']);
  });

  it('should ignore plays outside the window', () => {
    const cells = toYearHeatmap({
      dates: [new Date(2020, 0, 1)],
      now,
      weeks: 1,
    });

    expect(cells.every((cell) => cell.count === 0)).toBe(true);
  });
});

describe('util: countPlaysInYear', () => {
  it('should count only plays in the given year', () => {
    expect(
      countPlaysInYear({
        dates: [
          new Date(2026, 0, 1),
          new Date(2026, 11, 31, 23),
          new Date(2025, 11, 31, 23),
        ],
        year: 2026,
      }),
    ).toBe(2);
  });
});

describe('util: toRatingSummary', () => {
  it('should build ten bars relative to the busiest rating', () => {
    const summary = toRatingSummary({
      1: 0,
      2: 1,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 4,
      9: 0,
      10: 2,
    });

    expect(summary.bars).toHaveLength(10);
    expect(summary.bars.at(7)).toEqual({ rating: 8, count: 4, ratio: 1 });
    expect(summary.bars.at(9)?.ratio).toBe(0.5);
    expect(summary.total).toBe(7);
    expect(summary.average).toBeCloseTo((2 + 32 + 20) / 7);
    expect(summary.mostGiven).toBe(8);
  });

  it('should prefer the lower rating on a tie for most given', () => {
    const summary = toRatingSummary({
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 3,
      7: 0,
      8: 3,
      9: 0,
      10: 0,
    });

    expect(summary.mostGiven).toBe(6);
  });

  it('should return empty bars without ratings', () => {
    const summary = toRatingSummary(null);

    expect(summary.total).toBe(0);
    expect(summary.average).toBeNull();
    expect(summary.mostGiven).toBeNull();
    expect(summary.bars.every((bar) => bar.ratio === 0)).toBe(true);
  });
});

describe('util: toShowBadge', () => {
  it('should prefer dropped over any progress', () => {
    expect(
      toShowBadge({
        watchedEpisodeCount: 26,
        episodeCount: 26,
        isWatched: true,
        isDropped: true,
      }),
    ).toEqual({ type: 'dropped' });
  });

  it('should mark a fully watched show as completed', () => {
    expect(
      toShowBadge({
        watchedEpisodeCount: 19,
        episodeCount: 19,
        isWatched: true,
        isDropped: false,
      }),
    ).toEqual({ type: 'completed' });
  });

  it('should show watched of total for a started show', () => {
    expect(
      toShowBadge({
        watchedEpisodeCount: 14,
        episodeCount: 19,
        isWatched: false,
        isDropped: false,
      }),
    ).toEqual({ type: 'progress', watched: 14, total: 19 });
  });

  it('should return no badge without progress or a known episode count', () => {
    expect(
      toShowBadge({
        watchedEpisodeCount: 0,
        episodeCount: 19,
        isWatched: false,
        isDropped: false,
      }),
    ).toBeNull();
    expect(
      toShowBadge({
        watchedEpisodeCount: 3,
        episodeCount: Number.NaN,
        isWatched: false,
        isDropped: false,
      }),
    ).toBeNull();
  });
});

describe('util: toWatchlistCounts', () => {
  it('should count watchlisted movies and shows', () => {
    expect(
      toWatchlistCounts({ movies: new Set([1, 2, 3]), shows: new Set([4]) }),
    ).toEqual({ movies: 3, shows: 1 });
  });

  it('should return null while the watchlist is loading', () => {
    expect(toWatchlistCounts(undefined)).toBeNull();
  });
});

describe('util: parseWatchingTab', () => {
  it('should accept a known tab', () => {
    expect(parseWatchingTab('dropped')).toBe('dropped');
  });

  it('should fall back to up next', () => {
    expect(parseWatchingTab('nope')).toBe('up-next');
    expect(parseWatchingTab(null)).toBe('up-next');
  });
});

describe('util: parseWatchlistSort', () => {
  it('should accept a known sort and default to added', () => {
    expect(parseWatchlistSort('title')).toBe('title');
    expect(parseWatchlistSort('percentage')).toBe('added');
    expect(parseWatchlistSort(undefined)).toBe('added');
  });
});

describe('util: parseListsTab', () => {
  it('should accept personal and collaboration for anyone', () => {
    expect(parseListsTab({ value: 'collaboration', isMe: false })).toBe(
      'collaboration',
    );
  });

  it('should only allow liked lists for the owner', () => {
    expect(parseListsTab({ value: 'liked', isMe: true })).toBe('liked');
    expect(parseListsTab({ value: 'liked', isMe: false })).toBe('personal');
  });

  it('should default to personal', () => {
    expect(parseListsTab({ value: null, isMe: true })).toBe('personal');
  });
});
