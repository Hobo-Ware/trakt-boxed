<script lang="ts">
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useSearch } from "$lib/features/search/useSearch.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import { useUpNextList } from "$lib/sections/lists/progress/useUpNextList.ts";
  import { toTranslatedType } from "$lib/utils/formatting/string/toTranslatedType.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import type { LogTarget } from "../LogTarget.ts";

  const { onPick }: { onPick: (target: LogTarget) => void } = $props();

  const RESULT_LIMIT = 8;

  const { search, clear, results, isSearching } = useSearch();
  const { list: upNext, isLoading: isLoadingUpNext } = useUpNextList({
    type: "show",
    limit: 1,
  });

  let term = $state("");

  $effect(() => {
    const query = term.trim();
    if (!query) {
      clear();
      return;
    }

    search(query, "media");
  });

  const mediaResults = $derived(
    $results?.type === "media" ? $results.items.slice(0, RESULT_LIMIT) : [],
  );

  const nextEpisode = $derived(
    $upNext.find((entry) => "show" in entry) ?? null,
  );

  const pickMedia = (media: MediaEntry) =>
    onPick(
      media.type === "movie"
        ? { type: "movie", media }
        : { type: "show", media },
    );
</script>

<div class="boxed-log-picker">
  <h2 class="boxed-log-picker-title">{m.boxed_log_picker_title()}</h2>

  <label class="boxed-log-search">
    <SearchIcon />
    <input
      type="search"
      placeholder={m.input_placeholder_search()}
      aria-label={m.input_placeholder_search()}
      bind:value={term}
      autocomplete="off"
    />
  </label>

  {#if !term.trim()}
    <section class="boxed-log-suggestion" aria-live="polite">
      <span class="boxed-log-picker-label">{m.boxed_log_up_next()}</span>
      {#if $isLoadingUpNext}
        <div class="boxed-log-row-skeleton"><Skeleton height="var(--ni-72)" /></div>
      {:else if nextEpisode && "show" in nextEpisode}
        <button
          type="button"
          class="boxed-log-result"
          onclick={() =>
            onPick({
              type: "show",
              media: nextEpisode.show,
              season: nextEpisode.season,
              episode: nextEpisode.number,
            })}
        >
          <span class="boxed-log-result-poster">
            <CrossOriginImage
              src={nextEpisode.show.poster.url.thumb}
              alt=""
            />
          </span>
          <span class="boxed-log-result-text">
            <span class="boxed-log-result-title">{nextEpisode.show.title}</span>
            <span class="boxed-log-result-meta">
              {episodeNumberLabel({
                seasonNumber: nextEpisode.season,
                episodeNumber: nextEpisode.number,
              })}
              {#if nextEpisode.title}· {nextEpisode.title}{/if}
            </span>
          </span>
        </button>
      {/if}
    </section>
  {:else}
    <ul class="boxed-log-results" aria-busy={$isSearching}>
      {#each mediaResults as media (media.key)}
        <li>
          <button
            type="button"
            class="boxed-log-result"
            onclick={() => pickMedia(media)}
          >
            <span class="boxed-log-result-poster">
              <CrossOriginImage src={media.poster.url.thumb} alt="" />
            </span>
            <span class="boxed-log-result-text">
              <span class="boxed-log-result-title">{media.title}</span>
              <span class="boxed-log-result-meta">
                {toTranslatedType(media.type)}
                {#if media.year}· {media.year}{/if}
              </span>
            </span>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .boxed-log-picker {
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
    min-height: var(--ni-380);
  }

  .boxed-log-picker-title {
    margin: 0;
    padding-inline-end: var(--ni-48);
    font-family: var(--boxed-font-title);
    font-size: var(--ni-28);
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .boxed-log-search {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    height: var(--ni-48);
    padding-inline: var(--ni-14);

    border-radius: var(--border-radius-m);
    background: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    color: var(--color-text-secondary);

    &:focus-within {
      box-shadow: inset 0 0 0 var(--border-thickness-xs) var(--purple-400);
    }

    input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      color: var(--color-text-primary);
      font: inherit;
      font-size: var(--ni-16);
    }
  }

  .boxed-log-picker-label {
    display: block;
    margin-bottom: var(--gap-xs);
    font-size: var(--ni-12);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .boxed-log-results {
    margin: 0;
    padding: 0;
    list-style: none;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }

  .boxed-log-row-skeleton {
    height: var(--ni-72);
  }

  .boxed-log-result {
    width: 100%;
    min-height: var(--ni-72);
    padding: var(--ni-6);

    display: flex;
    align-items: center;
    gap: var(--gap-m);

    border: none;
    border-radius: var(--border-radius-m);
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      background: var(--color-input-background);
    }
  }

  .boxed-log-result-poster {
    flex-shrink: 0;
    width: var(--ni-40);
    aspect-ratio: 2 / 3;
    border-radius: var(--border-radius-xs);
    overflow: hidden;
    background: var(--color-input-background);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .boxed-log-result-text {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    min-width: 0;
  }

  .boxed-log-result-title {
    font-family: var(--boxed-font-title);
    font-size: var(--ni-18);
    font-weight: 600;
    color: var(--color-text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .boxed-log-result-meta {
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }
</style>
