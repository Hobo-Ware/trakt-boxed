<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PersonalListType } from "$lib/sections/lists/user/models/PersonalListType.ts";
  import { usePersonalListsSummary } from "$lib/sections/lists/user/usePersonalListsSummary.ts";
  import ListCardGrid from "../../lists/ListCardGrid.svelte";
  import LoadMore from "$boxed/components/LoadMore.svelte";

  const PAGE_SIZE = 20;

  const { slug, type }: { slug: string; type: PersonalListType } = $props();

  const { list, isLoading, hasNextPage, fetchNextPage } = $derived(
    usePersonalListsSummary({ type, slug, limit: PAGE_SIZE }),
  );

  const isFirstLoad = $derived($isLoading && $list.length === 0);
</script>

<ListCardGrid
  lists={isFirstLoad ? null : $list}
  skeletonCount={6}
  emptyText={m.list_placeholder_empty()}
/>

<LoadMore
  hasNextPage={$hasNextPage}
  isLoading={$isLoading}
  loadedCount={$list.length}
  onLoad={fetchNextPage}
/>
