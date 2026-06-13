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
  <section class="lb-search" data-empty={!$results && !query ? "true" : undefined}>
    <header class="lb-search__head">
      <h1 class="lb-search__title">{m.page_title_search()}</h1>
      <p class="lb-search__copy">{m.search_placeholder_copy()}</p>
      <LbSearchBar />
      <LbSearchModes />
    </header>

    {#if $results}
      <div class="lb-search__body">
        <LetterboxdSearchResults results={$results} onItemClick={onResultClick} />
      </div>
    {/if}
  </section>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-search {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px);

    &__head {
      width: 100%;
      max-width: 640px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
      margin-bottom: var(--gap-l);
    }

    &__title {
      margin: 0;
      font-family: var(--font-family-serif, "Tiempos Headline", Georgia, serif);
      font-weight: 400;
      font-size: clamp(1.6rem, 3vw, 2.2rem);
      line-height: 1.1;
      color: var(--color-text-primary);
    }

    &__copy {
      margin: 0 0 var(--gap-s);
      font-size: 0.85rem;
      letter-spacing: 0.04em;
      color: var(--color-text-secondary);
    }

    &__body { width: 100%; }

    /* Empty state pulls the header up toward viewport vertical center */
    &[data-empty="true"] {
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;

      .lb-search__head {
        margin-bottom: 0;
      }
    }

    @include for-mobile {
      &[data-empty="true"] {
        min-height: 50vh;
        align-items: flex-start;
      }
    }
  }
</style>
