<script lang="ts">
  const {
    id,
    title,
    description,
    children,
  }: { id: string; title: string; description?: string } & ChildrenProps =
    $props();
</script>

<section class="boxed-settings-card" aria-labelledby={id}>
  <header class="card-header">
    <h2 {id}>{title}</h2>
    {#if description}<p>{description}</p>{/if}
  </header>
  {@render children()}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-settings-card {
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);

    padding: var(--ni-28);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--color-border) 50%, transparent);

    @include for-mobile {
      gap: var(--ni-20);
      padding: var(--ni-20) var(--ni-16);
    }
  }

  .card-header {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);

    h2 {
      margin: 0;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-28);
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: -0.01em;

      @include for-mobile {
        font-size: var(--ni-24);
      }
    }

    p {
      margin: 0;
      font-size: var(--ni-14);
      color: var(--color-text-secondary);
    }
  }
</style>
