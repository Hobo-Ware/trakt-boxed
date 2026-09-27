<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMyActivityList } from "$lib/sections/profile/components/useMyActivityList.ts";
  import LoadMore from "../LoadMore.svelte";
  import type { ProfileContext } from "../ProfileContext.ts";
  import { toReviewTarget } from "../_internal/toReviewTarget.ts";
  import ReviewRow from "./ReviewRow.svelte";

  const PAGE_SIZE = 20;
  const SKELETON_ROWS = 6;

  const { context }: { context: ProfileContext } = $props();

  const { list, isLoading, hasNextPage, fetchNextPage } = $derived(
    useMyActivityList({
      type: "reviews",
      mode: "media",
      slug: context.slug,
      limit: PAGE_SIZE,
    }),
  );

  const reviews = $derived(
    $isLoading && $list.length === 0
      ? null
      : $list.flatMap((entry) => {
        const target = toReviewTarget(entry);
        return target && entry.activityType === "reviews"
          ? [{ key: entry.key, comment: entry.comment, target }]
          : [];
      }),
  );
</script>

<ul class="boxed-profile-reviews">
  {#if reviews === null}
    {#each { length: SKELETON_ROWS }, index (index)}
      <li class="review-skeleton" aria-hidden="true">
        <Skeleton width="var(--ni-72)" height="calc(1.5 * var(--ni-72))" />
        <span class="skeleton-lines">
          <Skeleton width="40%" height="var(--ni-20)" />
          <Skeleton width="var(--ni-96)" height="var(--ni-12)" />
          <Skeleton width="100%" height="var(--ni-44)" />
        </span>
      </li>
    {/each}
  {:else if reviews.length === 0}
    <li class="reviews-empty">{m.list_placeholder_comments()}</li>
  {:else}
    {#each reviews as review (review.key)}
      <ReviewRow comment={review.comment} target={review.target} />
    {/each}
  {/if}
</ul>

<LoadMore
  hasNextPage={$hasNextPage}
  isLoading={$isLoading}
  loadedCount={$list.length}
  onLoad={fetchNextPage}
/>

<style>
  .boxed-profile-reviews {
    margin: 0;
    padding: 0;
    list-style: none;
    min-height: calc(6 * var(--ni-148));
  }

  .review-skeleton {
    display: flex;
    gap: var(--ni-20);
    padding-block: var(--ni-20);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);
  }

  .skeleton-lines {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--ni-10);
  }

  .reviews-empty {
    min-height: var(--ni-240);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
  }
</style>
