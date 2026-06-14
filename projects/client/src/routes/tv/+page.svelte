<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import PosterGrid from "$lib/sections/film/PosterGrid.svelte";
  import PosterGridSkeleton from "$lib/sections/film/PosterGridSkeleton.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { usePopularList } from "$lib/sections/lists/popular/usePopularList";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/assets";

  const { list, isLoading } = $derived(
    usePopularList({ type: "show", limit: 35, page: 1 }),
  );
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.list_title_popular_shows()}
  mode="content-only"
>
  <section class="tv-page">
    <header class="tv-page__header">
      <h1 class="tv-page__title">{m.list_title_popular_shows()}</h1>
      <p class="tv-page__sub">{m.list_subtitle_popular_shows()}</p>
    </header>

    {#if $isLoading && $list.length === 0}
      <PosterGridSkeleton count={35} columns={7} />
    {:else}
      <PosterGrid entries={$list} />
    {/if}
  </section>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .tv-page {
    width: 100%;
    max-width: var(--lb-page-max-width);
    margin: 0 auto;
    padding: var(--lb-page-pad-y) var(--lb-page-pad-x);

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

    &__loading {
      min-height: 60vh;
    }
  }
</style>
