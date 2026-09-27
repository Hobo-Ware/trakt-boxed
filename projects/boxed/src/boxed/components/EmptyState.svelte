<script lang="ts">
  type EmptyStateProps = {
    text: string;
    as?: "p" | "li";
  };

  const { text, as = "p" }: EmptyStateProps = $props();
</script>

<svelte:element this={as} class="boxed-empty-state">{text}</svelte:element>

<style>
  .boxed-empty-state {
    grid-column: 1 / -1;
    min-height: var(--ni-240);
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
  }
</style>
