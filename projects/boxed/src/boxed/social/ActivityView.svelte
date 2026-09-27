<script lang="ts">
  import { page } from "$app/state";
  import FollowingFaces from "$boxed/profile/sections/FollowingFaces.svelte";
  import SectionHeader from "$boxed/components/SectionHeader.svelte";
  import { useProfileStats } from "$boxed/profile/useProfileStats.ts";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanCount } from "$lib/utils/formatting/number/toHumanCount.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { ActivityEvent } from "./ActivityEvent.ts";
  import FriendsFeed from "./FriendsFeed.svelte";
  import YouFeed from "./YouFeed.svelte";
  import {
    type ActivityTab,
    parseActivityTab,
  } from "./_internal/parseActivityTab.ts";

  const { stats } = useProfileStats(fromRune(() => "me"));

  const active = $derived(parseActivityTab(page.url.searchParams.get("tab")));
  const following = $derived($stats?.network.following);

  let showMovies = $state(true);
  let showEpisodes = $state(true);

  const filter = $derived((event: ActivityEvent) =>
    event.type === "movie" ? showMovies : showEpisodes
  );

  const tabs: ReadonlyArray<{ id: ActivityTab; label: () => string }> = [
    { id: "friends", label: m.boxed_activity_tab_friends },
    { id: "you", label: m.boxed_activity_tab_you },
  ];

  const hrefFor = (tab: ActivityTab) => {
    const url = new URL(page.url);
    url.searchParams.set("tab", tab);
    return `${url.pathname}${url.search}`;
  };
</script>

<div class="boxed-activity">
  <header class="activity-head">
    <div class="activity-head-main">
      <h1>{m.list_title_activity()}</h1>
      <nav aria-label={m.list_title_activity()}>
        {#each tabs as tab (tab.id)}
          <a
            href={hrefFor(tab.id)}
            class:is-active={tab.id === active}
            aria-current={tab.id === active ? "page" : undefined}
            data-sveltekit-replacestate
            data-sveltekit-noscroll
          >
            {tab.label()}
          </a>
        {/each}
      </nav>
    </div>
    <span class="activity-subtitle">
      {#if active === "friends" && following != null}
        {m.boxed_activity_following_count({
          count: toHumanCount(following, languageTag()),
        })}
      {/if}
    </span>
  </header>

  <div class="activity-layout">
    <div class="activity-main">
      {#key active}
        {#if active === "you"}
          <YouFeed {filter} />
        {:else}
          <FriendsFeed {filter} />
        {/if}
      {/key}
    </div>

    <aside class="activity-aside">
      <fieldset class="activity-filter">
        <legend>{m.boxed_activity_filter_title()}</legend>
        <label>
          <input type="checkbox" bind:checked={showMovies} />
          {m.label_stats_movies()}
        </label>
        <label>
          <input type="checkbox" bind:checked={showEpisodes} />
          {m.label_stats_episodes()}
        </label>
      </fieldset>

      <section>
        <SectionHeader
          title={m.text_following()}
          href={UrlBuilder.profile.social("me")}
        />
        <FollowingFaces slug="me" />
      </section>
    </aside>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-activity {
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);
  }

  .activity-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--ni-24);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);

    h1 {
      margin: 0;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-44);
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: -0.01em;

      @include for-mobile {
        font-size: var(--ni-32);
      }
    }

    nav {
      display: flex;
      gap: var(--ni-28);
    }

    nav a {
      padding-bottom: var(--ni-12);
      margin-bottom: calc(-1 * var(--border-thickness-xxs));
      border-bottom: var(--border-thickness-xs) solid transparent;

      font-size: var(--ni-14);
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-decoration: none;
      color: var(--color-text-secondary);

      &:hover,
      &:focus-visible {
        color: var(--color-text-primary);
      }

      &.is-active {
        border-bottom-color: var(--purple-500);
        color: var(--color-text-primary);
      }
    }
  }

  .activity-head-main {
    display: flex;
    flex-direction: column;
    gap: var(--ni-14);
  }

  .activity-subtitle {
    min-height: var(--ni-16);
    padding-bottom: var(--ni-12);
    font-size: var(--ni-14);
    color: var(--color-text-secondary);

    @include for-mobile {
      display: none;
    }
  }

  .activity-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--ni-320);
    gap: var(--ni-56);
    align-items: start;

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .activity-main {
    min-width: 0;
  }

  .activity-aside {
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);

    @include for-tablet-sm-and-below {
      display: none;
    }
  }

  .activity-filter {
    margin: 0;
    padding: 0;
    border: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-10);

    legend {
      width: 100%;
      margin-bottom: var(--ni-10);
      padding: 0 0 var(--ni-10);
      border-bottom: var(--border-thickness-xxs) solid var(--color-border);

      font-size: var(--ni-12);
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    label {
      display: flex;
      align-items: center;
      gap: var(--ni-10);
      font-size: var(--ni-14);
      cursor: pointer;
    }

    input {
      width: var(--ni-16);
      height: var(--ni-16);
      margin: 0;
      accent-color: var(--purple-500);
    }
  }
</style>
