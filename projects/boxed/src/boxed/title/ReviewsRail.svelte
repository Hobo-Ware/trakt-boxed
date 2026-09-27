<script lang="ts">
  import type { MetaInfoProps } from "$lib/sections/summary/components/media/useMediaMetaInfo.ts";
  import RatingsBlock from "./RatingsBlock.svelte";
  import YourReviewCard from "./YourReviewCard.svelte";

  type ReviewsRailProps = {
    metaInfo: MetaInfoProps;
    average: number | Nil;
    votes: number;
    userRating: number | null;
    watchCount: number;
    isAuthorized: boolean;
    onWrite: () => void;
  };

  const {
    metaInfo,
    average,
    votes,
    userRating,
    watchCount,
    isAuthorized,
    onWrite,
  }: ReviewsRailProps = $props();
</script>

{#if isAuthorized}
  <YourReviewCard rating={userRating} {watchCount} {onWrite} />
{/if}
<div class="boxed-facet-ratings">
  <RatingsBlock {metaInfo} {average} {votes} {userRating} />
</div>

<style>
  .boxed-facet-ratings {
    padding: var(--ni-18);

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
  }
</style>
