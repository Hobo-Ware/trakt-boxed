<script lang="ts">
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import TrendIcon from "$lib/components/icons/TrendIcon.svelte";
  import WatchNowIcon from "$lib/components/icons/WatchNowIcon.svelte";
  import Logo from "$lib/components/logo/Logo.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import Footer from "$lib/sections/footer/Footer.svelte";
  import GetStartedButton from "$lib/sections/landing/components/GetStartedButton.svelte";
  import LoginButton from "$lib/sections/landing/components/LoginButton.svelte";
  import SpotlightBackdrop from "$lib/sections/landing/components/SpotlightBackdrop.svelte";
  import SpotlightStack from "$lib/sections/landing/components/SpotlightStack.svelte";
  import { useSpotlightItems } from "$lib/sections/landing/useSpotlightItems.ts";
  import { useSpotlightTick } from "$lib/sections/landing/useSpotlightTick.ts";
  import { useTrendingList } from "$lib/sections/lists/trending/useTrendingList.ts";
  import type { Component } from "svelte";
  import SectionHeader from "../components/SectionHeader.svelte";
  import PosterRow from "../poster/PosterRow.svelte";

  const { items } = useSpotlightItems();
  const { tick, step } = useSpotlightTick();
  const { list: trending, isLoading } = useTrendingList({
    type: "media",
    limit: 12,
  });

  const active = $derived(
    $items.length > 0
      ? (($tick % $items.length) + $items.length) % $items.length
      : 0,
  );

  type Feature = { key: string; icon: Component; title: string; text: string };

  const features: ReadonlyArray<Feature> = [
    {
      key: "diary",
      icon: ClockIcon,
      title: m.boxed_landing_feature_diary(),
      text: m.boxed_landing_feature_diary_text(),
    },
    {
      key: "episodes",
      icon: StarIcon,
      title: m.boxed_landing_feature_episodes(),
      text: m.boxed_landing_feature_episodes_text(),
    },
    {
      key: "up-next",
      icon: PlayIcon,
      title: m.boxed_landing_feature_up_next(),
      text: m.boxed_landing_feature_up_next_text(),
    },
    {
      key: "lists",
      icon: ListIcon,
      title: m.boxed_landing_feature_lists(),
      text: m.boxed_landing_feature_lists_text(),
    },
    {
      key: "stream",
      icon: WatchNowIcon,
      title: m.boxed_landing_feature_stream(),
      text: m.boxed_landing_feature_stream_text(),
    },
    {
      key: "year",
      icon: TrendIcon,
      title: m.boxed_landing_feature_year(),
      text: m.boxed_landing_feature_year_text(),
    },
  ];
</script>

<div class="boxed-landing">
  <section class="boxed-landing-hero">
    <SpotlightBackdrop items={$items} {active} />

    <header class="boxed-landing-nav">
      <span class="boxed-landing-logo" data-boot-target><Logo /></span>
      <LoginButton />
    </header>

    <div class="boxed-landing-hero-content">
      <div class="boxed-landing-copy">
        <span class="boxed-landing-chip">{m.text_landing_platforms()}</span>
        <h1>
          <span>{m.boxed_landing_title_1()}</span>
          <span>{m.boxed_landing_title_2()}</span>
          <span>{m.boxed_landing_title_3()}</span>
        </h1>
        <p>{m.boxed_landing_subtitle()}</p>
        <GetStartedButton />
      </div>
      <SpotlightStack items={$items} {active} onStep={step} />
    </div>
  </section>

  <div class="boxed-landing-body">
    <section>
      <SectionHeader title={m.list_title_trending()} />
      <PosterRow
        label={m.list_title_trending()}
        items={$isLoading ? null : $trending}
        emptyText={m.text_placeholder_generic()}
      />
    </section>

    <section class="boxed-landing-features">
      <h2>{m.boxed_landing_features_title()}</h2>
      <ul>
        {#each features as feature (feature.key)}
          <li>
            <span class="boxed-landing-feature-icon"><feature.icon /></span>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </li>
        {/each}
      </ul>
    </section>

    <section class="boxed-landing-import">
      <div>
        <h2>{m.boxed_landing_import_title()}</h2>
        <p>{m.boxed_landing_import_text()}</p>
      </div>
      <GetStartedButton />
    </section>
  </div>

  <Footer />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-landing {
    min-height: 100dvh;
    overflow-x: hidden;
    background: var(--color-background);
  }

  .boxed-landing-hero {
    position: relative;
    overflow: hidden;
    padding: 0 var(--layout-distance-side) var(--ni-64);

    @include for-mobile {
      padding-bottom: var(--ni-40);
    }
  }

  .boxed-landing-nav {
    position: relative;
    z-index: 1;
    max-width: var(--boxed-content-max-width);
    height: var(--ni-72);
    margin-inline: auto;

    display: flex;
    align-items: center;
    justify-content: space-between;

    :global(svg) {
      height: var(--ni-28);
      width: auto;
    }
  }

  .boxed-landing-hero-content {
    position: relative;
    z-index: 1;
    max-width: var(--boxed-content-max-width);
    min-height: min(var(--ni-640), 72dvh);
    margin-inline: auto;

    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    align-items: center;
    gap: var(--ni-40);

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
      min-height: 0;
    }
  }

  .boxed-landing-copy {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ni-20);

    h1 {
      margin: 0;
      display: flex;
      flex-direction: column;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-56);
      font-weight: 600;
      line-height: 1.08;
      letter-spacing: -0.015em;

      @include for-mobile {
        font-size: var(--ni-36);
      }

      span {
        font-size: inherit;
        font-weight: inherit;
      }
    }

    p {
      margin: 0;
      max-width: 34ch;
      font-size: var(--ni-18);
      color: color-mix(in srgb, var(--shade-10) 72%, transparent);
    }
  }

  .boxed-landing-chip {
    display: inline-flex;
    align-items: center;
    height: var(--ni-28);
    padding-inline: var(--ni-12);
    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--shade-10) 10%, transparent);
    font-size: var(--ni-12);
    font-weight: 600;
  }

  .boxed-landing-body {
    box-sizing: border-box;
    width: 100%;
    max-width: calc(
      var(--boxed-content-max-width) + 2 * var(--layout-distance-side)
    );
    margin-inline: auto;
    padding: var(--ni-40) var(--layout-distance-side) var(--ni-64);

    display: flex;
    flex-direction: column;
    gap: var(--ni-64);
  }

  .boxed-landing-features {
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);

    h2 {
      margin: 0;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-32);
      font-weight: 600;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;

      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--gap-l);

      @include for-tablet-sm-and-below {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      @include for-mobile {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    li {
      display: flex;
      flex-direction: column;
      gap: var(--ni-8);
      padding: var(--ni-20);
      border-radius: var(--border-radius-l);
      background: var(--color-card-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    }

    h3 {
      margin: 0;
      font-size: var(--ni-18);
      font-weight: 600;
    }

    p {
      margin: 0;
      font-size: var(--ni-14);
      line-height: 1.55;
      color: var(--color-text-secondary);
    }
  }

  .boxed-landing-feature-icon {
    width: var(--ni-40);
    height: var(--ni-40);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--purple-500) 22%, transparent);
    color: var(--purple-100);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .boxed-landing-import {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ni-24);
    padding: var(--ni-32);
    border-radius: var(--border-radius-l);
    background: color-mix(in srgb, var(--purple-500) 14%, var(--color-card-background));
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) color-mix(in srgb, var(--purple-400) 40%, transparent);

    @include for-mobile {
      flex-direction: column;
      align-items: flex-start;
      padding: var(--ni-24);
    }

    h2 {
      margin: 0 0 var(--ni-8);
      font-family: var(--boxed-font-title);
      font-size: var(--ni-28);
      font-weight: 600;
    }

    p {
      margin: 0;
      max-width: 52ch;
      color: var(--color-text-secondary);
    }
  }
</style>
