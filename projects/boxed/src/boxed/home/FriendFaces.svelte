<script lang="ts">
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";

  const MAX_FACES = 3;

  const { friends }: { friends: ReadonlyArray<UserProfile> } = $props();

  const faces = $derived(friends.slice(0, MAX_FACES));
  const extra = $derived(friends.length - faces.length);
</script>

<span class="boxed-friend-faces" data-hj-suppress>
  {#each faces as friend (friend.id)}
    <img
      class="boxed-friend-face"
      src={friend.avatar.url}
      alt={friend.name?.first ?? friend.username}
      title={friend.username}
      width="20"
      height="20"
      loading="lazy"
    />
  {/each}
  {#if extra > 0}
    <span class="boxed-friend-extra">+{extra}</span>
  {/if}
</span>

<style>
  .boxed-friend-faces {
    display: inline-flex;
    align-items: center;
    height: var(--ni-20);
  }

  .boxed-friend-face {
    width: var(--ni-20);
    height: var(--ni-20);
    border-radius: 50%;
    object-fit: cover;
    background: var(--color-input-background);
    box-shadow: 0 0 0 var(--border-thickness-xs) var(--color-background);

    & + & {
      margin-inline-start: calc(-1 * var(--ni-6));
    }
  }

  .boxed-friend-extra {
    margin-inline-start: var(--ni-4);
    font-size: var(--ni-11);
    font-weight: 600;
    color: var(--color-text-secondary);
  }
</style>
