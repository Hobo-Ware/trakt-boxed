<script lang="ts">
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import LegalReader from "$boxed/static/LegalReader.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import Privacy from "$lib/sections/privacy/Privacy.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_privacy()}
>
  <PageContainer>
    <LegalReader>
      <Privacy />
    </LegalReader>
  </PageContainer>
</TraktPage>
