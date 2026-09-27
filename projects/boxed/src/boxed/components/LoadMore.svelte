<script lang="ts">
  import { whileVisible } from "$boxed/utils/whileVisible.ts";

  const MAX_CHAINED_LOADS = 3;

  type LoadMoreProps = {
    hasNextPage: boolean;
    isLoading: boolean;
    loadedCount: number;
    onLoad: () => unknown;
  };

  const { hasNextPage, isLoading, loadedCount, onLoad }: LoadMoreProps =
    $props();

  let chainedLoads = 0;
  let rearm = $state(0);

  const load = () => {
    if (isLoading || !hasNextPage) return;
    if (chainedLoads >= MAX_CHAINED_LOADS) return;

    chainedLoads += 1;
    onLoad();
  };

  const USER_SCROLL_EVENTS = ["wheel", "touchmove", "keydown"] as const;

  const onUserScroll = () => {
    if (chainedLoads < MAX_CHAINED_LOADS) {
      chainedLoads = 0;
      return;
    }

    chainedLoads = 0;
    rearm += 1;
  };

  $effect(() => {
    USER_SCROLL_EVENTS.forEach((type) =>
      globalThis.addEventListener(type, onUserScroll, { passive: true })
    );

    return () =>
      USER_SCROLL_EVENTS.forEach((type) =>
        globalThis.removeEventListener(type, onUserScroll)
      );
  });
</script>

{#if hasNextPage}
  <div class="boxed-load-more">
    {#key `${loadedCount}:${rearm}`}
      <span class="load-more-trigger" use:whileVisible={load}></span>
    {/key}
  </div>
{/if}

<style>
  .boxed-load-more {
    visibility: hidden;
    overflow-anchor: none;
    height: 100vh;
    margin-bottom: calc(-1 * var(--ni-40));
  }

  .load-more-trigger {
    display: block;
    height: 100%;
  }
</style>
