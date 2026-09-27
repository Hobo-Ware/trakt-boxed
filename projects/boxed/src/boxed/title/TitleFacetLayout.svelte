<script lang="ts">
  import type { Snippet } from "svelte";
  import type { AmbientColors } from "./toAmbientColors.ts";

  type TitleFacetLayoutProps = {
    ambient: AmbientColors | null;
    header: Snippet;
    main: Snippet;
    rail: Snippet;
  };

  const { ambient, header, main, rail }: TitleFacetLayoutProps = $props();
</script>

<div
  class="boxed-facet"
  style:--ambient-glow={ambient?.glow}
  style:--ambient-accent={ambient?.accent}
>
  {@render header()}
  <div class="boxed-facet-body">
    <div class="boxed-facet-main">{@render main()}</div>
    <aside class="boxed-facet-rail">{@render rail()}</aside>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-facet {
    box-sizing: border-box;
    width: 100%;
    max-width: calc(
      var(--boxed-content-max-width) + 2 * var(--layout-distance-side)
    );
    min-height: 100dvh;
    margin-inline: auto;
    padding: var(--ni-36) var(--layout-distance-side) var(--ni-64);

    display: flex;
    flex-direction: column;
    gap: var(--ni-24);
  }

  .boxed-facet-body {
    display: flex;
    align-items: flex-start;
    gap: var(--ni-40);
  }

  .boxed-facet-main {
    flex: 1 1 0;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-18);
  }

  .boxed-facet-rail {
    flex: 0 0 var(--ni-300);
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-24);
  }

  @include for-tablet-lg-and-below {
    .boxed-facet {
      padding-top: var(--ni-16);
    }

    .boxed-facet-body {
      flex-direction: column;
      align-items: stretch;
      gap: var(--ni-28);
    }

    .boxed-facet-rail {
      display: none;
    }
  }
</style>
