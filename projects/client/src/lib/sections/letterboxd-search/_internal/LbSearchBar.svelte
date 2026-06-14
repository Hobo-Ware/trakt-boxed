<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import * as m from '$lib/features/i18n/messages.ts';
  import { useSearch } from '$lib/features/search/useSearch.ts';
  import { onMount } from 'svelte';

  const { clear, mode, isSearching } = useSearch();

  const placeholder = $derived.by(() => {
    switch ($mode) {
      case 'media':
        return m.input_placeholder_search();
      case 'movie':
        return m.input_placeholder_search_movies();
      case 'show':
        return m.input_placeholder_search_shows();
      case 'people':
        return m.input_placeholder_search_people();
      case 'lists':
        return m.input_placeholder_search_lists();
    }
  });

  let inputElement: HTMLInputElement;
  let value = $state(page.url.searchParams.get('q') ?? '');

  const commit = (next: string) => {
    const url = new URL(page.url.href);
    if (next.trim().length === 0) {
      url.searchParams.delete('q');
    } else {
      url.searchParams.set('q', next.trim());
      url.searchParams.set('m', $mode);
    }
    void goto(`${url.pathname}${url.search}`, {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  };

  const onInput = (event: Event) => {
    value = (event.currentTarget as HTMLInputElement).value;
    commit(value);
  };

  const onClear = () => {
    value = '';
    clear();
    commit('');
    inputElement?.focus();
  };

  onMount(() => inputElement?.focus());
</script>

<form class="lb-search-bar" role="search" onsubmit={(e) => e.preventDefault()}>
  <svg
    class="lb-search-bar__icon"
    viewBox="0 0 20 20"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.6" />
    <line x1="12.5" y1="12.5" x2="17" y2="17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
  </svg>
  <input
    bind:this={inputElement}
    type="search"
    autocomplete="off"
    class="lb-search-bar__input"
    {placeholder}
    {value}
    oninput={onInput}
    aria-label={placeholder}
  />
  {#if value.length > 0}
    <button
      type="button"
      class="lb-search-bar__clear"
      aria-label={m.button_label_search_clear()}
      onclick={onClear}
    >×</button>
  {/if}
  <span class="lb-search-bar__loading-track" aria-hidden="true">
    <span class="lb-search-bar__loading" data-active={$isSearching ? 'true' : undefined}></span>
  </span>
</form>

<style lang="scss">
  .lb-search-bar {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 14%, transparent);
    transition: border-color 140ms ease;
    padding: 6px 0;

    &:focus-within {
      border-bottom-color: var(--color-watched);
    }

    &__icon {
      flex-shrink: 0;
      margin-right: 8px;
      color: var(--color-text-secondary);
    }

    &__input {
      all: unset;
      flex: 1;
      font-size: 1.1rem;
      line-height: 1.4;
      color: var(--color-text-primary);
      background: transparent;
      min-width: 0;

      &::placeholder {
        color: var(--color-text-secondary);
      }

      &::-webkit-search-cancel-button {
        -webkit-appearance: none;
        display: none;
      }
    }

    &__clear {
      all: unset;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: var(--color-text-secondary);
      border-radius: 50%;

      &:hover { color: var(--color-text-primary); background: color-mix(in srgb, var(--shade-10) 6%, transparent); }
    }

    &__loading-track {
      position: absolute;
      inset: auto 0 -1px 0;
      height: 1px;
      pointer-events: none;
      overflow: hidden;
    }

    &__loading {
      display: block;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent 0%,
        var(--color-watched) 50%,
        transparent 100%
      );
      transform: translateX(-100%);
      opacity: 0;
      transition: opacity 120ms ease;

      &[data-active="true"] {
        opacity: 1;
        animation: lb-search-bar-shimmer 1.2s linear infinite;
      }
    }
  }

  @keyframes lb-search-bar-shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
</style>
