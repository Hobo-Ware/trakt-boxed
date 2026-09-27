<script lang="ts">
  import { useProgressList } from "$lib/sections/profile/components/useProgressList.ts";
  import PosterGrid from "../../poster/PosterGrid.svelte";
  import LoadMore from "../LoadMore.svelte";

  const PAGE_SIZE = 50;

  const upToDate = useProgressList({ type: "completed", limit: PAGE_SIZE });
  const ended = useProgressList({ type: "ended", limit: PAGE_SIZE });
  const { list: upToDateList, isLoading, hasNextPage, fetchNextPage } =
    upToDate;
  const { list: endedList } = ended;

  const shows = $derived(
    [...$endedList, ...$upToDateList].map((entry) => ({
      ...entry.show,
      type: "show" as const,
    })),
  );
  const isFirstLoad = $derived($isLoading && shows.length === 0);
</script>

<PosterGrid
  items={isFirstLoad ? null : shows}
  columns={8}
  skeletonCount={16}
  showUserMeta
  loadingMore={$isLoading && !isFirstLoad}
/>

<LoadMore
  hasNextPage={$hasNextPage}
  isLoading={$isLoading}
  loadedCount={shows.length}
  onLoad={fetchNextPage}
/>
