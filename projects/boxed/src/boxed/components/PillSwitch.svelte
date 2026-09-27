<script lang="ts" generics="T extends string">
  type PillOption = { value: T; label: string; count?: string };

  type PillSwitchProps = {
    options: ReadonlyArray<PillOption>;
    value: T;
    disabled?: boolean;
    onChange: (value: T) => void;
  };

  const { options, value, disabled = false, onChange }: PillSwitchProps =
    $props();
</script>

<div class="boxed-pill-switch" role="radiogroup">
  {#each options as option (option.value)}
    <button
      type="button"
      role="radio"
      aria-checked={value === option.value}
      class:is-active={value === option.value}
      {disabled}
      onclick={() => onChange(option.value)}
    >
      {option.label}
      {#if option.count !== undefined}
        <span class="boxed-pill-count">{option.count}</span>
      {/if}
    </button>
  {/each}
</div>

<style>
  .boxed-pill-switch {
    display: inline-flex;
    gap: var(--ni-2);
    padding: var(--ni-4);
    border-radius: var(--border-radius-xxl);
    background: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);

    button {
      height: var(--ni-32);
      padding-inline: var(--ni-16);
      display: inline-flex;
      align-items: center;
      gap: var(--ni-6);
      border: none;
      border-radius: var(--border-radius-xxl);
      background: transparent;
      color: var(--color-text-secondary);
      font: inherit;
      font-size: var(--ni-14);
      font-weight: 600;
      cursor: pointer;

      &.is-active {
        background: var(--color-text-primary);
        color: var(--color-background);
      }

      &:focus-visible {
        outline: var(--border-thickness-xs) solid var(--color-link-active);
        outline-offset: var(--ni-2);
      }
    }
  }

  .boxed-pill-count {
    min-width: 2.8em;
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-11);
    font-weight: 500;
    text-align: start;
  }
</style>
