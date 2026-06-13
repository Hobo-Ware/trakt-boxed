<script lang="ts">
  type Props = { text: string | null | undefined };
  const { text }: Props = $props();
</script>

{#if text}
  <p class="film-tagline">{text}</p>
{/if}

<style lang="scss">
  .film-tagline {
    margin: 0 0 var(--gap-xs);
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    font-weight: 700;
  }
</style>
