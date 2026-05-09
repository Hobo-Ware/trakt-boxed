<script lang="ts">
  /*
    The Letterboxd-flavour anonymous landing. Single column on every
    breakpoint:

      1. Cinematic backdrop hero topped with a serif tagline and a
         single bright green CTA.
      2. A double poster strip (decorative; sourced from trending).
      3. "trakt-boxed lets you..." feature grid, six tiles each with
         an icon + a single sentence.
      4. "Just reviewed" film poster strip from the popular feed.

    Reference: research/notes/homepage.md and homepage-mobile.png /
    homepage-desktop.png.
  */
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import NotesIcon from "$lib/components/icons/NotesIcon.svelte";
  import SmartListIcon from "$lib/components/icons/SmartListIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import MediaPoster from "$lib/components/media/MediaPoster.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { useTrendingItems } from "./useTrendingItems";

  const { login } = useAuth();
  const { list: trendingMovies } = useTrendingItems("movie");
  const { list: trendingShows } = useTrendingItems("show");

  /*
    Reach into the daily-shuffled trending list for a backdrop. Until
    the data lands we lean on the brand OG card so the page has visual
    presence on first paint.
  */
  const heroBackdrop = $derived(
    $trendingMovies?.[0]?.media?.cover?.url?.medium ?? "",
  );
  const heroAttribution = $derived($trendingMovies?.[0]?.media?.title ?? "");

  const decorativeStrip = $derived(($trendingMovies ?? []).slice(0, 6));
  const decorativeStripShows = $derived(($trendingShows ?? []).slice(0, 6));

  const features = [
    {
      Icon: MovieIcon,
      text: m.text_landing_feature_track(),
    },
    {
      Icon: FavoriteIcon,
      text: m.text_landing_feature_like(),
    },
    {
      Icon: NotesIcon,
      text: m.text_landing_feature_review(),
    },
    {
      Icon: StarIcon,
      text: m.text_landing_feature_rate(),
    },
    {
      Icon: BookmarkIcon,
      text: m.text_landing_feature_watchlist(),
    },
    {
      Icon: SmartListIcon,
      text: m.text_landing_feature_lists(),
    },
  ];
</script>

<div class="lb-landing">
  <section class="lb-landing-hero">
    {#if heroBackdrop}
      <CrossOriginImage
        classList="lb-landing-hero-image"
        src={heroBackdrop}
        alt={heroAttribution}
      />
    {/if}
    <div class="lb-landing-hero-fade"></div>
    {#if heroAttribution}
      <span class="lb-landing-hero-attribution">{heroAttribution}</span>
    {/if}

    <div class="lb-landing-hero-stack">
      <h1 class="lb-landing-tagline">
        <span>{m.text_landing_tagline_line_1()}</span>
        <span>{m.text_landing_tagline_line_2()}</span>
        <span>{m.text_landing_tagline_line_3()}</span>
      </h1>

      <button class="lb-landing-cta" type="button" onclick={login}>
        {m.button_text_landing_cta()}
      </button>

      <p class="lb-landing-subline">
        {m.text_landing_subline()}
        <Link href={UrlBuilder.app.ios()} target="_blank" rel="noopener">
          <span class="lb-landing-store">{m.text_landing_app_store()}</span>
        </Link>
        ·
        <Link href={UrlBuilder.app.android()} target="_blank" rel="noopener">
          <span class="lb-landing-store">{m.text_landing_play_store()}</span>
        </Link>
      </p>
    </div>
  </section>

  <section class="lb-landing-strips">
    <div class="lb-landing-strip">
      {#each decorativeStrip as { media } (media.id)}
        <div class="lb-landing-strip-cell">
          <MediaPoster
            src={media.poster?.url?.thumb ?? ""}
            alt={media.title}
            href={UrlBuilder.movie(media.slug)}
          />
        </div>
      {/each}
    </div>
    <div class="lb-landing-strip lb-landing-strip-reverse">
      {#each decorativeStripShows as { media } (media.id)}
        <div class="lb-landing-strip-cell">
          <MediaPoster
            src={media.poster?.url?.thumb ?? ""}
            alt={media.title}
            href={UrlBuilder.show(media.slug)}
          />
        </div>
      {/each}
    </div>
  </section>

  <section class="lb-landing-features">
    <p class="lb-landing-features-eyebrow">
      {m.eyebrow_landing_features()}
    </p>
    <ul class="lb-landing-features-grid">
      {#each features as feature, index (index)}
        <li class="lb-landing-feature">
          <span class="lb-landing-feature-icon">
            <feature.Icon />
          </span>
          <span class="lb-landing-feature-text">{feature.text}</span>
        </li>
      {/each}
    </ul>
  </section>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-landing {
    display: flex;
    flex-direction: column;
    gap: var(--ni-44);

    width: 100%;
    background: var(--color-background);
  }

  /* HERO ---------------------------------------------------------- */
  .lb-landing-hero {
    position: relative;
    isolation: isolate;

    width: 100%;
    aspect-ratio: 4 / 5;
    overflow: hidden;

    @include for-tablet-sm {
      aspect-ratio: 16 / 10;
    }

    @include for-tablet-lg {
      aspect-ratio: 21 / 9;
      max-height: 70dvh;
    }
  }

  :global(.lb-landing-hero-image) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
    z-index: 0;
    opacity: 0.55;
  }

  .lb-landing-hero-fade {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background) 25%, transparent) 0%,
      transparent 30%,
      transparent 60%,
      color-mix(in srgb, var(--color-background) 80%, transparent) 90%,
      var(--color-background) 100%
    );
  }

  .lb-landing-hero-attribution {
    position: absolute;
    right: var(--ni-12);
    top: 50%;
    transform: rotate(-90deg) translateX(50%);
    transform-origin: 100% 0;
    z-index: 2;

    color: var(--color-text-secondary);
    font-size: var(--ni-10);
    letter-spacing: 0.1em;
    text-transform: uppercase;

    @include for-tablet-sm-and-below {
      display: none;
    }
  }

  .lb-landing-hero-stack {
    position: relative;
    z-index: 2;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    height: 100%;
    padding: var(--ni-44) var(--ni-20);
    gap: var(--ni-24);
    text-align: center;
    box-sizing: border-box;
  }

  .lb-landing-tagline {
    margin: 0;
    font-family: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
    font-optical-sizing: auto;
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.01em;

    color: var(--color-foreground);
    font-size: var(--ni-26);

    display: flex;
    flex-direction: column;
    gap: var(--ni-2);

    text-shadow: 0 var(--ni-2) var(--ni-12)
      color-mix(in srgb, var(--shade-1000) 70%, transparent);

    @include for-tablet-sm {
      font-size: var(--ni-36);
    }

    @include for-tablet-lg {
      font-size: var(--ni-48);
    }
  }

  .lb-landing-cta {
    display: inline-block;
    padding: var(--ni-12) var(--ni-26);

    background: var(--tboxed-positive);
    color: var(--shade-1000);

    border: none;
    border-radius: var(--border-radius-xs);

    font-family: inherit;
    font-size: var(--ni-16);
    font-weight: 700;
    cursor: pointer;
    line-height: 1;

    transition: background var(--transition-increment) ease-in-out;

    &:hover {
      background: var(--tboxed-positive-hover);
    }
  }

  .lb-landing-subline {
    margin: 0;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
    letter-spacing: 0.01em;

    display: flex;
    align-items: center;
    gap: var(--ni-6);
    flex-wrap: wrap;
    justify-content: center;
  }

  .lb-landing-store {
    color: var(--tboxed-positive);
    font-weight: 600;
  }

  /* DECORATIVE STRIPS -------------------------------------------- */
  .lb-landing-strips {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
    padding: 0;
    overflow: hidden;
  }

  .lb-landing-strip {
    display: flex;
    gap: var(--ni-8);
    padding: 0 var(--ni-16);

    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .lb-landing-strip-cell {
    flex: 0 0 calc(25% - var(--ni-8));
    min-width: var(--ni-88);

    @include for-tablet-sm {
      flex-basis: calc((100% - 5 * var(--ni-8)) / 6);
    }

    @include for-tablet-lg {
      flex-basis: calc((100% - 7 * var(--ni-8)) / 8);
    }
  }

  /* FEATURES ----------------------------------------------------- */
  .lb-landing-features {
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);

    width: 100%;
    max-width: var(--ni-1280);
    margin-inline: auto;
    padding: 0 var(--ni-16) var(--ni-44);
    box-sizing: border-box;
  }

  .lb-landing-features-eyebrow {
    margin: 0;
    font-size: var(--ni-11);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    font-weight: 600;
  }

  .lb-landing-features-grid {
    list-style: none;
    margin: 0;
    padding: 0;

    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ni-12);

    @include for-tablet-sm {
      grid-template-columns: repeat(2, 1fr);
    }

    @include for-tablet-lg {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .lb-landing-feature {
    display: flex;
    align-items: center;
    gap: var(--ni-14);

    padding: var(--ni-18) var(--ni-20);

    background: color-mix(in srgb, var(--color-foreground) 5%, transparent);
    border-radius: var(--border-radius-s);
  }

  .lb-landing-feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-32);
    height: var(--ni-32);
    flex-shrink: 0;

    color: var(--tboxed-positive);
  }

  :global(.lb-landing-feature-icon svg) {
    width: var(--ni-22);
    height: var(--ni-22);
  }

  .lb-landing-feature-text {
    color: var(--color-text-secondary);
    line-height: 1.4;
    font-size: var(--ni-14);
  }
</style>
