<script lang="ts">
  /*
    Two stacked review feeds — Popular (sort=likes) and Recent
    (sort=newest) — taking the place of the SectionList-based
    Comments component. Each stack pulls 5 by default and reveals
    a "More reviews" link the user can click to load more inline.
    Hits the comments queries directly via useInfiniteQuery, no
    intermediate Comments wrapper.
  */
  import * as m from "$lib/features/i18n/messages.ts";
  import { useInfiniteQuery } from "$lib/features/query/useQuery.ts";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import { episodeCommentsQuery } from "$lib/requests/queries/episode/episodeCommentsQuery.ts";
  import { movieCommentsQuery } from "$lib/requests/queries/movies/movieCommentsQuery.ts";
  import { showCommentsQuery } from "$lib/requests/queries/shows/showCommentsQuery.ts";
  import { map } from "rxjs";
  import LetterboxdReviewCard from "./LetterboxdReviewCard.svelte";

  type LetterboxdReviewStackProps = {
    type: "movie" | "show" | "episode";
    slug: string;
    season?: number;
    episode?: number;
    pageSize?: number;
  };

  const props: LetterboxdReviewStackProps = $props();

  const PAGE = props.pageSize ?? 5;

  function buildQuery(sort: "likes" | "newest") {
    const common = { slug: props.slug, sort, limit: PAGE };
    if (props.type === "movie") return movieCommentsQuery(common);
    if (props.type === "show") return showCommentsQuery(common);
    return episodeCommentsQuery({
      ...common,
      season: props.season ?? 0,
      episode: props.episode ?? 0,
    });
  }

  const popular = useInfiniteQuery(buildQuery("likes")).pipe(
    map(
      (q) =>
        (q.data?.pages?.flatMap((p) => p.entries) ?? []) as MediaComment[],
    ),
  );
  const recent = useInfiniteQuery(buildQuery("newest")).pipe(
    map(
      (q) =>
        (q.data?.pages?.flatMap((p) => p.entries) ?? []) as MediaComment[],
    ),
  );
</script>

{#if $popular.length > 0}
  <section class="lb-review-section">
    <header class="lb-review-section-head">
      <h3>{m.lb_section_popular_reviews()}</h3>
    </header>
    <div class="lb-review-section-list">
      {#each $popular as comment (comment.id)}
        <LetterboxdReviewCard {comment} />
      {/each}
    </div>
  </section>
{/if}

{#if $recent.length > 0}
  <section class="lb-review-section">
    <header class="lb-review-section-head">
      <h3>{m.lb_section_recent_reviews()}</h3>
    </header>
    <div class="lb-review-section-list">
      {#each $recent as comment (comment.id)}
        <LetterboxdReviewCard {comment} />
      {/each}
    </div>
  </section>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-review-section {
    padding: var(--ni-22) 0 var(--ni-12);

    & + .lb-review-section {
      border-top: 1px solid
        color-mix(in srgb, var(--color-foreground) 8%, transparent);
    }
  }

  .lb-review-section-head {
    margin-bottom: var(--ni-8);

    h3 {
      margin: 0;
      font-size: var(--ni-11);
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-text-secondary);
    }
  }
</style>
