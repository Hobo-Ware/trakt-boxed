<script lang="ts">
  import { page } from "$app/state";
  import DiscoverIcon from "$lib/components/icons/DiscoverIcon.svelte";
  import ProfileIcon from "$lib/components/icons/ProfileIcon.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import HomeIcon from "$lib/components/icons/mobile/HomeIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useNavbarState } from "$lib/sections/navbar/useNavbarState";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Component } from "svelte";

  type Tab = {
    key: string;
    href: string;
    text: string;
    icon: Component;
    isPrimary?: boolean;
  };

  const tabs: ReadonlyArray<Tab> = [
    {
      key: "home",
      href: UrlBuilder.home(),
      text: m.page_title_home(),
      icon: HomeIcon,
    },
    {
      key: "browse",
      href: UrlBuilder.discover(),
      text: m.page_title_discover(),
      icon: DiscoverIcon,
    },
    {
      key: "search",
      href: UrlBuilder.search(),
      text: m.page_title_search(),
      icon: SearchIcon,
      isPrimary: true,
    },
    {
      key: "watching",
      href: UrlBuilder.progress("me"),
      text: m.page_title_progress(),
      icon: ShowIcon,
    },
    {
      key: "profile",
      href: UrlBuilder.profile.me(),
      text: m.page_title_profile(),
      icon: ProfileIcon,
    },
  ];

  const { state } = useNavbarState();

  const isActive = (href: string) => page.url.pathname === href;
</script>

<RenderFor audience="authenticated" device={["mobile", "tablet-sm"]}>
  {#if $state.mode !== "hidden"}
  <div class="boxed-tabbar-spacer" aria-hidden="true"></div>
  <nav class="boxed-tabbar" aria-label={m.page_title_home()}>
    {#each tabs as tab (tab.key)}
      <a
        class="boxed-tab"
        class:is-primary={tab.isPrimary}
        class:is-active={isActive(tab.href)}
        aria-current={isActive(tab.href) ? "page" : undefined}
        href={tab.href}
      >
        <span class="boxed-tab-icon"><tab.icon /></span>
        <span class="boxed-tab-text">{tab.text}</span>
      </a>
    {/each}
  </nav>
  {/if}
</RenderFor>

<style>
  .boxed-tabbar-spacer {
    height: var(--boxed-tabbar-height);
  }

  .boxed-tabbar {
    position: fixed;
    inset-inline: 0;
    bottom: 0;
    z-index: var(--layer-overlay);

    height: var(--boxed-tabbar-height);
    padding-bottom: env(safe-area-inset-bottom, 0);
    box-sizing: border-box;

    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    align-items: center;

    background: color-mix(
      in srgb,
      var(--color-floating-background) 92%,
      transparent
    );
    backdrop-filter: blur(var(--ni-12));
    border-top: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-border) 60%, transparent);
  }

  .boxed-tab {
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xxs);

    text-decoration: none;
    color: var(--color-text-secondary);

    &.is-active {
      color: var(--color-text-primary);
    }
  }

  .boxed-tab-icon {
    display: flex;

    :global(svg) {
      width: var(--ni-22);
      height: var(--ni-22);
    }
  }

  .boxed-tab.is-primary .boxed-tab-icon {
    width: var(--ni-44);
    height: var(--ni-44);
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    background: var(--purple-500);
    color: var(--shade-10);
  }

  .boxed-tab.is-primary .boxed-tab-text {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  .boxed-tab-text {
    font-size: var(--ni-10);
    font-weight: 500;
  }
</style>
