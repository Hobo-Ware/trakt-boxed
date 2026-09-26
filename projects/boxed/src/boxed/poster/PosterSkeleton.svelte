<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";

  const { showUserMeta = false }: { showUserMeta?: boolean } = $props();
</script>

<div class="boxed-poster-skeleton" aria-hidden="true">
  <div class="boxed-poster-skeleton-frame">
    <Skeleton height="100%" radius="var(--border-radius-s)" />
  </div>
  {#if showUserMeta}
    <div class="boxed-poster-skeleton-meta"></div>
  {/if}
</div>

<style>
  .boxed-poster-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    min-width: 0;
  }

  .boxed-poster-skeleton-frame {
    aspect-ratio: 2 / 3;
    width: 100%;
  }

  .boxed-poster-skeleton-meta {
    height: var(--ni-16);
  }
</style>
