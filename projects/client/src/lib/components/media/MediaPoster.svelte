<script lang="ts">
  /*
    Poster art with the 3-state personal-status outline (watched /
    watchlist / none). Outline is encoded via .summary-poster-state on
    the parent and a data-state attribute, so it does not consume
    layout space. The underlying image is a CrossOriginImage so the
    Cloudflare image transform path stays in place.
  */
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMediaWatchState } from "./useMediaWatchState";

  type MediaPosterProps = {
    src: string;
    alt: string;
    href?: string | Nil;
    /* Pass id + type to opt into the watched/watchlist outline. */
    media?: { id: number; type: MediaType };
  };

  const { src, alt, href, media }: MediaPosterProps = $props();

  const { state: watchState } = $derived(
    media
      ? useMediaWatchState({ type: media.type, id: media.id })
      : { state: undefined },
  );

  const dataState = $derived($watchState ?? "none");
</script>

<div class="summary-poster-state" data-state={dataState}>
  <Link {href}>
    <CrossOriginImage classList="trakt-media-poster-img" {src} {alt} />
  </Link>
</div>

<style>
  .summary-poster-state {
    width: 100%;
    aspect-ratio: 2 / 3;
    overflow: hidden;
  }

  :global(.trakt-media-poster-img) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
