<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import LetterboxdHome from "$lib/sections/letterboxd-home/LetterboxdHome.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_home()}
  info={{ overview: m.page_description_home() }}
  type="home"
  mode="content-only"
>
  <LetterboxdHome />
</TraktPage>
