<script lang="ts">
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import ReplyIcon from "$lib/components/icons/ReplyIcon.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaComment } from "$lib/requests/models/MediaComment.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import Stars from "../components/Stars.svelte";
  import { toReviewPreview } from "./_internal/toReviewPreview.ts";

  type ReviewCardProps = {
    comment: MediaComment;
    href: string;
  };

  const { comment, href }: ReviewCardProps = $props();

  let isSpoilerRevealed = $state(false);

  const name = $derived(toDisplayableName(comment.user));
  const rating = $derived(comment.user.stats.rating);
  const isSpoilerGated = $derived(comment.isSpoiler && !isSpoilerRevealed);
  const preview = $derived(toReviewPreview(comment.comment, "…"));
</script>

<article class="boxed-review">
  <a
    class="boxed-review-avatar"
    href={UrlBuilder.profile.user(comment.user.slug ?? comment.user.username)}
    aria-label={name}
  >
    <CrossOriginImage
      src={comment.user.avatar.url}
      alt={m.image_alt_user_avatar({ username: name })}
    />
  </a>

  <div class="boxed-review-content">
    <div class="boxed-review-header">
      <span class="boxed-review-author">
        {m.text_review_by()} <strong>{name}</strong>
      </span>
      {#if rating}
        <Stars rating={rating} />
      {/if}
      <time
        class="boxed-review-date"
        datetime={comment.createdAt.toISOString()}
      >
        {toHumanDay({ date: comment.createdAt, locale: getLocale(), format: "short" })}
      </time>
    </div>

    {#if isSpoilerGated}
      <div class="boxed-review-spoiler">
        <span>{m.boxed_title_review_spoiler()}</span>
        <button type="button" onclick={() => (isSpoilerRevealed = true)}>
          {m.boxed_title_show_anyway()}
        </button>
      </div>
    {:else}
      <a class="boxed-review-body" {href} data-sveltekit-noscroll data-sveltekit-replacestate>
        {preview}
      </a>
    {/if}

    <div class="boxed-review-footer">
      {#if comment.likeCount > 0}
        <span class="boxed-review-chip">
          <FavoriteIcon state="filled" size="small" />
          {toHumanNumber(comment.likeCount, languageTag())}
        </span>
      {/if}
      <a
        class="boxed-review-replies"
        {href}
        data-sveltekit-noscroll
        data-sveltekit-replacestate
      >
        <ReplyIcon />
        {m.button_text_comment_replies({ count: comment.replyCount })}
      </a>
    </div>
  </div>
</article>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-review {
    --review-line: calc(var(--ni-14) * 1.6);

    box-sizing: border-box;
    padding-bottom: var(--ni-16);

    display: flex;
    gap: var(--ni-14);

    border-bottom: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-border) 60%, transparent);
  }

  .boxed-review-avatar {
    flex-shrink: 0;

    :global(img) {
      display: block;
      width: var(--ni-36);
      height: var(--ni-36);
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .boxed-review-content {
    flex: 1 1 0;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }

  .boxed-review-header {
    height: var(--ni-20);

    display: flex;
    align-items: center;
    gap: var(--ni-10);

    font-size: var(--ni-14);
    color: var(--color-text-secondary);
    white-space: nowrap;
    overflow: hidden;

    strong {
      font-weight: 500;
      color: var(--color-text-primary);
    }
  }

  .boxed-review-author {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .boxed-review-date {
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .boxed-review-body {
    height: calc(3 * var(--review-line));

    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;

    font-size: var(--ni-14);
    line-height: var(--review-line);
    text-decoration: none;
    color: var(--color-text-primary);
    overflow-wrap: anywhere;
  }

  .boxed-review-spoiler {
    box-sizing: border-box;
    height: calc(3 * var(--review-line));
    padding: 0 var(--ni-16);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ni-12);

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);

    font-size: var(--ni-14);
    color: var(--color-text-secondary);

    button {
      flex-shrink: 0;
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;

      font: inherit;
      color: var(--color-link-active);
    }
  }

  .boxed-review-footer {
    height: var(--ni-28);

    display: flex;
    align-items: center;
    gap: var(--ni-8);
  }

  .boxed-review-chip {
    height: var(--ni-28);
    padding: 0 var(--ni-10);
    box-sizing: border-box;

    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);

    border-radius: var(--border-radius-xxl);
    background: var(--color-card-background);

    font-size: var(--ni-12);
    color: var(--color-text-primary);

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
      color: var(--boxed-color-liked-text);
    }
  }

  .boxed-review-replies {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);

    font-size: var(--ni-12);
    text-decoration: none;
    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }

    &:hover,
    &:focus-visible {
      color: var(--color-text-primary);
    }
  }

  @include for-tablet-lg-and-below {
    .boxed-review-avatar :global(img) {
      width: var(--ni-28);
      height: var(--ni-28);
    }
  }
</style>
