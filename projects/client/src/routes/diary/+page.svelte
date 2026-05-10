<script lang="ts">
  /*
    Diary surface — Letterboxd's signature editorial diary
    repurposed for trakt-boxed: a chronological feed of films and
    episodes the user has watched, with the page framed as a
    journal rather than a list. Fraunces Diary headline, today's
    date in green, then the existing DiaryList feed (which already
    renders Letterboxd-flavour calendar tile cards).
  */
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import DiaryList from "$lib/sections/diary/DiaryList.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { mode } = useDiscover();

  const todayLabel = (() => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
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
  title={m.page_title_diary()}
>
  <TraktPageCoverSetter />
  <NavbarStateSetter hasFilters />

  <div class="lb-diary-page">
    <header class="lb-diary-hero">
      <p class="lb-diary-eyebrow">
        <span class="lb-diary-date">{todayLabel}</span>
        <span class="lb-diary-divider" aria-hidden="true">·</span>
        <span>{m.lb_diary_eyebrow()}</span>
      </p>
      <h1 class="lb-diary-title">{m.page_title_diary()}</h1>
      <p class="lb-diary-lede">{m.lb_diary_lede()}</p>
    </header>

    <div class="lb-diary-feed">
      <DiaryList mode={$mode} />
    </div>
  </div>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-diary-page {
    width: 100%;
    max-width: var(--ni-1280);
    margin-inline: auto;
    padding: var(--ni-22) var(--ni-16) var(--ni-44);
    box-sizing: border-box;

    @include for-tablet-lg {
      padding-inline: var(--ni-32);
    }
  }

  .lb-diary-hero {
    padding: var(--ni-22) 0 var(--ni-32);

    @include for-tablet-lg {
      padding-block: var(--ni-44);
    }
  }

  .lb-diary-eyebrow {
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

  .lb-diary-date {
    color: var(--tboxed-positive);
  }

  .lb-diary-divider {
    color: color-mix(in srgb, var(--color-foreground) 25%, transparent);
  }

  .lb-diary-title {
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

    @include for-tablet-lg {
      font-size: var(--ni-80);
    }
  }

  .lb-diary-lede {
    margin: var(--ni-12) 0 0 0;
    font-size: var(--ni-15);
    line-height: 1.5;
    color: var(--color-text-secondary);
    max-width: var(--ni-560);
  }

  .lb-diary-feed {
    border-top: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
    padding-top: var(--ni-22);
  }
</style>
