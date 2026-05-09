<script lang="ts">
  /*
    Movie summary surface — fully rebuilt around the Letterboxd
    film page skeleton. Zero imports from the trakt-web SectionList
    or summary/components rails: review feed, related strip, popular
    lists, where-to-watch, hero, and details panel each hit their
    own data hook directly.

    Data hooks (useMovie) come from the trakt-web fork unchanged.
  */
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences.ts";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry";
  import LetterboxdCastChips from "./_internal/LetterboxdCastChips.svelte";
  import LetterboxdDetailsPanel from "./_internal/LetterboxdDetailsPanel.svelte";
  import LetterboxdGenreChips from "./_internal/LetterboxdGenreChips.svelte";
  import LetterboxdHeroBlock from "./_internal/LetterboxdHeroBlock.svelte";
  import LetterboxdMetaRow from "./_internal/LetterboxdMetaRow.svelte";
  import LetterboxdPopularLists from "./_internal/LetterboxdPopularLists.svelte";
  import LetterboxdRatingsHistogram from "./_internal/LetterboxdRatingsHistogram.svelte";
  import LetterboxdRelatedStrip from "./_internal/LetterboxdRelatedStrip.svelte";
  import LetterboxdReviewStack from "./_internal/LetterboxdReviewStack.svelte";
  import LetterboxdSignInCard from "./_internal/LetterboxdSignInCard.svelte";
  import LetterboxdSummaryShell from "./_internal/LetterboxdSummaryShell.svelte";
  import LetterboxdSynopsis from "./_internal/LetterboxdSynopsis.svelte";
  import LetterboxdWhereToWatch from "./_internal/LetterboxdWhereToWatch.svelte";
  import type { CommonMediaSummaryProps } from "./models/CommonMediaSummaryProps";

  type MovieSummaryProps = {
    media: MovieEntry;
    studios: MediaStudio[];
  } & CommonMediaSummaryProps;

  const { media, studios, intl, crew, streamOn }: MovieSummaryProps = $props();

  const { country } = useStreamingPreferences();

  const overview = $derived(intl?.overview ?? media.overview);
  const title = $derived(intl?.title ?? media.title);
</script>

<LetterboxdSummaryShell
  backdropUrl={media.cover?.url?.medium}
  posterUrl={media.poster?.url?.medium}
  posterAlt={title}
>
  {#snippet main()}
    <LetterboxdHeroBlock {title} year={media.year} type="movie" {crew} />

    <LetterboxdMetaRow
      year={media.year}
      runtime={media.runtime}
      certification={media.certification}
      trailer={media.trailer}
    />

    <LetterboxdSynopsis tagline={media.tagline} {overview} />

    <LetterboxdRatingsHistogram type="movie" slug={media.slug} />

    <LetterboxdCastChips cast={crew.cast} />

    <LetterboxdGenreChips genres={media.genres} type="movie" />

    <LetterboxdDetailsPanel {media} {studios} />

    <LetterboxdReviewStack type="movie" slug={media.slug} />

    <LetterboxdRelatedStrip type="movie" slug={media.slug} />

    <LetterboxdPopularLists type="movie" slug={media.slug} />
  {/snippet}

  {#snippet aside()}
    <LetterboxdSignInCard />
    <LetterboxdWhereToWatch {streamOn} country={$country} />
  {/snippet}
</LetterboxdSummaryShell>
