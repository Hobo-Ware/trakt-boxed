<script lang="ts">
  import SerifHeadings from "$boxed/static/SerifHeadings.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TvTimeFaq from "$lib/sections/faq/TvTimeFaq.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.tv_time_faq_page_title()}
  mode="content-only"
>
  <SerifHeadings>
    <TvTimeFaq />
  </SerifHeadings>
</TraktPage>
