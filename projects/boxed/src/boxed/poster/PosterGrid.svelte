<script lang="ts">
  import type { Snippet } from "svelte";
  import PosterSkeleton from "./PosterSkeleton.svelte";
  import PosterTile from "./PosterTile.svelte";
  import type { PosterMedia } from "./PosterMedia.ts";

  type PosterGridProps = {
    items: ReadonlyArray<PosterMedia> | Nil;
    columns?: number;
    compactColumns?: number;
    mobileColumns?: number;
    skeletonCount?: number;
    showUserMeta?: boolean;
    loadingMore?: boolean;
    meta?: Snippet<[PosterMedia]>;
  };

  const {
    items,
    columns = 6,
    compactColumns = Math.min(columns, 4),
    mobileColumns = 3,
    skeletonCount = columns * 2,
    showUserMeta = false,
    loadingMore = false,
    meta,
  }: PosterGridProps = $props();
</script>

<div
  class="boxed-poster-grid"
  style:--poster-columns={columns}
  style:--poster-columns-compact={compactColumns}
  style:--poster-columns-mobile={mobileColumns}
>
  {#if items}
    {#each items as media (media.key)}
      {#if meta}
        {#snippet tileMeta()}{@render meta(media)}{/snippet}
        <PosterTile {media} meta={tileMeta} />
      {:else}
        <PosterTile {media} {showUserMeta} />
      {/if}
    {/each}
    {#if loadingMore}
      {#each { length: columns }, index (index)}
        <PosterSkeleton showUserMeta={showUserMeta || Boolean(meta)} />
      {/each}
    {/if}
  {:else}
    {#each { length: skeletonCount }, index (index)}
      <PosterSkeleton showUserMeta={showUserMeta || Boolean(meta)} />
    {/each}
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-poster-grid {
    display: grid;
    grid-template-columns: repeat(var(--poster-columns), minmax(0, 1fr));
    gap: var(--gap-m);

    @include for-tablet-sm-and-below {
      grid-template-columns: repeat(
        var(--poster-columns-compact),
        minmax(0, 1fr)
      );
    }

    @include for-mobile {
      grid-template-columns: repeat(
        var(--poster-columns-mobile),
        minmax(0, 1fr)
      );
      gap: var(--gap-s);
    }
  }
</style>
