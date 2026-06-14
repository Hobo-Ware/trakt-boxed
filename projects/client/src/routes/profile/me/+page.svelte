<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import LetterboxdProfile from "$lib/sections/letterboxd-profile/LetterboxdProfile.svelte";
  import ProfileSkeleton from "$lib/sections/letterboxd-profile/ProfileSkeleton.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { user } = useUser();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_profile()}
  hasDynamicContent={true}
  mode="content-only"
>
  {#if $user}
    {@const profile = {
      ...$user,
      id: Number($user.id),
      private: false,
      isDeleted: false,
    }}
    <LetterboxdProfile profile={profile} slug={$user.slug ?? $user.username} isMe={true} />
  {:else}
    <ProfileSkeleton />
  {/if}
</TraktPage>
