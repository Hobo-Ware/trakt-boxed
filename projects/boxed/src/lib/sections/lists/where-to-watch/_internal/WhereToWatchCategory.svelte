<script lang="ts">
  type WhereToWatchCategoryProps = {
    title?: string;
  } & ChildrenProps;

  const { title, children }: WhereToWatchCategoryProps = $props();
</script>

<div class="trakt-where-to-watch-category">
  {#if title}
    <h2 class="category-title">
      {title}
    </h2>
  {/if}

  {@render children()}
</div>

<style lang="scss">
  .trakt-where-to-watch-category {
    display: flex;
    flex-direction: column;
    gap: 0;

    .category-title {
      margin: 0;
      padding-bottom: var(--ni-8);
      border-bottom: var(--border-thickness-xxs) solid var(--color-border);

      font-size: var(--ni-12);
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }
  }
</style>
