<script lang="ts">
  import { trackImageLoaded } from "$lib/utils/actions/trackImageLoaded.ts";
  import { PLACEHOLDERS } from "$lib/utils/assets.ts";
  import type { AmbientColors } from "./toAmbientColors.ts";

  type TitleHeroProps = {
    cover: string | Nil;
    ambient: AmbientColors | null;
  };

  const { cover, ambient }: TitleHeroProps = $props();

  const backdrop = $derived(
    cover && !PLACEHOLDERS.includes(cover) ? cover : null,
  );

  let isBackdropLoaded = $state(false);
</script>

<div
  class="boxed-title-hero"
  class:has-ambient={ambient !== null}
  style:--ambient-glow={ambient?.glow}
  aria-hidden="true"
>
  <div class="boxed-title-hero-band">
    {#if backdrop}
      {#key backdrop}
        <img
          class="boxed-title-hero-backdrop"
          class:is-loaded={isBackdropLoaded}
          src={backdrop}
          alt=""
          width="1280"
          height="720"
          loading="eager"
          decoding="async"
          fetchpriority="high"
          use:trackImageLoaded={{
            src: backdrop,
            onLoaded: (loaded) => (isBackdropLoaded = loaded),
          }}
        />
      {/key}
    {/if}
  </div>
  <div class="boxed-title-hero-glow"></div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-title-hero {
    --hero-band-height: var(--ni-480);
    --hero-fade: var(--color-background);

    position: absolute;
    inset-block-start: 0;
    inset-inline: 0;
    height: calc(var(--hero-band-height) + var(--ni-640));

    pointer-events: none;
    overflow: hidden;
    z-index: 0;

    @include for-tablet-lg-and-below {
      --hero-band-height: var(--ni-240);
      height: calc(var(--hero-band-height) + var(--ni-480));
    }
  }

  .boxed-title-hero-band {
    position: absolute;
    inset-block-start: 0;
    inset-inline: 0;
    height: var(--hero-band-height);

    background: var(--color-card-background);
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(
          to bottom,
          color-mix(in srgb, var(--hero-fade) 25%, transparent) 0%,
          transparent 35%,
          var(--hero-fade) 100%
        ),
        linear-gradient(
          to right,
          var(--hero-fade) 0%,
          transparent 22%,
          transparent 78%,
          var(--hero-fade) 100%
        );
    }
  }

  .boxed-title-hero-backdrop {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 25%;

    opacity: 0;
    transition: opacity calc(var(--transition-increment) * 3) ease-out;

    &.is-loaded {
      opacity: 1;
    }
  }

  .boxed-title-hero-glow {
    position: absolute;
    inset: 0;

    background: radial-gradient(
      ellipse var(--ni-920) var(--ni-640) at 20% 55%,
      color-mix(in srgb, var(--ambient-glow, transparent) 30%, transparent) 0%,
      color-mix(in srgb, var(--ambient-glow, transparent) 14%, transparent) 42%,
      transparent 74%
    );

    opacity: 0;
    transition: opacity calc(var(--transition-increment) * 4) ease-out;
  }

  .boxed-title-hero.has-ambient .boxed-title-hero-glow {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .boxed-title-hero-backdrop,
    .boxed-title-hero-glow {
      transition: none;
    }
  }
</style>
