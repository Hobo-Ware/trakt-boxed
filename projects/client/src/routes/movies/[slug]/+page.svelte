<script lang="ts">
  import FilmSummary from "$lib/sections/film/FilmSummary.svelte";
  import FilmSummarySkeleton from "$lib/sections/film/FilmSummarySkeleton.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import type { PageProps } from "./$types";
  import { useMovie } from "./useMovie";

  const { params }: PageProps = $props();

  const { movie, intl, studios, crew, streamOn, isLoading, videos, sentiment } =
    $derived(useMovie(params.slug));
</script>

<TraktPage
  audience="all"
  title={$intl?.title ?? $movie?.title}
  info={$movie}
  image={$movie?.poster.url.thumb ?? $movie?.cover.url.thumb}
  type="movie"
  hasDynamicContent={true}
>
  <RenderFor audience="authenticated">
    <NavbarStateSetter mode="minimal" />
  </RenderFor>

  {#if !$isLoading && $movie && $studios && $crew && $intl}
    <FilmSummary
      type="movie"
      media={$movie}
      studios={$studios}
      crew={$crew}
      intl={$intl}
      streamOn={$streamOn}
      videos={$videos}
      sentiment={$sentiment}
    />
  {:else}
    <FilmSummarySkeleton />
  {/if}
</TraktPage>
