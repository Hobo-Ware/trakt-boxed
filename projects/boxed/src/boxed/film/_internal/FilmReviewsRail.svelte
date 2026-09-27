<script lang="ts">
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import { useWatchCount } from "$lib/stores/useWatchCount.ts";
  import ReviewsRail from "../../title/ReviewsRail.svelte";

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

<ReviewsRail
  metaInfo={{ type: "movie", media: movie }}
  average={movie.rating}
  votes={movie.votes}
  {userRating}
  watchCount={$watchCount}
  {isAuthorized}
  {onWrite}
/>
