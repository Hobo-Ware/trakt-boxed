<script lang="ts">
  /*
    Social activity feed — what your network watched, rated,
    reviewed. Editorial Letterboxd hero, then the existing
    paginated activity list. Reads the activity stream eagerly so
    the CalendarProvider can pick the freshest day as initial.
  */
  import CalendarProvider from "$lib/features/calendar/CalendarProvider.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import { useActivityList } from "$lib/sections/lists/activity/_internal/useActivityList";
  import ActivityPaginatedList from "$lib/sections/lists/activity/ActivityPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { mode } = useDiscover();

  const { list, isLoading } = $derived(
    useActivityList({ type: $mode, limit: 1 }),
  );
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_social_activity()}
>
  <TraktPageCoverSetter />
  <NavbarStateSetter hasFilters />

  <div class="lb-act-page">
    <header class="lb-act-hero">
      <p class="lb-act-eyebrow">{m.lb_activity_eyebrow()}</p>
      <h1 class="lb-act-title">{m.list_title_social_activity()}</h1>
      <p class="lb-act-lede">{m.lb_activity_lede()}</p>
    </header>

    <div class="lb-act-frame">
      {#if !$isLoading}
        <CalendarProvider initialDate={$list.at(0)?.activityAt}>
          <ActivityPaginatedList />
        </CalendarProvider>
      {/if}
    </div>
  </div>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-act-page {
    width: 100%;
    max-width: var(--ni-1280);
    margin-inline: auto;
    padding: var(--ni-22) var(--ni-16) var(--ni-44);
    box-sizing: border-box;

    @include for-tablet-lg {
      padding-inline: var(--ni-32);
    }
  }

  .lb-act-hero {
    padding: var(--ni-22) 0 var(--ni-32);
  }

  .lb-act-eyebrow {
    margin: 0 0 var(--ni-10) 0;
    font-size: var(--ni-11);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--tboxed-positive);
  }

  .lb-act-title {
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

  .lb-act-lede {
    margin: var(--ni-12) 0 0 0;
    font-size: var(--ni-15);
    line-height: 1.5;
    color: var(--color-text-secondary);
    max-width: var(--ni-560);
  }

  .lb-act-frame {
    border-top: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
    padding-top: var(--ni-22);
  }
</style>
