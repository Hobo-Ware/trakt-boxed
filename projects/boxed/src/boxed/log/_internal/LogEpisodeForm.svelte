<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import { useActionToast } from "$lib/features/action-toast/useActionToast.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import type { MarkAsWatchedAt } from "$lib/models/MarkAsWatchedAt.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import { showSeasonsQuery } from "$lib/requests/queries/shows/showSeasonsQuery.ts";
  import { useSeasonEpisodes } from "$lib/sections/lists/stores/useSeasonEpisodes.ts";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched.ts";
  import { usePostComment } from "$lib/sections/summary/components/comments/usePostComment.ts";
  import { useRatings } from "$lib/sections/summary/components/rating/useRatings.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { map } from "rxjs";
  import { untrack } from "svelte";
  import LogEpisodeRatingRow from "./LogEpisodeRatingRow.svelte";
  import LogField from "./LogField.svelte";
  import RatingScrub from "../../components/RatingScrub.svelte";
  import LogWatchDate from "./LogWatchDate.svelte";
  import { MIN_REVIEW_WORDS, isReviewTooShort } from "./planLog.ts";
  import { countWords } from "./countWords.ts";
  import { pickDefaultEpisode } from "./pickDefaultEpisode.ts";
  import { pickDefaultSeason } from "./pickDefaultSeason.ts";

  type LogEpisodeFormProps = {
    target: { media: MediaEntry; season?: number; episode?: number };
    onDone: () => void;
  };

  const { target, onDone }: LogEpisodeFormProps = $props();
  const show = $derived(target.media);

  const { history } = useUser();
  const slug$ = fromRune(() => target.media.slug);
  const seasons = useQuery(
    slug$.pipe(map((slug) => showSeasonsQuery({ slug }))),
  ).pipe(
    map(($query) => ($query.data ?? []).filter((season) => season.number > 0)),
  );

  let seasonNumber = $state(untrack(() => target.season ?? 1));
  let hasPickedSeason = $state(untrack(() => target.season !== undefined));
  let selected = $state(new Set<number>());
  let hasSeededSelection = $state(false);
  let watchedAt: MarkAsWatchedAt = $state("now");
  let ratingMode: "all" | "each" = $state("all");
  let sharedRating: number | null = $state(null);
  let episodeRatings = $state(new Map<number, number | null>());
  let seasonRating: number | null = $state(null);
  let isSeasonRatingOpen = $state(false);
  let review = $state("");
  let isSpoiler = $state(true);
  let isSaving = $state(false);
  let hasSaveFailed = $state(false);

  const { list: episodes, isLoading: isLoadingEpisodes } = $derived(
    useSeasonEpisodes(target.media.slug, seasonNumber),
  );

  const watchedIds = $derived(
    new Set(
      ($history?.shows.get(show.id)?.episodes ?? []).map(
        (episode) => episode.episodeId,
      ),
    ),
  );

  const watchedNumbers = $derived(
    new Set(
      $episodes
        .filter((episode) => watchedIds.has(episode.id))
        .map((episode) => episode.number),
    ),
  );

  $effect(() => {
    if (hasPickedSeason || $seasons.length === 0 || $history === null) return;

    hasPickedSeason = true;
    const next = pickDefaultSeason({
      seasons: $seasons.map((season) => ({
        number: season.number,
        aired: season.episodes.aired,
      })),
      playsPerSeason: $history?.shows.get(show.id)?.playsPerSeason ?? new Map(),
    });
    if (next !== null && next !== seasonNumber) selectSeason(next);
  });

  $effect(() => {
    if (
      !hasPickedSeason ||
      hasSeededSelection ||
      $isLoadingEpisodes ||
      $episodes.length === 0
    ) {
      return;
    }

    hasSeededSelection = true;
    const now = Date.now();
    const first = pickDefaultEpisode({
      episodeNumbers: $episodes.map((episode) => episode.number),
      watchedNumbers,
      airedNumbers: new Set(
        $episodes
          .filter((episode) => episode.effectiveReleaseDate.getTime() <= now)
          .map((episode) => episode.number),
      ),
      preferred: seasonNumber === target.season ? target.episode : undefined,
    });
    selected = new Set(first === null ? [] : [first]);
  });

  const selectedEpisodes: EpisodeEntry[] = $derived(
    $episodes.filter((episode) => selected.has(episode.number)),
  );
  const reviewTarget = $derived(selectedEpisodes.at(-1));
  const season = $derived($seasons.find((s) => s.number === seasonNumber));

  const { markAsWatched } = $derived(
    useMarkAsWatched({
      type: "episode",
      media: selectedEpisodes,
      show: { id: show.id, title: show.title },
      isToastEnabled: false,
    }),
  );
  const seasonRatings = $derived(
    season ? useRatings({ type: "season", id: season.id }) : null,
  );
  const { postComment } = usePostComment();
  const { notify } = useActionToast();

  const ratingSubmitters = new Map<number, () => Promise<void>>();
  const registerRating = (key: number, submit: () => Promise<void>) => {
    ratingSubmitters.set(key, submit);
    return () => ratingSubmitters.delete(key);
  };

  const reviewTooShort = $derived(isReviewTooShort(review));

  const selectSeason = (value: number) => {
    seasonNumber = value;
    selected = new Set();
    hasSeededSelection = false;
  };

  const toggleEpisode = (number: number) => {
    const next = new Set(selected);
    if (next.has(number)) next.delete(number);
    else next.add(number);
    selected = next;
  };

  const ratingFor = (episode: EpisodeEntry) =>
    ratingMode === "all"
      ? sharedRating
      : (episodeRatings.get(episode.id) ?? null);

  const setEpisodeRating = (episode: EpisodeEntry, rating: number | null) => {
    const next = new Map(episodeRatings);
    next.set(episode.id, rating);
    episodeRatings = next;
  };

  const save = async () => {
    if (isSaving || reviewTooShort || selectedEpisodes.length === 0) return;

    isSaving = true;
    hasSaveFailed = false;
    try {
      await markAsWatched(watchedAt);
      for (const submit of ratingSubmitters.values()) {
        await submit();
      }
      if (seasonRating !== null) await seasonRatings?.submitRating(seasonRating);

      const text = review.trim();
      if (reviewTarget && countWords(text) >= MIN_REVIEW_WORDS) {
        await postComment({
          commentType: "post",
          type: "episode",
          media: show,
          season: reviewTarget.season,
          episode: reviewTarget.number,
          id: reviewTarget.id,
          comment: text,
          isSpoiler,
          gif: null,
        });
      }

      notify({ message: m.boxed_log_saved() });
      onDone();
    } catch {
      hasSaveFailed = true;
    } finally {
      isSaving = false;
    }
  };
</script>

<form
  class="boxed-log-form"
  onsubmit={(event) => {
    event.preventDefault();
    save();
  }}
>
  <div class="boxed-log-poster">
    <CrossOriginImage
      src={show.poster.url.medium}
      alt={m.image_alt_media_poster({ title: show.title })}
      loading="eager"
    />
  </div>

  <div class="boxed-log-body">
    <header class="boxed-log-header">
      <span class="boxed-log-eyebrow">{m.boxed_log_eyebrow()}</span>
      <h2 class="boxed-log-title">{show.title}</h2>
    </header>

    <div class="boxed-log-row">
      <label class="boxed-episode-season">
        <span class="boxed-episode-season-label">{m.text_season_number({ number: seasonNumber })}</span>
        <select
          value={seasonNumber}
          onchange={(event) => selectSeason(Number(event.currentTarget.value))}
        >
          {#each $seasons as option (option.id)}
            <option value={option.number}>
              {m.text_season_number({ number: option.number })}
            </option>
          {/each}
        </select>
      </label>
      <span class="boxed-log-hint">
        {selectedEpisodes.length === 1
          ? m.boxed_log_episode_count_one()
          : m.text_streaming_count_episodes({ count: selectedEpisodes.length })}
      </span>
    </div>

    <fieldset class="boxed-episode-picker">
      <legend class="boxed-log-hint">{m.boxed_log_select_episodes()}</legend>
      <div class="boxed-episode-chips">
        {#if $isLoadingEpisodes || !hasPickedSeason}
          {#each { length: season?.episodes.count ?? 10 }, index (index)}
            <span class="boxed-episode-chip is-skeleton" aria-hidden="true"></span>
          {/each}
        {:else}
          {#each $episodes as episode (episode.id)}
            {@const isWatched = watchedNumbers.has(episode.number)}
            <button
              type="button"
              class="boxed-episode-chip"
              class:is-selected={selected.has(episode.number)}
              class:is-watched={isWatched}
              aria-pressed={selected.has(episode.number)}
              aria-label={episodeNumberLabel({
                seasonNumber: episode.season,
                episodeNumber: episode.number,
              })}
              onclick={() => toggleEpisode(episode.number)}
            >
              {#if isWatched && !selected.has(episode.number)}
                <CheckIcon />
              {:else}
                {episode.number}
              {/if}
            </button>
          {/each}
        {/if}
      </div>
    </fieldset>

    <LogWatchDate value={watchedAt} onChange={(at) => (watchedAt = at)} />

    <div class="boxed-log-grid">
      <div class="boxed-log-side">
        <div class="boxed-episode-rating-mode" role="radiogroup">
          <button
            type="button"
            role="radio"
            aria-checked={ratingMode === "all"}
            class:is-active={ratingMode === "all"}
            onclick={() => (ratingMode = "all")}
          >
            {m.boxed_log_rate_all()}
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={ratingMode === "each"}
            class:is-active={ratingMode === "each"}
            onclick={() => (ratingMode = "each")}
          >
            {m.boxed_log_rate_each()}
          </button>
        </div>

        {#if ratingMode === "all"}
          <RatingScrub
            rating={sharedRating}
            onChange={(rating) => (sharedRating = rating)}
          />
        {/if}

        {#each selectedEpisodes as episode (episode.id)}
          <LogEpisodeRatingRow
            {episode}
            rating={ratingFor(episode)}
            isVisible={ratingMode === "each"}
            onChange={(rating) => setEpisodeRating(episode, rating)}
            register={registerRating}
          />
        {/each}

        {#if isSeasonRatingOpen && season}
          <RatingScrub
            label={m.boxed_log_rate_season({ number: season.number })}
            rating={seasonRating}
            onChange={(rating) => (seasonRating = rating)}
          />
        {:else}
          <button
            type="button"
            class="boxed-log-secondary"
            disabled={!season}
            onclick={() => (isSeasonRatingOpen = true)}
          >
            {m.boxed_log_rate_season({ number: seasonNumber })}
          </button>
        {/if}
      </div>

      <LogField
        label={reviewTarget
          ? `${m.boxed_log_review_label()} · ${episodeNumberLabel({ seasonNumber: reviewTarget.season, episodeNumber: reviewTarget.number })}`
          : m.boxed_log_review_label()}
        forId="boxed-log-episode-review"
      >
        <textarea
          id="boxed-log-episode-review"
          rows="5"
          placeholder={m.boxed_log_review_placeholder()}
          bind:value={review}
          aria-invalid={reviewTooShort}
          disabled={!reviewTarget}
        ></textarea>
        <div class="boxed-log-review-foot">
          <label class="boxed-log-check">
            <input type="checkbox" bind:checked={isSpoiler} />
            <span>{m.boxed_log_contains_spoilers()}</span>
          </label>
          <span class="boxed-log-hint" class:is-error={reviewTooShort}>
            {#if reviewTooShort}{m.boxed_log_review_too_short()}{/if}
          </span>
        </div>
      </LogField>
    </div>

    {#if hasSaveFailed}
      <p class="boxed-log-error" role="alert">{m.boxed_log_save_failed()}</p>
    {/if}

    <footer class="boxed-log-footer">
      <button type="button" class="boxed-log-secondary" onclick={onDone}>
        {m.button_text_cancel()}
      </button>
      <button
        type="submit"
        class="boxed-log-primary"
        disabled={isSaving || reviewTooShort || selectedEpisodes.length === 0}
      >
        {m.boxed_log_save()}
      </button>
    </footer>
  </div>
</form>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;
  @use "./logForm" as *;

  .boxed-episode-season-label {
    @include visually-hidden;
  }

  @include log-form;

  .boxed-episode-season select {
    height: var(--ni-40);
    padding-inline: var(--ni-12) var(--ni-32);

    border: none;
    border-radius: var(--border-radius-m);
    background: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    color: var(--color-text-primary);
    font: inherit;
    font-size: var(--ni-14);
    font-weight: 600;
  }

  .boxed-episode-picker {
    margin: 0;
    padding: 0;
    border: none;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .boxed-episode-chips {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--ni-44), 1fr));
    gap: var(--gap-xs);
  }

  .boxed-episode-chip {
    height: var(--ni-44);
    display: flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-radius: var(--border-radius-s);
    background: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    color: var(--color-text-primary);
    font: inherit;
    font-size: var(--ni-14);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    cursor: pointer;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }

    &.is-watched {
      color: var(--boxed-color-watched-text);
    }

    &.is-selected {
      background: var(--purple-500);
      box-shadow: none;
      color: var(--shade-10);
    }

    &.is-skeleton {
      background: color-mix(in srgb, var(--color-border) 80%, transparent);
      box-shadow: none;
      cursor: default;
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: var(--ni-2);
    }
  }

  .boxed-episode-rating-mode {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: var(--ni-4);
    gap: var(--ni-4);

    border-radius: var(--border-radius-m);
    background: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);

    button {
      height: var(--ni-32);
      border: none;
      border-radius: var(--border-radius-s);
      background: transparent;
      color: var(--color-text-secondary);
      font: inherit;
      font-size: var(--ni-12);
      font-weight: 600;
      cursor: pointer;

      &.is-active {
        background: var(--color-card-background);
        color: var(--color-text-primary);
        box-shadow: 0 0 0 var(--border-thickness-xxs) var(--color-border);
      }
    }
  }
</style>
