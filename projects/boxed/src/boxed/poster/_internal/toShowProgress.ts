type ShowProgressParams = {
  watchedEpisodeCount: number;
  episodeCount: number | Nil;
  isWatched: boolean;
};

export function toShowProgress(
  { watchedEpisodeCount, episodeCount, isWatched }: ShowProgressParams,
): number | null {
  if (isWatched) return null;
  if (!episodeCount || watchedEpisodeCount <= 0) return null;

  return Math.min(watchedEpisodeCount / episodeCount, 1);
}
