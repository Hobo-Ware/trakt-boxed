<script lang="ts">
  import { goto } from "$app/navigation";
  import SeasonSummary from "$boxed/show/SeasonSummary.svelte";
  import TitleSkeleton from "$boxed/title/TitleSkeleton.svelte";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { showSeasonsQuery } from "$lib/requests/queries/shows/showSeasonsQuery.ts";
  import { showSummaryQuery } from "$lib/requests/queries/shows/showSummaryQuery.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel.ts";
  import { toLoadingState } from "$lib/utils/requests/toLoadingState.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { map } from "rxjs";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const slug$ = fromRune(() => params.slug);
  const showQuery = useQuery(slug$.pipe(map((slug) => showSummaryQuery({ slug }))));
  const seasonsQuery = useQuery(slug$.pipe(map((slug) => showSeasonsQuery({ slug }))));

  const number = $derived(parseInt(params.season));
  const show = $derived($showQuery.data);
  const seasons = $derived($seasonsQuery.data);
  const season = $derived(seasons?.find((item) => item.number === number));
  const isMissing = $derived(
    !toLoadingState($seasonsQuery) && seasons !== undefined && !season,
  );

  $effect(() => {
    if (!isMissing) return;
    goto(UrlBuilder.show(params.slug), { replaceState: true });
  });
</script>

<TraktPage
  audience="all"
  title={show ? seasonLabel(number, show.title) : undefined}
  info={show}
  image={season?.poster?.url.thumb ?? show?.poster.url.thumb}
  type="show"
  hasDynamicContent={true}
>
  {#if show && seasons && season}
    {#key `${show.slug}-${season.number}`}
      <SeasonSummary {show} {season} {seasons} />
    {/key}
  {:else}
    <TitleSkeleton />
  {/if}
</TraktPage>
