<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanCount } from "$lib/utils/formatting/number/toHumanCount.ts";
  import ModeSwitch from "../../browse/ModeSwitch.svelte";
  import PageHeading from "../PageHeading.svelte";
  import ProfileNotice from "../ProfileNotice.svelte";
  import type { ProfileContext } from "../ProfileContext.ts";
  import {
    parseWatchlistSort,
    WATCHLIST_SORTS,
    type WatchlistSort,
  } from "../_internal/parseWatchlistSort.ts";
  import { toWatchlistCounts } from "../_internal/toWatchlistCounts.ts";
  import WatchlistGrid from "./WatchlistGrid.svelte";

  const { context }: { context: ProfileContext } = $props();

  const { watchlist } = useUser();
  const { mode } = useDiscover();

  const counts = $derived(toWatchlistCounts($watchlist));
  const headline = $derived(
    counts && context.name
      ? m.boxed_profile_watchlist_headline({
        name: context.name,
        movies: toHumanCount(counts.movies, languageTag()),
        shows: toHumanCount(counts.shows, languageTag()),
      })
      : "",
  );
  const sortBy = $derived(parseWatchlistSort(page.url.searchParams.get("sort")));

  const SORT_LABELS: Record<WatchlistSort, () => string> = {
    added: m.button_text_sort_added_date,
    released: m.button_text_sort_release_date,
    title: m.button_text_sort_title,
    runtime: m.button_text_sort_runtime,
    rank: m.button_text_sort_rank,
  };

  const chooseSort = (value: string) => {
    const url = new URL(page.url);
    url.searchParams.set("sort", value);
    goto(url, { replaceState: true, noScroll: true, keepFocus: true });
  };
</script>

{#if !context.isMe}
  <ProfileNotice text={m.boxed_profile_owner_only({ name: context.name })} />
{:else}
  <PageHeading text={headline} />

  <div class="boxed-watchlist-controls">
    <ModeSwitch />
    <label class="watchlist-sort">
      <span>{m.drawer_title_sort()}</span>
      <select
        value={sortBy}
        onchange={(event) => chooseSort(event.currentTarget.value)}
      >
        {#each WATCHLIST_SORTS as sort (sort)}
          <option value={sort}>{SORT_LABELS[sort]()}</option>
        {/each}
      </select>
    </label>
  </div>

  {#key `${$mode}:${sortBy}`}
    <WatchlistGrid type={$mode} {sortBy} />
  {/key}
{/if}

<style>
  .boxed-watchlist-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--gap-m);
  }

  .watchlist-sort {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
    font-size: var(--ni-12);
    color: var(--color-text-secondary);

    select {
      height: var(--ni-36);
      padding-inline: var(--ni-12);
      border: none;
      border-radius: var(--border-radius-m);
      background: var(--color-input-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
      color: var(--color-text-primary);
      font: inherit;
      font-size: var(--ni-14);
    }
  }
</style>
