<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';

  type Stat = { key: string; label: string; value: number | string | null };

  type Props = { stats: ReadonlyArray<Stat> };
  const { stats }: Props = $props();

  const visible = $derived(stats.filter((s) => s.value != null));
</script>

{#if visible.length > 0}
  <dl class="profile-stats">
    {#each visible as stat (stat.key)}
      <div class="profile-stats__cell">
        <dt class="profile-stats__value">
          {typeof stat.value === 'number' ? toHumanNumber(stat.value) : stat.value}
        </dt>
        <dd class="profile-stats__label">{stat.label}</dd>
      </div>
    {/each}
  </dl>
{/if}

<style lang="scss">
  .profile-stats {
    display: flex;
    gap: var(--gap-l);
    margin: 0;

    &__cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    &__value {
      margin: 0;
      font-family: var(--font-family-serif, Georgia, serif);
      font-size: 1.3rem;
      color: var(--color-text-primary);
      line-height: 1;
    }

    &__label {
      margin: 0;
      font-size: 0.65rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }
  }
</style>
