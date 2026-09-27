<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode.ts";
  import { useWatchList } from "$lib/sections/lists/watchlist/useWatchList.ts";
  import PosterGrid from "../../poster/PosterGrid.svelte";
  import type { PosterMedia } from "../../poster/PosterMedia.ts";
  import LoadMore from "../LoadMore.svelte";
  import type { WatchlistSort } from "../_internal/parseWatchlistSort.ts";

  const PAGE_SIZE = 70;

  const { type, sortBy }: { type: DiscoverMode; sortBy: WatchlistSort } =
    $props();

  const { list, isLoading, hasNextPage, fetchNextPage } = $derived(
    useWatchList({
      type,
      intent: "default",
      sortBy,
      sortHow: sortBy === "title" || sortBy === "rank" ? "asc" : "desc",
      limit: PAGE_SIZE,
    }),
  );

  const items = $derived(
    $list.flatMap((item): PosterMedia[] =>
      item.type === "movie" || item.type === "show"
        ? [{ ...item.entry, type: item.type }]
        : []
    ),
  );
  const isFirstLoad = $derived($isLoading && items.length === 0);
</script>

{#if !isFirstLoad && items.length === 0}
  <p class="boxed-watchlist-empty">{m.text_cta_watchlist_unreleased()}</p>
{:else}
  <PosterGrid
    items={isFirstLoad ? null : items}
    columns={7}
    skeletonCount={21}
    loadingMore={$isLoading && !isFirstLoad}
  />
{/if}

<LoadMore
  hasNextPage={$hasNextPage}
  isLoading={$isLoading}
  loadedCount={items.length}
  onLoad={fetchNextPage}
/>

<style>
  .boxed-watchlist-empty {
    min-height: var(--ni-240);
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
  }
</style>
