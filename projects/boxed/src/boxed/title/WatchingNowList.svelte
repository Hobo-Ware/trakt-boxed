<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const SKELETON_ROWS = 6;

  const { users }: { users: ReadonlyArray<UserProfile> | null } = $props();
</script>

<ul class="boxed-watching-now">
  {#if users === null}
    {#each { length: SKELETON_ROWS }, index (index)}
      <li class="boxed-watcher" aria-hidden="true">
        <Skeleton width="var(--ni-40)" height="var(--ni-40)" radius="50%" />
        <Skeleton width="var(--ni-160)" height="var(--ni-16)" />
      </li>
    {/each}
  {:else}
    {#each users as user (user.key)}
      {@const name = toDisplayableName(user)}
      <li>
        <a class="boxed-watcher" href={UrlBuilder.profile.user(user.slug ?? user.username)}>
          <CrossOriginImage src={user.avatar.url} alt={m.image_alt_user_avatar({ username: name })} />
          <span>{name}</span>
        </a>
      </li>
    {:else}
      <li class="boxed-watching-now-empty">{m.boxed_title_watching_now_empty()}</li>
    {/each}
  {/if}
</ul>

<style>
  .boxed-watching-now {
    margin: 0;
    padding: 0;
    list-style: none;

    display: flex;
    flex-direction: column;
  }

  .boxed-watcher {
    height: var(--ni-64);

    display: flex;
    align-items: center;
    gap: var(--ni-14);

    border-bottom: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-border) 60%, transparent);
    text-decoration: none;
    color: var(--color-text-primary);
    font-size: var(--ni-14);
    font-weight: 500;

    :global(img) {
      width: var(--ni-40);
      height: var(--ni-40);
      border-radius: 50%;
      object-fit: cover;
    }
  }

  a.boxed-watcher:hover,
  a.boxed-watcher:focus-visible {
    color: var(--color-link-active);
  }

  .boxed-watching-now-empty {
    padding: var(--ni-16) 0;
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }
</style>
