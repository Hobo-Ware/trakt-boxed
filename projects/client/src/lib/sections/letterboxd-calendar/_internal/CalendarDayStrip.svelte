<script lang="ts">
  type Props = {
    days: ReadonlyArray<Date>;
    active: Date;
    onSelect: (date: Date) => void;
  };

  const { days, active, onSelect }: Props = $props();

  const dayName = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
  const monthName = new Intl.DateTimeFormat(undefined, { month: 'short' });

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const today = new Date();
</script>

<nav class="day-strip" aria-label="Pick a day">
  {#each days as day (day.toISOString())}
    <button
      type="button"
      class="day-strip__cell"
      data-active={isSameDay(day, active) ? 'true' : undefined}
      data-today={isSameDay(day, today) ? 'true' : undefined}
      onclick={() => onSelect(day)}
    >
      <span class="day-strip__month">{monthName.format(day)}</span>
      <span class="day-strip__date">{day.getDate()}</span>
      <span class="day-strip__weekday">{dayName.format(day)}</span>
    </button>
  {/each}
</nav>

<style lang="scss">
  .day-strip {
    display: flex;
    gap: var(--gap-xs);
    overflow-x: auto;
    padding-bottom: var(--gap-xs);
    scrollbar-width: none;

    &::-webkit-scrollbar { display: none; }

    &__cell {
      all: unset;
      cursor: pointer;
      flex-shrink: 0;
      width: 64px;
      padding: 8px 4px;
      border-radius: 4px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);
      border: 1px solid color-mix(in srgb, var(--shade-10) 6%, transparent);
      transition: background 120ms ease, border-color 120ms ease;

      &:hover { border-color: color-mix(in srgb, var(--shade-10) 14%, transparent); }

      &[data-today="true"] .day-strip__date {
        color: var(--color-watched);
      }

      &[data-active="true"] {
        background: color-mix(in srgb, var(--color-watched) 18%, transparent);
        border-color: var(--color-watched);
      }
    }

    &__month {
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    &__date {
      font-family: var(--font-family-serif, Georgia, serif);
      font-size: 1.4rem;
      line-height: 1;
      color: var(--color-text-primary);
    }

    &__weekday {
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }
  }
</style>
