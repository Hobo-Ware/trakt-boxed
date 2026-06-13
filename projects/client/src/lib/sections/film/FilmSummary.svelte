<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { map } from 'rxjs';
  import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
  import { useFavorites } from '$lib/sections/media-actions/favorite/useFavorites.ts';
  import { useMarkAsWatched } from '$lib/sections/media-actions/mark-as-watched/useMarkAsWatched.ts';
  import { useWatchlist } from '$lib/sections/media-actions/watchlist/useWatchlist.ts';
  import { useRatings } from '$lib/sections/summary/components/rating/useRatings.ts';
  import { hasAired } from '$lib/utils/media/hasAired.ts';
  import FilmActionCard from './_internal/FilmActionCard.svelte';
  import FilmBackdrop from './_internal/FilmBackdrop.svelte';
  import FilmCastGrid from './_internal/FilmCastGrid.svelte';
  import FilmCrewPanel from './_internal/FilmCrewPanel.svelte';
  import FilmDetailsPanel from './_internal/FilmDetailsPanel.svelte';
  import { readTabFromUrl, writeTabToUrl, type FilmTab } from './_internal/filmTabs.ts';
  import FilmGenresPanel from './_internal/FilmGenresPanel.svelte';
  import FilmOverview from './_internal/FilmOverview.svelte';
  import FilmPoster from './_internal/FilmPoster.svelte';
  import FilmReleasesPanel from './_internal/FilmReleasesPanel.svelte';
  import FilmReviews from './_internal/FilmReviews.svelte';
  import FilmTabsBar from './_internal/FilmTabsBar.svelte';
  import FilmWhereToWatch from './_internal/FilmWhereToWatch.svelte';
  import FilmTagline from './_internal/FilmTagline.svelte';
  import FilmTitleBlock from './_internal/FilmTitleBlock.svelte';
  import type { FilmSummaryProps } from './models/FilmSummaryProps.ts';

  const { type, media, studios, crew, intl, streamOn, videos, sentiment }: FilmSummaryProps =
    $props();

  const { isAuthorized } = useAuth();

  const activeTab = $derived<FilmTab>(readTabFromUrl(page.url.searchParams));

  const selectTab = (tab: FilmTab) => {
    const next = writeTabToUrl(page.url, tab);
    void goto(`${next.pathname}${next.search}`, {
      replaceState: true,
      noScroll: true,
      keepFocus: true,
    });
  };

  const title = $derived(intl?.title ?? media.title);
  const tagline = $derived(intl?.tagline ?? media.tagline);
  const overview = $derived(intl?.overview ?? media.overview);

  const reviewsHref = $derived(
    type === 'movie' ? `/movies/${media.slug}/reviews` : `/shows/${media.slug}/reviews`,
  );
  const listsHref = $derived(
    type === 'movie' ? `/movies/${media.slug}/lists` : `/shows/${media.slug}/lists`,
  );
  const signInHref = '/silent-redirect';

  const navigateOrSignIn = (href: string) => {
    void goto($isAuthorized ? href : signInHref);
  };

  const markAction = $derived(
    useMarkAsWatched({
      type,
      media: {
        id: media.id,
        effectiveReleaseDate: media.effectiveReleaseDate,
        status: media.status,
      },
    }),
  );
  const watchlistAction = $derived(
    useWatchlist({ type, media: { id: media.id } }),
  );
  const favoriteAction = $derived(
    useFavorites({ type, id: media.id, title: media.title }),
  );
  const ratingAction = $derived(useRatings({ type, id: media.id }));

  const isWatchedStore = $derived(markAction.isWatched);
  const isWatchlistedStore = $derived(watchlistAction.isWatchlisted);
  const isFavoritedStore = $derived(favoriteAction.isFavorited);
  const currentRatingStore = $derived(
    ratingAction.current.pipe(map(($current) => $current?.rating ?? null)),
  );

  const isReleased = $derived(
    hasAired({
      type,
      effectiveReleaseDate: media.effectiveReleaseDate,
      status: media.status,
    }),
  );

  const toggleWatched = async () => {
    if (!$isAuthorized) return void goto(signInHref);
    if (!isReleased) return;
    if ($isWatchedStore) await markAction.removeWatched();
    else await markAction.markAsWatched('now');
  };

  const toggleLike = async () => {
    if (!$isAuthorized) return void goto(signInHref);
    if (!$isWatchedStore) return;
    if ($isFavoritedStore) await favoriteAction.removeFromFavorites();
    else await favoriteAction.addToFavorites();
  };

  const toggleWatchlist = async () => {
    if (!$isAuthorized) return void goto(signInHref);
    if ($isWatchlistedStore) await watchlistAction.removeFromWatchlist();
    else await watchlistAction.addToWatchlist();
  };

</script>

<article class="film-summary" data-type={type}>
  <FilmBackdrop src={media.cover?.url?.thumb} alt={title} />

  <div class="film-summary__shell">
    <aside class="film-summary__left">
      <FilmPoster src={media.poster?.url?.thumb} alt={title} />
      <FilmWhereToWatch {streamOn} />
    </aside>

    <main class="film-summary__center">
      <FilmTitleBlock
        {title}
        originalTitle={media.originalTitle}
        year={media.year}
        directors={crew.directors}
        creators={crew.creators}
        {type}
      />
      <FilmTagline text={tagline} />
      {#if overview}
        <FilmOverview text={overview} />
      {/if}

      <FilmTabsBar active={activeTab} onSelect={selectTab} />

      <div
        class="film-summary__tab-body"
        role="tabpanel"
        id={`film-tabpanel-${activeTab}`}
        aria-labelledby={`film-tab-${activeTab}`}
        tabindex="0"
      >
        {#if activeTab === 'cast'}
          <FilmCastGrid cast={crew.cast} />
        {:else if activeTab === 'crew'}
          <FilmCrewPanel directors={crew.directors} writers={crew.writers} creators={crew.creators} />
        {:else if activeTab === 'details'}
          <FilmDetailsPanel {media} {studios} />
        {:else if activeTab === 'genres'}
          <FilmGenresPanel {media} />
        {:else}
          <FilmReleasesPanel {media} />
        {/if}
      </div>

      <FilmReviews {type} slug={media.slug} />
    </main>

    <aside class="film-summary__right">
      <FilmActionCard
        isAuthenticated={$isAuthorized}
        isWatched={$isWatchedStore}
        isLiked={$isFavoritedStore}
        isOnWatchlist={$isWatchlistedStore}
        userRating={$currentRatingStore}
        {isReleased}
        onToggleWatched={toggleWatched}
        onToggleLike={toggleLike}
        onToggleWatchlist={toggleWatchlist}
        onRate={(value) => {
          if (!$isAuthorized) return void goto(signInHref);
          if (!$isWatchedStore) return;
          ratingAction.addRating(value);
        }}
        onClearRating={() => {
          if (!$isAuthorized) return;
          void ratingAction.removeRating();
        }}
        onOpenReview={() => navigateOrSignIn(reviewsHref)}
        onOpenLists={() => navigateOrSignIn(listsHref)}
      />
    </aside>
  </div>
</article>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .film-summary {
    position: relative;
    isolation: isolate;
    background: var(--shade-1000);
    min-height: 100dvh;
    padding-bottom: var(--gap-xl, 4rem);

    &__shell {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 1600px;
      margin: 0 auto;
      padding: clamp(120px, 18vw, 240px) clamp(16px, 3vw, 32px) 0;
      display: grid;
      grid-template-columns: 230px minmax(0, 1fr) 280px;
      gap: var(--gap-l);
      align-items: start;
    }

    &__left {
      position: sticky;
      top: 80px;
      display: flex;
      flex-direction: column;
      gap: var(--gap-m);
      margin-top: -40px;
    }

    &__center {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
      padding-top: var(--gap-s);
      min-width: 0;
    }

    &__right {
      position: sticky;
      top: 80px;
    }

    &__tab-body {
      margin-top: var(--gap-m);
    }

    @include for-tablet-sm {
      &__shell {
        grid-template-columns: 160px minmax(0, 1fr);
      }
      &__left { position: static; }
      &__right {
        grid-column: 1 / -1;
        position: static;
      }
    }

    @include for-mobile {
      &__shell {
        padding: clamp(80px, 30vw, 140px) var(--gap-s) 0;
        grid-template-columns: 120px minmax(0, 1fr);
      }
      &__left {
        position: static;
        margin-top: -20px;
      }
      &__right {
        grid-column: 1 / -1;
        position: static;
      }
    }
  }
</style>
