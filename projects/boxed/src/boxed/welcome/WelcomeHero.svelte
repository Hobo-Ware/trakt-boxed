<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import Logo from "$lib/components/logo/Logo.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import PosterWall from "../static/PosterWall.svelte";

  const { user } = useUser();

  const heading = $derived(
    $user?.username
      ? m.welcome_greeting({ name: toDisplayableName($user) })
      : m.welcome_greeting_generic(),
  );
</script>

<section class="boxed-welcome-hero" aria-labelledby="boxed-welcome-title">
  <PosterWall />

  <header class="hero-bar">
    <Link href={UrlBuilder.home()} label={m.page_title_home()} color="inherit">
      <Logo />
    </Link>
    <a class="hero-skip" href={UrlBuilder.home()}>{m.boxed_welcome_skip()}</a>
  </header>

  <div class="hero-copy">
    <h1 id="boxed-welcome-title">{heading}</h1>
    <p>{m.welcome_intro()}</p>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-welcome-hero {
    position: relative;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--ni-40);

    min-height: var(--ni-380);
    box-sizing: border-box;
    padding: 0 var(--layout-distance-side) var(--ni-40);

    @include for-mobile {
      min-height: var(--ni-320);
      gap: var(--ni-24);
      padding-block-end: var(--ni-24);
    }
  }

  .hero-bar,
  .hero-copy {
    position: relative;
    width: 100%;
    max-width: var(--boxed-content-max-width);
    margin-inline: auto;
  }

  .hero-bar {
    height: var(--ni-72);

    display: flex;
    align-items: center;
    justify-content: space-between;

    :global(.trakt-link) {
      text-decoration: none;
    }

    :global(svg) {
      display: block;
      height: var(--ni-28);
      width: auto;
    }

    @include for-mobile {
      height: var(--ni-56);
    }
  }

  .hero-skip {
    text-decoration: none;
    font-size: var(--ni-14);
    color: var(--color-text-secondary);

    &:hover {
      color: var(--color-text-primary);
    }
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);

    h1 {
      margin: 0;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-56);
      font-weight: 600;
      line-height: 1.1;
      letter-spacing: -0.01em;

      @include for-tablet-sm-and-below {
        font-size: var(--ni-40);
      }

      @include for-mobile {
        min-height: 2.2em;
        font-size: var(--ni-32);
      }
    }

    p {
      margin: 0;
      max-width: 64ch;
      font-size: var(--ni-18);
      line-height: 1.6;
      color: var(--color-text-secondary);

      @include for-mobile {
        font-size: var(--ni-16);
      }
    }
  }
</style>
