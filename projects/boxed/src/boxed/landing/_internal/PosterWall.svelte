<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  const TILE_COUNT = 40;

  const { posters }: { posters: ReadonlyArray<string> | null } = $props();
</script>

<div class="boxed-poster-wall" aria-hidden="true">
  <div class="boxed-poster-wall-grid">
    {#each { length: TILE_COUNT }, index (index)}
      {@const poster = posters?.at(index % Math.max(posters?.length ?? 1, 1))}
      <span class="boxed-poster-wall-tile" style:--tile-index={index}>
        {#if poster}
          <CrossOriginImage src={poster} alt="" loading="eager" />
        {/if}
      </span>
    {/each}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-poster-wall {
    position: absolute;
    inset: 0;
    overflow: hidden;
    perspective: 1400px;
  }

  .boxed-poster-wall-grid {
    position: absolute;
    inset-block-start: -18%;
    inset-inline-start: -12%;
    width: 124%;

    display: grid;
    grid-template-columns: repeat(10, minmax(0, 1fr));
    gap: var(--ni-14);

    transform: rotateX(22deg) rotateZ(-8deg);
    transform-origin: 50% 0;
    animation: boxed-wall-drift 90s linear infinite alternate;

    @include for-tablet-sm-and-below {
      grid-template-columns: repeat(6, minmax(0, 1fr));
      width: 150%;
      inset-inline-start: -25%;
    }

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  .boxed-poster-wall-tile {
    display: block;
    aspect-ratio: 2 / 3;
    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  @keyframes boxed-wall-drift {
    from {
      translate: 0 0;
    }

    to {
      translate: 0 -12%;
    }
  }
</style>
