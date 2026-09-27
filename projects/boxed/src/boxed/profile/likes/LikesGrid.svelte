<script lang="ts">
  import EmptyState from "$boxed/components/EmptyState.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useFavoritesList } from "$lib/sections/lists/stores/useFavoritesList.ts";
  import PosterGrid from "../../poster/PosterGrid.svelte";
  import type { PosterMedia } from "../../poster/PosterMedia.ts";
  import LoadMore from "../LoadMore.svelte";

  const PAGE_SIZE = 48;
  const SKELETON_COUNT = 24;

  const {
    slug,
    type,
    isMe,
  }: { slug: string; type: "movie" | "show"; isMe: boolean } = $props();

  const { list, isLoading, hasNextPage, fetchNextPage } = $derived(
    useFavoritesList({ slug, type, limit: PAGE_SIZE }),
  );

  const isFirstLoad = $derived($isLoading && $list.length === 0);
  const items = $derived(
    isFirstLoad
      ? null
      : $list.map((entry): PosterMedia => ({ ...entry.item, type })),
  );
  const emptyText = $derived(
    type === "movie"
      ? m.list_placeholder_favorite_movies()
      : m.list_placeholder_favorite_shows(),
  );
</script>

{#if items && items.length === 0}
  <EmptyState text={emptyText} />
{:else}
  <PosterGrid
    {items}
    columns={8}
    skeletonCount={SKELETON_COUNT}
    showUserMeta={isMe}
    loadingMore={$isLoading && !isFirstLoad}
  />
{/if}

<LoadMore
  hasNextPage={$hasNextPage}
  isLoading={$isLoading}
  loadedCount={$list.length}
  onLoad={fetchNextPage}
/>
