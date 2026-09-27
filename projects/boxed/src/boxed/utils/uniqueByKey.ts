export function uniqueByKey<T>(
  items: ReadonlyArray<T>,
  toKey: (item: T) => PropertyKey,
): T[] {
  const seen = new Set<PropertyKey>();

  return items.filter((item) => {
    const key = toKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
