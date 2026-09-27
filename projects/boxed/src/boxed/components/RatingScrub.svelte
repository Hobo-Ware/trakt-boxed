<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { RatingDelight } from "$lib/sections/summary/components/rating/models/RatingDelight.ts";
  import PopcornBurst from "$lib/sections/summary/components/rating/PopcornBurst.svelte";
  import { ratingDelight } from "$lib/sections/summary/components/rating/ratingDelight.ts";
  import RatingStars from "$lib/sections/summary/components/rating/RatingStars.svelte";
  import RottenTomato from "$lib/sections/summary/components/rating/RottenTomato.svelte";

  const {
    rating,
    label = m.header_rate_now(),
    variant = "form",
    onChange,
  }: {
    rating: number | null;
    label?: string;
    variant?: "form" | "card";
    onChange: (rating: number | null) => void;
  } = $props();

  let root: HTMLElement | null = $state(null);
  let delight: RatingDelight | null = $state(null);

  const celebrate = (value: number, star?: HTMLElement) => {
    const kind = ratingDelight(value);
    if (!kind || !star || !root) {
      delight = null;
      return;
    }

    const starRect = star.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    delight = {
      kind,
      origin: {
        x: starRect.left + starRect.width / 2 - rootRect.left,
        y: starRect.top + starRect.height / 2 - rootRect.top,
      },
    };
  };
</script>

<div class="boxed-rating-scrub" data-variant={variant} bind:this={root}>
  <span class="boxed-rating-scrub-label">{label}</span>
  <RatingStars
    rating={rating ?? undefined}
    isRating={false}
    onAddRating={(value: number, star?: HTMLElement) => {
      celebrate(value, star);
      onChange(value);
    }}
    onRemoveRating={() => onChange(null)}
  />
  {#if delight}
    {#key delight}
      {#if delight.kind === "popcorn"}
        <PopcornBurst origin={delight.origin} />
      {:else}
        <RottenTomato origin={delight.origin} />
      {/if}
    {/key}
  {/if}
</div>

<style>
  .boxed-rating-scrub {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    &[data-variant="card"] {
      align-items: center;
      gap: var(--ni-4);
    }
  }

  .boxed-rating-scrub-label {
    font-size: var(--ni-12);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-secondary);

    [data-variant="card"] > & {
      font-size: var(--ni-14);
      font-weight: 400;
      letter-spacing: 0;
      text-transform: none;
    }
  }
</style>
