<script lang="ts">
  import type { Snippet } from "svelte";
  const { children }: { children: Snippet } = $props();
</script>

<div class="lb-summary-stack">
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-summary-stack {
    width: 100%;
    max-width: var(--ni-1280);
    margin-inline: auto;
    padding: 0 var(--ni-16);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    @include for-tablet-lg {
      padding: 0 var(--ni-32);
    }
  }
</style>
