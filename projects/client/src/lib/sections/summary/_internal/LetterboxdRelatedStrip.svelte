<script lang="ts">
  /*
    Flat poster strip for "Related films" / "Related shows".
    3-up mobile, 6-up desktop, no horizontal scroller — the
    Letterboxd treatment is a flush row of small posters with a
    drilldown link to /related. Hits movieRelatedQuery /
    showRelatedQuery directly.
  */
  import * as m from "$lib/features/i18n/messages.ts";
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useInfiniteQuery } from "$lib/features/query/useQuery.ts";
  import { movieRelatedQuery } from "$lib/requests/queries/movies/movieRelatedQuery.ts";
  import { showRelatedQuery } from "$lib/requests/queries/shows/showRelatedQuery.ts";
  import { MEDIA_POSTER_PLACEHOLDER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { map } from "rxjs";

  type LetterboxdRelatedStripProps = {
    type: "movie" | "show";
    slug: string;
    title?: string;
  };

  type RelatedEntry = {
    id: number;
    title: string;
    slug: string;
    poster?: { url?: { thumb?: string | null } | null };
  };

  const props: LetterboxdRelatedStripProps = $props();

  const query =
    props.type === "movie"
      ? movieRelatedQuery({ slug: props.slug, limit: 12 })
      : showRelatedQuery({ slug: props.slug, limit: 12 });

  // svelte-ignore type-instance-misuse
  const related = useInfiniteQuery(query as never).pipe(
    map(
      (q) =>
        (q.data?.pages?.flatMap((p) => p.entries) ?? []) as RelatedEntry[],
    ),
  );

  const drilldownHref = $derived(
    props.type === "movie"
      ? UrlBuilder.related.movie(props.slug)
      : UrlBuilder.related.show(props.slug),
  );

  const heading = $derived(
    props.title ??
      (props.type === "movie"
        ? m.lb_section_related_films()
        : m.lb_section_related_shows()),
  );

  const itemHref = (slug: string) =>
    props.type === "movie" ? UrlBuilder.movie(slug) : UrlBuilder.show(slug);
</script>

{#if $related.length > 0}
  <section class="lb-related">
    <header class="lb-related-head">
      <h3>{heading}</h3>
      <Link href={drilldownHref} color="inherit">
        <span class="lb-related-all">{m.lb_section_view_all()}</span>
      </Link>
    </header>
    <ul class="lb-related-grid">
      {#each $related.slice(0, 12) as entry (entry.id)}
        <li class="lb-related-cell">
          <Link href={itemHref(entry.slug)} color="inherit">
            <CrossOriginImage
              classList="lb-related-poster"
              src={entry.poster?.url?.thumb ?? MEDIA_POSTER_PLACEHOLDER}
              alt={entry.title}
            />
            <p class="lb-related-cap">{entry.title}</p>
          </Link>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-related {
    padding: var(--ni-22) 0;
    border-top: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }

  .lb-related-head {
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

  .lb-related-all {
    font-size: var(--ni-11);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    font-weight: 700;

    &:hover {
      color: var(--tboxed-positive);
    }
  }

  .lb-related-grid {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--ni-12);

    @include for-tablet-sm {
      grid-template-columns: repeat(4, 1fr);
    }

    @include for-tablet-lg {
      grid-template-columns: repeat(6, 1fr);
    }
  }

  .lb-related-cell {
    min-width: 0;
  }

  :global(.lb-related-poster) {
    display: block;
    width: 100%;
    aspect-ratio: 2 / 3;
    object-fit: cover;
    border-radius: var(--border-radius-xs);
  }

  .lb-related-cap {
    margin: var(--ni-6) 0 0 0;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
