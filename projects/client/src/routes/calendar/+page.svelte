<script lang="ts">
  /*
    Calendar surface — when does what air? Fraunces editorial
    header announces the page as a "release calendar" framing,
    today's date eyebrow grounds it, then the existing Calendar
    component carries the per-day air schedule.
  */
  import Calendar from "$lib/features/calendar/Calendar.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { current } = useDiscover();

  const monthLabel = (() => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        month: "long",
        year: "numeric",
      })
        .format(new Date())
        .toUpperCase();
    } catch {
      return "";
    }
  })();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_calendar()}
>
  <TraktPageCoverSetter />
  <NavbarStateSetter hasFilters />

  <div class="lb-cal-page">
    <header class="lb-cal-hero">
      <p class="lb-cal-eyebrow">
        <span class="lb-cal-month">{monthLabel}</span>
        <span class="lb-cal-divider" aria-hidden="true">·</span>
        <span>{m.lb_calendar_eyebrow()}</span>
      </p>
      <h1 class="lb-cal-title">{m.header_calendar()}</h1>
      <p class="lb-cal-lede">{m.lb_calendar_lede()}</p>
    </header>

    <div class="lb-cal-frame">
      <Calendar />
    </div>
  </div>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-cal-page {
    width: 100%;
    max-width: var(--ni-1280);
    margin-inline: auto;
    padding: var(--ni-22) var(--ni-16) var(--ni-44);
    box-sizing: border-box;

    @include for-tablet-lg {
      padding-inline: var(--ni-32);
    }
  }

  .lb-cal-hero {
    padding: var(--ni-22) 0 var(--ni-32);
  }

  .lb-cal-eyebrow {
    margin: 0 0 var(--ni-10) 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ni-6);
    font-size: var(--ni-11);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--color-text-secondary);
  }

  .lb-cal-month {
    color: var(--tboxed-positive);
  }

  .lb-cal-divider {
    color: color-mix(in srgb, var(--color-foreground) 25%, transparent);
  }

  .lb-cal-title {
    margin: 0;
    font-family: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
    font-optical-sizing: auto;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
    color: var(--color-foreground);
    font-size: var(--ni-44);

    @include for-tablet-sm {
      font-size: var(--ni-60);
    }
  }

  .lb-cal-lede {
    margin: var(--ni-12) 0 0 0;
    font-size: var(--ni-15);
    line-height: 1.5;
    color: var(--color-text-secondary);
    max-width: var(--ni-560);
  }

  .lb-cal-frame {
    border-top: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
    padding-top: var(--ni-22);
  }
</style>
