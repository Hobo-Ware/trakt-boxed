<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';

  type Tab = 'cast' | 'crew' | 'details' | 'genres' | 'releases';

  type Props = {
    active: Tab;
    onSelect: (tab: Tab) => void;
  };

  const { active, onSelect }: Props = $props();

  const tabs: { key: Tab; label: string }[] = $derived([
    { key: 'cast', label: m.tab_label_cast() },
    { key: 'crew', label: m.tab_label_crew() },
    { key: 'details', label: m.tab_label_details() },
    { key: 'genres', label: m.tab_label_genres() },
    { key: 'releases', label: m.tab_label_releases() },
  ]);
</script>

<nav class="film-tabs" aria-label="Film details">
  {#each tabs as tab (tab.key)}
    <button
      type="button"
      class="film-tabs__tab"
      data-active={tab.key === active ? "true" : undefined}
      onclick={() => onSelect(tab.key)}
    >
      {tab.label}
    </button>
  {/each}
</nav>

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
