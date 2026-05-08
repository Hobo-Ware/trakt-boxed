<script lang="ts">
  /*
    The diary feed: every watched film and episode in chronological
    order with date headers. Lives one mode-toggle away from showing
    movies-only or shows-only — both are first-class.
  */
  import * as m from "$lib/features/i18n/messages.ts";
  import { useRecentlyWatchedList } from "$lib/sections/lists/stores/useRecentlyWatchedList";
  import { getActivityTime } from "$lib/sections/lists/stores/_internal/getActivityTime";
  import { getDayKey } from "$lib/utils/date/getDayKey";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import DiaryEntryCard from "./DiaryEntryCard.svelte";

  const { mode }: { mode: DiscoverMode } = $props();

  const { list } = $derived(useRecentlyWatchedList({ type: mode }));

  const groups = $derived.by(() => {
    const items = $list ?? [];
    const byDay = new Map<
      string,
      { date: Date; entries: typeof items }
    >();

    for (const entry of items) {
      const date = getActivityTime(entry);
      const key = getDayKey(date);
      const bucket = byDay.get(key) ?? { date, entries: [] };
      bucket.entries.push(entry);
      byDay.set(key, bucket);
    }

    return Array.from(byDay.values()).toSorted(
      (a, b) => b.date.getTime() - a.date.getTime(),
    );
  });
</script>

<div class="trakt-diary">
  {#if groups.length === 0}
    <p class="secondary trakt-diary-empty">
      {m.text_diary_empty()}
    </p>
  {:else}
    {#each groups as group (group.date.toISOString())}
      <section class="trakt-diary-day">
        {#each group.entries as entry (entry.id)}
          <DiaryEntryCard {entry} />
        {/each}
      </section>
    {/each}
  {/if}
</div>

<style>
  .trakt-diary {
    width: 100%;
    max-width: var(--ni-720);
    margin-inline: auto;

    padding-inline: var(--layout-distance-side);
    padding-block: var(--gap-l);
  }

  .trakt-diary-day {
    display: flex;
    flex-direction: column;
  }

  .trakt-diary-empty {
    text-align: center;
    padding-block: var(--gap-xxl);
  }
</style>
