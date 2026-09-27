type EpisodeCode = { season: number; number: number };

export type EpisodeRange =
  | { type: 'single'; season: number; episode: number }
  | { type: 'season'; season: number; first: number; last: number }
  | { type: 'span'; from: EpisodeCode; to: EpisodeCode };

export function toEpisodeRange(
  episodes: ReadonlyArray<EpisodeCode>,
): EpisodeRange | null {
  const first = episodes.at(0);
  const last = episodes.at(-1);
  if (!first || !last) return null;

  if (first.season === last.season && first.number === last.number) {
    return { type: 'single', season: first.season, episode: first.number };
  }

  if (first.season === last.season) {
    return {
      type: 'season',
      season: first.season,
      first: first.number,
      last: last.number,
    };
  }

  return { type: 'span', from: first, to: last };
}
