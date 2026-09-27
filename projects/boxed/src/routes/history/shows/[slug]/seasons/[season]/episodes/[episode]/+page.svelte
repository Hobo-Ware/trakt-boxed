<script lang="ts">
  import TitleActivity from "$boxed/activity/TitleActivity.svelte";
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { episodeSummaryQuery } from "$lib/requests/queries/episode/episodeSummaryQuery.ts";
  import { showSummaryQuery } from "$lib/requests/queries/shows/showSummaryQuery.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/assets";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { map } from "rxjs";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const season = $derived(Number(params.season));
  const number = $derived(Number(params.episode));

  const params$ = fromRune(() => ({
    slug: params.slug,
    season,
    episode: number,
  }));
  const episode = useQuery(params$.pipe(map((p) => episodeSummaryQuery(p))));
  const show = useQuery(
    params$.pipe(map(({ slug }) => showSummaryQuery({ slug }))),
  );

  const title = $derived(
    $show.data && $episode.data
      ? `${$show.data.title}: ${$episode.data.title}`
      : null,
  );
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.page_title_history()}
>
  <PageContainer>
    {#key `${params.slug}-${season}-${number}`}
      <TitleActivity
        {title}
        detail={m.text_season_episode_number({ season, number })}
        poster={$show.data?.poster.url.thumb ?? null}
        href={UrlBuilder.episode(params.slug, season, number)}
        type="episode"
        id={$episode.data?.id ?? null}
      />
    {/key}
  </PageContainer>
</TraktPage>
