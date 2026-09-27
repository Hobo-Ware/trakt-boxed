<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { CommentSortType } from "$lib/requests/models/CommentSortType.ts";
  import type { CommentTypeProps } from "$lib/sections/summary/components/comments/CommentsProps.ts";
  import { useComments } from "$lib/sections/summary/components/comments/useComments.ts";
  import ReviewCard from "../ReviewCard.svelte";
  import ReviewSkeleton from "./ReviewSkeleton.svelte";

  type ReviewListProps = {
    slug: string;
    target: CommentTypeProps;
    sort: CommentSortType;
    limit: number;
    toReviewHref: (id: number) => string;
    paginate?: boolean;
  };

  const { slug, target, sort, limit, toReviewHref, paginate = false }: ReviewListProps =
    $props();

  const { list, isLoading, hasNextPage, fetchNextPage } = $derived(
    useComments({ slug, sort, limit, ...target }),
  );

  const reviews = $derived(paginate ? $list : $list.slice(0, limit));
  const isFirstLoad = $derived($isLoading && $list.length === 0);
  const reservedCount = $derived(paginate ? 0 : Math.min(limit, 3));
  const paddingCount = $derived(Math.max(reservedCount - reviews.length, 0));
</script>

<div class="boxed-review-list">
  {#if isFirstLoad}
    {#each { length: Math.min(limit, 3) }, index (index)}
      <ReviewSkeleton />
    {/each}
  {:else if reviews.length === 0}
    <div class="boxed-review-empty-slot">
      {#each { length: Math.max(paddingCount, 1) }, index (index)}
        <div class="boxed-review-padding"><ReviewSkeleton /></div>
      {/each}
      <p class="boxed-review-empty">{m.list_placeholder_comments()}</p>
    </div>
  {:else}
    {#each reviews as comment (comment.key)}
      <ReviewCard {comment} href={toReviewHref(comment.id)} />
    {/each}
    {#each { length: paddingCount }, index (index)}
      <div class="boxed-review-padding"><ReviewSkeleton /></div>
    {/each}
    {#if paginate && $hasNextPage}
      <button
        class="boxed-review-more"
        type="button"
        disabled={$isLoading}
        onclick={() => fetchNextPage()}
      >
        {m.button_text_load_more()}
      </button>
    {/if}
  {/if}
</div>

<style>
  .boxed-review-list {
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
  }

  .boxed-review-padding {
    visibility: hidden;
  }

  .boxed-review-empty-slot {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
  }

  .boxed-review-empty {
    position: absolute;
    inset-block-start: 0;
    inset-inline: 0;
    margin: 0;
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }

  .boxed-review-more {
    align-self: center;
    height: var(--ni-36);
    padding: 0 var(--ni-16);

    border: var(--border-thickness-xxs) solid var(--color-border);
    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    color: var(--color-text-primary);
    cursor: pointer;

    font: inherit;
    font-size: var(--ni-14);

    &:disabled {
      cursor: progress;
      opacity: 0.6;
    }
  }
</style>
