<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import type { FilmTab } from './filmTabs.ts';

  type Props = {
    active: FilmTab;
    onSelect: (tab: FilmTab) => void;
  };

  const { active, onSelect }: Props = $props();

  const tabs: { key: FilmTab; label: string }[] = $derived([
    { key: 'cast', label: m.tab_label_cast() },
    { key: 'crew', label: m.tab_label_crew() },
    { key: 'details', label: m.tab_label_details() },
    { key: 'genres', label: m.tab_label_genres() },
    { key: 'releases', label: m.tab_label_releases() },
  ]);

  const tabId = (key: FilmTab) => `film-tab-${key}`;
  const panelId = (key: FilmTab) => `film-tabpanel-${key}`;
</script>

<div class="film-tabs" role="tablist" aria-label="Film details">
  {#each tabs as tab (tab.key)}
    <button
      type="button"
      role="tab"
      id={tabId(tab.key)}
      aria-controls={panelId(tab.key)}
      aria-selected={tab.key === active}
      tabindex={tab.key === active ? 0 : -1}
      class="film-tabs__tab"
      data-active={tab.key === active ? "true" : undefined}
      onclick={() => onSelect(tab.key)}
    >
      {tab.label}
    </button>
  {/each}
</div>

<style lang="scss">
  .film-tabs {
    display: flex;
    gap: var(--gap-m);
    border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
    margin-top: var(--gap-l);
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar { display: none; }

    &__tab {
      all: unset;
      cursor: pointer;
      padding: 0.6rem 0;
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      position: relative;
      flex-shrink: 0;

      &:hover { color: var(--color-text-primary); }

      &[data-active="true"] {
        color: var(--color-text-primary);
      }

      &[data-active="true"]::after {
        content: "";
        position: absolute;
        inset: auto 0 -1px 0;
        height: 2px;
        background: var(--color-background-green, var(--green-500));
      }
    }
  }
</style>
