import type { ActivityEntry } from '$lib/sections/profile/components/useMyActivityList.ts';
import { episodeNumberLabel } from '$lib/utils/intl/episodeNumberLabel.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

export type ReviewTarget = {
  title: string;
  code: string | null;
  href: string;
  poster: string;
};

export function toReviewTarget(entry: ActivityEntry): ReviewTarget | null {
  if (entry.activityType !== 'reviews') return null;

  if (entry.type === 'episode') {
    return {
      title: entry.media.title,
      code: episodeNumberLabel({
        seasonNumber: entry.episode.season,
        episodeNumber: entry.episode.number,
      }),
      href: UrlBuilder.episode(
        entry.media.slug,
        entry.episode.season,
        entry.episode.number,
      ),
      poster: entry.media.poster.url.thumb,
    };
  }

  return {
    title: entry.media.title,
    code: null,
    href: entry.type === 'movie'
      ? UrlBuilder.movie(entry.media.slug)
      : UrlBuilder.show(entry.media.slug),
    poster: entry.media.poster.url.thumb,
  };
}
