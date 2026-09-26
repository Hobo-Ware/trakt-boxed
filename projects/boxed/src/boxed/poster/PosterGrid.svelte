<script lang="ts">
  import PosterSkeleton from "./PosterSkeleton.svelte";
  import PosterTile from "./PosterTile.svelte";
  import type { PosterMedia } from "./PosterMedia.ts";

  type PosterGridProps = {
    items: ReadonlyArray<PosterMedia> | Nil;
    columns?: number;
    skeletonCount?: number;
    showUserMeta?: boolean;
  };

  const {
    items,
    columns = 6,
    skeletonCount = columns * 2,
    showUserMeta = false,
  }: PosterGridProps = $props();
</script>

<div
  class="boxed-poster-grid"
  style:--poster-columns={columns}
  style:--poster-columns-compact={Math.min(columns, 4)}
>
  {#if items}
    {#each items as media (media.key)}
      <PosterTile {media} {showUserMeta} />
    {/each}
  {:else}
    {#each { length: skeletonCount }, index (index)}
      <PosterSkeleton {showUserMeta} />
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
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--gap-s);
    }
  }
</style>
