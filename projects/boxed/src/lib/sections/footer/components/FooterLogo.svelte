<script lang="ts">
  import BoxedLogo from "$boxed/brand/BoxedLogo.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
</script>

<div class="trakt-footer-logo">
  <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
    <div class="trakt-logo">
      <BoxedLogo variant="full" />
    </div>
  </RenderFor>

  <div class="trakt-taglines">
    <p class="trakt-tagline">discover.track.share.</p>
  </div>
</div>

<style>
  .trakt-footer-logo {
    display: flex;
    flex-direction: column;
    gap: var(--ni-10);
    align-items: flex-start;
  }

  .trakt-logo {
    --boxed-logo-size: var(--ni-24);

    display: flex;
  }

  .trakt-tagline {
    white-space: nowrap;
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }
</style>
