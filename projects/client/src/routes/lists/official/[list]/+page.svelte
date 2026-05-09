<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import LetterboxdListGrid from "$lib/sections/lists/user/LetterboxdListGrid.svelte";
  import ListDetailHeader from "$lib/sections/lists/user/_internal/ListDetailHeader.svelte";
  import { useListSorting } from "$lib/sections/lists/user/_internal/useListSorting";
  import { useListItems } from "$lib/sections/lists/user/useListItems";
  import ListActions from "$lib/sections/lists/user/ListActions.svelte";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "../[list]/$types";
  import { useListSummary } from "./useListSummary";

  const { params }: PageProps = $props();

  const { mode, current: currentDiscoverMode } = useDiscover();
  const { filterMap } = useFilter();

  const { list, isLoading } = $derived(
    useListSummary({
      listId: params.list,
    }),
  );

  const listName = $derived($list?.name ?? "");

  const { current, update, options, urlBuilder } = $derived(
    useListSorting({ list: $list, type: "user-list" }),
  );
</script>

{#snippet actions()}
  {#if $list}
    <ListActions list={$list} />
  {/if}
{/snippet}

{#snippet listBody(currentList: NonNullable<typeof $list>)}
  {@const itemsQuery = useListItems({
    list: currentList,
    type: $mode === "media" ? undefined : $mode,
    sortBy: $current.sorting.value,
    sortHow: $current.sortHow,
    filter: $filterMap,
  })}
  {@const itemsObservable = itemsQuery.list}
  {@const hasNextPageObservable = itemsQuery.hasNextPage}
  <LetterboxdListGrid
    items={$itemsObservable ?? []}
    hasNextPage={$hasNextPageObservable ?? false}
    onLoadMore={itemsQuery.fetchNextPage}
  />
{/snippet}

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={listName}
  hasDynamicContent={true}
>
  <TraktPageCoverSetter />

  <NavbarStateSetter
    hasFilters
    header={{
      title: listName,
      metaInfo: $currentDiscoverMode.text(),
      actions,
    }}
  >
    {#snippet headerActions()}
      <ListSortActions
        {options}
        {urlBuilder}
        current={$current}
        onUpdate={update}
        disabled={$isLoading}
      />
    {/snippet}
  </NavbarStateSetter>

  {#if !$isLoading && $list}
    <ListDetailHeader list={$list} />
    {@render listBody($list)}
  {/if}
</TraktPage>
