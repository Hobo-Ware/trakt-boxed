<script lang="ts">
  /*
    Desktop two-column shell that wraps the rebuilt summary surfaces.
    Sticky poster left, main column right — the Letterboxd film-page
    skeleton. Mobile collapses to a single column. Renders only the
    chrome (backdrop, fade, poster column, content slot) — every
    block in the content slot owns its own border / spacing.
  */
  import type { Snippet } from "svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { MEDIA_POSTER_PLACEHOLDER } from "$lib/utils/assets";

  type LetterboxdSummaryShellProps = {
    backdropUrl?: string | null;
    posterUrl?: string | null;
    posterAlt: string;
    poster?: Snippet;
    main: Snippet;
    aside?: Snippet;
  };

  const {
    backdropUrl,
    posterUrl,
    posterAlt,
    poster,
    main,
    aside,
  }: LetterboxdSummaryShellProps = $props();
</script>

<section class="lb-shell">
  {#if backdropUrl}
    <CrossOriginImage
      classList="lb-shell-backdrop"
      src={backdropUrl}
      alt=""
    />
  {/if}
  <div class="lb-shell-fade" aria-hidden="true"></div>

  <div class="lb-shell-frame">
    <div class="lb-shell-poster-col">
      {#if poster}
        {@render poster()}
      {:else}
        <img
          class="lb-shell-poster-img"
          src={posterUrl ?? MEDIA_POSTER_PLACEHOLDER}
          alt={posterAlt}
        />
      {/if}
    </div>

    <div class="lb-shell-main-col">
      {@render main()}
    </div>

    {#if aside}
      <aside class="lb-shell-aside-col">
        {@render aside()}
      </aside>
    {/if}
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-shell {
    position: relative;
    isolation: isolate;
    width: 100%;
  }

  :global(.lb-shell-backdrop) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 60vh;
    object-fit: cover;
    object-position: center 25%;
    z-index: 0;
    opacity: 0.5;

    @include for-tablet-lg {
      height: 50vh;
    }
  }

  .lb-shell-fade {
    position: absolute;
    inset: 0;
    height: 60vh;
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

    @include for-tablet-lg {
      height: 50vh;
    }
  }

  .lb-shell-frame {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: var(--ni-1280);
    margin-inline: auto;
    box-sizing: border-box;
    padding: 26vh var(--ni-16) 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ni-22);

    @include for-tablet-sm {
      padding-top: 22vh;
    }

    @include for-tablet-lg {
      padding: 28vh var(--ni-32) 0;
      grid-template-columns: var(--ni-220) minmax(0, 1fr) var(--ni-260);
      gap: var(--ni-32);
      align-items: start;
    }
  }

  .lb-shell-poster-col {
    width: var(--ni-160);
    margin-inline: auto;

    @include for-tablet-lg {
      width: 100%;
      position: sticky;
      top: var(--ni-22);
    }
  }

  .lb-shell-poster-img {
    width: 100%;
    aspect-ratio: 2 / 3;
    object-fit: cover;
    border-radius: var(--border-radius-xs);
    box-shadow: 0 var(--ni-8) var(--ni-26)
      color-mix(in srgb, var(--shade-1000) 60%, transparent);
    display: block;
  }

  .lb-shell-main-col {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .lb-shell-aside-col {
    min-width: 0;

    @include for-tablet-sm-and-below {
      order: -1;
    }
  }
</style>
