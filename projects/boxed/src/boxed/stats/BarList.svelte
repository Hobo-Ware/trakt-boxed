<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import type { RankedCount } from "./_internal/toRankedCounts.ts";

  type BarListProps = {
    items: ReadonlyArray<RankedCount> | null;
    rows: number;
    variant?: "bar" | "line";
    ranked?: boolean;
  };

  const { items, rows, variant = "bar", ranked = false }: BarListProps =
    $props();

  const max = $derived(Math.max(1, ...(items ?? []).map(({ count }) => count)));
</script>

<ol
  class="boxed-bar-list"
  data-variant={variant}
  style:--bar-rows={rows}
  class:is-ranked={ranked}
>
  {#if items === null}
    {#each { length: rows }, index (index)}
      <li aria-hidden="true">
        <span class="bar-label"><Skeleton width="70%" height="var(--ni-12)" /></span>
        <span class="bar-track"></span>
        <span class="bar-count"></span>
      </li>
    {/each}
  {:else if items.length === 0}
    <li class="bar-empty">{m.boxed_profile_empty()}</li>
  {:else}
    {#each items as item, index (item.key)}
      <li>
        {#if ranked}<span class="bar-rank">{index + 1}</span>{/if}
        <span class="bar-label" title={item.label}>{item.label}</span>
        <span class="bar-track">
          <span class="bar-fill" style:width={`${(item.count / max) * 100}%`}></span>
        </span>
        <span class="bar-count">{toHumanNumber(item.count, languageTag())}</span>
      </li>
    {/each}
  {/if}
</ol>

<style>
  .boxed-bar-list {
    --bar-height: var(--ni-18);

    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--ni-10);
    min-height: calc(
      var(--bar-rows) * var(--bar-height) + (var(--bar-rows) - 1) * var(--ni-10)
    );

    &[data-variant="line"] {
      --bar-fill: var(--purple-200);
    }

    li {
      display: flex;
      align-items: center;
      gap: var(--ni-12);
      height: var(--bar-height);
    }
  }

  .bar-rank {
    width: var(--ni-24);
    flex-shrink: 0;
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .bar-label {
    width: var(--ni-120);
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--ni-14);
  }

  .bar-track {
    flex: 1;
    height: 100%;
    border-radius: var(--border-radius-xs);
    background: var(--color-input-background);
    overflow: hidden;

    [data-variant="line"] & {
      height: var(--ni-8);
      border-radius: var(--border-radius-xxl);
    }
  }

  .bar-fill {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--bar-fill, var(--purple-500));
  }

  .bar-count {
    width: var(--ni-48);
    flex-shrink: 0;
    text-align: end;
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .boxed-bar-list li.bar-empty {
    flex: 1;
    justify-content: center;
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }
</style>
