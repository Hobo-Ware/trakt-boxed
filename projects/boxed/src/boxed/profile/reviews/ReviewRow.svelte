<script lang="ts">
  import { toReviewHref } from "$boxed/review/toReviewHref.ts";
  import Stars from "$boxed/components/Stars.svelte";
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import type { ReviewTarget } from "../_internal/toReviewTarget.ts";

  const {
    comment,
    target,
  }: { comment: MediaComment; target: ReviewTarget } = $props();

  let isSpoilerRevealed = $state(false);

  const rating = $derived(comment.user.stats.rating);
  const isSpoilerGated = $derived(comment.isSpoiler && !isSpoilerRevealed);
  const href = $derived(toReviewHref(comment.id));
</script>

<li class="boxed-review-row">
  <a class="review-poster" href={target.href} aria-label={target.title}>
    <CrossOriginImage src={target.poster} alt="" loading="lazy" />
  </a>

  <div class="review-content">
    <p class="review-heading">
      <a class="review-title" href={target.href}>{target.title}</a>
      {#if target.code}<span class="review-code">{target.code}</span>{/if}
    </p>

    <p class="review-meta">
      {#if rating}<Stars {rating} />{/if}
      <time datetime={comment.createdAt.toISOString()}>
        {toHumanDay({
          date: comment.createdAt,
          locale: getLocale(),
          format: "short",
        })}
      </time>
    </p>

    {#if isSpoilerGated}
      <p class="review-spoiler">
        <span>{m.boxed_title_review_spoiler()}</span>
        <button type="button" onclick={() => (isSpoilerRevealed = true)}>
          {m.boxed_title_show_anyway()}
        </button>
      </p>
    {:else}
      <a class="review-body" {href}>{comment.comment}</a>
    {/if}

    <p class="review-footer">
      <span class="review-likes">
        <FavoriteIcon state="filled" size="small" />
        {toHumanNumber(comment.likeCount, languageTag())}
      </span>
      <a {href}>
        {m.button_text_comment_replies({ count: comment.replyCount })}
      </a>
    </p>
  </div>
</li>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-review-row {
    display: flex;
    align-items: flex-start;
    gap: var(--ni-20);
    padding-block: var(--ni-20);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);
  }

  .review-poster {
    flex-shrink: 0;
    width: var(--ni-72);
    aspect-ratio: 2 / 3;
    border-radius: var(--border-radius-xs);
    overflow: hidden;
    background: var(--color-input-background);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @include for-mobile {
      width: var(--ni-56);
    }
  }

  .review-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    p {
      margin: 0;
    }
  }

  .review-heading {
    display: flex;
    align-items: baseline;
    gap: var(--ni-8);
    min-width: 0;
  }

  .review-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    font-family: var(--boxed-font-title);
    font-size: var(--ni-20);
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--color-text-primary);
    text-decoration: none;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }

  .review-code {
    flex-shrink: 0;
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-12);
    color: var(--boxed-color-accent-text);
  }

  .review-meta {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
    min-height: var(--ni-16);
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .review-body {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;

    font-size: var(--ni-14);
    line-height: 1.6;
    color: var(--color-text-primary);
    text-decoration: none;
    white-space: pre-line;
  }

  .review-spoiler {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
    min-height: var(--ni-44);
    font-size: var(--ni-14);
    color: var(--color-text-secondary);

    button {
      padding: 0;
      border: 0;
      background: none;
      font: inherit;
      color: var(--boxed-color-accent-text);
      cursor: pointer;
    }
  }

  .review-footer {
    display: flex;
    align-items: center;
    gap: var(--ni-16);
    font-size: var(--ni-12);
    color: var(--color-text-secondary);

    a {
      color: inherit;
      text-decoration: none;

      &:hover,
      &:focus-visible {
        color: var(--color-text-primary);
      }
    }
  }

  .review-likes {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);
    color: var(--boxed-color-liked-text);
  }
</style>
