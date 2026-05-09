<script lang="ts">
  /*
    Show summary surface, Letterboxd-flavour.

    Shares the same hero layout as MovieSummary so films and shows
    sit as siblings rather than as different page types — the
    Letterboxd treatment is applied once and trakt-boxed extends it
    naturally to TV. SeasonList stays in the body since shows have
    seasonal structure films don't.
  */
  import * as m from "$lib/features/i18n/messages";

  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { Season } from "$lib/requests/models/Season";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CastList from "../lists/CastList.svelte";
  import RelatedList from "../lists/RelatedList.svelte";
  import SeasonList from "../lists/season/SeasonList.svelte";
  import VideoList from "../lists/VideoList.svelte";
  import Comments from "./components/comments/Comments.svelte";
  import Lists from "./components/lists/Lists.svelte";
  import Sentiment from "./components/sentiment/Sentiment.svelte";
  import LetterboxdMediaHero from "./LetterboxdMediaHero.svelte";
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
  overview={intl?.overview ?? media.overview}
/>

<Sentiment {sentiment} slug={media.slug} />

<CastList
  title={m.list_title_actors()}
  cast={crew.cast}
  slug={media.slug}
  type={media.type}
/>

<Comments {media} type="show" />

<VideoList slug={media.slug} {videos} />

<SeasonList show={media} {seasons} {currentSeason} />

<RelatedList
  title={m.list_title_related_shows()}
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
