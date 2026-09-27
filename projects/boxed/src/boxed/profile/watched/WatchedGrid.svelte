<script lang="ts">
  import EmptyState from "$boxed/components/EmptyState.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useRecentlyWatchedList } from "$lib/sections/lists/stores/useRecentlyWatchedList.ts";
  import PosterGrid from "../../poster/PosterGrid.svelte";
  import type { PosterMedia } from "../../poster/PosterMedia.ts";
  import { toWatchedTitles } from "../_internal/toWatchedTitles.ts";
  import ShowBadge from "./ShowBadge.svelte";

  const PAGE_SIZE = 100;
  const BATCH = 48;
  const COLUMNS = 8;

  const {
    slug,
    type,
    isMe,
  }: { slug: string; type: "movie" | "show"; isMe: boolean } = $props();

  const { list, isLoading, hasNextPage, fetchNextPage } = $derived(
    useRecentlyWatchedList({ type, slug, limit: PAGE_SIZE }),
  );

  let shownCount = $state(BATCH);

  const watched = $derived(toWatchedTitles($list));
  const isNextBatchReady = $derived(
    watched.length >= shownCount + BATCH || !$hasNextPage,
  );
  const hasMore = $derived(watched.length > shownCount || $hasNextPage);
  const isFirstLoad = $derived(watched.length < BATCH && $hasNextPage);
  const titles = $derived(
    isFirstLoad || ($isLoading && watched.length === 0)
      ? null
      : watched.slice(0, shownCount),
  );

  $effect(() => {
    if ($isLoading || !$hasNextPage) return;
    if (watched.length >= shownCount + BATCH) return;

    fetchNextPage();
  });

  const reveal = () => {
    if (isNextBatchReady) shownCount += BATCH;
  };
</script>

{#snippet showMeta(media: PosterMedia)}
  <ShowBadge {media} />
{/snippet}

{#if titles && titles.length === 0}
  <EmptyState text={m.boxed_profile_empty()} />
{:else}
  <div class="boxed-watched-grid">
    <PosterGrid
      items={titles}
      columns={COLUMNS}
      skeletonCount={BATCH}
      showUserMeta={isMe && type === "movie"}
      meta={isMe && type === "show" ? showMeta : undefined}
    />
    {#if titles && hasMore}
      <button
        type="button"
        class="boxed-watched-more"
        disabled={!isNextBatchReady}
        aria-busy={!isNextBatchReady}
        onclick={reveal}
      >
        {m.button_text_load_more()}
      </button>
    {/if}
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-watched-grid {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    @include for-mobile {
      gap: var(--gap-s);
    }
  }

  .boxed-watched-more {
    align-self: center;
    height: var(--ni-40);
    padding-inline: var(--ni-20);
    border: var(--border-thickness-xxs) solid var(--color-border);
    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    color: var(--color-text-primary);
    font: inherit;
    font-size: var(--ni-14);
    font-weight: 600;
    cursor: pointer;

    &:disabled {
      opacity: 0.6;
      cursor: progress;
    }
  }
</style>
