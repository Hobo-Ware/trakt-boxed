<script lang="ts">
  import { goto } from "$app/navigation";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  let term = $state("");

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    const query = term.trim();
    if (!query) return;

    term = "";
    goto(`${UrlBuilder.search()}?q=${encodeURIComponent(query)}`);
  };
</script>

<form class="boxed-header-search" role="search" onsubmit={submit}>
  <label class="search-field">
    <SearchIcon />
    <input
      type="search"
      bind:value={term}
      placeholder={m.boxed_header_search_placeholder()}
      aria-label={m.button_label_search()}
      autocomplete="off"
      enterkeyhint="search"
    />
  </label>
</form>

<style lang="scss">
  .boxed-header-search {
    width: clamp(var(--ni-160), 16vw, var(--ni-220));
    margin: 0;
  }

  .search-field {
    height: var(--ni-36);
    box-sizing: border-box;
    padding-inline: var(--ni-12);

    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    border-radius: var(--border-radius-m);
    background: var(--color-input-background);
    color: var(--color-text-secondary);
    cursor: text;

    &:focus-within {
      box-shadow: inset 0 0 0 var(--border-thickness-xs) var(--purple-400);
    }

    :global(svg) {
      flex-shrink: 0;
      width: var(--ni-16);
      height: var(--ni-16);
    }

    input {
      flex: 1;
      min-width: 0;
      padding: 0;
      border: none;
      outline: none;
      background: transparent;
      color: var(--color-text-primary);
      font: inherit;
      font-size: calc(var(--ni-12) + var(--ni-1));

      &::placeholder {
        color: var(--color-text-secondary);
      }
    }
  }
</style>
