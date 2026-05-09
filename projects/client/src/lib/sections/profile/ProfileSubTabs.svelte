<script lang="ts">
  /*
    Letterboxd's profile spine: an 11-tab horizontal sub-row that
    rides on every authed profile surface. Mobile keeps it
    horizontally scrollable; desktop fits the row inline.

    Reference: research/notes/profile.md ("Profile · Activity · Films
    · Diary · Reviews · Watchlist · Lists · Likes · Tags · Network ·
    Stats"). trakt-boxed surfaces what the API actually exposes —
    Tags / Likes / Stats live behind future queries; the rest are
    real routes today.
  */
  import { page } from "$app/state";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { slug }: { slug: string } = $props();

  type Tab = {
    label: string;
    href: string;
    matches: (path: string) => boolean;
  };

  const profileBase = $derived(UrlBuilder.profile.user(slug));
  const usersBase = $derived(`/users/${slug}`);

  const tabs: Tab[] = $derived([
    {
      label: m.profile_tab_profile(),
      href: profileBase,
      matches: (p) => p === profileBase || p === `${profileBase}/`,
    },
    {
      label: m.profile_tab_activity(),
      href: UrlBuilder.profile.activity(slug),
      matches: (p) => p.startsWith(UrlBuilder.profile.activity(slug)),
    },
    {
      label: m.profile_tab_films(),
      href: UrlBuilder.profile.history(slug),
      matches: (p) => p.startsWith(UrlBuilder.profile.history(slug)),
    },
    {
      label: m.profile_tab_diary(),
      href: "/diary",
      matches: (p) => p.startsWith("/diary"),
    },
    {
      label: m.profile_tab_reviews(),
      href: `${usersBase}/reviews`,
      matches: (p) => p.startsWith(`${usersBase}/reviews`),
    },
    {
      label: m.profile_tab_watchlist(),
      href: UrlBuilder.lists.watchlist(slug),
      matches: (p) => p.startsWith(UrlBuilder.lists.watchlist(slug)),
    },
    {
      label: m.profile_tab_lists(),
      href: UrlBuilder.lists.user(slug),
      matches: (p) => p.startsWith(`${usersBase}/lists`),
    },
    {
      label: m.profile_tab_network(),
      href: UrlBuilder.profile.social(slug),
      matches: (p) => p.startsWith(UrlBuilder.profile.social(slug)),
    },
  ]);

  const currentPath = $derived(page.url.pathname);
</script>

<nav class="lb-profile-tabs" aria-label="Profile sections">
  <div class="lb-profile-tabs-track">
    {#each tabs as tab (tab.href)}
      {@const isActive = tab.matches(currentPath)}
      <Link href={tab.href} color="inherit">
        <span class="lb-profile-tab" class:is-active={isActive}>
          {tab.label}
        </span>
      </Link>
    {/each}
  </div>
</nav>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-profile-tabs {
    width: 100%;
    border-bottom: var(--ni-1) solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);

    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .lb-profile-tabs-track {
    display: flex;
    gap: var(--ni-22);

    padding: 0 var(--ni-16);
    min-width: max-content;

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .lb-profile-tab {
    display: inline-block;
    padding: var(--ni-12) 0;

    color: var(--color-text-secondary);
    font-size: var(--ni-11);
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    line-height: 1;

    border-bottom: var(--ni-2) solid transparent;
    margin-bottom: -1px;

    transition: color var(--transition-increment) ease-in-out,
      border-color var(--transition-increment) ease-in-out;
  }

  .lb-profile-tab:hover {
    color: var(--color-foreground);
  }

  .lb-profile-tab.is-active {
    color: var(--color-foreground);
    border-bottom-color: var(--tboxed-positive);
  }
</style>
