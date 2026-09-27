<script lang="ts">
  import EmptyState from "$boxed/components/EmptyState.svelte";
  import LoadMore from "$boxed/components/LoadMore.svelte";
  import PosterGrid from "./PosterGrid.svelte";
  import type { PosterMedia } from "./PosterMedia.ts";

  type PagedPosterGridProps = {
    items: ReadonlyArray<PosterMedia>;
    isLoading: boolean;
    hasNextPage: boolean;
    onLoad: () => unknown;
    columns: number;
    skeletonCount: number;
    showUserMeta?: boolean;
    emptyText?: string;
  };

  const {
    items,
    isLoading,
    hasNextPage,
    onLoad,
    columns,
    skeletonCount,
    showUserMeta = false,
    emptyText,
  }: PagedPosterGridProps = $props();

  const isFirstLoad = $derived(isLoading && items.length === 0);
</script>

{#if emptyText && !isFirstLoad && items.length === 0}
  <EmptyState text={emptyText} />
{:else}
  <PosterGrid
    items={isFirstLoad ? null : items}
    {columns}
    {skeletonCount}
    {showUserMeta}
    loadingMore={isLoading && !isFirstLoad}
  />
{/if}

<LoadMore
  {hasNextPage}
  {isLoading}
  loadedCount={items.length}
  {onLoad}
/>
