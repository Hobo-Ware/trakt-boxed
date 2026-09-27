type UpNextCandidate = {
  id: number;
  effectiveReleaseDate: Date;
};

type FindUpNextEpisodeParams<T extends UpNextCandidate> = {
  episodes: ReadonlyArray<T>;
  watchedIds: ReadonlySet<number>;
  now: Date;
};

export function findUpNextEpisode<T extends UpNextCandidate>(
  { episodes, watchedIds, now }: FindUpNextEpisodeParams<T>,
): T | null {
  const hasStarted = episodes.some((episode) => watchedIds.has(episode.id));
  if (!hasStarted) return null;

  return episodes.find((episode) =>
    !watchedIds.has(episode.id) &&
    episode.effectiveReleaseDate.getTime() <= now.getTime()
  ) ?? null;
}
