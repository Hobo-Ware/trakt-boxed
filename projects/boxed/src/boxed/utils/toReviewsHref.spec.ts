import { describe, expect, it } from 'vitest';
import { toReviewsHref } from './toReviewsHref.ts';

describe('util: toReviewsHref', () => {
  it('should link to the reviews page of a film or show', () => {
    expect(toReviewsHref({ type: 'movie', slug: 'dune-part-two-2024' }))
      .toBe('/movies/dune-part-two-2024/reviews');
    expect(toReviewsHref({ type: 'show', slug: 'severance' }))
      .toBe('/shows/severance/reviews');
  });

  it('should add the sort when given', () => {
    expect(toReviewsHref({ type: 'show', slug: 'severance', sort: 'newest' }))
      .toBe('/shows/severance/reviews?sort=newest');
  });
});
