<script lang="ts"></script>

<div class="list-card-skeleton" aria-hidden="true">
  <div class="list-card-skeleton__stack"></div>
  <div class="list-card-skeleton__title"></div>
  <div class="list-card-skeleton__line"></div>
  <div class="list-card-skeleton__line list-card-skeleton__line--short"></div>
</div>

<style lang="scss">
  .list-card-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    padding: var(--gap-m);
    border-radius: 4px;
    background: color-mix(in srgb, var(--shade-900) 60%, transparent);
    border: 1px solid color-mix(in srgb, var(--shade-10) 5%, transparent);

    &__stack {
      width: 100%;
      padding-top: 50%;
      border-radius: 2px;
      background: var(--shade-900);
    }

    &__title {
      height: calc(1.2rem * 1.25);
      width: 70%;
      border-radius: 2px;
      background: var(--shade-900);
    }

    &__line {
      height: 0.8rem;
      width: 50%;
      border-radius: 2px;
      background: var(--shade-900);

      &--short { width: 35%; }
    }
  }
</style>
