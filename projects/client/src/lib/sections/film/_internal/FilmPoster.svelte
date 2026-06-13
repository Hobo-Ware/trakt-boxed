<script lang="ts">
  type Props = {
    src: string | undefined;
    alt: string;
  };

  const { src, alt }: Props = $props();
</script>

<div class="film-poster">
  {#if src}
    <img {src} {alt} loading="eager" />
  {:else}
    <div class="film-poster__placeholder" aria-hidden="true"></div>
  {/if}
</div>

<style lang="scss">
  .film-poster {
    position: relative;
    aspect-ratio: 2 / 3;
    width: 100%;
    border-radius: 2px;
    overflow: hidden;
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--shade-10) 8%, transparent) inset,
      0 24px 60px -16px rgba(0, 0, 0, 0.6);
    background: color-mix(in srgb, var(--shade-900) 60%, transparent);

    img,
    &__placeholder {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
</style>
