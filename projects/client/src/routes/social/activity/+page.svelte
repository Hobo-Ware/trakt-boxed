<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import LetterboxdMembers from "$lib/sections/letterboxd-members/LetterboxdMembers.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_social_activity()}
  mode="content-only"
>
  <LetterboxdMembers />
</TraktPage>
