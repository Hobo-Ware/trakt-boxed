<script lang="ts">
  import DropdownCaretIcon from "$lib/components/dropdown/DropdownCaretIcon.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { FilterChipProps } from "./FilterChipProps.ts";
  import { toFilterValueLabel } from "./toFilterValueLabel.ts";

  const RESET_VALUE = "__reset_filter__";

  const { filter, label, value, onChange, onOpenDrawer }: FilterChipProps =
    $props();

  const valueLabel = $derived(
    value ? toFilterValueLabel({ filter, value }) : null,
  );

  const options = $derived(
    "options" in filter
      ? [
          { label: m.option_text_all(), value: RESET_VALUE },
          ...filter.options.map((option) => ({
            label: option.label(),
            value: option.value,
          })),
        ]
      : [],
  );

  const select = (next: string) =>
    onChange(next === RESET_VALUE ? null : next);
</script>

{#snippet chipText(open: boolean)}
  <span class="boxed-filter-chip-text">
    {label}{#if valueLabel}<span class="boxed-filter-chip-value"
        >: {valueLabel}</span
      >{/if}
  </span>
  <DropdownCaretIcon {open} />
{/snippet}

<span class="boxed-filter-chip" class:is-active={Boolean(value)}>
  {#if options.length > 0}
    <SingleSelect
      {options}
      value={value ?? null}
      placeholder={label}
      onChange={select}
      autoWidth
    >
      {#snippet trigger({ props, open })}
        <button
          {...props}
          type="button"
          class="boxed-filter-chip-trigger"
          aria-label={valueLabel ? `${label}: ${valueLabel}` : label}
        >
          {@render chipText(open)}
        </button>
      {/snippet}
    </SingleSelect>
  {:else}
    <button
      type="button"
      class="boxed-filter-chip-trigger"
      aria-haspopup="dialog"
      onclick={onOpenDrawer}
    >
      {@render chipText(false)}
    </button>
  {/if}

  {#if value}
    <button
      type="button"
      class="boxed-filter-chip-remove"
      aria-label={m.boxed_chart_remove_filter({ filter: label })}
      onclick={() => onChange(null)}
    >
      <CloseIcon />
    </button>
  {/if}
</span>

<style>
  .boxed-filter-chip {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    height: var(--ni-32);
    box-sizing: border-box;

    border-radius: var(--border-radius-xxl);
    background: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    color: var(--color-text-primary);

    &.is-active {
      background: color-mix(in srgb, var(--purple-500) 18%, transparent);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--purple-500);
    }
  }

  .boxed-filter-chip-trigger {
    height: 100%;
    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);
    padding-inline: var(--ni-14) var(--ni-10);

    border: none;
    border-radius: var(--border-radius-xxl);
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: var(--ni-14);
    white-space: nowrap;
    cursor: pointer;

    :global(.trakt-dropdown-caret) {
      width: var(--ni-12);
      height: var(--ni-12);
      color: var(--color-text-secondary);
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: var(--ni-2);
    }
  }

  .boxed-filter-chip-value {
    font-weight: 600;
  }

  .boxed-filter-chip-remove {
    width: var(--ni-24);
    height: var(--ni-24);
    margin-inline-end: var(--ni-4);
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-radius: 50%;
    background: color-mix(in srgb, var(--purple-500) 32%, transparent);
    color: inherit;
    cursor: pointer;

    :global(svg) {
      width: var(--ni-10);
      height: var(--ni-10);
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: var(--ni-2);
    }
  }
</style>
