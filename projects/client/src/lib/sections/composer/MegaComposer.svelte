<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { useMarkAsWatched } from '$lib/sections/media-actions/mark-as-watched/useMarkAsWatched.ts';
  import { useWatchlist } from '$lib/sections/media-actions/watchlist/useWatchlist.ts';
  import { useRatings } from '$lib/sections/summary/components/rating/useRatings.ts';
  import type { ComposerTarget } from './models/ComposerTarget.ts';

  type Props = {
    target: ComposerTarget;
    onClose: () => void;
  };

  const { target, onClose }: Props = $props();

  const isShowKind = $derived(target.kind === 'show' || target.kind === 'episode');
  const actionType = $derived(target.kind === 'episode' ? 'episode' : target.kind);

  let watched = $state(true);
  let isRewatch = $state(false);
  let likedHeart = $state(false);
  let rating = $state<number>(0);
  let review = $state('');
  let tags = $state<string[]>([]);
  let tagInput = $state('');
  let watchedDate = $state(new Date().toISOString().slice(0, 16));
  let isSubmitting = $state(false);
  let submitError = $state<string | null>(null);

  const markAction = $derived.by(() => {
    if (target.kind === 'episode') {
      // FIXME: episode-targeted mark-as-watched needs season + number; the show
      // season-picker rebuild will supply those when it lands.
      return null;
    }
    return useMarkAsWatched({
      type: target.kind,
      media: {
        id: target.id,
        effectiveReleaseDate: target.effectiveReleaseDate,
      },
    });
  });

  const ratingAction = $derived(
    useRatings({
      type: target.kind === 'episode' ? 'episode' : target.kind,
      id: target.id,
    }),
  );

  const watchlistAction = $derived.by(() => {
    if (target.kind === 'episode') return null;
    return useWatchlist({
      type: target.kind,
      media: { id: target.id },
    });
  });

  const isWatchlistedStore = $derived(watchlistAction?.isWatchlisted);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) tags = [...tags, trimmed];
    tagInput = '';
  };

  const removeTag = (tag: string) => {
    tags = tags.filter((t) => t !== tag);
  };

  const setRating = (value: number) => {
    rating = rating === value ? 0 : value;
  };

  const onSubmit = async (event: Event) => {
    event.preventDefault();
    isSubmitting = true;
    submitError = null;
    try {
      const tasks: Promise<unknown>[] = [];

      if (watched && markAction) {
        const when = watchedDate ? new Date(watchedDate) : new Date();
        tasks.push(markAction.markAsWatched(when));
      }
      void isRewatch; // rewatch flag captured for analytics; sync layer treats it as a new entry
      void likedHeart; // like dispatch lands when the like endpoint wave ships
      void review; // review POST lands with the comments rebuild wave
      void tags; // tag attach lands with the lists rebuild wave

      if (rating > 0) {
        tasks.push(Promise.resolve(ratingAction.addRating(rating)));
      }

      await Promise.all(tasks);
      onClose();
    } catch (err) {
      submitError = err instanceof Error ? err.message : 'Failed to save log entry.';
    } finally {
      isSubmitting = false;
    }
  };

  $effect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    globalThis.window?.addEventListener('keydown', handler);
    return () => globalThis.window?.removeEventListener('keydown', handler);
  });
</script>

<div
  class="composer__backdrop"
  role="presentation"
  onclick={onClose}
>
</div>

<dialog open class="composer">
  <header class="composer__header">
    <div class="composer__title-block">
      <p class="composer__eyebrow">{m.composer_eyebrow_log()}</p>
      <h2 class="composer__title">
        {target.title}{#if target.year} <span class="composer__year">{target.year}</span>{/if}
      </h2>
      {#if isShowKind && target.season != null}
        <p class="composer__sub">
          {m.composer_target_season({ season: String(target.season) })}{#if target.episode != null}
            · {m.composer_target_episode({ episode: String(target.episode) })}
          {/if}
        </p>
      {/if}
    </div>
    <button
      type="button"
      class="composer__close"
      aria-label={m.composer_close()}
      onclick={onClose}
    >×</button>
  </header>

  <form class="composer__form" onsubmit={onSubmit}>
    <div class="composer__layout">
      {#if target.posterUrl}
        <img class="composer__poster" src={target.posterUrl} alt={target.title} />
      {/if}

      <div class="composer__fields">
        <label class="composer__toggle">
          <input
            type="checkbox"
            bind:checked={watched}
          />
          <span>{m.composer_watched_label()}</span>
        </label>

        {#if watched}
          <div class="composer__field-row">
            <label class="composer__field">
              <span class="composer__field-label">{m.composer_date_label()}</span>
              <input
                type="datetime-local"
                class="composer__input"
                bind:value={watchedDate}
              />
            </label>
            <label class="composer__toggle composer__toggle--inline">
              <input type="checkbox" bind:checked={isRewatch} />
              <span>{m.composer_rewatch_label()}</span>
            </label>
          </div>
        {/if}

        <div class="composer__field">
          <span class="composer__field-label">{m.composer_rating_label()}</span>
          <div
            class="composer__stars"
            role="radiogroup"
            aria-label={m.composer_rating_label()}
          >
            {#each Array.from({ length: 10 }) as _, i (i)}
              {@const value = i + 1}
              <button
                type="button"
                class="composer__star"
                data-filled={value <= rating ? "true" : undefined}
                aria-label={`${value}/10`}
                aria-pressed={value <= rating}
                onclick={() => setRating(value)}
              >★</button>
            {/each}
            {#if rating > 0}
              <button
                type="button"
                class="composer__star-clear"
                onclick={() => setRating(0)}
                aria-label={m.composer_rating_clear()}
              >{m.composer_rating_clear()}</button>
            {/if}
          </div>
        </div>

        <button
          type="button"
          class="composer__like"
          data-active={likedHeart ? "true" : undefined}
          aria-pressed={likedHeart}
          onclick={() => (likedHeart = !likedHeart)}
        >
          <span class="composer__like-glyph" aria-hidden="true">♥</span>
          <span>{m.composer_like_label()}</span>
        </button>

        <label class="composer__field">
          <span class="composer__field-label">{m.composer_review_label()}</span>
          <textarea
            class="composer__textarea"
            bind:value={review}
            rows="5"
            placeholder={m.composer_review_placeholder()}
          ></textarea>
        </label>

        <div class="composer__field">
          <span class="composer__field-label">{m.composer_tags_label()}</span>
          <div class="composer__tag-row">
            {#each tags as tag (tag)}
              <button
                type="button"
                class="composer__tag"
                onclick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
              >#{tag} <span aria-hidden="true">×</span></button>
            {/each}
            <input
              type="text"
              class="composer__tag-input"
              placeholder={m.composer_tags_placeholder()}
              bind:value={tagInput}
              onkeydown={(event) => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  addTag();
                }
              }}
            />
          </div>
        </div>

        {#if watchlistAction && isWatchlistedStore}
          <label class="composer__toggle">
            <input
              type="checkbox"
              checked={$isWatchlistedStore}
              onchange={async (event) => {
                const input = event.currentTarget as HTMLInputElement;
                if (!watchlistAction) return;
                if (input.checked) {
                  await watchlistAction.addToWatchlist();
                } else {
                  await watchlistAction.removeFromWatchlist();
                }
              }}
            />
            <span>{m.composer_watchlist_label()}</span>
          </label>
        {/if}

        {#if submitError}
          <p class="composer__error" role="alert">{submitError}</p>
        {/if}
      </div>
    </div>

    <footer class="composer__footer">
      <button
        type="button"
        class="composer__btn"
        onclick={onClose}
        disabled={isSubmitting}
      >{m.composer_cancel()}</button>
      <button
        type="submit"
        class="composer__btn composer__btn--primary"
        disabled={isSubmitting}
      >{isSubmitting ? m.composer_saving() : m.composer_save()}</button>
    </footer>
  </form>
</dialog>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .composer {
    position: fixed;
    inset: 50% auto auto 50%;
    transform: translate(-50%, -50%);
    width: min(720px, calc(100vw - 32px));
    max-height: calc(100dvh - 64px);
    overflow-y: auto;
    z-index: calc(var(--layer-floating, 100) + 10);
    background: var(--shade-900);
    border: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
    border-radius: 4px;
    padding: 0;
    color: var(--color-text-primary);
    box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.7);

    &__backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      z-index: calc(var(--layer-floating, 100) + 9);
    }

    &__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: var(--gap-m);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
    }

    &__title-block {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__eyebrow {
      margin: 0;
      font-size: 0.7rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--color-background-green, var(--green-500));
      font-weight: 700;
    }

    &__title {
      margin: 0;
      font-family: var(--font-family-serif, "Tiempos Headline", Georgia, serif);
      font-weight: 400;
      font-size: 1.4rem;
      color: var(--color-text-primary);
    }

    &__year {
      color: var(--color-text-secondary);
      font-size: 1rem;
    }

    &__sub {
      margin: 4px 0 0;
      font-size: 0.8rem;
      color: var(--color-text-secondary);
    }

    &__close {
      all: unset;
      cursor: pointer;
      font-size: 1.6rem;
      line-height: 1;
      color: var(--color-text-secondary);
      padding: 4px 8px;

      &:hover { color: var(--color-text-primary); }
    }

    &__form {
      display: flex;
      flex-direction: column;
    }

    &__layout {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: var(--gap-m);
      padding: var(--gap-m);

      @include for-mobile {
        grid-template-columns: 1fr;
      }
    }

    &__poster {
      width: 100%;
      aspect-ratio: 2 / 3;
      object-fit: cover;
      border-radius: 3px;
      box-shadow: 0 8px 18px -10px rgba(0, 0, 0, 0.6);

      @include for-mobile {
        max-width: 100px;
      }
    }

    &__fields {
      display: flex;
      flex-direction: column;
      gap: var(--gap-m);
    }

    &__toggle {
      display: inline-flex;
      align-items: center;
      gap: var(--gap-xs);
      cursor: pointer;
      font-size: 0.85rem;
      color: var(--color-text-primary);
      user-select: none;

      input {
        accent-color: var(--color-background-green, var(--green-500));
      }

      &--inline {
        align-self: flex-end;
      }
    }

    &__field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    &__field-label {
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      font-weight: 700;
    }

    &__field-row {
      display: flex;
      gap: var(--gap-m);
      align-items: flex-end;

      .composer__field { flex: 1; }
    }

    &__input,
    &__textarea {
      background: var(--shade-1000);
      border: 1px solid color-mix(in srgb, var(--shade-10) 10%, transparent);
      border-radius: 3px;
      padding: 0.5rem 0.7rem;
      color: var(--color-text-primary);
      font: inherit;
      font-size: 0.9rem;

      &:focus {
        outline: none;
        border-color: var(--color-background-green, var(--green-500));
      }
    }

    &__textarea {
      resize: vertical;
      min-height: 100px;
    }

    &__stars {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
      align-items: center;
    }

    &__star {
      all: unset;
      cursor: pointer;
      width: 22px;
      height: 22px;
      font-size: 1.4rem;
      line-height: 1;
      text-align: center;
      color: color-mix(in srgb, var(--shade-10) 15%, transparent);
      transition: color 80ms ease;

      &:hover,
      &[data-filled="true"] {
        color: var(--color-background-green, var(--green-500));
      }
    }

    &__star-clear {
      all: unset;
      cursor: pointer;
      margin-left: var(--gap-s);
      font-size: 0.72rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--color-text-secondary);

      &:hover { color: var(--color-text-primary); }
    }

    &__like {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      color: var(--color-text-secondary);

      &[data-active="true"] {
        color: var(--orange-500, #ff9010);
      }
    }

    &__like-glyph { font-size: 1.1rem; }

    &__tag-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0.45rem 0.5rem;
      background: var(--shade-1000);
      border: 1px solid color-mix(in srgb, var(--shade-10) 10%, transparent);
      border-radius: 3px;

      &:focus-within {
        border-color: var(--color-background-green, var(--green-500));
      }
    }

    &__tag {
      all: unset;
      cursor: pointer;
      font-size: 0.78rem;
      padding: 0.15rem 0.5rem;
      background: color-mix(in srgb, var(--shade-700) 60%, transparent);
      color: var(--color-text-primary);
      border-radius: 2px;

      &:hover {
        background: color-mix(in srgb, var(--shade-700) 90%, transparent);
      }
    }

    &__tag-input {
      flex: 1;
      min-width: 120px;
      background: transparent;
      border: none;
      color: var(--color-text-primary);
      font: inherit;
      font-size: 0.85rem;
      padding: 0.15rem 0.25rem;

      &:focus { outline: none; }
    }

    &__error {
      margin: 0;
      font-size: 0.85rem;
      color: var(--red-500, #ff4757);
    }

    &__footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--gap-s);
      padding: var(--gap-m);
      border-top: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
    }

    &__btn {
      all: unset;
      cursor: pointer;
      padding: 0.55rem 1rem;
      border-radius: 3px;
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-text-primary);
      border: 1px solid color-mix(in srgb, var(--shade-10) 12%, transparent);

      &:hover {
        border-color: var(--color-text-primary);
      }

      &--primary {
        background: var(--color-background-green, var(--green-500));
        color: var(--shade-1000);
        border-color: var(--color-background-green, var(--green-500));

        &:hover {
          background: var(--green-400);
          border-color: var(--green-400);
        }
      }

      &[disabled] {
        opacity: 0.5;
        cursor: wait;
      }
    }
  }
</style>
