<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import type { ProfileTab } from './profileTabs.ts';

  type Props = {
    active: ProfileTab;
    onSelect: (tab: ProfileTab) => void;
    isMe: boolean;
  };

  const { active, onSelect, isMe }: Props = $props();

  type Tab = { key: ProfileTab; label: string };
  const tabs = $derived.by((): Tab[] => {
    const out: Tab[] = [
      { key: 'profile', label: m.profile_tab_profile() },
      { key: 'films', label: m.profile_tab_films() },
      { key: 'shows', label: m.profile_tab_shows() },
    ];
    if (isMe) out.push({ key: 'watchlist', label: m.profile_tab_watchlist() });
    out.push({ key: 'reviews', label: m.profile_tab_reviews() });
    out.push({ key: 'network', label: m.profile_tab_network() });
    return out;
  });
</script>

<div class="profile-subnav" role="tablist" aria-label="Profile sections">
  {#each tabs as tab (tab.key)}
    <button
      type="button"
      role="tab"
      aria-selected={tab.key === active}
      class="profile-subnav__tab"
      data-active={tab.key === active ? 'true' : undefined}
      onclick={() => onSelect(tab.key)}
    >
      {tab.label}
    </button>
  {/each}
</div>

<style lang="scss">
  .profile-subnav {
    display: flex;
    gap: var(--gap-m);
    border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar { display: none; }

    &__tab {
      all: unset;
      cursor: pointer;
      padding: 10px 0;
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      position: relative;
      flex-shrink: 0;

      &:hover { color: var(--color-text-primary); }

      &[data-active='true'] {
        color: var(--color-text-primary);

        &::after {
          content: '';
          position: absolute;
          inset: auto 0 -1px 0;
          height: 2px;
          background: var(--color-watched);
        }
      }
    }
  }
</style>
