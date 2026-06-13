<script lang="ts">
  import { page } from "$app/state";
  import * as m from "$lib/features/i18n/messages";
  import type { SearchItem } from "$lib/features/search/models/SearchItem";
  import { useSearch } from "$lib/features/search/useSearch";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import LbSearchBar from "$lib/sections/letterboxd-search/_internal/LbSearchBar.svelte";
  import LbSearchModes from "$lib/sections/letterboxd-search/_internal/LbSearchModes.svelte";
  import LetterboxdSearchResults from "$lib/sections/letterboxd-search/LetterboxdSearchResults.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const query = $derived(page.url.searchParams.get("q")?.trim());

  const { search, clear, results, mode, postRecentSearch } = useSearch();

  $effect(() => {
    if (!query) {
      clear();
      return;
    }
    search(query, $mode);
  });

  const pageTitle = $derived(
    query ? m.page_title_search_results({ query }) : m.page_title_search(),
  );

  const onResultClick = (item: SearchItem) => {
    if (!query) return;
    postRecentSearch(item, query);
  };
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={pageTitle}
  mode="content-only"
>
  <section class="lb-search">
    <header class="lb-search__head">
      <div class="lb-search__input"><LbSearchBar /></div>
      <div class="lb-search__modes"><LbSearchModes /></div>
    </header>

    <div class="lb-search__body">
      {#if $results}
        <LetterboxdSearchResults results={$results} onItemClick={onResultClick} />
      {:else if !query}
        <p class="lb-search__placeholder">{m.search_placeholder_copy()}</p>
      {/if}
    </div>
  </section>
</TraktPage>

<style lang="scss">
  .lb-search {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px);

    &__head {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
      margin-bottom: var(--gap-l);
      max-width: 720px;
    }

    &__input { width: 100%; }
    &__modes { width: 100%; }

    &__placeholder {
      margin: 0;
      padding: var(--gap-l) 0;
      text-align: center;
      color: var(--color-text-secondary);
      font-size: 0.95rem;
    }

    &__body { width: 100%; }
  }
</style>
