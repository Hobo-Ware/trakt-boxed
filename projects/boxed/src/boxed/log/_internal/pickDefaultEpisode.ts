type PickDefaultEpisodeParams = {
  episodeNumbers: ReadonlyArray<number>;
  watchedNumbers: ReadonlySet<number>;
  airedNumbers: ReadonlySet<number>;
  preferred?: number;
};

export function pickDefaultEpisode(
  { episodeNumbers, watchedNumbers, airedNumbers, preferred }:
    PickDefaultEpisodeParams,
): number | null {
  if (preferred !== undefined && episodeNumbers.includes(preferred)) {
    return preferred;
  }

  return episodeNumbers.find((number) =>
    !watchedNumbers.has(number) && airedNumbers.has(number)
  ) ?? null;
}
