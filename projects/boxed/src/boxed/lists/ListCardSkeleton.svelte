<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";

  const { variant = "row" }: { variant?: "row" | "tile" } = $props();
</script>

<div class="boxed-list-card-skeleton" data-variant={variant} aria-hidden="true">
  <div class="boxed-list-card-skeleton-fan">
    <Skeleton height="100%" radius="var(--border-radius-xs)" />
  </div>
  <div class="boxed-list-card-skeleton-text">
    <Skeleton width="60%" height="var(--ni-20)" />
    <Skeleton width="40%" height="var(--ni-12)" />
    <Skeleton width="90%" height="var(--ni-14)" />
  </div>
</div>

<style>
  .boxed-list-card-skeleton {
    display: grid;
    grid-template-columns: var(--ni-200) minmax(0, 1fr);
    align-items: center;
    gap: var(--gap-l);
    padding: var(--ni-8);

    &[data-variant="tile"] {
      grid-template-columns: minmax(0, 1fr);
      align-items: start;
    }
  }

  .boxed-list-card-skeleton-fan {
    aspect-ratio: 200 / 96;
  }

  .boxed-list-card-skeleton-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }
</style>
