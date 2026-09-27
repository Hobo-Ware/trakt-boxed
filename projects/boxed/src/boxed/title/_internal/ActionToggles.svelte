<script lang="ts">
  import { toMediaTarget } from "$boxed/poster/toMediaTarget.ts";
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import EyeIcon from "$lib/components/icons/EyeIcon.svelte";
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useFavorites } from "$lib/sections/media-actions/favorite/useFavorites.ts";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched.ts";
  import { useWatchlist } from "$lib/sections/media-actions/watchlist/useWatchlist.ts";
  import type { PosterMedia } from "../../poster/PosterMedia.ts";

  const { media }: { media: PosterMedia } = $props();

  const target = $derived(toMediaTarget(media));

  const { isWatched, isMarkingAsWatched, markAsWatched, removeWatched } =
    $derived(useMarkAsWatched(target));
  const {
    isWatchlisted,
    isWatchlistUpdating,
    addToWatchlist,
    removeFromWatchlist,
  } = $derived(useWatchlist(target));
  const {
    isFavorited,
    isUpdatingFavorite,
    addToFavorites,
    removeFromFavorites,
  } = $derived(
    useFavorites({ type: media.type, id: media.id, title: media.title }),
  );

  const { confirm } = useConfirm();

  const confirmMarkAsWatched = $derived(
    confirm({
      type: ConfirmationType.MarkAsWatched,
      title: media.title,
      target,
      onConfirm: () => markAsWatched(),
    }),
  );

  const confirmRemoveFromWatched = $derived(
    confirm({
      type: ConfirmationType.RemoveFromWatched,
      title: media.title,
      onConfirm: () => removeWatched(),
    }),
  );
</script>

<button
  class="boxed-action-toggle"
  data-state={$isWatched ? "watched" : "idle"}
  aria-pressed={$isWatched}
  aria-label={$isWatched
    ? m.button_label_remove_from_watched({ title: media.title })
    : m.button_label_mark_as_watched({ title: media.title })}
  disabled={$isMarkingAsWatched}
  onclick={$isWatched ? confirmRemoveFromWatched : confirmMarkAsWatched}
>
  <EyeIcon />
  <span>{m.tag_text_watched()}</span>
</button>
<button
  class="boxed-action-toggle"
  data-state={$isFavorited ? "liked" : "idle"}
  aria-pressed={$isFavorited}
  aria-label={$isFavorited
    ? m.button_label_remove_from_favorites({ title: media.title })
    : m.button_label_add_to_favorites({ title: media.title })}
  disabled={$isUpdatingFavorite}
  onclick={() => ($isFavorited ? removeFromFavorites() : addToFavorites())}
>
  <FavoriteIcon state={$isFavorited ? "filled" : "open"} />
  <span>{$isFavorited ? m.boxed_title_liked() : m.boxed_log_like()}</span>
</button>
<button
  class="boxed-action-toggle"
  data-state={$isWatchlisted ? "watchlist" : "idle"}
  aria-pressed={$isWatchlisted}
  aria-label={$isWatchlisted
    ? m.button_label_remove_from_watchlist({ title: media.title })
    : m.button_label_add_to_watchlist({ title: media.title })}
  disabled={$isWatchlistUpdating}
  onclick={() => ($isWatchlisted ? removeFromWatchlist() : addToWatchlist())}
>
  <BookmarkIcon state={$isWatchlisted ? "added" : "missing"} />
  <span>{m.button_text_watchlist()}</span>
</button>

<style>
  .boxed-action-toggle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ni-6);

    padding: 0;
    border: none;
    background: none;
    cursor: pointer;

    font: inherit;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-30);
      height: var(--ni-30);
    }

    &:hover,
    &:focus-visible {
      color: var(--color-text-primary);
    }

    &[data-state="watched"] {
      color: var(--boxed-color-watched-text);
    }

    &[data-state="liked"] {
      color: var(--boxed-color-liked-text);
    }

    &[data-state="watchlist"] {
      color: var(--boxed-color-watchlist-text);
    }

    &:disabled {
      opacity: 0.6;
      cursor: progress;
    }
  }
</style>
