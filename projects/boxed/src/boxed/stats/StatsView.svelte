<script lang="ts">
  import { page } from "$app/state";
  import InView from "$boxed/components/InView.svelte";
  import SectionHeader from "$boxed/components/SectionHeader.svelte";
  import PosterGrid from "$boxed/poster/PosterGrid.svelte";
  import type { PosterMedia } from "$boxed/poster/PosterMedia.ts";
  import Stars from "$boxed/components/Stars.svelte";
  import type { ProfileContext } from "$boxed/profile/ProfileContext.ts";
  import YearHeatmap from "$boxed/profile/sections/YearHeatmap.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { getLocale, languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { YirPeopleType } from "$lib/requests/models/YirPerson.ts";
  import type { YirYear } from "$lib/requests/models/YirYear.ts";
  import { useYirDetail } from "$lib/sections/yir/useYirDetail.ts";
  import { formatDecimal } from "$lib/utils/format/formatDecimal";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { toCountryName } from "$lib/utils/formatting/intl/toCountryName.ts";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { of } from "rxjs";
  import BarList from "./BarList.svelte";
  import DecadeBars from "./DecadeBars.svelte";
  import ListProgress from "./ListProgress.svelte";
  import Milestones from "./Milestones.svelte";
  import PlayBars from "./PlayBars.svelte";
  import StatsTotals from "./StatsTotals.svelte";
  import TopPeople from "./TopPeople.svelte";
  import { parseStatsYear } from "./_internal/parseStatsYear.ts";
  import { toDecades } from "./_internal/toDecades.ts";
  import { toHighestRated } from "./_internal/toHighestRated.ts";
  import { toMilestones } from "./_internal/toMilestones.ts";
  import { toPlayBars } from "./_internal/toPlayBars.ts";
  import { toProfileTotals } from "./_internal/toProfileTotals.ts";
  import { toRankedCounts } from "./_internal/toRankedCounts.ts";
  import { toStatsTotals } from "./_internal/toStatsTotals.ts";
  import { toStatsYears } from "./_internal/toStatsYears.ts";

  const GENRES = 8;
  const COUNTRIES = 7;
  const COMPANIES = 6;
  const HIGHEST_RATED = 6;

  const { context }: { context: ProfileContext } = $props();

  const now = new Date();
  const years = toStatsYears(now);
  const { user } = useUser();

  const year = $derived(
    parseStatsYear({ value: page.url.searchParams.get("year"), now }),
  );
  const isVipGated = $derived(context.isMe && $user != null && !$user.isVip);

  const { detail, isLoading } = $derived(
    isVipGated
      ? { detail: of(null), isLoading: of(false) }
      : useYirDetail({ slug: context.slug, year }),
  );

  const isUnavailable = $derived(!$isLoading && !$detail);
  const loaded = $derived($isLoading ? null : ($detail ?? null));

  const totals = $derived.by(() => {
    if (loaded) return toStatsTotals(loaded);
    if (isUnavailable && context.stats) return toProfileTotals(context.stats);
    return null;
  });

  const bars = $derived(loaded ? toPlayBars({ detail: loaded, year }) : null);
  const milestones = $derived(
    loaded
      ? toMilestones({
        detail: loaded,
        formatDate: (date) =>
          toHumanDay({ date, locale: getLocale(), format: "short" }),
      })
      : null,
  );
  const genres = $derived(
    loaded
      ? toRankedCounts({
        groups: [loaded.genres.movies.genres, loaded.genres.shows.genres].map(
          (group) =>
            group.map((genre) => ({
              key: genre.slug,
              label: toTranslatedGenre(genre.slug),
              count: genre.count,
            })),
        ),
        limit: GENRES,
      })
      : null,
  );
  const countries = $derived(
    loaded
      ? toRankedCounts({
        groups: [
          loaded.countries.movies.countries,
          loaded.countries.shows.countries,
        ].map((group) =>
          group.map((country) => ({
            key: country.code,
            label: toCountryName(country.code, languageTag()),
            count: country.count,
          }))
        ),
        limit: COUNTRIES,
      })
      : null,
  );
  const companies = $derived(
    loaded
      ? toRankedCounts({
        groups: [loaded.networks, loaded.studios].map((group) =>
          group.map((company) => ({
            key: `${company.id}-${company.name}`,
            label: company.name,
            count: company.count,
          }))
        ),
        limit: COMPANIES,
      })
      : null,
  );
  const decades = $derived(loaded ? toDecades(loaded) : null);
  const highestRated = $derived(
    loaded ? toHighestRated({ detail: loaded, limit: HIGHEST_RATED }) : null,
  );
  const ratingByKey = $derived(
    new Map(highestRated?.map(({ media, rating }) => [media.key, rating])),
  );
  const listProgress = $derived(
    loaded
      ? [
        ...(loaded.listProgress?.movies ?? []),
        ...(loaded.listProgress?.shows ?? []),
      ].slice(0, 3)
      : null,
  );

  const perWeek = $derived(
    loaded
      ? {
        movies: formatDecimal(loaded.stats.movies.playCounts.weekly),
        episodes: formatDecimal(loaded.stats.shows.playCounts.weekly),
      }
      : null,
  );

  const peopleTypes: ReadonlyArray<{ id: YirPeopleType; label: () => string }> =
    [
      { id: "directors", label: m.boxed_stats_people_directors },
      { id: "actors", label: m.boxed_stats_people_actors },
      { id: "actresses", label: m.boxed_stats_people_actresses },
      { id: "writers", label: m.boxed_stats_people_writers },
    ];
  let peopleType = $state<YirPeopleType>("directors");

  const yearLabel = (value: YirYear) =>
    value === "all" ? m.text_all_time() : `${value}`;

  const hrefFor = (value: YirYear) => {
    const url = new URL(page.url);
    url.searchParams.set("year", `${value}`);
    return `${url.pathname}${url.search}`;
  };

  const reviewHref = $derived(
    year === "all"
      ? UrlBuilder.users(context.slug).allTime()
      : UrlBuilder.users(context.slug).yearToDate(year),
  );
</script>

{#snippet ratedMeta(media: PosterMedia)}
  {@const rating = ratingByKey.get(media.key)}
  {#if rating}<Stars {rating} />{/if}
{/snippet}

<div class="boxed-stats">
  <section class="stats-hero">
    <div class="stats-hero-head">
      <div class="stats-hero-title">
        <span class="stats-eyebrow">
          {#if context.name}
            {year === "all"
              ? m.boxed_stats_eyebrow_all_time({ name: context.name })
              : m.boxed_stats_eyebrow_year({ name: context.name })}
          {/if}
        </span>
        <h2>{yearLabel(year)}</h2>
      </div>
      {#if !isVipGated}
        <nav class="stats-years" aria-label={m.boxed_stats_year_switch_label()}>
          {#each years as value (value)}
            <a
              href={hrefFor(value)}
              class:is-active={value === year}
              aria-current={value === year ? "page" : undefined}
              data-sveltekit-replacestate
              data-sveltekit-noscroll
            >
              {yearLabel(value)}
            </a>
          {/each}
        </nav>
      {/if}
    </div>
    <StatsTotals {totals} />
  </section>

  {#if isUnavailable}
    <div class="stats-upsell">
      {#if isVipGated}
        <p class="stats-upsell-title">{m.text_vip_upsell_more_stats()}</p>
        <p>{m.vip_feature_description_yir()}</p>
        <a class="stats-upsell-link" href={UrlBuilder.vip()}>
          {m.badge_text_get_vip()}
        </a>
      {:else}
        <p>{m.text_placeholder_generic()}</p>
      {/if}
    </div>
  {:else}
    <section class="stats-block">
      <SectionHeader
        title={year === "all"
          ? m.boxed_stats_by_year()
          : m.boxed_stats_weekly()}
      >
        {#snippet actions()}
          <span class="stats-legend">
            <span class="legend-movies">{m.label_stats_movies()}</span>
            <span class="legend-episodes">{m.label_stats_episodes()}</span>
          </span>
        {/snippet}
      </SectionHeader>
      <PlayBars {bars} />
      <p class="stats-per-week">
        <span>
          <strong>{perWeek?.movies ?? "-"}</strong>
          {m.boxed_stats_movies_per_week()}
        </span>
        <span>
          <strong>{perWeek?.episodes ?? "-"}</strong>
          {m.boxed_stats_episodes_per_week()}
        </span>
      </p>
    </section>

    <section class="stats-block">
      <SectionHeader title={m.boxed_stats_milestones()} />
      <Milestones {milestones} />
    </section>

    <div class="stats-grid">
      <section class="stats-block">
        <SectionHeader title={m.boxed_stats_genres()} />
        <BarList items={genres} rows={GENRES} />
      </section>

      {#if year === "all"}
        <section class="stats-block">
          <SectionHeader title={m.header_decade()} />
          <DecadeBars {decades} />
        </section>
      {/if}

      <section class="stats-block">
        <SectionHeader title={m.boxed_stats_countries()} />
        <BarList items={countries} rows={COUNTRIES} variant="line" ranked />
      </section>

      <section class="stats-block">
        <SectionHeader title={m.boxed_stats_top_people()}>
          {#snippet actions()}
            <span class="stats-people-types">
              {#each peopleTypes as option (option.id)}
                <button
                  type="button"
                  class:is-active={option.id === peopleType}
                  aria-pressed={option.id === peopleType}
                  onclick={() => (peopleType = option.id)}
                >
                  {option.label()}
                </button>
              {/each}
            </span>
          {/snippet}
        </SectionHeader>
        <InView>
          {#key peopleType}
            <TopPeople slug={context.slug} {year} type={peopleType} />
          {/key}
          {#snippet placeholder()}
            <div class="stats-people-placeholder"></div>
          {/snippet}
        </InView>
      </section>

      <section class="stats-block">
        <SectionHeader title={m.boxed_stats_networks_studios()} />
        <BarList items={companies} rows={COMPANIES} />
      </section>

      <section class="stats-block">
        <SectionHeader title={m.boxed_stats_highest_rated()} />
        <PosterGrid
          items={highestRated?.map(({ media }) => media)}
          columns={HIGHEST_RATED}
          skeletonCount={HIGHEST_RATED}
          meta={ratedMeta}
        />
      </section>
    </div>

    {#if context.isMe && year !== "all" && year === now.getFullYear()}
      <YearHeatmap />
    {/if}

    <div class="stats-footer" class:has-progress={year === "all"}>
      {#if year === "all"}
        <section class="stats-block">
          <SectionHeader title={m.yir_section_title_list_progress()} />
          <ListProgress lists={listProgress} />
        </section>
      {/if}
      <a class="stats-review-card" href={reviewHref}>
        <span class="stats-eyebrow">{m.yir_title_year_in_review()}</span>
        <span class="stats-review-title">
          {year === "all"
            ? m.page_title_all_time_stats()
            : m.button_text_year_in_review({ year: `${year}` })}
        </span>
      </a>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-stats {
    display: flex;
    flex-direction: column;
    gap: var(--ni-44);
    padding-top: var(--ni-8);

    @include for-mobile {
      gap: var(--ni-32);
    }
  }

  .stats-hero {
    display: flex;
    flex-direction: column;
    gap: var(--ni-20);
  }

  .stats-hero-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--ni-24);

    @include for-tablet-sm-and-below {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .stats-hero-title {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);

    h2 {
      margin: 0;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-136);
      font-weight: 600;
      line-height: 0.9;
      letter-spacing: -0.03em;

      @include for-mobile {
        font-size: var(--ni-72);
      }
    }
  }

  .stats-eyebrow {
    min-height: var(--ni-16);
    font-size: var(--ni-12);
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .stats-years {
    display: flex;
    gap: var(--ni-4);
    padding: var(--ni-4);
    border-radius: var(--border-radius-xxl);
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    overflow-x: auto;
    scrollbar-width: none;

    a {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: var(--ni-88);
      height: var(--ni-32);
      padding-inline: var(--ni-8);

      @include for-mobile {
        flex: 1 1 0;
        min-width: 0;
      }
      border-radius: var(--border-radius-xxl);
      font-size: var(--ni-14);
      font-weight: 500;
      white-space: nowrap;
      text-decoration: none;
      color: var(--color-text-secondary);

      &.is-active {
        background: var(--purple-500);
        color: var(--color-foreground-purple);
      }
    }
  }

  .stats-block {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ni-44) var(--ni-48);

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .stats-legend {
    display: flex;
    gap: var(--ni-16);
    font-size: var(--ni-12);
    color: var(--color-text-secondary);

    span {
      display: flex;
      align-items: center;
      gap: var(--ni-6);

      &::before {
        content: "";
        width: var(--ni-10);
        height: var(--ni-10);
        border-radius: var(--ni-2);
      }
    }

    .legend-movies::before {
      background: var(--boxed-color-accent-fill);
    }

    .legend-episodes::before {
      background: var(--boxed-color-accent-fill-alt);
    }
  }

  .stats-per-week {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-8) var(--ni-40);
    margin: var(--ni-16) 0 0;
    font-size: var(--ni-14);
    color: var(--color-text-secondary);

    span {
      min-width: var(--ni-200);
    }

    strong {
      font-family: var(--boxed-font-title);
      font-size: var(--ni-22);
      font-weight: 600;
      color: var(--color-text-primary);
    }
  }

  .stats-people-types {
    display: flex;
    gap: var(--ni-4);

    button {
      padding: var(--ni-2) var(--ni-8);
      border: 0;
      border-radius: var(--border-radius-xxl);
      background: none;
      font: inherit;
      font-size: var(--ni-12);
      color: var(--color-text-secondary);
      cursor: pointer;

      &.is-active {
        background: var(--color-input-background);
        box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
        color: var(--color-text-primary);
      }
    }
  }

  .stats-people-placeholder {
    min-height: var(--ni-160);
  }

  .stats-footer {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--ni-48);

    &.has-progress {
      grid-template-columns: minmax(0, 1fr) var(--ni-380);

      @include for-tablet-sm-and-below {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  }

  .stats-review-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--ni-16);
    min-height: var(--ni-120);
    padding: var(--ni-24);
    border-radius: var(--border-radius-l);
    background: radial-gradient(
      120% 120% at 100% 0%,
      color-mix(in srgb, var(--purple-500) 55%, var(--color-card-background)),
      color-mix(in srgb, var(--boxed-color-accent-wash) 60%, var(--color-card-background))
        55%,
      var(--color-card-background) 100%
    );
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--purple-500) 40%, transparent);
    color: var(--color-text-primary);
    text-decoration: none;

    .stats-eyebrow {
      color: var(--boxed-color-accent-text);
    }
  }

  .stats-review-title {
    font-size: var(--ni-30);
    font-weight: 600;
    line-height: 1.15;
  }

  .stats-upsell {
    min-height: var(--ni-240);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ni-8);
    text-align: center;
    color: var(--color-text-secondary);

    p {
      margin: 0;
      max-width: var(--ni-480);
    }
  }

  .stats-upsell-title {
    font-size: var(--ni-22);
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .stats-upsell-link {
    margin-top: var(--ni-8);
    padding: var(--ni-8) var(--ni-16);
    border-radius: var(--border-radius-m);
    background: var(--purple-500);
    color: var(--color-foreground-purple);
    text-decoration: none;
    font-weight: 500;
  }
</style>
