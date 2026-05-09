<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { episodeRatingQuery } from "$lib/requests/queries/episode/episodeRatingQuery.ts";
  import { movieRatingQuery } from "$lib/requests/queries/movies/movieRatingQuery.ts";
  import { showRatingQuery } from "$lib/requests/queries/shows/showRatingQuery.ts";
  import { map, of } from "rxjs";

  type LetterboxdRatingsHistogramProps = {
    type: "movie" | "show" | "episode";
    slug: string;
    season?: number;
    episode?: number;
  };

  const props: LetterboxdRatingsHistogramProps = $props();

  const ratingDef$ = of(null).pipe(
    map(() => {
      if (props.type === "movie") return movieRatingQuery({ slug: props.slug });
      if (props.type === "show") return showRatingQuery({ slug: props.slug });
      return episodeRatingQuery({
        slug: props.slug,
        season: props.season ?? 0,
        episode: props.episode ?? 0,
      });
    }),
  );

  const rating = useQuery(ratingDef$).pipe(map((q) => q.data?.trakt));

  const buckets = $derived.by(() => {
    const distribution = $rating?.distribution;
    if (!distribution) return [] as Array<{ key: string; pct: number }>;
    const counts = Object.entries(distribution).map(([k, v]) => ({
      key: k,
      count: v,
    }));
    const max = Math.max(1, ...counts.map((b) => b.count));
    return counts.map((b) => ({ key: b.key, pct: (b.count / max) * 100 }));
  });

  const average = $derived(
    $rating ? Math.round($rating.rating * 10) / 10 : null,
  );

  const stars = $derived(average == null ? 0 : Math.round(average / 2));

  const fans = $derived($rating?.votes ?? 0);

  const fansLabel = $derived.by(() => {
    if (!fans) return "";
    if (fans < 1000) return `${fans}`;
    if (fans < 1_000_000) return `${(fans / 1000).toFixed(1)}K`;
    return `${(fans / 1_000_000).toFixed(1)}M`;
  });
</script>

{#if average != null}
  <section class="lb-ratings">
    <header class="lb-ratings-head">
      <h3>{m.lb_ratings_label()}</h3>
      {#if fans > 0}
        <span class="lb-ratings-fans">{fansLabel} {m.lb_ratings_fans()}</span>
      {/if}
    </header>

    <div class="lb-ratings-body">
      <div class="lb-ratings-histogram" aria-hidden="true">
        {#each buckets as bucket (bucket.key)}
          <span
            class="lb-ratings-bar"
            style={`--lb-bar-h:${bucket.pct}%`}
          ></span>
        {/each}
      </div>

      <div class="lb-ratings-score">
        <span class="lb-ratings-stars" aria-hidden="true">
          {#each Array(5) as _, i (i)}
            <span class="lb-ratings-star" class:filled={i < stars}>★</span>
          {/each}
        </span>
        <span class="lb-ratings-average">{average.toFixed(1)}</span>
      </div>
    </div>
  </section>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-ratings {
    padding: var(--ni-18) 0;
    border-top: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }

  .lb-ratings-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: var(--ni-12);

    h3 {
      margin: 0;
      font-size: var(--ni-11);
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-text-secondary);
    }
  }

  .lb-ratings-fans {
    font-size: var(--ni-11);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .lb-ratings-body {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--ni-22);
    align-items: end;
  }

  .lb-ratings-histogram {
    display: flex;
    align-items: flex-end;
    gap: var(--ni-3);
    height: var(--ni-44);
  }

  .lb-ratings-bar {
    flex: 1;
    height: var(--lb-bar-h, 0%);
    min-height: 2px;
    background: var(--tboxed-positive);
    opacity: 0.85;
    border-radius: 1px;
  }

  .lb-ratings-score {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--ni-2);
  }

  .lb-ratings-stars {
    display: inline-flex;
    gap: 1px;
    color: color-mix(in srgb, var(--color-foreground) 18%, transparent);
    font-size: var(--ni-14);
    line-height: 1;
  }

  .lb-ratings-star.filled {
    color: var(--tboxed-positive);
  }

  .lb-ratings-average {
    font-family: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
    font-size: var(--ni-32);
    font-weight: 700;
    line-height: 1;
    color: var(--color-foreground);
  }
</style>
