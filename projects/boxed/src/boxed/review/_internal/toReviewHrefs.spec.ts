import { describe, expect, it } from 'vitest';
import { toReviewHrefs } from './toReviewHrefs.ts';

describe('util: toReviewHrefs', () => {
  it('should link a movie review to the film, its reviews and the thread', () => {
    const hrefs = toReviewHrefs({
      commentId: 42,
      target: { type: 'movie', slug: 'dune-part-two-2024' },
    });

    expect(hrefs.title).toBe('/movies/dune-part-two-2024');
    expect(hrefs.reviews).toBe('/movies/dune-part-two-2024/reviews');
    expect(hrefs.thread).toContain('/movies/dune-part-two-2024?');
    expect(hrefs.thread).toContain('42');
  });

  it('should link an episode review to the episode without a reviews page', () => {
    const hrefs = toReviewHrefs({
      commentId: 7,
      target: { type: 'episode', slug: 'severance', season: 1, episode: 2 },
    });

    expect(hrefs.title).toBe('/shows/severance/seasons/1/episodes/2');
    expect(hrefs.reviews).toBeNull();
  });

  it('should link a season review to the season page', () => {
    const hrefs = toReviewHrefs({
      commentId: 9,
      target: { type: 'season', slug: 'severance', season: 2 },
    });

    expect(hrefs.title).toBe('/shows/severance/seasons/2');
  });
});
