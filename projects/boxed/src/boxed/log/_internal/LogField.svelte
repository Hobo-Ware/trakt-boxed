<script lang="ts">
  const {
    label,
    forId,
    children,
  }: ChildrenProps & { label: string; forId: string } = $props();
</script>

<div class="boxed-log-field">
  <label class="boxed-log-label" for={forId}>{label}</label>
  {@render children()}
</div>

<style>
  .boxed-log-field {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    min-width: 0;
  }

  .boxed-log-label {
    font-size: var(--ni-12);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }
</style>
