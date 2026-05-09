<script lang="ts">
  /*
    Letterboxd's numbered list grid. Each cell shows the poster with
    a small rank number overlaid bottom-left — the editorial signal
    that says "this list is ranked, position matters". Reference:
    research/notes/single-list.md and the single-list-mobile.png /
    single-list-desktop.png screenshots.

    Generic over ListItem so the same grid renders movies, shows,
    seasons, and episodes in any official or user list.
  */
  import Link from "$lib/components/link/Link.svelte";
  import type { ListItem } from "$lib/requests/models/ListItem";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport";
  import { MEDIA_POSTER_PLACEHOLDER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type LetterboxdListGridProps = {
    items: ReadonlyArray<ListItem>;
    hasNextPage?: boolean;
    onLoadMore?: () => void | Promise<void>;
    /* When true, omits the rank number overlay (use for unranked
       lists like the watchlist). */
    unranked?: boolean;
  };

  const {
    items,
    hasNextPage = false,
    onLoadMore,
    unranked = false,
  }: LetterboxdListGridProps = $props();

  function toCellMeta(item: ListItem): {
    id: string;
    title: string;
    poster: string;
    href: string;
  } {
    if (item.type === "movie") {
      return {
        id: `movie-${item.entry.id}`,
        title: item.entry.title,
        poster: item.entry.poster?.url?.thumb ?? MEDIA_POSTER_PLACEHOLDER,
        href: UrlBuilder.movie(item.entry.slug),
      };
    }
    if (item.type === "show") {
      return {
        id: `show-${item.entry.id}`,
        title: item.entry.title,
        poster: item.entry.poster?.url?.thumb ?? MEDIA_POSTER_PLACEHOLDER,
        href: UrlBuilder.show(item.entry.slug),
      };
    }
    if (item.type === "season") {
      return {
        id: `season-${item.entry.show.id}-${item.entry.season.number}`,
        title: `${item.entry.show.title} · S${item.entry.season.number}`,
        poster: item.entry.show.poster?.url?.thumb ?? MEDIA_POSTER_PLACEHOLDER,
        href: UrlBuilder.show(item.entry.show.slug, {
          season: item.entry.season.number,
        }),
      };
    }
    return {
      id: `episode-${item.entry.show.id}-${item.entry.episode.id}`,
      title: `${item.entry.show.title} · S${item.entry.episode.season} E${item.entry.episode.number}`,
      poster: item.entry.show.poster?.url?.thumb ?? MEDIA_POSTER_PLACEHOLDER,
      href: UrlBuilder.episode(
        item.entry.show.slug,
        item.entry.episode.season,
        item.entry.episode.number,
      ),
    };
  }

  const cells = $derived(
    items.map((item, index) => ({
      ...toCellMeta(item),
      rank: index + 1,
    })),
  );

  const triggerLoadMore = () => {
    if (hasNextPage) onLoadMore?.();
  };
</script>

<div class="lb-list-grid">
  {#each cells as cell (cell.id)}
    <Link href={cell.href} color="inherit">
      <article class="lb-list-grid-cell">
        <img
          class="lb-list-grid-poster"
          src={cell.poster}
          alt={cell.title}
          loading="lazy"
        />
        {#if !unranked}
          <span class="lb-list-grid-rank">{cell.rank}</span>
        {/if}
      </article>
    </Link>
  {/each}

  {#if hasNextPage}
    <div class="lb-list-grid-sentinel" use:whenInViewport={triggerLoadMore}></div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-list-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--ni-12);

    width: 100%;
    max-width: var(--ni-1280);
    margin-inline: auto;
    padding: var(--ni-22) var(--ni-16);
    box-sizing: border-box;

    @include for-tablet-sm {
      grid-template-columns: repeat(5, 1fr);
    }

    @include for-tablet-lg {
      grid-template-columns: repeat(6, 1fr);
    }

    @include for-desktop {
      grid-template-columns: repeat(7, 1fr);
    }

    :global(.trakt-link) {
      text-decoration: none;
      display: block;
    }
  }

  .lb-list-grid-cell {
    position: relative;
    overflow: hidden;
    border-radius: var(--border-radius-xs);
    aspect-ratio: 2 / 3;

    transition: transform var(--transition-increment) ease-in-out,
      box-shadow var(--transition-increment) ease-in-out;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 var(--ni-6) var(--ni-18)
        color-mix(in srgb, var(--shade-1000) 60%, transparent);
    }
  }

  .lb-list-grid-poster {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .lb-list-grid-rank {
    position: absolute;
    left: var(--ni-4);
    bottom: var(--ni-4);

    padding: var(--ni-2) var(--ni-6);
    border-radius: var(--border-radius-xs);

    background: color-mix(in srgb, var(--shade-1000) 80%, transparent);
    color: var(--color-foreground);
    font-size: var(--ni-11);
    font-weight: 700;
    font-feature-settings: "tnum";
    line-height: 1;
  }

  .lb-list-grid-sentinel {
    grid-column: 1 / -1;
    height: var(--ni-44);
  }
</style>
