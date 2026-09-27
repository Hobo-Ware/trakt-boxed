<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import FilterIcon from "$lib/components/icons/FilterIcon.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { type Filter, FilterKey } from "$lib/features/filters/models/Filter.ts";
  import { FilterMode } from "$lib/features/filters/models/FilterMode.ts";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import { useStoredFilters } from "$lib/features/filters/useStoredFilters.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import FilterSidebar from "$lib/sections/navbar/components/filter/FilterSidebar.svelte";
  import { combineLatest } from "rxjs";
  import FilterChip from "./_internal/FilterChip.svelte";
  import PosterSizeToggle from "./_internal/PosterSizeToggle.svelte";
  import { withFilterValue } from "./_internal/withFilterValue.ts";

  const CHIP_KEYS: ReadonlyArray<FilterKey> = [
    FilterKey.Genres,
    FilterKey.Decade,
    FilterKey.Ratings,
    FilterKey.Runtime,
    FilterKey.Certifications,
    FilterKey.Countries,
    FilterKey.Status,
  ];

  const { filters, getFilterValue, hasActiveFilter, activeFilterCount } =
    useFilter();
  const { resetFilters } = useStoredFilters();
  const { track } = useTrack(AnalyticsEvent.Filter);

  const chips: ReadonlyArray<Filter> = CHIP_KEYS.flatMap((key) =>
    filters.filter((filter) => filter.key === key)
  );
  const chipValues = combineLatest(
    chips.map((filter) => getFilterValue(filter.key)),
  );
  const ignoreWatched = filters.find(
    (filter) => filter.key === FilterKey.IgnoreWatched,
  );
  const ignoreWatchedValue = getFilterValue(FilterKey.IgnoreWatched);

  let isDrawerOpen = $state(false);
  const openDrawer = () => (isDrawerOpen = true);

  const labelOf = (filter: Filter) =>
    "label" in filter ? filter.label() : m.header_ratings();

  const setFilter = (filter: Filter, value: string | null) => {
    track({
      id: filter.key,
      action: value ? "set" : "reset",
      mode: FilterMode.Simple,
    });
    goto(withFilterValue({ url: page.url, filter, value }), {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  };

  const toggleHideWatched = () => {
    if (!ignoreWatched) return;
    setFilter(ignoreWatched, $ignoreWatchedValue === "true" ? null : "true");
  };
</script>

<div class="boxed-chart-filter-bar">
  <div class="boxed-chart-filter-chips">
    <button
      type="button"
      class="boxed-chart-filter-all"
      class:is-active={$activeFilterCount > 0}
      aria-haspopup="dialog"
      onclick={openDrawer}
    >
      <FilterIcon state={$hasActiveFilter ? "filtered" : "unfiltered"} />
      {m.button_label_filters()}
      <span class="boxed-chart-filter-count" aria-hidden="true">
        {$activeFilterCount > 0 ? $activeFilterCount : ""}
      </span>
    </button>

    <span class="boxed-chart-filter-divider" aria-hidden="true"></span>

    {#each chips as filter, index (filter.key)}
      <FilterChip
        {filter}
        label={labelOf(filter)}
        value={$chipValues?.at(index)}
        onChange={(value) => setFilter(filter, value)}
        onOpenDrawer={openDrawer}
      />
    {/each}

    <button
      type="button"
      class="boxed-chart-filter-clear"
      class:is-hidden={!$hasActiveFilter}
      onclick={resetFilters}
    >
      {m.button_text_reset_all_filters()}
    </button>
  </div>

  <div class="boxed-chart-filter-options">
    {#if ignoreWatched}
      <div class="boxed-chart-hide-watched">
        <span aria-hidden="true">{m.header_hide_watched()}</span>
        <Switch
          label={m.header_hide_watched()}
          checked={$ignoreWatchedValue === "true"}
          onclick={toggleHideWatched}
          color="purple"
        />
      </div>
    {/if}
    <PosterSizeToggle />
  </div>
</div>

{#if isDrawerOpen}
  <FilterSidebar onClose={() => (isDrawerOpen = false)} />
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-chart-filter-bar {
    display: flex;
    flex-direction: column;
    border-block: var(--border-thickness-xxs) solid var(--color-border);
  }

  .boxed-chart-filter-chips {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--gap-xs);
    padding-block: var(--ni-12);

    @include for-mobile {
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: none;
      margin-inline: calc(-1 * var(--layout-distance-side));
      padding-inline: var(--layout-distance-side);

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  .boxed-chart-filter-all {
    flex-shrink: 0;
    height: var(--ni-32);
    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);
    padding-inline: var(--ni-12);

    border: none;
    border-radius: var(--border-radius-xxl);
    background: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    color: var(--color-text-primary);
    font: inherit;
    font-size: var(--ni-14);
    font-weight: 600;
    cursor: pointer;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }

    &.is-active {
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--purple-500);
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: var(--ni-2);
    }
  }

  .boxed-chart-filter-count {
    min-width: var(--ni-16);
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
    text-align: start;
  }

  .boxed-chart-filter-divider {
    flex-shrink: 0;
    width: var(--border-thickness-xxs);
    height: var(--ni-20);
    background: var(--color-border);
  }

  .boxed-chart-filter-clear {
    flex-shrink: 0;
    height: var(--ni-32);
    padding-inline: var(--ni-8);

    border: none;
    background: transparent;
    color: var(--color-link-active);
    font: inherit;
    font-size: var(--ni-14);
    white-space: nowrap;
    cursor: pointer;

    &.is-hidden {
      visibility: hidden;
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: var(--ni-2);
    }
  }

  .boxed-chart-filter-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);
    min-height: var(--ni-32);
    padding-block: var(--ni-10);
    border-top: var(--border-thickness-xxs) solid var(--color-border);
  }

  .boxed-chart-hide-watched {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-10);
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }
</style>
