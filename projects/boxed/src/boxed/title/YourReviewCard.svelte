<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import Stars from "../components/Stars.svelte";

  type YourReviewCardProps = {
    rating: number | null;
    watchCount: number;
    onWrite: () => void;
  };

  const { rating, watchCount, onWrite }: YourReviewCardProps = $props();
</script>

<section class="boxed-your-review">
  <span class="boxed-your-review-label">{m.boxed_title_your_review()}</span>
  <div class="boxed-your-review-rating">
    <span>{rating ? m.boxed_title_rated() : m.header_rate_now()}</span>
    {#if rating}
      <Stars {rating} size="normal" />
    {/if}
  </div>
  <p class="boxed-your-review-plays">
    {#if watchCount > 0}
      {m.boxed_title_watched_plays({ count: watchCount })}
    {/if}
  </p>
  <button class="boxed-your-review-write" type="button" onclick={onWrite}>
    {m.boxed_title_write_review()}
  </button>
</section>

<style>
  .boxed-your-review {
    padding: var(--ni-18);

    display: flex;
    flex-direction: column;
    gap: var(--ni-12);

    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--purple-500) 16%, var(--color-card-background));
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--purple-500) 40%, transparent);
  }

  .boxed-your-review-label {
    font-size: var(--ni-12);
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-primary);
  }

  .boxed-your-review-rating {
    height: var(--ni-24);

    display: flex;
    align-items: center;
    justify-content: space-between;

    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }

  .boxed-your-review-plays {
    margin: 0;
    min-height: var(--ni-20);

    font-size: var(--ni-14);
    line-height: 1.5;
    color: var(--color-text-secondary);
  }

  .boxed-your-review-write {
    height: var(--ni-40);

    border: none;
    border-radius: var(--border-radius-m);
    background: var(--purple-500);
    color: var(--shade-10);
    cursor: pointer;

    font: inherit;
    font-size: var(--ni-14);
    font-weight: 500;

    &:hover,
    &:focus-visible {
      background: var(--purple-600);
    }
  }
</style>
