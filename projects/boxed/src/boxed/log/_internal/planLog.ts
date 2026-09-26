import type { MarkAsWatchedAt } from '$lib/models/MarkAsWatchedAt.ts';
import { countWords } from './countWords.ts';
import type { LogStep } from './LogStep.ts';

export const MIN_REVIEW_WORDS = 5;

export type LogDraft = {
  logWatch: boolean;
  watchedAt: MarkAsWatchedAt;
  rating: number | null;
  isLiked: boolean;
  review: string;
  isSpoiler: boolean;
  note: string;
};

export type LogBaseline = {
  rating: number | null;
  isLiked: boolean;
};

type PlanLogParams = {
  draft: LogDraft;
  baseline: LogBaseline;
  canLike: boolean;
};

export function isReviewTooShort(review: string): boolean {
  const words = countWords(review);
  return words > 0 && words < MIN_REVIEW_WORDS;
}

function ratingSteps(draft: LogDraft, baseline: LogBaseline): LogStep[] {
  if (draft.rating === baseline.rating) return [];
  if (draft.rating === null) return [{ kind: 'unrate' }];

  return [{ kind: 'rate', rating: draft.rating }];
}

function likeSteps(
  draft: LogDraft,
  baseline: LogBaseline,
  canLike: boolean,
): LogStep[] {
  if (!canLike || draft.isLiked === baseline.isLiked) return [];

  return [{ kind: draft.isLiked ? 'like' : 'unlike' }];
}

export function planLog(
  { draft, baseline, canLike }: PlanLogParams,
): LogStep[] {
  const review = draft.review.trim();
  const note = draft.note.trim();

  return [
    ...(draft.logWatch
      ? [{ kind: 'watch', at: draft.watchedAt } as const]
      : []),
    ...ratingSteps(draft, baseline),
    ...likeSteps(draft, baseline, canLike),
    ...(countWords(review) >= MIN_REVIEW_WORDS
      ? [{ kind: 'review', text: review, isSpoiler: draft.isSpoiler } as const]
      : []),
    ...(note ? [{ kind: 'note', text: note } as const] : []),
  ];
}
