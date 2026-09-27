<script lang="ts">
  const TILE_COUNT = 96;
</script>

<div class="boxed-poster-wall" aria-hidden="true">
  <div class="wall-grid">
    {#each { length: TILE_COUNT }, index (index)}
      <span></span>
    {/each}
  </div>
  <div class="wall-veil"></div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-poster-wall {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .wall-grid {
    position: absolute;
    inset-block-start: calc(-1 * var(--ni-20));
    inset-inline-start: calc(-1 * var(--ni-32));

    display: grid;
    grid-template-columns: repeat(24, var(--ni-60));
    gap: var(--ni-8);
    transform: rotate(-4deg);

    @include for-mobile {
      grid-template-columns: repeat(24, var(--ni-40));
      gap: var(--ni-6);
    }

    span {
      aspect-ratio: 2 / 3;
      border-radius: var(--border-radius-xs);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs)
        color-mix(in srgb, var(--shade-10) 8%, transparent);
      background: color-mix(
        in srgb,
        var(--tone) 34%,
        var(--color-card-background)
      );
    }

    span:nth-child(7n + 1) {
      --tone: var(--purple-700);
    }

    span:nth-child(7n + 2) {
      --tone: var(--blue-700);
    }

    span:nth-child(7n + 3) {
      --tone: var(--red-800);
    }

    span:nth-child(7n + 4) {
      --tone: var(--green-800);
    }

    span:nth-child(7n + 5) {
      --tone: var(--yellow-800);
    }

    span:nth-child(7n + 6) {
      --tone: var(--shade-700);
    }

    span:nth-child(7n) {
      --tone: var(--orange-800);
    }
  }

  .wall-veil {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background) 55%, transparent) 0%,
      color-mix(in srgb, var(--color-background) 80%, transparent) 60%,
      var(--color-background) 100%
    );
  }
</style>
