<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';

  type Props = {
    isAuthenticated: boolean;
    isWatched: boolean;
    isLiked: boolean;
    isOnWatchlist: boolean;
    userRating: number | null;
    onToggleWatched: () => void;
    onToggleLike: () => void;
    onToggleWatchlist: () => void;
    onOpenRate: () => void;
    onOpenReview: () => void;
    onOpenLists: () => void;
  };

  const {
    isAuthenticated,
    isWatched,
    isLiked,
    isOnWatchlist,
    userRating,
    onToggleWatched,
    onToggleLike,
    onToggleWatchlist,
    onOpenRate,
    onOpenReview,
    onOpenLists,
  }: Props = $props();
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
        class="film-action-card__triad-btn"
        data-active={isWatched ? "true" : undefined}
        aria-pressed={isWatched}
        onclick={onToggleWatched}
      >
        <span class="film-action-card__triad-glyph" aria-hidden="true">●</span>
        <span class="film-action-card__triad-label">{m.button_text_watch()}</span>
      </button>
      <button
        type="button"
        class="film-action-card__triad-btn film-action-card__triad-btn--like"
        data-active={isLiked ? "true" : undefined}
        aria-pressed={isLiked}
        onclick={onToggleLike}
      >
        <span class="film-action-card__triad-glyph" aria-hidden="true">♥</span>
        <span class="film-action-card__triad-label">{m.button_text_like()}</span>
      </button>
      <button
        type="button"
        class="film-action-card__triad-btn"
        data-active={isOnWatchlist ? "true" : undefined}
        aria-pressed={isOnWatchlist}
        onclick={onToggleWatchlist}
      >
        <span class="film-action-card__triad-glyph" aria-hidden="true">⊕</span>
        <span class="film-action-card__triad-label">{m.button_text_watchlist()}</span>
      </button>
    </div>

    <div class="film-action-card__rate">
      <span class="film-action-card__rate-label">{m.text_label_rate()}</span>
      <button type="button" class="film-action-card__rate-row" onclick={onOpenRate}>
        {#each Array.from({ length: 5 }) as _, i (i)}
          {@const filled = (userRating ?? 0) / 2 > i}
          {@const half = (userRating ?? 0) / 2 > i && (userRating ?? 0) / 2 < i + 1}
          <span
            class="film-action-card__star"
            data-state={filled ? (half ? "half" : "full") : "empty"}
            aria-hidden="true"
          >★</span>
        {/each}
        <span class="visually-hidden">
          {m.text_label_rate()}
        </span>
      </button>
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

      &:hover {
        color: var(--color-text-primary);
        background: color-mix(in srgb, var(--shade-1000) 30%, var(--shade-900));
      }

      &[data-active="true"] {
        color: var(--color-background-green, var(--green-500));
      }

      &--like[data-active="true"] {
        color: var(--orange-500, #ff9010);
      }
    }

    &__triad-glyph {
      font-size: 1.1rem;
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

    &__rate-label {
      font-size: 0.7rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    &__rate-row {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      gap: 2px;
    }

    &__star {
      font-size: 1.4rem;
      line-height: 1;
      color: color-mix(in srgb, var(--shade-10) 15%, transparent);

      &[data-state="full"] { color: var(--color-background-green, var(--green-500)); }
      &[data-state="half"] {
        background: linear-gradient(
          90deg,
          var(--color-background-green, var(--green-500)) 50%,
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
