<script lang="ts">
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import LetterboxdListView from "$lib/sections/letterboxd-lists/LetterboxdListView.svelte";
  import { useUserListSummary } from "$lib/sections/lists/user/useUserListSummary.ts";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { list } = $derived(
    useUserListSummary({
      userId: params.user,
      listId: params.list,
    }),
  );

  const listName = $derived($list?.name ?? "");
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={listName}
  hasDynamicContent={true}
  mode="content-only"
>
  {#if $list}
    <LetterboxdListView list={$list} />
  {/if}
</TraktPage>
