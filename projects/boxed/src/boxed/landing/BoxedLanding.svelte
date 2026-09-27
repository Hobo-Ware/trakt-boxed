<script lang="ts">
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import RatingsIcon from "$lib/components/icons/RatingsIcon.svelte";
  import WatchNowIcon from "$lib/components/icons/WatchNowIcon.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import Footer from "$lib/sections/footer/Footer.svelte";
  import { useTrendingList } from "$lib/sections/lists/trending/useTrendingList.ts";
  import type { Component } from "svelte";
  import BoxedLogo from "../brand/BoxedLogo.svelte";
  import SectionHeader from "../components/SectionHeader.svelte";
  import PosterRow from "../poster/PosterRow.svelte";
  import EpisodeStrip from "./_internal/EpisodeStrip.svelte";
  import PosterWall from "./_internal/PosterWall.svelte";

  const TRENDING_COUNT = 40;
  const ROW_COUNT = 12;

  const { login } = useAuth();
  const { list: trending, isLoading } = useTrendingList({
    type: "media",
    limit: TRENDING_COUNT,
  });

  const titles = $derived($isLoading ? null : $trending);
  const posters = $derived(
    titles?.map((media) => media.poster.url.medium) ?? null,
  );
  const movies = $derived(
    titles?.filter((media) => media.type === "movie").slice(0, ROW_COUNT) ??
      null,
  );
  const shows = $derived(
    titles?.filter((media) => media.type === "show").slice(0, ROW_COUNT) ??
      null,
  );

  type Box = { key: string; state: string; title: string; text: string };

  const boxes: ReadonlyArray<Box> = [
    {
      key: "watched",
      state: "watched",
      title: m.tag_text_watched(),
      text: m.boxed_landing_box_watched_text(),
    },
    {
      key: "reviewed",
      state: "reviewed",
      title: m.boxed_landing_box_reviewed(),
      text: m.boxed_landing_box_reviewed_text(),
    },
    {
      key: "watchlist",
      state: "watchlist",
      title: m.list_title_watchlist(),
      text: m.boxed_landing_box_watchlist_text(),
    },
  ];

  type Feature = { key: string; icon: Component; title: string; text: string };

  const features: ReadonlyArray<Feature> = [
    {
      key: "diary",
      icon: ClockIcon,
      title: m.boxed_landing_feature_diary(),
      text: m.boxed_landing_feature_diary_text(),
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
      icon: RatingsIcon,
      title: m.boxed_landing_feature_year(),
      text: m.boxed_landing_feature_year_text(),
    },
  ];
</script>

{#snippet actions()}
  <div class="boxed-landing-actions">
    <button type="button" class="is-primary" onclick={login}>
      {m.button_text_get_started()}
    </button>
    <button type="button" class="is-secondary" onclick={login}>
      {m.button_text_login()}
    </button>
  </div>
{/snippet}

<div class="boxed-landing">
  <section class="boxed-landing-hero">
    <PosterWall {posters} />
    <div class="boxed-landing-scrim"></div>

    <header class="boxed-landing-nav">
      <span class="boxed-landing-logo" data-boot-target><BoxedLogo /></span>
      <button type="button" class="boxed-landing-signin" onclick={login}>
        {m.button_text_login()}
      </button>
    </header>

    <div class="boxed-landing-hero-copy">
      <h1>
        <span>{m.boxed_landing_title_1()}</span>
        <span>{m.boxed_landing_title_2()}</span>
        <span>{m.boxed_landing_title_3()}</span>
      </h1>
      <p>{m.boxed_landing_subtitle()}</p>
      {@render actions()}
    </div>
  </section>

  <div class="boxed-landing-body">
    <section class="boxed-landing-boxes">
      <h2>{m.boxed_landing_boxes_title()}</h2>
      <ul>
        {#each boxes as box, index (box.key)}
          <li data-state={box.state}>
            <span class="boxed-landing-box-poster">
              {#if posters?.at(index)}
                <CrossOriginImage src={posters.at(index) ?? ""} alt="" />
              {/if}
            </span>
            <span class="boxed-landing-box-text">
              <span class="boxed-landing-box-swatch"></span>
              <h3>{box.title}</h3>
              <p>{box.text}</p>
            </span>
          </li>
        {/each}
      </ul>
    </section>

    <section class="boxed-landing-shows">
      <div class="boxed-landing-shows-copy">
        <h2>{m.boxed_landing_shows_title()}</h2>
        <p>{m.boxed_landing_shows_text()}</p>
        <ul>
          <li>
            <strong>{m.boxed_landing_feature_episodes()}</strong>
            <span>{m.boxed_landing_feature_episodes_text()}</span>
          </li>
          <li>
            <strong>{m.boxed_landing_feature_up_next()}</strong>
            <span>{m.boxed_landing_feature_up_next_text()}</span>
          </li>
        </ul>
      </div>
      <EpisodeStrip />
    </section>

    <section>
      <SectionHeader title={m.list_title_trending_movies()} />
      <PosterRow
        label={m.list_title_trending_movies()}
        items={movies}
        emptyText={m.text_placeholder_generic()}
      />
    </section>

    <section>
      <SectionHeader title={m.list_title_trending_shows()} />
      <PosterRow
        label={m.list_title_trending_shows()}
        items={shows}
        emptyText={m.text_placeholder_generic()}
      />
    </section>

    <section class="boxed-landing-features">
      <h2>{m.boxed_landing_more_title()}</h2>
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
      {@render actions()}
    </section>
  </div>

  <Footer />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-landing {
    min-height: 100dvh;
    background: var(--color-background);
    color: var(--color-text-primary);

    h1,
    h2,
    h3,
    p {
      margin: 0;
    }

    h2 {
      font-family: var(--boxed-font-title);
      font-size: var(--ni-40);
      font-weight: 600;
      line-height: 1.15;
      letter-spacing: -0.01em;

      @include for-mobile {
        font-size: var(--ni-28);
      }
    }
  }

  .boxed-landing-hero {
    position: relative;
    height: clamp(var(--ni-520), 88dvh, var(--ni-768));
    overflow: hidden;
    isolation: isolate;
    display: flex;
    flex-direction: column;
  }

  .boxed-landing-scrim {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        to bottom,
        color-mix(in srgb, var(--color-background) 70%, transparent) 0%,
        color-mix(in srgb, var(--color-background) 35%, transparent) 30%,
        color-mix(in srgb, var(--color-background) 75%, transparent) 65%,
        var(--color-background) 100%
      ),
      radial-gradient(
        120% 90% at 50% 100%,
        color-mix(in srgb, var(--purple-500) 22%, transparent),
        transparent 60%
      );
  }

  .boxed-landing-nav {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    max-width: calc(
      var(--boxed-content-max-width) + 2 * var(--layout-distance-side)
    );
    margin-inline: auto;
    padding: var(--ni-20) var(--layout-distance-side);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .boxed-landing-logo {
    --boxed-logo-size: var(--ni-28);

    display: flex;
  }

  .boxed-landing-signin {
    height: var(--ni-40);
    padding-inline: var(--ni-18);
    border: none;
    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--color-card-background) 80%, transparent);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    backdrop-filter: blur(var(--ni-8));
    color: var(--color-text-primary);
    font: inherit;
    font-size: var(--ni-14);
    font-weight: 600;
    cursor: pointer;
  }

  .boxed-landing-hero-copy {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    max-width: calc(
      var(--boxed-content-max-width) + 2 * var(--layout-distance-side)
    );
    margin: auto auto var(--ni-64);
    padding-inline: var(--layout-distance-side);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-20);
    text-align: center;

    h1 {
      display: flex;
      flex-direction: column;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-64);
      font-weight: 600;
      line-height: 1.08;
      letter-spacing: -0.015em;
      text-wrap: balance;

      span {
        font-size: inherit;
      }

      @include for-tablet-sm-and-below {
        font-size: var(--ni-40);
      }

      @include for-mobile {
        font-size: var(--ni-32);
      }
    }

    p {
      max-width: 52ch;
      font-size: var(--ni-18);
      line-height: 1.5;
      color: var(--color-text-secondary);

      @include for-mobile {
        font-size: var(--ni-16);
      }
    }
  }

  .boxed-landing-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--ni-12);

    button {
      height: var(--ni-48);
      padding-inline: var(--ni-28);
      border: none;
      border-radius: var(--border-radius-m);
      font: inherit;
      font-size: var(--ni-16);
      font-weight: 600;
      cursor: pointer;
    }

    .is-primary {
      background: var(--purple-500);
      color: var(--shade-10);
    }

    .is-secondary {
      background: var(--color-card-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
      color: var(--color-text-primary);
    }
  }

  .boxed-landing-body {
    box-sizing: border-box;
    max-width: calc(
      var(--boxed-content-max-width) + 2 * var(--layout-distance-side)
    );
    margin-inline: auto;
    padding: var(--ni-24) var(--layout-distance-side) var(--ni-80);
    display: flex;
    flex-direction: column;
    gap: var(--ni-80);

    @include for-mobile {
      gap: var(--ni-56);
    }
  }

  .boxed-landing-boxes {
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);

    h2 {
      text-align: center;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--ni-24);

      @include for-tablet-sm-and-below {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    li {
      --box-color: var(--boxed-color-watched);

      padding: var(--ni-20);
      display: flex;
      gap: var(--ni-20);
      border-radius: var(--border-radius-l);
      background: var(--color-card-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);

      &[data-state="reviewed"] {
        --box-color: var(--purple-500);
      }

      &[data-state="watchlist"] {
        --box-color: var(--boxed-color-watchlist);
      }
    }
  }

  .boxed-landing-box-poster {
    flex: 0 0 var(--ni-96);
    aspect-ratio: 2 / 3;
    align-self: flex-start;
    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: var(--color-input-background);
    box-shadow: 0 0 0 var(--border-thickness-xs) var(--box-color);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .boxed-landing-box-text {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    h3 {
      font-family: var(--boxed-font-title);
      font-size: var(--ni-24);
      font-weight: 600;
    }

    p {
      font-size: var(--ni-14);
      line-height: 1.6;
      color: var(--color-text-secondary);
    }
  }

  .boxed-landing-box-swatch {
    width: var(--ni-24);
    height: var(--ni-24);
    border-radius: var(--border-radius-s);
    background: var(--box-color);
  }

  .boxed-landing-shows {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    gap: var(--ni-48);

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ni-28);
    }
  }

  .boxed-landing-shows-copy {
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);

    > p {
      font-size: var(--ni-18);
      line-height: 1.5;
      color: var(--color-text-secondary);
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: var(--ni-14);
    }

    li {
      padding-inline-start: var(--ni-16);
      display: flex;
      flex-direction: column;
      gap: var(--ni-4);
      border-inline-start: var(--border-thickness-xs) solid var(--purple-500);

      strong {
        font-size: var(--ni-16);
      }

      span {
        font-size: var(--ni-14);
        line-height: 1.6;
        color: var(--color-text-secondary);
      }
    }
  }

  .boxed-landing-features {
    display: flex;
    flex-direction: column;
    gap: var(--ni-28);

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: var(--ni-24);

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

      h3 {
        font-size: var(--ni-16);
        font-weight: 600;
      }

      p {
        font-size: var(--ni-14);
        line-height: 1.6;
        color: var(--color-text-secondary);
      }
    }
  }

  .boxed-landing-feature-icon {
    width: var(--ni-40);
    height: var(--ni-40);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-m);
    background: var(--boxed-color-accent-soft);
    color: var(--boxed-color-accent-text);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .boxed-landing-import {
    padding: var(--ni-32);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ni-24);
    border-radius: var(--border-radius-l);
    background: var(--boxed-color-accent-soft);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--purple-500) 40%, transparent);

    > div {
      display: flex;
      flex-direction: column;
      gap: var(--ni-8);
    }

    h2 {
      font-size: var(--ni-28);
    }

    p {
      max-width: 60ch;
      font-size: var(--ni-16);
      line-height: 1.5;
      color: var(--color-text-secondary);
    }

    @include for-tablet-sm-and-below {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
