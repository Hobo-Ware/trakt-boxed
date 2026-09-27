export type ShowBadge =
  | { type: 'completed' }
  | { type: 'dropped' }
  | { type: 'progress'; watched: number; total: number };

type ShowBadgeParams = {
  watchedEpisodeCount: number;
  episodeCount: number | Nil;
  isWatched: boolean;
  isDropped: boolean;
};

export function toShowBadge(
  { watchedEpisodeCount, episodeCount, isWatched, isDropped }: ShowBadgeParams,
): ShowBadge | null {
  if (isDropped) return { type: 'dropped' };
  if (isWatched) return { type: 'completed' };
  if (!episodeCount || watchedEpisodeCount <= 0) return null;

  return {
    type: 'progress',
    watched: Math.min(watchedEpisodeCount, episodeCount),
    total: episodeCount,
  };
}
