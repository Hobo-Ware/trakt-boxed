<script lang="ts">
  import ShowReviews from "$boxed/show/ShowReviews.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

<TraktPage audience="all" title={m.list_title_comments()} image={null} type="show">
  {#key params.slug}
    <ShowReviews slug={params.slug} />
  {/key}
</TraktPage>
