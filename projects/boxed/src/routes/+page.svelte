<script lang="ts">
  import BoxedLanding from "$boxed/landing/BoxedLanding.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
</script>

<TraktPage
  audience="public"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_home()}
  info={{ overview: m.page_description_home() }}
  type="home"
  mode="content-only"
>
  <BoxedLanding />
</TraktPage>
