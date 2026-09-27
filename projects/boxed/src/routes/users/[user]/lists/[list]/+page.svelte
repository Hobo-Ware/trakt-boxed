<script lang="ts">
  import ListDetail from "$boxed/lists/ListDetail.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { useUserListSummary } from "$lib/sections/lists/user/useUserListSummary.ts";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { list, isLoading } = $derived(
    useUserListSummary({ userId: params.user, listId: params.list }),
  );

  const { user } = useUser();
  const isOwner = $derived(Boolean($list && $user?.slug === $list.user.slug));
  const listHref = $derived(UrlBuilder.users(params.user).lists(params.list));

  const isMissing = $derived(!$isLoading && $list == null);
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={$list?.name ?? ""}
  hasDynamicContent={true}
  isIndexable={!isMissing}
>
  <ListDetail
    list={$list}
    editHref={isOwner ? `${listHref}/edit` : undefined}
  />
</TraktPage>
