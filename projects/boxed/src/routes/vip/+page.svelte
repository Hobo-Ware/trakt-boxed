<script lang="ts">
  import VipMembership from "$boxed/vip/VipMembership.svelte";
  import VipSignup from "$boxed/vip/VipSignup.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import StripeReturnHandler from "$lib/sections/vip/StripeReturnHandler.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
</script>

<TraktPage audience="authenticated" image={DEFAULT_SHARE_COVER} title={m.tag_text_vip()}>
  <StripeReturnHandler />

  <RenderFor audience="free">
    <VipSignup />
  </RenderFor>

  <RenderFor audience="vip">
    <VipMembership />
  </RenderFor>
</TraktPage>
