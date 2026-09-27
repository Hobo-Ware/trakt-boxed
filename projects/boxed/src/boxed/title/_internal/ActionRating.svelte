<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useRatings } from "$lib/sections/summary/components/rating/useRatings.ts";
  import RatingScrub from "../../components/RatingScrub.svelte";

  type ActionRatingProps = {
    type: "movie" | "show" | "season" | "episode";
    id: number;
  };

  const { type, id }: ActionRatingProps = $props();

  const { ratings } = useUser();
  const { addRating, removeRating } = $derived(useRatings({ type, id }));

  const rating = $derived($ratings?.[`${type}s`].get(id)?.rating ?? null);
</script>

<RatingScrub
  {rating}
  variant="card"
  label={rating === null ? m.header_rate_now() : m.boxed_title_rated()}
  onChange={(value) => (value === null ? removeRating() : addRating(value))}
/>
