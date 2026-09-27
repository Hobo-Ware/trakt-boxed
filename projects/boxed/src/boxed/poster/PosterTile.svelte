<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import Stars from "../components/Stars.svelte";
  import PosterActions from "./_internal/PosterActions.svelte";
  import type { PosterMedia } from "./PosterMedia.ts";
  import { usePosterState } from "./usePosterState.ts";

  const LONG_PRESS_MS = 450;
  const LONG_PRESS_SLOP_PX = 8;

  type PosterTileProps = {
    media: PosterMedia;
    quality?: "thumb" | "medium";
    loading?: "lazy" | "eager";
    showUserMeta?: boolean;
    meta?: Snippet;
  };

  const {
    media,
    quality = "thumb",
    loading = "lazy",
    showUserMeta = false,
    meta,
  }: PosterTileProps = $props();

  const { outline, progress, rating, isLiked } = $derived(
    usePosterState(media),
  );

  let isEngaged = $state(false);
  let isSheetOpen = $state(false);
  let pressTimer: ReturnType<typeof setTimeout> | null = null;
  let pressOrigin: { x: number; y: number } | null = null;
  let didLongPress = false;

  const engage = () => (isEngaged = true);

  const cancelPress = () => {
    if (pressTimer) clearTimeout(pressTimer);
    pressTimer = null;
    pressOrigin = null;
  };

  const startPress = (event: PointerEvent) => {
    if (event.pointerType !== "touch") return;

    didLongPress = false;
    pressOrigin = { x: event.clientX, y: event.clientY };
    pressTimer = setTimeout(() => {
      didLongPress = true;
      isEngaged = true;
      isSheetOpen = true;
    }, LONG_PRESS_MS);
  };

  const trackPress = (event: PointerEvent) => {
    if (!pressOrigin) return;

    const distance = Math.hypot(
      event.clientX - pressOrigin.x,
      event.clientY - pressOrigin.y,
    );
    if (distance > LONG_PRESS_SLOP_PX) cancelPress();
  };

  const swallowClickAfterLongPress = (event: MouseEvent) => {
    if (!didLongPress) return;

    event.preventDefault();
    didLongPress = false;
  };
</script>

<div class="boxed-poster" data-outline={$outline}>
  <div
    class="boxed-poster-frame"
    role="presentation"
    onpointerenter={engage}
    onfocusin={engage}
    onpointerdown={startPress}
    onpointermove={trackPress}
    onpointerup={cancelPress}
    onpointercancel={cancelPress}
    onpointerleave={cancelPress}
    onclickcapture={swallowClickAfterLongPress}
    oncontextmenu={(event) => didLongPress && event.preventDefault()}
  >
    <Link href={UrlBuilder.media(media.type, media.slug)} label={media.title}>
      <CrossOriginImage
        src={media.poster.url[quality]}
        alt={m.image_alt_media_poster({ title: media.title })}
        {loading}
      />
    </Link>

    {#if $progress !== null}
      <span
        class="boxed-poster-progress"
        style:--progress={`${Math.round($progress * 100)}%`}
        aria-hidden="true"
      ></span>
    {/if}

    <RenderFor audience="authenticated">
      {#if isEngaged}
        <div class="boxed-poster-drawer">
          <PosterActions {media} />
        </div>
      {/if}
    </RenderFor>
  </div>

  {#if meta}
    <div class="boxed-poster-meta">{@render meta()}</div>
  {:else if showUserMeta}
    <div class="boxed-poster-meta">
      {#if $rating !== null}
        <Stars rating={$rating} />
      {/if}
      {#if $isLiked}
        <span class="boxed-poster-liked" aria-hidden="true">
          <FavoriteIcon state="filled" />
        </span>
      {/if}
    </div>
  {/if}
</div>

{#if isSheetOpen}
  <Drawer
    title={media.title}
    size="auto"
    onClose={() => (isSheetOpen = false)}
  >
    <PosterActions {media} />
  </Drawer>
{/if}

<style>
  .boxed-poster {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    min-width: 0;
  }

  .boxed-poster-frame {
    position: relative;
    aspect-ratio: 2 / 3;
    width: 100%;

    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: var(--color-card-background);

    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--color-foreground) 12%, transparent);
    transition:
      box-shadow var(--transition-increment) ease,
      transform var(--transition-increment) ease;

    -webkit-touch-callout: none;
    user-select: none;

    :global(.trakt-link) {
      display: block;
      width: 100%;
      height: 100%;
    }

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .boxed-poster[data-outline="watched"] .boxed-poster-frame {
    box-shadow: 0 0 0 var(--border-thickness-xs) var(--boxed-color-watched);
  }

  .boxed-poster[data-outline="watchlist"] .boxed-poster-frame {
    box-shadow: 0 0 0 var(--border-thickness-xs) var(--boxed-color-watchlist);
  }

  .boxed-poster-progress {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: var(--ni-4);

    background: color-mix(in srgb, var(--shade-950) 60%, transparent);
    pointer-events: none;

    &::after {
      content: "";
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      width: var(--progress);
      background: var(--boxed-color-watched);
    }
  }

  .boxed-poster-drawer {
    position: absolute;
    inset-inline: var(--ni-6);
    bottom: var(--ni-10);

    opacity: 0;
    translate: 0 var(--ni-4);
    pointer-events: none;
    transition:
      opacity var(--transition-increment) ease,
      translate var(--transition-increment) ease;
  }

  @media (hover: hover) {
    .boxed-poster-frame:hover {
      transform: translateY(calc(-1 * var(--ni-2)));
    }

    .boxed-poster-frame:hover .boxed-poster-drawer,
    .boxed-poster-frame:focus-within .boxed-poster-drawer {
      opacity: 1;
      translate: 0 0;
      pointer-events: auto;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .boxed-poster-frame,
    .boxed-poster-drawer {
      transition: none;
    }

    .boxed-poster-frame:hover {
      transform: none;
    }
  }

  .boxed-poster-meta {
    height: var(--ni-20);

    display: flex;
    align-items: center;
    gap: var(--gap-xxs);
  }

  .boxed-poster-liked {
    display: flex;
    color: var(--boxed-color-liked-text);

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }
  }
</style>
