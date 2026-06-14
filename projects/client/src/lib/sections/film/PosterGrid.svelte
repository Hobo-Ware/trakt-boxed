<script lang="ts">
  import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
  import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
  import PosterTile from './PosterTile.svelte';

  type Props = {
    entries: ReadonlyArray<MovieEntry | ShowEntry>;
    showTitle?: boolean;
    columns?: 6 | 7 | 8;
  };

  const { entries, showTitle = false, columns = 7 }: Props = $props();
</script>

<ul class="poster-grid" data-columns={columns}>
  {#each entries as entry (entry.key)}
    <li class="poster-grid__cell">
      <PosterTile {entry} {showTitle} />
    </li>
  {/each}
</ul>

<style lang="scss">
  /* Fluid grid: card minimum drives column count via auto-fill+minmax. No
     per-breakpoint col-count switches — the grid reflows continuously as
     the viewport changes width. data-columns now caps the maximum density
     by lifting the per-card minimum for sparser grids. */
  .poster-grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--lb-grid-gap);
    grid-template-columns: repeat(
      auto-fill,
      minmax(min(var(--lb-poster-min-w), 100%), 1fr)
    );

    &[data-columns="6"] {
      grid-template-columns: repeat(
        auto-fill,
        minmax(min(160px, 100%), 1fr)
      );
    }

    &[data-columns="8"] {
      grid-template-columns: repeat(
        auto-fill,
        minmax(min(120px, 100%), 1fr)
      );
    }

    &__cell {
      margin: 0;
      min-width: 0;
    }
  }
</style>
