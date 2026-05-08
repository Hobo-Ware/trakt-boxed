<script lang="ts">
  /*
    Trakt rating displayed as the trakt-boxed amber star + value.
    Distinct from the existing RatingItem (which is the multi-source
    rating widget on the summary page) — this atom is the inline
    diary/card variant: small, dense, single-source.
  */
  import StarIcon from "$lib/components/icons/StarIcon.svelte";

  type MediaRatingProps = {
    /* 0-10 from Trakt or null if unrated. */
    value?: number | Nil;
    /* When true, show 0-10 raw; when false, show /5 with halves. */
    raw?: boolean;
  };

  const { value, raw = false }: MediaRatingProps = $props();

  const display = $derived.by(() => {
    if (value == null) return null;
    if (raw) return value.toFixed(1);
    return (value / 2).toFixed(1);
  });
</script>

{#if display !== null}
  <span class="trakt-media-rating">
    <StarIcon />
    <span class="trakt-media-rating-value">{display}</span>
  </span>
{/if}

<style>
  .trakt-media-rating {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xxs);

    color: var(--tboxed-rating);
    font-weight: 600;
    font-size: var(--font-size-text);
    line-height: 1;
  }

  .trakt-media-rating-value {
    color: var(--color-foreground);
  }

  :global(.trakt-media-rating svg) {
    width: var(--ni-14);
    height: var(--ni-14);
  }
</style>
