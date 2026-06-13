<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
  import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
  import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
  import { movieRelatedQuery } from '$lib/requests/queries/movies/movieRelatedQuery.ts';
  import { showRelatedQuery } from '$lib/requests/queries/shows/showRelatedQuery.ts';
  import PosterGrid from '../PosterGrid.svelte';
  import PosterGridSkeleton from '../PosterGridSkeleton.svelte';
  import { map } from 'rxjs';

  type Props = { type: 'movie' | 'show'; slug: string };
  const { type, slug }: Props = $props();

  const query = $derived(
    useInfiniteQuery(
      type === 'movie'
        ? movieRelatedQuery({ slug, limit: 14 })
        : showRelatedQuery({ slug, limit: 14 }),
    ),
  );

  const entries = $derived(
    query.pipe(
      map(($q) =>
        ($q.data?.pages?.flatMap((p) => p.entries) ?? []) as ReadonlyArray<MovieEntry | ShowEntry>
      ),
    ),
  );
  const isLoading = $derived(
    query.pipe(map(($q) => $q.isLoading || ($q.isFetching && !$q.data))),
  );
</script>

<div class="film-related">
  {#if $isLoading && $entries.length === 0}
    <PosterGridSkeleton count={14} columns={7} />
  {:else if $entries.length === 0}
    <p class="film-related__empty">{m.related_empty()}</p>
  {:else}
    <PosterGrid entries={$entries} columns={7} />
  {/if}
</div>

<style lang="scss">
  .film-related {
    padding-top: var(--gap-m);

    &__empty {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: 0.95rem;
    }
  }
</style>
