<script lang="ts">
  /*
    Official-list detail. Same skeleton as the user-list page,
    but the list summary is fetched via the official-list hook
    (no user namespace). Renders the editorial header + the
    Letterboxd numbered grid feed.
  */
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import LetterboxdListGridFeed from "$lib/sections/lists/user/LetterboxdListGridFeed.svelte";
  import ListActions from "$lib/sections/lists/user/ListActions.svelte";
  import ListDetailHeader from "$lib/sections/lists/user/_internal/ListDetailHeader.svelte";
  import { useListSorting } from "$lib/sections/lists/user/_internal/useListSorting";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";
  import { useListSummary } from "./useListSummary";

  const { params }: PageProps = $props();

  const { list, isLoading } = $derived(
    useListSummary({ listId: params.list }),
  );

  const { mode } = useDiscover();

  const { current } = $derived(
    useListSorting({ list: $list, type: "user-list" }),
  );

  const listName = $derived($list?.name ?? "");
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={listName || m.page_title_lists()}
>
  <TraktPageCoverSetter />

  <NavbarStateSetter hasFilters>
    {#snippet actions()}
      {#if $list}
        <ListActions list={$list} />
      {/if}
    {/snippet}
  </NavbarStateSetter>

  {#if !$isLoading && $list}
    <div class="lb-list-page">
      <ListDetailHeader list={$list} />

      {#if $current?.sorting?.value}
        <LetterboxdListGridFeed
          list={$list}
          type={$mode}
          sortBy={$current.sorting.value}
          sortHow={$current.sortHow}
        />
      {/if}
    </div>
  {/if}
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-list-page {
    width: 100%;
    max-width: var(--ni-1280);
    margin-inline: auto;
    padding: var(--ni-22) var(--ni-16) var(--ni-44);
    box-sizing: border-box;

    @include for-tablet-lg {
      padding-inline: var(--ni-32);
    }
  }
</style>
