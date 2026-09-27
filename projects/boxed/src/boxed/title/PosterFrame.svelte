<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  type PosterFrameProps = {
    src: string;
    alt: string;
    href?: string;
    outline: "watched" | "watchlist" | "none";
    progress: number | null;
  };

  const { src, alt, href, outline, progress }: PosterFrameProps = $props();
</script>

<svelte:element
  this={href ? "a" : "div"}
  class="boxed-poster-frame"
  data-outline={outline}
  {href}
>
  <CrossOriginImage {src} {alt} loading="eager" />
  {#if progress !== null}
    <span
      class="boxed-poster-frame-progress"
      style:--progress={`${Math.round(progress * 100)}%`}
      aria-hidden="true"
    ></span>
  {/if}
</svelte:element>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-poster-frame {
    position: relative;
    display: block;
    width: var(--ni-232);
    aspect-ratio: 2 / 3;
    margin-inline: auto;

    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: var(--color-card-background);
    box-shadow:
      inset 0 0 0 var(--border-thickness-xxs)
        color-mix(in srgb, var(--color-foreground) 8%, transparent),
      0 var(--ni-30) var(--ni-60) calc(-1 * var(--ni-20))
        color-mix(
          in srgb,
          var(--ambient-glow, var(--shade-950)) 55%,
          transparent
        );

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &[data-outline="watched"] {
      outline: var(--border-thickness-xs) solid var(--boxed-color-watched);
    }

    &[data-outline="watchlist"] {
      outline: var(--border-thickness-xs) solid var(--boxed-color-watchlist);
    }

    @include for-tablet-lg-and-below {
      width: var(--ni-104);
    }
  }

  .boxed-poster-frame-progress {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: var(--ni-4);
    background: color-mix(in srgb, var(--shade-950) 60%, transparent);

    &::after {
      content: "";
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      width: var(--progress);
      background: var(--boxed-color-watched);
    }
  }
</style>
