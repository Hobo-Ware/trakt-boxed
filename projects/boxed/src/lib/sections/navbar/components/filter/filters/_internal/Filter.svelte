<script lang="ts">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";

  const {
    title,
    children,
    variant = "default",
  }: {
    title: string;
    variant?: "default" | "inline";
  } & ChildrenProps = $props();
</script>

<div
  class="trakt-filter"
  data-dpad-navigation={DpadNavigationType.List}
  data-variant={variant}
>
  <span class:secondary={variant === "inline"}>{title}</span>
  {@render children()}
</div>

<style>
  .trakt-filter {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    min-width: 0;

    &:not([data-variant="inline"]) > span {
      font-size: var(--ni-12);
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    &[data-variant="inline"] {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-m);
      width: 100%;
    }
  }
</style>
