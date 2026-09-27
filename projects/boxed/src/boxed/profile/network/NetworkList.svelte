<script lang="ts">
  import EmptyState from "$boxed/components/EmptyState.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import type { ProfileSocialListType } from "$lib/sections/profile/models/ProfileSocialListType.ts";
  import { useFollowing } from "$lib/sections/profile/stores/useFollowing.ts";
  import MemberRow from "./MemberRow.svelte";

  const MAX_SKELETON_ROWS = 24;

  type NetworkListProps = {
    slug: string;
    type: ProfileSocialListType;
    expectedCount: number | Nil;
    emptyText: string;
  };

  const { slug, type, expectedCount, emptyText }: NetworkListProps =
    $props();

  const { user } = useUser();
  const { profiles, isLoading } = $derived(useFollowing(slug, type));

  const skeletonRows = $derived(
    Math.min(Math.max(expectedCount ?? MAX_SKELETON_ROWS, 1), MAX_SKELETON_ROWS),
  );
  const members = $derived(
    $isLoading && $profiles.length === 0 ? null : $profiles,
  );
</script>

<ul class="boxed-network-list" style:--skeleton-rows={Math.ceil(skeletonRows / 2)}>
  {#if members === null}
    {#each { length: skeletonRows }, index (index)}
      <li class="network-skeleton" aria-hidden="true">
        <Skeleton width="var(--ni-48)" height="var(--ni-48)" radius="50%" />
        <span class="skeleton-names">
          <Skeleton width="var(--ni-120)" height="var(--ni-16)" />
          <Skeleton width="var(--ni-80)" height="var(--ni-12)" />
        </span>
      </li>
    {/each}
  {:else if members.length === 0}
    <EmptyState as="li" text={emptyText} />
  {:else}
    {#each members as profile (profile.key)}
      <MemberRow
        {profile}
        {type}
        isViewer={profile.slug != null && profile.slug === $user?.slug}
      />
    {/each}
  {/if}
</ul>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-network-list {
    --row-height: calc(var(--ni-52) + 2 * var(--ni-12) + var(--border-thickness-xxs));

    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: var(--ni-48);
    align-content: start;
    min-height: calc(var(--skeleton-rows) * var(--row-height));

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
      min-height: calc(2 * var(--skeleton-rows) * var(--row-height));
    }
  }

  .network-skeleton {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    height: var(--row-height);
    box-sizing: border-box;
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);
  }

  .skeleton-names {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
  }
</style>
