<script lang="ts">
  /*
    Letterboxd-flavour sign-in landing. trakt-boxed delegates auth to
    the Trakt OIDC provider, so this page is the marketing card that
    bridges to that flow rather than a form. Centered slate card,
    three-dot mark, big serif heading, single CTA.

    Reference: research/notes/signin-modal.md and signin-modal-mobile.png.
  */
  import Logo from "$lib/components/logo/Logo.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { login } = useAuth();
</script>

<TraktPage
  audience="public"
  image={DEFAULT_SHARE_COVER}
  title={m.button_text_login()}
>
  <div class="lb-signin-page">
    <div class="lb-signin-card">
      <div class="lb-signin-mark">
        <Logo showWordmark={false} />
      </div>

      <h1 class="lb-signin-title">{m.text_signin_title()}</h1>

      <button class="lb-signin-cta" type="button" onclick={login}>
        {m.button_text_login()}
      </button>

      <p class="lb-signin-prompt">
        {m.text_signin_new_prompt()}
        <button
          type="button"
          class="lb-signin-pill"
          onclick={login}
        >
          {m.button_text_create_account()}
        </button>
      </p>
    </div>

    <footer class="lb-signin-foot">
      <Link href={UrlBuilder.terms()} color="inherit">
        <span>{m.link_text_terms()}</span>
      </Link>
      <span aria-hidden="true">·</span>
      <Link href={UrlBuilder.privacy()} color="inherit">
        <span>{m.link_text_privacy()}</span>
      </Link>
      <span aria-hidden="true">·</span>
      <Link
        href={UrlBuilder.og.support()}
        target="_blank"
        rel="noopener noreferrer"
        color="inherit"
      >
        <span>{m.link_text_support()}</span>
      </Link>
    </footer>
  </div>
</TraktPage>

<style>
  .lb-signin-page {
    min-height: 80dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ni-44);

    padding: var(--ni-44) var(--ni-20);
    box-sizing: border-box;
  }

  .lb-signin-card {
    /* Steel-blue slate card on the near-black canvas, the only place
       the brand surface departs from the page bg. */
    background: color-mix(in srgb, var(--shade-700) 70%, var(--shade-900));
    border-radius: var(--border-radius-l);

    padding: var(--ni-44) var(--ni-32);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-22);

    width: 100%;
    max-width: var(--ni-420);
    box-sizing: border-box;
    text-align: center;
  }

  .lb-signin-mark :global(.trakt-boxed-logo-mark) {
    height: var(--ni-26);
  }

  .lb-signin-title {
    margin: 0;
    font-weight: 700;
    font-size: var(--ni-26);
    color: var(--color-foreground);
    letter-spacing: -0.01em;
  }

  .lb-signin-cta {
    appearance: none;
    border: none;
    cursor: pointer;

    background: var(--tboxed-positive);
    color: var(--shade-1000);

    padding: var(--ni-12) var(--ni-26);
    border-radius: var(--border-radius-xs);

    font-family: inherit;
    font-size: var(--ni-14);
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;

    transition: background var(--transition-increment) ease-in-out;
  }

  .lb-signin-cta:hover {
    background: var(--tboxed-positive-hover);
  }

  .lb-signin-prompt {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground) 70%, transparent);
    font-size: var(--ni-14);
    display: inline-flex;
    align-items: center;
    gap: var(--ni-8);
    flex-wrap: wrap;
    justify-content: center;
  }

  .lb-signin-pill {
    appearance: none;
    border: none;
    cursor: pointer;

    background: color-mix(in srgb, var(--shade-600) 40%, transparent);
    color: var(--color-foreground);

    padding: var(--ni-6) var(--ni-12);
    border-radius: 999px;

    font-family: inherit;
    font-size: var(--ni-12);
    font-weight: 600;
    letter-spacing: 0.04em;

    transition: background var(--transition-increment) ease-in-out;
  }

  .lb-signin-pill:hover {
    background: color-mix(in srgb, var(--shade-500) 50%, transparent);
  }

  .lb-signin-foot {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-12);

    font-size: var(--ni-10);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-text-secondary);
  }

  .lb-signin-foot :global(.trakt-link) {
    text-decoration: none;
  }

  .lb-signin-foot :global(.trakt-link:hover) {
    color: var(--tboxed-positive);
  }
</style>
