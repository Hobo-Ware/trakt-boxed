<script lang="ts">
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import ListEditor from "$boxed/lists/ListEditor.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { useUserListSummary } from "$lib/sections/lists/user/useUserListSummary.ts";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { user } = useUser();
  const { list, isLoading } = $derived(
    useUserListSummary({ userId: params.user, listId: params.list }),
  );

  const listHref = $derived(UrlBuilder.users(params.user).lists(params.list));
  const isOwner = $derived(Boolean($list && $user?.slug === $list.user.slug));
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_edit_list()}
>
  <PageContainer>
    {#if $list && isOwner}
      {#key $list.slug}
        <ListEditor list={$list} isPrivateByDefault={false} cancelHref={listHref} />
      {/key}
    {:else if $list && !$isLoading}
      <Redirect to={listHref} />
    {:else}
      <div class="boxed-list-editor-skeleton" aria-hidden="true">
        <Skeleton width="40%" height="var(--ni-48)" />
        <Skeleton height="var(--ni-72)" />
        <Skeleton height="var(--ni-160)" />
        <Skeleton width="var(--ni-200)" height="var(--ni-40)" />
      </div>
    {/if}
  </PageContainer>
</TraktPage>

<style>
  .boxed-list-editor-skeleton {
    max-width: var(--ni-640);
    display: flex;
    flex-direction: column;
    gap: var(--ni-20);
  }
</style>
