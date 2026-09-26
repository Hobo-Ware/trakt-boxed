<script lang="ts">
  import type { Observable } from "rxjs";
  import PosterGrid from "../poster/PosterGrid.svelte";
  import type { PosterMedia } from "../poster/PosterMedia.ts";
  import { whileVisible } from "../utils/whileVisible.ts";

  type ChartGridProps = {
    list: Observable<ReadonlyArray<PosterMedia>>;
    isLoading: Observable<boolean>;
    hasNextPage: Observable<boolean>;
    fetchNextPage: () => Promise<unknown>;
    emptyText: string;
  };

  const { list, isLoading, hasNextPage, fetchNextPage, emptyText }:
    ChartGridProps = $props();

  const isFirstLoad = $derived($isLoading && $list.length === 0);
  const loadMore = () => {
    if ($isLoading || !$hasNextPage) return;
    fetchNextPage();
  };
</script>

<PosterGrid
  items={isFirstLoad ? null : $list}
  columns={8}
  skeletonCount={24}
  showUserMeta
  loadingMore={$isLoading && !isFirstLoad}
/>

{#if !isFirstLoad && $list.length === 0}
  <p class="boxed-chart-empty">{emptyText}</p>
{/if}

{#if $hasNextPage}
  <div class="boxed-chart-sentinel" use:whileVisible={loadMore}></div>
{/if}

<style>
  .boxed-chart-empty {
    margin: 0;
    color: var(--color-text-secondary);
  }

  .boxed-chart-sentinel {
    height: var(--ni-1);
  }
</style>
