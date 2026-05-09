<script lang="ts">
  /*
    Show summary surface, rebuilt from scratch alongside the movie
    page. Letterboxd is films-only — trakt-boxed extends the same
    cinematic hero, ratings histogram, synopsis, cast/genre/details
    blocks, then layers Seasons + Episodes back in since TV needs
    them. Data hooks (useShow) come straight from the trakt-web fork.
  */
  import * as m from "$lib/features/i18n/messages";

  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { Season } from "$lib/requests/models/Season";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import RelatedList from "../lists/RelatedList.svelte";
  import SeasonList from "../lists/season/SeasonList.svelte";
  import VideoList from "../lists/VideoList.svelte";
  import Comments from "./components/comments/Comments.svelte";
  import Lists from "./components/lists/Lists.svelte";
  import Sentiment from "./components/sentiment/Sentiment.svelte";
  import LetterboxdMediaHero from "./LetterboxdMediaHero.svelte";
  import LetterboxdCastChips from "./_internal/LetterboxdCastChips.svelte";
  import LetterboxdDetailsPanel from "./_internal/LetterboxdDetailsPanel.svelte";
  import LetterboxdGenreChips from "./_internal/LetterboxdGenreChips.svelte";
  import LetterboxdMetaRow from "./_internal/LetterboxdMetaRow.svelte";
  import LetterboxdRatingsHistogram from "./_internal/LetterboxdRatingsHistogram.svelte";
  import LetterboxdSummaryStack from "./_internal/LetterboxdSummaryStack.svelte";
  import LetterboxdSynopsis from "./_internal/LetterboxdSynopsis.svelte";
  import type { CommonMediaSummaryProps } from "./models/CommonMediaSummaryProps";
  import SummaryDrawer from "./SummaryDrawer.svelte";

  type ShowSummaryProps = {
    media: ShowEntry;
    studios: MediaStudio[];
    seasons: Season[];
    videos: MediaVideo[];
    currentSeason: number;
    sentiment: SentimentAnalysis | Nil;
  } & CommonMediaSummaryProps;

  const {
    media,
    studios,
    intl,
    crew,
    seasons,
    videos,
    currentSeason,
    sentiment,
  }: ShowSummaryProps = $props();

  const relatedLink = $derived(UrlBuilder.related.show(media.slug));
  const listsLink = $derived(UrlBuilder.popularLists.show(media.slug));

  const networks = $derived(
    [
      ...new Set(
        [media.network, ...seasons.map((s) => s.network)].filter(
          (n): n is string => n != null,
        ),
      ),
    ].map((name) => ({ name })),
  );

  const overview = $derived(intl?.overview ?? media.overview);

  const showStatusLabel = $derived(
    media.status ? media.status.replaceAll("_", " ") : null,
  );
</script>

<SummaryDrawer
  {sentiment}
  {studios}
  {crew}
  {media}
  {networks}
  {videos}
  {seasons}
  {currentSeason}
  type="show"
/>

<LetterboxdMediaHero
  {media}
  {crew}
  type="show"
  intlTitle={intl?.title}
  overview={null}
/>

<LetterboxdSummaryStack>
  <LetterboxdMetaRow
    year={media.year}
    runtime={media.runtime}
    certification={media.certification}
    trailer={media.trailer}
    extra={showStatusLabel}
  />

  <LetterboxdSynopsis tagline={media.tagline} {overview} />

  <LetterboxdRatingsHistogram type="show" slug={media.slug} />
</LetterboxdSummaryStack>

<Sentiment {sentiment} slug={media.slug} />

<SeasonList show={media} {seasons} {currentSeason} />

<LetterboxdSummaryStack>
  <LetterboxdCastChips cast={crew.cast} />
  <LetterboxdGenreChips genres={media.genres} type="show" />
  <LetterboxdDetailsPanel {media} {studios} />
</LetterboxdSummaryStack>

<Comments {media} type="show" />

<VideoList slug={media.slug} {videos} />

<RelatedList
  title={m.lb_section_related_shows()}
  slug={media.slug}
  type="show"
  drilldownLink={relatedLink}
/>

<Lists
  slug={media.slug}
  title={media.title}
  type="show"
  drilldownLink={listsLink}
/>
