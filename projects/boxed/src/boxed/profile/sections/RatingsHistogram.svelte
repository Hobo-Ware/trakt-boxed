<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserStats } from "$lib/requests/models/UserStats.ts";
  import { toHumanCount } from "$lib/utils/formatting/number/toHumanCount.ts";
  import { toIMDBRating } from "$lib/utils/formatting/number/toIMDBRating.ts";
  import SectionHeader from "../../components/SectionHeader.svelte";
  import Stars from "../../components/Stars.svelte";
  import { toRatingSummary } from "../_internal/toRatingSummary.ts";

  const { stats }: { stats: UserStats | null } = $props();

  const summary = $derived(toRatingSummary(stats?.ratings.distribution));
</script>

<section class="boxed-ratings-histogram">
  <SectionHeader title={m.list_title_ratings()}>
    {#snippet actions()}
      <span class="histogram-total">
        {summary.total > 0 ? toHumanCount(summary.total, languageTag()) : ""}
      </span>
    {/snippet}
  </SectionHeader>

  <div class="histogram-chart">
    <span class="histogram-edge" aria-hidden="true">★</span>
    <div class="histogram-bars">
      {#each summary.bars as bar (bar.rating)}
        <span
          class="histogram-bar"
          class:is-peak={bar.rating === summary.mostGiven}
          style:--ratio={bar.ratio}
          title={m.boxed_profile_rating_bar({
            stars: bar.rating / 2,
            count: bar.count,
          })}
        ></span>
      {/each}
    </div>
    <span class="histogram-edge" aria-hidden="true">★★★★★</span>
  </div>

  <div class="histogram-footer">
    <span>
      {m.boxed_profile_rating_average()}
      <strong>{summary.average === null ? "" : toIMDBRating(summary.average / 2, languageTag())}</strong>
    </span>
    <span class="histogram-most">
      {m.boxed_profile_rating_most_given()}
      <span class="histogram-most-stars">
        {#if summary.mostGiven !== null}<Stars rating={summary.mostGiven} />{/if}
      </span>
    </span>
  </div>
</section>

<style>
  .histogram-total {
    min-width: var(--ni-40);
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    text-align: end;
    color: var(--color-text-secondary);
  }

  .histogram-chart {
    display: flex;
    align-items: flex-end;
    gap: var(--gap-xs);
  }

  .histogram-edge {
    font-size: var(--ni-11);
    color: var(--boxed-color-star);
    white-space: nowrap;
  }

  .histogram-bars {
    flex: 1;
    height: var(--ni-80);
    display: flex;
    align-items: flex-end;
    gap: var(--ni-3);
  }

  .histogram-bar {
    flex: 1;
    height: 100%;
    clip-path: inset(
      min(calc((1 - var(--ratio)) * 100%), calc(100% - var(--ni-2))) 0 0 0
    );
    border-start-start-radius: var(--ni-2);
    border-start-end-radius: var(--ni-2);
    background: color-mix(in srgb, var(--color-text-secondary) 45%, transparent);

    &.is-peak {
      background: var(--boxed-color-accent-fill);
    }
  }

  .histogram-footer {
    height: var(--ni-20);
    margin-top: var(--ni-10);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);

    strong {
      color: var(--color-text-primary);
    }
  }

  .histogram-most-stars {
    min-width: var(--ni-72);
  }

  .histogram-most {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);
  }
</style>
