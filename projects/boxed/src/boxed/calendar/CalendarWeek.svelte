<script lang="ts">
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider.ts";
  import { useCalendarPeriod } from "$lib/features/calendar/context/useCalendarPeriod.ts";
  import EpisodeTypeToggles from "$lib/features/calendar/EpisodeTypeToggles.svelte";
  import type { CalendarItem, useCalendar } from "$lib/features/calendar/useCalendar.ts";
  import { useEpisodeType } from "$lib/features/calendar/useEpisodeType.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import { getLocale, languageTag } from "$lib/features/i18n";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import FilterButton from "$lib/sections/navbar/components/filter/FilterButton.svelte";
  import { getDaysDifference } from "$lib/utils/date/getDaysDifference.ts";
  import { toHumanClockTime } from "$lib/utils/formatting/date/toHumanClockTime.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { toHumanDayOfWeek } from "$lib/utils/formatting/date/toHumanDayOfWeek.ts";
  import { toTranslatedType } from "$lib/utils/formatting/string/toTranslatedType.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ModeSwitch from "../browse/ModeSwitch.svelte";
  import PageContainer from "../components/PageContainer.svelte";

  type CalendarWeekProps = {
    title: string;
    source: typeof useCalendar;
    emptyText: string;
  };

  const { title, source, emptyText }: CalendarWeekProps = $props();

  const DAYS_IN_WEEK = 7;

  const { startDate, endDate, next, previous, reset } = useCalendarPeriod();
  const { episodeType } = useEpisodeType();
  const { mode } = useDiscover();
  const { filterMap } = useFilter();

  const { calendar, isLoading } = $derived(
    source({
      start: $startDate,
      days: getDaysDifference($startDate, $endDate),
      type: $mode,
      episodeType,
      filter: $filterMap,
    }),
  );

  const today = new Date();
  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  const weekDays = $derived(
    Array.from({ length: DAYS_IN_WEEK }, (_, index) => {
      const date = new Date($startDate);
      date.setDate(date.getDate() + index);
      return date;
    }),
  );

  const daysWithItems = $derived(
    $calendar.filter((day) => day.items.length > 0),
  );

  const isEpisode = (
    item: CalendarItem,
  ): item is Extract<CalendarItem, { show: unknown }> => "show" in item;

  const itemHref = (item: CalendarItem) =>
    isEpisode(item)
      ? UrlBuilder.show(item.show.slug)
      : UrlBuilder.media(item.type, item.slug);
</script>

{#snippet dayGroupSkeleton()}
  <section class="boxed-cal-day" aria-hidden="true">
    <Skeleton width="var(--ni-200)" height="var(--ni-28)" />
    {#each { length: 3 }, index (index)}
      <div class="boxed-cal-row">
        <Skeleton width="var(--ni-60)" height="var(--ni-14)" />
        <span class="boxed-cal-still"><Skeleton height="100%" /></span>
        <div class="boxed-cal-text">
          <Skeleton width="60%" height="var(--ni-18)" />
          <Skeleton width="40%" height="var(--ni-14)" />
        </div>
      </div>
    {/each}
  </section>
{/snippet}

<PageContainer>
  <header class="boxed-cal-header">
    <h1>{title}</h1>
    <div class="boxed-cal-controls">
      <ModeSwitch />
      <EpisodeTypeToggles />
      <FilterButton isDisabled={false} />
    </div>
  </header>

  <nav class="boxed-cal-week" aria-label={title}>
    <button
      type="button"
      class="boxed-cal-nav"
      aria-label={m.button_label_previous_calendar_period()}
      onclick={previous}
    >
      <CaretLeftIcon />
    </button>
    <ol class="boxed-cal-strip">
      {#each weekDays as day (day.toDateString())}
        <li class:is-today={isSameDay(day, today)}>
          <span class="boxed-cal-strip-dow">{toHumanDayOfWeek(day, getLocale())}</span>
          <span class="boxed-cal-strip-date">{day.getDate()}</span>
        </li>
      {/each}
    </ol>
    <button
      type="button"
      class="boxed-cal-nav"
      aria-label={m.button_label_next_calendar_period()}
      onclick={next}
    >
      <CaretRightIcon />
    </button>
    <button type="button" class="boxed-cal-today" onclick={reset}>
      {m.button_text_reset_calendar_period()}
    </button>
  </nav>

  <div class="boxed-cal-days">
    {#if $isLoading}
      {@render dayGroupSkeleton()}
      {@render dayGroupSkeleton()}
    {:else if daysWithItems.length === 0}
      <p class="boxed-cal-empty">{emptyText}</p>
    {:else}
      {#each daysWithItems as day (day.date.toDateString())}
        <section class="boxed-cal-day">
          <h2 class:is-today={isSameDay(day.date, today)}>
            {toHumanDay({ date: day.date, locale: getLocale() })}
          </h2>
          {#each day.items as item (item.key)}
            <a class="boxed-cal-row" href={itemHref(item)}>
              <span class="boxed-cal-time">
                {toHumanClockTime(item.airDate, languageTag())}
              </span>
              <span class="boxed-cal-still" data-kind={isEpisode(item) ? "still" : "poster"}>
                <CrossOriginImage
                  src={isEpisode(item)
                    ? (item.cover.url ?? item.show.cover.url.thumb)
                    : item.poster.url.thumb}
                  alt=""
                />
              </span>
              <span class="boxed-cal-text">
                <span class="boxed-cal-title">
                  {isEpisode(item) ? item.show.title : item.title}
                </span>
                <span class="boxed-cal-meta">
                  {#if isEpisode(item)}
                    {episodeNumberLabel({
                      seasonNumber: item.season,
                      episodeNumber: item.number,
                    })}
                    {#if item.title}· {item.title}{/if}
                  {:else}
                    {toTranslatedType(item.type)}
                  {/if}
                </span>
              </span>
              <span class="boxed-cal-chips">
                {#if isEpisode(item) && EpisodeIntlProvider.episodeTypeText(item.type)}
                  <span class="boxed-cal-chip is-accent">
                    {EpisodeIntlProvider.episodeTypeText(item.type)}
                  </span>
                {/if}
                {#if isEpisode(item) && item.show.network}
                  <span class="boxed-cal-chip">{item.show.network}</span>
                {/if}
              </span>
            </a>
          {/each}
        </section>
      {/each}
    {/if}
  </div>
</PageContainer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--gap-m);

    h1 {
      margin: 0;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-40);
      font-weight: 600;
      line-height: 1.2;

      @include for-mobile {
        font-size: var(--ni-28);
      }
    }
  }

  .boxed-cal-controls {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--gap-s);
    min-height: var(--ni-40);
  }

  .boxed-cal-week {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .boxed-cal-nav,
  .boxed-cal-today {
    height: var(--ni-40);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);
    padding-inline: var(--ni-12);

    border: none;
    border-radius: var(--border-radius-m);
    background: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    color: var(--color-text-primary);
    font: inherit;
    font-size: var(--ni-14);
    font-weight: 600;
    cursor: pointer;
  }

  .boxed-cal-nav {
    width: var(--ni-40);
    padding: 0;
  }

  .boxed-cal-strip {
    flex: 1;
    margin: 0;
    padding: 0;
    list-style: none;

    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: var(--gap-xs);

    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ni-2);
      padding-block: var(--ni-8);
      border-radius: var(--border-radius-m);
      background: var(--color-input-background);

      &.is-today {
        background: var(--purple-500);
        color: var(--shade-10);
      }
    }
  }

  .boxed-cal-strip-dow {
    font-size: var(--ni-11);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.8;
  }

  .boxed-cal-strip-date {
    font-family: var(--boxed-font-title);
    font-size: var(--ni-20);
    font-weight: 600;
  }

  .boxed-cal-today {
    @include for-mobile {
      display: none;
    }
  }

  .boxed-cal-days {
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);
    min-height: var(--ni-480);
  }

  .boxed-cal-day {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    h2 {
      margin: 0 0 var(--ni-8);
      padding-bottom: var(--ni-8);
      border-bottom: var(--border-thickness-xxs) solid var(--color-border);
      font-family: var(--boxed-font-title);
      font-size: var(--ni-24);
      font-weight: 600;

      &.is-today {
        color: var(--boxed-color-accent-text);
      }
    }
  }

  .boxed-cal-row {
    display: grid;
    grid-template-columns: var(--ni-64) var(--ni-120) minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--gap-m);
    min-height: var(--ni-80);
    padding: var(--ni-6);
    border-radius: var(--border-radius-m);
    color: inherit;
    text-decoration: none;

    &:hover,
    &:focus-visible {
      background: var(--color-input-background);
    }

    @include for-mobile {
      grid-template-columns: var(--ni-96) minmax(0, 1fr);
      grid-template-areas: "still text" "still chips";
      gap: var(--gap-xs) var(--gap-s);

      .boxed-cal-time {
        display: none;
      }

      .boxed-cal-still {
        grid-area: still;
      }

      .boxed-cal-text {
        grid-area: text;
      }

      .boxed-cal-chips {
        grid-area: chips;
      }
    }
  }

  .boxed-cal-time {
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .boxed-cal-still {
    display: block;
    aspect-ratio: 16 / 9;
    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: var(--color-input-background);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .boxed-cal-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    min-width: 0;
  }

  .boxed-cal-title {
    font-family: var(--boxed-font-title);
    font-size: var(--ni-18);
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .boxed-cal-meta {
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .boxed-cal-chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xxs);
  }

  .boxed-cal-chip {
    display: inline-flex;
    align-items: center;
    height: var(--ni-24);
    padding-inline: var(--ni-8);
    border-radius: var(--border-radius-xxl);
    background: var(--color-input-background);
    color: var(--color-text-secondary);
    font-size: var(--ni-12);
    font-weight: 600;

    &.is-accent {
      background: var(--boxed-color-accent-soft);
      color: var(--boxed-color-accent-text);
    }
  }

  .boxed-cal-empty {
    margin: 0;
    color: var(--color-text-secondary);
  }
</style>
