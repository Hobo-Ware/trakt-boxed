<script lang="ts">
  import FilterButton from "$lib/sections/navbar/components/filter/FilterButton.svelte";
  import type { Snippet } from "svelte";
  import ModeSwitch from "./ModeSwitch.svelte";

  const { title, actions }: { title: string; actions?: Snippet } = $props();

</script>

<header class="boxed-browse-header">
  <h1>{title}</h1>
  <div class="boxed-browse-controls">
    <ModeSwitch />
    <FilterButton isDisabled={false} />
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
      margin: 0;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-40);
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: -0.01em;

      @include for-mobile {
        font-size: var(--ni-28);
      }
    }
  }

  .boxed-browse-controls {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-height: var(--ni-40);
  }
</style>
