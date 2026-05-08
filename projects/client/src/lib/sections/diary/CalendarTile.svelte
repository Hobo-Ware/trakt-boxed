<script lang="ts">
  /*
    Letterboxd-flavoured calendar stamp: red MAY ribbon on top, large
    day numeral, year underneath. Used as the visual anchor for every
    diary entry — "the page reads more like an Excel ledger than a
    social feed" (research notes/profile-diary.md).

    For trakt-boxed it doubles as the anchor for both film and episode
    entries — episodes are first-class on the diary, not folded into
    show summaries.
  */
  import { getLocale } from "$lib/features/i18n";

  type CalendarTileProps = {
    date: Date;
  };

  const { date }: CalendarTileProps = $props();

  const month = $derived(
    new Intl.DateTimeFormat(getLocale(), { month: "short" }).format(date),
  );
  const day = $derived(
    new Intl.DateTimeFormat(getLocale(), { day: "numeric" }).format(date),
  );
  const year = $derived(date.getFullYear());
</script>

<div class="trakt-calendar-tile" aria-hidden="true">
  <div class="trakt-calendar-tile-month">{month}</div>
  <div class="trakt-calendar-tile-day">{day}</div>
  <div class="trakt-calendar-tile-year">{year}</div>
</div>

<style>
  .trakt-calendar-tile {
    --tile-width: var(--ni-52);

    width: var(--tile-width);
    flex-shrink: 0;

    display: flex;
    flex-direction: column;
    align-items: stretch;

    border-radius: var(--border-radius-xs);
    overflow: hidden;

    background: color-mix(in srgb, var(--color-foreground) 4%, transparent);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);

    text-align: center;
    line-height: 1;
  }

  .trakt-calendar-tile-month {
    /*
      The brand's only red use, lifted from Letterboxd's diary ribbon
      and given a slightly hotter saturation for trakt-boxed.
    */
    background: #ff3838;
    color: #fff;

    padding: var(--ni-4) 0;
    font-size: var(--ni-10);
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .trakt-calendar-tile-day {
    padding: var(--ni-6) 0 var(--ni-2);
    font-size: var(--ni-22);
    font-weight: 700;
    color: var(--color-foreground);
  }

  .trakt-calendar-tile-year {
    padding-bottom: var(--ni-6);
    font-size: var(--ni-10);
    color: var(--color-text-secondary);
  }
</style>
