<script lang="ts">
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { commentQuery } from "$lib/requests/queries/comments/commentQuery.ts";
  import { movieSummaryQuery } from "$lib/requests/queries/movies/movieSummaryQuery.ts";
  import { showSummaryQuery } from "$lib/requests/queries/shows/showSummaryQuery.ts";
  import CommentBody from "$lib/sections/summary/components/comments/CommentBody.svelte";
  import { useCommentReplies } from "$lib/sections/summary/components/comments/drawers/useCommentReplies.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import Stars from "../components/Stars.svelte";
  import { logComposerStore } from "../log/logComposerStore.ts";
  import PopularReviews from "../title/PopularReviews.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { filter, map } from "rxjs";
  import { untrack } from "svelte";
  import { toReviewHrefs } from "./_internal/toReviewHrefs.ts";
  import { toReviewHref } from "./toReviewHref.ts";
  import type { ReviewTarget } from "./ReviewTarget.ts";

  const REPLY_PLACEHOLDERS = 3;

  type ReviewPageProps = {
    commentId: number;
    target: ReviewTarget | null;
  };

  const { commentId, target }: ReviewPageProps = $props();

  const { isAuthorized } = useAuth();
  const hrefs = $derived(target ? toReviewHrefs({ commentId, target }) : null);

  const reviewId = untrack(() => commentId);
  const commentResult = useQuery(commentQuery({ id: reviewId }));
  const target$ = fromRune(() => target).pipe(
    filter((value): value is ReviewTarget => value !== null),
  );
  const movieResult = useQuery(
    target$.pipe(
      filter((value) => value.type === "movie"),
      map((value) => movieSummaryQuery({ slug: value.slug })),
    ),
  );
  const showResult = useQuery(
    target$.pipe(
      filter((value) => value.type !== "movie"),
      map((value) => showSummaryQuery({ slug: value.slug })),
    ),
  );
  const { list: replies, isLoading: isLoadingReplies } = useCommentReplies({
    id: reviewId,
  });

  const comment = $derived($commentResult.data);
  const media = $derived($movieResult?.data ?? $showResult?.data);
  const author = $derived(comment ? toDisplayableName(comment.user) : "");
  const toDay = (date: Date) =>
    toHumanDay({ date, locale: getLocale(), format: "short" });

  const logTarget = $derived.by(() => {
    if (!media || !target) return null;
    if (target.type === "movie") return { type: "movie" as const, media };
    if (target.type === "episode") {
      return {
        type: "show" as const,
        media,
        season: target.season,
        episode: target.episode,
      };
    }
    return { type: "show" as const, media };
  });

  const profileHref = (user: { slug?: string | null; username: string }) =>
    UrlBuilder.profile.user(user.slug ?? user.username);
</script>

<div class="boxed-review-page">
  <aside class="boxed-review-media">
    <a class="boxed-review-poster" href={hrefs?.title} aria-label={media?.title}>
      {#if media}
        <CrossOriginImage src={media.poster.url.medium} alt={media.title} />
      {/if}
    </a>
    <div class="boxed-review-media-actions">
      {#if $isAuthorized}
        <button
          type="button"
          disabled={!logTarget}
          onclick={() => logTarget && logComposerStore.compose(logTarget)}
        >
          {m.boxed_title_log_or_review()}
        </button>
      {/if}
      <a href={hrefs?.title}>{m.button_text_where_to_watch()}</a>
    </div>
  </aside>

  <main class="boxed-review-main">
    <header class="boxed-review-header">
      {#if comment}
        <a class="boxed-review-author" href={profileHref(comment.user)}>
          <span class="boxed-review-avatar">
            <CrossOriginImage
              src={comment.user.avatar.url}
              alt={m.image_alt_user_avatar({ username: author })}
            />
          </span>
          <span>{m.text_review_by()} <strong>{author}</strong></span>
          {#if comment.user.isVip}
            <span class="boxed-review-vip">{m.tag_text_vip()}</span>
          {/if}
        </a>
      {:else}
        <Skeleton width="var(--ni-200)" height="var(--ni-32)" />
      {/if}

      <h1>
        {#if media}
          <a href={hrefs?.title}>{media.title}</a>
          {#if media.year}<span class="boxed-review-year">{media.year}</span>{/if}
        {:else}
          <Skeleton width="60%" height="1em" />
        {/if}
      </h1>

      <div class="boxed-review-meta">
        {#if comment?.user.stats.rating}
          <Stars rating={comment.user.stats.rating} />
        {/if}
        {#if comment}
          <time datetime={comment.createdAt.toISOString()}>
            {toDay(comment.createdAt)}
          </time>
        {/if}
      </div>
    </header>

    <div class="boxed-review-body">
      {#if comment && media}
        <CommentBody {comment} {media} type="full" />
      {:else}
        {#each { length: 5 }, index (index)}
          <Skeleton width={index === 4 ? "60%" : "100%"} height="1em" />
        {/each}
      {/if}
    </div>

    {#if comment && media}
    <div class="boxed-review-footer">
      <span class="boxed-review-likes">
        <FavoriteIcon state="filled" />
        {m.button_text_comment_likes({ count: comment.likeCount })}
      </span>
      <a class="boxed-review-reply" href={hrefs?.thread}>
        {m.button_label_comment_reply({ user: author })}
      </a>
    </div>
    {/if}

    {#if comment && media && comment.replyCount > 0}
      <section class="boxed-review-replies">
        <h2>
          {m.list_title_replies()}
          <span>{comment.replyCount}</span>
        </h2>
        {#if $isLoadingReplies && $replies.length === 0}
          {#each { length: Math.min(comment.replyCount, REPLY_PLACEHOLDERS) }, index (index)}
            <div class="boxed-review-reply-row" aria-hidden="true">
              <Skeleton width="var(--ni-32)" height="var(--ni-32)" radius="50%" />
              <div class="boxed-review-reply-content">
                <Skeleton width="var(--ni-120)" height="var(--ni-14)" />
                <Skeleton width="90%" height="var(--ni-14)" />
              </div>
            </div>
          {/each}
        {:else if media}
          {#each $replies as reply (reply.id)}
            {@const name = toDisplayableName(reply.user)}
            <article class="boxed-review-reply-row">
              <a
                class="boxed-review-avatar is-small"
                href={profileHref(reply.user)}
                aria-label={name}
              >
                <CrossOriginImage
                  src={reply.user.avatar.url}
                  alt={m.image_alt_user_avatar({ username: name })}
                />
              </a>
              <div class="boxed-review-reply-content">
                <div class="boxed-review-reply-header">
                  <a href={profileHref(reply.user)}>{name}</a>
                  <time datetime={reply.createdAt.toISOString()}>
                    {toDay(reply.createdAt)}
                  </time>
                </div>
                <CommentBody comment={reply} {media} type="full" />
              </div>
            </article>
          {/each}
        {/if}
      </section>
    {/if}
  </main>

  <aside class="boxed-review-rail">
    {#if media && hrefs?.reviews && (target?.type === "movie" || target?.type === "show")}
      <PopularReviews
        slug={target.slug}
        target={{ type: target.type }}
        moreHref={hrefs.reviews}
        recentHref={`${hrefs.reviews}?sort=newest`}
        totalCount={null}
        {toReviewHref}
      />
    {/if}
  </aside>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-review-page {
    min-height: 100dvh;
    display: grid;
    grid-template-columns: var(--ni-200) minmax(0, 1fr) var(--ni-300);
    align-content: start;
    align-items: start;
    gap: var(--ni-40);

    @include for-tablet-lg-and-below {
      grid-template-columns: var(--ni-120) minmax(0, 1fr);

      .boxed-review-rail {
        grid-column: 1 / -1;
      }
    }

    @include for-mobile {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ni-24);
    }
  }

  .boxed-review-media {
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);

    @include for-mobile {
      height: var(--ni-144);
      flex-direction: row;
      align-items: flex-end;
    }
  }

  .boxed-review-poster {
    display: block;
    width: 100%;
    aspect-ratio: 2 / 3;
    border-radius: var(--border-radius-m);
    overflow: hidden;
    background: var(--color-input-background);
    box-shadow: 0 0 0 var(--border-thickness-xxs) var(--color-border);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @include for-mobile {
      flex: 0 0 var(--ni-96);
      width: var(--ni-96);
      height: var(--ni-144);
    }
  }

  .boxed-review-media-actions {
    > :global(* + *) {
      border-top: var(--border-thickness-xxs) solid var(--color-border);
    }

    display: flex;
    flex-direction: column;
    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    overflow: hidden;

    @include for-mobile {
      flex: 1;
    }

    button,
    a {
      height: var(--ni-40);
      padding-inline: var(--ni-14);
      display: flex;
      align-items: center;
      border: none;
      background: none;
      color: var(--color-text-primary);
      font: inherit;
      font-size: var(--ni-14);
      text-align: start;
      text-decoration: none;
      cursor: pointer;

      &:hover,
      &:focus-visible {
        background: var(--color-input-background);
      }
    }
  }

  .boxed-review-main {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);
  }

  .boxed-review-header {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);

    h1 {
      min-height: 1.2em;
      margin: 0;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-40);
      font-weight: 600;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      a {
        color: inherit;
        text-decoration: none;
      }

      @include for-mobile {
        font-size: var(--ni-28);
      }
    }
  }

  .boxed-review-author {
    min-height: var(--ni-32);
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: var(--ni-10);
    color: var(--color-text-secondary);
    font-size: var(--ni-14);
    text-decoration: none;

    span,
    strong {
      font-size: inherit;
    }

    strong {
      color: var(--color-text-primary);
    }
  }

  .boxed-review-avatar {
    flex-shrink: 0;
    width: var(--ni-32);
    height: var(--ni-32);
    border-radius: 50%;
    overflow: hidden;
    background: var(--color-input-background);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .boxed-review-vip {
    padding: var(--ni-2) var(--ni-6);
    border-radius: var(--border-radius-xs);
    background: var(--purple-500);
    color: var(--shade-10);
    font-size: var(--ni-11);
    font-weight: 700;
  }

  .boxed-review-year {
    margin-inline-start: var(--ni-10);
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-18);
    font-weight: 400;
    color: var(--color-text-secondary);
  }

  .boxed-review-meta {
    min-height: var(--ni-20);
    display: flex;
    align-items: center;
    gap: var(--ni-12);
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .boxed-review-body {
    min-height: calc(5 * 1.7em);
    display: flex;
    flex-direction: column;
    gap: 0.7em;
    font-size: var(--ni-16);
    line-height: 1.7;
    max-width: 72ch;
  }

  .boxed-review-footer {
    padding-block: var(--ni-12);
    display: flex;
    align-items: center;
    gap: var(--ni-20);
    border-block: var(--border-thickness-xxs) solid var(--color-border);
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }

  .boxed-review-likes {
    min-width: var(--ni-80);
    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);
    font-size: inherit;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
      color: var(--boxed-color-liked);
    }
  }

  .boxed-review-reply {
    margin-inline-start: auto;
    color: var(--color-link-active);
    text-decoration: none;
  }

  .boxed-review-replies {
    display: flex;
    flex-direction: column;
    gap: var(--ni-18);

    h2 {
      margin: 0;
      font-size: var(--ni-12);
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);

      span {
        margin-inline-start: var(--ni-6);
        font-family: "Roboto Mono", monospace;
        font-size: var(--ni-11);
      }
    }
  }

  .boxed-review-reply-row {
    display: flex;
    gap: var(--ni-12);
  }

  .boxed-review-reply-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
    font-size: var(--ni-14);
    line-height: 1.6;
  }

  .boxed-review-reply-header {
    display: flex;
    align-items: baseline;
    gap: var(--ni-10);

    a {
      color: var(--color-text-primary);
      font-weight: 600;
      text-decoration: none;
    }

    time {
      font-family: "Roboto Mono", monospace;
      font-size: var(--ni-11);
      color: var(--color-text-secondary);
    }
  }

  .boxed-review-rail {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
  }
</style>
