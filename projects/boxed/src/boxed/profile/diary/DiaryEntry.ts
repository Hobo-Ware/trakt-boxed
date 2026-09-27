import type { EpisodeActivityHistory } from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import type { MovieActivityHistory } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';

export type DiaryMovieEntry = {
  type: 'movie';
  key: string;
  watchedAt: Date;
  play: MovieActivityHistory;
  isRewatch: boolean;
};

export type DiaryEpisodesEntry = {
  type: 'episodes';
  key: string;
  watchedAt: Date;
  show: EpisodeActivityHistory['show'];
  plays: ReadonlyArray<EpisodeActivityHistory>;
  isRewatch: boolean;
};

export type DiaryEntry = DiaryMovieEntry | DiaryEpisodesEntry;
