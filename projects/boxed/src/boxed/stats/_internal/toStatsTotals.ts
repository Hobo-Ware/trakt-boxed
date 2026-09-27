import * as m from '$lib/features/i18n/messages.ts';
import type { YirDetail } from '$lib/requests/models/YirDetail.ts';

export type StatsTotal = {
  key: string;
  value: number;
  label: string;
};

export function toStatsTotals(detail: YirDetail): StatsTotal[] {
  const { all, movies, shows } = detail.stats;

  return [
    {
      key: 'movies',
      value: movies.itemsCount ?? 0,
      label: m.yir_unit_movies(),
    },
    {
      key: 'episodes',
      value: shows.playCounts.total,
      label: m.yir_unit_episodes(),
    },
    { key: 'shows', value: shows.itemsCount ?? 0, label: m.yir_unit_shows() },
    {
      key: 'hours',
      value: Math.round(all.minutes.total / 60),
      label: m.yir_unit_hours(),
    },
    {
      key: 'comments',
      value: all.commentsCounts.total,
      label: m.yir_unit_comments(),
    },
  ];
}
