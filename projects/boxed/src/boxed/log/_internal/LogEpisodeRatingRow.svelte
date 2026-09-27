<script lang="ts">
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import { useRatings } from "$lib/sections/summary/components/rating/useRatings.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import RatingScrub from "../../components/RatingScrub.svelte";

  type LogEpisodeRatingRowProps = {
    episode: EpisodeEntry;
    rating: number | null;
    isVisible: boolean;
    onChange: (rating: number | null) => void;
    register: (key: number, submit: () => Promise<void>) => () => void;
  };

  const { episode, rating, isVisible, onChange, register }:
    LogEpisodeRatingRowProps = $props();

  const { addRating } = $derived(useRatings({ type: "episode", id: episode.id }));

  $effect(() =>
    register(episode.id, async () => {
      if (rating !== null) addRating(rating);
    })
  );
</script>

{#if isVisible}
  <div class="boxed-episode-rating">
    <RatingScrub
      label={`${episodeNumberLabel({ seasonNumber: episode.season, episodeNumber: episode.number })}${episode.title ? ` · ${episode.title}` : ""}`}
      {rating}
      {onChange}
    />
  </div>
{/if}

<style>
  .boxed-episode-rating {
    padding-block: var(--ni-8);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);
  }
</style>
