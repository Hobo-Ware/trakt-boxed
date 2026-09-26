<script lang="ts">
  const {
    children,
    spacing = "normal",
  }: ChildrenProps & { spacing?: "normal" | "none" } = $props();
</script>

<div class="boxed-page" data-spacing={spacing}>
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-page {
    box-sizing: border-box;
    width: 100%;
    max-width: calc(
      var(--boxed-content-max-width) + 2 * var(--layout-distance-side)
    );
    margin-inline: auto;
    padding: var(--ni-32) var(--layout-distance-side) var(--ni-64);

    display: flex;
    flex-direction: column;
    gap: var(--ni-40);

    @include for-mobile {
      padding-block: var(--ni-16) var(--ni-40);
      gap: var(--ni-28);
    }

    &[data-spacing="none"] {
      padding-block: 0;
    }
  }
</style>
