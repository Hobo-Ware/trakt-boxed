<script lang="ts" generics="T extends string">
  import { page } from "$app/state";

  type TitleTab = { id: T; label: string; count?: string | null };

  type TitleTabsProps = {
    tabs: ReadonlyArray<TitleTab>;
    active: T | undefined;
    param: string;
    variant?: "compact" | "roomy";
  };

  const { tabs, active, param, variant = "compact" }: TitleTabsProps = $props();

  const toHref = (id: T) => {
    const url = new URL(page.url);
    url.searchParams.set(param, id);
    return `${url.pathname}${url.search}`;
  };
</script>

<div class="boxed-title-tablist" role="tablist" data-variant={variant}>
  {#each tabs as tab (tab.id)}
    <a
      class="boxed-title-tab"
      role="tab"
      href={toHref(tab.id)}
      aria-selected={tab.id === active}
      data-sveltekit-replacestate
      data-sveltekit-noscroll
      data-sveltekit-keepfocus
    >
      {tab.label}
      {#if tab.count !== undefined}
        <span class="boxed-title-tab-count">{tab.count ?? ""}</span>
      {/if}
    </a>
  {/each}
</div>

<style>
  .boxed-title-tablist {
    display: flex;
    gap: var(--ni-22);

    border-bottom: var(--border-thickness-xxs) solid var(--color-border);
    overflow-x: auto;
    scrollbar-width: none;

    &[data-variant="roomy"] {
      gap: var(--ni-28);
    }
  }

  .boxed-title-tab {
    flex-shrink: 0;
    padding-bottom: var(--ni-10);

    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);

    font-size: var(--ni-12);
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    white-space: nowrap;
    color: var(--color-text-secondary);

    &:hover,
    &:focus-visible {
      color: var(--color-text-primary);
    }

    &[aria-selected="true"] {
      color: var(--color-text-primary);
      box-shadow: inset 0 calc(-1 * var(--ni-2)) 0 var(--purple-500);
    }

    [data-variant="roomy"] > & {
      padding-bottom: var(--ni-12);
    }
  }

  .boxed-title-tab-count {
    min-width: 3.6em;

    font-family: var(--boxed-font-mono);
    font-size: var(--ni-11);
    letter-spacing: 0;
    color: var(--color-text-secondary);
  }
</style>
