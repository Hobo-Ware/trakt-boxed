<script lang="ts">
  import PosterSkeleton from './PosterSkeleton.svelte';

  type Props = {
    count?: number;
    columns?: 6 | 7 | 8;
    showTitle?: boolean;
  };

  const { count = 7, columns = 7, showTitle = false }: Props = $props();
</script>

<ul class="poster-grid-skeleton" data-columns={columns} aria-hidden="true">
  {#each Array.from({ length: count }) as _, i (i)}
    <li class="poster-grid-skeleton__cell">
      <PosterSkeleton {showTitle} />
    </li>
  {/each}
</ul>

<style lang="scss">
  .poster-grid-skeleton {
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

    &__cell { margin: 0; min-width: 0; }
  }
</style>
