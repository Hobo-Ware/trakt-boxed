<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
</script>

<div class="boxed-title-poster-skeleton" aria-hidden="true">
  <div class="boxed-title-poster-skeleton-frame">
    <Skeleton height="100%" radius="var(--border-radius-s)" />
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-title-poster-skeleton-frame {
    width: var(--ni-232);
    aspect-ratio: 2 / 3;
    margin-inline: auto;

    @include for-tablet-lg-and-below {
      width: var(--ni-104);
    }
  }
</style>
