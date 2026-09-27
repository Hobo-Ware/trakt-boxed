<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="boxed-serif-headings">
  {@render children()}
</div>

<style>
  .boxed-serif-headings {
    display: contents;

    :global(h1),
    :global(h2) {
      font-family: var(--boxed-font-title);
      font-weight: 600;
      letter-spacing: -0.01em;
    }
  }
</style>
