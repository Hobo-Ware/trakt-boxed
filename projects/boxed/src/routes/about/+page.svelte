<script lang="ts">
  import SerifHeadings from "$boxed/static/SerifHeadings.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import About from "$lib/sections/about/About.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_about()}
>
  <SerifHeadings>
    <About />
  </SerifHeadings>
</TraktPage>
