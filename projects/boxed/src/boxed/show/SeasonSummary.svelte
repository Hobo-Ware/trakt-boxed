<script lang="ts">
  import { toReviewsHref } from "$boxed/utils/toReviewsHref.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { EMPTY_CREW } from "$lib/requests/_internal/mapToMediaCrew.ts";
  import type { Season } from "$lib/requests/models/Season.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { useSeasonEpisodes } from "$lib/sections/lists/stores/useSeasonEpisodes.ts";
  import SummaryDrawer from "$lib/sections/summary/SummaryDrawer.svelte";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { isMaxDate } from "$lib/utils/date/isMaxDate.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { toIMDBRating } from "$lib/utils/formatting/number/toIMDBRating.ts";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { untrack } from "svelte";
  import SectionHeader from "../components/SectionHeader.svelte";
  import Stars from "../components/Stars.svelte";
  import { toReviewHref } from "../review/toReviewHref.ts";
  import PopularReviews from "../title/PopularReviews.svelte";
  import TitleHeader from "../title/TitleHeader.svelte";
  import TitleLayout from "../title/TitleLayout.svelte";
  import TitleSlot from "../title/TitleSlot.svelte";
  import { toAmbientColors } from "../title/_internal/toAmbientColors.ts";
  import SeasonActionCard from "./_internal/SeasonActionCard.svelte";
  import SeasonEpisodes from "./_internal/SeasonEpisodes.svelte";
  import SeasonPoster from "./_internal/SeasonPoster.svelte";
  import SeasonSwitcher from "./_internal/SeasonSwitcher.svelte";

  const STAR_SCALE = 5;

  type SeasonSummaryProps = {
    show: ShowEntry;
    season: Season;
    seasons: ReadonlyArray<Season>;
  };

  const { show, season, seasons }: SeasonSummaryProps = $props();

  const { list, isLoading } = untrack(() =>
    useSeasonEpisodes(show.slug, season.number)
  );
  const { history } = useUser();

  const { buildDrawerLink } = summaryDrawerNavigation();
  const drawerHref = (drawer: SummaryDrawers) => buildDrawerLink(drawer).href;

  const title = $derived(seasonLabel(season.number));
  const episodes = $derived($isLoading ? null : $list);
  const watched = $derived(
    Math.min(
      $history?.shows.get(show.id)?.playsPerSeason.get(season.number) ?? 0,
      season.episodes.aired,
    ),
  );
  const progress = $derived(
    season.episodes.aired > 0 ? watched / season.episodes.aired : 0,
  );

  const year = $derived(
    isMaxDate(season.airDate) ? null : season.airDate.getFullYear(),
  );
  const runtime = $derived(
    season.totalRuntime > 0
      ? toHumanDuration({ minutes: season.totalRuntime }, languageTag())
      : null,
  );
  const reviewsHref = $derived(
    toReviewsHref({ type: "show", slug: show.slug }),
  );
  const average = $derived(
    season.rating ? toIMDBRating(season.rating * STAR_SCALE, languageTag()) : "-",
  );
</script>

<SummaryDrawer type="show" media={show} studios={[]} crew={EMPTY_CREW} />

<TitleLayout cover={show.cover.url.medium} ambient={toAmbientColors(show.colors)}>
  {#snippet poster()}
    <SeasonPoster
      src={season.poster?.url.medium ?? show.poster.url.medium}
      title={`${show.title} ${title}`}
      href={UrlBuilder.show(show.slug)}
      {progress}
      isComplete={season.episodes.aired > 0 && watched >= season.episodes.aired}
    />
  {/snippet}

  {#snippet header()}
    <TitleHeader {title} {year} overview={season.overview || show.overview}>
      {#snippet eyebrow()}
        <a href={UrlBuilder.show(show.slug)}>{show.title}</a>
        <span aria-hidden="true">›</span>
        <span>{title}</span>
      {/snippet}

      {#snippet credit()}
        <span class="boxed-season-byline-item">
          {m.boxed_show_episode_count({ count: season.episodes.count })}
        </span>
        {#if runtime}
          <span class="boxed-season-byline-item">{runtime}</span>
        {/if}
        {#if season.network ?? show.network}
          <span class="boxed-season-byline-item">{season.network ?? show.network}</span>
        {/if}
      {/snippet}

      {#snippet aside()}
        <SeasonSwitcher slug={show.slug} {seasons} current={season.number} />
      {/snippet}
    </TitleHeader>
  {/snippet}

  {#snippet actions()}
    <SeasonActionCard
      {show}
      {season}
      {title}
      episodes={episodes ?? []}
      {watched}
      whereToWatchHref={drawerHref(SummaryDrawers.WhereToWatch)}
    />
  {/snippet}

  {#snippet main()}
    <TitleSlot order={1}>
      <SeasonEpisodes {show} {episodes} expectedCount={season.episodes.count} />
    </TitleSlot>

    <TitleSlot order={3}>
      <PopularReviews
        slug={show.slug}
        target={{
          type: "season",
          season: season.number,
          id: season.id,
          episodeCount: season.episodes.count,
        }}
        moreHref={reviewsHref}
        recentHref={toReviewsHref({ type: "show", slug: show.slug, sort: "newest" })}
        totalCount={undefined}
        {toReviewHref}
      />
    </TitleSlot>
  {/snippet}

  {#snippet rail()}
    <TitleSlot order={2}>
      <section class="boxed-season-rating">
        <SectionHeader title={m.header_ratings()} />
        <div class="boxed-season-rating-body">
          <span class="boxed-season-rating-score">{average}</span>
          <Stars rating={Math.round((season.rating ?? 0) * 10)} size="normal" />
        </div>
      </section>
    </TitleSlot>
  {/snippet}
</TitleLayout>

<style>
  .boxed-season-byline-item {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: bottom;
    white-space: nowrap;
  }

  .boxed-season-byline-item + .boxed-season-byline-item::before {
    content: "·";
    margin-inline: var(--ni-4) var(--ni-8);
    color: var(--color-text-secondary);
  }

  .boxed-season-rating-body {
    display: flex;
    align-items: center;
    gap: var(--ni-14);
  }

  .boxed-season-rating-score {
    font-family: var(--boxed-font-title);
    font-weight: 600;
    font-size: var(--ni-36);
    line-height: 1;
    color: var(--color-text-primary);
  }
</style>
