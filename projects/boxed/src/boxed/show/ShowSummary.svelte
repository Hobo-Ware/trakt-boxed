<script lang="ts">
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio.ts";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo.ts";
  import type { Season } from "$lib/requests/models/Season.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import type { StreamOn } from "$lib/requests/models/StreamOn.ts";
  import { showStatsQuery } from "$lib/requests/queries/shows/showStatsQuery.ts";
  import SummaryDrawer from "$lib/sections/summary/SummaryDrawer.svelte";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { useWatchCount } from "$lib/stores/useWatchCount.ts";
  import { isMaxDate } from "$lib/utils/date/isMaxDate.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { toHumanDayTime } from "$lib/utils/formatting/date/toHumanDayTime.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { toCountryName } from "$lib/utils/formatting/intl/toCountryName.ts";
  import { toLanguageName } from "$lib/utils/formatting/intl/toLanguageName.ts";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre.ts";
  import { toTranslatedJob } from "$lib/utils/formatting/string/toTranslatedJob.ts";
  import { toTranslatedStatus } from "$lib/utils/formatting/string/toTranslatedStatus.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { map } from "rxjs";
  import { toReviewHref } from "../review/toReviewHref.ts";
  import ActionCard from "../title/ActionCard.svelte";
  import Extras from "../title/Extras.svelte";
  import FriendsWatched from "../title/FriendsWatched.svelte";
  import PopularLists from "../title/PopularLists.svelte";
  import PopularReviews from "../title/PopularReviews.svelte";
  import RatingsBlock from "../title/RatingsBlock.svelte";
  import SentimentCard from "../title/SentimentCard.svelte";
  import SimilarTitles from "../title/SimilarTitles.svelte";
  import Soundtrack from "../title/Soundtrack.svelte";
  import TitleChips from "../title/TitleChips.svelte";
  import type { TitleChip } from "../title/TitleChip.ts";
  import TitleFacts from "../title/TitleFacts.svelte";
  import type { TitleFact } from "../title/TitleFact.ts";
  import TitleHeader from "../title/TitleHeader.svelte";
  import TitleLayout from "../title/TitleLayout.svelte";
  import TitlePoster from "../title/TitlePoster.svelte";
  import TitleSlot from "../title/TitleSlot.svelte";
  import TriviaCards from "../title/TriviaCards.svelte";
  import { toAmbientColors } from "../title/_internal/toAmbientColors.ts";
  import ShowSeasons from "./_internal/ShowSeasons.svelte";
  import ShowStatus from "./_internal/ShowStatus.svelte";
  import ShowUpNext from "./_internal/ShowUpNext.svelte";

  const CAST_PREVIEW = 12;
  const CREATOR_PREVIEW = 2;

  type ShowTab = "cast" | "crew" | "details" | "genres" | "networks";

  type ShowSummaryProps = {
    show: ShowEntry;
    title: string;
    overview: string;
    tagline: string | Nil;
    studios: ReadonlyArray<MediaStudio>;
    crew: MediaCrew;
    seasons: ReadonlyArray<Season>;
    streamOn: StreamOn | undefined;
    videos: MediaVideo[];
    sentiment: SentimentAnalysis | Nil;
  };

  const {
    show,
    title,
    overview,
    tagline,
    studios,
    crew,
    seasons,
    streamOn,
    videos,
    sentiment,
  }: ShowSummaryProps = $props();

  const { isAuthorized } = useAuth();
  const { ratings } = useUser();
  const { watchCount } = $derived(useWatchCount({ type: "show", media: show }));
  const stats = useQuery(
    fromRune(() => show.slug).pipe(map((slug) => showStatsQuery({ slug }))),
  ).pipe(map(($stats) => $stats.data));

  const ambient = $derived(toAmbientColors(show.colors));
  const userRating = $derived($ratings?.shows.get(show.id)?.rating ?? null);

  const { buildDrawerLink } = summaryDrawerNavigation();
  const drawerHref = (drawer: SummaryDrawers) => buildDrawerLink(drawer).href;

  const regularSeasons = $derived(seasons.filter((season) => season.number > 0));
  const creators = $derived(crew.creators.slice(0, CREATOR_PREVIEW));

  const networks = $derived([
    ...new Set(
      [show.network, ...seasons.map((season) => season.network)].filter(
        (network): network is string => Boolean(network),
      ),
    ),
  ]);

  const meta = $derived(
    [
      Number.isFinite(show.runtime)
        ? toHumanDuration({ minutes: show.runtime }, languageTag())
        : null,
      show.certification,
    ].filter(Boolean).join(" · "),
  );

  const tabs: ReadonlyArray<{ id: ShowTab; label: string }> = [
    { id: "cast", label: m.drawer_meta_info_cast() },
    { id: "crew", label: m.drawer_meta_info_crew() },
    { id: "details", label: m.header_details() },
    { id: "genres", label: m.boxed_title_tab_genres() },
    { id: "networks", label: m.header_network() },
  ];

  const castChips = $derived<ReadonlyArray<TitleChip>>(
    crew.cast.slice(0, CAST_PREVIEW).map((member) => ({
      key: member.key,
      label: member.name,
      href: UrlBuilder.people(member.key),
    })),
  );

  const crewChips = $derived<ReadonlyArray<TitleChip>>(
    [...crew.creators, ...crew.directors, ...crew.writers].map((member) => ({
      key: `${member.key}-${member.jobs.join("-")}`,
      label: member.name,
      detail: member.jobs.map((job) => toTranslatedJob(job)).join(", "),
      href: UrlBuilder.people(member.key),
    })),
  );

  const genreChips = $derived<ReadonlyArray<TitleChip>>(
    show.genres.map((genre) => ({ key: genre, label: toTranslatedGenre(genre) })),
  );

  const networkChips = $derived<ReadonlyArray<TitleChip>>(
    networks.map((network) => ({ key: network, label: network })),
  );

  const airs = $derived.by(() => {
    if (!show.airs) return null;
    if (show.status !== "returning series" && show.status !== "continuing") {
      return null;
    }

    const local = toHumanDayTime({ ...show.airs, locale: languageTag() });
    return local ? m.text_airs_day_time(local) : null;
  });

  const compact = (facts: ReadonlyArray<TitleFact | null>) =>
    facts.filter((fact): fact is TitleFact => fact !== null);

  const details = $derived(
    compact([
      show.originalTitle && show.originalTitle !== show.title
        ? { key: "original", label: m.header_original_title(), value: show.originalTitle }
        : null,
      !isMaxDate(show.airDate)
        ? {
          key: "premiered",
          label: m.header_premiered(),
          value: toHumanDay({ date: show.airDate, locale: getLocale() }),
        }
        : null,
      { key: "status", label: m.header_status(), value: toTranslatedStatus(show.status) },
      airs ? { key: "airs", label: m.header_airs(), value: airs } : null,
      studios.length > 0
        ? { key: "studio", label: m.header_studio(), value: studios.map((studio) => studio.name).join(", ") }
        : null,
      show.country
        ? { key: "country", label: m.header_country(), value: toCountryName(show.country, languageTag()) }
        : null,
      show.languages?.length
        ? {
          key: "language",
          label: m.header_language(),
          value: show.languages.map((code) => toLanguageName(code, languageTag())).join(", "),
        }
        : null,
      show.totalRuntime > 0
        ? {
          key: "total-runtime",
          label: m.header_total_runtime(),
          value: toHumanDuration({ minutes: show.totalRuntime }, languageTag()),
        }
        : null,
    ]),
  );
</script>

<SummaryDrawer
  type="show"
  media={show}
  studios={[...studios]}
  {crew}
  {sentiment}
  {videos}
/>

<TitleLayout cover={show.cover.url.medium} {ambient}>
  {#snippet poster()}
    <TitlePoster media={show} watchCount={$watchCount} stats={$stats} />
  {/snippet}

  {#snippet header()}
    <TitleHeader {title} year={show.year} {meta} {tagline} {overview} {tabs}>
      {#snippet eyebrow()}
        <ShowStatus status={show.status} />
      {/snippet}

      {#snippet credit()}
        {#if show.network}
          <span class="boxed-show-byline-item">{show.network}</span>
        {/if}
        {#if regularSeasons.length > 0}
          <span class="boxed-show-byline-item">
            {m.boxed_show_season_count({ count: regularSeasons.length })}
          </span>
        {/if}
        {#if show.episode.count > 0}
          <span class="boxed-show-byline-item">
            {m.boxed_show_episode_count({ count: show.episode.count })}
          </span>
        {/if}
        {#if creators.length > 0}
          <span class="boxed-show-byline-item">
            {m.text_created_by_short()}
            {#each creators as creator, index (creator.key)}
              {#if index > 0},{/if}
              <a href={UrlBuilder.people(creator.key)}>{creator.name}</a>
            {/each}
          </span>
        {/if}
      {/snippet}

      {#snippet panel(tab)}
        {#if tab === "cast"}
          <TitleChips
            items={castChips}
            more={crew.cast.length > CAST_PREVIEW
              ? {
                label: m.boxed_title_show_all_cast({ count: crew.cast.length }),
                href: drawerHref(SummaryDrawers.Cast),
              }
              : undefined}
          />
        {:else if tab === "crew"}
          <TitleChips items={crewChips} />
        {:else if tab === "details"}
          <TitleFacts facts={details} />
        {:else if tab === "genres"}
          <TitleChips items={genreChips} />
        {:else}
          <TitleChips items={networkChips} emptyText={m.text_unavailable()} />
        {/if}
      {/snippet}
    </TitleHeader>
  {/snippet}

  {#snippet actions()}
    <ActionCard
      media={show}
      {streamOn}
      whereToWatchHref={drawerHref(SummaryDrawers.WhereToWatch)}
      activityHref={UrlBuilder.history.show(show.slug)}
      shareText={m.text_share_show({ title })}
    />
  {/snippet}

  {#snippet main()}
    {#if $isAuthorized}
      <TitleSlot order={1}>
        <ShowUpNext {show} />
      </TitleSlot>
    {/if}

    {#if seasons.length > 0}
      <TitleSlot order={2}>
        <ShowSeasons {show} {seasons} />
      </TitleSlot>
    {/if}

    {#if sentiment}
      <TitleSlot order={7}>
        <SentimentCard
          {sentiment}
          analysisHref={drawerHref(SummaryDrawers.Sentiment)}
        />
      </TitleSlot>
    {/if}

    <TitleSlot order={8}>
      <PopularReviews
        slug={show.slug}
        target={{ type: "show" }}
        moreHref={`/shows/${show.slug}/reviews`}
        recentHref={`/shows/${show.slug}/reviews?sort=newest`}
        totalCount={$stats?.comments}
        {toReviewHref}
      />
    </TitleSlot>

    <TitleSlot order={9}>
      <TriviaCards
        slug={show.slug}
        type="show"
        allHref={drawerHref(SummaryDrawers.Trivia)}
      />
    </TitleSlot>

    {#if videos.length > 0}
      <TitleSlot order={11}>
        <Extras {videos} allHref={drawerHref(SummaryDrawers.Videos)} />
      </TitleSlot>
    {/if}

    <TitleSlot order={10}>
      <SimilarTitles
        title={m.list_title_related_shows()}
        slug={show.slug}
        type="show"
        moreHref={UrlBuilder.related.show(show.slug)}
      />
    </TitleSlot>
  {/snippet}

  {#snippet rail()}
    <TitleSlot order={5}>
      <RatingsBlock
        metaInfo={{ type: "show", media: show }}
        average={show.rating}
        votes={show.votes}
        {userRating}
        drilldownHref={drawerHref(SummaryDrawers.Ratings)}
      />
    </TitleSlot>

    {#if $isAuthorized}
      <TitleSlot order={6}>
        <FriendsWatched
          target={{ type: "show", slug: show.slug }}
          href={drawerHref(SummaryDrawers.Social)}
        />
      </TitleSlot>
    {/if}

    <TitleSlot order={12}>
      <Soundtrack
        slug={show.slug}
        type="show"
        allHref={drawerHref(SummaryDrawers.Soundtrack)}
      />
    </TitleSlot>

    <TitleSlot order={13}>
      <PopularLists
        slug={show.slug}
        {title}
        type="show"
        moreHref={UrlBuilder.popularLists.show(show.slug)}
      />
    </TitleSlot>
  {/snippet}
</TitleLayout>

<style>
  .boxed-show-byline-item {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: bottom;
    white-space: nowrap;
  }

  .boxed-show-byline-item + .boxed-show-byline-item::before {
    content: "·";
    margin-inline: var(--ni-4) var(--ni-8);
    color: var(--color-text-secondary);
  }
</style>
