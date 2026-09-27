<script lang="ts">
  import SerifHeadings from "$boxed/static/SerifHeadings.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import StripeReturnHandler from "$lib/sections/vip/StripeReturnHandler.svelte";
  import VipManage from "$lib/sections/vip/VipManage.svelte";
  import VipSubscribe from "$lib/sections/vip/VipSubscribe.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
</script>

<TraktPage audience="authenticated" image={DEFAULT_SHARE_COVER} title={m.tag_text_vip()}>
  <StripeReturnHandler />

  <SerifHeadings>
    <RenderFor audience="free">
      <VipSubscribe />
    </RenderFor>

    <RenderFor audience="vip">
      <VipManage />
    </RenderFor>
  </SerifHeadings>
</TraktPage>
