<script lang="ts">
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { searchListsQuery } from "$lib/requests/queries/search/searchListsQuery.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/assets";
  import { map } from "rxjs";

  const query = useQuery(searchListsQuery({ limit: 30 }));

  const lists = $derived(query.pipe(map(($q) => $q.data?.items ?? [])));
  const isLoading = $derived(
    query.pipe(map(($q) => $q.isLoading || ($q.isFetching && !$q.data))),
  );
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.page_title_lists()}
  mode="content-only"
>
  <section class="lists-page">
    <header class="lists-page__header">
      <h1 class="lists-page__title">{m.page_title_lists()}</h1>
      <p class="lists-page__sub">{m.lists_subtitle()}</p>
    </header>

    {#if $isLoading && (!$lists || $lists.length === 0)}
      <ul class="lists-page__grid">
        {#each Array.from({ length: 8 }) as _, i (i)}
          <li class="lists-page__card lists-page__card--skeleton"></li>
        {/each}
      </ul>
    {:else}
      <ul class="lists-page__grid">
        {#each $lists as list (list.id)}
          <li class="lists-page__card">
            <a class="lists-page__link" href={UrlBuilder.users(list.user.slug ?? list.user.username).lists(list.slug)}>
              <span class="lists-page__name">{list.name}</span>
              <span class="lists-page__author">
                {list.user.name?.full || `@${list.user.username}`}
              </span>
              <span class="lists-page__stats">
                {toHumanNumber(list.count)} items · ♥ {toHumanNumber(list.likeCount)}
              </span>
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lists-page {
    max-width: 1600px;
    margin: 0 auto;
    padding: clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px);

    &__header {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
      padding-bottom: var(--gap-m);
      margin-bottom: var(--gap-m);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
    }

    &__title {
      font-family: var(--font-family-serif, "Tiempos Headline", Georgia, serif);
      font-weight: 400;
      font-size: clamp(1.6rem, 3vw, 2.4rem);
      line-height: 1.1;
      min-height: calc(clamp(1.6rem, 3vw, 2.4rem) * 1.1);
      margin: 0;
      color: var(--color-text-primary);
    }

    &__sub {
      margin: 0;
      font-size: 0.85rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    &__grid {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--gap-m);

      @include for-mobile { grid-template-columns: 1fr; }
    }

    &__card {
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);
      border: 1px solid color-mix(in srgb, var(--shade-10) 6%, transparent);
      border-radius: 3px;
      min-height: 120px;

      &--skeleton { background: var(--shade-900); }
    }

    &__link {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: var(--gap-m);
      text-decoration: none;
      color: var(--color-text-primary);

      &:hover { color: var(--color-background-green, var(--green-500)); }
    }

    &__name {
      font-family: var(--font-family-serif, Georgia, serif);
      font-size: 1.2rem;
      line-height: 1.25;
      min-height: calc(1.2rem * 1.25);
    }

    &__author {
      font-size: 0.85rem;
      color: var(--color-text-secondary);
    }

    &__stats {
      font-size: 0.78rem;
      color: var(--color-text-secondary);
    }
  }
</style>
