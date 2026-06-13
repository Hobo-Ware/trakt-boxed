<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
  import { composerStore } from '$lib/sections/composer';
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
  import FilmTabsBar from './_internal/FilmTabsBar.svelte';
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

  const openComposer = () => {
    composerStore.open({
      kind: type,
      id: media.id,
      slug: media.slug,
      title: media.title,
      year: media.year,
      posterUrl: media.poster?.url?.thumb,
      effectiveReleaseDate: media.effectiveReleaseDate,
    });
  };
</script>

<article class="film-summary" data-type={type}>
  <FilmBackdrop src={media.cover?.url?.thumb} alt={title} />

  <div class="film-summary__shell">
    <div class="film-summary__hero">
      <div class="film-summary__poster">
        <FilmPoster src={media.poster?.url?.thumb} alt={title} />
      </div>

      <div class="film-summary__body">
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
      </div>

      <div class="film-summary__rail">
        <FilmActionCard
          isAuthenticated={$isAuthorized}
          isWatched={false}
          isLiked={false}
          isOnWatchlist={false}
          userRating={null}
          onToggleWatched={openComposer}
          onToggleLike={openComposer}
          onToggleWatchlist={openComposer}
          onOpenRate={openComposer}
          onOpenReview={openComposer}
          onOpenLists={openComposer}
        />
      </div>
    </div>

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
      max-width: 1600px;
      margin: 0 auto;
      padding: clamp(120px, 18vw, 240px) clamp(16px, 3vw, 32px) 0;
    }

    &__hero {
      display: grid;
      grid-template-columns: 230px 1fr 280px;
      gap: var(--gap-l);
      align-items: start;
    }

    &__poster {
      position: relative;
      margin-top: -40px;
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
      padding-top: var(--gap-s);
    }

    &__rail {
      position: sticky;
      top: 96px;
    }

    &__tab-body {
      margin-top: var(--gap-m);
    }

    @include for-tablet-sm {
      &__hero {
        grid-template-columns: 160px 1fr;
      }
      &__rail {
        grid-column: 1 / -1;
        position: static;
      }
    }

    @include for-mobile {
      &__shell {
        padding: clamp(80px, 30vw, 140px) var(--gap-s) 0;
      }
      &__hero {
        grid-template-columns: 120px 1fr;
      }
      &__poster {
        margin-top: -20px;
      }
      &__rail {
        grid-column: 1 / -1;
        position: static;
      }
    }
  }
</style>
