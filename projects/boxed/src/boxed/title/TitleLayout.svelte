<script lang="ts">
  import type { Snippet } from "svelte";
  import type { AmbientColors } from "./toAmbientColors.ts";
  import TitleHero from "./TitleHero.svelte";

  type TitleLayoutProps = {
    cover: string | Nil;
    ambient: AmbientColors | null;
    poster: Snippet;
    header: Snippet;
    actions: Snippet;
    main: Snippet;
    rail: Snippet;
  };

  const { cover, ambient, poster, header, actions, main, rail }: TitleLayoutProps =
    $props();
</script>

<div
  class="boxed-title-layout"
  style:--ambient-glow={ambient?.glow}
  style:--ambient-accent={ambient?.accent}
>
  <TitleHero {cover} {ambient} />

  <div class="boxed-title-body">
    <div class="boxed-title-main">
      <div class="boxed-title-intro">
        <div class="boxed-title-poster-area">{@render poster()}</div>
        {@render header()}
      </div>
      {@render main()}
    </div>

    <aside class="boxed-title-rail">
      <div class="boxed-title-actions-area">{@render actions()}</div>
      {@render rail()}
    </aside>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-title-layout {
    position: relative;
    min-height: 100dvh;
  }

  .boxed-title-body {
    position: relative;
    z-index: 1;

    box-sizing: border-box;
    width: 100%;
    max-width: calc(
      var(--boxed-content-max-width) + 2 * var(--layout-distance-side)
    );
    margin-inline: auto;
    padding: var(--ni-248) var(--layout-distance-side) var(--ni-64);

    display: flex;
    align-items: flex-start;
    gap: var(--ni-40);
  }

  .boxed-title-main {
    flex: 1 1 0;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-40);
  }

  .boxed-title-intro {
    display: grid;
    grid-template-columns: var(--ni-232) minmax(0, 1fr);
    grid-template-rows: auto auto auto 1fr;
    grid-template-areas:
      "poster identity"
      "poster overview"
      "poster tabs"
      "poster .";
    column-gap: var(--ni-40);
    row-gap: var(--ni-18);
  }

  .boxed-title-poster-area {
    grid-area: poster;
  }

  .boxed-title-rail {
    flex: 0 0 var(--ni-300);
    min-width: 0;
    padding-top: var(--ni-40);

    display: flex;
    flex-direction: column;
    gap: var(--ni-28);
  }

  @include for-tablet-lg-and-below {
    .boxed-title-body {
      padding-top: var(--ni-120);

      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      grid-template-areas:
        "identity poster"
        "overview overview"
        "actions actions"
        "tabs tabs";
      column-gap: var(--ni-16);
      row-gap: var(--ni-24);
    }

    .boxed-title-main,
    .boxed-title-intro,
    .boxed-title-rail {
      display: contents;
    }

    .boxed-title-poster-area {
      align-self: end;
    }

    .boxed-title-actions-area {
      grid-area: actions;
    }
  }
</style>
