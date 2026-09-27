<script lang="ts">
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import ListEditor from "$boxed/lists/ListEditor.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const { user } = useUser();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_create_list()}
>
  <PageContainer>
    <ListEditor
      list={null}
      isPrivateByDefault={Boolean($user?.isPrivate)}
      cancelHref={UrlBuilder.lists.user("me")}
    />
  </PageContainer>
</TraktPage>
