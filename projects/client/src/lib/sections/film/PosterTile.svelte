<script lang="ts">
  import { goto } from '$app/navigation';
  import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
  import * as m from '$lib/features/i18n/messages.ts';
  import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
  import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
  import { useFavorites } from '$lib/sections/media-actions/favorite/useFavorites.ts';
  import { useIsWatched } from '$lib/sections/media-actions/mark-as-watched/useIsWatched.ts';
  import { useMarkAsWatched } from '$lib/sections/media-actions/mark-as-watched/useMarkAsWatched.ts';
  import { useWatchlist } from '$lib/sections/media-actions/watchlist/useWatchlist.ts';
  import { useRatings } from '$lib/sections/summary/components/rating/useRatings.ts';
  import { useIsWatchlisted } from '$lib/stores/useIsWatchlisted.ts';
  import { hasAired } from '$lib/utils/media/hasAired.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
  import { map } from 'rxjs';

  type Props = {
    entry: MovieEntry | ShowEntry;
    showTitle?: boolean;
  };

  const { entry, showTitle = false }: Props = $props();

  const { isAuthorized } = useAuth();

  const href = $derived(
    entry.type === 'movie' ? UrlBuilder.movie(entry.slug) : UrlBuilder.show(entry.slug),
  );
  const reviewsHref = $derived(`${href}/reviews`);
  const listsHref = $derived(`${href}/lists`);
  const signInHref = '/silent-redirect';
  const activityHref = $derived(`/profile/me/history?slug=${entry.slug}`);

  const isReleased = $derived(
    hasAired({
      type: entry.type,
      effectiveReleaseDate: entry.effectiveReleaseDate,
      status: entry.status,
    }),
  );

  const watchedStores = $derived.by(() => {
    if (entry.type === 'movie') {
      return useIsWatched({ type: 'movie', media: { id: entry.id } });
    }
    const show = entry as ShowEntry;
    const episodeCount = show.episode?.count ?? 0;
    return useIsWatched({
      type: 'show',
      media: { id: show.id, episode: { count: episodeCount } },
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

  const markAction = $derived(
    useMarkAsWatched({
      type: entry.type,
      media: {
        id: entry.id,
        effectiveReleaseDate: entry.effectiveReleaseDate,
        status: entry.status,
      },
    }),
  );
  const watchlistAction = $derived(
    useWatchlist({ type: entry.type, media: { id: entry.id } }),
  );
  const favoriteAction = $derived(
    useFavorites({ type: entry.type, id: entry.id, title: entry.title }),
  );
  const ratingAction = $derived(useRatings({ type: entry.type, id: entry.id }));
  const isLikedStore = $derived(favoriteAction.isFavorited);
  const userRatingStore = $derived(
    ratingAction.current.pipe(map(($cur) => $cur?.rating ?? null)),
  );

  let hoverRating = $state<number | null>(null);
  const displayRating = $derived(hoverRating ?? $userRatingStore ?? 0);

  let isDropdownOpen = $state(false);
  let rootElement = $state<HTMLDivElement | null>(null);

  $effect(() => {
    if (!isDropdownOpen) return;
    const handler = (event: MouseEvent) => {
      if (!rootElement) return;
      if (!rootElement.contains(event.target as Node)) {
        isDropdownOpen = false;
      }
    };
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') isDropdownOpen = false;
    };
    globalThis.window?.addEventListener('mousedown', handler);
    globalThis.window?.addEventListener('keydown', keyHandler);
    return () => {
      globalThis.window?.removeEventListener('mousedown', handler);
      globalThis.window?.removeEventListener('keydown', keyHandler);
    };
  });

  const requireAuth = (run: () => Promise<void> | void) => () => {
    if (!$isAuthorized) {
      void goto(signInHref);
      return;
    }
    void run();
  };

  const onToggleWatched = requireAuth(async () => {
    if (!isReleased) return;
    if ($isWatched) await markAction.removeWatched();
    else await markAction.markAsWatched('now');
  });

  const onToggleLike = requireAuth(async () => {
    if (!$isWatched) return;
    if ($isLikedStore) await favoriteAction.removeFromFavorites();
    else await favoriteAction.addToFavorites();
  });

  const onToggleWatchlist = requireAuth(async () => {
    if ($isWatchlisted) await watchlistAction.removeFromWatchlist();
    else await watchlistAction.addToWatchlist();
  });

  const onRate = (value: number) =>
    requireAuth(() => {
      if (!$isWatched) return;
      const current = $userRatingStore ?? 0;
      if (current === value) {
        void ratingAction.removeRating();
      } else {
        ratingAction.addRating(value);
      }
    })();

  // Touch long-press routes to detail.
  let pressTimer: ReturnType<typeof setTimeout> | null = $state(null);
  let didLongPress = $state(false);
  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') return;
    didLongPress = false;
    pressTimer = setTimeout(() => {
      didLongPress = true;
      void goto(href);
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
    }
  };

  const year = $derived(entry.year ?? '');
  const watchDisabledReason = $derived(
    !isReleased ? m.poster_disabled_unreleased() : null,
  );
  const rateDisabledReason = $derived(
    !$isWatched ? m.poster_disabled_unwatched() : null,
  );
</script>

<div
  class="poster-tile"
  data-status={status}
  data-dropdown-open={isDropdownOpen ? 'true' : undefined}
  bind:this={rootElement}
>
  <div class="poster-tile__media">
    <span class="poster-tile__tooltip" aria-hidden="true">
      {entry.title}{#if year} <span>({year})</span>{/if}
    </span>

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

    <div class="poster-tile__quickbar">
    <button
      type="button"
      class="poster-tile__icon-btn"
      data-active={$isWatched ? 'true' : undefined}
      disabled={watchDisabledReason != null}
      title={watchDisabledReason ?? ($isWatched ? m.poster_menu_unwatch() : m.poster_menu_watched())}
      aria-label={$isWatched ? m.poster_menu_unwatch() : m.poster_menu_watched()}
      onclick={onToggleWatched}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
    <button
      type="button"
      class="poster-tile__icon-btn poster-tile__icon-btn--watchlist"
      data-active={$isWatchlisted ? 'true' : undefined}
      title={$isWatchlisted ? m.poster_menu_remove_watchlist() : m.poster_menu_add_watchlist()}
      aria-label={$isWatchlisted ? m.poster_menu_remove_watchlist() : m.poster_menu_add_watchlist()}
      onclick={onToggleWatchlist}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        {#if $isWatchlisted}
          <path d="M8 12l3 3 5-6" />
        {:else}
          <path d="M12 7v5l3 2" />
        {/if}
      </svg>
    </button>
    <button
      type="button"
      class="poster-tile__icon-btn poster-tile__icon-btn--more"
      aria-haspopup="menu"
      aria-expanded={isDropdownOpen}
      aria-label={m.poster_menu_more()}
      title={m.poster_menu_more()}
      onclick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        isDropdownOpen = !isDropdownOpen;
      }}
    >⋯</button>
  </div>

  {#if isDropdownOpen}
    <div
      class="poster-tile__dropdown"
      role="menu"
      aria-label={entry.title}
      onmouseleave={() => (hoverRating = null)}
    >
      <div
        class="poster-tile__stars"
        role="radiogroup"
        aria-label={m.poster_action_rate()}
        aria-disabled={rateDisabledReason != null}
        title={rateDisabledReason ?? undefined}
      >
        {#each Array.from({ length: 5 }) as _, i (i)}
          {@const lowValue = i * 2 + 1}
          {@const highValue = i * 2 + 2}
          {@const fill = displayRating / 2 - i}
          {@const state = fill >= 1 ? 'full' : fill >= 0.5 ? 'half' : 'empty'}
          <span class="poster-tile__star-cell">
            <button
              type="button"
              class="poster-tile__star-half poster-tile__star-half--low"
              aria-label={`${lowValue}/10`}
              aria-checked={$userRatingStore === lowValue}
              role="radio"
              disabled={rateDisabledReason != null}
              onmouseenter={() => (hoverRating = lowValue)}
              onclick={() => onRate(lowValue)}
            ></button>
            <button
              type="button"
              class="poster-tile__star-half poster-tile__star-half--high"
              aria-label={`${highValue}/10`}
              aria-checked={$userRatingStore === highValue}
              role="radio"
              disabled={rateDisabledReason != null}
              onmouseenter={() => (hoverRating = highValue)}
              onclick={() => onRate(highValue)}
            ></button>
            <span class="poster-tile__star-glyph" data-state={state} aria-hidden="true">★</span>
          </span>
        {/each}
      </div>

      {#if rateDisabledReason}
        <p class="poster-tile__hint">{rateDisabledReason}</p>
      {/if}

      <a class="poster-tile__menu-item" href={activityHref} role="menuitem">
        {m.poster_menu_show_activity()}
      </a>
      <a class="poster-tile__menu-item" href={reviewsHref} role="menuitem">
        {m.poster_menu_review()}
      </a>
      <button
        type="button"
        class="poster-tile__menu-item"
        role="menuitem"
        onclick={onToggleWatchlist}
      >
        {$isWatchlisted ? m.poster_menu_remove_watchlist() : m.poster_menu_add_watchlist()}
      </button>
      <a class="poster-tile__menu-item" href={listsHref} role="menuitem">
        {m.poster_menu_lists_add()}
      </a>
      <a class="poster-tile__menu-item" href={listsHref} role="menuitem">
        {m.poster_menu_lists()}
      </a>
      <a class="poster-tile__menu-item" href={href} role="menuitem">
        {m.poster_menu_where_to_watch()}
      </a>
      <button
        type="button"
        class="poster-tile__menu-item poster-tile__menu-item--toggle"
        role="menuitem"
        disabled={!$isWatched}
        title={!$isWatched ? m.poster_disabled_unwatched() : undefined}
        onclick={onToggleLike}
      >
        {$isLikedStore ? m.poster_menu_unlike() : m.poster_menu_like()}
      </button>
    </div>
  {/if}
  </div>

  {#if showTitle}
    <a class="poster-tile__title" {href}>{entry.title}</a>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .poster-tile {
    display: flex;
    flex-direction: column;
    gap: 6px;

    &__media {
      position: relative;
    }

    &__tooltip {
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translate(-50%, -100%);
      padding: 4px 8px;
      background: color-mix(in srgb, var(--shade-900) 95%, transparent);
      border: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
      border-radius: 3px;
      font-size: 0.72rem;
      color: var(--color-text-primary);
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 140ms ease;
      z-index: 4;

      span { color: var(--color-text-secondary); }
    }

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
      min-height: 1.25em;
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

    /* Quickbar overlay: pinned to bottom-left of poster, hidden by default */
    &__quickbar {
      position: absolute;
      left: 6px;
      bottom: 6px;
      display: flex;
      gap: 4px;
      padding: 3px 5px;
      border-radius: 3px;
      background: color-mix(in srgb, var(--shade-1000) 60%, transparent);
      backdrop-filter: blur(8px);
      border: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
      opacity: 0;
      pointer-events: none;
      transition: opacity 140ms ease;
      z-index: 3;
    }

    &__icon-btn {
      all: unset;
      cursor: pointer;
      width: 22px;
      height: 22px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-secondary);
      border-radius: 2px;

      &:hover { color: var(--color-text-primary); }
      &[disabled] {
        cursor: not-allowed;
        opacity: 0.35;
      }

      &[data-active="true"] { color: var(--color-watched); }
      &--watchlist[data-active="true"] { color: var(--color-watchlist); }
      &--more { font-size: 0.95rem; }
    }

    @include for-mouse {
      &:hover .poster-tile__tooltip,
      &:focus-within .poster-tile__tooltip {
        opacity: 1;
      }
      &:hover .poster-tile__quickbar,
      &:focus-within .poster-tile__quickbar,
      &[data-dropdown-open="true"] .poster-tile__quickbar {
        opacity: 1;
        pointer-events: auto;
      }
      &:hover .poster-tile__frame,
      &:focus-within .poster-tile__frame {
        transform: translateY(-1px);
      }
    }

    /* Dropdown menu opens via ⋯ click */
    &__dropdown {
      position: absolute;
      left: 50%;
      bottom: -8px;
      transform: translate(-50%, 100%);
      width: max-content;
      min-width: 200px;
      display: flex;
      flex-direction: column;
      padding: 6px;
      gap: 1px;
      border-radius: 4px;
      background: color-mix(in srgb, var(--shade-900) 96%, transparent);
      backdrop-filter: blur(10px);
      border: 1px solid color-mix(in srgb, var(--shade-10) 10%, transparent);
      box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.7);
      z-index: 10;
    }

    &__stars {
      display: flex;
      justify-content: center;
      gap: 2px;
      padding: 4px 0;
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
      margin-bottom: 4px;

      &[aria-disabled="true"] {
        opacity: 0.45;
        cursor: not-allowed;
      }
    }

    &__star-cell {
      position: relative;
      width: 18px;
      height: 18px;
      display: inline-block;
    }

    &__star-half {
      all: unset;
      cursor: pointer;
      position: absolute;
      top: 0;
      bottom: 0;
      width: 50%;
      z-index: 2;

      &--low { left: 0; }
      &--high { right: 0; }

      &[disabled] {
        cursor: not-allowed;
      }
    }

    &__star-glyph {
      position: absolute;
      inset: 0;
      font-size: 1.1rem;
      line-height: 1;
      pointer-events: none;
      color: color-mix(in srgb, var(--shade-10) 18%, transparent);

      &[data-state="full"] { color: var(--color-rating-star); }
      &[data-state="half"] {
        background: linear-gradient(
          90deg,
          var(--color-rating-star) 50%,
          color-mix(in srgb, var(--shade-10) 18%, transparent) 50%
        );
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    &__hint {
      margin: 0 0 4px;
      padding: 0 8px;
      font-size: 0.7rem;
      color: var(--color-text-secondary);
      text-align: center;
    }

    &__menu-item {
      all: unset;
      cursor: pointer;
      padding: 6px 10px;
      font-size: 0.8rem;
      color: var(--color-text-primary);
      text-decoration: none;
      border-radius: 2px;
      display: block;
      text-align: left;

      &:hover {
        background: color-mix(in srgb, var(--shade-10) 6%, transparent);
      }

      &[disabled] {
        opacity: 0.45;
        cursor: not-allowed;
      }
    }

    @include for-touch {
      &__quickbar,
      &__tooltip,
      &__dropdown { display: none; }
    }

    @include for-mobile {
      &__quickbar,
      &__tooltip,
      &__dropdown { display: none; }
    }
  }
</style>
