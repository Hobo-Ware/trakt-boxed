<script lang="ts">
  /*
    The Letterboxd-flavour top ribbon. A single thin bar present on
    every page: three-dot logo on the left, primary destinations
    inline (Films / Lists / Members / Journal), and a search affordance
    on the right. Authenticated users see a profile avatar tile and
    drop the Sign in / Create account pair.

    Reference: research/notes/homepage.md and the Letterboxd top bar
    visible in every desktop screenshot in the research set.
  */
  import Logo from "$lib/components/logo/Logo.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import HamburgerIcon from "$lib/components/icons/MenuIcon.svelte";
  import ProfileIcon from "$lib/components/icons/ProfileIcon.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { isAuthorized, login } = useAuth();
  const { user } = useUser();
  const isCompact = useMedia(WellKnownMediaQuery.mobile);

  let isSheetOpen = $state(false);
  const closeSheet = () => (isSheetOpen = false);
</script>

<header class="lb-nav">
  <div class="lb-nav-inner">
    <Link href={UrlBuilder.home()} color="inherit" label="trakt-boxed home">
      <Logo showWordmark={!$isCompact} />
    </Link>

    {#if !$isCompact}
      <nav class="lb-nav-primary" aria-label="Primary navigation">
        {#if !$isAuthorized}
          <button class="lb-nav-link" type="button" onclick={login}>
            {m.button_text_login()}
          </button>
          <button class="lb-nav-link" type="button" onclick={login}>
            {m.button_text_create_account()}
          </button>
        {/if}
        <Link
          href={UrlBuilder.movies()}
          color="inherit"
          label={m.button_label_films()}
        >
          <span class="lb-nav-link">{m.button_label_films()}</span>
        </Link>
        <Link
          href={UrlBuilder.lists.user("me")}
          color="inherit"
          label={m.button_label_browse_lists()}
        >
          <span class="lb-nav-link">{m.text_lists()}</span>
        </Link>
        <Link
          href="/members/popular"
          color="inherit"
          label={m.button_label_members()}
        >
          <span class="lb-nav-link">{m.text_members()}</span>
        </Link>
        <Link href="/journal" color="inherit" label={m.button_label_journal()}>
          <span class="lb-nav-link">{m.text_journal()}</span>
        </Link>
      </nav>
    {/if}

    <div class="lb-nav-tail">
      <Link href={UrlBuilder.search()} label={m.button_label_search()}>
        <SearchIcon />
      </Link>

      <RenderFor audience="authenticated">
        <Link
          href={UrlBuilder.profile.me()}
          label={m.button_label_profile()}
        >
          {#if $user.avatar.url}
            <img
              class="lb-nav-avatar"
              src={$user.avatar.url}
              alt={$user.name.first}
            />
          {:else}
            <ProfileIcon />
          {/if}
        </Link>
      </RenderFor>

      {#if $isCompact}
        <button
          type="button"
          class="lb-nav-icon-button"
          onclick={() => (isSheetOpen = !isSheetOpen)}
          aria-label="Open navigation menu"
        >
          <HamburgerIcon />
        </button>
      {/if}
    </div>
  </div>

  {#if isSheetOpen}
    <div
      class="lb-nav-sheet"
      role="dialog"
      aria-label="Navigation"
    >
      {#if !$isAuthorized}
        <button
          class="lb-nav-sheet-link"
          type="button"
          onclick={() => {
            login();
            closeSheet();
          }}
        >
          {m.button_text_login()}
        </button>
        <button
          class="lb-nav-sheet-link"
          type="button"
          onclick={() => {
            login();
            closeSheet();
          }}
        >
          {m.button_text_create_account()}
        </button>
      {/if}
      <Link
        href={UrlBuilder.movies()}
        color="inherit"
        label={m.button_label_films()}
      >
        <span class="lb-nav-sheet-link" onclick={closeSheet} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && closeSheet()}
          >{m.button_label_films()}</span
        >
      </Link>
      <Link
        href={UrlBuilder.lists.user("me")}
        color="inherit"
        label={m.button_label_browse_lists()}
      >
        <span class="lb-nav-sheet-link" onclick={closeSheet} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && closeSheet()}
          >{m.text_lists()}</span
        >
      </Link>
      <Link
        href="/members/popular"
        color="inherit"
        label={m.button_label_members()}
      >
        <span class="lb-nav-sheet-link" onclick={closeSheet} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && closeSheet()}
          >{m.text_members()}</span
        >
      </Link>
      <Link href="/journal" color="inherit" label={m.button_label_journal()}>
        <span class="lb-nav-sheet-link" onclick={closeSheet} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && closeSheet()}
          >{m.text_journal()}</span
        >
      </Link>
    </div>
  {/if}

  <div class="lb-nav-spacer"></div>
</header>

<style>
  .lb-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--layer-overlay);

    background: var(--color-background);
    border-bottom: var(--ni-1) solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);

    /*
      Letterboxd's top bar is severely thin. Slim padding, monoline
      contents, no background gradient.
    */
  }

  .lb-nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);

    height: var(--ni-44);
    max-width: var(--ni-1280);
    margin-inline: auto;

    padding: 0 var(--ni-16);

    margin-top: env(safe-area-inset-top, 0);
    box-sizing: border-box;
  }

  .lb-nav-primary {
    display: flex;
    align-items: center;
    gap: var(--ni-20);

    flex: 1;
    margin-left: var(--ni-32);
  }

  .lb-nav-link {
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;

    color: var(--color-foreground);
    font-family: inherit;
    font-size: var(--ni-12);
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    line-height: 1;
  }

  .lb-nav-link:hover {
    color: var(--tboxed-positive);
  }

  .lb-nav-tail {
    display: flex;
    align-items: center;
    gap: var(--ni-12);
    flex-shrink: 0;
  }

  .lb-nav-tail :global(svg) {
    width: var(--ni-22);
    height: var(--ni-22);
    color: var(--color-foreground);
  }

  .lb-nav-tail :global(.trakt-link) {
    display: inline-flex;
    align-items: center;
    color: var(--color-foreground);
  }

  .lb-nav-icon-button {
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    color: var(--color-foreground);
    display: inline-flex;
    align-items: center;
  }

  .lb-nav-avatar {
    width: var(--ni-30);
    height: var(--ni-30);
    border-radius: 50%;
    object-fit: cover;
  }

  .lb-nav-sheet {
    background: var(--color-background);
    border-bottom: var(--ni-1) solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);

    display: flex;
    flex-direction: column;

    padding: var(--ni-12) var(--ni-16);
  }

  .lb-nav-sheet-link {
    background: transparent;
    border: none;
    padding: var(--ni-12) 0;
    margin: 0;
    text-align: left;

    color: var(--color-foreground);
    font-family: inherit;
    font-size: var(--ni-14);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;

    border-bottom: var(--ni-1) solid
      color-mix(in srgb, var(--color-foreground) 6%, transparent);
  }

  .lb-nav-sheet-link:last-child {
    border-bottom: none;
  }

  .lb-nav-sheet-link:hover {
    color: var(--tboxed-positive);
  }

  /*
    Spacer for fixed-position header so page content sits below it.
  */
  .lb-nav-spacer {
    height: calc(var(--ni-44) + env(safe-area-inset-top, 0));
  }
</style>
