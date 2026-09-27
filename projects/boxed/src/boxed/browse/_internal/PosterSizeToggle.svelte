<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PosterSize } from "../PosterSize.ts";
  import { usePosterSize } from "../usePosterSize.ts";

  const { size, setSize } = usePosterSize();

  const options: ReadonlyArray<{ value: PosterSize; label: () => string }> = [
    { value: "large", label: m.boxed_chart_poster_large },
    { value: "small", label: m.boxed_chart_poster_small },
  ];
</script>

<div
  class="boxed-poster-size"
  role="group"
  aria-label={m.boxed_chart_poster_size()}
>
  {#each options as option (option.value)}
    <button
      type="button"
      aria-label={option.label()}
      aria-pressed={$size === option.value}
      class:is-active={$size === option.value}
      onclick={() => setSize(option.value)}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        aria-hidden="true"
      >
        {#if option.value === "large"}
          <rect x="4" y="4" width="7" height="7" rx="1" />
          <rect x="13" y="4" width="7" height="7" rx="1" />
          <rect x="4" y="13" width="7" height="7" rx="1" />
          <rect x="13" y="13" width="7" height="7" rx="1" />
        {:else}
          <rect x="3.5" y="3.5" width="4" height="4" rx="0.5" />
          <rect x="10" y="3.5" width="4" height="4" rx="0.5" />
          <rect x="16.5" y="3.5" width="4" height="4" rx="0.5" />
          <rect x="3.5" y="10" width="4" height="4" rx="0.5" />
          <rect x="10" y="10" width="4" height="4" rx="0.5" />
          <rect x="16.5" y="10" width="4" height="4" rx="0.5" />
          <rect x="3.5" y="16.5" width="4" height="4" rx="0.5" />
          <rect x="10" y="16.5" width="4" height="4" rx="0.5" />
          <rect x="16.5" y="16.5" width="4" height="4" rx="0.5" />
        {/if}
      </svg>
    </button>
  {/each}
</div>

<style>
  .boxed-poster-size {
    display: inline-flex;
    gap: var(--ni-2);
    padding: var(--ni-2);
    border-radius: var(--border-radius-m);
    background: var(--color-input-background);

    button {
      width: var(--ni-32);
      height: var(--ni-28);
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      border: none;
      border-radius: var(--border-radius-s);
      background: transparent;
      color: var(--color-text-secondary);
      cursor: pointer;

      &.is-active {
        background: var(--color-card-background);
        color: var(--color-text-primary);
        box-shadow: 0 0 0 var(--border-thickness-xxs) var(--color-border);
      }

      &:focus-visible {
        outline: var(--border-thickness-xs) solid var(--color-link-active);
        outline-offset: var(--ni-2);
      }
    }
  }
</style>
