<script lang="ts">
  import type { RecentlyWatchedType } from "$lib/sections/lists/stores/useRecentlyWatchedList.ts";
  import { useRecentlyWatchedList } from "$lib/sections/lists/stores/useRecentlyWatchedList.ts";
  import { SvelteSet } from "svelte/reactivity";
  import LoadMore from "../LoadMore.svelte";
  import DiaryCards from "./DiaryCards.svelte";
  import DiaryTable from "./DiaryTable.svelte";
  import { toDiaryEntries } from "./_internal/toDiaryEntries.ts";
  import { toMonthBuckets } from "./_internal/toMonthBuckets.ts";
  import { useDiaryUserState } from "./useDiaryUserState.ts";

  const PAGE_SIZE = 50;

  const {
    slug,
    type,
    isMe,
  }: { slug: string; type: RecentlyWatchedType; isMe: boolean } = $props();

  const { list, isLoading, hasNextPage, fetchNextPage } = $derived(
    useRecentlyWatchedList({ type, slug, limit: PAGE_SIZE }),
  );
  const { userState } = $derived(useDiaryUserState(isMe));

  const expanded = new SvelteSet<string>();
  const isFirstLoad = $derived($isLoading && $list.length === 0);
  const buckets = $derived(
    isFirstLoad ? null : toMonthBuckets(toDiaryEntries($list)),
  );
  const viewProps = $derived({
    buckets,
    isMe,
    ratings: $userState.ratings,
    favorites: $userState.favorites,
    expanded,
    loadingMore: $isLoading && !isFirstLoad,
  });
</script>

<div class="boxed-diary-list">
  <div class="diary-desktop"><DiaryTable {...viewProps} /></div>
  <div class="diary-mobile"><DiaryCards {...viewProps} /></div>
</div>

<LoadMore
  hasNextPage={$hasNextPage}
  isLoading={$isLoading}
  loadedCount={$list.length}
  onLoad={fetchNextPage}
/>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .diary-mobile {
    display: none;
  }

  @include for-tablet-sm-and-below {
    .diary-desktop {
      display: none;
    }

    .diary-mobile {
      display: block;
    }
  }
</style>
