<script lang="ts">
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { EMPTY_CREW } from "$lib/requests/_internal/mapToMediaCrew.ts";
  import { movieStatsQuery } from "$lib/requests/queries/movies/movieStatsQuery.ts";
  import { moviePeopleQuery } from "$lib/requests/queries/movies/moviePeopleQuery.ts";
  import { movieSummaryQuery } from "$lib/requests/queries/movies/movieSummaryQuery.ts";
  import SummaryDrawer from "$lib/sections/summary/SummaryDrawer.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { map } from "rxjs";
  import { logComposerStore } from "../log/logComposerStore.ts";
  import FilmReviewsRail from "./_internal/FilmReviewsRail.svelte";
  import FilmWatchingNow from "./_internal/FilmWatchingNow.svelte";
  import TitleReviewsFacet from "../title/TitleReviewsFacet.svelte";

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

  const userRating = $derived(
    $movie ? ($ratings?.movies.get($movie.id)?.rating ?? null) : null,
  );
</script>

{#if $movie}
  <SummaryDrawer type="movie" media={$movie} studios={[]} crew={$crew} />
{/if}

<TitleReviewsFacet
  {slug}
  type="movie"
  media={$movie ? { ...$movie, type: "movie" } : undefined}
  href={UrlBuilder.movie(slug)}
  credits={$crew.directors.slice(0, 2)}
  stats={$stats}
>
  {#snippet watching()}
    <FilmWatchingNow {slug} />
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
</TitleReviewsFacet>
