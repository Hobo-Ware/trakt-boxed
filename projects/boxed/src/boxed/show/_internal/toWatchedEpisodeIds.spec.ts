import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { WatchedShow } from '$lib/features/auth/queries/currentUserWatchedShowsQuery.ts';
import type { OfflineAction } from '$lib/features/offline/models/OfflineAction.ts';
import { describe, expect, it } from 'vitest';
import { toWatchedEpisodeIds } from './toWatchedEpisodeIds.ts';

const history = {
  movies: new Map(),
  shows: new Map([
    [7, { episodes: [{ episodeId: 1 }, { episodeId: 2 }] } as WatchedShow],
  ]),
} as UserHistory;

const queued = (
  endpoint: 'history:add' | 'history:remove',
  episodeIds: number[],
) =>
  ({
    id: endpoint,
    endpoint,
    keys: episodeIds.map((id) => `episode:${id}`),
    body: null,
    invalidations: [],
    queuedAt: 0,
  }) as OfflineAction;

describe('util: toWatchedEpisodeIds', () => {
  it('should collect the watched episode ids of one show', () => {
    expect(
      toWatchedEpisodeIds({ history, showId: 7, episodeIds: [], actions: [] }),
    ).toEqual(new Set([1, 2]));
  });

  it('should be empty without history or for an unwatched show', () => {
    expect(
      toWatchedEpisodeIds({
        history: null,
        showId: 7,
        episodeIds: [1],
        actions: [],
      }).size,
    ).toBe(0);
    expect(
      toWatchedEpisodeIds({ history, showId: 8, episodeIds: [], actions: [] })
        .size,
    ).toBe(0);
  });

  it('should apply watched marks still queued offline', () => {
    const ids = toWatchedEpisodeIds({
      history,
      showId: 7,
      episodeIds: [1, 2, 3, 4],
      actions: [queued('history:add', [3, 4]), queued('history:remove', [2])],
    });

    expect(ids).toEqual(new Set([1, 3, 4]));
  });
});
