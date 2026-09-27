<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import InView from "$boxed/components/InView.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";
  import type { ProfileSocialListType } from "$lib/sections/profile/models/ProfileSocialListType.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import FollowButton from "../FollowButton.svelte";
  import RequestActions from "./RequestActions.svelte";

  type MemberRowProps = {
    profile: UserProfile;
    type: ProfileSocialListType;
    isViewer: boolean;
  };

  const { profile, type, isViewer }: MemberRowProps = $props();

  const slug = $derived(profile.slug ?? profile.username);
</script>

<li class="boxed-member-row" data-hj-suppress>
  <a class="member-identity" href={UrlBuilder.profile.user(slug)}>
    <CrossOriginImage src={profile.avatar.url} alt="" loading="lazy" />
    <span class="member-names">
      <span class="member-name">{toDisplayableName(profile)}</span>
      <span class="member-handle">@{profile.username}</span>
    </span>
  </a>

  {#if !isViewer}
    <RenderFor audience="authenticated">
      <InView>
        {#if type === "requests"}
          <RequestActions {profile} {slug} />
        {:else}
          <FollowButton {profile} {slug} />
        {/if}
        {#snippet placeholder()}
          <span class="member-action-placeholder"></span>
        {/snippet}
      </InView>
    </RenderFor>
  {/if}
</li>

<style>
  .boxed-member-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);
    min-height: var(--ni-52);
    padding-block: var(--ni-12);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);
  }

  .member-identity {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-width: 0;
    color: inherit;
    text-decoration: none;

    :global(img) {
      flex-shrink: 0;
      width: var(--ni-48);
      height: var(--ni-48);
      border-radius: 50%;
      object-fit: cover;
      background: var(--color-input-background);
    }

    &:hover .member-name,
    &:focus-visible .member-name {
      text-decoration: underline;
    }
  }

  .member-names {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    min-width: 0;
  }

  .member-name,
  .member-handle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .member-name {
    font-size: var(--ni-16);
    font-weight: 500;
  }

  .member-handle {
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .member-action-placeholder {
    display: block;
    width: var(--ni-104);
    height: var(--ni-52);
  }
</style>
