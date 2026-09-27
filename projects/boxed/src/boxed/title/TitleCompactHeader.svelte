<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";

  type TitleCompactHeaderProps = {
    eyebrow: string;
    title: string | undefined;
    href: string;
    poster: string | undefined;
    year?: number | Nil;
    credit?: Snippet;
  };

  const { eyebrow, title, href, poster, year, credit }: TitleCompactHeaderProps =
    $props();
</script>

<header class="boxed-compact-header">
  <a class="boxed-compact-poster" {href} aria-label={title}>
    {#if poster && title}
      <CrossOriginImage
        src={poster}
        alt={m.image_alt_media_poster({ title })}
        loading="eager"
      />
    {/if}
  </a>
  <div class="boxed-compact-text">
    <span class="boxed-compact-eyebrow">{eyebrow}</span>
    <div class="boxed-compact-line">
      <a class="boxed-compact-title" {href}>{title ?? ""}</a>
      {#if year}
        <span class="boxed-compact-year">{year}</span>
      {/if}
      {#if credit}
        <span class="boxed-compact-credit">{@render credit()}</span>
      {/if}
    </div>
  </div>
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-compact-header {
    display: flex;
    align-items: center;
    gap: var(--ni-18);
    min-width: 0;
  }

  .boxed-compact-poster {
    flex-shrink: 0;
    width: var(--ni-60);
    aspect-ratio: 2 / 3;

    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: var(--color-card-background);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .boxed-compact-text {
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
  }

  .boxed-compact-eyebrow {
    font-size: var(--ni-12);
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .boxed-compact-line {
    min-height: calc(var(--ni-36) * 1.2);

    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: var(--ni-10);
  }

  .boxed-compact-title {
    font-family: var(--boxed-font-title);
    font-weight: 600;
    font-size: var(--ni-36);
    line-height: 1.2;
    letter-spacing: -0.01em;
    text-decoration: none;
    color: var(--color-text-primary);

    @include for-tablet-lg-and-below {
      font-size: var(--ni-24);
    }
  }

  .boxed-compact-year {
    font-size: var(--ni-16);
    color: var(--color-text-secondary);
  }

  .boxed-compact-credit {
    font-size: var(--ni-14);
    color: var(--color-text-secondary);

    :global(a) {
      color: inherit;
      text-decoration: none;

      &:hover,
      &:focus-visible {
        color: var(--color-text-primary);
      }
    }
  }
</style>
