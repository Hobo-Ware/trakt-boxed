<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import CheckInIcon from "$lib/components/icons/CheckInIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { useCheckIn } from "$lib/sections/media-actions/check-in/useCheckIn.ts";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched.ts";

  const { show, episode }: { show: ShowEntry; episode: EpisodeEntry } =
    $props();

  const target = $derived({
    type: "episode" as const,
    media: episode,
    show: { id: show.id, title: show.title },
  });

  const { markAsWatched, isMarkingAsWatched, isWatchable } = $derived(
    useMarkAsWatched(target),
  );
  const { checkin, isCheckingIn, isCheckedIn } = $derived(useCheckIn(target));
</script>

<div class="boxed-next-actions">
  <button
    type="button"
    class="boxed-next-watched"
    disabled={!isWatchable || $isMarkingAsWatched}
    onclick={() => markAsWatched()}
  >
    <CheckIcon />
    {m.button_text_mark_as_watched()}
  </button>
  <button
    type="button"
    class="boxed-next-checkin"
    aria-label={m.button_label_checkin({ title: episode.title })}
    disabled={!isWatchable || $isCheckingIn || $isCheckedIn}
    onclick={() => checkin()}
  >
    <CheckInIcon />
    {m.button_text_checkin()}
  </button>
</div>

<style>
  .boxed-next-actions {
    display: flex;
    gap: var(--ni-8);
  }

  .boxed-next-watched,
  .boxed-next-checkin {
    box-sizing: border-box;
    height: var(--ni-40);
    padding: 0 var(--ni-16);

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ni-8);

    border: none;
    border-radius: var(--border-radius-m);
    cursor: pointer;

    font: inherit;
    font-size: var(--ni-14);
    font-weight: 500;
    white-space: nowrap;

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }

    &:disabled {
      opacity: 0.6;
      cursor: progress;
    }
  }

  .boxed-next-watched {
    flex: 1 1 auto;

    background: var(--boxed-color-watched);
    color: var(--shade-950);

    &:hover:not(:disabled),
    &:focus-visible {
      background: color-mix(in srgb, var(--boxed-color-watched) 85%, var(--shade-10));
    }
  }

  .boxed-next-checkin {
    background: transparent;
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    color: var(--color-text-primary);

    &:hover:not(:disabled),
    &:focus-visible {
      background: color-mix(in srgb, var(--color-foreground) 6%, transparent);
    }
  }
</style>
