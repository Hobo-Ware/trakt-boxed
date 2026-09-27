<script lang="ts">
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import Stars from "../../components/Stars.svelte";

  const {
    rating,
    isLiked,
    sub,
  }: { rating: number | null; isLiked: boolean; sub?: string } = $props();
</script>

<span class="boxed-diary-entry-meta">
  {#if rating !== null}<Stars {rating} />{/if}
  {#if isLiked}
    <span class="entry-liked" role="img" aria-label={m.boxed_title_liked()}>
      <FavoriteIcon state="filled" />
    </span>
  {/if}
  {#if sub}<span class="entry-sub">{sub}</span>{/if}
</span>

<style>
  .boxed-diary-entry-meta {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);
    min-width: 0;
    width: 100%;
  }

  .entry-liked {
    display: flex;
    color: var(--boxed-color-liked-text);

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }
  }

  .entry-sub {
    margin-inline-start: auto;
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-11);
    color: var(--color-text-secondary);
    white-space: nowrap;
  }
</style>
