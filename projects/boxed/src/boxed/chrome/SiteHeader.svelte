<script lang="ts">
  import { page } from "$app/state";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import Logo from "$lib/components/logo/Logo.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import GetVIPLink from "$lib/sections/navbar/components/GetVIPLink.svelte";
  import JoinTraktButton from "$lib/sections/navbar/components/JoinTraktButton.svelte";
  import { useWebviewSession } from "$lib/features/webview/useWebviewSession.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import { logComposerStore } from "../log/logComposerStore.ts";
  import AccountMenu from "./AccountMenu.svelte";
  import { isChromelessPath } from "./_internal/isChromelessPath.ts";
  import { siteSectionFor, type SiteSection } from "./_internal/siteSectionFor.ts";

  type NavLink = {
    section: SiteSection;
    href: string;
    text: string;
    label: string;
    audience: "all" | "authenticated";
  };

  const links: ReadonlyArray<NavLink> = [
    {
      section: "movies",
      href: UrlBuilder.discover({ mode: "movie" }),
      text: m.page_title_movies(),
      label: m.button_label_browse_movies(),
      audience: "all",
    },
    {
      section: "shows",
      href: UrlBuilder.discover({ mode: "show" }),
      text: m.page_title_shows(),
      label: m.button_label_browse_shows(),
      audience: "all",
    },
    {
      section: "lists",
      href: "/lists",
      text: m.page_title_lists(),
      label: m.button_label_browse_lists(),
      audience: "authenticated",
    },
    {
      section: "calendar",
      href: UrlBuilder.calendar(),
      text: m.page_title_calendar(),
      label: m.page_title_calendar(),
      audience: "authenticated",
    },
  ];

  const webview = useWebviewSession();
  const isHidden = $derived(
    isChromelessPath(page.url.pathname) || webview.isStandalone,
  );

  const activeSection = $derived(
    siteSectionFor({
      pathname: page.url.pathname,
      discoverMode: page.url.searchParams.get("mode"),
    }),
  );
</script>

{#if !isHidden}
<header class="boxed-site-header">
  <div class="boxed-site-header-inner">
    <Link href={UrlBuilder.home()} label={m.button_label_home()}>
      <span class="boxed-logo"><Logo /></span>
    </Link>

    <nav class="boxed-site-nav" aria-label={m.page_title_discover()}>
      {#each links as link (link.section)}
        <RenderFor audience={link.audience}>
          <a
            class="boxed-site-nav-link"
            class:is-active={activeSection === link.section}
            aria-current={activeSection === link.section ? "page" : undefined}
            href={link.href}
            aria-label={link.label}
          >
            {link.text}
          </a>
        </RenderFor>
      {/each}
    </nav>

    <div class="boxed-site-actions">
      <RenderFor audience="authenticated">
        <a
          class="boxed-icon-link"
          href={UrlBuilder.search()}
          aria-label={m.button_label_search()}
        >
          <SearchIcon />
        </a>
      </RenderFor>
      <RenderFor audience="free">
        <span class="boxed-desktop-only"><GetVIPLink source="navbar" /></span>
      </RenderFor>
      <RenderFor audience="public">
        <JoinTraktButton size="small" />
      </RenderFor>
      <RenderFor audience="authenticated">
        <button
          type="button"
          class="boxed-log-button"
          aria-label={m.boxed_log_button_label()}
          onclick={logComposerStore.openPicker}
        >
          <PlusIcon />
          <span>{m.boxed_log_button()}</span>
        </button>
        <AccountMenu />
      </RenderFor>
    </div>
  </div>
</header>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-site-header {
    position: sticky;
    top: 0;
    z-index: var(--layer-overlay);

    height: calc(var(--boxed-header-height) + env(safe-area-inset-top, 0));
    padding-top: env(safe-area-inset-top, 0);
    box-sizing: border-box;

    background: color-mix(in srgb, var(--color-background) 88%, transparent);
    backdrop-filter: blur(var(--ni-12));
    border-bottom: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-border) 60%, transparent);
  }

  .boxed-site-header-inner {
    height: var(--boxed-header-height);
    max-width: var(--boxed-content-max-width);
    margin-inline: auto;
    padding-inline: var(--layout-distance-side);

    display: flex;
    align-items: center;
    gap: var(--gap-xl);
  }

  .boxed-logo {
    display: flex;
    align-items: center;

    :global(svg) {
      height: var(--ni-24);
      width: auto;
      color: var(--color-text-primary);
    }
  }

  .boxed-site-nav {
    display: flex;
    align-items: center;
    gap: var(--gap-l);

    @include for-tablet-sm-and-below {
      display: none;
    }
  }

  .boxed-site-nav-link {
    height: var(--boxed-header-height);
    display: flex;
    align-items: center;

    font-size: var(--ni-14);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--color-text-secondary);

    box-shadow: inset 0 calc(-1 * var(--border-thickness-xs)) 0 transparent;
    transition: color var(--transition-increment) ease,
      box-shadow var(--transition-increment) ease;

    &:hover,
    &:focus-visible {
      color: var(--color-text-primary);
    }

    &.is-active {
      color: var(--color-text-primary);
      box-shadow: inset 0 calc(-1 * var(--border-thickness-xs)) 0
        var(--purple-400);
    }
  }

  .boxed-site-actions {
    margin-inline-start: auto;

    display: flex;
    align-items: center;
    gap: var(--gap-m);
  }

  .boxed-icon-link {
    width: var(--ni-40);
    height: var(--ni-40);

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: var(--border-radius-m);
    color: var(--color-text-secondary);

    &:hover,
    &:focus-visible {
      color: var(--color-text-primary);
      background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    }

    :global(svg) {
      width: var(--ni-22);
      height: var(--ni-22);
    }
  }

  .boxed-log-button {
    height: var(--ni-36);
    padding-inline: var(--ni-12) var(--ni-16);

    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);

    border: none;
    border-radius: var(--border-radius-m);
    background: var(--purple-500);
    color: var(--shade-10);
    font: inherit;
    font-size: var(--ni-14);
    font-weight: 600;
    cursor: pointer;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }

    &:hover {
      background: var(--purple-600);
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: var(--ni-2);
    }

    @include for-tablet-sm-and-below {
      display: none;
    }
  }

  .boxed-desktop-only {
    display: contents;

    @include for-tablet-sm-and-below {
      display: none;
    }
  }
</style>
