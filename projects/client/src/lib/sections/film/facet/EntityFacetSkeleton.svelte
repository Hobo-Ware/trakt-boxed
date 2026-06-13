<script lang="ts">
</script>

<div class="facet-skeleton" aria-hidden="true">
  <div class="facet-skeleton__shell">
    <header class="facet-skeleton__header">
      <div class="facet-skeleton__poster"></div>
      <div class="facet-skeleton__meta">
        <div class="facet-skeleton__eyebrow"></div>
        <div class="facet-skeleton__title"></div>
      </div>
    </header>

    <nav class="facet-skeleton__nav">
      <div class="facet-skeleton__back"></div>
      <div class="facet-skeleton__tabs">
        {#each Array.from({ length: 5 }) as _, i (i)}
          <div class="facet-skeleton__tab"></div>
        {/each}
      </div>
    </nav>

    <div class="facet-skeleton__body">
      {#each Array.from({ length: 6 }) as _, i (i)}
        <div class="facet-skeleton__row"></div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .facet-skeleton {
    background: var(--shade-1000);
    min-height: 100dvh;

    &__shell {
      width: 100%;
      max-width: 1600px;
      margin: 0 auto;
      padding: clamp(40px, 6vw, 80px) clamp(16px, 3vw, 32px);
    }

    &__header {
      display: grid;
      grid-template-columns: 96px 1fr;
      gap: var(--gap-m);
      align-items: center;
      padding-bottom: var(--gap-m);

      @include for-mobile {
        grid-template-columns: 64px 1fr;
      }
    }

    &__poster {
      width: 100%;
      aspect-ratio: 2 / 3;
      border-radius: 3px;
      background: var(--shade-900);
    }

    &__meta {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    &__eyebrow {
      width: 60px;
      height: calc(0.7rem * 1.4);
      min-height: calc(0.7rem * 1.4);
      border-radius: 2px;
      background: var(--shade-900);
    }

    &__title {
      width: 70%;
      height: calc(clamp(1.6rem, 3vw, 2.4rem) * 1.1);
      min-height: calc(clamp(1.6rem, 3vw, 2.4rem) * 1.1);
      border-radius: 3px;
      background: var(--shade-900);
    }

    &__nav {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
      padding-bottom: var(--gap-m);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
      margin-bottom: var(--gap-l);
    }

    &__back {
      width: 160px;
      height: calc(0.75rem * 1.4);
      min-height: calc(0.75rem * 1.4);
      border-radius: 2px;
      background: var(--shade-900);
    }

    &__tabs {
      display: flex;
      gap: var(--gap-m);
    }

    &__tab {
      width: 80px;
      height: calc(0.78rem * 1.4);
      min-height: calc(0.78rem * 1.4);
      border-radius: 2px;
      background: var(--shade-900);
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
      min-height: 40vh;
    }

    &__row {
      height: calc(0.95rem * 1.5 * 2);
      border-radius: 3px;
      background: var(--shade-900);
    }
  }
</style>
