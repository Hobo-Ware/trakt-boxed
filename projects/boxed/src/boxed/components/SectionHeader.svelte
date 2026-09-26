<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";

  type SectionHeaderProps = {
    title: string;
    href?: string;
    linkLabel?: string;
    actions?: Snippet;
  };

  const { title, href, linkLabel, actions }: SectionHeaderProps = $props();
</script>

<header class="boxed-section-header">
  <h2 class="boxed-section-title">
    {#if href}
      <a {href}>{title}</a>
    {:else}
      {title}
    {/if}
  </h2>
  <div class="boxed-section-aside">
    {@render actions?.()}
    {#if href}
      <a class="boxed-section-more" {href} aria-label={linkLabel ?? title}>
        {m.button_text_view_all()}
      </a>
    {/if}
  </div>
</header>

<style>
  .boxed-section-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--gap-m);

    padding-bottom: var(--ni-8);
    margin-bottom: var(--ni-12);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);
  }

  .boxed-section-title {
    font-size: var(--ni-12);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);

    a {
      color: inherit;
      text-decoration: none;

      &:hover,
      &:focus-visible {
        color: var(--color-text-primary);
      }
    }
  }

  .boxed-section-aside {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .boxed-section-more {
    font-size: var(--ni-12);
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--color-text-secondary);

    &:hover,
    &:focus-visible {
      color: var(--color-text-primary);
    }
  }
</style>
