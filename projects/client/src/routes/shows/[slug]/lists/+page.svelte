<script lang="ts">
  import EntityFacetPage from "$lib/sections/film/facet/EntityFacetPage.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

<TraktPage audience="all" image={DEFAULT_SHARE_MOVIE_COVER} title="Lists" mode="content-only">
  <EntityFacetPage kind="show" slug={params.slug} facet="lists" />
</TraktPage>
