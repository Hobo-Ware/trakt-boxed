<script lang="ts">
  import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
  import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
  import * as m from '$lib/features/i18n/messages.ts';

  type Props = {
    entry: MovieEntry | ShowEntry;
  };

  const { entry }: Props = $props();

  const href = $derived(
    entry.type === 'movie' ? UrlBuilder.movie(entry.slug) : UrlBuilder.show(entry.slug),
  );
</script>

<section class="home-hero">
  {#if entry.cover?.url?.medium ?? entry.cover?.url?.thumb}
    <img
      class="home-hero__backdrop"
      src={entry.cover.url.medium ?? entry.cover.url.thumb}
      alt={entry.title}
      loading="eager"
    />
  {/if}
  <div class="home-hero__fade"></div>

  <div class="home-hero__content">
    <p class="home-hero__eyebrow">{m.home_hero_eyebrow()}</p>
    <a class="home-hero__title" {href}>{entry.title}</a>
    {#if entry.tagline}
      <p class="home-hero__tagline">{entry.tagline}</p>
    {/if}
    <div class="home-hero__cta-row">
      <a class="home-hero__cta home-hero__cta--primary" {href}>
        {m.home_hero_cta_view()}
      </a>
      <a class="home-hero__cta" href="/films">
        {m.home_hero_cta_browse()}
      </a>
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .home-hero {
    position: relative;
    width: 100%;
    aspect-ratio: 21 / 9;
    max-height: 520px;
    min-height: 280px;
    overflow: hidden;
    background: var(--shade-1000);
    isolation: isolate;

    &__backdrop {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 25%;
      opacity: 0.7;
      z-index: 0;
    }

    &__fade {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--shade-1000) 40%, transparent) 0%,
        color-mix(in srgb, var(--shade-1000) 10%, transparent) 50%,
        var(--shade-1000) 100%
      );
    }

    &__content {
      position: absolute;
      inset: auto 0 0 0;
      z-index: 2;
      max-width: 1600px;
      margin: 0 auto;
      padding: clamp(20px, 4vw, 48px);
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
    }

    &__eyebrow {
      margin: 0;
      font-size: 0.72rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--color-background-green, var(--green-500));
      font-weight: 700;
    }

    &__title {
      font-family: var(--font-family-serif, "Tiempos Headline", Georgia, serif);
      font-weight: 400;
      font-size: clamp(2.4rem, 5vw, 4.2rem);
      line-height: 1.05;
      color: var(--color-text-primary);
      text-decoration: none;
      letter-spacing: -0.01em;

      &:hover {
        color: var(--color-background-green, var(--green-500));
      }
    }

    &__tagline {
      margin: 0;
      font-size: 0.95rem;
      color: var(--color-text-secondary);
      max-width: 60ch;
    }

    &__cta-row {
      display: flex;
      gap: var(--gap-s);
      margin-top: var(--gap-s);
    }

    &__cta {
      display: inline-block;
      padding: 0.6rem 1.2rem;
      border-radius: 3px;
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 700;
      text-decoration: none;
      color: var(--color-text-primary);
      border: 1px solid color-mix(in srgb, var(--shade-10) 12%, transparent);

      &:hover {
        border-color: var(--color-background-green, var(--green-500));
        color: var(--color-background-green, var(--green-500));
      }

      &--primary {
        background: var(--color-background-green, var(--green-500));
        color: var(--shade-1000);
        border-color: var(--color-background-green, var(--green-500));

        &:hover {
          background: var(--green-400);
          color: var(--shade-1000);
        }
      }
    }

    @include for-mobile {
      aspect-ratio: 4 / 5;
      max-height: 460px;
    }
  }
</style>
