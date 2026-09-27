type Dated = { watchedAt: Date };

export type MonthBucket<T extends Dated> = {
  key: string;
  month: Date;
  entries: T[];
};

export function toMonthBuckets<T extends Dated>(
  entries: ReadonlyArray<T>,
): MonthBucket<T>[] {
  return entries.reduce((buckets, entry) => {
    const year = entry.watchedAt.getFullYear();
    const month = entry.watchedAt.getMonth();
    const key = `${year}-${month + 1}`;
    const last = buckets.at(-1);

    if (last?.key === key) last.entries.push(entry);
    else {buckets.push({
        key,
        month: new Date(year, month, 1),
        entries: [entry],
      });}

    return buckets;
  }, [] as MonthBucket<T>[]);
}
