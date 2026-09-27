<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { CommentTypeProps } from "$lib/sections/summary/components/comments/CommentsProps.ts";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import type { Snippet } from "svelte";
  import SectionHeader from "../components/SectionHeader.svelte";
  import ReviewList from "./_internal/ReviewList.svelte";
  import ReviewSkeleton from "./_internal/ReviewSkeleton.svelte";

  const PREVIEW_COUNT = 3;

  type PopularReviewsProps = {
    slug: string;
    target: CommentTypeProps;
    moreHref: string;
    recentHref: string;
    totalCount: number | Nil;
    toReviewHref: (id: number) => string;
    cover?: Snippet;
  };

  const {
    slug,
    target,
    moreHref,
    recentHref,
    totalCount,
    toReviewHref,
    cover,
  }: PopularReviewsProps = $props();

  let isVisible = $state(false);
</script>

<section class="boxed-popular-reviews" use:whenInViewport={() => (isVisible = true)}>
  <SectionHeader title={m.boxed_title_popular_reviews()} href={moreHref} />

  <div class="boxed-popular-reviews-frame">
  <div
    class="boxed-popular-reviews-body"
    class:is-covered={cover !== undefined}
    inert={cover !== undefined}
  >
  {#if isVisible}
    <ReviewList {slug} {target} sort="likes" limit={PREVIEW_COUNT} {toReviewHref} />
  {:else}
    <div class="boxed-popular-reviews-skeleton">
      {#each { length: PREVIEW_COUNT }, index (index)}
        <ReviewSkeleton />
      {/each}
    </div>
  {/if}

  <a class="boxed-recent-reviews" href={recentHref}>
    <span>{m.boxed_title_recent_reviews()}</span>
    <span class="boxed-recent-reviews-count">
      {#if totalCount}
        {m.boxed_title_review_count({ count: toHumanNumber(totalCount, languageTag()) })}
      {/if}
      <CaretRightIcon />
    </span>
  </a>
  </div>
  {#if cover}
    <div class="boxed-popular-reviews-cover">{@render cover()}</div>
  {/if}
  </div>
</section>

<style>
  .boxed-popular-reviews-frame {
    position: relative;
  }

  .is-covered {
    filter: blur(var(--ni-8));
    user-select: none;
  }

  .boxed-popular-reviews-cover {
    position: absolute;
    inset: 0;
  }

  .boxed-popular-reviews-body,
  .boxed-popular-reviews-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
  }

  .boxed-recent-reviews {
    height: var(--ni-40);
    padding: 0 var(--ni-14);

    display: flex;
    align-items: center;
    justify-content: space-between;

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);

    font-size: var(--ni-12);
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--color-text-secondary);

    &:hover,
    &:focus-visible {
      color: var(--color-text-primary);
    }
  }

  .boxed-recent-reviews-count {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);

    font-size: var(--ni-12);
    letter-spacing: 0;
    text-transform: none;
    color: var(--color-link-active);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
