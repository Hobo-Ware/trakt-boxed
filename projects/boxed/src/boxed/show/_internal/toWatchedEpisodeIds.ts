import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';

export function toWatchedEpisodeIds(
  { history, showId }: { history: UserHistory | Nil; showId: number },
): ReadonlySet<number> {
  const episodes = history?.shows.get(showId)?.episodes ?? [];

  return new Set(episodes.map((episode) => episode.episodeId));
}
