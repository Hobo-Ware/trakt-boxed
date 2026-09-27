import * as m from '$lib/features/i18n/messages.ts';

export function toStreakLabel(count: number): string {
  const days = count === 1
    ? m.text_stats_day_count({ count: String(count) })
    : m.text_stats_days_count({ count: String(count) });

  return `${days} ${m.text_stats_watching_streak()}`;
}
