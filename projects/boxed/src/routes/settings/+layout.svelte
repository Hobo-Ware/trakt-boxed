<script lang="ts">
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import SettingsShell from "$boxed/settings/SettingsShell.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { children } = $props();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_settings()}
>
  <PageContainer>
    <RenderFor audience="authenticated">
      <SettingsShell>
        {@render children()}
      </SettingsShell>
    </RenderFor>
  </PageContainer>
</TraktPage>
