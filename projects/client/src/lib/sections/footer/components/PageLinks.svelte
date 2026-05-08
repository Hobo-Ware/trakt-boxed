<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<div class="trakt-page-links">
  <Link href={UrlBuilder.og.forums()} target="_blank" rel="noopener noreferrer">
    <span class="bold">{m.link_text_forums()}</span>
  </Link>

  <Link href={UrlBuilder.about()}>
    <span class="bold">{m.link_text_about()}</span>
  </Link>

  <Link href={UrlBuilder.branding()}>
    <span class="bold">{m.link_text_branding()}</span>
  </Link>

  <Link href={UrlBuilder.terms()}>
    <span class="bold">{m.link_text_terms()}</span>
  </Link>

  <Link href={UrlBuilder.privacy()}>
    <span class="bold">{m.link_text_privacy()}</span>
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-page-links {
    display: flex;
    gap: var(--gap-l);

    @include for-mobile() {
      justify-content: center;
      flex-wrap: wrap;
      gap: var(--gap-s);
    }

    :global(.trakt-link) {
      text-decoration: none;
    }
  }
</style>
