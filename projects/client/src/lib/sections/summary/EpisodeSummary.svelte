<script lang="ts">
  /*
    Episode summary surface, rebuilt from scratch. Letterboxd has no
    episode page so this is greenfield: we mirror the cinematic film
    hero but make the eyebrow a "From <Show>" breadcrumb, swap the
    year+credit line for season/episode pills, and reuse the same
    synopsis/ratings/cast/details rhythm as movie + show. Data comes
    from useEpisode unchanged.
  */
  import * as m from "$lib/features/i18n/messages";

  import SeasonList from "$lib/sections/lists/season/SeasonList.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import RelatedList from "../lists/RelatedList.svelte";
  import Comments from "./components/comments/Comments.svelte";
  import type { EpisodeSummaryProps } from "./components/EpisodeSummaryProps";
  import LetterboxdCastChips from "./_internal/LetterboxdCastChips.svelte";
  import LetterboxdEpisodeHero from "./_internal/LetterboxdEpisodeHero.svelte";
  import LetterboxdGenreChips from "./_internal/LetterboxdGenreChips.svelte";
  import LetterboxdMetaRow from "./_internal/LetterboxdMetaRow.svelte";
  import LetterboxdRatingsHistogram from "./_internal/LetterboxdRatingsHistogram.svelte";
  import LetterboxdSummaryStack from "./_internal/LetterboxdSummaryStack.svelte";
  import LetterboxdSynopsis from "./_internal/LetterboxdSynopsis.svelte";
  import SummaryDrawer from "./SummaryDrawer.svelte";

  const {
    episode,
    show,
    showIntl,
    seasons,
    episodeIntl,
    crew,
  }: EpisodeSummaryProps = $props();

  const relatedLink = $derived(
    UrlBuilder.related.episode(show.slug, episode.season, episode.number),
  );

  const networks = $derived(
    (() => {
      const seasonNetwork = seasons.find(
        (s) => s.number === episode.season,
      )?.network;
      const name = seasonNetwork ?? show.network;
      return name ? [{ name }] : [];
    })(),
  );

  const overview = $derived(episodeIntl?.overview ?? episode.overview);
</script>

<LetterboxdEpisodeHero
  {episode}
  {show}
  intlTitle={episodeIntl?.title}
  showIntlTitle={showIntl?.title}
/>

<LetterboxdSummaryStack>
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
</LetterboxdSummaryStack>

<LetterboxdSummaryStack>
  <LetterboxdCastChips cast={crew.cast} />
  <LetterboxdGenreChips genres={episode.genres} type="show" />
</LetterboxdSummaryStack>

<Comments
  media={show}
  type="episode"
  season={episode.season}
  episode={episode.number}
  id={episode.id}
/>

<SeasonList {show} {seasons} currentSeason={episode.season} />

<RelatedList
  title={m.lb_section_related_shows()}
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
