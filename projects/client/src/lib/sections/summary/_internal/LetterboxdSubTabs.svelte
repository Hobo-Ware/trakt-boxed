<script lang="ts">
  type LetterboxdSubTabsProps = {
    items: Array<{ id: string; label: string }>;
    active: string;
    onSelect: (id: string) => void;
  };

  const { items, active, onSelect }: LetterboxdSubTabsProps = $props();
</script>

<nav class="lb-subtabs" aria-label="Section navigation">
  {#each items as item (item.id)}
    <button
      type="button"
      class="lb-subtabs-item"
      class:active={item.id === active}
      onclick={() => onSelect(item.id)}
    >
      {item.label}
    </button>
  {/each}
</nav>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-subtabs {
    display: flex;
    gap: var(--ni-22);
    overflow-x: auto;
    padding: var(--ni-2) 0 0;
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .lb-subtabs-item {
    flex-shrink: 0;
    background: transparent;
    border: 0;
    padding: var(--ni-10) var(--ni-2) var(--ni-12);
    color: var(--color-text-secondary);
    font-size: var(--ni-12);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 700;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;

    &:hover {
      color: var(--color-foreground);
    }

    &.active {
      color: var(--color-foreground);
      border-bottom-color: var(--tboxed-positive);
    }
  }
</style>
