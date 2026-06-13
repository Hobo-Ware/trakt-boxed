<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import LetterboxdProfile from "$lib/sections/letterboxd-profile/LetterboxdProfile.svelte";
  import ProfileSkeleton from "$lib/sections/letterboxd-profile/ProfileSkeleton.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";
  import { useProfile } from "./useProfile";

  const { params }: PageProps = $props();

  const { user, isLoading } = $derived(useProfile(params.slug));
  const { isMe } = $derived(useIsMe(params.slug));

  const title = $derived(
    $user?.username
      ? m.page_title_user_profile({ username: $user.username })
      : m.page_title_profile(),
  );
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  {title}
  hasDynamicContent={true}
  mode="content-only"
>
  {#if !$isLoading && $user}
    <LetterboxdProfile profile={$user} slug={$user.slug ?? params.slug} isMe={$isMe} />
  {:else}
    <ProfileSkeleton />
  {/if}
</TraktPage>
