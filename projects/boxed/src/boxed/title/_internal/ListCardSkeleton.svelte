<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
</script>

<div class="boxed-list-card-skeleton" aria-hidden="true">
  <Skeleton width="var(--ni-144)" height="var(--ni-72)" radius="var(--border-radius-xs)" />
  <Skeleton width="70%" height="calc(var(--ni-18) * 1.2)" />
  <Skeleton width="50%" height="var(--ni-16)" />
</div>

<style>
  .boxed-list-card-skeleton {
    padding: var(--ni-12);

    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
  }
</style>
