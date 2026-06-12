<script lang="ts">
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const { rating }: { rating: number } = $props();

  const stars = $derived(
    [1, 2, 3, 4, 5]
      .map((index) => {
        if (rating >= index * 2) return "full" as const;
        if (rating > (index - 1) * 2) return "half" as const;
        return "none" as const;
      })
      .filter((fill) => fill !== "none"),
  );
</script>

<div
  class="trakt-star-rating-display"
  role="img"
  aria-label={m.text_label_user_star_rating({ stars: rating / 2 })}
>
  {#each stars as fill, index (index)}
    <StarIcon {fill} />
  {/each}
</div>

<style>
  .trakt-star-rating-display {
    display: flex;
    align-items: center;
    color: var(--color-ratings-user);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
