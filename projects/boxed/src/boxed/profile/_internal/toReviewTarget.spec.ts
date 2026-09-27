import type { ActivityEntry } from '$lib/sections/profile/components/useMyActivityList.ts';
import { describe, expect, it } from 'vitest';
import { toReviewTarget } from './toReviewTarget.ts';

const poster = { url: { thumb: 'https://img/poster.jpg', medium: '' } };

describe('util: toReviewTarget', () => {
  it('should link a movie review to the movie', () => {
    const target = toReviewTarget({
      activityType: 'reviews',
      type: 'movie',
      media: { slug: 'dune', title: 'Dune', poster },
    } as unknown as ActivityEntry);

    expect(target).toEqual({
      title: 'Dune',
      code: null,
      href: '/movies/dune',
      poster: 'https://img/poster.jpg',
    });
  });

  it('should link an episode review to the episode page', () => {
    const target = toReviewTarget({
      activityType: 'reviews',
      type: 'episode',
      media: { slug: 'severance', title: 'Severance', poster },
      episode: { season: 2, number: 4 },
    } as unknown as ActivityEntry);

    expect(target?.href).toBe('/shows/severance/seasons/2/episodes/4');
    expect(target?.code).toBeTruthy();
  });

  it('should ignore rating entries', () => {
    expect(
      toReviewTarget({ activityType: 'ratings' } as unknown as ActivityEntry),
    ).toBeNull();
  });
});
