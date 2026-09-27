<script lang="ts">
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MetaInfoProps } from "$lib/sections/summary/components/media/useMediaMetaInfo.ts";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport.ts";
  import { toIMDBRating } from "$lib/utils/formatting/number/toIMDBRating.ts";
  import SectionHeader from "../components/SectionHeader.svelte";
  import Stars from "../components/Stars.svelte";
  import RatingsLoader from "./_internal/RatingsLoader.svelte";
  import RatingsPanel from "./_internal/RatingsPanel.svelte";

  const STAR_SCALE = 5;

  type RatingsBlockProps = {
    metaInfo: MetaInfoProps;
    average: number | Nil;
    votes: number;
    userRating: number | null;
    drilldownHref?: string;
  };

  const { metaInfo, average, votes, userRating, drilldownHref }: RatingsBlockProps =
    $props();

  let isVisible = $state(false);

  const averageStars = $derived(
    average ? toIMDBRating(average * STAR_SCALE, languageTag()) : "–",
  );
</script>

<section class="boxed-ratings" use:whenInViewport={() => (isVisible = true)}>
  <SectionHeader title={m.header_ratings()} href={drilldownHref} />

  <div class="boxed-ratings-grid">
    <span class="boxed-ratings-low" aria-hidden="true">★</span>
    <div class="boxed-ratings-average">
      <span class="boxed-ratings-score">{averageStars}</span>
      <Stars rating={Math.round((average ?? 0) * 10)} />
    </div>

    {#if isVisible}
      <RatingsLoader {metaInfo} {votes} {userRating} />
    {:else}
      <RatingsPanel ratings={null} {votes} {userRating} />
    {/if}
  </div>
</section>

<style>
  .boxed-ratings-grid {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
      "low bars average"
      "foot foot foot"
      "external external external";
    align-items: end;
    column-gap: var(--ni-12);
    row-gap: var(--ni-14);
  }

  .boxed-ratings-low {
    grid-area: low;
    padding-bottom: var(--ni-2);

    font-size: var(--ni-11);
    color: var(--boxed-color-star);
  }

  .boxed-ratings-average {
    grid-area: average;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-2);
  }

  .boxed-ratings-score {
    font-family: var(--boxed-font-title);
    font-weight: 600;
    font-size: var(--ni-36);
    line-height: 1;
    color: var(--color-text-primary);
  }
</style>
