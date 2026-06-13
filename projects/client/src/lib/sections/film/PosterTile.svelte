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

  const watchedAction = $derived.by(() => {
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
  const isWatched = $derived(watchedAction.isWatched);

  const watchlistedAction = $derived(
    useIsWatchlisted({ type: entry.type, media: { id: entry.id } }),
  );
  const isWatchlisted = $derived(watchlistedAction.isWatchlisted);

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

  const requireAuth = (run: () => Promise<void> | void) => () => {
    if (!$isAuthorized) {
      void goto(signInHref);
      return;
    }
    void run();
  };

  const onToggleWatched = requireAuth(async () => {
    if ($isWatched) await markAction.removeWatched();
    else await markAction.markAsWatched('now');
  });

  const onToggleLike = requireAuth(async () => {
    if ($isLikedStore) await favoriteAction.removeFromFavorites();
    else await favoriteAction.addToFavorites();
  });

  const onToggleWatchlist = requireAuth(async () => {
    if ($isWatchlisted) await watchlistAction.removeFromWatchlist();
    else await watchlistAction.addToWatchlist();
  });

  const onRate = (value: number) =>
    requireAuth(() => {
      const current = $userRatingStore ?? 0;
      if (current === value) {
        void ratingAction.removeRating();
      } else {
        ratingAction.addRating(value);
      }
    })();

  // Long-press detection on touch devices: hold ≥ 450ms routes to detail
  // and suppresses the navigation click; a short tap still routes too.
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

  <div
    class="poster-tile__popover"
    role="group"
    aria-label={entry.title}
    onmouseleave={() => (hoverRating = null)}
  >
    <div
      class="poster-tile__stars"
      role="radiogroup"
      aria-label={m.poster_action_rate()}
    >
      {#each Array.from({ length: 5 }) as _, i (i)}
        {@const lowValue = i * 2 + 1}
        {@const highValue = i * 2 + 2}
        {@const fill = displayRating / 2 - i}
        {@const state = fill >= 1 ? "full" : fill >= 0.5 ? "half" : "empty"}
        <span class="poster-tile__star-cell">
          <button
            type="button"
            class="poster-tile__star-half poster-tile__star-half--low"
            aria-label={`${lowValue}/10`}
            aria-checked={$userRatingStore === lowValue}
            role="radio"
            onmouseenter={() => (hoverRating = lowValue)}
            onclick={() => onRate(lowValue)}
          ></button>
          <button
            type="button"
            class="poster-tile__star-half poster-tile__star-half--high"
            aria-label={`${highValue}/10`}
            aria-checked={$userRatingStore === highValue}
            role="radio"
            onmouseenter={() => (hoverRating = highValue)}
            onclick={() => onRate(highValue)}
          ></button>
          <span class="poster-tile__star-glyph" data-state={state} aria-hidden="true">★</span>
        </span>
      {/each}
    </div>

    <button
      type="button"
      class="poster-tile__menu-item"
      onclick={onToggleWatched}
    >
      {$isWatched ? m.poster_menu_unwatch() : m.poster_menu_watched()}
    </button>
    <button
      type="button"
      class="poster-tile__menu-item"
      onclick={onToggleLike}
    >
      {$isLikedStore ? m.poster_menu_unlike() : m.poster_menu_like()}
    </button>
    <button
      type="button"
      class="poster-tile__menu-item"
      onclick={onToggleWatchlist}
    >
      {$isWatchlisted ? m.poster_menu_remove_watchlist() : m.poster_menu_add_watchlist()}
    </button>
    <a class="poster-tile__menu-item" href={reviewsHref}>
      {m.poster_menu_review()}
    </a>
    <a class="poster-tile__menu-item" href={listsHref}>
      {m.poster_menu_lists()}
    </a>
    <a class="poster-tile__menu-item" href={href}>
      {m.poster_menu_where_to_watch()}
    </a>
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

    /* Hover lift + reveal popover */
    @include for-mouse {
      &__link:hover .poster-tile__frame,
      &__link:focus-visible .poster-tile__frame {
        transform: translateY(-1px);
      }

      &__link:hover ~ .poster-tile__popover,
      &__link:focus-visible ~ .poster-tile__popover,
      &__popover:hover,
      &__popover:focus-within {
        opacity: 1;
        pointer-events: auto;
        transform: translate(-50%, 0);
      }
    }

    &__popover {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, 8px);
      width: max-content;
      min-width: 180px;
      display: flex;
      flex-direction: column;
      padding: 6px;
      gap: 2px;
      border-radius: 4px;
      background: color-mix(in srgb, var(--shade-900) 96%, transparent);
      backdrop-filter: blur(10px);
      border: 1px solid color-mix(in srgb, var(--shade-10) 10%, transparent);
      box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.7);
      opacity: 0;
      pointer-events: none;
      transition: opacity 140ms ease, transform 140ms ease;
      z-index: 5;
    }

    &__stars {
      display: flex;
      justify-content: center;
      gap: 2px;
      padding: 4px 0;
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
      margin-bottom: 4px;
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
        color: var(--color-text-primary);
      }
    }

    @include for-touch {
      &__popover { display: none; }
    }

    @include for-mobile {
      &__popover { display: none; }
    }
  }
</style>
