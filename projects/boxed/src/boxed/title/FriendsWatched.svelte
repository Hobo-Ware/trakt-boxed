<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaSocialQueryTarget } from "$lib/requests/queries/media/mediaSocialQuery.ts";
  import { useSocialActivities } from "$lib/sections/summary/components/useSocialActivities.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import SectionHeader from "../components/SectionHeader.svelte";
  import Stars from "../components/Stars.svelte";

  const MAX_FACES = 6;

  const { target, href }: { target: MediaSocialQueryTarget; href: string } =
    $props();

  const { entries, isLoading } = useSocialActivities(fromRune(() => target));

  const watched = $derived($entries.filter((entry) => entry.watched));
  const faces = $derived(watched.slice(0, MAX_FACES));
</script>

<section class="boxed-friends">
  <SectionHeader title={m.boxed_title_friends_watched()}>
    {#snippet actions()}
      {#if !$isLoading && watched.length > 0}
        <a class="boxed-friends-count" {href}>{watched.length}</a>
      {/if}
    {/snippet}
  </SectionHeader>

  <div class="boxed-friends-faces">
    {#if $isLoading}
      {#each { length: MAX_FACES }, index (index)}
        <div class="boxed-friend">
          <Skeleton
            width="var(--ni-38)"
            height="var(--ni-38)"
            radius="50%"
          />
        </div>
      {/each}
    {:else if faces.length === 0}
      <p class="boxed-friends-empty">{m.text_social_activities_placeholder()}</p>
    {:else}
      {#each faces as entry (entry.key)}
        {@const name = toDisplayableName(entry.user)}
        <a
          class="boxed-friend"
          href={UrlBuilder.profile.user(entry.user.slug ?? entry.user.username)}
          aria-label={name}
          title={name}
        >
          <CrossOriginImage
            src={entry.user.avatar.url}
            alt={m.image_alt_user_avatar({ username: name })}
          />
          {#if entry.watched?.rating}
            <Stars rating={entry.watched.rating.rating} />
          {/if}
        </a>
      {/each}
    {/if}
  </div>
</section>

<style>
  .boxed-friends-count {
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
    text-decoration: none;

    &:hover,
    &:focus-visible {
      color: var(--color-text-primary);
    }
  }

  .boxed-friends-faces {
    height: var(--ni-60);

    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: var(--ni-6);
  }

  .boxed-friend {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-6);
    min-width: 0;
    text-decoration: none;

    :global(img) {
      width: var(--ni-38);
      height: var(--ni-38);
      border-radius: 50%;
      object-fit: cover;
      box-shadow: inset 0 0 0 var(--border-thickness-xxs)
        color-mix(in srgb, var(--color-foreground) 10%, transparent);
    }

    :global(.boxed-stars) {
      font-size: var(--ni-10);
    }
  }

  .boxed-friends-empty {
    grid-column: 1 / -1;
    margin: 0;
    align-self: center;

    font-size: var(--ni-12);
    line-height: 1.5;
    color: var(--color-text-secondary);
  }
</style>
