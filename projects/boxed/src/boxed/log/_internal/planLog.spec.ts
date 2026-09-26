import { describe, expect, it } from 'vitest';
import { isReviewTooShort, type LogDraft, planLog } from './planLog.ts';

const EMPTY_DRAFT: LogDraft = {
  logWatch: true,
  watchedAt: 'now',
  rating: null,
  isLiked: false,
  review: '',
  isSpoiler: false,
  note: '',
};

const NO_BASELINE = { rating: null, isLiked: false };

describe('util: planLog', () => {
  it('should only log the watch for an untouched draft', () => {
    expect(
      planLog({ draft: EMPTY_DRAFT, baseline: NO_BASELINE, canLike: true }),
    )
      .toEqual([{ kind: 'watch', at: 'now' }]);
  });

  it('should run every changed field in diary order', () => {
    const draft: LogDraft = {
      ...EMPTY_DRAFT,
      watchedAt: 'released',
      rating: 9,
      isLiked: true,
      review: '  A quiet film that stays with you.  ',
      isSpoiler: true,
      note: ' saw it with Mira ',
    };

    expect(planLog({ draft, baseline: NO_BASELINE, canLike: true })).toEqual([
      { kind: 'watch', at: 'released' },
      { kind: 'rate', rating: 9 },
      { kind: 'like' },
      {
        kind: 'review',
        text: 'A quiet film that stays with you.',
        isSpoiler: true,
      },
      { kind: 'note', text: 'saw it with Mira' },
    ]);
  });

  it('should skip the watch when the diary box is unticked', () => {
    const draft: LogDraft = { ...EMPTY_DRAFT, logWatch: false, rating: 6 };

    expect(planLog({ draft, baseline: NO_BASELINE, canLike: true }))
      .toEqual([{ kind: 'rate', rating: 6 }]);
  });

  it('should only send rating and like changes against the baseline', () => {
    const baseline = { rating: 8, isLiked: true };

    expect(
      planLog({
        draft: { ...EMPTY_DRAFT, logWatch: false, rating: 8, isLiked: true },
        baseline,
        canLike: true,
      }),
    ).toEqual([]);

    expect(
      planLog({
        draft: {
          ...EMPTY_DRAFT,
          logWatch: false,
          rating: null,
          isLiked: false,
        },
        baseline,
        canLike: true,
      }),
    ).toEqual([{ kind: 'unrate' }, { kind: 'unlike' }]);
  });

  it('should never like titles that cannot be liked', () => {
    const draft: LogDraft = { ...EMPTY_DRAFT, logWatch: false, isLiked: true };

    expect(planLog({ draft, baseline: NO_BASELINE, canLike: false }))
      .toEqual([]);
  });

  it('should drop reviews under the five word minimum', () => {
    const draft: LogDraft = { ...EMPTY_DRAFT, review: 'Loved it.' };

    expect(planLog({ draft, baseline: NO_BASELINE, canLike: true }))
      .toEqual([{ kind: 'watch', at: 'now' }]);
  });
});

describe('util: isReviewTooShort', () => {
  it('should flag non-empty reviews under five words', () => {
    expect(isReviewTooShort('')).toBe(false);
    expect(isReviewTooShort('Loved it.')).toBe(true);
    expect(isReviewTooShort('One two three four five')).toBe(false);
  });
});
