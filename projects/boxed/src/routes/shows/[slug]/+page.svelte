<script lang="ts">
  import ShowSummary from "$boxed/show/ShowSummary.svelte";
  import TitleSkeleton from "$boxed/title/TitleSkeleton.svelte";
  import { useShow } from "$clientRoutes/shows/[slug]/useShow.ts";
  import { useShowVideos } from "$clientRoutes/shows/[slug]/useShowVideos.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const slug$ = fromRune(() => params.slug);
  const { show, intl, studios, crew, seasons, streamOn, isLoading, sentiment } =
    useShow(slug$);
  const videos = useShowVideos({ slug: slug$ });
</script>

<TraktPage
  audience="all"
  title={$intl?.title ?? $show?.title}
  info={$show}
  image={$show?.poster.url.thumb ?? $show?.cover.url.thumb}
  type="show"
  hasDynamicContent={true}
>
  {#if !$isLoading && $show && $intl && $seasons}
    {#key $show.slug}
      <ShowSummary
        show={$show}
        title={$intl.title}
        overview={$intl.overview}
        tagline={"tagline" in $intl ? $intl.tagline : undefined}
        studios={$studios}
        crew={$crew}
        seasons={$seasons}
        streamOn={$streamOn}
        videos={$videos}
        sentiment={$sentiment}
      />
    {/key}
  {:else}
    <TitleSkeleton />
  {/if}
</TraktPage>
