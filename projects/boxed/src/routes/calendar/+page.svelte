<script lang="ts">
  import CalendarWeek from "$boxed/calendar/CalendarWeek.svelte";
  import { useCalendar } from "$lib/features/calendar/useCalendar.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_calendar()}
>
  <NavbarStateSetter hasFilters showFilters />

  <CalendarWeek
    title={m.header_calendar()}
    source={useCalendar}
    emptyText={m.text_calendar_placeholder_4()}
  />
</TraktPage>
