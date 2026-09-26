import type { MarkAsWatchedAt } from '$lib/models/MarkAsWatchedAt.ts';

export type LogStep =
  | { kind: 'watch'; at: MarkAsWatchedAt }
  | { kind: 'rate'; rating: number }
  | { kind: 'unrate' }
  | { kind: 'like' }
  | { kind: 'unlike' }
  | { kind: 'review'; text: string; isSpoiler: boolean }
  | { kind: 'note'; text: string };
