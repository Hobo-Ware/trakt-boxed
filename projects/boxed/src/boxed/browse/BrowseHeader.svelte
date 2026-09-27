<script lang="ts">
  import FilterButton from "$lib/sections/navbar/components/filter/FilterButton.svelte";
  import type { Snippet } from "svelte";
  import ModeSwitch from "./ModeSwitch.svelte";

  type BrowseHeaderProps = {
    title: string;
    actions?: Snippet;
    hasFilterButton?: boolean;
  };

  const { title, actions, hasFilterButton = true }: BrowseHeaderProps =
    $props();

</script>

<header class="boxed-browse-header">
  <h1>{title}</h1>
  <div class="boxed-browse-controls">
    <ModeSwitch />
    {#if hasFilterButton}
      <FilterButton isDisabled={false} />
    {/if}
    {@render actions?.()}
  </div>
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-browse-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);
    flex-wrap: wrap;

    h1 {
      letter-spacing: -0.01em;

      @include boxed-page-title;
    }
  }

  .boxed-browse-controls {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-height: var(--ni-40);
  }
</style>
