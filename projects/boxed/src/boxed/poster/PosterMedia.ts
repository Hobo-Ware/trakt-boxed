import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';

export type PosterMedia = MediaEntry & {
  type: 'movie' | 'show';
  episode?: { count: number };
};
