<script lang="ts">
  type ActionRowProps = ChildrenProps & (
    | { href: string; onclick?: never }
    | { href?: never; onclick: () => void }
  );

  const { href, onclick, children }: ActionRowProps = $props();
</script>

{#if href}
  <a class="boxed-action-row" {href}>{@render children()}</a>
{:else}
  <button class="boxed-action-row" {onclick}>{@render children()}</button>
{/if}

<style>
  .boxed-action-row {
    box-sizing: border-box;
    width: 100%;
    height: var(--ni-44);
    padding: 0 var(--ni-16);

    display: flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-top: var(--border-thickness-xxs) solid var(--color-border);
    background: none;
    cursor: pointer;

    font: inherit;
    font-size: var(--ni-14);
    text-decoration: none;
    color: var(--color-text-primary);

    &:hover,
    &:focus-visible {
      background: color-mix(in srgb, var(--color-foreground) 6%, transparent);
    }
  }
</style>
