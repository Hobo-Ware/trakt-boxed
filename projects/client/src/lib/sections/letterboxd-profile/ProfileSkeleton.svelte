<script lang="ts">
  import PosterGridSkeleton from '$lib/sections/film/PosterGridSkeleton.svelte';
</script>

<div class="profile-skeleton" aria-hidden="true">
  <header class="profile-skeleton__hero">
    <div class="profile-skeleton__avatar"></div>
    <div class="profile-skeleton__meta">
      <div class="profile-skeleton__name"></div>
      <div class="profile-skeleton__handle"></div>
      <div class="profile-skeleton__bio"></div>
    </div>
    <div class="profile-skeleton__cta"></div>
  </header>

  <div class="profile-skeleton__shell">
    <header class="profile-skeleton__row-head">
      <div class="profile-skeleton__row-eyebrow"></div>
      <div class="profile-skeleton__row-title"></div>
    </header>
    <div class="profile-skeleton__row">
      <PosterGridSkeleton count={4} columns={7} showTitle />
    </div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .profile-skeleton {
    background: var(--shade-1000);
    min-height: 100dvh;

    &__hero {
      padding: clamp(20px, 4vw, 64px) clamp(16px, 3vw, 32px) clamp(20px, 4vw, 48px);
      max-width: 1600px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: var(--gap-l);
      align-items: end;

      @include for-mobile {
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;
      }
    }

    &__avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: var(--shade-900);
    }

    &__meta {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    &__name {
      width: 220px;
      height: calc(clamp(1.8rem, 3.4vw, 2.6rem) * 1.1);
      min-height: calc(clamp(1.8rem, 3.4vw, 2.6rem) * 1.1);
      border-radius: 3px;
      background: var(--shade-900);
    }

    &__handle {
      width: 140px;
      height: calc(0.85rem * 1.4);
      min-height: calc(0.85rem * 1.4);
      border-radius: 2px;
      background: var(--shade-900);
    }

    &__bio {
      width: 60%;
      max-width: 480px;
      height: calc(0.95rem * 1.45 * 2);
      min-height: calc(0.95rem * 1.45);
      border-radius: 2px;
      background: var(--shade-900);
      margin-top: 6px;
    }

    &__cta {
      width: 120px;
      height: calc(0.75rem * 2.2 + 1.1rem);
      border-radius: 3px;
      background: var(--shade-900);

      @include for-mobile {
        grid-column: 1 / -1;
        justify-self: start;
        margin-top: var(--gap-s);
      }
    }

    &__shell {
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 clamp(16px, 3vw, 32px) clamp(40px, 6vw, 80px);
    }

    &__row-head {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: var(--gap-l) 0 var(--gap-s);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
      margin-bottom: var(--gap-m);
    }

    &__row-eyebrow {
      width: 100px;
      height: calc(0.7rem * 1.4);
      min-height: calc(0.7rem * 1.4);
      border-radius: 2px;
      background: var(--shade-900);
    }

    &__row-title {
      width: 240px;
      height: calc(clamp(1.2rem, 2.4vw, 1.8rem) * 1.2);
      min-height: calc(clamp(1.2rem, 2.4vw, 1.8rem) * 1.2);
      border-radius: 3px;
      background: var(--shade-900);
    }
  }
</style>
