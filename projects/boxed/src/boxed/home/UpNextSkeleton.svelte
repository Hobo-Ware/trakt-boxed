<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";

  const { hidden = false }: { hidden?: boolean } = $props();
</script>

<div class="boxed-up-next-skeleton" class:is-hidden={hidden} aria-hidden="true">
  <div class="boxed-up-next-skeleton-still">
    <Skeleton height="100%" radius="var(--border-radius-m)" />
  </div>
  <div class="boxed-up-next-skeleton-body">
    <div class="boxed-up-next-skeleton-text">
      <Skeleton width="60%" height="var(--ni-18)" />
      <Skeleton width="80%" height="var(--ni-14)" />
      <Skeleton width="40%" height="var(--ni-12)" />
    </div>
    <Skeleton width="var(--ni-40)" height="var(--ni-40)" radius="50%" />
  </div>
</div>

<style>
  .boxed-up-next-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    min-width: 0;

    &.is-hidden {
      visibility: hidden;
    }
  }

  .boxed-up-next-skeleton-still {
    aspect-ratio: 16 / 9;
  }

  .boxed-up-next-skeleton-body {
    display: flex;
    justify-content: space-between;
    gap: var(--gap-s);
    min-height: var(--ni-64);
  }

  .boxed-up-next-skeleton-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
  }
</style>
