<script lang="ts">
  import { getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { movieTriviaQuery } from "$lib/requests/queries/movies/movieTriviaQuery.ts";
  import { showTriviaQuery } from "$lib/requests/queries/shows/showTriviaQuery.ts";
  import { toLoadingState } from "$lib/utils/requests/toLoadingState.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { map } from "rxjs";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import SectionHeader from "../../components/SectionHeader.svelte";
  import TriviaGrid from "./TriviaGrid.svelte";

  const FREE_FACTS = 3;

  type TriviaLoaderProps = {
    slug: string;
    type: MediaType;
    allHref: string;
  };

  const { slug, type, allHref }: TriviaLoaderProps = $props();

  const query = useQuery(
    fromRune(() => ({ slug, type })).pipe(
      map((target) => {
        const params = { slug: target.slug, locale: getLocale() };
        return target.type === "movie"
          ? movieTriviaQuery(params)
          : showTriviaQuery(params);
      }),
    ),
  );

  const isLoading = $derived(toLoadingState($query));
  const facts = $derived($query.data?.summary.slice(0, FREE_FACTS) ?? []);
  const factCount = $derived(
    $query.data?.items.filter((item) => !item.isSpoiler).length ?? 0,
  );
</script>

{#if isLoading || facts.length > 0}
  <SectionHeader title={m.boxed_title_did_you_know()}>
    {#snippet actions()}
      {#if !isLoading}
        <RenderFor audience="vip">
          {#if factCount > facts.length}
            <a class="boxed-trivia-link" href={allHref} data-sveltekit-noscroll data-sveltekit-replacestate>
              {m.boxed_title_trivia_count({ shown: facts.length, total: factCount })}
            </a>
          {/if}
        </RenderFor>
        <RenderFor audience="free">
          <a class="boxed-trivia-link" href={UrlBuilder.vip()}>
            {m.boxed_title_trivia_upsell()}
          </a>
        </RenderFor>
      {/if}
    {/snippet}
  </SectionHeader>
  <TriviaGrid facts={isLoading ? null : facts} />
{/if}

<style>
  .boxed-trivia-link {
    font-size: var(--ni-12);
    color: var(--color-link-active);
    text-decoration: none;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }
</style>
