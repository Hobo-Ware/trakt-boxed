<script lang="ts">
  /*
    Letterboxd-style search feed: a single column of result rows
    rather than the previous trakt poster grid. Matches research
    notes/search.md — mixed-entity feed, faceting handled upstream
    by SearchModeToggles. Data source untouched: items + type are
    the same shape as the old SearchResultsGrid contract.
  */
  import * as m from "$lib/features/i18n/messages.ts";
  import LetterboxdSearchRow from "./_internal/LetterboxdSearchRow.svelte";
  import type { SearchItem } from "./models/SearchItem";

  type LetterboxdSearchResultsProps = {
    items: SearchItem[];
    type: "media" | "people" | "lists";
    query?: string | Nil;
  };

  const { items, type, query }: LetterboxdSearchResultsProps = $props();

  const heading = $derived.by(() => {
    if (!query) return m.lb_search_eyebrow_default();
    return m.lb_search_eyebrow_results({ query });
  });
</script>

<section class="lb-search-feed">
  <header class="lb-search-feed-head">
    <p class="lb-search-feed-eyebrow">{heading}</p>
  </header>

  {#if items.length === 0}
    <p class="lb-search-feed-empty">
      {m.lb_search_empty()}
    </p>
  {:else}
    <ol class="lb-search-feed-list" data-type={type}>
      {#each items as item (item.key)}
        <li>
          <LetterboxdSearchRow {item} />
        </li>
      {/each}
    </ol>
  {/if}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-search-feed {
    width: 100%;
    max-width: var(--ni-960);
    margin-inline: auto;
    padding: var(--ni-22) var(--ni-16) var(--ni-44);
    box-sizing: border-box;

    @include for-tablet-lg {
      padding-inline: var(--ni-32);
    }
  }

  .lb-search-feed-head {
    padding-bottom: var(--ni-12);
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }

  .lb-search-feed-eyebrow {
    margin: 0;
    font-size: var(--ni-11);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--color-text-secondary);
  }

  .lb-search-feed-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .lb-search-feed-empty {
    margin: var(--ni-32) 0;
    color: var(--color-text-secondary);
    font-size: var(--ni-14);
    text-align: center;
  }
</style>
