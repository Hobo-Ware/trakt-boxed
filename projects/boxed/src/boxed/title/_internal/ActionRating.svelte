<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useRatings } from "$lib/sections/summary/components/rating/useRatings.ts";
  import RatingScrub from "../../components/RatingScrub.svelte";
  import type { PosterMedia } from "../../poster/PosterMedia.ts";

  const { media }: { media: PosterMedia } = $props();

  const { ratings } = useUser();
  const { addRating, removeRating } = $derived(
    useRatings({ type: media.type, id: media.id }),
  );

  const rating = $derived(
    (media.type === "movie" ? $ratings?.movies : $ratings?.shows)?.get(media.id)
      ?.rating ?? null,
  );
</script>

<RatingScrub
  {rating}
  variant="card"
  label={rating === null ? m.header_rate_now() : m.boxed_title_rated()}
  onChange={(value) => (value === null ? removeRating() : addRating(value))}
/>
