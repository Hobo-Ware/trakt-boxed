import type { SvelteSet } from 'svelte/reactivity';
import type { DiaryEntry } from './DiaryEntry.ts';
import type { FavoritesLookup } from './_internal/isEntryLiked.ts';
import type { MonthBucket } from './_internal/toMonthBuckets.ts';
import type { RatingsLookup } from './_internal/toEntryRating.ts';

export type DiaryViewProps = {
  buckets: ReadonlyArray<MonthBucket<DiaryEntry>> | null;
  isMe: boolean;
  ratings: RatingsLookup | null;
  favorites: FavoritesLookup | null;
  expanded: SvelteSet<string>;
  loadingMore: boolean;
};
