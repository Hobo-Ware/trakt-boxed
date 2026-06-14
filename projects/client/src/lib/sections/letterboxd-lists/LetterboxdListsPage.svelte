<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { useQuery } from '$lib/features/query/useQuery.ts';
  import { searchListsQuery } from '$lib/requests/queries/search/searchListsQuery.ts';
  import { map } from 'rxjs';
  import ListCardSkeleton from './_internal/ListCardSkeleton.svelte';
  import ListsHero from './_internal/ListsHero.svelte';
  import ListsRow from './_internal/ListsRow.svelte';

  const query = useQuery(searchListsQuery({ limit: 30 }));

  const lists = $derived(query.pipe(map(($q) => $q.data?.items ?? [])));
  const isLoading = $derived(
    query.pipe(map(($q) => $q.isLoading || ($q.isFetching && !$q.data))),
  );
</script>

<div class="lists-page">
  <ListsHero />

  <div class="lists-page__shell">
    {#if $isLoading}
      <section class="lists-page__skeleton-row">
        <header class="lists-page__skeleton-head">
          <div class="lists-page__skeleton-eyebrow"></div>
          <div class="lists-page__skeleton-title"></div>
        </header>
        <ul class="lists-page__skeleton-grid">
          {#each Array.from({ length: 6 }) as _, i (i)}
            <li><ListCardSkeleton /></li>
          {/each}
        </ul>
      </section>
    {:else if $lists.length > 0}
      <ListsRow eyebrow={m.lists_row_trending()} lists={$lists} />
    {:else}
      <p class="lists-page__empty">{m.lists_empty()}</p>
    {/if}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lists-page {
    background: var(--shade-1000);
    min-height: 100dvh;

    &__shell {
      width: 100%;
      max-width: var(--lb-page-max-width);
      margin: 0 auto;
      padding: 0 var(--lb-page-pad-x) clamp(40px, 6vw, 80px);
    }

    &__empty {
      margin: var(--gap-l) 0;
      color: var(--color-text-secondary);
      text-align: center;
    }

    &__skeleton-row { padding-top: var(--gap-l); }
    &__skeleton-head {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding-bottom: var(--gap-s);
      margin-bottom: var(--gap-m);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
    }
    &__skeleton-eyebrow {
      width: 120px;
      height: calc(0.7rem * 1.4);
      border-radius: 2px;
      background: var(--shade-900);
    }
    &__skeleton-title {
      width: 220px;
      height: 1.6rem;
      border-radius: 3px;
      background: var(--shade-900);
    }
    &__skeleton-grid {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(
        auto-fill,
        minmax(min(var(--lb-card-min-w), 100%), 1fr)
      );
      gap: var(--gap-m);
    }
  }
</style>
