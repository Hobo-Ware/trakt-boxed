import type { Season } from '$lib/requests/models/Season.ts';

export type EpisodeCoordinates = {
  season: number;
  episode: number;
};

type AdjacentEpisodesParams = EpisodeCoordinates & {
  seasons: ReadonlyArray<Pick<Season, 'number' | 'episodes'>>;
};

export type AdjacentEpisodes = {
  previous: EpisodeCoordinates | null;
  next: EpisodeCoordinates | null;
};

export function toAdjacentEpisodes(
  { seasons, season, episode }: AdjacentEpisodesParams,
): AdjacentEpisodes {
  const isSpecials = season === 0;
  const ordered = seasons
    .filter((item) => item.episodes.count > 0)
    .filter((item) => (item.number === 0) === isSpecials)
    .toSorted((left, right) => left.number - right.number);

  const index = ordered.findIndex((item) => item.number === season);
  const current = ordered.at(index);
  const before = index > 0 ? ordered.at(index - 1) : undefined;
  const after = index >= 0 ? ordered.at(index + 1) : undefined;
  const count = current?.number === season ? current.episodes.count : episode;

  const previous = episode > 1
    ? { season, episode: episode - 1 }
    : before
    ? { season: before.number, episode: before.episodes.count }
    : null;

  const next = episode < count
    ? { season, episode: episode + 1 }
    : after
    ? { season: after.number, episode: 1 }
    : null;

  return { previous, next };
}
