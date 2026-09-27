import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { findPendingOverride } from '$lib/features/offline/findPendingOverride.ts';
import { isAddEndpoint } from '$lib/features/offline/isAddEndpoint.ts';
import type { OfflineAction } from '$lib/features/offline/models/OfflineAction.ts';
import { toMediaKey } from '$lib/features/offline/toMediaKey.ts';

type WatchedEpisodeIdsParams = {
  history: UserHistory | Nil;
  showId: number;
  episodeIds: ReadonlyArray<number>;
  actions: OfflineAction[];
};

const toPendingWatched = (actions: OfflineAction[], episodeId: number) => {
  const pending = findPendingOverride({
    actions,
    domain: 'history',
    keys: [toMediaKey('episode', episodeId)],
  });

  return pending ? isAddEndpoint(pending.endpoint) : null;
};

export function toWatchedEpisodeIds(
  { history, showId, episodeIds, actions }: WatchedEpisodeIdsParams,
): ReadonlySet<number> {
  const watched = new Set(
    (history?.shows.get(showId)?.episodes ?? []).map((episode) =>
      episode.episodeId
    ),
  );

  return new Set(
    [...watched, ...episodeIds].filter((id) =>
      toPendingWatched(actions, id) ?? watched.has(id)
    ),
  );
}
