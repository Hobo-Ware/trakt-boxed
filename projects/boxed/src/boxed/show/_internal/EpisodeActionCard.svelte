<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { manageListsDrawerStore } from "$lib/sections/components/lists-drawer/manageListsDrawerStore.ts";
  import { useCheckIn } from "$lib/sections/media-actions/check-in/useCheckIn.ts";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched.ts";
  import { useWatchCount } from "$lib/stores/useWatchCount.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { logComposerStore } from "../../log/logComposerStore.ts";
  import ActionShell from "../../title/ActionShell.svelte";
  import ActionRating from "../../title/_internal/ActionRating.svelte";
  import ActionRow from "../../title/_internal/ActionRow.svelte";
  import ShareAction from "../../title/_internal/ShareAction.svelte";

  type EpisodeActionCardProps = {
    show: ShowEntry;
    episode: EpisodeEntry;
    label: string;
    shareText: string;
    whereToWatchHref: string;
  };

  const { show, episode, label, shareText, whereToWatchHref }: EpisodeActionCardProps =
    $props();

  const { isAuthorized } = useAuth();
  const { history } = useUser();
  const { confirm } = useConfirm();

  const target = $derived({
    type: "episode" as const,
    media: episode,
    show: { id: show.id, title: show.title },
  });

  const { isWatched, isMarkingAsWatched, isWatchable, markAsWatched, removeWatched } =
    $derived(useMarkAsWatched(target));
  const { checkin, isCheckingIn, isCheckedIn } = $derived(useCheckIn(target));
  const { watchCount } = $derived(useWatchCount({ type: "episode", show, episode }));

  const watchedAt = $derived(
    $history?.shows.get(show.id)?.episodes.find((entry) =>
      entry.episodeId === episode.id
    )?.watchedAt,
  );

  const onToggle = $derived(
    $isWatched
      ? confirm({
        type: ConfirmationType.RemoveFromWatched,
        title: label,
        onConfirm: () => removeWatched(),
      })
      : () => markAsWatched(),
  );
</script>

<ActionShell {label}>
  {#snippet header()}
    <div class="boxed-episode-state" class:is-watched={$isWatched}>
      <button
        type="button"
        class="boxed-episode-state-toggle"
        aria-pressed={$isWatched}
        aria-label={$isWatched
          ? m.button_label_remove_from_watched({ title: label })
          : m.button_label_mark_as_watched({ title: label })}
        disabled={!isWatchable || $isMarkingAsWatched}
        onclick={() => onToggle()}
      >
        <CheckIcon />
      </button>
      <div class="boxed-episode-state-text">
        <span class="boxed-episode-state-label">
          {$isWatched ? m.tag_text_watched() : m.button_text_mark_as_watched()}
        </span>
        <span class="boxed-episode-state-meta">
          {#if watchedAt}
            {toHumanDay({ date: watchedAt, locale: getLocale(), format: "short" })}
          {/if}
          {#if $watchCount > 1}
            · {m.boxed_title_watched_times({ count: $watchCount })}
          {/if}
        </span>
      </div>
    </div>
  {/snippet}

  {#snippet rating()}
    <ActionRating type="episode" id={episode.id} />
  {/snippet}

  {#if $isAuthorized}
    <ActionRow
      onclick={() =>
        logComposerStore.compose({
          type: "show",
          media: show,
          season: episode.season,
          episode: episode.number,
        })}
    >
      {m.boxed_title_log_or_review()}
    </ActionRow>
    <ActionRow
      onclick={() =>
        manageListsDrawerStore.open({
          target: { type: "episode", media: episode },
          title: label,
        })}
    >
      {m.button_text_manage_lists()}
    </ActionRow>
    <ActionRow
      onclick={() => isWatchable && !$isCheckingIn && !$isCheckedIn && checkin()}
    >
      {m.button_text_checkin()}
    </ActionRow>
  {/if}
  <ActionRow href={whereToWatchHref}>{m.button_text_where_to_watch()}</ActionRow>
  <ShareAction title={label} text={shareText} />
  {#if $isAuthorized}
    <ActionRow href={UrlBuilder.history.episode(show.slug, episode.season, episode.number)}>
      {m.boxed_title_your_activity()}
    </ActionRow>
  {/if}
</ActionShell>

<style>
  .boxed-episode-state {
    box-sizing: border-box;
    height: var(--ni-80);
    padding: var(--ni-16);

    display: flex;
    align-items: center;
    gap: var(--ni-14);
  }

  .boxed-episode-state-toggle {
    flex-shrink: 0;
    width: var(--ni-48);
    height: var(--ni-48);
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
      width: var(--ni-22);
      height: var(--ni-22);
    }

    &:hover:not(:disabled),
    &:focus-visible {
      box-shadow: inset 0 0 0 var(--border-thickness-xs) var(--boxed-color-watched);
      color: var(--boxed-color-watched);
    }

    .is-watched & {
      background: var(--boxed-color-watched);
      box-shadow: none;
      color: var(--shade-950);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .boxed-episode-state-text {
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
  }

  .boxed-episode-state-label {
    font-size: var(--ni-16);
    font-weight: 500;
    color: var(--color-text-primary);

    .is-watched & {
      color: var(--boxed-color-watched);
    }
  }

  .boxed-episode-state-meta {
    height: var(--ni-16);

    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    white-space: nowrap;
    color: var(--color-text-secondary);
  }
</style>
