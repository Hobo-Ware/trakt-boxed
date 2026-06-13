<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';

  type Props = {
    isAuthenticated: boolean;
    isWatched: boolean;
    isLiked: boolean;
    isOnWatchlist: boolean;
    userRating: number | null;
    isReleased: boolean;
    onToggleWatched: () => void;
    onToggleLike: () => void;
    onToggleWatchlist: () => void;
    onRate: (rating: number) => void;
    onClearRating: () => void;
    onOpenReview: () => void;
    onOpenLists: () => void;
  };

  const {
    isAuthenticated,
    isWatched,
    isLiked,
    isOnWatchlist,
    userRating,
    isReleased,
    onToggleWatched,
    onToggleLike,
    onToggleWatchlist,
    onRate,
    onClearRating,
    onOpenReview,
    onOpenLists,
  }: Props = $props();

  let hoverRating = $state<number | null>(null);
  const displayRating = $derived(hoverRating ?? userRating ?? 0);
  const rateDisabled = $derived(!isWatched);
  const likeDisabled = $derived(!isWatched);
  const watchDisabled = $derived(!isReleased);
  const rateHint = $derived(!isWatched ? m.poster_disabled_unwatched() : undefined);
  const watchHint = $derived(!isReleased ? m.poster_disabled_unreleased() : undefined);
</script>

<aside class="film-action-card" aria-label="Actions">
  {#if !isAuthenticated}
    <div class="film-action-card__signin">
      <p class="film-action-card__signin-prompt">
        {m.text_unauthenticated_action_prompt()}
      </p>
      <a class="film-action-card__signin-cta" href="/silent-redirect">
        {m.button_text_sign_in()}
      </a>
    </div>
  {:else}
    <div class="film-action-card__triad">
      <button
        type="button"
        class="film-action-card__triad-btn film-action-card__triad-btn--watched"
        data-active={isWatched ? "true" : undefined}
        aria-pressed={isWatched}
        disabled={watchDisabled}
        title={watchHint}
        onclick={onToggleWatched}
      >
        <span class="film-action-card__triad-glyph" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
        <span class="film-action-card__triad-label">
          {isWatched ? m.button_text_watched_state() : m.button_text_watch()}
        </span>
      </button>
      <button
        type="button"
        class="film-action-card__triad-btn film-action-card__triad-btn--like"
        data-active={isLiked ? "true" : undefined}
        aria-pressed={isLiked}
        disabled={likeDisabled}
        title={rateHint}
        onclick={onToggleLike}
      >
        <span class="film-action-card__triad-glyph" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </span>
        <span class="film-action-card__triad-label">
          {isLiked ? m.button_text_liked_state() : m.button_text_like()}
        </span>
      </button>
      <button
        type="button"
        class="film-action-card__triad-btn film-action-card__triad-btn--watchlist"
        data-active={isOnWatchlist ? "true" : undefined}
        aria-pressed={isOnWatchlist}
        onclick={onToggleWatchlist}
      >
        <span class="film-action-card__triad-glyph" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            {#if isOnWatchlist}
              <path d="M8 12l3 3 5-6" />
            {:else}
              <path d="M12 7v5l3 2" />
            {/if}
          </svg>
        </span>
        <span class="film-action-card__triad-label">{m.button_text_watchlist()}</span>
      </button>
    </div>

    <div class="film-action-card__rate">
      <span class="film-action-card__rate-label">{m.text_label_rate()}</span>
      <div
        class="film-action-card__rate-row"
        role="radiogroup"
        aria-label={m.text_label_rate()}
        aria-disabled={rateDisabled}
        title={rateHint}
        onmouseleave={() => (hoverRating = null)}
      >
        {#each Array.from({ length: 5 }) as _, i (i)}
          {@const starIndex = i + 1}
          {@const lowValue = i * 2 + 1}
          {@const highValue = i * 2 + 2}
          {@const fillProgress = displayRating / 2 - i}
          {@const state =
            fillProgress >= 1 ? "full" : fillProgress >= 0.5 ? "half" : "empty"}
          <span class="film-action-card__star-cell">
            <button
              type="button"
              class="film-action-card__star-half film-action-card__star-half--low"
              aria-label={`${lowValue}/10`}
              aria-checked={userRating === lowValue}
              role="radio"
              disabled={rateDisabled}
              onmouseenter={() => (hoverRating = lowValue)}
              onclick={() =>
                userRating === lowValue ? onClearRating() : onRate(lowValue)}
            ></button>
            <button
              type="button"
              class="film-action-card__star-half film-action-card__star-half--high"
              aria-label={`${highValue}/10`}
              aria-checked={userRating === highValue}
              role="radio"
              disabled={rateDisabled}
              onmouseenter={() => (hoverRating = highValue)}
              onclick={() =>
                userRating === highValue ? onClearRating() : onRate(highValue)}
            ></button>
            <span
              class="film-action-card__star"
              data-state={state}
              data-index={starIndex}
              aria-hidden="true"
            >★</span>
          </span>
        {/each}
      </div>
      {#if rateHint}
        <p class="film-action-card__rate-hint">{rateHint}</p>
      {/if}
    </div>

    <div class="film-action-card__divider" aria-hidden="true"></div>

    <div class="film-action-card__extras">
      <button type="button" class="film-action-card__extra" onclick={onOpenReview}>
        {m.button_text_review()}
      </button>
      <button type="button" class="film-action-card__extra" onclick={onOpenLists}>
        {m.button_text_add_to_lists()}
      </button>
    </div>
  {/if}
</aside>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .film-action-card {
    display: flex;
    flex-direction: column;
    background: color-mix(in srgb, var(--shade-900) 92%, transparent);
    border: 1px solid color-mix(in srgb, var(--shade-10) 6%, transparent);
    border-radius: 4px;
    padding: var(--gap-m);
    box-shadow: 0 16px 40px -16px rgba(0, 0, 0, 0.55);

    &__signin {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--gap-s);
      padding: var(--gap-s) 0;
    }

    &__signin-prompt {
      margin: 0;
      font-size: 0.92rem;
      text-align: center;
      color: var(--color-text-secondary);
    }

    &__signin-cta {
      display: inline-block;
      width: 100%;
      text-align: center;
      padding: 0.75rem 1rem;
      border-radius: 3px;
      background: var(--color-background-green, var(--green-500));
      color: var(--shade-1000);
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-decoration: none;

      &:hover {
        background: var(--green-400);
      }
    }

    &__triad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: color-mix(in srgb, var(--shade-10) 6%, transparent);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: var(--gap-s);
    }

    &__triad-btn {
      all: unset;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 0.6rem 0;
      background: color-mix(in srgb, var(--shade-1000) 50%, var(--shade-900));
      color: var(--color-text-secondary);
      transition: color 120ms ease, background 120ms ease;

      &:hover:not([disabled]) {
        color: var(--color-text-primary);
        background: color-mix(in srgb, var(--shade-1000) 30%, var(--shade-900));
      }

      &[disabled] {
        opacity: 0.4;
        cursor: not-allowed;
      }

      &--watched[data-active="true"] {
        color: var(--color-watched);
      }

      &--like[data-active="true"] {
        color: var(--color-like-active);
      }

      &--watchlist[data-active="true"] {
        color: var(--color-watchlist);
      }
    }

    &__triad-glyph {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    &__triad-label {
      font-size: 0.7rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    &__rate {
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: center;
      padding: var(--gap-s) 0;
    }

    &__rate-row[aria-disabled="true"] {
      opacity: 0.4;
      pointer-events: none;
    }

    &__rate-hint {
      margin: 0;
      font-size: 0.7rem;
      color: var(--color-text-secondary);
      text-align: center;
    }

    &__rate-label {
      font-size: 0.7rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    &__rate-row {
      display: inline-flex;
      gap: 2px;
    }

    &__star-cell {
      position: relative;
      width: 1.4rem;
      height: 1.4rem;
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

    &__star {
      position: absolute;
      inset: 0;
      font-size: 1.4rem;
      line-height: 1;
      pointer-events: none;
      color: color-mix(in srgb, var(--shade-10) 15%, transparent);

      &[data-state="full"] { color: var(--color-rating-star); }
      &[data-state="half"] {
        background: linear-gradient(
          90deg,
          var(--color-rating-star) 50%,
          color-mix(in srgb, var(--shade-10) 15%, transparent) 50%
        );
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    &__divider {
      height: 1px;
      background: color-mix(in srgb, var(--shade-10) 6%, transparent);
      margin: var(--gap-xs) 0;
    }

    &__extras {
      display: flex;
      flex-direction: column;
    }

    &__extra {
      all: unset;
      cursor: pointer;
      padding: 0.55rem 0;
      text-align: center;
      font-size: 0.78rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      border-top: 1px solid color-mix(in srgb, var(--shade-10) 4%, transparent);

      &:first-child { border-top: none; }
      &:hover { color: var(--color-text-primary); }
    }
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
