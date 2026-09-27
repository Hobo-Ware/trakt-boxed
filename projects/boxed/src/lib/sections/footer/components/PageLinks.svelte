<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { user } = useUser();
</script>

<div class="trakt-page-links">
  <div class="trakt-link-group">
    <span class="trakt-link-group-label">{m.text_footer_category_platform()}</span>
    <Link href={UrlBuilder.about()}>
      <span>{m.link_text_about()}</span>
    </Link>
    <Link href={UrlBuilder.vip()}>
      <span>VIP</span>
    </Link>
    <Link
      href={UrlBuilder.developer.home()}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>{m.link_text_developer()}</span>
    </Link>
  </div>

  <div class="trakt-link-group">
    <span class="trakt-link-group-label">{m.text_footer_category_community()}</span>
    <Link
      href={UrlBuilder.og.forums()}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>{m.link_text_forums()}</span>
    </Link>
    <RenderFor audience="vip">
      <Link
        href={UrlBuilder.og.support($user?.slug)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>{m.link_text_support()}</span>
      </Link>
      <Link
        href={UrlBuilder.feedback()}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>{m.link_text_feedback()}</span>
      </Link>
    </RenderFor>
  </div>

  <div class="trakt-link-group">
    <span class="trakt-link-group-label">{m.text_footer_category_legal()}</span>
    <Link href={UrlBuilder.terms()}>
      <span>{m.link_text_terms()}</span>
    </Link>
    <Link href={UrlBuilder.privacy()}>
      <span>{m.link_text_privacy()}</span>
    </Link>
    <Link href={UrlBuilder.branding()}>
      <span>{m.link_text_branding()}</span>
    </Link>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-page-links {
    display: flex;
    gap: var(--gap-xxl);

    @include for-mobile() {
      gap: var(--gap-l);
    }
  }

  .trakt-link-group {
    display: flex;
    flex-direction: column;
    gap: var(--ni-10);
  }

  .trakt-link-group-label {
    font-size: var(--ni-12);
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .trakt-link-group :global(.trakt-link) {
    font-size: var(--ni-14);
    color: var(--color-text-primary);
    text-decoration: none;
  }

  @include for-mouse {
    .trakt-link-group :global(.trakt-link:hover) {
      color: var(--boxed-color-accent-text);
    }
  }
</style>
