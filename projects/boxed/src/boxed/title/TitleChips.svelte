<script lang="ts">
  import type { TitleChip } from "./TitleChip.ts";

  type TitleChipsProps = {
    items: ReadonlyArray<TitleChip>;
    more?: { label: string; href: string };
    emptyText?: string;
  };

  const { items, more, emptyText }: TitleChipsProps = $props();
</script>

<ul class="boxed-title-chips">
  {#each items as item (item.key)}
    <li>
      <svelte:element
        this={item.href ? "a" : "span"}
        class="boxed-title-chip"
        href={item.href}
        title={item.detail}
      >
        {item.label}
        {#if item.detail}
          <span class="boxed-title-chip-detail">{item.detail}</span>
        {/if}
      </svelte:element>
    </li>
  {:else}
    {#if emptyText}
      <li class="boxed-title-chips-empty">{emptyText}</li>
    {/if}
  {/each}
  {#if more}
    <li>
      <a
        class="boxed-title-chip is-more"
        href={more.href}
        data-sveltekit-noscroll
        data-sveltekit-replacestate
      >
        {more.label}
      </a>
    </li>
  {/if}
</ul>

<style>
  .boxed-title-chips {
    margin: 0;
    padding: 0;
    list-style: none;

    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-8);
  }

  .boxed-title-chip {
    box-sizing: border-box;
    height: var(--ni-28);
    padding: 0 var(--ni-12);

    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);

    border-radius: var(--border-radius-xxl);
    background: var(--color-card-background);

    font-size: var(--ni-12);
    text-decoration: none;
    white-space: nowrap;
    color: var(--color-text-primary);

    &.is-more {
      background: transparent;
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
      color: var(--color-link-active);
    }
  }

  a.boxed-title-chip:hover,
  a.boxed-title-chip:focus-visible {
    color: var(--color-link-active);
  }

  .boxed-title-chip-detail {
    color: var(--color-text-secondary);
  }

  .boxed-title-chips-empty {
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }
</style>
