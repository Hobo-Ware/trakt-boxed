<script lang="ts">
  /*
    The Letterboxd-flavour entity hero — a cinematic backdrop that
    bleeds full-width and fades into the page background, with the
    poster + title block sitting below. Reference:
    research/notes/film-summary.md, used for both films and shows.

    Title is Fraunces serif at responsive size; the eyebrow above
    declares the entity type ("FILM" / "SHOW") in tracked uppercase;
    crew shows directors (films) or creators (shows) inline as
    Letterboxd's green author-link treatment.
  */
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { CrewMember, MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { MEDIA_POSTER_PLACEHOLDER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type LetterboxdMediaHeroProps = {
    media: MediaEntry;
    crew: MediaCrew;
    type: MediaType;
    intlTitle?: string | null;
    overview?: string | null;
  };

  const {
    media,
    crew,
    type,
    intlTitle,
    overview,
  }: LetterboxdMediaHeroProps = $props();

  const title = $derived(intlTitle ?? media.title);

  const credit = $derived.by((): { label: string; people: CrewMember[] } => {
    if (type === "show") {
      const creators = crew.creators ?? [];
      if (creators.length > 0)
        return { label: m.eyebrow_credit_created_by(), people: creators };
    }
    const directors = crew.directors ?? [];
    if (directors.length > 0)
      return { label: m.eyebrow_credit_directed_by(), people: directors };

    const writers = crew.writers ?? [];
    if (writers.length > 0)
      return { label: m.eyebrow_credit_written_by(), people: writers };

    return { label: "", people: [] };
  });

  const eyebrow = $derived(
    type === "movie" ? m.eyebrow_entity_film() : m.eyebrow_entity_show(),
  );
</script>

<section class="lb-media-hero">
  {#if media.cover?.url?.medium}
    <CrossOriginImage
      classList="lb-media-hero-image"
      src={media.cover.url.medium}
      alt={title}
    />
  {/if}
  <div class="lb-media-hero-fade"></div>

  <div class="lb-media-hero-stack">
    <div class="lb-media-hero-poster">
      <Link href="#" color="inherit">
        <img
          class="lb-media-hero-poster-img"
          src={media.poster?.url?.medium ?? MEDIA_POSTER_PLACEHOLDER}
          alt={title}
          loading="lazy"
        />
      </Link>
    </div>

    <div class="lb-media-hero-meta">
      <p class="lb-media-hero-eyebrow">{eyebrow}</p>
      <h1 class="lb-media-hero-title">{title}</h1>
      <p class="lb-media-hero-attribution">
        {#if media.year}
          <span class="lb-media-hero-year">{media.year}</span>
        {/if}
        {#if credit.people.length > 0}
          <span class="lb-media-hero-credit-label">{credit.label}</span>
          {#each credit.people as person, i (person.key)}
            {#if i > 0},{/if}
            <Link href={UrlBuilder.people(person.key)} color="inherit">
              <span class="lb-media-hero-credit-name">{person.name}</span>
            </Link>
          {/each}
        {/if}
      </p>

      {#if overview}
        <p class="lb-media-hero-overview">{overview}</p>
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-media-hero {
    position: relative;
    isolation: isolate;
    width: 100%;

    /* Backdrop frame — taller on mobile so the still has presence
       behind the poster + title; flatter on desktop where the
       block sits beside it. */
    padding-bottom: var(--ni-32);
  }

  :global(.lb-media-hero-image) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 65%;
    object-fit: cover;
    object-position: center 30%;
    z-index: 0;
    opacity: 0.55;

    @include for-tablet-lg {
      height: 70%;
    }
  }

  .lb-media-hero-fade {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background) 30%, transparent) 0%,
      transparent 25%,
      transparent 50%,
      color-mix(in srgb, var(--color-background) 80%, transparent) 80%,
      var(--color-background) 100%
    );
  }

  .lb-media-hero-stack {
    position: relative;
    z-index: 2;

    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ni-22);

    width: 100%;
    max-width: var(--ni-1280);
    margin-inline: auto;
    padding: 35dvh var(--ni-16) 0;
    box-sizing: border-box;

    @include for-tablet-sm {
      padding-top: 30dvh;
    }

    @include for-tablet-lg {
      grid-template-columns: var(--ni-220) 1fr;
      gap: var(--ni-32);
      padding-top: 35dvh;
      align-items: end;
    }
  }

  .lb-media-hero-poster {
    width: var(--ni-160);
    flex-shrink: 0;

    :global(.trakt-link) {
      display: block;
      text-decoration: none;
    }

    @include for-tablet-lg {
      width: var(--ni-220);
    }
  }

  .lb-media-hero-poster-img {
    width: 100%;
    aspect-ratio: 2 / 3;
    object-fit: cover;
    border-radius: var(--border-radius-xs);
    box-shadow: 0 var(--ni-8) var(--ni-26)
      color-mix(in srgb, var(--shade-1000) 60%, transparent);
  }

  .lb-media-hero-meta {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
    min-width: 0;
  }

  .lb-media-hero-eyebrow {
    margin: 0;
    font-size: var(--ni-11);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    font-weight: 700;
  }

  .lb-media-hero-title {
    margin: 0;
    font-family: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
    font-optical-sizing: auto;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
    color: var(--color-foreground);

    font-size: var(--ni-32);

    @include for-tablet-sm {
      font-size: var(--ni-44);
    }

    @include for-tablet-lg {
      font-size: var(--ni-60);
    }
  }

  .lb-media-hero-attribution {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--ni-13);
    line-height: 1.4;
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--ni-6);
    align-items: baseline;

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .lb-media-hero-year {
    color: var(--color-foreground);
    font-weight: 600;
  }

  .lb-media-hero-credit-label {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: var(--ni-11);
  }

  .lb-media-hero-credit-name {
    color: var(--tboxed-positive);
    font-weight: 700;
    font-size: var(--ni-13);
  }

  .lb-media-hero-overview {
    margin: var(--ni-8) 0 0;
    color: color-mix(in srgb, var(--color-foreground) 90%, transparent);
    font-size: var(--ni-15);
    line-height: 1.55;
    max-width: var(--ni-720);
  }
</style>
