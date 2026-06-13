<script lang="ts">
  import { composerStore } from '$lib/sections/composer';
  import { useIsWatched } from '$lib/sections/media-actions/mark-as-watched/useIsWatched.ts';
  import { useIsWatchlisted } from '$lib/stores/useIsWatchlisted.ts';
  import * as m from '$lib/features/i18n/messages.ts';
  import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
  import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
  import { goto } from '$app/navigation';

  type Props = {
    entry: MovieEntry | ShowEntry;
    showTitle?: boolean;
  };

  const { entry, showTitle = false }: Props = $props();

  const href = $derived(
    entry.type === 'movie' ? UrlBuilder.movie(entry.slug) : UrlBuilder.show(entry.slug),
  );

  const watchedStores = $derived.by(() => {
    if (entry.type === 'movie') {
      return useIsWatched({ type: 'movie', media: { id: entry.id } });
    }
    // ShowEntry includes episode.count when full,images included
    const show = entry as ShowEntry;
    const episodeCount = show.episode?.count ?? 0;
    return useIsWatched({
      type: 'show',
      media: {
        id: show.id,
        episode: { count: episodeCount },
      },
    });
  });

  const isWatched = $derived(watchedStores.isWatched);

  const watchlistedStores = $derived(
    useIsWatchlisted({ type: entry.type, media: { id: entry.id } }),
  );
  const isWatchlisted = $derived(watchlistedStores.isWatchlisted);

  const status = $derived.by(() => {
    if ($isWatched) return 'watched';
    if ($isWatchlisted) return 'watchlist';
    return 'default';
  });

  const open = () => {
    composerStore.open({
      kind: entry.type,
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      year: entry.year,
      posterUrl: entry.poster?.url?.thumb,
      effectiveReleaseDate: entry.effectiveReleaseDate,
    });
  };

  // Long-press detection on touch devices: hold ≥ 450ms opens the composer
  // and suppresses the navigation click; a short tap still routes to detail.
  let pressTimer: ReturnType<typeof setTimeout> | null = $state(null);
  let didLongPress = $state(false);

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') return;
    didLongPress = false;
    pressTimer = setTimeout(() => {
      didLongPress = true;
      open();
      pressTimer = null;
    }, 450);
  };

  const clearPress = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  };

  const onClick = (event: MouseEvent) => {
    if (didLongPress) {
      event.preventDefault();
      didLongPress = false;
      return;
    }
  };

  const openAction = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    open();
  };

  const navigateDetail = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    void goto(href);
  };
</script>

<div class="poster-tile" data-status={status}>
  <a
    class="poster-tile__link"
    {href}
    aria-label={entry.title}
    onclick={onClick}
    onpointerdown={onPointerDown}
    onpointerup={clearPress}
    onpointerleave={clearPress}
    onpointercancel={clearPress}
  >
    <div class="poster-tile__frame">
      {#if entry.poster?.url?.thumb}
        <img
          class="poster-tile__image"
          src={entry.poster.url.thumb}
          alt={entry.title}
          loading="lazy"
        />
      {:else}
        <div class="poster-tile__placeholder" aria-hidden="true">
          <span>{entry.title}</span>
        </div>
      {/if}
    </div>
  </a>

  <div class="poster-tile__drawer" aria-hidden="true">
    <button
      type="button"
      class="poster-tile__action"
      aria-label={m.poster_action_rate()}
      onclick={openAction}
    >★</button>
    <button
      type="button"
      class="poster-tile__action poster-tile__action--like"
      aria-label={m.poster_action_like()}
      onclick={openAction}
    >♥</button>
    <button
      type="button"
      class="poster-tile__action"
      aria-label={m.poster_action_watchlist()}
      onclick={openAction}
    >+</button>
    <button
      type="button"
      class="poster-tile__action"
      aria-label={m.poster_action_review()}
      onclick={openAction}
    >✎</button>
    <button
      type="button"
      class="poster-tile__action"
      aria-label={m.poster_action_lists()}
      onclick={navigateDetail}
    >≡</button>
  </div>

  {#if showTitle}
    <a class="poster-tile__title" {href}>{entry.title}</a>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .poster-tile {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;

    &__link {
      display: block;
      text-decoration: none;
      color: inherit;
      border-radius: 3px;
    }

    &__frame {
      position: relative;
      aspect-ratio: 2 / 3;
      border-radius: 3px;
      overflow: hidden;
      background: var(--shade-900);
      box-shadow: 0 8px 18px -10px rgba(0, 0, 0, 0.55);
      transition: transform 140ms ease, box-shadow 140ms ease;
    }

    &__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    &__placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--gap-s);
      font-family: var(--font-family-serif, Georgia, serif);
      color: var(--color-text-secondary);
      text-align: center;
      font-size: 0.85rem;
    }

    &__title {
      font-size: 0.8rem;
      color: var(--color-text-primary);
      line-height: 1.25;
      text-align: center;
      text-decoration: none;
      min-height: 1.25em; // reserves line-height before text resolves
    }

    /* 3-state outline */
    &[data-status="default"] .poster-tile__frame {
      box-shadow:
        0 0 0 1px var(--color-poster-outline-default) inset,
        0 8px 18px -10px rgba(0, 0, 0, 0.55);
    }

    &[data-status="watchlist"] .poster-tile__frame {
      box-shadow:
        0 0 0 2px var(--color-poster-outline-watchlist) inset,
        0 8px 18px -10px rgba(0, 0, 0, 0.55);
    }

    &[data-status="watched"] .poster-tile__frame {
      box-shadow:
        0 0 0 2px var(--color-poster-outline-watched) inset,
        0 8px 18px -10px rgba(0, 0, 0, 0.55);
    }

    /* Hover lift + green focus outline */
    @include for-mouse {
      &__link:hover .poster-tile__frame,
      &__link:focus-visible .poster-tile__frame {
        transform: translateY(-1px);
      }

      &__link:hover ~ .poster-tile__drawer,
      &__link:focus-visible ~ .poster-tile__drawer,
      &__drawer:hover,
      &__drawer:focus-within {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }
    }

    &__drawer {
      position: absolute;
      inset: auto 4px 4px 4px;
      display: flex;
      justify-content: center;
      gap: 2px;
      padding: 4px 6px;
      border-radius: 3px;
      background: color-mix(in srgb, var(--shade-1000) 80%, transparent);
      backdrop-filter: blur(8px);
      border: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
      opacity: 0;
      pointer-events: none;
      transform: translateY(4px);
      transition: opacity 140ms ease, transform 140ms ease;
      z-index: 2;
    }

    &__action {
      all: unset;
      cursor: pointer;
      width: 22px;
      height: 22px;
      font-size: 0.85rem;
      line-height: 1;
      text-align: center;
      color: var(--color-text-secondary);
      border-radius: 2px;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      &:hover { color: var(--color-text-primary); background: color-mix(in srgb, var(--shade-10) 6%, transparent); }
      &--like:hover { color: var(--color-like-active); }
    }

    @include for-touch {
      // Hide hover drawer on touch viewports; long-press opens the composer.
      &__drawer { display: none; }
    }

    @include for-mobile {
      &__drawer { display: none; }
    }
  }
</style>
