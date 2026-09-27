<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import type { UpcomingEpisodeEntry } from "$lib/requests/queries/calendars/upcomingEpisodesQuery.ts";
  import { useUpcomingItems } from "$lib/sections/lists/stores/useUpcomingItems.ts";
  import { toRelativeHumanDay } from "$lib/utils/formatting/date/toRelativeHumanDay.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { map, of } from "rxjs";
  import PosterRow from "../../poster/PosterRow.svelte";
  import type { PosterMedia } from "../../poster/PosterMedia.ts";
  import { uniqueByKey } from "../../utils/uniqueByKey.ts";

  type Upcoming = MediaEntry | UpcomingEpisodeEntry;

  const { list, isLoading } = useUpcomingItems({
    type: "media",
    limit: 12,
    episodeType: of("all"),
  });

  const today = new Date();

  type UpcomingPoster = { media: PosterMedia; label: string };

  const toUpcomingPoster = (item: Upcoming): UpcomingPoster => {
    if (!("show" in item)) {
      return {
        media: item as PosterMedia,
        label: toRelativeHumanDay(today, item.effectiveReleaseDate, getLocale()),
      };
    }

    const day = toRelativeHumanDay(today, item.airDate, getLocale());
    const code = episodeNumberLabel({
      seasonNumber: item.season,
      episodeNumber: item.number,
    });
    return { media: item.show, label: `${day} · ${code}` };
  };

  const upcoming = list.pipe(
    map(($list) =>
      uniqueByKey($list.map(toUpcomingPoster), (entry) => entry.media.key)
    ),
  );

  const labelByKey = $derived(
    new Map($upcoming.map((entry) => [entry.media.key, entry.label])),
  );
  const posters = $derived($upcoming.map((entry) => entry.media));
</script>

{#snippet upcomingMeta(media: PosterMedia)}
  <span class="boxed-upcoming-label">{labelByKey.get(media.key) ?? ""}</span>
{/snippet}

<PosterRow
  label={m.boxed_home_out_this_week()}
  emptyText={m.text_placeholder_generic()}
  items={$isLoading ? null : posters}
  meta={upcomingMeta}
/>

<style>
  .boxed-upcoming-label {
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
