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
  @use "$style/scss/mixins/index" as *;

  .poster-grid-skeleton {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--lb-grid-gap);
    grid-template-columns: repeat(var(--lb-poster-cols, 7), minmax(0, 1fr));

    &[data-columns="6"] { --lb-poster-cols: 6; }
    &[data-columns="7"] { --lb-poster-cols: 7; }
    &[data-columns="8"] { --lb-poster-cols: 8; }

    &__cell { margin: 0; min-width: 0; }

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
