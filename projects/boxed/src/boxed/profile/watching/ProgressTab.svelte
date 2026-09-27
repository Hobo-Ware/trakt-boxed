<script lang="ts">
  import { useProgressList } from "$lib/sections/profile/components/useProgressList.ts";
  import LoadMore from "../LoadMore.svelte";
  import ProgressRows from "./ProgressRows.svelte";

  const PAGE_SIZE = 50;

  const { type }: { type: "in-progress" | "dropped" } = $props();

  const { list, isLoading, hasNextPage, fetchNextPage } = $derived(
    useProgressList({ type, limit: PAGE_SIZE }),
  );

  const isFirstLoad = $derived($isLoading && $list.length === 0);
</script>

<ProgressRows
  entries={isFirstLoad ? null : $list}
  loadingMore={$isLoading && !isFirstLoad}
/>

<LoadMore
  hasNextPage={$hasNextPage}
  isLoading={$isLoading}
  loadedCount={$list.length}
  onLoad={fetchNextPage}
/>
