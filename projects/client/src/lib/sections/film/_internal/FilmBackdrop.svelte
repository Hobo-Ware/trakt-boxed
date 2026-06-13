<script lang="ts">
  type Props = {
    src: string | undefined;
    alt: string;
  };

  const { src, alt }: Props = $props();
</script>

<div class="film-backdrop" aria-hidden={src ? undefined : true}>
  {#if src}
    <img class="film-backdrop__image" {src} {alt} loading="eager" />
  {/if}
  <div class="film-backdrop__fade-top"></div>
  <div class="film-backdrop__fade-bottom"></div>
</div>

<style lang="scss">
  .film-backdrop {
    position: absolute;
    inset: 0 0 auto 0;
    height: clamp(360px, 56vw, 720px);
    width: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;

    &__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 18%;
      opacity: 0.55;
      filter: saturate(1.05) contrast(1.02);
    }

    &__fade-top {
      position: absolute;
      inset: 0 0 auto 0;
      height: 35%;
      background: linear-gradient(
        to bottom,
        color-mix(in srgb, var(--shade-1000) 70%, transparent) 0%,
        transparent 100%
      );
    }

    &__fade-bottom {
      position: absolute;
      inset: auto 0 0 0;
      height: 70%;
      background: linear-gradient(
        to bottom,
        transparent 0%,
        color-mix(in srgb, var(--shade-1000) 85%, transparent) 60%,
        var(--shade-1000) 100%
      );
    }
  }
</style>
