<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
  import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
  import { movieActivityHistoryQuery } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
  import PosterGrid from '$lib/sections/film/PosterGrid.svelte';
  import PosterGridSkeleton from '$lib/sections/film/PosterGridSkeleton.svelte';
  import { map } from 'rxjs';

  type Props = { slug: string };
  const { slug }: Props = $props();

  const query = useInfiniteQuery(movieActivityHistoryQuery({ slug, limit: 35, page: 1 }));

  // History returns one row per watch event; dedupe by movie id so each film
  // appears once, ordered by most-recent watch.
  const entries = $derived(
    query.pipe(
      map(($q) => {
        const seen = new Set<number>();
        const out: MovieEntry[] = [];
        for (const entry of $q.data?.pages?.flatMap((p) => p.entries) ?? []) {
          if (seen.has(entry.movie.id)) continue;
          seen.add(entry.movie.id);
          out.push(entry.movie);
        }
        return out;
      }),
    ),
  );
  const isLoading = $derived(
    query.pipe(map(($q) => $q.isLoading || ($q.isFetching && !$q.data))),
  );
</script>

<div class="profile-films-tab">
  {#if $isLoading && $entries.length === 0}
    <PosterGridSkeleton count={35} columns={7} />
  {:else if $entries.length === 0}
    <p class="profile-films-tab__empty">{m.profile_films_empty()}</p>
  {:else}
    <PosterGrid entries={$entries} columns={7} />
  {/if}
</div>

<style lang="scss">
  .profile-films-tab {
    padding-top: var(--gap-l);

    &__empty {
      margin: 0;
      padding: var(--gap-l) 0;
      text-align: center;
      color: var(--color-text-secondary);
    }
  }
</style>
