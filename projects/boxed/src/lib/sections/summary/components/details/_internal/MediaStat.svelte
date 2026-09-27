<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import type { Snippet } from "svelte";

  type MediaStatProps = {
    value: number;
    text: string;
    isLoading: boolean;
    icon: Snippet;
  };

  const { value, text, isLoading, icon }: MediaStatProps = $props();
</script>

<div class="trakt-media-stat">
  <div class="stat-icon">
    {@render icon()}
  </div>

  <span class="stat-label">{text}</span>

  <span class="stat-value">
    {#if isLoading}
      <Skeleton width="var(--ni-32)" height="1lh" />
    {:else}
      {toHumanNumber(value, languageTag())}
    {/if}
  </span>
</div>

<style>
  .trakt-media-stat {
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);

    background-color: var(--color-input-background);

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ni-4);

    border-radius: var(--border-radius-m);

    padding: var(--ni-12);

    flex: 1;
    min-width: 0;
  }

  .stat-label {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .stat-value {
    font-family: var(--boxed-font-title);
    font-size: var(--ni-20);
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.2;
    color: var(--color-text-primary);
  }

  .stat-icon {
    display: flex;
    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }
  }
</style>
