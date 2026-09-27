<script lang="ts">
  import LoadMore from "$boxed/profile/LoadMore.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useLeaderboard } from "$lib/sections/profile/stores/useLeaderboard.ts";
  import LeaderboardRow from "./_internal/LeaderboardRow.svelte";

  const PAGE_SIZE = 50;
  const SKELETON_ROWS = 10;

  const { list, isLoading, hasNextPage, fetchNextPage } = useLeaderboard({
    slug: "me",
    limit: PAGE_SIZE,
  });

  const entries = $derived($isLoading && $list.length === 0 ? null : $list);
</script>

<ul class="boxed-members-leaderboard" aria-busy={entries === null}>
  {#if entries === null}
    {#each { length: SKELETON_ROWS }, index (index)}
      <li class="leaderboard-skeleton" aria-hidden="true">
        <Skeleton width="var(--ni-28)" height="var(--ni-14)" />
        <span class="skeleton-identity">
          <Skeleton width="var(--ni-44)" height="var(--ni-44)" radius="50%" />
          <span class="skeleton-names">
            <Skeleton width="var(--ni-144)" height="var(--ni-16)" />
            <Skeleton width="var(--ni-96)" height="var(--ni-12)" />
          </span>
        </span>
      </li>
    {/each}
  {:else if entries.length === 0}
    <li class="leaderboard-empty">{m.boxed_members_empty()}</li>
  {:else}
    {#each entries as entry (entry.key)}
      <LeaderboardRow {entry} />
    {/each}
  {/if}
</ul>

<LoadMore
  hasNextPage={Boolean($hasNextPage)}
  isLoading={$isLoading}
  loadedCount={$list.length}
  onLoad={fetchNextPage}
/>

<style lang="scss">
  .boxed-members-leaderboard {
    --boxed-leaderboard-row-height: var(--ni-72);

    margin: 0;
    padding: 0;
    list-style: none;

    display: flex;
    flex-direction: column;
    min-height: calc(10 * var(--boxed-leaderboard-row-height));
  }

  .leaderboard-skeleton {
    height: var(--boxed-leaderboard-row-height);
    box-sizing: border-box;
    padding-inline: var(--ni-12);

    display: grid;
    grid-template-columns: var(--ni-40) minmax(0, 1fr);
    align-items: center;
    gap: var(--gap-m);

    border-bottom: var(--border-thickness-xxs) solid var(--color-border);

    :global(.trakt-skeleton:first-child) {
      justify-self: center;
    }
  }

  .skeleton-identity {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .skeleton-names {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
  }

  .leaderboard-empty {
    min-height: calc(10 * var(--boxed-leaderboard-row-height));
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--color-text-secondary);
  }
</style>
