<script lang="ts">
  import RelatedTitles from "$boxed/title/RelatedTitles.svelte";
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

  const slug$ = fromRune(() => params.slug);
  const show = useQuery(
    slug$.pipe(map((slug) => showSummaryQuery({ slug }))),
  ).pipe(map(($query) => $query.data));
</script>

<TraktPage
  audience="all"
  title={m.list_title_related_shows()}
  image={DEFAULT_SHARE_SHOW_COVER}
>
  {#key params.slug}
    <RelatedTitles
      slug={params.slug}
      type="show"
      eyebrow={m.list_title_related_shows()}
      media={$show ? { ...$show, type: "show" } : undefined}
      href={UrlBuilder.show(params.slug)}
    />
  {/key}
</TraktPage>
