<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import SettingsButton from "$lib/components/buttons/settings/SettingsButton.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ProfileAbout from "$lib/sections/profile/components/ProfileAbout.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { DisplayableProfileProps } from "../profile/DisplayableProfileProps";
  import BlockedUserTag from "./_internal/BlockedUserTag.svelte";
  import PendingFollowTag from "./_internal/PendingFollowTag.svelte";
  import ProfileOverflowMenu from "./_internal/ProfileOverflowMenu.svelte";
  import { useFollowUserRequest } from "./_internal/useFollowUser";
  import ProfileImage from "./ProfileImage.svelte";
  import ProfileStatsRow from "./ProfileStatsRow.svelte";

  type ProfilePageBannerProps = DisplayableProfileProps & {
    variant?: "private" | "public";
  };

  const {
    profile,
    slug,
    variant = "public",
  }: ProfilePageBannerProps = $props();

  const { user, blocked } = useUser();
  const { isMe } = $derived(useIsMe(slug));
  const { followStatus } = $derived(useFollowUserRequest(slug));

  const shareableSlug = $derived($isMe ? $user.slug : slug);
  const isBlocked = $derived($blocked.has(slug));
  const isPending = $derived($followStatus === "pending");

  const isPublic = $derived(variant === "public");
</script>

<!--
  Letterboxd-flavour profile banner: cinematic backdrop ledge (the
  radial behind .profile-page-banner-container is set on the parent
  page), centred avatar-and-name stack, location subtitle, then the
  five-stat row. Actions float to the top-right corner.

  Reference: research/notes/profile.md and the profile-mobile.png
  screenshot — avatar sits centred below the banner edge, the display
  name is the most prominent type on the page.
-->
<div class="profile-page-banner-container">
  <div class="profile-actions-floating">
    {#if isPublic}
      <ShareButton
        title={profile.name.first}
        urlOverride={UrlBuilder.profile.user(shareableSlug)}
        textFactory={({ title: name }) => m.text_share_profile({ name })}
        source={{ id: "profile", type: $isMe ? "own" : "other" }}
      />
    {/if}
    <RenderFor audience="authenticated">
      {#if !$isMe}
        <ProfileOverflowMenu {profile} {slug} />
      {:else}
        <SettingsButton style="action" />
      {/if}
    </RenderFor>
  </div>

  <div class="profile-identity">
    <ProfileImage
      isEditable={$isMe}
      --image-size="var(--ni-80)"
      --border-width="var(--border-thickness-s)"
      name={profile.name.first}
      src={profile.avatar.url}
      isVip={profile.isVip}
    >
      {#snippet badge()}
        <RenderFor audience="authenticated">
          {#if !$isMe && isBlocked}
            <BlockedUserTag />
          {:else if !$isMe && isPending}
            <PendingFollowTag />
          {/if}
        </RenderFor>
        {#if !isBlocked && !isPending}
          {#if profile.isVip}
            <VipBadge isDirector={profile.isDirector} />
          {/if}
        {/if}
      {/snippet}
    </ProfileImage>

    <div class="profile-user-details" data-hj-suppress data-sentry-mask>
      <h1 class="profile-display-name">{toDisplayableName(profile)}</h1>
      {#if isPublic && profile.location}
        <p class="profile-location">{profile.location}</p>
      {/if}
    </div>
  </div>

  {#if $isMe}
    <ProfileStatsRow {slug} />
  {/if}

  {#if isPublic}
    <ProfileAbout {profile} {slug} />
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .profile-page-banner-container {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;

    gap: var(--gap-m);
    padding-top: var(--gap-xl);
    padding-bottom: var(--gap-m);

    width: 100%;
    box-sizing: border-box;

    :global(.trakt-profile-about) {
      flex: 1;
      min-height: 0;
      align-self: stretch;
      text-align: center;
    }

    :global(.trakt-profile-about .line-clamp-container) {
      align-items: center;
    }
  }

  .profile-actions-floating {
    position: absolute;
    top: var(--gap-xs);
    right: var(--gap-m);

    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    z-index: var(--layer-raised);

    :global(svg) {
      width: var(--ni-22);
      height: var(--ni-22);
    }
  }

  .profile-identity {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);

    :global(.profile-image-container) {
      display: flex;
      flex-direction: column;
      align-items: center;

      :global(.trakt-vip-badge),
      :global(.trakt-blocked-user-tag),
      :global(.trakt-pending-follow-tag) {
        z-index: var(--layer-base);
        margin-top: var(--ni-neg-12);
      }
    }
  }

  .profile-user-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-2);
    min-width: 0;
    text-align: center;
  }

  /*
    Display name is the most prominent type on the page — Fraunces
    serif (the trakt-boxed media-title font) at a generous size.
  */
  .profile-display-name {
    margin: 0;
    font-family: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
    font-optical-sizing: auto;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.1;
    font-size: var(--ni-26);

    color: var(--color-foreground);

    @include for-tablet-lg {
      font-size: var(--ni-32);
    }
  }

  .profile-location {
    margin: 0;
    font-size: var(--font-size-tag);
    color: var(--color-text-secondary);
  }
</style>
