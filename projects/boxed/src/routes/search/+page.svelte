<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import SectionHeader from "$boxed/components/SectionHeader.svelte";
  import SearchRow from "$boxed/search/SearchRow.svelte";
  import SearchRowSkeleton from "$boxed/search/SearchRowSkeleton.svelte";
  import TrendingSearches from "$boxed/search/TrendingSearches.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SearchItem } from "$lib/features/search/models/SearchItem.ts";
  import { searchModeOptions } from "$lib/features/search/searchModeOptions.ts";
  import { useSearch } from "$lib/features/search/useSearch.ts";
  import { useSearchMode } from "$lib/features/search/useSearchMode.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { getListUrl } from "$lib/sections/lists/components/list-summary/getListUrl.ts";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { toTranslatedPosition } from "$lib/utils/formatting/string/toTranslatedPosition.ts";
  import { toTranslatedType } from "$lib/utils/formatting/string/toTranslatedType.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const SKELETON_ROWS = 6;

  const query = $derived(page.url.searchParams.get("q")?.trim() ?? "");
  const { search, clear, results, mode, isSearching, postRecentSearch } =
    useSearch();
  const { setMode } = useSearchMode();

  let term = $state(page.url.searchParams.get("q") ?? "");

  $effect(() => {
    if (!query) {
      clear();
      return;
    }

    search(query, $mode);
  });

  const updateQuery = (value: string) => {
    term = value;
    const url = new URL(page.url);
    if (value.trim()) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    goto(url, { replaceState: true, keepFocus: true, noScroll: true });
  };

  const record = (item: SearchItem) => query && postRecentSearch(item, query);

  const pageTitle = $derived(
    query ? m.page_title_search_results({ query }) : m.page_title_search(),
  );

  const isMedia = (item: SearchItem): item is MediaEntry => "type" in item &&
    (item.type === "movie" || item.type === "show");
  const isPerson = (item: SearchItem): item is PersonSummary =>
    "headshot" in item;

  const mediaMeta = (media: MediaEntry) =>
    [toTranslatedType(media.type), media.year].filter(Boolean).join(" · ");
  const personMeta = (person: PersonSummary) =>
    person.knownFor ? toTranslatedPosition(person.knownFor) : "";
  const listMeta = (list: MediaListSummary) =>
    [list.user.username, m.label_list_item_count({ count: list.count })].join(
      " · ",
    );

  const searchItems: ReadonlyArray<SearchItem> | null = $derived.by(() => {
    if ($isSearching && !$results) return null;
    return $results?.items ?? [];
  });
</script>

{#snippet results_list(items: ReadonlyArray<SearchItem> | null)}
  <ul class="boxed-search-results" aria-busy={items === null}>
    {#if items === null}
      {#each { length: SKELETON_ROWS }, index (index)}
        <li><SearchRowSkeleton /></li>
      {/each}
    {:else if items.length === 0}
      <li class="boxed-search-empty">{m.text_placeholder_generic()}</li>
    {:else}
      {#each items as item (item.key)}
        <li>{@render row(item)}</li>
      {/each}
    {/if}
  </ul>
{/snippet}

{#snippet row(item: SearchItem)}
  {#if isMedia(item)}
    <SearchRow
      href={UrlBuilder.media(item.type, item.slug)}
      image={item.poster.url.thumb}
      shape="poster"
      title={item.title}
      meta={mediaMeta(item)}
      onclick={() => record(item)}
    />
  {:else if isPerson(item)}
    <SearchRow
      href={UrlBuilder.people(item.slug)}
      image={item.headshot.url.thumb}
      shape="round"
      title={item.name}
      meta={personMeta(item)}
      onclick={() => record(item)}
    />
  {:else}
    <SearchRow
      href={getListUrl({ type: "user-list", list: item })}
      image={item.posters.at(0)?.url.thumb}
      shape="poster"
      title={item.name}
      meta={listMeta(item)}
      onclick={() => record(item)}
    />
  {/if}
{/snippet}

<TraktPage audience="authenticated" image={DEFAULT_SHARE_COVER} title={pageTitle}>
  <PageContainer>
    <div class="boxed-search" role="search">
      <label class="boxed-search-field">
        <SearchIcon />
        <input
          type="search"
          value={term}
          placeholder={m.input_placeholder_search()}
          aria-label={m.input_placeholder_search()}
          autocomplete="off"
          oninput={(event) => updateQuery(event.currentTarget.value)}
        />
      </label>

      <div class="boxed-search-modes" role="tablist">
        {#each searchModeOptions() as option (option.value)}
          <button
            type="button"
            role="tab"
            aria-selected={$mode === option.value}
            aria-label={option.label}
            class:is-active={$mode === option.value}
            onclick={() => setMode(option.value)}
          >
            {option.text}
          </button>
        {/each}
      </div>
    </div>

    <section>
      {#if !query}
        <SectionHeader title={m.list_title_most_popular_searches()} />
      {/if}
      {#if query}
        {@render results_list(searchItems)}
      {:else}
        {#key $mode}
          <TrendingSearches mode={$mode}>
            {#snippet children(items)}
              {@render results_list(items)}
            {/snippet}
          </TrendingSearches>
        {/key}
      {/if}
    </section>
  </PageContainer>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-search {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .boxed-search-field {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    height: var(--ni-56);
    padding-inline: var(--ni-18);

    border-radius: var(--border-radius-l);
    background: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    color: var(--color-text-secondary);

    &:focus-within {
      box-shadow: inset 0 0 0 var(--border-thickness-xs) var(--purple-400);
    }

    :global(svg) {
      width: var(--ni-22);
      height: var(--ni-22);
    }

    input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      color: var(--color-text-primary);
      font: inherit;
      font-size: var(--ni-20);

      @include for-mobile {
        font-size: var(--ni-16);
      }
    }
  }

  .boxed-search-modes {
    display: flex;
    gap: var(--gap-xs);
    overflow-x: auto;
    scrollbar-width: none;

    button {
      flex-shrink: 0;
      height: var(--ni-36);
      padding-inline: var(--ni-14);
      border: none;
      border-radius: var(--border-radius-xxl);
      background: var(--color-input-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
      color: var(--color-text-secondary);
      font: inherit;
      font-size: var(--ni-14);
      font-weight: 600;
      cursor: pointer;

      &.is-active {
        background: color-mix(in srgb, var(--purple-500) 22%, transparent);
        box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--purple-400);
        color: var(--color-text-primary);
      }
    }
  }

  .boxed-search-results {
    margin: 0;
    padding: 0;
    list-style: none;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    min-height: calc(6 * var(--ni-88));
  }

  .boxed-search-empty {
    padding: var(--ni-16) var(--ni-8);
    color: var(--color-text-secondary);
  }
</style>
