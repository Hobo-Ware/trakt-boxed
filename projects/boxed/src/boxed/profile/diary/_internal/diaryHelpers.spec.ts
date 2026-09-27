import type { HistoryEntry } from '$lib/sections/lists/stores/models/HistoryEntry.ts';
import { describe, expect, it } from 'vitest';
import { findRewatches } from './findRewatches.ts';
import { toDiaryEntries } from './toDiaryEntries.ts';
import { toEpisodeRange } from './toEpisodeRange.ts';
import { toMonthBuckets } from './toMonthBuckets.ts';

let playId = 0;

function moviePlay(movieId: number, watchedAt: Date): HistoryEntry {
  const id = ++playId;
  return {
    id,
    key: `movie-${id}`,
    type: 'movie',
    watchedAt,
    movie: { id: movieId, title: `Movie ${movieId}` },
  } as unknown as HistoryEntry;
}

function episodePlay(
  props: { showId: number; season: number; number: number; at: Date },
): HistoryEntry {
  const id = ++playId;
  return {
    id,
    key: `episode-${id}`,
    type: 'episode',
    watchedAt: props.at,
    show: { id: props.showId, title: `Show ${props.showId}` },
    episode: {
      id: props.showId * 1000 + props.season * 100 + props.number,
      season: props.season,
      number: props.number,
    },
  } as unknown as HistoryEntry;
}

const at = (month: number, day: number, hour = 20) =>
  new Date(2026, month - 1, day, hour);

describe('util: toDiaryEntries', () => {
  it('should keep one entry per movie play in history order', () => {
    const entries = toDiaryEntries([
      moviePlay(1, at(9, 26)),
      moviePlay(2, at(9, 21)),
    ]);

    expect(entries.map((entry) => entry.type)).toEqual(['movie', 'movie']);
  });

  it('should collapse episodes of the same show on the same day', () => {
    const entries = toDiaryEntries([
      episodePlay({ showId: 7, season: 2, number: 6, at: at(9, 24, 22) }),
      episodePlay({ showId: 7, season: 2, number: 5, at: at(9, 24, 21) }),
      episodePlay({ showId: 7, season: 2, number: 4, at: at(9, 24, 20) }),
    ]);

    expect(entries).toHaveLength(1);
    const [entry] = entries;
    expect(entry?.type).toBe('episodes');
    if (entry?.type !== 'episodes') return;
    expect(entry.plays.map((play) => play.episode.number)).toEqual([4, 5, 6]);
    expect(entry.watchedAt).toEqual(at(9, 24, 22));
  });

  it('should keep separate entries for the same show on different days', () => {
    const entries = toDiaryEntries([
      episodePlay({ showId: 7, season: 2, number: 2, at: at(9, 25) }),
      episodePlay({ showId: 7, season: 2, number: 1, at: at(9, 24) }),
    ]);

    expect(entries).toHaveLength(2);
  });

  it('should group non-adjacent plays of a show on one day at its latest play', () => {
    const entries = toDiaryEntries([
      episodePlay({ showId: 7, season: 1, number: 2, at: at(9, 24, 23) }),
      moviePlay(3, at(9, 24, 21)),
      episodePlay({ showId: 7, season: 1, number: 1, at: at(9, 24, 18) }),
    ]);

    expect(entries.map((entry) => entry.type)).toEqual(['episodes', 'movie']);
    const [group] = entries;
    expect(group?.type === 'episodes' && group.plays).toHaveLength(2);
  });

  it('should not merge different shows watched on the same day', () => {
    const entries = toDiaryEntries([
      episodePlay({ showId: 7, season: 1, number: 1, at: at(9, 24, 22) }),
      episodePlay({ showId: 8, season: 1, number: 1, at: at(9, 24, 21) }),
    ]);

    expect(entries).toHaveLength(2);
  });

  it('should give grouped entries a stable key per show and day', () => {
    const plays = [
      episodePlay({ showId: 7, season: 1, number: 2, at: at(9, 24, 22) }),
      episodePlay({ showId: 7, season: 1, number: 1, at: at(9, 24, 21) }),
    ];

    const first = toDiaryEntries(plays).map((entry) => entry.key);
    const again = toDiaryEntries(plays.slice(0, 1)).map((entry) => entry.key);

    expect(first).toEqual(again);
  });

  it('should flag a movie as a rewatch when an older play exists', () => {
    const entries = toDiaryEntries([
      moviePlay(1, at(9, 26)),
      moviePlay(2, at(9, 20)),
      moviePlay(1, at(8, 3)),
    ]);

    expect(entries.map((entry) => entry.isRewatch)).toEqual([
      true,
      false,
      false,
    ]);
  });

  it('should flag an episode group as a rewatch only when every play is one', () => {
    const entries = toDiaryEntries([
      episodePlay({ showId: 7, season: 1, number: 2, at: at(9, 24, 22) }),
      episodePlay({ showId: 7, season: 1, number: 1, at: at(9, 24, 21) }),
      episodePlay({ showId: 7, season: 1, number: 1, at: at(8, 1) }),
    ]);

    expect(entries.map((entry) => entry.isRewatch)).toEqual([false, false]);
  });

  it('should return nothing for an empty history', () => {
    expect(toDiaryEntries([])).toEqual([]);
  });
});

describe('util: findRewatches', () => {
  it('should mark every play after the first as a rewatch', () => {
    const plays = [
      moviePlay(1, at(9, 3)),
      moviePlay(1, at(9, 2)),
      moviePlay(1, at(9, 1)),
    ];

    const rewatches = findRewatches(plays);

    expect([...rewatches]).toEqual([plays[1]?.key, plays[0]?.key]);
  });

  it('should treat movies and episodes with the same id as different items', () => {
    const plays = [
      episodePlay({ showId: 0, season: 0, number: 1, at: at(9, 2) }),
      moviePlay(1, at(9, 1)),
    ];

    expect(findRewatches(plays).size).toBe(0);
  });
});

describe('util: toMonthBuckets', () => {
  it('should bucket consecutive entries by calendar month', () => {
    const buckets = toMonthBuckets([
      { watchedAt: at(9, 26) },
      { watchedAt: at(9, 3) },
      { watchedAt: at(8, 30) },
    ]);

    expect(buckets.map((bucket) => bucket.key)).toEqual(['2026-9', '2026-8']);
    expect(buckets.map((bucket) => bucket.entries.length)).toEqual([2, 1]);
    expect(buckets.at(0)?.month).toEqual(new Date(2026, 8, 1));
  });

  it('should keep the same month in different years apart', () => {
    const buckets = toMonthBuckets([
      { watchedAt: new Date(2026, 0, 2) },
      { watchedAt: new Date(2025, 0, 2) },
    ]);

    expect(buckets).toHaveLength(2);
  });

  it('should return no buckets for no entries', () => {
    expect(toMonthBuckets([])).toEqual([]);
  });
});

describe('util: toEpisodeRange', () => {
  it('should describe a single episode', () => {
    expect(toEpisodeRange([{ season: 2, number: 4 }])).toEqual({
      type: 'single',
      season: 2,
      episode: 4,
    });
  });

  it('should describe a run inside one season', () => {
    expect(
      toEpisodeRange([
        { season: 2, number: 4 },
        { season: 2, number: 5 },
        { season: 2, number: 6 },
      ]),
    ).toEqual({ type: 'season', season: 2, first: 4, last: 6 });
  });

  it('should describe a run across seasons', () => {
    expect(
      toEpisodeRange([{ season: 1, number: 9 }, { season: 2, number: 1 }]),
    ).toEqual({
      type: 'span',
      from: { season: 1, number: 9 },
      to: { season: 2, number: 1 },
    });
  });

  it('should treat a repeated single episode as single', () => {
    expect(
      toEpisodeRange([{ season: 1, number: 1 }, { season: 1, number: 1 }]),
    ).toEqual({ type: 'single', season: 1, episode: 1 });
  });

  it('should return null without episodes', () => {
    expect(toEpisodeRange([])).toBeNull();
  });
});
