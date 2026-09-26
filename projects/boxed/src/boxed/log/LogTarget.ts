import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';

export type LogTarget =
  | { type: 'movie'; media: MediaEntry }
  | { type: 'show'; media: MediaEntry; season?: number; episode?: number };
