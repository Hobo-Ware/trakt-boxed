<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { useInfiniteQuery, useQuery } from '$lib/features/query/useQuery.ts';
  import { movieCommentsQuery } from '$lib/requests/queries/movies/movieCommentsQuery.ts';
  import { movieListsQuery } from '$lib/requests/queries/movies/movieListsQuery.ts';
  import { movieStatsQuery } from '$lib/requests/queries/movies/movieStatsQuery.ts';
  import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
  import { movieWatchersQuery } from '$lib/requests/queries/movies/movieWatchersQuery.ts';
  import { showCommentsQuery } from '$lib/requests/queries/shows/showCommentsQuery.ts';
  import { showListsQuery } from '$lib/requests/queries/shows/showListsQuery.ts';
  import { showStatsQuery } from '$lib/requests/queries/shows/showStatsQuery.ts';
  import { showSummaryQuery } from '$lib/requests/queries/shows/showSummaryQuery.ts';
  import { showWatchersQuery } from '$lib/requests/queries/shows/showWatchersQuery.ts';
  import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
  import { combineLatest, map } from 'rxjs';
  import EntityFacetLayout from './EntityFacetLayout.svelte';
  import type { FacetKey } from './EntityFacetNav.svelte';
  import EntityFacetSkeleton from './EntityFacetSkeleton.svelte';

  type Props = {
    kind: 'movie' | 'show';
    slug: string;
    facet: FacetKey;
  };

  const { kind, slug, facet }: Props = $props();

  const summary = $derived.by(() =>
    kind === 'movie'
      ? useQuery(movieSummaryQuery({ slug }))
      : useQuery(showSummaryQuery({ slug })),
  );

  const watchers = $derived.by(() =>
    kind === 'movie'
      ? useQuery(movieWatchersQuery({ slug }))
      : useQuery(showWatchersQuery({ slug })),
  );

  const stats = $derived.by(() =>
    kind === 'movie'
      ? useQuery(movieStatsQuery({ slug }))
      : useQuery(showStatsQuery({ slug })),
  );

  const comments = $derived.by(() =>
    kind === 'movie'
      ? useInfiniteQuery(movieCommentsQuery({ slug, sort: 'newest', limit: 20 }))
      : useInfiniteQuery(showCommentsQuery({ slug, sort: 'newest', limit: 20 })),
  );

  const lists = $derived.by(() =>
    kind === 'movie'
      ? useInfiniteQuery(movieListsQuery({ slug, limit: 20 }))
      : useInfiniteQuery(showListsQuery({ slug, limit: 20 })),
  );

  const titleState = $derived(
    combineLatest([summary]).pipe(
      map(([$summary]) => $summary.data),
    ),
  );

  const watchersData = $derived(watchers.pipe(map(($q) => $q.data ?? [])));
  const statsData = $derived(stats.pipe(map(($q) => $q.data)));
  const commentsData = $derived(
    comments.pipe(
      map(($q) => $q.data?.pages?.flatMap((page) => page.entries) ?? []),
    ),
  );
  const listsData = $derived(
    lists.pipe(
      map(($q) => $q.data?.pages?.flatMap((page) => page.entries) ?? []),
    ),
  );

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const truncate = (text: string, limit = 320) =>
    text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
</script>

{#if !$titleState}
  <EntityFacetSkeleton />
{:else}
  {@const title = $titleState.title}
  {@const year = $titleState.year}
  {@const posterUrl = $titleState.poster?.url?.thumb}

  <EntityFacetLayout {kind} {slug} {title} {year} {posterUrl} activeFacet={facet}>
    {#if facet === 'members'}
      {@const members = $watchersData}
      {#if members.length === 0}
        <p class="facet-empty">{m.facet_empty_members()}</p>
      {:else}
        <ul class="facet-people">
          {#each members as user (user.id)}
            <li>
              <a class="facet-people__chip" href={UrlBuilder.profile.user(user.slug ?? user.username)}>
                {#if user.avatar?.url}
                  <img src={user.avatar.url} alt={user.username} />
                {/if}
                <span>{user.name?.full || `@${user.username}`}</span>
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    {:else if facet === 'fans'}
      {@const fans = $watchersData}
      {#if $statsData}
        <p class="facet-summary">
          {m.facet_fans_summary({ count: toHumanNumber($statsData.watchers) })}
        </p>
      {/if}
      {#if fans.length === 0}
        <p class="facet-empty">{m.facet_empty_fans()}</p>
      {:else}
        <ul class="facet-people">
          {#each fans as user (user.id)}
            <li>
              <a class="facet-people__chip" href={UrlBuilder.profile.user(user.slug ?? user.username)}>
                {#if user.avatar?.url}
                  <img src={user.avatar.url} alt={user.username} />
                {/if}
                <span>{user.name?.full || `@${user.username}`}</span>
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    {:else if facet === 'likes'}
      {#if $statsData}
        <p class="facet-summary">
          {m.facet_likes_summary({
            count: toHumanNumber($statsData.favorited),
            voters: toHumanNumber($statsData.votes),
          })}
        </p>
        <ul class="facet-stats">
          <li><dt>Plays</dt><dd>{toHumanNumber($statsData.plays)}</dd></li>
          <li><dt>Comments</dt><dd>{toHumanNumber($statsData.comments)}</dd></li>
          <li><dt>Lists</dt><dd>{toHumanNumber($statsData.lists)}</dd></li>
          <li><dt>Watchers</dt><dd>{toHumanNumber($statsData.watchers)}</dd></li>
        </ul>
      {:else}
        <p class="facet-empty">{m.facet_empty_likes()}</p>
      {/if}
    {:else if facet === 'reviews'}
      {@const reviews = $commentsData}
      {#if reviews.length === 0}
        <p class="facet-empty">{m.facet_empty_reviews()}</p>
      {:else}
        <ul class="facet-reviews">
          {#each reviews as review (review.id)}
            <li class="facet-reviews__item">
              <header class="facet-reviews__head">
                <a class="facet-reviews__author" href={UrlBuilder.profile.user(review.user.slug ?? review.user.username)}>
                  {#if review.user.avatar?.url}
                    <img src={review.user.avatar.url} alt={review.user.username} />
                  {/if}
                  <span>{review.user.name?.full || `@${review.user.username}`}</span>
                </a>
                <time class="facet-reviews__date">{dateFormatter.format(review.createdAt)}</time>
              </header>
              <p class="facet-reviews__body">{truncate(review.comment)}</p>
            </li>
          {/each}
        </ul>
      {/if}
    {:else if facet === 'lists'}
      {@const items = $listsData}
      {#if items.length === 0}
        <p class="facet-empty">{m.facet_empty_lists()}</p>
      {:else}
        <ul class="facet-lists">
          {#each items as item (item.id)}
            <li class="facet-lists__item">
              <a
                class="facet-lists__link"
                href={UrlBuilder.users(item.user.slug ?? item.user.username).lists(item.slug)}
              >
                <span class="facet-lists__name">{item.name}</span>
                <span class="facet-lists__meta">
                  {item.user.name?.full || `@${item.user.username}`} ·
                  {toHumanNumber(item.count)} items ·
                  ♥ {toHumanNumber(item.likeCount)}
                </span>
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    {/if}
  </EntityFacetLayout>
{/if}

<style lang="scss">
  .facet-empty {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 0.95rem;
  }

  .facet-summary {
    margin: 0 0 var(--gap-m);
    color: var(--color-text-primary);
    font-size: 1rem;
    letter-spacing: 0.02em;
  }

  .facet-people {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xs);

    &__chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px 4px 4px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--shade-900) 80%, transparent);
      color: var(--color-text-primary);
      text-decoration: none;
      font-size: 0.85rem;
      border: 1px solid color-mix(in srgb, var(--shade-10) 6%, transparent);

      img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        object-fit: cover;
      }

      &:hover { border-color: var(--color-background-green, var(--green-500)); }
    }
  }

  .facet-stats {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--gap-m);

    li {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: var(--gap-s);
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);
      border-radius: 3px;
    }

    dt {
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      font-weight: 700;
    }

    dd {
      margin: 0;
      font-family: var(--font-family-serif, Georgia, serif);
      font-size: 1.6rem;
      color: var(--color-text-primary);
    }
  }

  .facet-reviews {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    &__item {
      padding: var(--gap-m);
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);
      border-radius: 3px;
      border: 1px solid color-mix(in srgb, var(--shade-10) 6%, transparent);
    }

    &__head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--gap-s);
    }

    &__author {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--color-text-primary);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.85rem;

      img {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
      }

      &:hover { color: var(--color-background-green, var(--green-500)); }
    }

    &__date {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }

    &__body {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.55;
      color: var(--color-text-primary);
    }
  }

  .facet-lists {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    &__link {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: var(--gap-s) var(--gap-m);
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);
      border-radius: 3px;
      text-decoration: none;
      color: var(--color-text-primary);
      border: 1px solid color-mix(in srgb, var(--shade-10) 6%, transparent);

      &:hover { border-color: var(--color-background-green, var(--green-500)); }
    }

    &__name {
      font-family: var(--font-family-serif, Georgia, serif);
      font-size: 1.15rem;
    }

    &__meta {
      font-size: 0.78rem;
      color: var(--color-text-secondary);
    }
  }
</style>
