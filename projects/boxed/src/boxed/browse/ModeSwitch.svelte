<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode.ts";
  import * as m from "$lib/features/i18n/messages.ts";

  const { options, mode, onModeChange } = useDiscover();

  const choose = (value: DiscoverMode) => {
    onModeChange(value);
    const url = new URL(page.url);
    url.searchParams.set("mode", value);
    goto(url, { replaceState: true, noScroll: true, keepFocus: true });
  };
</script>

<div
  class="boxed-mode-switch"
  role="radiogroup"
  aria-label={m.boxed_browse_mode_label()}
>
  {#each options as option (option.value)}
    <button
      type="button"
      role="radio"
      aria-checked={$mode === option.value}
      aria-label={option.label()}
      class:is-active={$mode === option.value}
      onclick={() => choose(option.value)}
    >
      {option.text()}
    </button>
  {/each}
</div>

<style>
  .boxed-mode-switch {
    display: inline-flex;
    gap: var(--ni-2);
    padding: var(--ni-4);
    border-radius: var(--border-radius-m);
    background: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);

    button {
      height: var(--ni-32);
      padding-inline: var(--ni-14);
      border: none;
      border-radius: var(--border-radius-s);
      background: transparent;
      color: var(--color-text-secondary);
      font: inherit;
      font-size: var(--ni-14);
      font-weight: 600;
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
