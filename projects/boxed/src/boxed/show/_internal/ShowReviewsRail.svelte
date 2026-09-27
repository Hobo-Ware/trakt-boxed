<script lang="ts">
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { useWatchCount } from "$lib/stores/useWatchCount.ts";
  import ReviewsRail from "../../title/ReviewsRail.svelte";

  type ShowReviewsRailProps = {
    show: ShowEntry;
    userRating: number | null;
    isAuthorized: boolean;
    onWrite: () => void;
  };

  const { show, userRating, isAuthorized, onWrite }: ShowReviewsRailProps =
    $props();

  const { watchCount } = $derived(useWatchCount({ type: "show", media: show }));
</script>

<ReviewsRail
  metaInfo={{ type: "show", media: show }}
  average={show.rating}
  votes={show.votes}
  {userRating}
  watchCount={$watchCount}
  {isAuthorized}
  {onWrite}
/>
