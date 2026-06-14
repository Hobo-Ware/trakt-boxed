<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    title,
    description,
    children,
    boldTitle = false,
    titlePrefix,
  }: ChildrenProps & {
    title: string;
    description: string;
    boldTitle?: boolean;
    titlePrefix?: Snippet;
  } = $props();
</script>

<section class="lb-settings-block">
  <header class="lb-settings-block__header">
    <h2
      class="lb-settings-block__title"
      class:has-prefix={Boolean(titlePrefix)}
      data-bold={boldTitle ? 'true' : undefined}
    >
      {#if titlePrefix}{@render titlePrefix()}{/if}{title}
    </h2>
    <p class="lb-settings-block__description">{description}</p>
  </header>
  <div class="lb-settings-block__content">
    {@render children()}
  </div>
</section>

<style lang="scss">
  .lb-settings-block {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    &__header {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-bottom: var(--gap-s);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 6%, transparent);
    }

    &__title {
      margin: 0;
      font-family: var(--font-family-serif, Georgia, serif);
      font-size: 1.15rem;
      font-weight: 400;
      color: var(--color-text-primary);
      letter-spacing: 0;

      &[data-bold='true'] { font-weight: 600; }

      &.has-prefix {
        display: flex;
        align-items: baseline;
        gap: var(--ni-6);

        :global(span),
        :global(.trakt-link) {
          font-size: inherit;
          font-weight: inherit;
        }
      }
    }

    &__description {
      margin: 0;
      font-size: 0.85rem;
      line-height: 1.5;
      color: var(--color-text-secondary);
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: var(--gap-m);
    }
  }
</style>
