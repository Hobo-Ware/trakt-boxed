export function invalidationPredicate(
  queryKey: readonly unknown[],
  id: string,
) {
  return queryKey.includes(id);
}
