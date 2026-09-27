<script lang="ts">
  import EmptyState from "$boxed/components/EmptyState.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode.ts";
  import { useWatchList } from "$lib/sections/lists/watchlist/useWatchList.ts";
  import PosterGrid from "../../poster/PosterGrid.svelte";
  import type { PosterMedia } from "../../poster/PosterMedia.ts";
  import LoadMore from "$boxed/components/LoadMore.svelte";
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
  <EmptyState text={m.text_cta_watchlist_unreleased()} />
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
