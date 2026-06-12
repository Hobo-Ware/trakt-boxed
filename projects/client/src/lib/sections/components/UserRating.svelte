<script lang="ts">
  import StarRatingDisplay from "$lib/components/rating/StarRatingDisplay.svelte";

  const { rating }: { rating: number } = $props();
</script>

<StarRatingDisplay {rating} />
