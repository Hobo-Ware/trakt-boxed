<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { useParameters } from "$lib/features/parameters/useParameters";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import FilmSummary from "$lib/sections/film/FilmSummary.svelte";
  import SeasonPicker from "$lib/sections/film/SeasonPicker.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { useUserSeason } from "$lib/sections/lists/stores/useUserSeason";
  import { findActiveSeason } from "$lib/utils/media/findActiveSeason";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";
  import { useShow } from "./useShow";
  import { useShowVideos } from "./useShowVideos";

  const { params }: PageProps = $props();

  const { show, intl, studios, crew, seasons, streamOn, isLoading, sentiment } =
    $derived(useShow(params.slug));

  const videos = $derived(useShowVideos({ slug: params.slug }));

  const currentSeason = $derived(
    parseInt(page.url.searchParams.get("season") ?? ""),
  );

  const lastWatchedSeason = $derived(useUserSeason($show?.id));

  const { search } = useParameters();
  const goToSeason = (slug: string, season: number) => {
    goto(
      UrlBuilder.show(slug, {
        season,
        ...Object.fromEntries($search),
      }),
      { replaceState: true },
    );
  };

  $effect.pre(() => {
    if (!isNaN(currentSeason)) return;
    if ($seasons == null || $show == null) return;
    if ($seasons.length === 0) return;

    const activeSeason = findActiveSeason({
      seasons: $seasons,
      lastWatchedSeason: $lastWatchedSeason,
    });

    goToSeason($show.slug, activeSeason);
  });

  const hasCoreData = $derived(
    $show != null && $intl != null && $studios != null && $crew != null &&
      $seasons != null,
  );
  const isReady = $derived(!$isLoading && hasCoreData);
</script>

<TraktPage
  audience="all"
  title={$intl?.title ?? $show?.title}
  info={$show}
  image={$show?.poster.url.thumb ?? $show?.cover.url.thumb}
  type="show"
  hasDynamicContent={true}
  mode="content-only"
>
  {#if isReady && $show && $studios && $crew && $intl && $seasons}
    <FilmSummary
      type="show"
      media={$show}
      studios={$studios}
      crew={$crew}
      intl={$intl}
      streamOn={$streamOn}
      videos={$videos}
      sentiment={$sentiment}
    />
    <div class="show-extras">
      <SeasonPicker
        slug={$show.slug}
        seasons={$seasons}
        activeSeason={isNaN(currentSeason) ? -1 : currentSeason}
      />
    </div>
  {:else}
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div style="height: 100dvh; display:flex"></div>
    </RenderFor>
  {/if}
</TraktPage>

<style lang="scss">
  .show-extras {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 clamp(16px, 3vw, 32px);
  }
</style>
