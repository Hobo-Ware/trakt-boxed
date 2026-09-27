<script lang="ts">
  import PagedPosterGrid from "$boxed/poster/PagedPosterGrid.svelte";
  import { useProgressList } from "$lib/sections/profile/components/useProgressList.ts";

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
</script>

<PagedPosterGrid
  items={shows}
  isLoading={$isLoading}
  hasNextPage={$hasNextPage}
  onLoad={fetchNextPage}
  columns={8}
  skeletonCount={16}
  showUserMeta
/>
