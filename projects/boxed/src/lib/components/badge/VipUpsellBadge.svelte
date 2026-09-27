<script lang="ts">
  import BadgeSparkle from "./_internal/BadgeSparkle.svelte";
  import * as m from "$lib/features/i18n/messages";
</script>

<div class="trakt-vip-upsell-badge">
  <BadgeSparkle />
  <p class="uppercase">{m.badge_text_get_vip()}</p>
</div>

<style lang="scss">
  .trakt-vip-upsell-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);

    padding: var(--ni-8) var(--ni-12);
    height: var(--ni-28);
    box-sizing: border-box;
    border-radius: var(--border-radius-s);
    background: var(--boxed-color-accent-soft);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--purple-500) 55%, transparent);
    color: var(--boxed-color-accent-text);
    transition: background var(--transition-increment) ease-in-out;

    :global(.trakt-link:hover) & {
      background: color-mix(in srgb, var(--purple-500) 24%, transparent);
    }

    p {
      font-size: var(--ni-12);
      font-weight: 600;
      letter-spacing: 0.06em;
      white-space: nowrap;
    }
  }
</style>
