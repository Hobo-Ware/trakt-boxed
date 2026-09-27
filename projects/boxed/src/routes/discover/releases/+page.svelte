<script lang="ts">
  import CalendarWeek from "$boxed/calendar/CalendarWeek.svelte";
  import CalendarProvider from "$lib/features/calendar/CalendarProvider.svelte";
  import { useReleasesCalendar } from "$lib/features/calendar/useReleasesCalendar.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/assets";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.page_title_releases()}
  info={{ overview: m.page_description_releases() }}
>
  <NavbarStateSetter hasFilters showFilters />

  <CalendarProvider>
    <CalendarWeek
      title={m.list_title_releases()}
      source={useReleasesCalendar}
      emptyText={m.text_placeholder_generic()}
    />
  </CalendarProvider>
</TraktPage>
