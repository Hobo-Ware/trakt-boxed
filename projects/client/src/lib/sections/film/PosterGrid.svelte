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
  @use "$style/scss/mixins/index" as *;

  /* Fill-the-row grid: column count is fixed at desktop and steps down at
     each breakpoint. Cards shrink proportionally so a 7-up row never
     becomes a 4-up row with leftover empty cells. Items stay aligned to
     the same right gutter as the shell padding. */
  .poster-grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--lb-grid-gap);
    grid-template-columns: repeat(var(--lb-poster-cols, 7), minmax(0, 1fr));

    &[data-columns="6"] { --lb-poster-cols: 6; }
    &[data-columns="7"] { --lb-poster-cols: 7; }
    &[data-columns="8"] { --lb-poster-cols: 8; }

    &__cell {
      margin: 0;
      min-width: 0;
    }

    @include for-tablet-lg {
      &[data-columns="7"] { --lb-poster-cols: 6; }
      &[data-columns="8"] { --lb-poster-cols: 6; }
    }

    @include for-tablet-sm {
      &[data-columns="6"] { --lb-poster-cols: 4; }
      &[data-columns="7"] { --lb-poster-cols: 5; }
      &[data-columns="8"] { --lb-poster-cols: 5; }
    }

    @include for-mobile {
      --lb-poster-cols: 3 !important;
    }
  }
</style>
