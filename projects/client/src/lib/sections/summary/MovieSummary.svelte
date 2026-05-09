<script lang="ts">
  /*
    Movie summary surface, rebuilt from scratch around the
    Letterboxd film page. The data layer (useMovie) stays as it
    arrived from the trakt-web fork; everything visual is new.
    Reference: ../../../letterboxd-research/notes/film-summary.md.
  */
  import * as m from "$lib/features/i18n/messages";

  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import RelatedList from "../lists/RelatedList.svelte";
  import VideoList from "../lists/VideoList.svelte";
  import Comments from "./components/comments/Comments.svelte";
  import Lists from "./components/lists/Lists.svelte";
  import CommunitySentiment from "./components/sentiment/Sentiment.svelte";
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

  const {
    media,
    studios,
    intl,
    crew,
    videos,
    sentiment,
  }: {
    media: MovieEntry;
    studios: MediaStudio[];
    videos: MediaVideo[];
    sentiment: SentimentAnalysis | Nil;
  } & CommonMediaSummaryProps = $props();

  const relatedLink = $derived(UrlBuilder.related.movie(media.slug));
  const listsLink = $derived(UrlBuilder.popularLists.movie(media.slug));

  const overview = $derived(intl?.overview ?? media.overview);
</script>

<SummaryDrawer {sentiment} {studios} {crew} {media} {videos} type="movie" />

<LetterboxdMediaHero
  {media}
  {crew}
  type="movie"
  intlTitle={intl?.title}
  overview={null}
/>

<LetterboxdSummaryStack>
  <LetterboxdMetaRow
    year={media.year}
    runtime={media.runtime}
    certification={media.certification}
    trailer={media.trailer}
  />

  <LetterboxdSynopsis tagline={media.tagline} {overview} />

  <LetterboxdRatingsHistogram type="movie" slug={media.slug} />
</LetterboxdSummaryStack>

<CommunitySentiment {sentiment} slug={media.slug} />

<LetterboxdSummaryStack>
  <LetterboxdCastChips cast={crew.cast} />
  <LetterboxdGenreChips genres={media.genres} type="movie" />
  <LetterboxdDetailsPanel {media} {studios} />
</LetterboxdSummaryStack>

<Comments {media} type="movie" />

<VideoList slug={media.slug} {videos} />

<RelatedList
  title={m.lb_section_related_films()}
  slug={media.slug}
  type="movie"
  drilldownLink={relatedLink}
/>

<Lists
  slug={media.slug}
  title={media.title}
  type="movie"
  drilldownLink={listsLink}
/>
