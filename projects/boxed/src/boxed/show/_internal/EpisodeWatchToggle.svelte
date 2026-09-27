<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched.ts";

  type EpisodeWatchToggleProps = {
    show: ShowEntry;
    episode: EpisodeEntry;
    label: string;
  };

  const { show, episode, label }: EpisodeWatchToggleProps = $props();

  const { isWatched, isMarkingAsWatched, isWatchable, markAsWatched, removeWatched } =
    $derived(
      useMarkAsWatched({
        type: "episode",
        media: episode,
        show: { id: show.id, title: show.title },
      }),
    );

  const { confirm } = useConfirm();

  const confirmRemove = $derived(
    confirm({
      type: ConfirmationType.RemoveFromWatched,
      title: label,
      onConfirm: () => removeWatched(),
    }),
  );
</script>

<button
  type="button"
  class="boxed-episode-toggle"
  data-state={$isWatched ? "watched" : "idle"}
  aria-pressed={$isWatched}
  aria-label={$isWatched
    ? m.button_label_remove_from_watched({ title: label })
    : m.button_label_mark_as_watched({ title: label })}
  disabled={!isWatchable || $isMarkingAsWatched}
  onclick={$isWatched ? confirmRemove : () => markAsWatched()}
>
  <CheckIcon />
</button>

<style>
  .boxed-episode-toggle {
    width: var(--ni-40);
    height: var(--ni-40);
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-radius: 50%;
    background: transparent;
    box-shadow: inset 0 0 0 var(--border-thickness-xs) var(--color-border);
    color: var(--color-text-secondary);
    cursor: pointer;

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }

    &:hover:not(:disabled),
    &:focus-visible {
      box-shadow: inset 0 0 0 var(--border-thickness-xs) var(--boxed-color-watched);
      color: var(--boxed-color-watched-text);
    }

    &[data-state="watched"] {
      background: var(--boxed-color-watched);
      box-shadow: none;
      color: var(--shade-950);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
</style>
