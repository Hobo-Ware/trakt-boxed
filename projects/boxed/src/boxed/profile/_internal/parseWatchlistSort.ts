import type { SortBy } from '$lib/sections/lists/user/models/SortBy.ts';

export const WATCHLIST_SORTS = [
  'added',
  'released',
  'title',
  'runtime',
  'rank',
] as const satisfies ReadonlyArray<SortBy>;

export type WatchlistSort = typeof WATCHLIST_SORTS[number];

export function parseWatchlistSort(value: string | Nil): WatchlistSort {
  return WATCHLIST_SORTS.find((sort) => sort === value) ?? 'added';
}
