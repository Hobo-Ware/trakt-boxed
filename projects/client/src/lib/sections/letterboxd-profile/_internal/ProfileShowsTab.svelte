<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
  import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
  import { episodeActivityHistoryQuery } from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
  import PosterGrid from '$lib/sections/film/PosterGrid.svelte';
  import PosterGridSkeleton from '$lib/sections/film/PosterGridSkeleton.svelte';
  import { map } from 'rxjs';

  type Props = { slug: string };
  const { slug }: Props = $props();

  const query = useInfiniteQuery(
    episodeActivityHistoryQuery({ slug, limit: 60, page: 1 }),
  );

  // Episode history returns one row per watched episode. Dedupe by show id
  // so the grid shows distinct shows the user has watched, ordered by the
  // most recent episode watched.
  const entries = $derived(
    query.pipe(
      map(($q) => {
        const seen = new Set<number>();
        const out: ShowEntry[] = [];
        for (const entry of $q.data?.pages?.flatMap((p) => p.entries) ?? []) {
          if (seen.has(entry.show.id)) continue;
          seen.add(entry.show.id);
          out.push(entry.show);
        }
        return out;
      }),
    ),
  );

  const isLoading = $derived(
    query.pipe(map(($q) => $q.isLoading || ($q.isFetching && !$q.data))),
  );
</script>

<div class="profile-shows-tab">
  {#if $isLoading && $entries.length === 0}
    <PosterGridSkeleton count={35} columns={7} />
  {:else if $entries.length === 0}
    <p class="profile-shows-tab__empty">{m.profile_shows_empty()}</p>
  {:else}
    <PosterGrid entries={$entries} columns={7} />
  {/if}
</div>

<style lang="scss">
  .profile-shows-tab {
    padding-top: var(--gap-l);

    &__empty {
      margin: 0;
      padding: var(--gap-l) 0;
      text-align: center;
      color: var(--color-text-secondary);
    }
  }
</style>
