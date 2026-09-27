import type { EpisodeActivityHistory } from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';

export function toEpisodeStill(play: EpisodeActivityHistory): string {
  return play.episode.cover.url ?? play.show.cover.url.thumb;
}
