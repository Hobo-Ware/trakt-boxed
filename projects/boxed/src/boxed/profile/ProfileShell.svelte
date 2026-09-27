<script lang="ts">
  import { useIsFollowing } from "$lib/features/auth/stores/useIsFollowing.ts";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { useProfile } from "$clientRoutes/profile/[slug]/useProfile.ts";
  import type { Snippet } from "svelte";
  import PageContainer from "../components/PageContainer.svelte";
  import { toProfileStats } from "./_internal/toProfileStats.ts";
  import type { ProfileContext } from "./ProfileContext.ts";
  import ProfileActions from "./ProfileActions.svelte";
  import ProfileAvatar from "./ProfileAvatar.svelte";
  import ProfileIdentity from "./ProfileIdentity.svelte";
  import ProfileName from "./ProfileName.svelte";
  import ProfileNotice from "./ProfileNotice.svelte";
  import ProfileStats from "./ProfileStats.svelte";
  import type { ProfileTab } from "./ProfileTab.ts";
  import ProfileTabs from "./ProfileTabs.svelte";
  import { useProfileStats } from "./useProfileStats.ts";
  import { useThisYearPlays } from "./useThisYearPlays.ts";

  type ProfileShellProps = {
    slug: string;
    tab: ProfileTab;
    variant?: "full" | "compact";
    title?: (name: string) => string;
    children: Snippet<[ProfileContext]>;
  };

  const {
    slug,
    tab,
    variant = "compact",
    title,
    children,
  }: ProfileShellProps = $props();

  const slug$ = fromRune(() => slug);
  const { user: profile } = useProfile(slug$);
  const { stats, isLoading: isStatsLoading } = useProfileStats(slug$);
  const { thisYear } = useThisYearPlays();
  const { isMe: isViewerProfile } = $derived(useIsMe(slug));
  const isMe = $derived(slug === "me" || $isViewerProfile);
  const { isFollowing } = $derived(useIsFollowing(slug));

  const isPrivate = $derived(
    $profile?.private === true && !isMe && $isFollowing !== true,
  );
  const name = $derived($profile ? toDisplayableName($profile) : "");
  const statItems = $derived(
    toProfileStats({
      stats: $isStatsLoading ? undefined : $stats,
      thisYear: $thisYear,
      showThisYear: isMe,
    }),
  );
  const pageTitle = $derived(
    name
      ? (title?.(name) ?? m.page_title_user_profile({ username: name }))
      : m.page_title_profile(),
  );
  const cover = $derived($profile?.cover?.url);

  const context: ProfileContext = $derived({
    slug,
    profile: $profile,
    name,
    isMe: isMe,
    stats: $stats,
    isStatsLoading: $isStatsLoading,
  });
</script>

{#snippet actions()}
  {#if $profile && !isMe}
    <ProfileActions profile={$profile} {slug} />
  {/if}
{/snippet}

<TraktPage
  audience={slug === "me" ? "authenticated" : "all"}
  image={DEFAULT_SHARE_COVER}
  title={pageTitle}
  hasDynamicContent
>
  {#if variant === "full"}
    <div class="boxed-profile-banner">
      {#if cover}
        <CrossOriginImage src={cover} alt="" loading="eager" />
      {/if}
    </div>
  {/if}

  <PageContainer>
    <div class="boxed-profile-head" data-variant={variant}>
      {#if variant === "full"}
        <ProfileIdentity
          profile={$profile}
          showAbout={!isPrivate}
          actions={isMe ? undefined : actions}
        />
        {#if !isPrivate}
          <ProfileStats stats={statItems} />
        {/if}
      {:else}
        <div class="boxed-profile-compact">
          <a class="compact-identity" href={`/profile/${slug}`}>
            <ProfileAvatar profile={$profile} size="small" />
            <ProfileName profile={$profile} size="normal" />
          </a>
          {#if !isPrivate}
            <div class="compact-stats">
              <ProfileStats stats={statItems} variant="compact" />
            </div>
          {/if}
        </div>
      {/if}

      {#if !isPrivate}
        <ProfileTabs {slug} active={tab} isMe={isMe} />
      {/if}
    </div>

    {#if isPrivate && $profile}
      <ProfileNotice
        title={m.header_private_profile()}
        text={m.text_private_profile_description({
          username: $profile.username,
        })}
      />
    {:else}
      {@render children(context)}
    {/if}
  </PageContainer>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-profile-banner {
    position: relative;
    height: var(--ni-240);
    overflow: hidden;
    background:
      radial-gradient(
        120% 140% at 20% 0%,
        color-mix(in srgb, var(--purple-500) 28%, transparent),
        transparent 60%
      ),
      linear-gradient(
        180deg,
        var(--color-card-background),
        var(--color-background)
      );

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        transparent 40%,
        var(--color-background)
      );
    }

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @include for-mobile {
      height: var(--ni-144);
    }
  }

  .boxed-profile-head {
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);

    &[data-variant="compact"] {
      gap: var(--ni-16);
    }

    @include for-mobile {
      gap: var(--ni-16);
    }
  }

  .boxed-profile-compact {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-l);
    min-height: var(--ni-52);
  }

  .compact-identity {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-width: 0;
    color: inherit;
    text-decoration: none;
  }

  .compact-stats {
    @include for-tablet-sm-and-below {
      display: none;
    }
  }
</style>
