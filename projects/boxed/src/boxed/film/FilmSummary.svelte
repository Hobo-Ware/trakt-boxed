<script lang="ts">
  import { compactFacts } from "$boxed/title/compactFacts.ts";
  import { toCastChips } from "$boxed/title/toCastChips.ts";
  import { toCommonFacts } from "$boxed/title/toCommonFacts.ts";
  import { toCrewChips } from "$boxed/title/toCrewChips.ts";
  import { toGenreChips } from "$boxed/title/toGenreChips.ts";
  import { toRuntimeMeta } from "$boxed/title/toRuntimeMeta.ts";
  import { toReviewsHref } from "$boxed/utils/toReviewsHref.ts";
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio.ts";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo.ts";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import type { StreamOn } from "$lib/requests/models/StreamOn.ts";
  import type { YouTubeSpecial } from "$lib/requests/models/YouTubeSpecial.ts";
  import { movieStatsQuery } from "$lib/requests/queries/movies/movieStatsQuery.ts";
  import SummaryDrawer from "$lib/sections/summary/SummaryDrawer.svelte";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { useWatchCount } from "$lib/stores/useWatchCount.ts";
  import { isMaxDate } from "$lib/utils/date/isMaxDate.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
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
  import TitleFacts from "../title/TitleFacts.svelte";
  import TitleHeader from "../title/TitleHeader.svelte";
  import TitleLayout from "../title/TitleLayout.svelte";
  import TitlePoster from "../title/TitlePoster.svelte";
  import TitleSlot from "../title/TitleSlot.svelte";
  import TriviaCards from "../title/TriviaCards.svelte";
  import { toAmbientColors } from "$boxed/title/toAmbientColors.ts";

  const CAST_PREVIEW = 12;
  const DIRECTOR_PREVIEW = 2;

  type FilmTab = "cast" | "crew" | "details" | "genres" | "releases";

  type FilmSummaryProps = {
    movie: MovieEntry;
    title: string;
    overview: string;
    tagline: string | Nil;
    studios: ReadonlyArray<MediaStudio>;
    crew: MediaCrew;
    streamOn: StreamOn | undefined;
    videos: MediaVideo[];
    sentiment: SentimentAnalysis | Nil;
    youtubeSpecial: YouTubeSpecial | Nil;
  };

  const {
    movie,
    title,
    overview,
    tagline,
    studios,
    crew,
    streamOn,
    videos,
    sentiment,
    youtubeSpecial,
  }: FilmSummaryProps = $props();

  const { isAuthorized } = useAuth();
  const { ratings } = useUser();
  const { watchCount } = $derived(useWatchCount({ type: "movie", media: movie }));
  const stats = useQuery(
    fromRune(() => movie.slug).pipe(map((slug) => movieStatsQuery({ slug }))),
  ).pipe(map(($stats) => $stats.data));

  const ambient = $derived(toAmbientColors(movie.colors));
  const userRating = $derived($ratings?.movies.get(movie.id)?.rating ?? null);

  const { buildDrawerLink } = summaryDrawerNavigation();
  const drawerHref = (drawer: SummaryDrawers) => buildDrawerLink(drawer).href;

  const reviewsHref = $derived(
    toReviewsHref({ type: "movie", slug: movie.slug }),
  );

  const directors = $derived(crew.directors.slice(0, DIRECTOR_PREVIEW));

  const meta = $derived(
    toRuntimeMeta({
      runtime: movie.runtime,
      certification: movie.certification,
      locale: languageTag(),
    }),
  );

  const tabs: ReadonlyArray<{ id: FilmTab; label: string }> = [
    { id: "cast", label: m.drawer_meta_info_cast() },
    { id: "crew", label: m.drawer_meta_info_crew() },
    { id: "details", label: m.header_details() },
    { id: "genres", label: m.boxed_title_tab_genres() },
    { id: "releases", label: m.list_title_releases() },
  ];

  const castChips = $derived(toCastChips(crew.cast, CAST_PREVIEW));

  const crewChips = $derived(toCrewChips([...crew.directors, ...crew.writers]));

  const genreChips = $derived(toGenreChips(movie.genres));

  const common = $derived(
    toCommonFacts({ media: movie, studios, locale: languageTag() }),
  );

  const details = $derived(
    compactFacts([
      common.original,
      common.studio,
      common.country,
      common.language,
      meta ? { key: "runtime", label: m.header_runtime(), value: meta } : null,
    ]),
  );

  const releases = $derived(
    compactFacts([
      !isMaxDate(movie.releaseDate)
        ? {
          key: "released",
          label: m.tag_text_released(),
          value: toHumanDay({ date: movie.releaseDate, locale: getLocale() }),
        }
        : null,
      { key: "status", label: m.header_status(), value: toTranslatedStatus(movie.status) },
    ]),
  );
</script>

<SummaryDrawer
  type="movie"
  media={movie}
  studios={[...studios]}
  {crew}
  {sentiment}
  {videos}
  {youtubeSpecial}
/>

<TitleLayout cover={movie.cover.url.medium} {ambient}>
  {#snippet poster()}
    <TitlePoster media={movie} watchCount={$watchCount} stats={$stats} />
  {/snippet}

  {#snippet header()}
    <TitleHeader {title} year={movie.year} {meta} {tagline} {overview} {tabs}>
      {#snippet credit()}
        {#if directors.length > 0}
          {m.text_directed_by_short()}
          {#each directors as director, index (director.key)}
            {#if index > 0},{/if}
            <a href={UrlBuilder.people(director.key)}>{director.name}</a>
          {/each}
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
          <TitleFacts facts={releases} />
        {/if}
      {/snippet}
    </TitleHeader>
  {/snippet}

  {#snippet actions()}
    <ActionCard
      media={movie}
      {streamOn}
      whereToWatchHref={drawerHref(SummaryDrawers.WhereToWatch)}
      activityHref={UrlBuilder.history.movie(movie.slug)}
      shareText={m.text_share_movie({ title })}
    />
  {/snippet}

  {#snippet main()}
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
        slug={movie.slug}
        target={{ type: "movie" }}
        moreHref={reviewsHref}
        recentHref={toReviewsHref({ type: "movie", slug: movie.slug, sort: "newest" })}
        totalCount={$stats?.comments}
        {toReviewHref}
      />
    </TitleSlot>

    <TitleSlot order={9}>
      <TriviaCards
        slug={movie.slug}
        type="movie"
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
        title={m.list_title_related_movies()}
        slug={movie.slug}
        type="movie"
        moreHref={UrlBuilder.related.movie(movie.slug)}
      />
    </TitleSlot>
  {/snippet}

  {#snippet rail()}
    <TitleSlot order={5}>
      <RatingsBlock
        metaInfo={{ type: "movie", media: movie }}
        average={movie.rating}
        votes={movie.votes}
        {userRating}
        drilldownHref={drawerHref(SummaryDrawers.Ratings)}
      />
    </TitleSlot>

    {#if $isAuthorized}
      <TitleSlot order={6}>
        <FriendsWatched
          target={{ type: "movie", slug: movie.slug }}
          href={drawerHref(SummaryDrawers.Social)}
        />
      </TitleSlot>
    {/if}

    <TitleSlot order={12}>
      <Soundtrack
        slug={movie.slug}
        type="movie"
        allHref={drawerHref(SummaryDrawers.Soundtrack)}
      />
    </TitleSlot>

    <TitleSlot order={13}>
      <PopularLists
        slug={movie.slug}
        {title}
        type="movie"
        moreHref={UrlBuilder.popularLists.movie(movie.slug)}
      />
    </TitleSlot>
  {/snippet}
</TitleLayout>
