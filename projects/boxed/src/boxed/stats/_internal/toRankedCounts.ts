export type RankedCount = {
  key: string;
  label: string;
  count: number;
};

export function toRankedCounts(
  { groups, limit }: {
    groups: ReadonlyArray<ReadonlyArray<RankedCount>>;
    limit: number;
  },
): RankedCount[] {
  const merged = groups.flat().reduce((acc, item) => {
    const current = acc.get(item.key);
    acc.set(item.key, {
      ...item,
      count: (current?.count ?? 0) + item.count,
    });
    return acc;
  }, new Map<string, RankedCount>());

  return [...merged.values()]
    .toSorted((a, b) => b.count - a.count)
    .slice(0, limit);
}
