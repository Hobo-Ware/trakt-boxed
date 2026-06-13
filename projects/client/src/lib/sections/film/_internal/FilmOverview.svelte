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
    color: var(--color-text-primary);
    max-width: 60ch;
  }
</style>
