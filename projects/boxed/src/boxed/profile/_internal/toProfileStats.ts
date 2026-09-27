import * as m from '$lib/features/i18n/messages.ts';
import type { UserStats } from '$lib/requests/models/UserStats.ts';

export type ProfileStat = {
  key: string;
  label: string;
  value: number | null | undefined;
};

type ProfileStatsParams = {
  stats: UserStats | null | undefined;
  thisYear: number | null;
  showThisYear: boolean;
};

export function toProfileStats(
  { stats, thisYear, showThisYear }: ProfileStatsParams,
): ProfileStat[] {
  const read = (pick: (loaded: UserStats) => number | null) => {
    if (stats === undefined) return undefined;
    return stats ? pick(stats) : null;
  };

  return [
    {
      key: 'movies',
      label: m.label_stats_movies(),
      value: read((loaded) => loaded.movies.watched),
    },
    {
      key: 'shows',
      label: m.label_stats_shows(),
      value: read((loaded) => loaded.shows.watched),
    },
    {
      key: 'episodes',
      label: m.label_stats_episodes(),
      value: read((loaded) => loaded.episodes.watched),
    },
    { key: 'year', label: m.text_this_year(), value: thisYear ?? undefined },
    {
      key: 'lists',
      label: m.stat_text_lists(),
      value: read((loaded) => loaded.lists),
    },
    {
      key: 'following',
      label: m.text_following(),
      value: read((loaded) => loaded.network.following),
    },
    {
      key: 'followers',
      label: m.button_text_followers(),
      value: read((loaded) => loaded.network.followers),
    },
  ].filter((stat) => stat.key !== 'year' || showThisYear);
}
