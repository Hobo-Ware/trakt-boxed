import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { WatchedShow } from '$lib/features/auth/queries/currentUserWatchedShowsQuery.ts';
import { describe, expect, it } from 'vitest';
import { toWatchedEpisodeIds } from './toWatchedEpisodeIds.ts';

describe('util: toWatchedEpisodeIds', () => {
  it('should collect the watched episode ids of one show', () => {
    const history = {
      movies: new Map(),
      shows: new Map([
        [7, { episodes: [{ episodeId: 1 }, { episodeId: 2 }] } as WatchedShow],
      ]),
    } as UserHistory;

    expect(toWatchedEpisodeIds({ history, showId: 7 }))
      .toEqual(new Set([1, 2]));
  });

  it('should be empty without history or for an unwatched show', () => {
    expect(toWatchedEpisodeIds({ history: null, showId: 7 }).size).toBe(0);
    expect(
      toWatchedEpisodeIds({
        history: { movies: new Map(), shows: new Map() },
        showId: 7,
      }).size,
    ).toBe(0);
  });
});
