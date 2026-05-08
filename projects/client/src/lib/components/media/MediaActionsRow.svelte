<script lang="ts">
  /*
    The Letterboxd-flavoured verb row: Log it / Rate / Review / Add
    to list. Lives just below the poster + title block on a media page
    and below the eyebrow on diary entries.

    Each verb is a snippet so callers can wire their own behaviour —
    this atom only owns the layout, not the actions. That keeps the
    movie summary, diary card, and per-entry action bar all sharing
    the same visual rhythm.
  */
  import type { Snippet } from "svelte";

  type MediaActionsRowProps = {
    log?: Snippet;
    rate?: Snippet;
    review?: Snippet;
    list?: Snippet;
    extra?: Snippet;
  };

  const { log, rate, review, list, extra }: MediaActionsRowProps = $props();
</script>

<div class="trakt-media-actions-row">
  {#if log}
    <div class="trakt-media-action">{@render log()}</div>
  {/if}
  {#if rate}
    <div class="trakt-media-action">{@render rate()}</div>
  {/if}
  {#if review}
    <div class="trakt-media-action">{@render review()}</div>
  {/if}
  {#if list}
    <div class="trakt-media-action">{@render list()}</div>
  {/if}
  {#if extra}
    <div class="trakt-media-action">{@render extra()}</div>
  {/if}
</div>

<style>
  .trakt-media-actions-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);

    width: 100%;
    padding: var(--gap-s) var(--gap-m);

    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--color-foreground) 6%, transparent);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }

  .trakt-media-action {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
