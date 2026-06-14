<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { currentUserNetworkQuery } from '$lib/features/auth/queries/currentUserNetworkQuery.ts';
  import { useUser } from '$lib/features/auth/stores/useUser.ts';
  import { useQuery } from '$lib/features/query/useQuery.ts';
  import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
  import { followersQuery } from '$lib/requests/queries/users/followersQuery.ts';
  import { map } from 'rxjs';
  import * as m from '$lib/features/i18n/messages.ts';
  import ProfileActivityTab from './_internal/ProfileActivityTab.svelte';
  import ProfileFavoritesRow from './_internal/ProfileFavoritesRow.svelte';
  import ProfileFilmsTab from './_internal/ProfileFilmsTab.svelte';
  import ProfileHero from './_internal/ProfileHero.svelte';
  import ProfileNetworkTab from './_internal/ProfileNetworkTab.svelte';
  import ProfileReviewsTab from './_internal/ProfileReviewsTab.svelte';
  import ProfileShowsTab from './_internal/ProfileShowsTab.svelte';
  import ProfileStats from './_internal/ProfileStats.svelte';
  import ProfileSubNav from './_internal/ProfileSubNav.svelte';
  import {
    readProfileTab,
    writeProfileTab,
    type ProfileTab,
  } from './_internal/profileTabs.ts';
  import ProfileWatchlistRow from './_internal/ProfileWatchlistRow.svelte';

  type Props = {
    profile: UserProfile;
    slug: string;
    isMe: boolean;
  };

  const { profile, slug, isMe }: Props = $props();

  const activeTab = $derived<ProfileTab>(readProfileTab(page.url.searchParams));

  const selectTab = (tab: ProfileTab) => {
    const next = writeProfileTab(page.url, tab);
    void goto(`${next.pathname}${next.search}`, {
      replaceState: true,
      noScroll: true,
      keepFocus: true,
    });
  };

  const { history } = useUser();
  const watchedMovies = $derived(
    history.pipe(map(($h) => (isMe ? $h?.movies.size ?? null : null))),
  );
  const watchedShows = $derived(
    history.pipe(map(($h) => (isMe ? $h?.shows.size ?? null : null))),
  );

  const followingQuery = useQuery(currentUserNetworkQuery());
  const followingCount = $derived(
    followingQuery.pipe(map(($q) => (isMe ? $q.data?.following.length ?? null : null))),
  );

  const followers = useQuery(followersQuery({ slug }));
  const followersCount = $derived(
    followers.pipe(map(($q) => $q.data?.length ?? null)),
  );

  const stats = $derived([
    { key: 'films', label: m.profile_stat_films(), value: $watchedMovies },
    { key: 'shows', label: m.profile_stat_shows(), value: $watchedShows },
    { key: 'following', label: m.profile_stat_following(), value: $followingCount },
    { key: 'followers', label: m.profile_stat_followers(), value: $followersCount },
  ]);
</script>

<div class="letterboxd-profile">
  <ProfileHero {profile} {isMe} />

  <div class="letterboxd-profile__shell">
    <div class="letterboxd-profile__stats">
      <ProfileStats {stats} />
    </div>

    <ProfileSubNav active={activeTab} onSelect={selectTab} {isMe} />

    <div class="letterboxd-profile__body">
      {#if activeTab === 'profile'}
        <ProfileFavoritesRow {slug} />
        {#if isMe}
          <ProfileWatchlistRow />
        {/if}
      {:else if activeTab === 'activity'}
        <ProfileActivityTab {slug} />
      {:else if activeTab === 'films'}
        <ProfileFilmsTab {slug} />
      {:else if activeTab === 'shows'}
        <ProfileShowsTab {slug} />
      {:else if activeTab === 'watchlist' && isMe}
        <ProfileWatchlistRow limit={42} />
      {:else if activeTab === 'reviews'}
        <ProfileReviewsTab {slug} />
      {:else if activeTab === 'network'}
        <ProfileNetworkTab {slug} {isMe} />
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .letterboxd-profile {
    background: var(--shade-1000);
    min-height: 100dvh;

    &__shell {
      width: 100%;
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 clamp(16px, 3vw, 32px) clamp(40px, 6vw, 80px);
    }

    &__stats {
      display: flex;
      justify-content: flex-end;
      margin: var(--gap-m) 0;
    }

    &__body { width: 100%; }
  }
</style>
