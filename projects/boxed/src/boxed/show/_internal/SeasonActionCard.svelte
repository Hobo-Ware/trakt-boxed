<script lang="ts">
  import EyeIcon from "$lib/components/icons/EyeIcon.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import type { Season } from "$lib/requests/models/Season.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { manageListsDrawerStore } from "$lib/sections/components/lists-drawer/manageListsDrawerStore.ts";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { logComposerStore } from "../../log/logComposerStore.ts";
  import ActionShell from "../../title/ActionShell.svelte";
  import ActionRating from "../../title/_internal/ActionRating.svelte";
  import ActionRow from "../../title/_internal/ActionRow.svelte";
  import ShareAction from "../../title/_internal/ShareAction.svelte";

  type SeasonActionCardProps = {
    show: ShowEntry;
    season: Season;
    title: string;
    episodes: ReadonlyArray<EpisodeEntry>;
    watched: number;
    whereToWatchHref: string;
  };

  const {
    show,
    season,
    title,
    episodes,
    watched,
    whereToWatchHref,
  }: SeasonActionCardProps = $props();

  const { isAuthorized } = useAuth();
  const { confirm } = useConfirm();

  const now = Date.now();
  const aired = $derived(
    episodes.filter((episode) => episode.effectiveReleaseDate.getTime() <= now),
  );
  const total = $derived(season.episodes.aired);
  const isComplete = $derived(total > 0 && watched >= total);
  const ratio = $derived(total > 0 ? Math.min(watched / total, 1) : 0);
  const label = $derived(`${show.title} ${title}`);

  const target = $derived({
    type: "episode" as const,
    media: aired,
    show: { id: show.id, title: show.title },
  });

  const { markAsWatched, removeWatched, isMarkingAsWatched } = $derived(
    useMarkAsWatched(target),
  );

  const onToggleSeason = $derived(
    isComplete
      ? confirm({
        type: ConfirmationType.RemoveFromWatched,
        title: label,
        onConfirm: () => removeWatched(),
      })
      : confirm({
        type: ConfirmationType.MarkAsWatched,
        title: label,
        target,
        onConfirm: () => markAsWatched(),
      }),
  );
</script>

<ActionShell {label}>
  {#snippet header()}
    <div class="boxed-season-state" class:is-complete={isComplete}>
      <span class="boxed-season-state-label">
        <EyeIcon />
        {isComplete ? m.tag_text_watched() : m.boxed_show_your_progress()}
      </span>
      <span class="boxed-season-state-count">
        {m.boxed_show_episodes_watched({ watched, total })}
      </span>
      <span
        class="boxed-season-state-bar"
        style:--progress={`${Math.round(ratio * 100)}%`}
        aria-hidden="true"
      ></span>
    </div>
  {/snippet}

  {#snippet rating()}
    <ActionRating type="season" id={season.id} />
  {/snippet}

  {#if $isAuthorized}
    <ActionRow
      onclick={() =>
        logComposerStore.compose({ type: "show", media: show, season: season.number })}
    >
      {m.boxed_show_log_episodes()}
    </ActionRow>
    <ActionRow
      onclick={() =>
        manageListsDrawerStore.open({
          target: { type: "season", media: season },
          title: label,
        })}
    >
      {m.button_text_manage_lists()}
    </ActionRow>
    <ActionRow
      onclick={() => aired.length > 0 && !$isMarkingAsWatched && onToggleSeason()}
    >
      {isComplete ? m.boxed_show_season_watched() : m.boxed_show_mark_season_watched()}
    </ActionRow>
  {/if}
  <ActionRow href={whereToWatchHref}>{m.button_text_where_to_watch()}</ActionRow>
  <ShareAction title={label} text={m.text_share_show({ title: show.title })} />
  {#if $isAuthorized}
    <ActionRow href={UrlBuilder.history.show(show.slug)}>
      {m.boxed_title_your_activity()}
    </ActionRow>
  {/if}
</ActionShell>

<style>
  .boxed-season-state {
    box-sizing: border-box;
    height: var(--ni-72);
    padding: var(--ni-14) var(--ni-16);

    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-content: center;
    row-gap: var(--ni-10);

    --state-color: var(--color-text-primary);

    &.is-complete {
      --state-color: var(--boxed-color-watched-text);
    }
  }

  .boxed-season-state-label {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-8);

    font-size: var(--ni-14);
    color: var(--state-color);

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
      color: var(--boxed-color-watched-text);
    }
  }

  .boxed-season-state-count {
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .boxed-season-state-bar {
    grid-column: 1 / -1;
    position: relative;
    height: var(--ni-4);

    border-radius: var(--border-radius-xxl);
    background: var(--color-border);
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      width: var(--progress);
      border-radius: inherit;
      background: var(--boxed-color-watched);
    }
  }
</style>
