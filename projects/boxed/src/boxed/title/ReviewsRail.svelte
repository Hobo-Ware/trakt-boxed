<script lang="ts">
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { useWatchCount } from "$lib/stores/useWatchCount.ts";
  import RatingsBlock from "./RatingsBlock.svelte";
  import YourReviewCard from "./YourReviewCard.svelte";

  type ReviewsRailProps = {
    target:
      | { type: "movie"; media: MovieEntry }
      | { type: "show"; media: ShowEntry };
    userRating: number | null;
    isAuthorized: boolean;
    onWrite: () => void;
  };

  const { target, userRating, isAuthorized, onWrite }: ReviewsRailProps =
    $props();

  const { watchCount } = $derived(useWatchCount(target));
</script>

{#if isAuthorized}
  <YourReviewCard rating={userRating} watchCount={$watchCount} {onWrite} />
{/if}
<div class="boxed-facet-ratings">
  <RatingsBlock
    metaInfo={target}
    average={target.media.rating}
    votes={target.media.votes}
    {userRating}
  />
</div>

<style>
  .boxed-facet-ratings {
    padding: var(--ni-18);

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
  }
</style>
