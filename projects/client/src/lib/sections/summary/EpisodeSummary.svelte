<script lang="ts">
  /*
    Episode summary surface — fully rebuilt. Letterboxd has no
    episode page so this is greenfield: we use the same shell as
    movies and shows but with the episode still as the backdrop,
    a "From <Show>" breadcrumb eyebrow, season/episode pills, and
    air-date credit. Reviews + related shows + seasons rail layered
    in below.

    Data hooks (useEpisode) come from the trakt-web fork unchanged.
  */
  import * as m from "$lib/features/i18n/messages.ts";
  import Link from "$lib/components/link/Link.svelte";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import LetterboxdCastChips from "./_internal/LetterboxdCastChips.svelte";
  import LetterboxdGenreChips from "./_internal/LetterboxdGenreChips.svelte";
  import LetterboxdMetaRow from "./_internal/LetterboxdMetaRow.svelte";
  import LetterboxdPopularLists from "./_internal/LetterboxdPopularLists.svelte";
  import LetterboxdRatingsHistogram from "./_internal/LetterboxdRatingsHistogram.svelte";
  import LetterboxdRelatedStrip from "./_internal/LetterboxdRelatedStrip.svelte";
  import LetterboxdReviewStack from "./_internal/LetterboxdReviewStack.svelte";
  import LetterboxdSeasonsRail from "./_internal/LetterboxdSeasonsRail.svelte";
  import LetterboxdSignInCard from "./_internal/LetterboxdSignInCard.svelte";
  import LetterboxdSummaryShell from "./_internal/LetterboxdSummaryShell.svelte";
  import LetterboxdSynopsis from "./_internal/LetterboxdSynopsis.svelte";
  import LetterboxdWhereToWatch from "./_internal/LetterboxdWhereToWatch.svelte";
  import type { EpisodeSummaryProps } from "./components/EpisodeSummaryProps";

  const {
    episode,
    show,
    showIntl,
    seasons,
    episodeIntl,
    crew,
    streamOn,
  }: EpisodeSummaryProps = $props();

  const { country } = useStreamingPreferences();

  const title = $derived(episodeIntl?.title ?? episode.title);
  const showTitle = $derived(showIntl?.title ?? show.title);
  const overview = $derived(episodeIntl?.overview ?? episode.overview);

  const airedLabel = $derived.by(() => {
    if (!episode.airDate) return null;
    try {
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(episode.airDate);
    } catch {
      return null;
    }
  });
</script>

<LetterboxdSummaryShell
  backdropUrl={episode.cover?.url ?? show.cover?.url?.medium}
  posterUrl={episode.cover?.url ?? show.poster?.url?.medium}
  posterAlt={title}
>
  {#snippet main()}
    <header class="lb-ep-block">
      <p class="lb-ep-block-eyebrow">
        <span>{m.eyebrow_entity_episode()}</span>
        <span aria-hidden="true">/</span>
        <Link href={UrlBuilder.show(show.slug)} color="inherit">
          <span class="lb-ep-block-show">
            {m.lb_episode_breadcrumb({ show: showTitle })}
          </span>
        </Link>
      </p>
      <h1 class="lb-ep-block-title">{title}</h1>
      <p class="lb-ep-block-pills">
        <span class="lb-ep-block-pill">
          {m.lb_episode_season_number({ number: episode.season })}
        </span>
        <span class="lb-ep-block-pill">
          {m.lb_episode_episode_number({ number: episode.number })}
        </span>
        {#if airedLabel}
          <span class="lb-ep-block-aired">
            <span class="lb-ep-block-aired-label">
              {m.lb_episode_meta_aired()}
            </span>
            <span class="lb-ep-block-aired-value">{airedLabel}</span>
          </span>
        {/if}
      </p>
    </header>

    <LetterboxdMetaRow
      year={episode.year}
      runtime={episode.runtime}
      certification={episode.certification ?? null}
    />

    <LetterboxdSynopsis tagline={null} {overview} />

    <LetterboxdRatingsHistogram
      type="episode"
      slug={show.slug}
      season={episode.season}
      episode={episode.number}
    />

    <LetterboxdSeasonsRail {show} {seasons} currentSeason={episode.season} />

    <LetterboxdCastChips cast={crew.cast} />

    <LetterboxdGenreChips genres={episode.genres} type="show" />

    <LetterboxdReviewStack
      type="episode"
      slug={show.slug}
      season={episode.season}
      episode={episode.number}
    />

    <LetterboxdRelatedStrip type="show" slug={show.slug} />

    <LetterboxdPopularLists type="show" slug={show.slug} />
  {/snippet}

  {#snippet aside()}
    <LetterboxdSignInCard />
    <LetterboxdWhereToWatch {streamOn} country={$country} />
  {/snippet}
</LetterboxdSummaryShell>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-ep-block {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
    padding-bottom: var(--ni-18);
  }

  .lb-ep-block-eyebrow {
    margin: 0;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ni-8);
    font-size: var(--ni-11);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    font-weight: 700;
  }

  .lb-ep-block-show {
    color: var(--tboxed-positive);
  }

  .lb-ep-block-title {
    margin: 0;
    font-family: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
    font-optical-sizing: auto;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
    color: var(--color-foreground);
    font-size: var(--ni-32);

    @include for-tablet-sm {
      font-size: var(--ni-44);
    }

    @include for-tablet-lg {
      font-size: var(--ni-60);
    }
  }

  .lb-ep-block-pills {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ni-10);
    font-size: var(--ni-12);
  }

  .lb-ep-block-pill {
    display: inline-block;
    padding: var(--ni-6) var(--ni-12);
    background: color-mix(in srgb, var(--color-foreground) 12%, transparent);
    border-radius: var(--border-radius-xs);
    color: var(--color-foreground);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: var(--ni-11);
  }

  .lb-ep-block-aired {
    display: inline-flex;
    align-items: baseline;
    gap: var(--ni-6);
  }

  .lb-ep-block-aired-label {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: var(--ni-11);
    color: var(--color-text-secondary);
  }

  .lb-ep-block-aired-value {
    color: var(--color-foreground);
    font-weight: 600;
    font-size: var(--ni-13);
  }
</style>
