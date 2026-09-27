<script lang="ts">
  import IMDBIcon from "$lib/components/icons/IMDBIcon.svelte";
  import LetterboxdIcon from "$lib/components/icons/LetterboxdIcon.svelte";
  import MALIcon from "$lib/components/icons/MALIcon.svelte";
  import PopcornIcon from "$lib/components/icons/PopcornIcon.svelte";
  import RottenIcon from "$lib/components/icons/RottenIcon.svelte";
  import TMDBIcon from "$lib/components/icons/TMDBIcon.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaRating } from "$lib/requests/models/MediaRating.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage.ts";
  import {
    toRottenAudienceRating,
    toRottenCriticRating,
  } from "$lib/utils/formatting/number/toRottenTomatoRating.ts";
  import Stars from "../../components/Stars.svelte";
  import { toExternalRatings } from "./toExternalRatings.ts";
  import { toHistogramBars } from "./toHistogramBars.ts";

  const EXTERNAL_LIMIT = 4;

  type RatingsPanelProps = {
    ratings: MediaRating | null;
    votes: number;
    userRating: number | null;
  };

  const { ratings, votes, userRating }: RatingsPanelProps = $props();

  const bars = $derived(toHistogramBars(ratings?.trakt?.distribution));
  const external = $derived(
    ratings ? toExternalRatings(ratings, languageTag(), EXTERNAL_LIMIT) : [],
  );

  const totalVotes = $derived(ratings?.trakt?.votes ?? votes);
  const agreement = $derived.by(() => {
    if (!userRating || !totalVotes) return null;
    const count = bars.at(userRating - 1)?.count ?? 0;
    return toPercentage(count / totalVotes, languageTag());
  });
</script>

<div class="boxed-ratings-panel">
  <div class="boxed-ratings-bars" role="img" aria-label={m.header_ratings()}>
    {#if ratings}
      {#each bars as bar (bar.rating)}
        <span
          class="boxed-ratings-bar"
          class:is-highlighted={userRating ? bar.rating === userRating : bar.isPeak}
          style:--bar-ratio={bar.ratio}
          title={m.boxed_label_rated_stars({ stars: bar.rating / 2 })}
        ></span>
      {/each}
    {:else}
      <Skeleton height="100%" radius="var(--border-radius-xs)" />
    {/if}
  </div>

  <div class="boxed-ratings-foot">
    <span>{m.text_ratings_votes({ count: toHumanNumber(totalVotes, languageTag()) })}</span>
    {#if userRating}
      <span class="boxed-ratings-yours">
        {m.boxed_title_your_rating()}
        <Stars rating={userRating} />
        {#if agreement}
          <span>{m.boxed_title_ratings_agree({ percent: agreement })}</span>
        {/if}
      </span>
    {/if}
  </div>

  <ul class="boxed-ratings-external">
    {#if ratings}
      {#each external as rating (rating.source)}
        <li>
          <svelte:element
            this={rating.url ? "a" : "span"}
            class="boxed-ratings-chip"
            href={rating.url}
            target={rating.url ? "_blank" : undefined}
            rel={rating.url ? "noopener noreferrer" : undefined}
          >
            <span class="boxed-ratings-source">
              {#if rating.source === "imdb"}
                <IMDBIcon style="rated" />
              {:else if rating.source === "rotten-critic"}
                <RottenIcon style={toRottenCriticRating(rating.score)} />
              {:else if rating.source === "rotten-audience"}
                <PopcornIcon style={toRottenAudienceRating(rating.score)} />
              {:else if rating.source === "tmdb"}
                <TMDBIcon />
              {:else if rating.source === "mal"}
                <MALIcon style="rated" />
              {:else}
                <LetterboxdIcon style="rated" />
              {/if}
            </span>
            <span class="boxed-ratings-value">{rating.value}</span>
          </svelte:element>
        </li>
      {/each}
    {:else}
      {#each { length: EXTERNAL_LIMIT }, index (index)}
        <li>
          <Skeleton height="var(--ni-36)" radius="var(--border-radius-m)" />
        </li>
      {/each}
    {/if}
  </ul>
</div>

<style>
  .boxed-ratings-panel {
    display: contents;
  }

  .boxed-ratings-bars {
    grid-area: bars;
    height: var(--ni-72);

    display: flex;
    align-items: flex-end;
    gap: var(--ni-3);
  }

  .boxed-ratings-bar {
    flex: 1 1 0;
    height: max(var(--ni-3), calc(var(--bar-ratio) * 100%));

    border-start-start-radius: var(--border-radius-xs);
    border-start-end-radius: var(--border-radius-xs);
    background: color-mix(
      in srgb,
      var(--ambient-accent, var(--shade-600)) 70%,
      transparent
    );

    &.is-highlighted {
      background: var(--boxed-color-star);
    }
  }

  .boxed-ratings-foot {
    grid-area: foot;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ni-8);
    height: var(--ni-16);

    font-size: var(--ni-12);
    color: var(--color-text-secondary);
    white-space: nowrap;
  }

  .boxed-ratings-yours {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);
  }

  .boxed-ratings-external {
    grid-area: external;

    margin: 0;
    padding: 0;
    list-style: none;

    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(2, var(--ni-36));
    gap: var(--ni-8);
  }

  .boxed-ratings-chip {
    box-sizing: border-box;
    height: var(--ni-36);
    padding: 0 var(--ni-10);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ni-6);

    border-radius: var(--border-radius-m);
    background: var(--color-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    text-decoration: none;
    color: var(--color-text-primary);
  }

  a.boxed-ratings-chip:hover,
  a.boxed-ratings-chip:focus-visible {
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-link-active);
  }

  .boxed-ratings-source {
    display: flex;
    align-items: center;
    height: var(--ni-20);

    :global(svg) {
      height: var(--ni-20);
      width: auto;
    }
  }

  .boxed-ratings-value {
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
  }
</style>
