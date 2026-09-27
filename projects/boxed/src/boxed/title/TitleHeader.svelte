<script lang="ts" generics="T extends string">
  import { page } from "$app/state";
  import ClampedText from "$lib/components/text/ClampedText.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";
  import { parseTitleTab } from "./_internal/parseTitleTab.ts";
  import TitleTabs from "./TitleTabs.svelte";

  type TitleTab = { id: T; label: string };

  type TitleHeaderProps = {
    title: string;
    year?: number | Nil;
    meta?: string;
    tagline?: string | Nil;
    overview: string;
    credit?: Snippet;
    tabs: ReadonlyArray<TitleTab>;
    panel: Snippet<[T]>;
  };

  const {
    title,
    year,
    meta,
    tagline,
    overview,
    credit,
    tabs,
    panel,
  }: TitleHeaderProps = $props();

  const TAB_PARAM = "tab";

  const activeTab = $derived(
    parseTitleTab({
      value: page.url.searchParams.get(TAB_PARAM),
      tabs: tabs.map((tab) => tab.id),
    }),
  );
</script>

<div class="boxed-title-identity">
  <h1 class="boxed-title-name">{title}</h1>
  <div class="boxed-title-byline">
    {#if year}
      <span class="boxed-title-year">{year}</span>
    {/if}
    {#if credit}
      <span class="boxed-title-credit">{@render credit()}</span>
    {/if}
    {#if meta}
      <span class="boxed-title-meta">{meta}</span>
    {/if}
  </div>
</div>

<div class="boxed-title-overview">
  {#if tagline}
    <p class="boxed-title-tagline">{tagline}</p>
  {/if}
  <ClampedText
    label={m.button_label_expand_media_overview({ title })}
    lineCount={4}
  >
    {overview}
  </ClampedText>
</div>

<div class="boxed-title-tabs">
  <TitleTabs {tabs} active={activeTab} param={TAB_PARAM} />
  <div class="boxed-title-tabpanel" role="tabpanel">
    {#if activeTab}
      {@render panel(activeTab)}
    {/if}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-title-identity {
    grid-area: identity;
    padding-top: var(--ni-40);

    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
    min-width: 0;
  }

  .boxed-title-name {
    margin: 0;

    font-family: var(--boxed-font-title);
    font-weight: 600;
    font-size: var(--ni-52);
    line-height: 1.05;
    letter-spacing: -0.01em;
    color: var(--color-text-primary);
    overflow-wrap: anywhere;
  }

  .boxed-title-byline {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: var(--ni-10);
    row-gap: var(--ni-4);

    font-size: var(--ni-16);
    color: var(--color-text-secondary);

    :global(a) {
      color: var(--color-text-primary);
      text-decoration: none;

      &:hover,
      &:focus-visible {
        color: var(--color-link-active);
      }
    }
  }

  .boxed-title-year {
    color: var(--color-text-primary);
  }

  .boxed-title-meta {
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .boxed-title-overview {
    grid-area: overview;

    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
    min-width: 0;

    font-size: var(--ni-16);
    color: var(--color-text-primary);

    :global(.line-clamp-content) {
      margin: 0;
      line-height: 1.6;
    }
  }

  .boxed-title-tagline {
    margin: 0;

    font-size: var(--ni-12);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .boxed-title-tabs {
    grid-area: tabs;

    display: flex;
    flex-direction: column;
    gap: var(--ni-14);
    min-width: 0;
  }

  @include for-tablet-lg-and-below {
    .boxed-title-identity {
      padding-top: 0;
      align-self: end;
      gap: var(--ni-6);
    }

    .boxed-title-name {
      font-size: var(--ni-32);
    }

    .boxed-title-byline {
      font-size: var(--ni-14);
    }

    .boxed-title-overview {
      font-size: var(--ni-14);
    }

    .boxed-title-tabs {
      gap: var(--ni-12);
    }
  }
</style>
