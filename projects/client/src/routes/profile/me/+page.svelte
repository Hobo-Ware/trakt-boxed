<script lang="ts">
  /*
    Authed profile root. The Profile component already carries the
    Letterboxd centred-banner treatment from entry 26 — this page
    is a thin shell that hands it the user record from useUser
    and sets the page chrome.
  */
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import Profile from "$lib/sections/profile/Profile.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { user } = useUser();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_profile()}
  hasDynamicContent={true}
>
  <NavbarStateSetter>
    {#snippet actions()}
      <DiscoverToggles />
    {/snippet}
  </NavbarStateSetter>

  <TraktPageCoverSetter />

  {#if $user !== null}
    <Profile profile={$user} slug="me" />
  {/if}
</TraktPage>
