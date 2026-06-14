<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
  import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
  import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
  import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
  import { listItemsQuery } from '$lib/requests/queries/lists/listItemsQuery.ts';
  import PosterGrid from '$lib/sections/film/PosterGrid.svelte';
  import PosterGridSkeleton from '$lib/sections/film/PosterGridSkeleton.svelte';
  import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
  import { map } from 'rxjs';

  type Props = { list: MediaListSummary };
  const { list }: Props = $props();

  const items = $derived(
    useInfiniteQuery(listItemsQuery({ listId: String(list.id), limit: 60 })),
  );

  const entries = $derived(
    items.pipe(
      map(($q) =>
        ($q.data?.pages?.flatMap((p) => p.entries) ?? [])
          .map((item) => {
            if (item.type === 'movie') return item.entry;
            if (item.type === 'show') return item.entry;
            if (item.type === 'episode') return item.entry.show;
            if (item.type === 'season') return item.entry.show;
            return null;
          })
          .filter((entry): entry is MovieEntry | ShowEntry => Boolean(entry)),
      ),
    ),
  );

  const isLoading = $derived(
    items.pipe(map(($q) => $q.isLoading || ($q.isFetching && !$q.data))),
  );

  const author = $derived(list.user.name?.full || `@${list.user.username}`);
  const authorHref = $derived(
    UrlBuilder.profile.user(list.user.slug ?? list.user.username),
  );
</script>

<div class="list-view">
  <header class="list-view__head">
    <p class="list-view__eyebrow">{m.list_view_eyebrow()}</p>
    <h1 class="list-view__title">{list.name}</h1>
    <p class="list-view__meta">
      <a class="list-view__author" href={authorHref}>{author}</a>
      <span>·</span>
      <span>{toHumanNumber(list.count)} {m.list_view_items()}</span>
      <span>·</span>
      <span>♥ {toHumanNumber(list.likeCount)}</span>
    </p>
    {#if list.description}
      <p class="list-view__description">{list.description}</p>
    {/if}
  </header>

  <div class="list-view__body">
    {#if $isLoading && $entries.length === 0}
      <PosterGridSkeleton count={28} columns={7} />
    {:else if $entries.length === 0}
      <p class="list-view__empty">{m.list_view_empty()}</p>
    {:else}
      <PosterGrid entries={$entries} columns={7} />
    {/if}
  </div>
</div>

<style lang="scss">
  .list-view {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px);

    &__head {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
      padding-bottom: var(--gap-m);
      margin-bottom: var(--gap-l);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
      max-width: 80ch;
    }

    &__eyebrow {
      margin: 0;
      font-size: 0.72rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-watched);
      font-weight: 700;
    }

    &__title {
      margin: 0;
      font-family: var(--font-family-serif, "Tiempos Headline", Georgia, serif);
      font-weight: 400;
      font-size: clamp(2rem, 4.4vw, 3.4rem);
      line-height: 1.1;
      color: var(--color-text-primary);
    }

    &__meta {
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--gap-xs);
      font-size: 0.9rem;
      color: var(--color-text-secondary);
    }

    &__author {
      color: var(--color-text-primary);
      text-decoration: none;

      &:hover { color: var(--color-watched); }
    }

    &__description {
      margin: var(--gap-s) 0 0;
      font-size: 1rem;
      line-height: 1.55;
      color: var(--color-text-primary);
    }

    &__body { width: 100%; }

    &__empty {
      margin: 0;
      color: var(--color-text-secondary);
      text-align: center;
      padding: var(--gap-l) 0;
    }
  }
</style>
