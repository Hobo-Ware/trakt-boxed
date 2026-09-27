<script lang="ts">
  import FilmReviews from "$boxed/film/FilmReviews.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

<TraktPage audience="all" title={m.list_title_comments()} image={null} type="movie">
  {#key params.slug}
    <FilmReviews slug={params.slug} />
  {/key}
</TraktPage>
