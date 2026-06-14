<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
  import { movieActivityHistoryQuery } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
  import PosterGrid from '$lib/sections/film/PosterGrid.svelte';
  import PosterGridSkeleton from '$lib/sections/film/PosterGridSkeleton.svelte';
  import { map } from 'rxjs';

  type Props = { slug: string };
  const { slug }: Props = $props();

  const query = useInfiniteQuery(movieActivityHistoryQuery({ slug, limit: 35, page: 1 }));

  const entries = $derived(
    query.pipe(
      map(($q) => ($q.data?.pages?.flatMap((p) => p.entries) ?? []).map((entry) => entry.movie)),
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
