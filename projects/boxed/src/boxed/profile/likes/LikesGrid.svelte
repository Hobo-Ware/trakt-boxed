<script lang="ts">
  import PagedPosterGrid from "$boxed/poster/PagedPosterGrid.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useFavoritesList } from "$lib/sections/lists/stores/useFavoritesList.ts";
  import type { PosterMedia } from "../../poster/PosterMedia.ts";

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

  const items = $derived(
    $list.map((entry): PosterMedia => ({ ...entry.item, type })),
  );
  const emptyText = $derived(
    type === "movie"
      ? m.list_placeholder_favorite_movies()
      : m.list_placeholder_favorite_shows(),
  );
</script>

<PagedPosterGrid
  {items}
  isLoading={$isLoading}
  hasNextPage={$hasNextPage}
  onLoad={fetchNextPage}
  columns={8}
  skeletonCount={SKELETON_COUNT}
  showUserMeta={isMe}
  {emptyText}
/>
