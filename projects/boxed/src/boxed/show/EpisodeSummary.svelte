<script lang="ts">
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import type { Season } from "$lib/requests/models/Season.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { useSeasonEpisodes } from "$lib/sections/lists/stores/useSeasonEpisodes.ts";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched.ts";
  import SummaryDrawer from "$lib/sections/summary/SummaryDrawer.svelte";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { PLACEHOLDERS } from "$lib/utils/assets.ts";
  import { isMaxDate } from "$lib/utils/date/isMaxDate.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { untrack } from "svelte";
  import { toReviewHref } from "../review/toReviewHref.ts";
  import FriendsWatched from "../title/FriendsWatched.svelte";
  import PopularReviews from "../title/PopularReviews.svelte";
  import RatingsBlock from "../title/RatingsBlock.svelte";
  import TitleHeader from "../title/TitleHeader.svelte";
  import TitleLayout from "../title/TitleLayout.svelte";
  import TitlePoster from "../title/TitlePoster.svelte";
  import TitleSlot from "../title/TitleSlot.svelte";
  import { toAmbientColors } from "../title/_internal/toAmbientColors.ts";
  import EpisodeActionCard from "./_internal/EpisodeActionCard.svelte";
  import EpisodeNav from "./_internal/EpisodeNav.svelte";
  import EpisodeReviewsCover from "./_internal/EpisodeReviewsCover.svelte";
  import GuestCast from "./_internal/GuestCast.svelte";
  import SeasonEpisodeStrip from "./_internal/SeasonEpisodeStrip.svelte";
  import { toAdjacentEpisodes } from "./_internal/toAdjacentEpisodes.ts";
  import { toEpisodeTypeLabel } from "./_internal/toEpisodeTypeLabel.ts";
  import { toSeasonHref } from "./_internal/toSeasonHref.ts";

  const DIRECTOR_PREVIEW = 2;

  type EpisodeSummaryProps = {
    show: ShowEntry;
    showTitle: string;
    episode: EpisodeEntry;
    title: string;
    overview: string;
    seasons: ReadonlyArray<Season>;
    crew: MediaCrew;
  };

  const {
    show,
    showTitle,
    episode,
    title,
    overview,
    seasons,
    crew,
  }: EpisodeSummaryProps = $props();

  const { list, isLoading } = untrack(() =>
    useSeasonEpisodes(show.slug, episode.season)
  );
  const { isAuthorized } = useAuth();
  const { ratings } = useUser();
  const { isWatched } = $derived(
    useIsWatched({
      type: "episode",
      media: episode,
      show: { id: show.id, title: show.title },
    }),
  );
  let revealedEpisodeId: number | null = $state(null);
  const isReviewsCovered = $derived(!$isWatched && revealedEpisodeId !== episode.id);

  const { buildDrawerLink } = summaryDrawerNavigation();
  const drawerHref = (drawer: SummaryDrawers) => buildDrawerLink(drawer).href;

  const episodes = $derived($isLoading ? null : $list);
  const season = $derived(seasonLabel(episode.season));
  const code = $derived(
    episodeNumberLabel({ seasonNumber: episode.season, episodeNumber: episode.number }),
  );
  const label = $derived(`${showTitle} ${code}`);
  const typeLabel = $derived(toEpisodeTypeLabel(episode.type));
  const directors = $derived(crew.directors.slice(0, DIRECTOR_PREVIEW));
  const userRating = $derived($ratings?.episodes.get(episode.id)?.rating ?? null);

  const still = $derived(
    episode.cover.url && !PLACEHOLDERS.includes(episode.cover.url)
      ? episode.cover.url
      : show.cover.url.medium,
  );

  const aired = $derived(
    !isMaxDate(episode.airDate)
      ? m.boxed_show_aired_on({
        date: toHumanDay({ date: episode.airDate, locale: getLocale(), format: "short" }),
      })
      : null,
  );
  const meta = $derived(
    Number.isFinite(episode.runtime) && episode.runtime > 0
      ? toHumanDuration({ minutes: episode.runtime }, languageTag())
      : undefined,
  );

  const adjacent = $derived(
    toAdjacentEpisodes({ seasons, season: episode.season, episode: episode.number }),
  );
  const titleOf = (coordinates: { season: number; episode: number } | null) =>
    coordinates && coordinates.season === episode.season
      ? episodes?.find((item) => item.number === coordinates.episode)?.title
      : undefined;
  const previous = $derived(
    adjacent.previous ? { ...adjacent.previous, title: titleOf(adjacent.previous) } : null,
  );
  const next = $derived(
    adjacent.next ? { ...adjacent.next, title: titleOf(adjacent.next) } : null,
  );
</script>

{#snippet reviewsCover()}
  <EpisodeReviewsCover onReveal={() => (revealedEpisodeId = episode.id)} />
{/snippet}

<SummaryDrawer type="episode" {show} {episode} {crew} />

<TitleLayout cover={still} ambient={toAmbientColors(show.colors)}>
  {#snippet poster()}
    <TitlePoster
      media={show}
      watchCount={0}
      stats={null}
      href={UrlBuilder.show(show.slug)}
      hasStats={false}
    />
  {/snippet}

  {#snippet header()}
    <TitleHeader {title} {meta} {overview}>
      {#snippet eyebrow()}
        <a href={UrlBuilder.show(show.slug)}>{showTitle}</a>
        <span aria-hidden="true">›</span>
        <a href={toSeasonHref(show.slug, episode.season)}>{season}</a>
        <span class="boxed-episode-code">{code}</span>
        {#if typeLabel}
          <span class="boxed-episode-type" data-placement="eyebrow">{typeLabel}</span>
        {/if}
      {/snippet}

      {#snippet credit()}
        {#if typeLabel}
          <span class="boxed-episode-type" data-placement="credit">{typeLabel}</span>
        {/if}
        {#if aired}
          <span class="boxed-episode-byline-item">{aired}</span>
        {/if}
        {#if directors.length > 0}
          <span class="boxed-episode-byline-item">
            {m.text_directed_by_short()}
            {#each directors as director, index (director.key)}
              {#if index > 0},{/if}
              <a href={UrlBuilder.people(director.key)}>{director.name}</a>
            {/each}
          </span>
        {/if}
      {/snippet}

      {#snippet aside()}
        <EpisodeNav slug={show.slug} {previous} {next} />
      {/snippet}
    </TitleHeader>
  {/snippet}

  {#snippet actions()}
    <EpisodeActionCard
      {show}
      {episode}
      {label}
      shareText={m.text_share_episode({
        show: showTitle,
        season: episode.season,
        episode: episode.number,
        title,
      })}
      whereToWatchHref={drawerHref(SummaryDrawers.WhereToWatch)}
    />
  {/snippet}

  {#snippet main()}
    {#if crew.cast.length > 0}
      <TitleSlot order={1}>
        <GuestCast cast={crew.cast} allHref={drawerHref(SummaryDrawers.Cast)} />
      </TitleSlot>
    {/if}

    <TitleSlot order={4}>
      <PopularReviews
        slug={show.slug}
        target={{
          type: "episode",
          season: episode.season,
          episode: episode.number,
          id: episode.id,
        }}
        moreHref={drawerHref(SummaryDrawers.Comments)}
        recentHref={drawerHref(SummaryDrawers.Comments)}
        totalCount={undefined}
        {toReviewHref}
        cover={isReviewsCovered ? reviewsCover : undefined}
      />
    </TitleSlot>

    <TitleSlot order={5}>
      <SeasonEpisodeStrip
        {show}
        title={m.boxed_show_more_from_season({ season })}
        allHref={toSeasonHref(show.slug, episode.season)}
        {episodes}
        current={episode.number}
      />
    </TitleSlot>
  {/snippet}

  {#snippet rail()}
    <TitleSlot order={2}>
      <RatingsBlock
        metaInfo={{ type: "episode", media: show, episode }}
        average={episode.rating}
        votes={episode.votes ?? 0}
        {userRating}
        drilldownHref={drawerHref(SummaryDrawers.Ratings)}
      />
    </TitleSlot>

    {#if $isAuthorized}
      <TitleSlot order={3}>
        <FriendsWatched
          target={{
            type: "episode",
            slug: show.slug,
            season: episode.season,
            episode: episode.number,
          }}
          href={drawerHref(SummaryDrawers.Social)}
        />
      </TitleSlot>
    {/if}
  {/snippet}
</TitleLayout>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-episode-code {
    margin-inline-start: var(--ni-8);
    line-height: var(--ni-16);

    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    color: var(--color-link-active);
  }

  .boxed-episode-type {
    padding: var(--ni-2) var(--ni-8);

    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--boxed-color-watchlist) 20%, var(--color-background));
    color: var(--color-text-primary);

    font-size: var(--ni-11);
    font-weight: 500;
    white-space: nowrap;

    &[data-placement="credit"] {
      display: none;
      margin-inline-end: var(--ni-8);
      vertical-align: middle;
    }

    @include for-mobile {
      &[data-placement="eyebrow"] {
        display: none;
      }

      &[data-placement="credit"] {
        display: inline-block;
      }
    }
  }

  .boxed-episode-byline-item {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: bottom;
    white-space: nowrap;
  }

  .boxed-episode-byline-item + .boxed-episode-byline-item::before {
    content: "·";
    margin-inline: var(--ni-4) var(--ni-8);
    color: var(--color-text-secondary);
  }
</style>
