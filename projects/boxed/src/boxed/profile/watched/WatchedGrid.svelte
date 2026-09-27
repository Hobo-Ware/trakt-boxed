<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useRecentlyWatchedList } from "$lib/sections/lists/stores/useRecentlyWatchedList.ts";
  import PosterGrid from "../../poster/PosterGrid.svelte";
  import type { PosterMedia } from "../../poster/PosterMedia.ts";
  import LoadMore from "../LoadMore.svelte";
  import { toWatchedTitles } from "../_internal/toWatchedTitles.ts";
  import ShowBadge from "./ShowBadge.svelte";

  const PAGE_SIZE = 100;
  const MIN_TITLES = 24;

  const {
    slug,
    type,
    isMe,
  }: { slug: string; type: "movie" | "show"; isMe: boolean } = $props();

  const { list, isLoading, hasNextPage, fetchNextPage } = $derived(
    useRecentlyWatchedList({ type, slug, limit: PAGE_SIZE }),
  );

  const watched = $derived(toWatchedTitles($list));
  const isFirstLoad = $derived(
    watched.length < MIN_TITLES && ($isLoading || $hasNextPage),
  );
  const titles = $derived(isFirstLoad ? null : watched);
</script>

{#snippet showMeta(media: PosterMedia)}
  <ShowBadge {media} />
{/snippet}

{#if titles && titles.length === 0}
  <p class="boxed-watched-empty">{m.boxed_profile_empty()}</p>
{:else}
  <PosterGrid
    items={titles}
    columns={8}
    skeletonCount={MIN_TITLES}
    showUserMeta={isMe && type === "movie"}
    meta={isMe && type === "show" ? showMeta : undefined}
    loadingMore={$isLoading && !isFirstLoad}
  />
{/if}

<LoadMore
  hasNextPage={$hasNextPage}
  isLoading={$isLoading}
  loadedCount={$list.length}
  onLoad={fetchNextPage}
/>

<style>
  .boxed-watched-empty {
    min-height: var(--ni-240);
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
  }
</style>
