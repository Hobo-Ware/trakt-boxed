<script lang="ts">
  import { toMediaTarget } from "../toMediaTarget.ts";
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import EyeIcon from "$lib/components/icons/EyeIcon.svelte";
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import WatchNowIcon from "$lib/components/icons/WatchNowIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import { manageListsDrawerStore } from "$lib/sections/components/lists-drawer/manageListsDrawerStore.ts";
  import { useFavorites } from "$lib/sections/media-actions/favorite/useFavorites.ts";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched.ts";
  import { useWatchlist } from "$lib/sections/media-actions/watchlist/useWatchlist.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import { logComposerStore } from "../../log/logComposerStore.ts";
  import type { PosterMedia } from "../PosterMedia.ts";

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

  const toggleWatchlist = () =>
    $isWatchlisted ? removeFromWatchlist() : addToWatchlist();
  const toggleLiked = () =>
    $isFavorited ? removeFromFavorites() : addToFavorites();
  const openLists = () =>
    manageListsDrawerStore.open({ target, title: media.title });
</script>

<div class="boxed-poster-actions">
  <button
    class="boxed-poster-action"
    data-state={$isWatched ? "watched" : "idle"}
    aria-pressed={$isWatched}
    aria-label={$isWatched
      ? m.button_label_remove_from_watched({ title: media.title })
      : m.button_label_mark_as_watched({ title: media.title })}
    disabled={$isMarkingAsWatched}
    onclick={$isWatched ? confirmRemoveFromWatched : confirmMarkAsWatched}
  >
    <EyeIcon />
  </button>
  <button
    class="boxed-poster-action"
    data-state={$isFavorited ? "liked" : "idle"}
    aria-pressed={$isFavorited}
    aria-label={$isFavorited
      ? m.button_label_remove_from_favorites({ title: media.title })
      : m.button_label_add_to_favorites({ title: media.title })}
    disabled={$isUpdatingFavorite}
    onclick={toggleLiked}
  >
    <FavoriteIcon state={$isFavorited ? "filled" : "open"} />
  </button>
  <button
    class="boxed-poster-action"
    data-state={$isWatchlisted ? "watchlist" : "idle"}
    aria-pressed={$isWatchlisted}
    aria-label={$isWatchlisted
      ? m.button_label_remove_from_watchlist({ title: media.title })
      : m.button_label_add_to_watchlist({ title: media.title })}
    disabled={$isWatchlistUpdating}
    onclick={toggleWatchlist}
  >
    <BookmarkIcon state={$isWatchlisted ? "added" : "missing"} />
  </button>
  <PopupMenu
    label={m.button_label_popup_menu({ title: media.title })}
    title={media.title}
  >
    {#snippet items()}
      <DropdownItem
        label={m.boxed_log_button_label()}
        style="flat"
        color="default"
        variant="secondary"
        onclick={() => logComposerStore.compose({ type: media.type, media })}
      >
        {m.boxed_log_button()}
        {#snippet icon()}<PlusIcon />{/snippet}
      </DropdownItem>
      <DropdownItem
        label={m.button_text_manage_lists()}
        style="flat"
        color="default"
        variant="secondary"
        onclick={openLists}
      >
        {m.button_text_manage_lists()}
        {#snippet icon()}<ListIcon />{/snippet}
      </DropdownItem>
      <DropdownItem
        href={`${UrlBuilder.media(media.type, media.slug)}?view=where-to-watch`}
        label={m.button_text_where_to_watch()}
        style="flat"
        color="default"
        variant="secondary"
      >
        {m.button_text_where_to_watch()}
        {#snippet icon()}<WatchNowIcon />{/snippet}
      </DropdownItem>
    {/snippet}
  </PopupMenu>
</div>

<style>
  .boxed-poster-actions {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: var(--gap-xxs);

    padding: var(--ni-4);
    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--shade-950) 82%, transparent);
    backdrop-filter: blur(var(--ni-8));
  }

  .boxed-poster-action {
    width: var(--ni-32);
    height: var(--ni-32);

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0;
    border: none;
    border-radius: var(--border-radius-s);
    background: transparent;
    color: var(--shade-100);
    cursor: pointer;

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }

    &:hover,
    &:focus-visible {
      color: var(--shade-10);
      background: color-mix(in srgb, var(--shade-10) 12%, transparent);
    }

    &[data-state="watched"] {
      color: var(--boxed-color-watched);
    }

    &[data-state="liked"] {
      color: var(--boxed-color-liked);
    }

    &[data-state="watchlist"] {
      color: var(--boxed-color-watchlist);
    }

    &:disabled {
      opacity: 0.5;
      cursor: progress;
    }
  }
</style>
