<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import type { SearchResponse } from '$lib/features/search/models/SearchResponse.ts';
  import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
  import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
  import PosterGrid from '$lib/sections/film/PosterGrid.svelte';
  import ListCard from '$lib/sections/letterboxd-lists/ListCard.svelte';
  import PersonCard from './_internal/PersonCard.svelte';

  type Props = {
    results: SearchResponse;
    onItemClick?: (item: SearchResponse['items'][number]) => void;
  };

  const { results, onItemClick }: Props = $props();
</script>

<section class="search-results" data-type={results.type}>
  {#if results.type === 'media'}
    {@const entries = results.items.filter((item) =>
      item.type === 'movie' || item.type === 'show'
    ) as ReadonlyArray<MovieEntry | ShowEntry>}
    {#if entries.length === 0}
      <p class="search-results__empty">{m.search_empty()}</p>
    {:else}
      <PosterGrid entries={entries} showTitle columns={7} />
    {/if}
  {:else if results.type === 'lists'}
    {#if results.items.length === 0}
      <p class="search-results__empty">{m.search_empty()}</p>
    {:else}
      <ul class="search-results__lists">
        {#each results.items as list (list.id)}
          <li>
            <button
              type="button"
              class="search-results__hit"
              onclick={() => onItemClick?.(list)}
            ><ListCard {list} /></button>
          </li>
        {/each}
      </ul>
    {/if}
  {:else}
    {#if results.items.length === 0}
      <p class="search-results__empty">{m.search_empty()}</p>
    {:else}
      <ul class="search-results__people">
        {#each results.items as person (person.id)}
          <li>
            <button
              type="button"
              class="search-results__hit"
              onclick={() => onItemClick?.(person)}
            ><PersonCard {person} /></button>
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .search-results {
    width: 100%;

    &__empty {
      margin: 0;
      padding: var(--gap-l) 0;
      text-align: center;
      color: var(--color-text-secondary);
    }

    &__lists {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--gap-m);

      @include for-tablet-sm { grid-template-columns: repeat(2, 1fr); }
      @include for-mobile { grid-template-columns: 1fr; }
    }

    &__people {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: var(--gap-m);

      @include for-tablet-sm { grid-template-columns: repeat(4, 1fr); }
      @include for-mobile { grid-template-columns: repeat(3, 1fr); }
    }

    &__hit {
      all: unset;
      cursor: pointer;
      display: block;
      width: 100%;
    }
  }
</style>
