<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
  import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
  import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
  import { watchlistQuery } from '$lib/requests/queries/users/watchlistQuery.ts';
  import PosterTile from '$lib/sections/film/PosterTile.svelte';
  import { map } from 'rxjs';

  type Props = { limit?: number };
  const { limit = 6 }: Props = $props();

  const query = useInfiniteQuery(watchlistQuery({ sortBy: 'added', limit, page: 1 }));

  const entries = $derived(
    query.pipe(
      map(($q) =>
        ($q.data?.pages?.flatMap((p) => p.entries) ?? [])
          .map((item) => {
            if (item.type === 'movie') return item.entry;
            if (item.type === 'show') return item.entry;
            return null;
          })
          .filter((entry): entry is MovieEntry | ShowEntry => Boolean(entry))
          .slice(0, limit),
      ),
    ),
  );
</script>

{#if $entries.length > 0}
  <section class="profile-watchlist-row">
    <header class="profile-watchlist-row__head">
      <p class="profile-watchlist-row__eyebrow">{m.profile_section_watchlist()}</p>
      <a class="profile-watchlist-row__more" href="/watchlist">{m.profile_view_all()}</a>
    </header>
    <ul class="profile-watchlist-row__grid">
      {#each $entries as entry (entry.key)}
        <li><PosterTile {entry} /></li>
      {/each}
    </ul>
  </section>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .profile-watchlist-row {
    padding-top: var(--gap-l);

    &__head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-bottom: var(--gap-s);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
      margin-bottom: var(--gap-m);
    }

    &__eyebrow {
      margin: 0;
      font-size: 0.72rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      font-weight: 700;
    }

    &__more {
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      text-decoration: none;
      font-weight: 700;

      &:hover { color: var(--color-watched); }
    }

    &__grid {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(
        auto-fill,
        minmax(min(var(--lb-poster-min-w), 100%), 1fr)
      );
      gap: var(--lb-grid-gap);
    }
  }
</style>
