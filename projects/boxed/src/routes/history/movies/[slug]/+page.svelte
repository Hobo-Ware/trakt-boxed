<script lang="ts">
  import TitleActivity from "$boxed/activity/TitleActivity.svelte";
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { movieSummaryQuery } from "$lib/requests/queries/movies/movieSummaryQuery.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { map } from "rxjs";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const movie = useQuery(
    fromRune(() => params.slug).pipe(map((slug) => movieSummaryQuery({ slug }))),
  );
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_history()}
>
  <PageContainer>
    {#key params.slug}
      <TitleActivity
        title={$movie.data?.title ?? null}
        detail={$movie.data?.year ? String($movie.data.year) : null}
        poster={$movie.data?.poster.url.thumb ?? null}
        href={UrlBuilder.movie(params.slug)}
        type="movie"
        id={$movie.data?.id ?? null}
      />
    {/key}
  </PageContainer>
</TraktPage>
