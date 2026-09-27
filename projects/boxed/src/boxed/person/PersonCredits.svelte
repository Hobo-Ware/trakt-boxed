<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { CrewPosition } from "$lib/requests/models/CrewPosition.ts";
  import type { MediaCredits } from "$lib/requests/models/MediaCredits.ts";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { useCreditsList } from "$lib/sections/lists/stores/useCreditsList.ts";
  import { resolveSelectedPosition } from "$lib/sections/lists/utils/resolveSelectedPosition.ts";
  import { toTranslatedPosition } from "$lib/utils/formatting/string/toTranslatedPosition.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import PillSwitch from "../components/PillSwitch.svelte";
  import PosterGrid from "../poster/PosterGrid.svelte";
  import TitleTabs from "../title/TitleTabs.svelte";
  import { whileVisible } from "../utils/whileVisible.ts";
  import type { CreditSort } from "./_internal/CreditSort.ts";
  import { toPersonCredits } from "./_internal/toPersonCredits.ts";
  import { toRoleOrder } from "./_internal/toRoleOrder.ts";

  const COLUMNS = 6;
  const PAGE_SIZE = COLUMNS * 8;
  const SORTS: ReadonlyArray<{ value: CreditSort; label: () => string }> = [
    { value: "popular", label: m.tag_text_most_popular },
    { value: "newest", label: m.button_description_sort_release_date_desc },
    { value: "oldest", label: m.button_description_sort_release_date_asc },
  ];

  type PersonCreditsProps = {
    slug: string;
    knownFor: CrewPosition | null | undefined;
  };

  const { slug, knownFor }: PersonCreditsProps = $props();

  const creditsFor = (mediaType: MediaType) =>
    useCreditsList({
      type$: fromRune(() => mediaType),
      slug$: fromRune(() => slug),
      filter$: fromRune(() => ({})),
      mode$: fromRune(() => "media" as const),
    });

  const movies = creditsFor("movie");
  const shows = creditsFor("show");
  const { history } = useUser();

  const countOf = (credits: MediaCredits | undefined) =>
    Array.from(credits?.values() ?? []).reduce(
      (total, list) => total + list.length,
      0,
    );

  const movieCredits = movies.credits;
  const showCredits = shows.credits;
  const isLoadingMovies = movies.isLoading;
  const isLoadingShows = shows.isLoading;
  const isLoading = $derived(
    knownFor === undefined ||
      $isLoadingMovies !== false ||
      $isLoadingShows !== false,
  );

  const movieCount = $derived(countOf($movieCredits));
  const showCount = $derived(countOf($showCredits));

  const type: MediaType = $derived.by(() => {
    const requested = page.url.searchParams.get("credits");
    if (requested === "shows") return "show";
    if (requested === "movies") return "movie";
    return movieCount === 0 && showCount > 0 ? "show" : "movie";
  });

  const credits = $derived(type === "movie" ? $movieCredits : $showCredits);
  const positionParam = $derived(`${type}s`);
  const requestedPosition = $derived(
    (page.url.searchParams.get(positionParam) as CrewPosition | null) ??
      knownFor ??
      "acting",
  );
  const position = $derived(
    resolveSelectedPosition({ requested: requestedPosition, credits }),
  );

  const tabs = $derived.by(() => {
    const roles = toRoleOrder(credits, knownFor);
    if (isLoading || roles.length === 0) {
      return [
        { id: position, label: toTranslatedPosition(position), count: null },
      ];
    }
    return roles.map((role) => ({
      id: role.position,
      label: toTranslatedPosition(role.position),
      count: String(role.count),
    }));
  });

  const sort: CreditSort = $derived(
    SORTS.find(({ value }) => value === page.url.searchParams.get("sort"))
      ?.value ?? "popular",
  );
  const hideWatched = $derived(page.url.searchParams.get("watched") === "hide");

  const view = $derived(
    toPersonCredits({
      credits: credits?.get(position) ?? [],
      sort,
      history: $history,
      hideWatched,
    }),
  );

  let visibleCount = $state(PAGE_SIZE);
  const visible = $derived(view.posters.slice(0, visibleCount));
  const pendingCount = $derived(
    Math.max(view.posters.length - visibleCount, 0),
  );
  const seenPercent = $derived(
    view.total === 0 ? 0 : Math.round((view.seen / view.total) * 100),
  );

  const setParam = (key: string, value: string | null) => {
    const url = new URL(page.url);
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
    visibleCount = PAGE_SIZE;
    goto(url, { replaceState: true, noScroll: true, keepFocus: true });
  };
</script>

<section class="boxed-person-credits">
  <div class="boxed-person-roles">
    <TitleTabs {tabs} active={position} param={positionParam} variant="roomy" />
  </div>

  <div class="boxed-person-toolbar">
    <div class="boxed-person-type">
      <PillSwitch
        options={[
          {
            value: "movie",
            label: m.button_text_movies(),
            count: isLoading ? "" : String(movieCount),
          },
          {
            value: "show",
            label: m.button_text_shows(),
            count: isLoading ? "" : String(showCount),
          },
        ]}
        value={type}
        onChange={(next) => setParam("credits", next === "movie" ? "movies" : "shows")}
      />
    </div>

    <RenderFor audience="authenticated">
      <div class="boxed-person-seen">
        <span class="boxed-person-seen-text">
          {#if !isLoading}
            {m.boxed_person_seen({ seen: view.seen, total: view.total })}
          {/if}
        </span>
        <span class="boxed-person-seen-track" aria-hidden="true">
          <span style:width={`${seenPercent}%`}></span>
        </span>
        <span class="boxed-person-seen-percent">{seenPercent}%</span>
      </div>
    </RenderFor>

    <div class="boxed-person-controls">
      <RenderFor audience="authenticated">
        <label class="boxed-person-control is-hide">
          <input
            type="checkbox"
            checked={hideWatched}
            onchange={(event) =>
              setParam("watched", event.currentTarget.checked ? "hide" : null)}
          />
          {m.header_hide_watched()}
        </label>
      </RenderFor>
      <label class="boxed-person-control is-sort">
        <span class="boxed-person-sort-label">{m.drawer_title_sort()}</span>
        <select
          aria-label={m.drawer_title_sort()}
          value={sort}
          onchange={(event) =>
            setParam(
              "sort",
              event.currentTarget.value === "popular"
                ? null
                : event.currentTarget.value,
            )}
        >
          {#each SORTS as option (option.value)}
            <option value={option.value}>{option.label()}</option>
          {/each}
        </select>
      </label>
    </div>
  </div>

  {#if isLoading}
    <PosterGrid items={null} columns={COLUMNS} showUserMeta />
  {:else if visible.length === 0}
    <p class="boxed-person-empty">{m.text_placeholder_generic()}</p>
  {:else}
    <div class="boxed-person-grid">
      <PosterGrid items={visible} columns={COLUMNS} showUserMeta />
      {#if pendingCount > 0}
        {#key visibleCount}
          <div use:whileVisible={() => (visibleCount += PAGE_SIZE)}>
            <PosterGrid
              items={null}
              columns={COLUMNS}
              skeletonCount={pendingCount}
              showUserMeta
            />
          </div>
        {/key}
      {/if}
    </div>
  {/if}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-person-credits {
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);
  }

  .boxed-person-toolbar {
    min-height: var(--ni-40);
    display: flex;
    align-items: center;
    gap: var(--ni-20);

    @include for-tablet-sm-and-below {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      grid-template-areas:
        "type sort"
        "seen hide";
      gap: var(--ni-12);

      .boxed-person-type {
        grid-area: type;
      }

      .boxed-person-seen {
        grid-area: seen;
        max-width: none;
      }

      .boxed-person-seen-track {
        display: none;
      }

      .boxed-person-controls {
        display: contents;
      }

      .is-sort {
        grid-area: sort;
        justify-self: end;
      }

      .is-hide {
        grid-area: hide;
        justify-self: end;
      }
    }
  }

  .boxed-person-seen {
    flex: 1;
    max-width: var(--ni-480);
    height: var(--ni-40);
    box-sizing: border-box;
    padding-inline: var(--ni-16);
    display: flex;
    align-items: center;
    gap: var(--ni-14);
    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--boxed-color-watched) 14%, transparent);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--boxed-color-watched) 45%, transparent);

    @include for-tablet-sm-and-below {
      max-width: none;
    }
  }

  .boxed-person-seen-text {
    flex: 1;
    min-width: 0;
    font-size: var(--ni-14);
    white-space: nowrap;
  }

  .boxed-person-seen-track {
    flex: 0 0 var(--ni-120);
    height: var(--ni-6);
    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--shade-950) 40%, transparent);
    overflow: hidden;

    span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: var(--boxed-color-watched);
      transition: width var(--transition-increment) ease-out;
    }
  }

  .boxed-person-seen-percent {
    min-width: 4ch;
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-12);
    text-align: end;
    color: var(--boxed-color-watched-text);
  }

  .boxed-person-controls {
    margin-inline-start: auto;
    display: flex;
    align-items: center;
    gap: var(--ni-16);
  }

  .boxed-person-control {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
    white-space: nowrap;

    input {
      width: var(--ni-16);
      height: var(--ni-16);
      margin: 0;
      accent-color: var(--purple-500);
    }

    select {
      height: var(--ni-32);
      padding-inline: var(--ni-10);
      border: var(--border-thickness-xxs) solid var(--color-border);
      border-radius: var(--border-radius-s);
      background: var(--color-input-background);
      color: var(--color-text-primary);
      font: inherit;
      font-size: var(--ni-14);
    }
  }

  .boxed-person-sort-label {
    font-size: inherit;

    @include for-tablet-sm-and-below {
      display: none;
    }
  }

  .boxed-person-empty {
    min-height: var(--ni-320);
    margin: 0;
    color: var(--color-text-secondary);
  }

  .boxed-person-grid {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    @include for-mobile {
      gap: var(--gap-s);
    }
  }
</style>
