<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
  import { activityHistoryQuery } from '$lib/requests/queries/users/activityHistoryQuery.ts';
  import { socialActivityQuery } from '$lib/requests/queries/users/socialActivityQuery.ts';
  import ProfileFriendsActivityRow from './ProfileFriendsActivityRow.svelte';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
  import { map } from 'rxjs';

  type Props = { slug: string; isMe: boolean };
  const { slug, isMe }: Props = $props();

  type Scope = 'you' | 'friends';
  let scope = $state<Scope>('you');

  const ownQuery = useInfiniteQuery(activityHistoryQuery({ slug, limit: 30, page: 1 }));
  const ownItems = $derived(
    ownQuery.pipe(map(($q) => $q.data?.pages?.flatMap((p) => p.entries) ?? [])),
  );
  const ownLoading = $derived(
    ownQuery.pipe(map(($q) => $q.isLoading || ($q.isFetching && !$q.data))),
  );

  const friendsQuery = useInfiniteQuery(socialActivityQuery({ limit: 20, page: 1 }));
  const friendsItems = $derived(
    friendsQuery.pipe(map(($q) => $q.data?.pages?.flatMap((p) => p.entries) ?? [])),
  );
  const friendsLoading = $derived(
    friendsQuery.pipe(map(($q) => $q.isLoading || ($q.isFetching && !$q.data))),
  );

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
</script>

<section class="profile-activity">
  {#if isMe}
    <div class="profile-activity__tabs" role="tablist" aria-label="Activity scope">
      <button
        type="button"
        role="tab"
        class="profile-activity__tab"
        data-active={scope === 'you' ? 'true' : undefined}
        aria-selected={scope === 'you'}
        onclick={() => (scope = 'you')}
      >{m.activity_scope_you()}</button>
      <button
        type="button"
        role="tab"
        class="profile-activity__tab"
        data-active={scope === 'friends' ? 'true' : undefined}
        aria-selected={scope === 'friends'}
        onclick={() => (scope = 'friends')}
      >{m.activity_scope_friends()}</button>
    </div>
  {/if}

  {#if scope === 'you' || !isMe}
    {#if $ownLoading && $ownItems.length === 0}
      <ul class="profile-activity__list">
        {#each Array.from({ length: 6 }) as _, i (i)}
          <li class="profile-activity__skeleton">
            <div class="profile-activity__sk-poster"></div>
            <div class="profile-activity__sk-body">
              <div></div>
              <div></div>
            </div>
          </li>
        {/each}
      </ul>
    {:else if $ownItems.length === 0}
      <p class="profile-activity__empty">{m.profile_activity_empty()}</p>
    {:else}
      <ul class="profile-activity__list">
        {#each $ownItems as item (item.key)}
          {@const isEpisode = item.type === 'episode'}
          {@const target = isEpisode
            ? {
                title: item.show.title,
                year: item.show.year,
                poster: item.show.poster?.url?.thumb,
                href: UrlBuilder.show(item.show.slug, { season: item.episode.season }),
              }
            : {
                title: item.movie.title,
                year: item.movie.year,
                poster: item.movie.poster?.url?.thumb,
                href: UrlBuilder.movie(item.movie.slug),
              }}
          {@const episodeLabel = isEpisode
            ? `S${String(item.episode.season).padStart(2, '0')}E${String(item.episode.number).padStart(2, '0')}`
            : null}
          <li class="profile-activity__row">
            <a class="profile-activity__poster" href={target.href} aria-label={target.title}>
              {#if target.poster}
                <img src={target.poster} alt={target.title} loading="lazy" />
              {:else}
                <span aria-hidden="true">{target.title.charAt(0)}</span>
              {/if}
            </a>
            <div class="profile-activity__body">
              <p class="profile-activity__verb">{m.activity_verb_watched()}</p>
              <a class="profile-activity__title" href={target.href}>
                {target.title}
                {#if target.year}<span class="profile-activity__year">{target.year}</span>{/if}
                {#if episodeLabel}<span class="profile-activity__episode">{episodeLabel}</span>{/if}
              </a>
              <time class="profile-activity__time" datetime={item.watchedAt.toISOString()}>
                {dateFormatter.format(item.watchedAt)}
              </time>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  {:else}
    {#if $friendsLoading && $friendsItems.length === 0}
      <ul class="profile-activity__list">
        {#each Array.from({ length: 6 }) as _, i (i)}
          <li class="profile-activity__skeleton">
            <div class="profile-activity__sk-poster"></div>
            <div class="profile-activity__sk-body">
              <div></div>
              <div></div>
            </div>
          </li>
        {/each}
      </ul>
    {:else if $friendsItems.length === 0}
      <p class="profile-activity__empty">{m.profile_activity_friends_empty()}</p>
    {:else}
      <ul class="profile-activity__list">
        {#each $friendsItems as activity (activity.key)}
          <li><ProfileFriendsActivityRow {activity} /></li>
        {/each}
      </ul>
    {/if}
  {/if}
</section>

<style lang="scss">
  .profile-activity {
    padding-top: var(--gap-l);
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    &__tabs {
      display: flex;
      gap: var(--gap-m);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
    }

    &__tab {
      all: unset;
      cursor: pointer;
      padding: 8px 0;
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      position: relative;

      &:hover { color: var(--color-text-primary); }

      &[data-active='true'] {
        color: var(--color-text-primary);

        &::after {
          content: '';
          position: absolute;
          inset: auto 0 -1px 0;
          height: 2px;
          background: var(--color-watched);
        }
      }
    }

    &__empty {
      margin: 0;
      padding: var(--gap-l) 0;
      text-align: center;
      color: var(--color-text-secondary);
    }

    &__list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    &__row {
      display: grid;
      grid-template-columns: 56px 1fr;
      gap: var(--gap-m);
      padding: var(--gap-s) 0;
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 5%, transparent);
    }

    &__poster {
      width: 56px;
      aspect-ratio: 2 / 3;
      border-radius: 3px;
      overflow: hidden;
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: var(--color-text-secondary);

      img { width: 100%; height: 100%; object-fit: cover; }

      span {
        font-family: var(--font-family-serif, Georgia, serif);
        font-size: 1.1rem;
      }
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    &__verb {
      margin: 0;
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      font-weight: 700;
    }

    &__title {
      font-family: var(--font-family-serif, Georgia, serif);
      font-size: 1.05rem;
      line-height: 1.2;
      color: var(--color-text-primary);
      text-decoration: none;

      &:hover { color: var(--color-watched); }
    }

    &__year,
    &__episode {
      font-family: var(--font-family-sans, system-ui, sans-serif);
      font-size: 0.8rem;
      color: var(--color-text-secondary);
      margin-left: 4px;
    }

    &__time {
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    &__skeleton {
      display: grid;
      grid-template-columns: 56px 1fr;
      gap: var(--gap-m);
      padding: var(--gap-s) 0;
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 5%, transparent);
    }

    &__sk-poster {
      width: 56px;
      aspect-ratio: 2 / 3;
      border-radius: 3px;
      background: var(--shade-900);
    }

    &__sk-body {
      display: flex;
      flex-direction: column;
      gap: 6px;

      div {
        height: calc(0.95rem * 1.4);
        background: var(--shade-900);
        border-radius: 2px;
      }

      div:first-child { width: 60%; }
      div:last-child { width: 40%; }
    }
  }
</style>
