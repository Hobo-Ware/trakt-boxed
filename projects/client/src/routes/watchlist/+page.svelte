<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import PosterGrid from "$lib/sections/film/PosterGrid.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { usePaginatedListQuery } from "$lib/sections/lists/stores/usePaginatedListQuery.ts";
  import { watchlistQuery } from "$lib/requests/queries/users/watchlistQuery.ts";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { map } from "rxjs";

  const { list, isLoading } = $derived(
    usePaginatedListQuery(watchlistQuery({ sortBy: "added", limit: 35, page: 1 })),
  );

  const entries = $derived(
    list.pipe(
      map((items) =>
        items
          .map((item) => {
            if (item.type === "movie") return item.entry;
            if (item.type === "show") return item.entry;
            return null;
          })
          .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
      ),
    ),
  );
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_watchlist()}
  mode="content-only"
>
  <section class="watchlist">
    <header class="watchlist__header">
      <h1 class="watchlist__title">{m.page_title_watchlist()}</h1>
      <p class="watchlist__sub">{m.watchlist_subtitle()}</p>
    </header>

    {#if $isLoading && (!$entries || $entries.length === 0)}
      <div class="watchlist__loading" aria-live="polite"></div>
    {:else if !$entries || $entries.length === 0}
      <p class="watchlist__empty">{m.watchlist_empty()}</p>
    {:else}
      <PosterGrid entries={$entries} showTitle />
    {/if}
  </section>
</TraktPage>

<style lang="scss">
  .watchlist {
    max-width: 1200px;
    margin: 0 auto;
    padding: clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px);

    &__header {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
      padding-bottom: var(--gap-m);
      margin-bottom: var(--gap-m);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
    }

    &__title {
      font-family: var(--font-family-serif, "Tiempos Headline", Georgia, serif);
      font-weight: 400;
      font-size: clamp(1.6rem, 3vw, 2.4rem);
      margin: 0;
      color: var(--color-text-primary);
    }

    &__sub {
      margin: 0;
      font-size: 0.85rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    &__loading { min-height: 60vh; }

    &__empty {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: 1rem;
    }
  }
</style>
