<script lang="ts">
  import type { Snippet } from "svelte";
  import PosterSkeleton from "./PosterSkeleton.svelte";
  import PosterTile from "./PosterTile.svelte";
  import type { PosterMedia } from "./PosterMedia.ts";

  type PosterRowProps = {
    items: ReadonlyArray<PosterMedia> | Nil;
    skeletonCount?: number;
    showUserMeta?: boolean;
    meta?: Snippet<[PosterMedia]>;
    label: string;
    emptyText?: string;
  };

  const {
    items,
    skeletonCount = 8,
    showUserMeta = false,
    meta,
    label,
    emptyText,
  }: PosterRowProps = $props();
</script>

<ul class="boxed-poster-row" aria-label={label}>
  {#if items && items.length === 0 && emptyText}
    <li class="boxed-poster-row-empty">
      <PosterSkeleton showUserMeta={showUserMeta || Boolean(meta)} />
      <span>{emptyText}</span>
    </li>
  {:else if items}
    {#each items as media (media.key)}
      <li>{#if meta}
        {#snippet tileMeta()}{@render meta(media)}{/snippet}
        <PosterTile {media} meta={tileMeta} />
      {:else}
        <PosterTile {media} {showUserMeta} />
      {/if}</li>
    {/each}
  {:else}
    {#each { length: skeletonCount }, index (index)}
      <li><PosterSkeleton showUserMeta={showUserMeta || Boolean(meta)} /></li>
    {/each}
  {/if}
</ul>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-poster-row {
    --poster-row-width: var(--ni-144);

    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: var(--poster-row-width);
    gap: var(--gap-m);

    margin: 0;
    padding: var(--ni-4) 0 var(--ni-8);
    list-style: none;

    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scroll-snap-type: inline mandatory;
    scrollbar-width: none;

    li {
      scroll-snap-align: start;
    }

    .boxed-poster-row-empty {
      position: relative;
      grid-column: 1 / -1;
      width: max-content;

      :global(.boxed-poster-skeleton) {
        visibility: hidden;
        width: var(--poster-row-width);
      }

      span {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        display: flex;
        align-items: center;
        white-space: nowrap;
        font-size: var(--ni-14);
        color: var(--color-text-secondary);
      }
    }

    @include for-mobile {
      --poster-row-width: var(--ni-104);
      gap: var(--gap-s);
    }
  }
</style>
