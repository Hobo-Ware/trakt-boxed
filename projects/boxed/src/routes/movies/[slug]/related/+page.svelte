<script lang="ts">
  import RelatedTitles from "$boxed/title/RelatedTitles.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { movieSummaryQuery } from "$lib/requests/queries/movies/movieSummaryQuery.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/assets";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { map } from "rxjs";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const slug$ = fromRune(() => params.slug);
  const movie = useQuery(
    slug$.pipe(map((slug) => movieSummaryQuery({ slug }))),
  ).pipe(map(($query) => $query.data));
</script>

<TraktPage
  audience="all"
  title={m.list_title_related_movies()}
  image={DEFAULT_SHARE_MOVIE_COVER}
>
  {#key params.slug}
    <RelatedTitles
      slug={params.slug}
      type="movie"
      eyebrow={m.list_title_related_movies()}
      media={$movie ? { ...$movie, type: "movie" } : undefined}
      href={UrlBuilder.movie(params.slug)}
    />
  {/key}
</TraktPage>
