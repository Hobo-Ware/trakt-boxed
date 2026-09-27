<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UpNextEntry } from "$lib/requests/models/UpNextEntry.ts";
  import { useUpNextList } from "$lib/sections/lists/progress/useUpNextList.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import PosterSkeleton from "../../poster/PosterSkeleton.svelte";
  import PosterTile from "../../poster/PosterTile.svelte";
  import NowWatchingCard from "./NowWatchingCard.svelte";

  const IN_PROGRESS_SHOWN = 3;

  const { slug }: { slug: string } = $props();

  const { list, isLoading } = useUpNextList({
    type: "show",
    limit: IN_PROGRESS_SHOWN,
  });

  const entries = $derived(
    $list
      .filter((entry): entry is UpNextEntry => "show" in entry)
      .slice(0, IN_PROGRESS_SHOWN),
  );
</script>

<div class="boxed-currently-watching">
  <NowWatchingCard {slug} />
  <div class="in-progress">
    {#if $isLoading && entries.length === 0}
      {#each { length: IN_PROGRESS_SHOWN }, index (index)}
        <PosterSkeleton showUserMeta />
      {/each}
    {:else}
      {#each entries as entry (entry.show.key)}
        {#snippet next()}
          <span class="in-progress-next">
            {m.boxed_profile_next_episode({
              code: episodeNumberLabel({
                seasonNumber: entry.season,
                episodeNumber: entry.number,
              }),
            })}
          </span>
        {/snippet}
        <PosterTile media={{ ...entry.show, type: "show" }} meta={next} />
      {/each}
    {/if}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-currently-watching {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
    gap: var(--gap-m);

    @include for-mobile {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .in-progress {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--gap-s);
  }

  .in-progress-next {
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-11);
    color: var(--color-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
