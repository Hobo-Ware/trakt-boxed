<script lang="ts">
  import { useUser } from '$lib/features/auth/stores/useUser.ts';
  import * as m from '$lib/features/i18n/messages.ts';
  import { useInfiniteQuery, useQuery } from '$lib/features/query/useQuery.ts';
  import { followersQuery } from '$lib/requests/queries/users/followersQuery.ts';
  import { socialActivityQuery } from '$lib/requests/queries/users/socialActivityQuery.ts';
  import { currentUserNetworkQuery } from '$lib/features/auth/queries/currentUserNetworkQuery.ts';
  import { map } from 'rxjs';
  import MembersActivityRow from './_internal/MembersActivityRow.svelte';
  import MembersUserChip from './_internal/MembersUserChip.svelte';

  const { user } = useUser();

  const network = useQuery(currentUserNetworkQuery());
  const following = $derived(
    network.pipe(map(($q) => $q.data?.following ?? [])),
  );

  const followers = $derived(
    useQuery(
      $user?.slug
        ? followersQuery({ slug: $user.slug })
        : followersQuery({ slug: 'me' }),
    ),
  );
  const followersList = $derived(followers.pipe(map(($q) => $q.data ?? [])));

  const activity = useInfiniteQuery(socialActivityQuery({ limit: 15 }));
  const activities = $derived(
    activity.pipe(
      map(($q) => $q.data?.pages?.flatMap((p) => p.entries) ?? []),
    ),
  );
  const isLoadingActivity = $derived(
    activity.pipe(map(($q) => $q.isLoading || ($q.isFetching && !$q.data))),
  );
</script>

<div class="lb-members">
  <header class="lb-members__head">
    <p class="lb-members__eyebrow">{m.members_eyebrow()}</p>
    <h1 class="lb-members__title">{m.members_title()}</h1>
    <p class="lb-members__sub">{m.members_subtitle()}</p>
  </header>

  <div class="lb-members__grid">
    <section class="lb-members__feed">
      <header class="lb-members__section-head">
        <h2>{m.members_section_activity()}</h2>
        <span>{$activities.length}</span>
      </header>
      {#if $isLoadingActivity && $activities.length === 0}
        <ul class="lb-members__skeleton-list">
          {#each Array.from({ length: 6 }) as _, i (i)}
            <li class="lb-members__skeleton-row">
              <div class="lb-members__skeleton-poster"></div>
              <div class="lb-members__skeleton-body">
                <div></div>
                <div></div>
              </div>
            </li>
          {/each}
        </ul>
      {:else if $activities.length === 0}
        <p class="lb-members__empty">{m.members_activity_empty()}</p>
      {:else}
        <ul class="lb-members__activity">
          {#each $activities as activity (activity.key)}
            <li><MembersActivityRow {activity} /></li>
          {/each}
        </ul>
      {/if}
    </section>

    <aside class="lb-members__rail">
      <section class="lb-members__people">
        <header class="lb-members__section-head">
          <h2>{m.members_section_following()}</h2>
          <span>{$following.length}</span>
        </header>
        {#if $following.length === 0}
          <p class="lb-members__empty">{m.members_following_empty()}</p>
        {:else}
          <ul class="lb-members__chips">
            {#each $following as friend (friend.id)}
              <li><MembersUserChip user={friend} /></li>
            {/each}
          </ul>
        {/if}
      </section>

      <section class="lb-members__people">
        <header class="lb-members__section-head">
          <h2>{m.members_section_followers()}</h2>
          <span>{$followersList.length}</span>
        </header>
        {#if $followersList.length === 0}
          <p class="lb-members__empty">{m.members_followers_empty()}</p>
        {:else}
          <ul class="lb-members__chips">
            {#each $followersList as fan (fan.id)}
              <li><MembersUserChip user={fan} /></li>
            {/each}
          </ul>
        {/if}
      </section>
    </aside>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-members {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px);

    &__head {
      max-width: 720px;
      margin: 0 0 var(--gap-l);
      display: flex;
      flex-direction: column;
      gap: 6px;
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
      font-size: clamp(2rem, 4vw, 3rem);
      line-height: 1.1;
      color: var(--color-text-primary);
    }

    &__sub {
      margin: 0;
      font-size: 0.95rem;
      color: var(--color-text-secondary);
    }

    &__grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: var(--gap-l);
      align-items: start;

      @include for-tablet-sm-and-below {
        grid-template-columns: 1fr;
      }
    }

    &__rail {
      position: sticky;
      top: 80px;
      display: flex;
      flex-direction: column;
      gap: var(--gap-l);

      @include for-tablet-sm-and-below {
        position: static;
      }
    }

    &__section-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
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

    &__activity {
      list-style: none;
      margin: 0;
      padding: 0;
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
      font-size: 0.9rem;
      color: var(--color-text-secondary);
    }

    &__skeleton-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }

    &__skeleton-row {
      display: grid;
      grid-template-columns: 56px 1fr;
      gap: var(--gap-m);
      padding: var(--gap-s) 0;
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 5%, transparent);
    }

    &__skeleton-poster {
      width: 56px;
      aspect-ratio: 2 / 3;
      border-radius: 3px;
      background: var(--shade-900);
    }

    &__skeleton-body {
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
