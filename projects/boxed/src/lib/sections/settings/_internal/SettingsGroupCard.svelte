<script lang="ts">
  import type { Snippet } from "svelte";
  import SettingsSection from "./SettingsSection.svelte";

  const {
    title,
    description,
    crumb,
    action,
    variant,
    children,
  }: ChildrenProps & {
    title?: string;
    description?: string;
    crumb?: { href: string; label: string };
    action?: Snippet;
    variant?: "vip" | "muted" | "bare";
  } = $props();
</script>

<SettingsSection {title} {description} {crumb} {action}>
  <div class="trakt-settings-group-card" data-variant={variant}>
    {@render children()}
  </div>
</SettingsSection>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings-group-card {
    overflow: hidden;

    border-radius: var(--ni-10);
    border: var(--border-thickness-xxs) solid var(--color-border);
    background: var(--color-card-background);

    > :global(* + *) {
      border-top: var(--border-thickness-xxs) solid var(--color-border);
    }

    &[data-variant="vip"] {
      @include vip-glow-card;
    }

    &[data-variant="muted"] {
      @include muted-card;
    }

    &[data-variant="bare"] {
      --settings-group-row-padding-inline: 0;

      border-radius: 0;
      border: none;
      background: none;
    }
  }
</style>
