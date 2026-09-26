<script lang="ts">
  import { whenInViewport } from "$lib/utils/actions/whenInViewport.ts";
  import type { Snippet } from "svelte";

  const {
    children,
    placeholder,
  }: { children: Snippet; placeholder: Snippet } = $props();

  let isVisible = $state(false);
</script>

<div class="boxed-in-view" use:whenInViewport={() => (isVisible = true)}>
  {#if isVisible}
    {@render children()}
  {:else}
    {@render placeholder()}
  {/if}
</div>

<style>
  .boxed-in-view {
    display: block;
    min-width: 0;
  }
</style>
