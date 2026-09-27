<script lang="ts">
  import { page } from "$app/state";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { CommentSortType } from "$lib/requests/models/CommentSortType.ts";
  import ReviewList from "../../title/_internal/ReviewList.svelte";
  import { parseTitleTab } from "../../title/_internal/parseTitleTab.ts";

  const SORT_PARAM = "sort";
  const PAGE_SIZE = 10;

  const { slug, toReviewHref }: { slug: string; toReviewHref: (id: number) => string } =
    $props();

  const sorts: ReadonlyArray<CommentSortType> = ["likes", "newest"];
  const labels: Record<CommentSortType, () => string> = {
    likes: m.text_sort_comments_popular,
    newest: m.text_sort_comments_recent,
  };

  const sort = $derived(
    parseTitleTab({ value: page.url.searchParams.get(SORT_PARAM), tabs: sorts }) ??
      "likes",
  );

  const toSortHref = (value: CommentSortType) => {
    const url = new URL(page.url);
    url.searchParams.set(SORT_PARAM, value);
    return `${url.pathname}${url.search}`;
  };
</script>

<div class="boxed-review-sorts" role="group" aria-label={m.list_title_comments()}>
  {#each sorts as value (value)}
    <a
      class="boxed-review-sort"
      href={toSortHref(value)}
      aria-current={value === sort}
      data-sveltekit-replacestate
      data-sveltekit-noscroll
      data-sveltekit-keepfocus
    >
      {labels[value]()}
    </a>
  {/each}
</div>

{#key sort}
  <ReviewList
    {slug}
    target={{ type: "movie" }}
    {sort}
    limit={PAGE_SIZE}
    {toReviewHref}
    paginate
  />
{/key}

<style>
  .boxed-review-sorts {
    display: flex;
    gap: var(--ni-8);
  }

  .boxed-review-sort {
    height: var(--ni-28);
    padding: 0 var(--ni-12);

    display: inline-flex;
    align-items: center;

    border-radius: var(--border-radius-xxl);
    background: var(--color-card-background);

    font-size: var(--ni-12);
    text-decoration: none;
    color: var(--color-text-primary);

    &[aria-current="true"] {
      background: color-mix(in srgb, var(--purple-500) 20%, var(--color-card-background));
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--purple-500);
    }
  }
</style>
