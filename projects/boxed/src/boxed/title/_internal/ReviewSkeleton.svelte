<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
</script>

<div class="boxed-review-skeleton" aria-hidden="true">
  <Skeleton width="var(--ni-36)" height="var(--ni-36)" radius="50%" />
  <div class="boxed-review-skeleton-lines">
    <Skeleton width="60%" height="var(--ni-20)" />
    <Skeleton height="calc(3 * var(--ni-14) * 1.6)" />
    <Skeleton width="var(--ni-160)" height="var(--ni-28)" />
  </div>
</div>

<style>
  .boxed-review-skeleton {
    box-sizing: border-box;
    padding-bottom: var(--ni-16);

    display: flex;
    gap: var(--ni-14);

    border-bottom: var(--border-thickness-xxs) solid transparent;
  }

  .boxed-review-skeleton-lines {
    flex: 1 1 0;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }
</style>
