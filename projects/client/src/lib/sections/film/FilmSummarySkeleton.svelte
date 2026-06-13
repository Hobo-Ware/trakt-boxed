<script lang="ts">
</script>

<div class="film-summary-skeleton" aria-hidden="true">
  <div class="film-summary-skeleton__backdrop"></div>
  <div class="film-summary-skeleton__shell">
    <div class="film-summary-skeleton__hero">
      <div class="film-summary-skeleton__poster"></div>
      <div class="film-summary-skeleton__body">
        <div class="film-summary-skeleton__title"></div>
        <div class="film-summary-skeleton__meta"></div>
        <div class="film-summary-skeleton__tagline"></div>
        <div class="film-summary-skeleton__overview">
          <div class="film-summary-skeleton__line"></div>
          <div class="film-summary-skeleton__line"></div>
          <div class="film-summary-skeleton__line film-summary-skeleton__line--short"></div>
        </div>
      </div>
      <div class="film-summary-skeleton__rail"></div>
    </div>
    <div class="film-summary-skeleton__tabs"></div>
    <div class="film-summary-skeleton__tab-body"></div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .film-summary-skeleton {
    position: relative;
    background: var(--shade-1000);
    min-height: 100dvh;

    &__backdrop {
      position: absolute;
      inset: 0 0 auto 0;
      height: clamp(360px, 56vw, 720px);
      background: var(--shade-900);
      z-index: 0;
    }

    &__shell {
      position: relative;
      z-index: 1;
      max-width: 1600px;
      margin: 0 auto;
      padding: clamp(120px, 18vw, 240px) clamp(16px, 3vw, 32px) 0;
    }

    &__hero {
      display: grid;
      grid-template-columns: 230px 1fr 280px;
      gap: var(--gap-l);
    }

    &__poster {
      width: 100%;
      aspect-ratio: 2 / 3;
      border-radius: 2px;
      background: var(--shade-900);
      margin-top: -40px;
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
      padding-top: var(--gap-s);
    }

    &__title {
      width: 60%;
      // Matches FilmTitleBlock title clamp + line-height so the swap to the
      // real h1 doesn't reflow the credits row underneath.
      height: calc(clamp(2rem, 4.4vw, 3.4rem) * 1.05);
      min-height: calc(clamp(2rem, 4.4vw, 3.4rem) * 1.05);
      border-radius: 3px;
      background: var(--shade-900);
    }

    &__meta {
      width: 45%;
      height: calc(0.95rem * 1.4);
      min-height: calc(0.95rem * 1.4);
      border-radius: 2px;
      background: var(--shade-900);
    }

    &__tagline {
      width: 35%;
      height: calc(0.72rem * 1.4);
      min-height: calc(0.72rem * 1.4);
      margin-top: 4px;
      border-radius: 2px;
      background: var(--shade-900);
    }

    &__overview {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: var(--gap-s);
    }

    &__line {
      height: calc(1rem * 1.55);
      min-height: calc(1rem * 1.55);
      border-radius: 2px;
      background: var(--shade-900);

      &--short { width: 55%; }
    }

    &__rail {
      height: 320px;
      border-radius: 4px;
      background: var(--shade-900);
    }

    &__tabs {
      margin-top: var(--gap-l);
      height: 36px;
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
      background: linear-gradient(
        90deg,
        var(--shade-900) 0%,
        var(--shade-900) 80px,
        transparent 80px,
        transparent 120px,
        var(--shade-900) 120px,
        var(--shade-900) 200px,
        transparent 200px
      );
    }

    &__tab-body {
      margin-top: var(--gap-l);
      min-height: 400px;
    }

    @include for-tablet-sm {
      &__hero { grid-template-columns: 160px 1fr; }
      &__rail { grid-column: 1 / -1; height: 200px; }
    }

    @include for-mobile {
      &__shell { padding: clamp(80px, 30vw, 140px) var(--gap-s) 0; }
      &__hero { grid-template-columns: 120px 1fr; }
      &__poster { margin-top: -20px; }
      &__rail { grid-column: 1 / -1; height: 180px; }
      &__title { height: 2rem; min-height: 2rem; }
    }
  }
</style>
