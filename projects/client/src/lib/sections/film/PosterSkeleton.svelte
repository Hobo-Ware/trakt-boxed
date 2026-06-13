<script lang="ts">
  type Props = { showTitle?: boolean };
  const { showTitle = false }: Props = $props();
</script>

<div class="poster-skeleton" aria-hidden="true">
  <div class="poster-skeleton__frame"></div>
  {#if showTitle}
    <div class="poster-skeleton__title"></div>
  {/if}
</div>

<style lang="scss">
  .poster-skeleton {
    display: flex;
    flex-direction: column;
    gap: 6px;

    &__frame {
      width: 100%;
      aspect-ratio: 2 / 3;
      border-radius: 3px;
      background: var(--shade-900);
      // Hairline inset matches the default PosterTile outline so swapping
      // skeleton -> tile keeps the visual edge in the same place.
      box-shadow:
        0 0 0 1px var(--color-poster-outline-default) inset,
        0 8px 18px -10px rgba(0, 0, 0, 0.55);
      position: relative;
      overflow: hidden;
    }

    &__frame::after,
    &__title::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        color-mix(in srgb, var(--shade-10) 4%, transparent) 50%,
        transparent 100%
      );
      animation: poster-skeleton-shimmer 1.4s linear infinite;
    }

    &__title {
      width: 80%;
      align-self: center;
      // Matches PosterTile title line-height so the cell height is identical.
      height: calc(0.8rem * 1.25);
      min-height: calc(0.8rem * 1.25);
      border-radius: 2px;
      background: var(--shade-900);
      position: relative;
      overflow: hidden;
    }
  }

  @keyframes poster-skeleton-shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
</style>
