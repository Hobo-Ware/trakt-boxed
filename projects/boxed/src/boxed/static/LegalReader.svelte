<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="boxed-legal">
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-legal {
    :global(.trakt-legal-page) {
      box-sizing: border-box;
      width: 100%;
      max-width: calc(var(--ni-640) + var(--ni-80));
      padding-inline: 0;
    }

    :global(.trakt-legal-page h1),
    :global(.trakt-legal-page h2) {
      font-family: var(--boxed-font-title);
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    :global(.trakt-legal-page h1) {
      font-size: var(--ni-48);
      line-height: 1.1;

      @include for-mobile {
        font-size: var(--ni-32);
      }
    }

    :global(.trakt-legal-page h2) {
      font-size: var(--ni-24);
      line-height: 1.25;
    }

    :global(.trakt-legal-page .legal-summary) {
      border-radius: var(--border-radius-l);
      box-shadow: none;
    }
  }
</style>
