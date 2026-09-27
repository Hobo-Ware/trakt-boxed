<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
</script>

<li class="boxed-episode-row-skeleton" aria-hidden="true">
  <div class="boxed-episode-row-skeleton-still">
    <Skeleton height="100%" radius="var(--border-radius-s)" />
  </div>
  <div class="boxed-episode-row-skeleton-text">
    <Skeleton width="var(--ni-60)" height="var(--ni-14)" />
    <Skeleton width="50%" height="var(--ni-20)" />
    <Skeleton width="var(--ni-120)" height="var(--ni-12)" />
  </div>
</li>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-episode-row-skeleton {
    box-sizing: border-box;
    height: var(--ni-120);
    padding: var(--ni-10);

    display: grid;
    grid-template-columns: var(--ni-176) minmax(0, 1fr);
    align-items: center;
    column-gap: var(--ni-18);

    border-bottom: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-border) 60%, transparent);

    @include for-mobile {
      height: var(--ni-80);
      padding: var(--ni-8) 0;
      grid-template-columns: var(--ni-104) minmax(0, 1fr);
      column-gap: var(--ni-12);
    }
  }

  .boxed-episode-row-skeleton-still {
    aspect-ratio: 16 / 9;
  }

  .boxed-episode-row-skeleton-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }
</style>
