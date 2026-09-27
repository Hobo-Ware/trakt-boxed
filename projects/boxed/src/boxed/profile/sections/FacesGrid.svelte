<script lang="ts">
  import { toProfileHref } from "$boxed/utils/toProfileHref.ts";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";

  const FACES = 16;

  const { profiles }: { profiles: ReadonlyArray<UserProfile> | null } =
    $props();

  const faces = $derived(profiles?.slice(0, FACES) ?? null);
</script>

<ul class="boxed-faces-grid">
  {#if faces === null}
    {#each { length: FACES }, index (index)}
      <li><Skeleton height="100%" radius="50%" /></li>
    {/each}
  {:else if faces.length === 0}
    <li class="faces-empty">{m.boxed_profile_empty()}</li>
  {:else}
    {#each faces as profile (profile.id)}
      <li>
        <a
          href={toProfileHref(profile)}
          title={toDisplayableName(profile)}
          aria-label={toDisplayableName(profile)}
        >
          <img
            src={profile.avatar.url}
            alt=""
            width="40"
            height="40"
            loading="lazy"
            decoding="async"
          />
        </a>
      </li>
    {/each}
  {/if}
</ul>

<style>
  .boxed-faces-grid {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    grid-template-rows: repeat(2, auto);
    gap: var(--gap-xs);
    min-height: calc(2 * var(--ni-36) + var(--gap-xs));

    li {
      aspect-ratio: 1;
    }

    a,
    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    img {
      object-fit: cover;
      background: var(--color-input-background);
    }

    .faces-empty {
      grid-column: 1 / -1;
      aspect-ratio: auto;
      font-size: var(--ni-14);
      color: var(--color-text-secondary);
    }
  }
</style>
