<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanCount } from "$lib/utils/formatting/number/toHumanCount.ts";
  import PageHeading from "../PageHeading.svelte";
  import type { ProfileContext } from "../ProfileContext.ts";
  import WatchedGrid from "./WatchedGrid.svelte";

  const {
    context,
    type,
  }: { context: ProfileContext; type: "movie" | "show" } = $props();

  const count = $derived(
    type === "movie"
      ? context.stats?.movies.watched
      : context.stats?.shows.watched,
  );
  const headline = $derived.by(() => {
    if (!context.name || count == null) return "";

    const params = {
      name: context.name,
      count: toHumanCount(count, languageTag()),
    };
    return type === "movie"
      ? m.boxed_profile_watched_films(params)
      : m.boxed_profile_watched_shows(params);
  });
  const base = $derived(`/profile/${context.slug}`);
</script>

<PageHeading text={headline}>
  {#snippet actions()}
    <nav class="boxed-watched-switch" aria-label={m.boxed_profile_tabs_label()}>
      <a
        href={`${base}/films`}
        class:is-active={type === "movie"}
        aria-current={type === "movie" ? "page" : undefined}
      >
        {m.label_stats_movies()}
      </a>
      <a
        href={`${base}/shows`}
        class:is-active={type === "show"}
        aria-current={type === "show" ? "page" : undefined}
      >
        {m.label_stats_shows()}
      </a>
    </nav>
  {/snippet}
</PageHeading>

<WatchedGrid slug={context.slug} {type} isMe={context.isMe} />

<style>
  .boxed-watched-switch {
    display: inline-flex;
    gap: var(--ni-2);
    padding: var(--ni-4);
    border-radius: var(--border-radius-m);
    background: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);

    a {
      display: inline-flex;
      align-items: center;
      height: var(--ni-32);
      padding-inline: var(--ni-14);
      border-radius: var(--border-radius-s);
      font-size: var(--ni-14);
      font-weight: 600;
      text-decoration: none;
      color: var(--color-text-secondary);

      &.is-active {
        background: var(--color-card-background);
        box-shadow: 0 0 0 var(--border-thickness-xxs) var(--color-border);
        color: var(--color-text-primary);
      }
    }
  }
</style>
