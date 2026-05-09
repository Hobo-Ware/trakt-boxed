<script lang="ts">
  /*
    Vertical stack of Letterboxd-style list cards: 5-poster collage
    on the left, name + author + count + likes + description right.
    Replaces the SectionList "Popular Lists" rail. Hits
    movieListsQuery / showListsQuery directly.
  */
  import * as m from "$lib/features/i18n/messages.ts";
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useInfiniteQuery } from "$lib/features/query/useQuery.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { movieListsQuery } from "$lib/requests/queries/movies/movieListsQuery.ts";
  import { showListsQuery } from "$lib/requests/queries/shows/showListsQuery.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { map } from "rxjs";

  type LetterboxdPopularListsProps = {
    type: "movie" | "show";
    slug: string;
  };

  const props: LetterboxdPopularListsProps = $props();

  const query =
    props.type === "movie"
      ? movieListsQuery({ slug: props.slug, limit: 6 })
      : showListsQuery({ slug: props.slug, limit: 6 });

  const lists = useInfiniteQuery(query).pipe(
    map(
      (q) =>
        (q.data?.pages?.flatMap((p) => p.entries) ?? []) as MediaListSummary[],
    ),
  );

  const drilldownHref = $derived(
    props.type === "movie"
      ? UrlBuilder.popularLists.movie(props.slug)
      : UrlBuilder.popularLists.show(props.slug),
  );

  const fmtCount = (n: number) => {
    if (n < 1000) return `${n}`;
    if (n < 1_000_000) return `${(n / 1000).toFixed(1)}K`;
    return `${(n / 1_000_000).toFixed(1)}M`;
  };
</script>

{#if $lists.length > 0}
  <section class="lb-popular-lists">
    <header class="lb-popular-lists-head">
      <h3>{m.lb_section_popular_lists()}</h3>
      <Link href={drilldownHref} color="inherit">
        <span class="lb-popular-lists-all">{m.lb_section_view_all()}</span>
      </Link>
    </header>

    <ul class="lb-popular-lists-stack">
      {#each $lists as list (list.id)}
        <li class="lb-popular-list">
          <Link
            href={UrlBuilder.users(list.user.key).lists(list.slug)}
            color="inherit"
          >
            <div class="lb-popular-list-collage">
              {#each list.posters.slice(0, 5) as poster, i (i)}
                <CrossOriginImage
                  classList="lb-popular-list-poster"
                  src={poster.url.thumb}
                  alt=""
                />
              {/each}
            </div>
          </Link>

          <div class="lb-popular-list-meta">
            <h4 class="lb-popular-list-name">
              <Link
                href={UrlBuilder.users(list.user.key).lists(list.slug)}
                color="inherit"
              >
                {list.name}
              </Link>
            </h4>
            <p class="lb-popular-list-byline">
              <span>
                {m.lb_search_list_byline({
                  user: list.user.name?.full ?? list.user.username ?? "",
                })}
              </span>
              <span class="lb-popular-list-divider" aria-hidden="true">·</span>
              <span>
                {fmtCount(list.count)}
                {m.lb_search_list_count_unit()}
              </span>
              {#if list.likeCount > 0}
                <span class="lb-popular-list-divider" aria-hidden="true">·</span>
                <span class="lb-popular-list-likes">
                  <span class="lb-popular-list-likes-glyph" aria-hidden="true"
                    >♥</span
                  >
                  {fmtCount(list.likeCount)}
                </span>
              {/if}
            </p>
            {#if list.description}
              <p class="lb-popular-list-desc">
                {list.description.slice(0, 240)}{list.description.length > 240
                  ? "…"
                  : ""}
              </p>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-popular-lists {
    padding: var(--ni-22) 0;
    border-top: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }

  .lb-popular-lists-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: var(--ni-12);

    h3 {
      margin: 0;
      font-size: var(--ni-11);
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-text-secondary);
    }
  }

  .lb-popular-lists-all {
    font-size: var(--ni-11);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    font-weight: 700;

    &:hover {
      color: var(--tboxed-positive);
    }
  }

  .lb-popular-lists-stack {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
  }

  .lb-popular-list {
    display: grid;
    grid-template-columns: var(--ni-160) 1fr;
    gap: var(--ni-16);
    padding: var(--ni-18) 0;
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
    align-items: start;

    @include for-tablet-lg {
      grid-template-columns: var(--ni-200) 1fr;
      gap: var(--ni-22);
    }
  }

  .lb-popular-list-collage {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1px;
    width: 100%;
    aspect-ratio: 5 / 3;
    border-radius: var(--border-radius-xs);
    overflow: hidden;
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }

  :global(.lb-popular-list-poster) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .lb-popular-list-meta {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
  }

  .lb-popular-list-name {
    margin: 0;
    font-size: var(--ni-18);
    font-weight: 700;
    color: var(--color-foreground);
    line-height: 1.2;

    @include for-tablet-lg {
      font-size: var(--ni-22);
    }
  }

  .lb-popular-list-byline {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ni-6);
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .lb-popular-list-divider {
    color: color-mix(in srgb, var(--color-foreground) 25%, transparent);
  }

  .lb-popular-list-likes {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-3);
  }

  .lb-popular-list-likes-glyph {
    color: var(--tboxed-positive);
  }

  .lb-popular-list-desc {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground) 80%, transparent);
    font-size: var(--ni-13);
    line-height: 1.5;
  }
</style>
