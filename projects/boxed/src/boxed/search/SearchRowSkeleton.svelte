<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
</script>

<div class="boxed-search-row-skeleton" aria-hidden="true">
  <Skeleton width="var(--ni-48)" height="var(--ni-72)" radius="var(--border-radius-xs)" />
  <div class="boxed-search-row-skeleton-text">
    <Skeleton width="40%" height="var(--ni-20)" />
    <Skeleton width="25%" height="var(--ni-14)" />
  </div>
</div>

<style>
  .boxed-search-row-skeleton {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    min-height: var(--ni-88);
    padding: var(--ni-8);
    box-sizing: border-box;
  }

  .boxed-search-row-skeleton-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }
</style>
