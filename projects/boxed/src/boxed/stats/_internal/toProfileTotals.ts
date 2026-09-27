import * as m from '$lib/features/i18n/messages.ts';
import type { UserStats } from '$lib/requests/models/UserStats.ts';
import type { StatsTotal } from './toStatsTotals.ts';

export function toProfileTotals(stats: UserStats): StatsTotal[] {
  return [
    { key: 'movies', value: stats.movies.watched, label: m.yir_unit_movies() },
    {
      key: 'episodes',
      value: stats.episodes.watched,
      label: m.yir_unit_episodes(),
    },
    { key: 'shows', value: stats.shows.watched, label: m.yir_unit_shows() },
    {
      key: 'hours',
      value: Math.round(stats.totalMinutes / 60),
      label: m.yir_unit_hours(),
    },
    {
      key: 'comments',
      value: stats.movies.comments + stats.shows.comments +
        stats.seasons.comments + stats.episodes.comments,
      label: m.yir_unit_comments(),
    },
  ];
}
