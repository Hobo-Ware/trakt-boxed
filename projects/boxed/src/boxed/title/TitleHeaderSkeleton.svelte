<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
</script>

<div class="boxed-title-identity-skeleton" aria-hidden="true">
  <Skeleton width="70%" height="var(--title-skeleton-height)" />
  <Skeleton width="50%" height="var(--ni-20)" />
</div>

<div class="boxed-title-overview-skeleton" aria-hidden="true">
  <Skeleton width="40%" height="var(--ni-14)" />
  <Skeleton height="var(--ni-16)" />
  <Skeleton height="var(--ni-16)" />
  <Skeleton width="80%" height="var(--ni-16)" />
</div>

<div class="boxed-title-tabs-skeleton" aria-hidden="true">
  <Skeleton height="var(--ni-24)" />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-title-identity-skeleton {
    --title-skeleton-height: calc(var(--ni-52) * 1.05);

    grid-area: identity;
    padding-top: var(--ni-40);

    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    @include for-tablet-lg-and-below {
      --title-skeleton-height: calc(var(--ni-32) * 1.05);

      padding-top: 0;
      align-self: end;
    }
  }

  .boxed-title-overview-skeleton {
    grid-area: overview;

    display: flex;
    flex-direction: column;
    gap: var(--ni-10);
  }

  .boxed-title-tabs-skeleton {
    grid-area: tabs;
  }
</style>
