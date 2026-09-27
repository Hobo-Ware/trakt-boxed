<script lang="ts">
  import MembersLeaderboard from "$boxed/members/MembersLeaderboard.svelte";
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.boxed_nav_members()}
>
  <PageContainer>
    <header class="boxed-members-header">
      <h1>{m.boxed_nav_members()}</h1>
      <p>{m.boxed_members_intro()}</p>
    </header>

    <MembersLeaderboard />
  </PageContainer>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-members-header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    h1 {
      @include boxed-page-title;
    }

    p {
      margin: 0;
      color: var(--color-text-secondary);
    }
  }
</style>
