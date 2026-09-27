<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Season } from "$lib/requests/models/Season.ts";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel.ts";
  import { toSeasonHref } from "$boxed/utils/toSeasonHref.ts";
  import { toOrderedSeasons } from "./toOrderedSeasons.ts";

  type SeasonSwitcherProps = {
    slug: string;
    seasons: ReadonlyArray<Season>;
    current: number;
  };

  const { slug, seasons, current }: SeasonSwitcherProps = $props();

  const ordered = $derived(toOrderedSeasons(seasons));
</script>

<nav class="boxed-season-switcher" aria-label={m.list_title_seasons()}>
  {#each ordered as season (season.id)}
    <a
      class="boxed-season-switch"
      class:is-wide={season.number === 0}
      href={toSeasonHref(slug, season.number)}
      aria-current={season.number === current ? "page" : undefined}
      aria-label={seasonLabel(season.number)}
    >
      {season.number === 0 ? m.text_season_specials() : season.number}
    </a>
  {/each}
</nav>

<style>
  .boxed-season-switcher {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-8);
  }

  .boxed-season-switch {
    box-sizing: border-box;
    min-width: var(--ni-32);
    height: var(--ni-32);
    padding: 0 var(--ni-10);

    display: inline-flex;
    align-items: center;
    justify-content: center;

    border-radius: var(--border-radius-xxl);
    background: var(--color-card-background);
    text-decoration: none;
    color: var(--color-text-primary);

    font-family: var(--boxed-font-mono);
    font-size: var(--ni-12);

    &.is-wide {
      font-family: inherit;
      padding: 0 var(--ni-14);
    }

    &:hover,
    &:focus-visible {
      color: var(--color-link-active);
    }

    &[aria-current="page"] {
      background: color-mix(in srgb, var(--purple-500) 20%, var(--color-card-background));
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--purple-500);
    }
  }
</style>
