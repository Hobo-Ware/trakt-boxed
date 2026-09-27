<script lang="ts">
  import type { Snippet } from "svelte";
  import PosterSkeleton from "../../poster/PosterSkeleton.svelte";
  import PosterTile from "../../poster/PosterTile.svelte";
  import type { PosterMedia } from "../../poster/PosterMedia.ts";

  type PosterQuadProps = {
    items: ReadonlyArray<PosterMedia> | null;
    emptyText: string;
    showUserMeta?: boolean;
    meta?: Snippet<[PosterMedia]>;
    loading?: "lazy" | "eager";
  };

  const {
    items,
    emptyText,
    showUserMeta = false,
    meta,
    loading = "lazy",
  }: PosterQuadProps = $props();

  const hasMeta = $derived(showUserMeta || Boolean(meta));
</script>

<div class="boxed-poster-quad">
  {#if items && items.length > 0}
    {#each items.slice(0, 4) as media (media.key)}
      {#if meta}
        {#snippet tileMeta()}{@render meta(media)}{/snippet}
        <PosterTile {media} quality="medium" {loading} meta={tileMeta} />
      {:else}
        <PosterTile {media} quality="medium" {loading} {showUserMeta} />
      {/if}
    {/each}
  {:else}
    {#each { length: 4 }, index (index)}
      <div class:is-empty={items !== null}>
        <PosterSkeleton showUserMeta={hasMeta} />
      </div>
    {/each}
    {#if items !== null}
      <p class="quad-empty">{emptyText}</p>
    {/if}
  {/if}
</div>

<style>
  .boxed-poster-quad {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--gap-m);

    .is-empty {
      visibility: hidden;
    }
  }

  .quad-empty {
    position: absolute;
    inset: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-m);
    border: var(--border-thickness-xxs) dashed var(--color-border);
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }
</style>
