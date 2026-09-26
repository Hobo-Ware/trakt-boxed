<script lang="ts">
  import PosterSkeleton from "./PosterSkeleton.svelte";
  import PosterTile from "./PosterTile.svelte";
  import type { PosterMedia } from "./PosterMedia.ts";

  type PosterRowProps = {
    items: ReadonlyArray<PosterMedia> | Nil;
    skeletonCount?: number;
    showUserMeta?: boolean;
    label: string;
  };

  const {
    items,
    skeletonCount = 8,
    showUserMeta = false,
    label,
  }: PosterRowProps = $props();
</script>

<ul class="boxed-poster-row" aria-label={label}>
  {#if items}
    {#each items as media (media.key)}
      <li><PosterTile {media} {showUserMeta} /></li>
    {/each}
  {:else}
    {#each { length: skeletonCount }, index (index)}
      <li><PosterSkeleton {showUserMeta} /></li>
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

    @include for-mobile {
      --poster-row-width: var(--ni-104);
      gap: var(--gap-s);
    }
  }
</style>
