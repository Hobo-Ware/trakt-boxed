<script lang="ts">
  /*
    Movie summary surface, Letterboxd-flavour.

    Replace the old MediaSummary / MediaSummaryV2 dual-render with a
    single LetterboxdMediaHero that lays out the cinematic backdrop +
    poster + title block the way every Letterboxd film page does.
    The downstream sections (Cast, Comments-as-Reviews, Lists,
    Related, Sentiment, Videos) keep working — they're already
    section-list components that ride the page rhythm we want.
  */
  import * as m from "$lib/features/i18n/messages";

  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CastList from "../lists/CastList.svelte";
  import RelatedList from "../lists/RelatedList.svelte";
  import VideoList from "../lists/VideoList.svelte";
  import Comments from "./components/comments/Comments.svelte";
  import Lists from "./components/lists/Lists.svelte";
  import CommunitySentiment from "./components/sentiment/Sentiment.svelte";
  import LetterboxdMediaHero from "./LetterboxdMediaHero.svelte";
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
</script>

<SummaryDrawer {sentiment} {studios} {crew} {media} {videos} type="movie" />

<LetterboxdMediaHero
  {media}
  {crew}
  type="movie"
  intlTitle={intl?.title}
  overview={intl?.overview ?? media.overview}
/>

<CommunitySentiment {sentiment} slug={media.slug} />

<CastList
  title={m.list_title_actors()}
  cast={crew.cast}
  slug={media.slug}
  type={media.type}
/>

<Comments {media} type="movie" />

<VideoList slug={media.slug} {videos} />

<RelatedList
  title={m.list_title_related_movies()}
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
