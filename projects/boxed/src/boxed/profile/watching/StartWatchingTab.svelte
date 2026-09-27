<script lang="ts">
  import { useWatchList } from "$lib/sections/lists/watchlist/useWatchList.ts";
  import PosterGrid from "../../poster/PosterGrid.svelte";
  import type { PosterMedia } from "../../poster/PosterMedia.ts";
  import LoadMore from "../LoadMore.svelte";

  const PAGE_SIZE = 50;

  const { list, isLoading, hasNextPage, fetchNextPage } = useWatchList({
    type: "media",
    intent: "start",
    limit: PAGE_SIZE,
  });

  const items = $derived(
    $list.flatMap((item): PosterMedia[] =>
      item.type === "movie" || item.type === "show"
        ? [{ ...item.entry, type: item.type }]
        : []
    ),
  );
  const isFirstLoad = $derived($isLoading && items.length === 0);
</script>

<PosterGrid
  items={isFirstLoad ? null : items}
  columns={8}
  skeletonCount={16}
  loadingMore={$isLoading && !isFirstLoad}
/>

<LoadMore
  hasNextPage={$hasNextPage}
  isLoading={$isLoading}
  loadedCount={items.length}
  onLoad={fetchNextPage}
/>
