type SeasonProgress = { number: number; aired: number };

type PickDefaultSeasonParams = {
  seasons: ReadonlyArray<SeasonProgress>;
  playsPerSeason: ReadonlyMap<number, number>;
};

export function pickDefaultSeason(
  { seasons, playsPerSeason }: PickDefaultSeasonParams,
): number | null {
  const unfinished = seasons.find(
    (season) => (playsPerSeason.get(season.number) ?? 0) < season.aired,
  );

  return unfinished?.number ?? seasons.at(-1)?.number ?? null;
}
