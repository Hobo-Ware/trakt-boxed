<script lang="ts">
  /*
    Letterboxd-style header for a single list detail page. Treats the
    list as an editorial artifact — author byline first, then big serif
    title, then the description as a real paragraph (not a tooltip
    ellipsis). Reference: research/notes/single-list.md ("Letterboxd
    treats curated lists as editorial artifacts").
  */
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { list }: { list: MediaListSummary } = $props();

  const authorHref = $derived(
    list.user?.slug ? UrlBuilder.profile.user(list.user.slug) : undefined,
  );
</script>

<header class="trakt-list-detail-header">
  {#if list.user}
    <p class="trakt-list-detail-byline">
      <span class="summary-eyebrow">{m.eyebrow_list_by()}</span>
      {#if authorHref}
        <Link href={authorHref}>
          <span class="trakt-list-detail-author">{list.user.name}</span>
        </Link>
      {:else}
        <span class="trakt-list-detail-author">{list.user.name}</span>
      {/if}
    </p>
  {/if}

  <h1 class="trakt-list-detail-title">{list.name}</h1>

  {#if list.description}
    <p class="trakt-list-detail-description">{list.description}</p>
  {/if}
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-detail-header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    width: 100%;
    max-width: var(--ni-720);
    margin-inline: auto;

    padding-inline: var(--layout-distance-side);
    padding-block: var(--gap-l) var(--gap-m);
  }

  .trakt-list-detail-byline {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);
    margin: 0;

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .trakt-list-detail-author {
    color: var(--tboxed-positive);
    font-weight: 600;
  }

  /*
    Title is the most prominent type on the page — Fraunces serif at a
    generous size, matching the film summary title treatment so the two
    surfaces feel like siblings.
  */
  .trakt-list-detail-title {
    margin: 0;
    font-family: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
    font-optical-sizing: auto;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.05;

    font-size: var(--ni-30);
    color: var(--color-foreground);

    @include for-tablet-lg {
      font-size: var(--ni-44);
    }
  }

  .trakt-list-detail-description {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--font-size-text);
    line-height: 1.55;
    white-space: pre-wrap;
  }
</style>
