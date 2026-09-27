<script lang="ts">
  import EpisodeSummary from "$boxed/show/EpisodeSummary.svelte";
  import TitleSkeleton from "$boxed/title/TitleSkeleton.svelte";
  import { useEpisode } from "$routes/shows/[slug]/seasons/[season]/episodes/[episode]/useEpisode.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { episode, seasons, crew, intl, show, showIntl, isLoading } = useEpisode(
    fromRune(() => ({
      slug: params.slug,
      season: parseInt(params.season),
      episode: parseInt(params.episode),
    })),
  );
</script>

<TraktPage
  audience="all"
  title={$intl?.title ?? $episode?.title}
  info={$episode}
  image={$episode?.cover.url}
  type="episode"
  hasDynamicContent={true}
>
  {#if !$isLoading && $show && $showIntl && $episode && $intl && $seasons}
    {#key `${$show.slug}-${$episode.season}-${$episode.number}`}
      <EpisodeSummary
        show={$show}
        showTitle={$showIntl.title}
        episode={$episode}
        title={$intl.title}
        overview={$intl.overview}
        seasons={$seasons}
        crew={$crew}
      />
    {/key}
  {:else}
    <TitleSkeleton />
  {/if}
</TraktPage>
