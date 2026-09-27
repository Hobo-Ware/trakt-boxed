<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { settingsNavItems } from "./settingsNavItems.ts";
</script>

<nav class="boxed-settings-nav" aria-label={m.page_title_settings()}>
  {#each settingsNavItems as item (item.key)}
    <Link href={item.href} activeMatch={item.match} color="inherit">
      <span class="nav-label">{item.label()}</span>
      {#if item.isVip}
        <span class="nav-vip">{m.tag_text_vip()}</span>
      {/if}
    </Link>
  {/each}
</nav>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-settings-nav {
    position: sticky;
    top: calc(var(--boxed-header-height) + var(--ni-24));
    align-self: start;

    display: flex;
    flex-direction: column;
    gap: var(--ni-2);

    :global(.trakt-link) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-xs);

      height: var(--ni-40);
      padding-inline: var(--ni-14);
      border-radius: var(--border-radius-m);

      color: var(--color-text-secondary);
      font-size: var(--ni-14);
      text-decoration: none;
      white-space: nowrap;

      &:hover,
      &:focus-visible {
        color: var(--color-text-primary);
      }
    }

    :global(.trakt-link.trakt-link-active) {
      background: var(--color-input-background);
      color: var(--color-text-primary);
      font-weight: 500;
    }

    :global(.trakt-link.trakt-link-active::before) {
      content: "";
      position: absolute;
      inset-block: var(--ni-8);
      inset-inline-start: 0;
      width: var(--border-thickness-xs);
      border-radius: var(--border-radius-xs);
      background: var(--purple-500);
    }

    @include for-tablet-sm-and-below {
      position: static;
      flex-direction: row;
      gap: var(--gap-xs);

      overflow-x: auto;
      scrollbar-width: none;
      margin-inline: calc(-1 * var(--layout-distance-side));
      padding-inline: var(--layout-distance-side);

      :global(.trakt-link) {
        flex-shrink: 0;
        height: var(--ni-36);
        border-radius: var(--border-radius-xxl);
        background: var(--color-input-background);
        box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
      }

      :global(.trakt-link.trakt-link-active) {
        background: color-mix(in srgb, var(--purple-500) 22%, transparent);
        box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--purple-400);
      }

      :global(.trakt-link.trakt-link-active::before) {
        display: none;
      }
    }
  }

  .nav-label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-vip {
    padding: var(--ni-2) var(--ni-6);
    border-radius: var(--border-radius-xxl);
    background: var(--purple-500);
    color: var(--shade-10);
    font-size: var(--ni-11);
    font-weight: 700;
    letter-spacing: 0.06em;
  }
</style>
