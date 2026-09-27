<script lang="ts">
  import FilmSummary from "$boxed/film/FilmSummary.svelte";
  import TitleSkeleton from "$boxed/title/TitleSkeleton.svelte";
  import { useMovie } from "$routes/movies/[slug]/useMovie.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const {
    movie,
    intl,
    studios,
    crew,
    streamOn,
    isLoading,
    videos,
    sentiment,
    youtubeSpecial,
  } = useMovie(fromRune(() => params.slug));
</script>

<TraktPage
  audience="all"
  title={$intl?.title ?? $movie?.title}
  info={$movie}
  image={$movie?.poster.url.thumb ?? $movie?.cover.url.thumb}
  type="movie"
  hasDynamicContent={true}
>
  {#if !$isLoading && $movie && $intl}
    {#key $movie.slug}
      <FilmSummary
        movie={$movie}
        title={$intl.title}
        overview={$intl.overview}
        tagline={"tagline" in $intl ? $intl.tagline : undefined}
        studios={$studios}
        crew={$crew}
        streamOn={$streamOn}
        videos={$videos}
        sentiment={$sentiment}
        youtubeSpecial={$youtubeSpecial}
      />
    {/key}
  {:else}
    <TitleSkeleton />
  {/if}
</TraktPage>
