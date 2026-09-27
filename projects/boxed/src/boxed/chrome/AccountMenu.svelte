<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import GearIcon from "$lib/components/icons/GearIcon.svelte";
  import LibraryIcon from "$lib/components/icons/LibraryIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";

  const { user } = useUser();
</script>

{#snippet avatar()}
  <ProfileImage
    --image-size="var(--ni-32)"
    --border-width="var(--border-thickness-xs)"
    name={$user?.name?.first ?? ""}
    src={$user?.avatar?.url ?? ""}
    isVip={Boolean($user?.isVip)}
  />
{/snippet}

<div class="trakt-account-menu" data-hj-suppress data-sentry-mask>
  <PopupMenu
    label={m.button_label_user_profile()}
    title={$user?.username ?? m.page_title_profile()}
    icon={avatar}
    size="normal"
  >
    {#snippet items()}
      <DropdownItem
        href={UrlBuilder.profile.me()}
        label={m.button_label_user_profile()}
        style="flat"
        color="default"
        variant="secondary"
      >
        {m.page_title_profile()}
      </DropdownItem>
      <DropdownItem
        href={`${UrlBuilder.profile.me()}/diary`}
        label={m.button_label_history()}
        style="flat"
        color="default"
        variant="secondary"
      >
        {m.page_title_history()}
        {#snippet icon()}<ClockIcon />{/snippet}
      </DropdownItem>
      <DropdownItem
        href={UrlBuilder.library.home()}
        label={m.button_label_library()}
        style="flat"
        color="default"
        variant="secondary"
      >
        {m.page_title_library()}
        {#snippet icon()}<LibraryIcon />{/snippet}
      </DropdownItem>
      <DropdownItem
        href={UrlBuilder.settings.general()}
        label={m.button_label_settings()}
        style="flat"
        color="default"
        variant="secondary"
      >
        {m.button_label_settings()}
        {#snippet icon()}<GearIcon />{/snippet}
      </DropdownItem>
    {/snippet}
  </PopupMenu>
</div>

<style>
  .trakt-account-menu {
    display: flex;
    align-items: center;
  }
</style>
