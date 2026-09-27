import * as m from '$lib/features/i18n/messages.ts';
import { episodeNumberLabel } from '$lib/utils/intl/episodeNumberLabel.ts';
import type { EpisodeRange } from './toEpisodeRange.ts';

export function toEpisodeRangeLabel(range: EpisodeRange | null): string {
  if (!range) return '';

  switch (range.type) {
    case 'single':
      return episodeNumberLabel({
        seasonNumber: range.season,
        episodeNumber: range.episode,
      });
    case 'season':
      return m.boxed_profile_episode_range({
        season: range.season,
        first: range.first,
        last: range.last,
      });
    case 'span':
      return m.boxed_profile_episode_span({
        from: episodeNumberLabel({
          seasonNumber: range.from.season,
          episodeNumber: range.from.number,
        }),
        to: episodeNumberLabel({
          seasonNumber: range.to.season,
          episodeNumber: range.to.number,
        }),
      });
  }
}
