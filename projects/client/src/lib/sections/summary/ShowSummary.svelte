<script lang="ts">
  /*
    Show summary surface — fully rebuilt alongside MovieSummary on
    the same Letterboxd shell. Adds the LetterboxdSeasonsRail since
    TV needs seasonal structure films don't. Zero imports from the
    trakt-web SectionList or summary/components rails.

    Data hooks (useShow) come from the trakt-web fork unchanged.
  */
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences.ts";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import LetterboxdCastChips from "./_internal/LetterboxdCastChips.svelte";
  import LetterboxdDetailsPanel from "./_internal/LetterboxdDetailsPanel.svelte";
  import LetterboxdGenreChips from "./_internal/LetterboxdGenreChips.svelte";
  import LetterboxdHeroBlock from "./_internal/LetterboxdHeroBlock.svelte";
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
  import type { CommonMediaSummaryProps } from "./models/CommonMediaSummaryProps";

  type ShowSummaryProps = {
    media: ShowEntry;
    studios: MediaStudio[];
    seasons: Season[];
    currentSeason: number;
  } & CommonMediaSummaryProps;

  const {
    media,
    studios,
    intl,
    crew,
    seasons,
    currentSeason,
    streamOn,
  }: ShowSummaryProps = $props();

  const { country } = useStreamingPreferences();

  const overview = $derived(intl?.overview ?? media.overview);
  const title = $derived(intl?.title ?? media.title);

  const showStatusLabel = $derived(
    media.status ? media.status.replaceAll("_", " ") : null,
  );
</script>

<LetterboxdSummaryShell
  backdropUrl={media.cover?.url?.medium}
  posterUrl={media.poster?.url?.medium}
  posterAlt={title}
>
  {#snippet main()}
    <LetterboxdHeroBlock {title} year={media.year} type="show" {crew} />

    <LetterboxdMetaRow
      year={media.year}
      runtime={media.runtime}
      certification={media.certification}
      trailer={media.trailer}
      extra={showStatusLabel}
    />

    <LetterboxdSynopsis tagline={media.tagline} {overview} />

    <LetterboxdRatingsHistogram type="show" slug={media.slug} />

    <LetterboxdSeasonsRail show={media} {seasons} {currentSeason} />

    <LetterboxdCastChips cast={crew.cast} />

    <LetterboxdGenreChips genres={media.genres} type="show" />

    <LetterboxdDetailsPanel {media} {studios} />

    <LetterboxdReviewStack type="show" slug={media.slug} />

    <LetterboxdRelatedStrip type="show" slug={media.slug} />

    <LetterboxdPopularLists type="show" slug={media.slug} />
  {/snippet}

  {#snippet aside()}
    <LetterboxdSignInCard />
    <LetterboxdWhereToWatch {streamOn} country={$country} />
  {/snippet}
</LetterboxdSummaryShell>
