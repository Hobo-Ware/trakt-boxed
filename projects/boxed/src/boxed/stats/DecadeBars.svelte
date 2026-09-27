<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { RankedCount } from "./_internal/toRankedCounts.ts";

  const { decades }: { decades: ReadonlyArray<RankedCount> | null } = $props();

  const max = $derived(Math.max(1, ...(decades ?? []).map(({ count }) => count)));
</script>

<ol class="boxed-decade-bars">
  {#if decades && decades.length === 0}
    <li class="decade-empty">{m.boxed_profile_empty()}</li>
  {:else if decades}
    {#each decades as decade (decade.key)}
      <li>
        <span class="decade-count">{decade.count}</span>
        <span class="decade-bar" style:height={`${(decade.count / max) * 100}%`}></span>
        <span class="decade-label">{decade.label}</span>
      </li>
    {/each}
  {/if}
</ol>

<style>
  .boxed-decade-bars {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: stretch;
    gap: var(--ni-12);
    height: var(--ni-236);

    li {
      flex: 1 1 0;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      gap: var(--ni-6);
    }
  }

  .decade-bar {
    width: 100%;
    max-height: calc(100% - var(--ni-48));
    border-radius: var(--border-radius-xs) var(--border-radius-xs) 0 0;
    background: var(--purple-500);
  }

  .decade-count {
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .decade-label {
    font-size: var(--ni-12);
  }

  .boxed-decade-bars li.decade-empty {
    justify-content: center;
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }
</style>
