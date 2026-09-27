<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useStreak } from "$lib/sections/stats/useStreak.ts";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth.ts";
  import SectionHeader from "../../components/SectionHeader.svelte";
  import { toYearHeatmap } from "../_internal/toYearHeatmap.ts";

  const WEEKS = 52;

  const { history } = useUser();
  const { streakCount } = useStreak({ mode: "media" });

  const now = new Date();
  const cells = $derived(
    toYearHeatmap({
      dates: $history
        ? [
          ...[...$history.movies.values()].flatMap((movie) => movie.watchedDates),
          ...[...$history.shows.values()].flatMap((show) => show.watchedDates),
        ]
        : [],
      now,
      weeks: WEEKS,
    }),
  );
  const firstDate = $derived(cells.at(0)?.date);
  const firstMonth = $derived(
    firstDate ? toHumanMonth(firstDate, languageTag(), "short") : "",
  );
  const streakText = $derived(
    $streakCount > 0
      ? `${m.text_stats_days_count({ count: String($streakCount) })} ${m.text_stats_watching_streak()}`
      : "",
  );
</script>

<section class="boxed-year-heatmap">
  <SectionHeader title={m.list_title_activity()}>
    {#snippet actions()}
      <span class="heatmap-streak">{streakText}</span>
    {/snippet}
  </SectionHeader>
  <div class="heatmap-grid" role="img" aria-label={m.boxed_profile_heatmap_label()}>
    {#each cells as cell (cell.key)}
      <span
        class="heatmap-cell"
        data-level={cell.level}
        class:is-future={cell.isFuture}
      ></span>
    {/each}
  </div>
  <div class="heatmap-legend">
    <span>{firstMonth}</span>
    <span class="heatmap-scale">
      {m.boxed_profile_heatmap_less()}
      {#each [0, 1, 2, 3, 4] as level (level)}
        <span class="heatmap-cell" data-level={level}></span>
      {/each}
      {m.boxed_profile_heatmap_more()}
    </span>
    <span>{toHumanMonth(now, languageTag(), "short")}</span>
  </div>
</section>

<style>
  .heatmap-streak {
    font-size: var(--ni-12);
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .heatmap-grid {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: repeat(52, minmax(0, 1fr));
    grid-template-rows: repeat(7, auto);
    gap: var(--ni-1);
  }

  .heatmap-cell {
    display: block;
    aspect-ratio: 1;
    border-radius: var(--ni-1);
    background: var(--color-heatmap-empty);

    &[data-level="1"] {
      background: var(--color-heatmap-l1);
    }
    &[data-level="2"] {
      background: var(--color-heatmap-l2);
    }
    &[data-level="3"] {
      background: var(--color-heatmap-l3);
    }
    &[data-level="4"] {
      background: var(--color-heatmap-l4);
    }
    &.is-future {
      visibility: hidden;
    }
  }

  .heatmap-legend {
    margin-top: var(--ni-8);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--ni-11);
    color: var(--color-text-secondary);
  }

  .heatmap-scale {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-2);

    .heatmap-cell {
      width: var(--ni-8);
    }
  }
</style>
