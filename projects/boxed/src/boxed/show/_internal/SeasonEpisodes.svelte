<script lang="ts">
  import { toWatchedEpisodeIds } from "./toWatchedEpisodeIds.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { useOfflineActions } from "$lib/features/offline/useOfflineActions.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import SectionHeader from "../../components/SectionHeader.svelte";
  import { findUpNextEpisode } from "./findUpNextEpisode.ts";
  import SeasonEpisodeRow from "./SeasonEpisodeRow.svelte";
  import SeasonEpisodeRowSkeleton from "./SeasonEpisodeRowSkeleton.svelte";

  type SeasonEpisodesProps = {
    show: ShowEntry;
    episodes: ReadonlyArray<EpisodeEntry> | null;
    expectedCount: number;
  };

  const { show, episodes, expectedCount }: SeasonEpisodesProps = $props();

  const { history, ratings } = useUser();
  const { actions } = useOfflineActions();
  const now = new Date();

  const watchedIds = $derived(
    toWatchedEpisodeIds({
      history: $history,
      showId: show.id,
      episodeIds: episodes?.map((episode) => episode.id) ?? [],
      actions: $actions,
    }),
  );
  const upNextId = $derived(
    episodes ? findUpNextEpisode({ episodes, watchedIds, now })?.id : undefined,
  );
</script>

<section class="boxed-season-episodes">
  <SectionHeader title={m.list_title_episodes()} />

  <ol class="boxed-season-episode-list">
    {#if episodes === null}
      {#each { length: Math.max(expectedCount, 1) }, index (index)}
        <SeasonEpisodeRowSkeleton />
      {/each}
    {:else}
      {#each episodes as episode (episode.id)}
        <SeasonEpisodeRow
          {show}
          {episode}
          {now}
          isWatched={watchedIds.has(episode.id)}
          isUpNext={episode.id === upNextId}
          userRating={$ratings?.episodes.get(episode.id)?.rating ?? null}
        />
      {/each}
    {/if}
  </ol>
</section>

<style>
  .boxed-season-episode-list {
    margin: 0;
    padding: 0;
    list-style: none;

    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
  }
</style>
