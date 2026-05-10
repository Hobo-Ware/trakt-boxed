<script lang="ts">
  /*
    Films catalog. Letterboxd's /films/ surface refit for trakt-boxed:
    Fraunces editorial title, then four poster grids stacked
    vertically — Popular this week (trending), Most anticipated,
    All-time popular, and (authed only) For you. No SectionList
    rails, no horizontal scrollers. Each grid owns its own query.
  */
  import * as m from "$lib/features/i18n/messages.ts";
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import LetterboxdCatalogSection from "$lib/sections/films/LetterboxdCatalogSection.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import { movieAnticipatedQuery } from "$lib/requests/queries/movies/movieAnticipatedQuery.ts";
  import { moviePopularQuery } from "$lib/requests/queries/movies/moviePopularQuery.ts";
  import { movieTrendingQuery } from "$lib/requests/queries/movies/movieTrendingQuery.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/assets";

  const { isAuthorized } = useAuth();
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.page_title_movies()}
>
  <TraktPageCoverSetter />

  <div class="lb-cat-page">
    <header class="lb-cat-hero">
      <p class="lb-cat-hero-eyebrow">{m.lb_catalog_eyebrow_films()}</p>
      <h1 class="lb-cat-hero-title">{m.button_label_films()}</h1>
      <p class="lb-cat-hero-lede">{m.lb_catalog_lede_films()}</p>
    </header>

    <LetterboxdCatalogSection
      label={m.lb_catalog_section_popular_this_week()}
      drilldownHref={UrlBuilder.popular({ mode: "movie" })}
      query={movieTrendingQuery({ limit: 12 })}
      limit={12}
    />

    <LetterboxdCatalogSection
      label={m.lb_catalog_section_most_anticipated()}
      drilldownHref={UrlBuilder.anticipated({ mode: "movie" })}
      query={movieAnticipatedQuery({ limit: 12 })}
      limit={12}
    />

    <LetterboxdCatalogSection
      label={m.lb_catalog_section_all_time_popular()}
      drilldownHref={UrlBuilder.popular({ mode: "movie" })}
      query={moviePopularQuery({ limit: 12 })}
      limit={12}
    />

    {#if $isAuthorized}
      <LetterboxdCatalogSection
        label={m.lb_catalog_section_for_you()}
        drilldownHref={UrlBuilder.recommended({ mode: "movie" })}
        query={movieTrendingQuery({ limit: 12 })}
        limit={12}
      />
    {/if}
  </div>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-cat-page {
    width: 100%;
    max-width: var(--ni-1280);
    margin-inline: auto;
    padding: var(--ni-22) var(--ni-16) var(--ni-44);
    box-sizing: border-box;

    @include for-tablet-lg {
      padding-inline: var(--ni-32);
    }
  }

  .lb-cat-hero {
    padding: var(--ni-22) 0 var(--ni-32);

    @include for-tablet-lg {
      padding-block: var(--ni-44);
    }
  }

  .lb-cat-hero-eyebrow {
    margin: 0 0 var(--ni-10) 0;
    font-size: var(--ni-11);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--tboxed-positive);
  }

  .lb-cat-hero-title {
    margin: 0;
    font-family: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
    font-optical-sizing: auto;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
    color: var(--color-foreground);
    font-size: var(--ni-44);

    @include for-tablet-sm {
      font-size: var(--ni-60);
    }

    @include for-tablet-lg {
      font-size: var(--ni-80);
    }
  }

  .lb-cat-hero-lede {
    margin: var(--ni-12) 0 0 0;
    font-size: var(--ni-15);
    line-height: 1.5;
    color: var(--color-text-secondary);
    max-width: var(--ni-560);
  }
</style>
