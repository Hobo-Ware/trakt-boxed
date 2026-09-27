import * as m from '$lib/features/i18n/messages.ts';
import type { LeaderboardEntry } from '$lib/requests/models/LeaderboardEntry.ts';
import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';

type LeaderboardStatParams = {
  entry: Pick<LeaderboardEntry, 'totalMinutes' | 'totalPlays' | 'locked'>;
  locale: string;
};

export function toLeaderboardStat(
  { entry, locale }: LeaderboardStatParams,
): string | null {
  if (entry.locked) return null;

  const parts = [
    entry.totalMinutes == null
      ? null
      : `${
        toHumanNumber(Math.round(entry.totalMinutes / 60), locale)
      } ${m.stat_label_hours()}`,
    entry.totalPlays == null
      ? null
      : `${toHumanNumber(entry.totalPlays, locale)} ${m.stat_label_plays()}`,
  ].filter((part): part is string => part != null);

  return parts.length > 0 ? parts.join(' · ') : null;
}
