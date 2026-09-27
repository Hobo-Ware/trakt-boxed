<script lang="ts">
  import { page } from "$app/state";
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { EMPTY_CREW } from "$lib/requests/_internal/mapToMediaCrew.ts";
  import { movieStatsQuery } from "$lib/requests/queries/movies/movieStatsQuery.ts";
  import { moviePeopleQuery } from "$lib/requests/queries/movies/moviePeopleQuery.ts";
  import { movieSummaryQuery } from "$lib/requests/queries/movies/movieSummaryQuery.ts";
  import SummaryDrawer from "$lib/sections/summary/SummaryDrawer.svelte";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { map } from "rxjs";
  import { logComposerStore } from "../log/logComposerStore.ts";
  import FilmReviewsRail from "./_internal/FilmReviewsRail.svelte";
  import FilmReviewsTab from "./_internal/FilmReviewsTab.svelte";
  import FilmWatchingNow from "./_internal/FilmWatchingNow.svelte";
  import ListsLoader from "../title/_internal/ListsLoader.svelte";
  import TitleCompactHeader from "../title/TitleCompactHeader.svelte";
  import TitleFacetLayout from "../title/TitleFacetLayout.svelte";
  import TitleTabs from "../title/TitleTabs.svelte";
  import { parseTitleTab } from "../title/_internal/parseTitleTab.ts";
  import { toAmbientColors } from "../title/_internal/toAmbientColors.ts";

  type FacetTab = "reviews" | "watching" | "lists";

  const TAB_PARAM = "tab";
  const LIST_PAGE = 10;

  const { slug }: { slug: string } = $props();

  const slug$ = fromRune(() => slug);
  const movie = useQuery(slug$.pipe(map((value) => movieSummaryQuery({ slug: value }))))
    .pipe(map(($query) => $query.data));
  const crew = useQuery(slug$.pipe(map((value) => moviePeopleQuery({ slug: value }))))
    .pipe(map(($query) => $query.data ?? EMPTY_CREW));
  const stats = useQuery(slug$.pipe(map((value) => movieStatsQuery({ slug: value }))))
    .pipe(map(($query) => $query.data));

  const { isAuthorized } = useAuth();
  const { ratings } = useUser();
  const { buildReviewDrawerLink } = summaryDrawerNavigation();

  const tabIds: ReadonlyArray<FacetTab> = ["reviews", "watching", "lists"];
  const activeTab = $derived(
    parseTitleTab({ value: page.url.searchParams.get(TAB_PARAM), tabs: tabIds }),
  );

  const toCount = (value: number | undefined) =>
    value === undefined ? null : toHumanNumber(value, languageTag());

  const tabs = $derived([
    { id: "reviews" as const, label: m.list_title_comments(), count: toCount($stats?.comments) },
    { id: "watching" as const, label: m.boxed_title_tab_watching_now() },
    { id: "lists" as const, label: m.page_title_lists(), count: toCount($stats?.lists) },
  ]);

  const filmHref = $derived(UrlBuilder.movie(slug));
  const directors = $derived($crew.directors.slice(0, 2));
  const userRating = $derived(
    $movie ? ($ratings?.movies.get($movie.id)?.rating ?? null) : null,
  );
</script>

{#if $movie}
  <SummaryDrawer type="movie" media={$movie} studios={[]} crew={$crew} />
{/if}

<TitleFacetLayout ambient={toAmbientColors($movie?.colors)}>
  {#snippet header()}
    <TitleCompactHeader
      eyebrow={m.boxed_title_reviews_of()}
      title={$movie?.title}
      href={filmHref}
      poster={$movie?.poster.url.thumb}
      year={$movie?.year}
    >
      {#snippet credit()}
        {#each directors as director, index (director.key)}
          {#if index > 0},{/if}
          <a href={UrlBuilder.people(director.key)}>{director.name}</a>
        {/each}
      {/snippet}
    </TitleCompactHeader>
  {/snippet}

  {#snippet main()}
    <TitleTabs {tabs} active={activeTab} param={TAB_PARAM} variant="roomy" />

    {#if activeTab === "reviews"}
      <FilmReviewsTab {slug} toReviewHref={(id) => buildReviewDrawerLink(id).href} />
    {:else if activeTab === "watching"}
      <FilmWatchingNow {slug} />
    {:else}
      <div class="boxed-facet-lists">
        <ListsLoader
          {slug}
          title={$movie?.title ?? ""}
          type="movie"
          count={LIST_PAGE}
          paginate
        />
      </div>
    {/if}
  {/snippet}

  {#snippet rail()}
    {#if $movie}
      {@const media = $movie}
      <FilmReviewsRail
        movie={media}
        {userRating}
        isAuthorized={$isAuthorized}
        onWrite={() => logComposerStore.compose({ type: "movie", media })}
      />
    {/if}
  {/snippet}
</TitleFacetLayout>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-facet-lists {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ni-12);

    @include for-mobile {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
