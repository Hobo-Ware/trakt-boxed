<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { usePopularList } from '$lib/sections/lists/popular/usePopularList.ts';
  import HomeHero from './_internal/HomeHero.svelte';
  import HomeRow from './_internal/HomeRow.svelte';

  const { list: movies, isLoading: moviesLoading } = $derived(
    usePopularList({ type: 'movie', limit: 7, page: 1 }),
  );

  const { list: shows, isLoading: showsLoading } = $derived(
    usePopularList({ type: 'show', limit: 7, page: 1 }),
  );

  const featured = $derived($movies?.[0] ?? $shows?.[0]);
</script>

<div class="home">
  {#if featured}
    <HomeHero entry={featured} />
  {:else}
    <div class="home__hero-placeholder" aria-hidden="true"></div>
  {/if}

  <div class="home__shell">
    <HomeRow
      eyebrow={m.home_row_eyebrow_popular_this_week()}
      title={m.home_row_title_films()}
      entries={$movies ?? []}
      viewAllHref="/films"
      viewAllLabel={m.home_row_view_all()}
    />

    <HomeRow
      eyebrow={m.home_row_eyebrow_popular_this_week()}
      title={m.home_row_title_shows()}
      entries={$shows ?? []}
      viewAllHref="/tv"
      viewAllLabel={m.home_row_view_all()}
    />

    {#if $moviesLoading && (!$movies || $movies.length === 0) && $showsLoading && (!$shows || $shows.length === 0)}
      <div class="home__loading" aria-live="polite"></div>
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
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 clamp(16px, 3vw, 32px) clamp(40px, 6vw, 80px);
    }

    &__loading {
      min-height: 30vh;
    }
  }
</style>
