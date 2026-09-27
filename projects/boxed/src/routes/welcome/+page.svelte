<script lang="ts">
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import WelcomeFinish from "$boxed/welcome/WelcomeFinish.svelte";
  import WelcomeHero from "$boxed/welcome/WelcomeHero.svelte";
  import WelcomeImportStep from "$boxed/welcome/WelcomeImportStep.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_welcome()}
  mode="content-only"
>
  <WelcomeHero />
  <PageContainer>
    <WelcomeImportStep />
    <WelcomeFinish />
  </PageContainer>
</TraktPage>
