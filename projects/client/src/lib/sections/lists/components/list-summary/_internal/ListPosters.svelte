<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import { getListUrl } from "./getListUrl.ts";

  const posterLimit = 12;
  const {
    list,
    type,
    source,
    onclick,
  }: {
    list: MediaListSummary;
    type?: DiscoverMode;
    source?: string;
    onclick?: () => void;
  } = $props();

  const posters = $derived(list.posters.slice(0, posterLimit));
  const { track } = useTrack(AnalyticsEvent.Drilldown);
</script>

{#if posters}
  <Link
    href={getListUrl({ type: "user-list", list })}
    onclick={() => {
      onclick?.();
      source && track({ source, type: "list" });
    }}
  >
    <div class="trakt-list-posters" style="--poster-count: {posters.length}">
      {#each posters as poster, index (`${list.id}_poster_${index}`)}
        <div class="poster-wrapper" style="--poster-index: {index}">
          <CrossOriginImage
            src={poster.url.thumb}
            alt={m.image_alt_list_preview_poster({ title: list.name })}
          />
        </div>
      {/each}
    </div>
  </Link>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  /*
    Letterboxd-flavour collage. Each poster slides ~70% behind the
    next (only ~30% of each is visible) so the strip reads as a
    layered shelf of cinema rather than a thumbnail grid. Reference:
    research/notes/popular-lists.md.
  */
  .trakt-list-posters {
    --poster-width: var(--ni-120);
    --poster-height: var(--ni-180);

    /*
      Visible slice per poster after the leftmost. The first poster
      shows in full; every subsequent poster reveals only its right
      ~30%, so total width grows as width + slice * (count - 1).
    */
    --poster-slice: calc(var(--poster-width) * 0.3);

    height: var(--poster-height);
    width: 100%;

    display: flex;
    flex-shrink: 0;

    position: relative;

    counter-reset: number;
  }

  .poster-wrapper {
    --poster-index: 0;

    --total-collage-width: calc(
      var(--poster-width) +
        var(--poster-slice) * max(0, var(--poster-count) - 1)
    );
    --collage-width: min(100%, var(--total-collage-width));
    --poster-offset: calc(
      (var(--collage-width) - var(--poster-width)) /
        max(1, var(--poster-count) - 1)
    );

    position: absolute;
    left: calc(var(--poster-offset) * var(--poster-index));
    /* Later posters layer behind earlier ones — left-anchored stack. */
    z-index: calc(100 - var(--poster-index));

    height: var(--poster-height);
    width: var(--poster-width);

    box-shadow: var(--shadow-floating);
    border-radius: var(--border-radius-s);
    overflow: hidden;

    :global(img) {
      width: 100%;
      height: 100%;
    }
  }
</style>
