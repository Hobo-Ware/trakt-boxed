<script lang="ts">
  /*
    Single review card, Letterboxd shape: avatar + username on a
    line with stars + heart + reply count, body in serif/sans
    paragraph below, optional spoiler cover, "watched" eyebrow when
    rating present. No SectionList horizontal scroller — these
    stack vertically as a continuous review feed.
  */
  import * as m from "$lib/features/i18n/messages.ts";
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type LetterboxdReviewCardProps = {
    comment: MediaComment;
  };

  const { comment }: LetterboxdReviewCardProps = $props();

  let isSpoilerHidden = $state(comment.isSpoiler);

  const stars = $derived.by(() => {
    const r = comment.user.stats.rating;
    if (r == null) return 0;
    return Math.max(0, Math.min(5, Math.round(r / 2)));
  });

  const hasHalfStar = $derived.by(() => {
    const r = comment.user.stats.rating;
    if (r == null) return false;
    return (r / 2) % 1 >= 0.25 && (r / 2) % 1 < 0.75;
  });
</script>

<article class="lb-review">
  <div class="lb-review-avatar">
    {#if comment.user.avatar?.url}
      <CrossOriginImage
        classList="lb-review-avatar-img"
        src={comment.user.avatar.url}
        alt={comment.user.username ?? ""}
      />
    {:else}
      <span class="lb-review-avatar-fallback" aria-hidden="true">
        {(comment.user.username ?? "U").slice(0, 1).toUpperCase()}
      </span>
    {/if}
  </div>

  <div class="lb-review-body">
    <header class="lb-review-head">
      <p class="lb-review-byline">
        <span class="lb-review-byline-prefix">
          {m.lb_review_byline_prefix()}
        </span>
        <Link
          href={UrlBuilder.profile.user(comment.user.username ?? "")}
          color="inherit"
        >
          <span class="lb-review-byline-user">
            {comment.user.name?.full || comment.user.username}
          </span>
        </Link>
      </p>

      {#if comment.user.stats.rating}
        <span class="lb-review-stars" aria-hidden="true">
          {#each Array(5) as _, i (i)}
            <span class="lb-review-star" class:filled={i < stars}>★</span>
          {/each}
          {#if hasHalfStar}
            <span class="lb-review-star-half" aria-hidden="true">½</span>
          {/if}
        </span>
      {/if}

      {#if comment.likeCount > 0}
        <span class="lb-review-likes" aria-label="likes">
          <span class="lb-review-likes-glyph" aria-hidden="true">♥</span>
          <span>{comment.likeCount}</span>
        </span>
      {/if}

      {#if comment.replyCount > 0}
        <span class="lb-review-replies" aria-label="replies">
          <span class="lb-review-replies-glyph" aria-hidden="true">⏵</span>
          <span>{comment.replyCount}</span>
        </span>
      {/if}
    </header>

    {#if isSpoilerHidden}
      <button
        type="button"
        class="lb-review-spoiler-cover"
        onclick={() => (isSpoilerHidden = false)}
      >
        {m.lb_review_spoiler_cover()}
      </button>
    {:else}
      <p class="lb-review-text">{comment.comment}</p>
    {/if}
  </div>
</article>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-review {
    display: grid;
    grid-template-columns: var(--ni-44) 1fr;
    gap: var(--ni-14);
    padding: var(--ni-18) 0;
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
    align-items: start;
  }

  .lb-review-avatar {
    width: var(--ni-44);
    height: var(--ni-44);
    border-radius: 999px;
    overflow: hidden;
    background: color-mix(in srgb, var(--color-foreground) 12%, transparent);
    display: grid;
    place-items: center;
  }

  :global(.lb-review-avatar-img) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .lb-review-avatar-fallback {
    font-family: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
    font-weight: 700;
    font-size: var(--ni-18);
    color: var(--color-foreground);
  }

  .lb-review-body {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }

  .lb-review-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ni-8) var(--ni-14);
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .lb-review-byline {
    margin: 0;
    display: inline-flex;
    align-items: baseline;
    gap: var(--ni-4);
  }

  .lb-review-byline-prefix {
    text-transform: lowercase;
    letter-spacing: 0.04em;
  }

  .lb-review-byline-user {
    color: var(--color-foreground);
    font-weight: 700;
  }

  .lb-review-stars {
    display: inline-flex;
    align-items: center;
    gap: 1px;
    color: var(--tboxed-positive);
    font-size: var(--ni-13);
  }

  .lb-review-star {
    color: color-mix(in srgb, var(--color-foreground) 20%, transparent);
  }

  .lb-review-star.filled {
    color: var(--tboxed-positive);
  }

  .lb-review-star-half {
    color: var(--tboxed-positive);
    font-size: var(--ni-11);
    margin-left: 1px;
  }

  .lb-review-likes,
  .lb-review-replies {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);
    font-size: var(--ni-12);
  }

  .lb-review-likes-glyph {
    color: var(--tboxed-positive);
  }

  .lb-review-text {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground) 92%, transparent);
    font-size: var(--ni-14);
    line-height: 1.55;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .lb-review-spoiler-cover {
    align-self: flex-start;
    border: 0;
    padding: var(--ni-8) var(--ni-14);
    background: color-mix(in srgb, var(--color-foreground) 10%, transparent);
    border-radius: var(--border-radius-xs);
    color: var(--color-foreground);
    font-size: var(--ni-12);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 700;
    cursor: pointer;

    &:hover {
      background: color-mix(in srgb, var(--tboxed-positive) 22%, transparent);
      color: var(--tboxed-positive);
    }
  }
</style>
