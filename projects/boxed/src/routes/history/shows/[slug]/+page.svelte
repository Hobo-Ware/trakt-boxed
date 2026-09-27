<script lang="ts">
  import TitleActivity from "$boxed/activity/TitleActivity.svelte";
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { showSummaryQuery } from "$lib/requests/queries/shows/showSummaryQuery.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/assets";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { map } from "rxjs";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const show = useQuery(
    fromRune(() => params.slug).pipe(map((slug) => showSummaryQuery({ slug }))),
  );
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.page_title_history()}
>
  <PageContainer>
    {#key params.slug}
      <TitleActivity
        title={$show.data?.title ?? null}
        detail={$show.data?.year ? String($show.data.year) : null}
        poster={$show.data?.poster.url.thumb ?? null}
        href={UrlBuilder.show(params.slug)}
        type="show"
        id={$show.data?.id ?? null}
      />
    {/key}
  </PageContainer>
</TraktPage>
