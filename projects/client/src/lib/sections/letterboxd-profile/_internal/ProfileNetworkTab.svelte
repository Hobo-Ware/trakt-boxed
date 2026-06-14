<script lang="ts">
  import { currentUserNetworkQuery } from '$lib/features/auth/queries/currentUserNetworkQuery.ts';
  import * as m from '$lib/features/i18n/messages.ts';
  import { useQuery } from '$lib/features/query/useQuery.ts';
  import { followersQuery } from '$lib/requests/queries/users/followersQuery.ts';
  import MembersUserChip from '$lib/sections/letterboxd-members/_internal/MembersUserChip.svelte';
  import { map } from 'rxjs';

  type Props = { slug: string; isMe: boolean };
  const { slug, isMe }: Props = $props();

  const followingQuery = useQuery(currentUserNetworkQuery());
  const following = $derived(
    followingQuery.pipe(map(($q) => (isMe ? $q.data?.following ?? [] : []))),
  );

  const followers = useQuery(followersQuery({ slug }));
  const followersList = $derived(followers.pipe(map(($q) => $q.data ?? [])));
</script>

<div class="profile-network">
  {#if isMe}
    <section class="profile-network__panel">
      <header class="profile-network__head">
        <h2>{m.profile_tab_following()}</h2>
        <span>{$following.length}</span>
      </header>
      {#if $following.length === 0}
        <p class="profile-network__empty">{m.profile_following_empty()}</p>
      {:else}
        <ul class="profile-network__chips">
          {#each $following as user (user.id)}
            <li><MembersUserChip {user} /></li>
          {/each}
        </ul>
      {/if}
    </section>
  {/if}

  <section class="profile-network__panel">
    <header class="profile-network__head">
      <h2>{m.profile_tab_followers()}</h2>
      <span>{$followersList.length}</span>
    </header>
    {#if $followersList.length === 0}
      <p class="profile-network__empty">{m.profile_followers_empty()}</p>
    {:else}
      <ul class="profile-network__chips">
        {#each $followersList as user (user.id)}
          <li><MembersUserChip {user} /></li>
        {/each}
      </ul>
    {/if}
  </section>
</div>

<style lang="scss">
  .profile-network {
    padding-top: var(--gap-l);
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    &__head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-bottom: var(--gap-s);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
      margin-bottom: var(--gap-m);

      h2 {
        margin: 0;
        font-size: 0.78rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-text-secondary);
        font-weight: 700;
      }

      span {
        font-size: 0.78rem;
        color: var(--color-text-secondary);
      }
    }

    &__chips {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    &__empty {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: 0.9rem;
    }
  }
</style>
