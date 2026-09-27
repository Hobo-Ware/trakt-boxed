<script lang="ts">
  import PosterSkeleton from "../../poster/PosterSkeleton.svelte";

  const { withInProgress }: { withInProgress: boolean } = $props();
</script>

<div class="boxed-currently-watching-skeleton" class:has-posters={withInProgress}>
  <div class="skeleton-card"></div>
  {#if withInProgress}
    <div class="skeleton-posters">
      {#each { length: 3 }, index (index)}
        <PosterSkeleton showUserMeta />
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-currently-watching-skeleton {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
    gap: var(--gap-m);

    &.has-posters {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

      @include for-mobile {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  }

  .skeleton-card {
    height: var(--ni-176);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
  }

  .skeleton-posters {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--gap-s);
  }
</style>
