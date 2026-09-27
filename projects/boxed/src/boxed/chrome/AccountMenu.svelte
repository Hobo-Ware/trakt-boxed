<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import LogoutButton from "$lib/components/buttons/logout/LogoutButton.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";

  type MenuLink = {
    key: string;
    href: string;
    text: string;
  };

  const { user } = useUser();

  const profileHref = UrlBuilder.profile.me();

  const links: ReadonlyArray<MenuLink> = [
    { key: "profile", href: profileHref, text: m.page_title_profile() },
    {
      key: "diary",
      href: `${profileHref}/diary`,
      text: m.boxed_profile_tab_diary(),
    },
    {
      key: "watching",
      href: `${profileHref}/watching`,
      text: m.boxed_profile_tab_watching(),
    },
    {
      key: "watchlist",
      href: `${profileHref}/watchlist`,
      text: m.page_title_watchlist(),
    },
    {
      key: "lists",
      href: `${profileHref}/lists`,
      text: m.page_title_lists(),
    },
    {
      key: "likes",
      href: UrlBuilder.profile.favorites("me"),
      text: m.boxed_profile_tab_likes(),
    },
    {
      key: "network",
      href: UrlBuilder.profile.social("me"),
      text: m.header_network(),
    },
    {
      key: "stats",
      href: `${profileHref}/stats`,
      text: m.boxed_profile_tab_stats(),
    },
    {
      key: "settings",
      href: UrlBuilder.settings.general(),
      text: m.button_text_settings(),
    },
    { key: "vip", href: UrlBuilder.vip(), text: m.boxed_menu_vip() },
  ];
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
      {#each links as link (link.key)}
        <DropdownItem
          href={link.href}
          label={link.text}
          style="flat"
          color="default"
          variant="secondary"
        >
          {link.text}
        </DropdownItem>
      {/each}
      <LogoutButton style="dropdown-item" />
    {/snippet}
  </PopupMenu>
</div>

<style>
  .trakt-account-menu {
    display: flex;
    align-items: center;
  }
</style>
