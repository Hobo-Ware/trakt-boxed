import { toSeasonHref } from '$boxed/utils/toSeasonHref.ts';
import { directCommentTargetUrl } from '$lib/sections/summary/directCommentTargetUrl.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { ReviewTarget } from '../ReviewTarget.ts';

type ReviewHrefs = {
  title: string;
  reviews: string | null;
  thread: string;
};

const toTitleHref = (target: ReviewTarget) => {
  switch (target.type) {
    case 'movie':
      return UrlBuilder.movie(target.slug);
    case 'show':
      return UrlBuilder.show(target.slug);
    case 'season':
      return toSeasonHref(target.slug, target.season);
    case 'episode':
      return UrlBuilder.episode(target.slug, target.season, target.episode);
  }
};

const toReviewsHref = (target: ReviewTarget) => {
  switch (target.type) {
    case 'movie':
    case 'show':
      return `${toTitleHref(target)}/reviews`;
    case 'season':
    case 'episode':
      return null;
  }
};

export function toReviewHrefs(
  { commentId, target }: { commentId: number; target: ReviewTarget },
): ReviewHrefs {
  return {
    title: toTitleHref(target),
    reviews: toReviewsHref(target),
    thread: directCommentTargetUrl({ commentId, target }),
  };
}
