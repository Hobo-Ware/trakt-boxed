<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { getLocale } from "$lib/features/i18n";
  import { toRelativeHumanDay } from "$lib/utils/formatting/date/toRelativeHumanDay.ts";
  import LoadMore from "$boxed/components/LoadMore.svelte";
  import ActivityRow from "./ActivityRow.svelte";
  import type { ActivityEvent } from "./ActivityEvent.ts";
  import { toActivityDays } from "./_internal/toActivityDays.ts";

  const SKELETON_ROWS = 8;

  type ActivityFeedProps = {
    events: ReadonlyArray<ActivityEvent> | null;
    emptyText: string;
    hasNextPage: boolean;
    isLoading: boolean;
    loadedCount: number;
    onLoad: () => unknown;
  };

  const {
    events,
    emptyText,
    hasNextPage,
    isLoading,
    loadedCount,
    onLoad,
  }: ActivityFeedProps = $props();

  const now = new Date();
  const days = $derived(events ? toActivityDays(events) : null);
</script>

<div class="boxed-activity-feed">
  {#if days === null}
    <section aria-hidden="true">
      <h2 class="activity-day"><Skeleton width="var(--ni-72)" height="var(--ni-12)" /></h2>
      <ul class="activity-rows">
        {#each { length: SKELETON_ROWS }, index (index)}
          <li class="activity-skeleton">
            <Skeleton width="var(--ni-40)" height="var(--ni-40)" radius="50%" />
            <span class="skeleton-body">
              <Skeleton width="70%" height="var(--ni-16)" />
              <Skeleton width="var(--ni-60)" height="var(--ni-11)" />
            </span>
            <Skeleton width="var(--ni-44)" height="var(--ni-66)" />
          </li>
        {/each}
      </ul>
    </section>
  {:else if days.length === 0}
    <p class="activity-empty">{emptyText}</p>
  {:else}
    {#each days as day (day.key)}
      <section>
        <h2 class="activity-day">
          {toRelativeHumanDay(now, day.date, getLocale())}
        </h2>
        <ul class="activity-rows">
          {#each day.events as event (event.key)}
            <ActivityRow {event} {now} />
          {/each}
        </ul>
      </section>
    {/each}
  {/if}
</div>

<LoadMore {hasNextPage} {isLoading} {loadedCount} {onLoad} />

<style>
  .boxed-activity-feed {
    display: flex;
    flex-direction: column;
    gap: var(--ni-28);
    min-height: calc(var(--ni-40) + 8 * var(--ni-96));
  }

  section {
    display: flex;
    flex-direction: column;
  }

  .activity-day {
    margin: 0;
    min-height: var(--ni-24);
    padding-bottom: var(--ni-10);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);

    font-size: var(--ni-12);
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .activity-rows {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .activity-skeleton {
    display: flex;
    align-items: flex-start;
    gap: var(--ni-14);
    padding-block: var(--ni-14);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);
  }

  .skeleton-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--ni-10);
    padding-top: var(--ni-6);
  }

  .activity-empty {
    margin: 0;
    min-height: var(--ni-240);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--color-text-secondary);
  }
</style>
