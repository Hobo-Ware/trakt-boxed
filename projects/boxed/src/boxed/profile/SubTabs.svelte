<script lang="ts">
  import { page } from "$app/state";

  type SubTab<T extends string> = { id: T; label: string; href?: string };

  type SubTabsProps = {
    tabs: ReadonlyArray<SubTab<string>>;
    active: string;
    label: string;
  };

  const { tabs, active, label }: SubTabsProps = $props();

  const hrefFor = (tab: SubTab<string>) => {
    if (tab.href) return tab.href;
    const url = new URL(page.url);
    url.searchParams.set("tab", tab.id);
    return `${url.pathname}${url.search}`;
  };
</script>

<nav class="boxed-sub-tabs" aria-label={label}>
  {#each tabs as tab (tab.id)}
    <a
      href={hrefFor(tab)}
      class:is-active={tab.id === active}
      aria-current={tab.id === active ? "page" : undefined}
      data-sveltekit-replacestate={tab.href ? undefined : ""}
      data-sveltekit-noscroll={tab.href ? undefined : ""}
    >
      {tab.label}
    </a>
  {/each}
</nav>

<style>
  .boxed-sub-tabs {
    display: flex;
    gap: var(--gap-xs);
    min-height: var(--ni-36);
    overflow-x: auto;
    scrollbar-width: none;

    a {
      flex: 0 0 var(--ni-160);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: var(--ni-36);
      padding-inline: var(--ni-14);
      border-radius: var(--border-radius-xxl);
      background: var(--color-input-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);

      font-size: var(--ni-12);
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-decoration: none;
      white-space: nowrap;
      color: var(--color-text-secondary);

      &:hover,
      &:focus-visible {
        color: var(--color-text-primary);
      }

      &.is-active {
        background: color-mix(in srgb, var(--purple-500) 18%, transparent);
        box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--purple-500);
        color: var(--purple-100);
      }
    }
  }
</style>
