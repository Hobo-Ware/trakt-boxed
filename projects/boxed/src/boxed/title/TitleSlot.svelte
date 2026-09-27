<script lang="ts">
  const { order, children }: ChildrenProps & { order: number } = $props();
</script>

<div class="boxed-title-slot" style:--slot-order={order}>
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-title-slot {
    min-width: 0;

    @include for-tablet-lg-and-below {
      grid-column: 1 / -1;
      order: var(--slot-order);
    }
  }
</style>
