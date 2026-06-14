<script lang="ts">
  import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
  import { useUser } from '$lib/features/auth/stores/useUser.ts';
  import * as m from '$lib/features/i18n/messages.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

  const { isAuthorized, logout } = useAuth();
  const { user } = useUser();

  let isMobileMenuOpen = $state(false);
  let isAvatarMenuOpen = $state(false);
  let avatarRoot: HTMLDivElement | null = $state(null);

  $effect(() => {
    if (!isAvatarMenuOpen) return;
    const handler = (event: MouseEvent) => {
      if (!avatarRoot) return;
      if (!avatarRoot.contains(event.target as Node)) {
        isAvatarMenuOpen = false;
      }
    };
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') isAvatarMenuOpen = false;
    };
    globalThis.window?.addEventListener('mousedown', handler);
    globalThis.window?.addEventListener('keydown', keyHandler);
    return () => {
      globalThis.window?.removeEventListener('mousedown', handler);
      globalThis.window?.removeEventListener('keydown', keyHandler);
    };
  });

  const profileHref = $derived(
    $user?.slug ? UrlBuilder.profile.user($user.slug) : UrlBuilder.profile.me(),
  );

  const avatarMenu = $derived([
    { key: 'home', label: m.avatar_menu_home(), href: '/' },
    { key: 'profile', label: m.avatar_menu_profile(), href: profileHref },
    { key: 'films', label: m.avatar_menu_films(), href: `${profileHref}?tab=films` },
    { key: 'shows', label: m.avatar_menu_shows(), href: `${profileHref}?tab=shows` },
    { key: 'watchlist', label: m.avatar_menu_watchlist(), href: '/watchlist' },
    { key: 'reviews', label: m.avatar_menu_reviews(), href: `${profileHref}?tab=reviews` },
    { key: 'network', label: m.avatar_menu_network(), href: `${profileHref}?tab=network` },
    { key: 'settings', label: m.avatar_menu_settings(), href: '/settings' },
  ]);

  const navLinks = $derived([
    { key: 'films', label: m.nav_link_films(), href: '/films' },
    { key: 'tv', label: m.nav_link_tv(), href: '/tv' },
    { key: 'lists', label: m.nav_link_lists(), href: '/lists' },
    { key: 'calendar', label: m.nav_link_calendar(), href: '/calendar' },
  ]);

  const activityHref = $derived(`${profileHref}?tab=activity`);
</script>

<header class="lb-nav">
  <div class="lb-nav__inner">
    <a class="lb-nav__brand" href="/" aria-label="Home">
      <span class="lb-nav__brand-dot" aria-hidden="true"></span>
      <span class="lb-nav__brand-dot lb-nav__brand-dot--mid" aria-hidden="true"></span>
      <span class="lb-nav__brand-dot lb-nav__brand-dot--last" aria-hidden="true"></span>
      <span class="lb-nav__brand-text">trakt boxed</span>
    </a>

    <button
      type="button"
      class="lb-nav__burger"
      aria-label="Menu"
      aria-expanded={isMobileMenuOpen}
      onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>

    <nav
      class="lb-nav__links"
      data-open={isMobileMenuOpen ? 'true' : undefined}
      aria-label="Primary"
    >
      {#if !$isAuthorized}
        <a class="lb-nav__cta" href="/silent-redirect">{m.nav_link_sign_in()}</a>
        <a class="lb-nav__cta lb-nav__cta--accent" href="/silent-redirect">
          {m.nav_link_create_account()}
        </a>
      {/if}

      {#each navLinks as link (link.key)}
        <a class="lb-nav__link" href={link.href}>{link.label}</a>
      {/each}

      <a class="lb-nav__icon" href="/search" aria-label="Search">
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.6" />
          <line x1="12.5" y1="12.5" x2="17" y2="17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
      </a>

      {#if $isAuthorized && $user}
        <a
          class="lb-nav__icon lb-nav__icon--activity"
          href={activityHref}
          aria-label={m.avatar_menu_activity()}
          title={m.avatar_menu_activity()}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
          </svg>
        </a>

        <div class="lb-nav__avatar-wrap" bind:this={avatarRoot}>
          <button
            type="button"
            class="lb-nav__avatar"
            aria-label="Profile menu"
            aria-haspopup="menu"
            aria-expanded={isAvatarMenuOpen}
            onclick={() => (isAvatarMenuOpen = !isAvatarMenuOpen)}
          >
            {#if $user.avatar?.url}
              <img src={$user.avatar.url} alt="" />
            {:else}
              <span aria-hidden="true">{($user.name?.full ?? $user.username ?? '?').charAt(0)}</span>
            {/if}
          </button>

          {#if isAvatarMenuOpen}
            <div class="lb-nav__avatar-menu" role="menu">
              {#each avatarMenu as item (item.key)}
                <a
                  class="lb-nav__avatar-menu-item"
                  role="menuitem"
                  href={item.href}
                  onclick={() => (isAvatarMenuOpen = false)}
                >{item.label}</a>
              {/each}
              <button
                type="button"
                class="lb-nav__avatar-menu-item lb-nav__avatar-menu-item--signout"
                role="menuitem"
                onclick={() => {
                  isAvatarMenuOpen = false;
                  void logout();
                }}
              >{m.avatar_menu_sign_out()}</button>
            </div>
          {/if}
        </div>
      {/if}
    </nav>
  </div>
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-nav {
    position: sticky;
    top: 0;
    z-index: var(--layer-floating, 100);
    background: color-mix(in srgb, var(--shade-1000) 92%, transparent);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 6%, transparent);

    &__inner {
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 clamp(16px, 3vw, 32px);
      height: 56px;
      display: flex;
      align-items: center;
      gap: var(--gap-l);
    }

    &__brand {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      color: var(--color-text-primary);
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: lowercase;
      flex-shrink: 0;

      &-text {
        font-size: 0.95rem;
      }

      &-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: inline-block;
        background: var(--color-background-green, var(--green-500));

        &--mid { background: var(--blue-500, #40bcf4); }
        &--last { background: var(--orange-500, #ff8000); }
      }
    }

    &__burger {
      all: unset;
      // Hidden on desktop; for-mobile media query flips this back to block.
      display: none;
      cursor: pointer;
      width: 32px;
      height: 32px;
      position: relative;
      margin-left: auto;

      span {
        position: absolute;
        left: 6px;
        right: 6px;
        height: 2px;
        background: var(--color-text-primary);
        transition: transform 140ms ease;
      }

      span:nth-child(1) { top: 10px; }
      span:nth-child(2) { top: 15px; }
      span:nth-child(3) { top: 20px; }
    }

    &__links {
      display: flex;
      align-items: center;
      gap: var(--gap-m);
      margin-left: auto;
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    &__link {
      text-decoration: none;
      color: var(--color-text-secondary);
      font-weight: 600;

      &:hover { color: var(--color-text-primary); }
    }

    &__cta {
      text-decoration: none;
      color: var(--color-text-secondary);
      font-weight: 700;

      &:hover { color: var(--color-text-primary); }

      &--accent {
        color: var(--color-background-green, var(--green-500));

        &:hover {
          color: var(--green-400, var(--color-background-green));
        }
      }
    }

    &__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-secondary);
      text-decoration: none;
      padding: 6px;

      &:hover { color: var(--color-text-primary); }
    }

    &__avatar-wrap {
      position: relative;
    }

    &__avatar {
      all: unset;
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--shade-900) 80%, transparent);
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-primary);
      font-weight: 700;
      font-size: 0.85rem;
      border: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &:hover {
        border-color: var(--color-watched);
      }
    }

    &__avatar-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      min-width: 200px;
      display: flex;
      flex-direction: column;
      padding: 6px;
      gap: 1px;
      background: color-mix(in srgb, var(--shade-900) 96%, transparent);
      border: 1px solid color-mix(in srgb, var(--shade-10) 10%, transparent);
      border-radius: 4px;
      box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
      z-index: calc(var(--layer-floating, 100) + 1);
    }

    &__avatar-menu-item {
      all: unset;
      cursor: pointer;
      padding: 8px 12px;
      font-size: 0.8rem;
      letter-spacing: 0.04em;
      color: var(--color-text-primary);
      text-decoration: none;
      border-radius: 2px;
      display: block;

      &:hover {
        background: color-mix(in srgb, var(--shade-10) 6%, transparent);
      }

      &--signout {
        margin-top: 6px;
        border-top: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
        padding-top: 12px;
        text-align: left;
        color: var(--color-text-secondary);

        &:hover { color: var(--color-text-primary); }
      }
    }

    @include for-mobile {
      &__burger { display: block; }

      &__links {
        position: fixed;
        inset: 56px 0 auto 0;
        flex-direction: column;
        align-items: stretch;
        background: var(--shade-1000);
        padding: var(--gap-m) var(--gap-l);
        border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 6%, transparent);
        transform: translateY(-110%);
        transition: transform 180ms ease;
        margin-left: 0;

        &[data-open="true"] {
          transform: translateY(0);
        }
      }

      &__link,
      &__cta {
        padding: var(--gap-s) 0;
      }
    }
  }
</style>
