<script lang="ts">
  /*
    History surface — every play, every rewatch, paginated and
    sorted by watch date. Frames the page as a personal archive
    in the Letterboxd journal voice; the existing
    PersonalHistoryPaginatedList carries the rows.
  */
  import CalendarProvider from "$lib/features/calendar/CalendarProvider.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import PersonalHistoryPaginatedList from "$lib/sections/lists/history/PersonalHistoryPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { mode } = useDiscover();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_history()}
>
  <TraktPageCoverSetter />
  <NavbarStateSetter hasFilters />

  <div class="lb-hist-page">
    <header class="lb-hist-hero">
      <p class="lb-hist-eyebrow">{m.lb_history_eyebrow()}</p>
      <h1 class="lb-hist-title">{m.list_title_history()}</h1>
      <p class="lb-hist-lede">{m.lb_history_lede()}</p>
    </header>

    <div class="lb-hist-frame">
      <CalendarProvider>
        <PersonalHistoryPaginatedList mode={$mode} />
      </CalendarProvider>
    </div>
  </div>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-hist-page {
    width: 100%;
    max-width: var(--ni-1280);
    margin-inline: auto;
    padding: var(--ni-22) var(--ni-16) var(--ni-44);
    box-sizing: border-box;

    @include for-tablet-lg {
      padding-inline: var(--ni-32);
    }
  }

  .lb-hist-hero {
    padding: var(--ni-22) 0 var(--ni-32);
  }

  .lb-hist-eyebrow {
    margin: 0 0 var(--ni-10) 0;
    font-size: var(--ni-11);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--tboxed-positive);
  }

  .lb-hist-title {
    margin: 0;
    font-family: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
    color: var(--color-foreground);
    font-size: var(--ni-44);

    @include for-tablet-sm {
      font-size: var(--ni-60);
    }
  }

  .lb-hist-lede {
    margin: var(--ni-12) 0 0 0;
    font-size: var(--ni-15);
    line-height: 1.5;
    color: var(--color-text-secondary);
    max-width: var(--ni-560);
  }

  .lb-hist-frame {
    border-top: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
    padding-top: var(--ni-22);
  }
</style>
