<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { useQuery } from '$lib/features/query/useQuery.ts';
  import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
  import { upcomingMediaQuery } from '$lib/requests/queries/calendars/upcomingMediaQuery.ts';
  import type { UpcomingEpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
  import { map } from 'rxjs';
  import CalendarDayStrip from './_internal/CalendarDayStrip.svelte';
  import CalendarItemCard from './_internal/CalendarItemCard.svelte';

  type Item = UpcomingEpisodeEntry | MovieEntry;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 14 day window starting today.
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  let active = $state(today);

  const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const query = useQuery(
    upcomingMediaQuery({
      startDate,
      days: 14,
      target: 'my',
    }),
  );

  const items = $derived(query.pipe(map(($q) => $q.data ?? [])));
  const isLoading = $derived(
    query.pipe(map(($q) => $q.isLoading || ($q.isFetching && !$q.data))),
  );

  const dayKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const grouped = $derived.by(() => {
    const map = new Map<string, Item[]>();
    for (const item of $items as Item[]) {
      const key = dayKey(item.effectiveReleaseDate);
      const list = map.get(key);
      if (list) list.push(item);
      else map.set(key, [item]);
    }
    return map;
  });

  const activeKey = $derived(dayKey(active));
  const activeItems = $derived(grouped.get(activeKey) ?? []);

  const headingFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
</script>

<section class="lb-calendar">
  <header class="lb-calendar__head">
    <p class="lb-calendar__eyebrow">{m.calendar_eyebrow()}</p>
    <h1 class="lb-calendar__title">{m.calendar_title()}</h1>
    <p class="lb-calendar__sub">{m.calendar_subtitle()}</p>
  </header>

  <CalendarDayStrip {days} {active} onSelect={(d) => (active = d)} />

  <header class="lb-calendar__day-header">
    <h2>{headingFormatter.format(active)}</h2>
    <span>{activeItems.length} {m.calendar_releases()}</span>
  </header>

  {#if $isLoading && $items.length === 0}
    <ul class="lb-calendar__grid">
      {#each Array.from({ length: 6 }) as _, i (i)}
        <li class="lb-calendar__skeleton"></li>
      {/each}
    </ul>
  {:else if activeItems.length === 0}
    <p class="lb-calendar__empty">{m.calendar_empty_day()}</p>
  {:else}
    <ul class="lb-calendar__grid">
      {#each activeItems as item (item.key)}
        <li><CalendarItemCard {item} /></li>
      {/each}
    </ul>
  {/if}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-calendar {
    width: 100%;
    max-width: var(--lb-page-max-width);
    margin: 0 auto;
    padding: var(--lb-page-pad-y) var(--lb-page-pad-x);
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    &__head {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__eyebrow {
      margin: 0;
      font-size: 0.72rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-watched);
      font-weight: 700;
    }

    &__title {
      margin: 0;
      font-family: var(--font-family-serif, "Tiempos Headline", Georgia, serif);
      font-weight: 400;
      font-size: clamp(2rem, 4vw, 3rem);
      line-height: 1.1;
      color: var(--color-text-primary);
    }

    &__sub {
      margin: 0;
      font-size: 0.95rem;
      color: var(--color-text-secondary);
    }

    &__day-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      padding-bottom: var(--gap-s);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);

      h2 {
        margin: 0;
        font-family: var(--font-family-serif, Georgia, serif);
        font-weight: 400;
        font-size: 1.3rem;
        color: var(--color-text-primary);
      }

      span {
        font-size: 0.78rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--color-text-secondary);
      }
    }

    &__grid {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(
        auto-fill,
        minmax(min(var(--lb-calendar-card-min-w), 100%), 1fr)
      );
      gap: var(--gap-s);
    }

    &__skeleton {
      width: 100%;
      height: 90px;
      border-radius: 3px;
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);
    }

    &__empty {
      margin: 0;
      padding: var(--gap-l) 0;
      text-align: center;
      color: var(--color-text-secondary);
    }
  }
</style>
