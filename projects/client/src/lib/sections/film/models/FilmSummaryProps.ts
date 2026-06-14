import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaStudio } from '$lib/requests/models/MediaStudio.ts';
import type { MediaVideo } from '$lib/requests/models/MediaVideo.ts';
import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { Season } from '$lib/requests/models/Season.ts';
import type { SentimentAnalysis } from '$lib/requests/models/SentimentAnalysis.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
export type FilmKind = 'movie' | 'show';

import type { StreamingServiceOption, StreamingServiceOptions } from '$lib/requests/models/StreamingServiceOptions.ts';

export type FilmStreamingState = {
  services: StreamingServiceOptions;
  preferred?: StreamingServiceOption;
} | undefined;

export type FilmIntl = {
  title?: string;
  overview?: string;
  tagline?: string;
} | undefined;

export type FilmSummaryProps = {
  type: FilmKind;
  media: MovieEntry | ShowEntry | MediaEntry;
  studios: MediaStudio[];
  crew: MediaCrew;
  intl: FilmIntl;
  streamOn: FilmStreamingState;
  videos: MediaVideo[];
  sentiment: SentimentAnalysis | Nil;
  seasons?: ReadonlyArray<Season>;
};
