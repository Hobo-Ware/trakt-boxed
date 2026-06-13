<script lang="ts">
  type Props = { text: string };
  const { text }: Props = $props();
</script>

<p class="film-overview">{text}</p>

<style lang="scss">
  .film-overview {
    margin: 0;
    font-size: 1rem;
    line-height: 1.55;
    // Reserve three-line span so longer/shorter overviews don't shift the
    // tabs bar when text resolves; matches the skeleton's 3-line block.
    min-height: calc(1rem * 1.55 * 3);
    color: var(--color-text-primary);
    max-width: 60ch;
  }
</style>
