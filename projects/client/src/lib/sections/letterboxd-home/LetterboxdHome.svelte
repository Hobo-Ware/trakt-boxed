<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
  import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
  import PosterGridSkeleton from '$lib/sections/film/PosterGridSkeleton.svelte';
  import { usePopularList } from '$lib/sections/lists/popular/usePopularList.ts';
  import HomeHeroCarousel from './_internal/HomeHeroCarousel.svelte';
  import HomeRow from './_internal/HomeRow.svelte';

  const { list: movies, isLoading: moviesLoading } = $derived(
    usePopularList({ type: 'movie', limit: 7, page: 1 }),
  );

  const { list: shows, isLoading: showsLoading } = $derived(
    usePopularList({ type: 'show', limit: 7, page: 1 }),
  );

  // Hero waits for BOTH movie + show top picks before mounting so the
  // backdrop never blinks from show -> movie (or vice versa) when one
  // query resolves before the other.
  const heroEntries = $derived.by((): ReadonlyArray<MovieEntry | ShowEntry> => {
    if ($moviesLoading || $showsLoading) return [];
    const top: (MovieEntry | ShowEntry)[] = [];
    const topMovie = $movies?.[0];
    const topShow = $shows?.[0];
    if (topMovie) top.push(topMovie);
    if (topShow) top.push(topShow);
    return top;
  });
</script>

<div class="home">
  {#if heroEntries.length > 0}
    <HomeHeroCarousel entries={heroEntries} />
  {:else}
    <div class="home__hero-placeholder" aria-hidden="true"></div>
  {/if}

  <div class="home__shell">
    {#if $moviesLoading && (!$movies || $movies.length === 0)}
      <section class="home__skeleton-row">
        <header class="home__skeleton-header">
          <div class="home__skeleton-eyebrow"></div>
          <div class="home__skeleton-title"></div>
        </header>
        <PosterGridSkeleton count={7} columns={7} />
      </section>
    {:else}
      <HomeRow
        eyebrow={m.home_row_eyebrow_popular_this_week()}
        title={m.home_row_title_films()}
        entries={$movies ?? []}
        viewAllHref="/films"
        viewAllLabel={m.home_row_view_all()}
      />
    {/if}

    {#if $showsLoading && (!$shows || $shows.length === 0)}
      <section class="home__skeleton-row">
        <header class="home__skeleton-header">
          <div class="home__skeleton-eyebrow"></div>
          <div class="home__skeleton-title"></div>
        </header>
        <PosterGridSkeleton count={7} columns={7} />
      </section>
    {:else}
      <HomeRow
        eyebrow={m.home_row_eyebrow_popular_this_week()}
        title={m.home_row_title_shows()}
        entries={$shows ?? []}
        viewAllHref="/tv"
        viewAllLabel={m.home_row_view_all()}
      />
    {/if}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .home {
    background: var(--shade-1000);
    min-height: 100dvh;

    &__hero-placeholder {
      width: 100%;
      aspect-ratio: 21 / 9;
      max-height: 520px;
      min-height: 280px;
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);
    }

    &__shell {
      width: 100%;
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 clamp(16px, 3vw, 32px) clamp(40px, 6vw, 80px);
    }

    &__skeleton-row {
      padding-top: var(--gap-l);
    }

    &__skeleton-header {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding-bottom: var(--gap-s);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
      margin-bottom: var(--gap-m);
    }

    &__skeleton-eyebrow {
      width: 160px;
      height: 0.7rem;
      min-height: 0.7rem;
      border-radius: 2px;
      background: var(--shade-900);
    }

    &__skeleton-title {
      width: 220px;
      height: 1.6rem;
      min-height: 1.6rem;
      border-radius: 3px;
      background: var(--shade-900);
    }
  }
</style>
