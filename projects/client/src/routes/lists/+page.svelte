<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import LetterboxdListsPage from "$lib/sections/letterboxd-lists/LetterboxdListsPage.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/assets";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.page_title_lists()}
  mode="content-only"
>
  <LetterboxdListsPage />
</TraktPage>
