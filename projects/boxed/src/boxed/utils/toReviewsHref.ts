import type { CommentSortType } from '$lib/requests/models/CommentSortType.ts';

type ReviewsPage = {
  type: 'movie' | 'show';
  slug: string;
  sort?: CommentSortType;
};

export function toReviewsHref({ type, slug, sort }: ReviewsPage): string {
  const path = `/${type}s/${slug}/reviews`;

  return sort ? `${path}?sort=${sort}` : path;
}
