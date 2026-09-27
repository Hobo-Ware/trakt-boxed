<script lang="ts">
  import type { Snippet } from "svelte";
  import PosterWall from "./PosterWall.svelte";

  const {
    kicker,
    title,
    message,
    actions,
  }: { kicker: string; title: string; message: string; actions: Snippet } =
    $props();
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<main class="boxed-error">
  <PosterWall />
  <div class="error-content">
    <p class="error-kicker">{kicker}</p>
    <h1>{title}</h1>
    <p class="error-message">{message}</p>
    <div class="error-actions">{@render actions()}</div>
  </div>
</main>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-error {
    position: relative;
    overflow: hidden;

    display: flex;
    align-items: flex-end;
    justify-content: center;

    min-height: calc(100dvh - var(--boxed-header-height));
    box-sizing: border-box;
    padding: var(--ni-64) var(--layout-distance-side);

    @include for-tablet-sm-and-below {
      min-height: calc(
        100dvh - var(--boxed-header-height) - var(--boxed-tabbar-height)
      );
      padding-block: var(--ni-40);
    }
  }

  .error-content {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--ni-12);

    width: 100%;
    max-width: var(--boxed-content-max-width);

    h1 {
      margin: 0;
      max-width: 20ch;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-56);
      font-weight: 600;
      line-height: 1.1;
      letter-spacing: -0.01em;

      @include for-mobile {
        font-size: var(--ni-36);
      }
    }
  }

  .error-kicker {
    margin: 0;
    font-size: var(--ni-12);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-error-page-kicker);
  }

  .error-message {
    margin: 0;
    max-width: 60ch;
    font-size: var(--ni-18);
    line-height: 1.6;
    color: var(--color-text-secondary);

    @include for-mobile {
      font-size: var(--ni-16);
    }
  }

  .error-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-s);
    margin-block-start: var(--ni-12);
  }
</style>
