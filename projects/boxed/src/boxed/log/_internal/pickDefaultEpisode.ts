type PickDefaultEpisodeParams = {
  episodeNumbers: ReadonlyArray<number>;
  watchedNumbers: ReadonlySet<number>;
  preferred?: number;
};

export function pickDefaultEpisode(
  { episodeNumbers, watchedNumbers, preferred }: PickDefaultEpisodeParams,
): number | null {
  if (preferred !== undefined && episodeNumbers.includes(preferred)) {
    return preferred;
  }

  return episodeNumbers.find((number) => !watchedNumbers.has(number)) ?? null;
}
