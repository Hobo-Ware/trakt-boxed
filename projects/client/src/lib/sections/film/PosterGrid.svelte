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

  .poster-grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: clamp(8px, 1.2vw, 20px);

    &[data-columns="6"] { grid-template-columns: repeat(6, 1fr); }
    &[data-columns="7"] { grid-template-columns: repeat(7, 1fr); }
    &[data-columns="8"] { grid-template-columns: repeat(8, 1fr); }

    &__cell {
      margin: 0;
      min-width: 0;
    }

    @include for-tablet-lg {
      &[data-columns="7"],
      &[data-columns="8"] {
        grid-template-columns: repeat(5, 1fr);
      }
    }

    @include for-tablet-sm {
      &[data-columns="6"],
      &[data-columns="7"],
      &[data-columns="8"] {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @include for-mobile {
      grid-template-columns: repeat(4, 1fr) !important;
      gap: 8px;
    }
  }
</style>
