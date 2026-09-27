<script lang="ts">
  import PagedPosterGrid from "$boxed/poster/PagedPosterGrid.svelte";
  import { useWatchList } from "$lib/sections/lists/watchlist/useWatchList.ts";
  import { toWatchlistPosters } from "../_internal/toWatchlistPosters.ts";

  const PAGE_SIZE = 50;

  const { list, isLoading, hasNextPage, fetchNextPage } = useWatchList({
    type: "media",
    intent: "start",
    limit: PAGE_SIZE,
  });

  const items = $derived(toWatchlistPosters($list));
</script>

<PagedPosterGrid
  {items}
  isLoading={$isLoading}
  hasNextPage={$hasNextPage}
  onLoad={fetchNextPage}
  columns={8}
  skeletonCount={16}
/>
