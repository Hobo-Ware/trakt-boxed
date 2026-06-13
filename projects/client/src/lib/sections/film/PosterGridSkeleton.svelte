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
    gap: clamp(8px, 1.2vw, 20px);

    &[data-columns="6"] { grid-template-columns: repeat(6, 1fr); }
    &[data-columns="7"] { grid-template-columns: repeat(7, 1fr); }
    &[data-columns="8"] { grid-template-columns: repeat(8, 1fr); }

    &__cell { margin: 0; min-width: 0; }

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
