<script lang="ts">
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import type { DrawerSearchInputProps } from "./DrawerSearchInputProps";

  let { value = $bindable(""), label, placeholder }: DrawerSearchInputProps =
    $props();
</script>

<label class="trakt-drawer-search-input">
  <SearchIcon />
  <input
    bind:value
    type="search"
    aria-label={label}
    {placeholder}
  />
</label>

<style lang="scss">
  .trakt-drawer-search-input {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
    cursor: text;

    margin-block: var(--drawer-search-input-margin-block, 0);
    min-height: var(--ni-40);
    padding: 0 var(--ni-12);
    box-sizing: border-box;

    border-radius: var(--border-radius-s);
    background: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    color: var(--color-text-primary);
    font-size: var(--ni-14);

    &:focus-within {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: 0;
    }

    :global(svg) {
      flex-shrink: 0;
      width: var(--ni-18);
      height: var(--ni-18);
      color: var(--color-text-secondary);
    }

    input {
      all: unset;
      min-width: 0;
      width: 100%;
      height: 100%;
      font: inherit;

      &::placeholder {
        color: var(--color-text-secondary);
      }
    }
  }
</style>
