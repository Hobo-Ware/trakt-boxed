<script lang="ts">
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import { useWatchCount } from "$lib/stores/useWatchCount.ts";
  import RatingsBlock from "../../title/RatingsBlock.svelte";
  import YourReviewCard from "../../title/YourReviewCard.svelte";

  type FilmReviewsRailProps = {
    movie: MovieEntry;
    userRating: number | null;
    isAuthorized: boolean;
    onWrite: () => void;
  };

  const { movie, userRating, isAuthorized, onWrite }: FilmReviewsRailProps =
    $props();

  const { watchCount } = $derived(useWatchCount({ type: "movie", media: movie }));
</script>

{#if isAuthorized}
  <YourReviewCard rating={userRating} watchCount={$watchCount} {onWrite} />
{/if}
<div class="boxed-facet-ratings">
  <RatingsBlock
    metaInfo={{ type: "movie", media: movie }}
    average={movie.rating}
    votes={movie.votes}
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
