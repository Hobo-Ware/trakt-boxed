<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import * as m from '$lib/features/i18n/messages.ts';
  import { useSearch } from '$lib/features/search/useSearch.ts';
  import type { SearchMode } from '$lib/requests/queries/search/models/SearchMode.ts';

  const { mode } = useSearch();

  const tabs: { value: SearchMode; label: string }[] = $derived([
    { value: 'media', label: m.button_text_toggle_search_media() },
    { value: 'movie', label: m.button_text_movies() },
    { value: 'show', label: m.button_text_shows() },
    { value: 'people', label: m.button_text_toggle_search_people() },
    { value: 'lists', label: m.button_text_toggle_search_lists() },
  ]);

  const onSelect = (value: SearchMode) => {
    mode.next(value);
    const url = new URL(page.url.href);
    url.searchParams.set('m', value);
    void goto(`${url.pathname}${url.search}`, {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  };
</script>

<nav class="lb-search-modes" role="tablist" aria-label="Search mode">
  {#each tabs as tab (tab.value)}
    <button
      type="button"
      role="tab"
      aria-selected={$mode === tab.value}
      class="lb-search-modes__tab"
      data-active={$mode === tab.value ? 'true' : undefined}
      onclick={() => onSelect(tab.value)}
    >
      {tab.label}
    </button>
  {/each}
</nav>

<style lang="scss">
  .lb-search-modes {
    display: flex;
    gap: var(--gap-m);
    border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
  }

  .lb-search-modes__tab {
    all: unset;
    cursor: pointer;
    padding: 8px 0;
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    position: relative;

    &:hover { color: var(--color-text-primary); }

    &[data-active="true"] {
      color: var(--color-text-primary);

      &::after {
        content: "";
        position: absolute;
        inset: auto 0 -1px 0;
        height: 2px;
        background: var(--color-watched);
      }
    }
  }
</style>
