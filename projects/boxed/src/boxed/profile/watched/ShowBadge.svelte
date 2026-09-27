<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { getShowWatchState } from "$lib/utils/media/getShowWatchState.ts";
  import type { PosterMedia } from "../../poster/PosterMedia.ts";
  import { toShowBadge } from "../_internal/toShowBadge.ts";

  const { media }: { media: PosterMedia } = $props();

  const { history, dropped } = useUser();

  const badge = $derived.by(() => {
    const state = getShowWatchState({
      watchedShow: $history?.shows.get(media.id),
      episodeCount: media.episode?.count,
    });

    return toShowBadge({
      watchedEpisodeCount: state.watchedEpisodeCount,
      episodeCount: media.episode?.count,
      isWatched: state.isWatched,
      isDropped: $dropped?.shows.has(media.id) ?? false,
    });
  });
</script>

{#if badge}
  <span class="boxed-show-badge" data-type={badge.type}>
    {#if badge.type === "completed"}
      {m.boxed_profile_badge_completed()}
    {:else if badge.type === "dropped"}
      {m.tag_text_dropped()}
    {:else}
      {m.boxed_profile_badge_progress({
        watched: badge.watched,
        total: badge.total,
      })}
    {/if}
  </span>
{/if}

<style>
  .boxed-show-badge {
    display: inline-flex;
    align-items: center;
    height: var(--ni-20);
    padding-inline: var(--ni-8);
    border-radius: var(--border-radius-xxl);
    background: var(--color-input-background);
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-11);
    font-weight: 600;
    color: var(--color-text-primary);
    white-space: nowrap;

    &[data-type="completed"] {
      background: color-mix(in srgb, var(--boxed-color-watched) 16%, transparent);
      color: var(--boxed-color-watched-text);
      font-family: inherit;
    }

    &[data-type="dropped"] {
      background: color-mix(in srgb, var(--boxed-color-liked) 16%, transparent);
      color: var(--boxed-color-liked-text);
      font-family: inherit;
    }
  }
</style>
