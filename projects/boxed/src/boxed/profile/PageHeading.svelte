<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    text,
    actions,
  }: { text: string; actions?: Snippet } = $props();
</script>

<header class="boxed-page-heading">
  <h2>{text}</h2>
  {#if actions}<div class="heading-actions">{@render actions()}</div>{/if}
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-page-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);

    @include for-tablet-sm-and-below {
      flex-direction: column;
      align-items: stretch;
    }

    h2 {
      flex: 1;
      min-width: 0;
      margin: 0;
      min-height: 1.2em;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-36);
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: -0.01em;

      @include for-mobile {
        min-height: 2.4em;
        font-size: var(--ni-28);
      }
    }
  }

  .heading-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--gap-s);
  }
</style>
