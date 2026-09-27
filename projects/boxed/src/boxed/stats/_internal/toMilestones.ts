import * as m from '$lib/features/i18n/messages.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type {
  YirDetail,
  YirWatchedItem,
} from '$lib/requests/models/YirDetail.ts';

export type Milestone = {
  key: string;
  label: string;
  entry: MediaEntry;
  detail: string;
};

type ToMilestonesParams = {
  detail: YirDetail;
  formatDate: (date: Date) => string;
};

function fromWatched(
  { key, label, item, formatDate }: {
    key: string;
    label: string;
    item: YirWatchedItem | Nil;
    formatDate: (date: Date) => string;
  },
): Milestone[] {
  if (!item) return [];

  return [{
    key,
    label,
    entry: item.entry,
    detail: formatDate(item.watchedAt),
  }];
}

function fromMostWatched(
  { key, label, items }: {
    key: string;
    label: string;
    items: YirDetail['mostWatched']['movies'];
  },
): Milestone[] {
  const top = items.at(0);
  if (!top) return [];

  return [{
    key,
    label,
    entry: top.entry,
    detail: m.yir_global_top_plays({ count: String(top.plays) }),
  }];
}

export function toMilestones(
  { detail, formatDate }: ToMilestonesParams,
): Milestone[] {
  return [
    ...fromWatched({
      key: 'first',
      label: m.boxed_stats_first_watched(),
      item: detail.firstWatched,
      formatDate,
    }),
    ...fromMostWatched({
      key: 'show',
      label: m.yir_label_most_watched({ type: m.yir_unit_show() }),
      items: detail.mostWatched.shows,
    }),
    ...fromMostWatched({
      key: 'movie',
      label: m.yir_label_most_watched({ type: m.yir_unit_movie() }),
      items: detail.mostWatched.movies,
    }),
  ];
}
