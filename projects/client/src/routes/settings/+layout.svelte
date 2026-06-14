<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import Settings from "$lib/sections/settings/Settings.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { children } = $props();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_settings()}
  mode="content-only"
>
  <Settings>
    {@render children()}
  </Settings>
</TraktPage>
