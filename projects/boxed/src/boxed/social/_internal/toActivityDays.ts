import { getDayKey } from '$lib/utils/date/getDayKey.ts';

export type ActivityDay<T> = {
  key: string;
  date: Date;
  events: T[];
};

export function toActivityDays<T extends { at: Date }>(
  events: ReadonlyArray<T>,
): ActivityDay<T>[] {
  const days = events
    .toSorted((a, b) => b.at.getTime() - a.at.getTime())
    .reduce((acc, event) => {
      const key = getDayKey(event.at);
      const day = acc.get(key) ?? { key, date: event.at, events: [] };
      acc.set(key, { ...day, events: [...day.events, event] });
      return acc;
    }, new Map<string, ActivityDay<T>>());

  return [...days.values()];
}
