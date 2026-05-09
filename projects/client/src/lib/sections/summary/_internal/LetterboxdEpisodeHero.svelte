<script lang="ts">
  /*
    Episode hero — Letterboxd has no episode page, so this is
    greenfield. The treatment mirrors the film hero (cinematic
    backdrop, fade, Fraunces title) but the eyebrow is a breadcrumb
    "From <Show>", season/episode pills replace the year+credit
    line, and the air date sits where directors usually do.
  */
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type LetterboxdEpisodeHeroProps = {
    episode: EpisodeEntry;
    show: ShowEntry;
    intlTitle?: string | null;
    showIntlTitle?: string | null;
  };

  const { episode, show, intlTitle, showIntlTitle }: LetterboxdEpisodeHeroProps =
    $props();

  const title = $derived(intlTitle ?? episode.title);
  const showTitle = $derived(showIntlTitle ?? show.title);

  const airedLabel = $derived.by(() => {
    if (!episode.airDate) return null;
    try {
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(episode.airDate);
    } catch {
      return null;
    }
  });
</script>

<section class="lb-ep-hero">
  {#if episode.cover?.url}
    <CrossOriginImage
      classList="lb-ep-hero-image"
      src={episode.cover.url}
      alt={title}
    />
  {/if}
  <div class="lb-ep-hero-fade"></div>

  <div class="lb-ep-hero-stack">
    <p class="lb-ep-hero-eyebrow">
      <span class="lb-ep-hero-entity">{m.eyebrow_entity_episode()}</span>
      <span class="lb-ep-hero-divider" aria-hidden="true">/</span>
      <Link href={UrlBuilder.show(show.slug)} color="inherit">
        <span class="lb-ep-hero-show">
          {m.lb_episode_breadcrumb({ show: showTitle })}
        </span>
      </Link>
    </p>

    <h1 class="lb-ep-hero-title">{title}</h1>

    <p class="lb-ep-hero-attribution">
      <span class="lb-ep-hero-pill">
        {m.lb_episode_season_number({ number: episode.season })}
      </span>
      <span class="lb-ep-hero-pill">
        {m.lb_episode_episode_number({ number: episode.number })}
      </span>
      {#if airedLabel}
        <span class="lb-ep-hero-aired">
          <span class="lb-ep-hero-aired-label">
            {m.lb_episode_meta_aired()}
          </span>
          <span class="lb-ep-hero-aired-value">{airedLabel}</span>
        </span>
      {/if}
    </p>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-ep-hero {
    position: relative;
    isolation: isolate;
    width: 100%;
    padding-bottom: var(--ni-32);
  }

  :global(.lb-ep-hero-image) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 70%;
    object-fit: cover;
    object-position: center 35%;
    z-index: 0;
    opacity: 0.55;
  }

  .lb-ep-hero-fade {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background) 40%, transparent) 0%,
      transparent 25%,
      transparent 45%,
      color-mix(in srgb, var(--color-background) 75%, transparent) 75%,
      var(--color-background) 100%
    );
  }

  .lb-ep-hero-stack {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
    width: 100%;
    max-width: var(--ni-1280);
    margin-inline: auto;
    padding: 35dvh var(--ni-16) 0;
    box-sizing: border-box;

    @include for-tablet-lg {
      padding-top: 30dvh;
      padding-inline: var(--ni-32);
    }
  }

  .lb-ep-hero-eyebrow {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--ni-8);
    font-size: var(--ni-11);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    font-weight: 700;
  }

  .lb-ep-hero-entity {
    color: var(--color-text-secondary);
  }

  .lb-ep-hero-divider {
    color: color-mix(in srgb, var(--color-foreground) 25%, transparent);
  }

  .lb-ep-hero-show {
    color: var(--tboxed-positive);

    &:hover {
      text-decoration: underline;
    }
  }

  .lb-ep-hero-title {
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

  .lb-ep-hero-attribution {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ni-10);
    font-size: var(--ni-12);
  }

  .lb-ep-hero-pill {
    display: inline-block;
    padding: var(--ni-6) var(--ni-12);
    background: color-mix(in srgb, var(--color-foreground) 12%, transparent);
    border-radius: var(--border-radius-xs);
    color: var(--color-foreground);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: var(--ni-11);
  }

  .lb-ep-hero-aired {
    display: inline-flex;
    align-items: baseline;
    gap: var(--ni-6);
  }

  .lb-ep-hero-aired-label {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: var(--ni-11);
    color: var(--color-text-secondary);
  }

  .lb-ep-hero-aired-value {
    color: var(--color-foreground);
    font-weight: 600;
    font-size: var(--ni-13);
  }
</style>
