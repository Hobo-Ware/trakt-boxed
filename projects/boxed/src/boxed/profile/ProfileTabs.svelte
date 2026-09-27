<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { toProfileTabs } from "./_internal/toProfileTabs.ts";
  import type { ProfileTab } from "./ProfileTab.ts";

  const {
    slug,
    active,
    isMe,
  }: { slug: string; active: ProfileTab; isMe: boolean } = $props();

  const tabs = $derived(toProfileTabs({ slug, isMe }));
</script>

<nav class="boxed-profile-tabs" aria-label={m.boxed_profile_tabs_label()}>
  {#each tabs as tab (tab.id)}
    <a
      href={tab.href}
      class:is-active={tab.id === active}
      aria-current={tab.id === active ? "page" : undefined}
    >
      {tab.label}
    </a>
  {/each}
</nav>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-profile-tabs {
    display: flex;
    height: var(--ni-48);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);

    overflow-x: auto;
    scrollbar-width: none;

    a {
      flex: 1 1 0;
      min-width: var(--ni-88);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: calc(-1 * var(--border-thickness-xxs));
      border-bottom: var(--border-thickness-xs) solid transparent;

      font-size: var(--ni-14);
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-decoration: none;
      white-space: nowrap;
      color: var(--color-text-secondary);

      &:hover,
      &:focus-visible {
        color: var(--color-text-primary);
      }

      &.is-active {
        border-bottom-color: var(--purple-500);
        color: var(--color-text-primary);
      }

      @include for-mobile {
        flex: 0 0 var(--ni-96);
      }
    }
  }
</style>
