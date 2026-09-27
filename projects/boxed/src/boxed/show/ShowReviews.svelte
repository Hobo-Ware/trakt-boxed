<script lang="ts">
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { EMPTY_CREW } from "$lib/requests/_internal/mapToMediaCrew.ts";
  import { showPeopleQuery } from "$lib/requests/queries/shows/showPeopleQuery.ts";
  import { showStatsQuery } from "$lib/requests/queries/shows/showStatsQuery.ts";
  import { showSummaryQuery } from "$lib/requests/queries/shows/showSummaryQuery.ts";
  import SummaryDrawer from "$lib/sections/summary/SummaryDrawer.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { map } from "rxjs";
  import { logComposerStore } from "../log/logComposerStore.ts";
  import ReviewsRail from "../title/ReviewsRail.svelte";
  import TitleReviewsFacet from "../title/TitleReviewsFacet.svelte";
  import WatchingNowLoader from "../title/WatchingNowLoader.svelte";

  const { slug }: { slug: string } = $props();

  const slug$ = fromRune(() => slug);
  const show = useQuery(slug$.pipe(map((value) => showSummaryQuery({ slug: value }))))
    .pipe(map(($query) => $query.data));
  const crew = useQuery(slug$.pipe(map((value) => showPeopleQuery({ slug: value }))))
    .pipe(map(($query) => $query.data ?? EMPTY_CREW));
  const stats = useQuery(slug$.pipe(map((value) => showStatsQuery({ slug: value }))))
    .pipe(map(($query) => $query.data));

  const { isAuthorized } = useAuth();
  const { ratings } = useUser();

  const userRating = $derived(
    $show ? ($ratings?.shows.get($show.id)?.rating ?? null) : null,
  );
</script>

{#if $show}
  <SummaryDrawer type="show" media={$show} studios={[]} crew={$crew} />
{/if}

<TitleReviewsFacet
  {slug}
  type="show"
  media={$show ? { ...$show, type: "show" } : undefined}
  href={UrlBuilder.show(slug)}
  credits={$crew.creators.slice(0, 2)}
  stats={$stats}
>
  {#snippet watching()}
    <WatchingNowLoader {slug} type="show" />
  {/snippet}

  {#snippet rail()}
    {#if $show}
      {@const media = $show}
      <ReviewsRail
        target={{ type: "show", media }}
        {userRating}
        isAuthorized={$isAuthorized}
        onWrite={() => logComposerStore.compose({ type: "show", media })}
      />
    {/if}
  {/snippet}
</TitleReviewsFacet>
