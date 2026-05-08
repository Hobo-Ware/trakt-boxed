<script lang="ts" generics="T extends { id: number; type: 'movie' | 'show'; slug: string; title: string; poster: { url: { thumb?: string | undefined } } }">
  /*
    Letterboxd-flavour poster grid. The page is the posters — no
    titles, no captions, no metadata badges. Reference:
    research/notes/popular-films.md ("there is *no other type on this
    page* — the posters carry the entire content load").

    4-up on mobile, 6-up on tablet, 8-up on desktop. Each cell is a
    MediaPoster (with the watched/watchlist outline baked in) wrapped
    in a tap target to /movies/<slug> or /shows/<slug>.

    Generic over the entry shape so callers can pass MovieEntry,
    ShowEntry, or the union — only id/type/slug/title/poster.thumb
    are required.
  */
  import MediaPoster from "$lib/components/media/MediaPoster.svelte";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type FilmsPosterGridProps = {
    items: ReadonlyArray<T>;
    hasNextPage?: boolean;
    onLoadMore?: () => void | Promise<void>;
  };

  const {
    items,
    hasNextPage = false,
    onLoadMore,
  }: FilmsPosterGridProps = $props();

  const triggerLoadMore = () => {
    if (hasNextPage) onLoadMore?.();
  };
</script>

<div class="trakt-films-grid">
  {#each items as item (item.id)}
    <MediaPoster
      src={item.poster.url.thumb ?? ""}
      alt={item.title}
      href={UrlBuilder.media(item.type, item.slug)}
      media={{ id: item.id, type: item.type }}
    />
  {/each}

  {#if hasNextPage}
    <div class="trakt-films-grid-sentinel" use:whenInViewport={triggerLoadMore}>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-films-grid {
    display: grid;
    /*
      4-up mobile by default. The gap mirrors Letterboxd's 16px
      gutter — the only design "decision" the page makes is poster
      placement; everything else is calm.
    */
    grid-template-columns: repeat(4, 1fr);
    gap: var(--ni-12);

    width: 100%;
    padding: var(--gap-m) var(--layout-distance-side);
    box-sizing: border-box;

    @include for-tablet-sm {
      grid-template-columns: repeat(5, 1fr);
    }

    @include for-tablet-lg {
      grid-template-columns: repeat(6, 1fr);
    }

    @include for-desktop {
      grid-template-columns: repeat(7, 1fr);
      max-width: var(--ni-1280);
      margin-inline: auto;
    }
  }

  .trakt-films-grid-sentinel {
    grid-column: 1 / -1;
    height: var(--ni-44);
  }
</style>
