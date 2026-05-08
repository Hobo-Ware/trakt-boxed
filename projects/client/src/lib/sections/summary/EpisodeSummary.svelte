<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import RenderFor from "$lib/guards/RenderFor.svelte";
  import SeasonList from "$lib/sections/lists/season/SeasonList.svelte";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CastList from "../lists/CastList.svelte";
  import RelatedList from "../lists/RelatedList.svelte";
  import SummaryCover from "./components/_internal/SummaryCover.svelte";
  import Comments from "./components/comments/Comments.svelte";
  import EpisodeSummary from "./components/episode/EpisodeSummary.svelte";
  import EpisodeSummaryV2 from "./components/episode/v2/EpisodeSummary.svelte";
  import type { EpisodeSummaryProps } from "./components/EpisodeSummaryProps";
  import SummaryDrawer from "./SummaryDrawer.svelte";

  const {
    episode,
    show,
    showIntl,
    seasons,
    episodeIntl,
    streamOn,
    crew,
  }: EpisodeSummaryProps = $props();

  const relatedLink = $derived(
    UrlBuilder.related.episode(show.slug, episode.season, episode.number),
  );

  const posterSrc = $derived(episode.cover.url ?? EPISODE_COVER_PLACEHOLDER);

  const networks = $derived(
    (() => {
      const seasonNetwork = seasons.find(
        (s) => s.number === episode.season,
      )?.network;
      const name = seasonNetwork ?? show.network;
      return name ? [{ name }] : [];
    })(),
  );
</script>

<!-- 
  Episodes don't have their own colors, so we fallback to their show's color
  if available. This approach ensures visual consistency between a show and its
  episodes.
-->
<SummaryCover src={episode.cover.url ?? ""} colors={show.colors} type="show" />

<RenderFor audience="all" device={["mobile", "tablet-sm"]}>
  <EpisodeSummaryV2
    {episode}
    {show}
    {showIntl}
    {episodeIntl}
    {crew}
    posterSrc={posterSrc}
  />
</RenderFor>

<RenderFor audience="all" device={["tablet-lg", "desktop"]}>
  <EpisodeSummary
    {episode}
    {show}
    {showIntl}
    {episodeIntl}
    {streamOn}
    {crew}
    posterSrc={posterSrc}
  />
</RenderFor>

<CastList
  title={m.list_title_actors()}
  cast={crew.cast}
  slug={show.slug}
  type="episode"
/>

<Comments
  media={show}
  type="episode"
  season={episode.season}
  episode={episode.number}
  id={episode.id}
/>

<SeasonList {show} {seasons} currentSeason={episode.season} />

<RelatedList
  title={m.list_title_related_shows()}
  slug={show.slug}
  type="show"
  drilldownLink={relatedLink}
/>

<SummaryDrawer
  {crew}
  {episode}
  {seasons}
  currentSeason={episode.season}
  {show}
  {networks}
  type="episode"
/>
