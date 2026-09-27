<script lang="ts">
  import PagedPosterGrid from "$boxed/poster/PagedPosterGrid.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode.ts";
  import { useWatchList } from "$lib/sections/lists/watchlist/useWatchList.ts";
  import type { WatchlistSort } from "../_internal/parseWatchlistSort.ts";
  import { toWatchlistPosters } from "../_internal/toWatchlistPosters.ts";

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

  const items = $derived(toWatchlistPosters($list));
</script>

<PagedPosterGrid
  {items}
  isLoading={$isLoading}
  hasNextPage={$hasNextPage}
  onLoad={fetchNextPage}
  columns={7}
  skeletonCount={21}
  emptyText={m.text_cta_watchlist_unreleased()}
/>
