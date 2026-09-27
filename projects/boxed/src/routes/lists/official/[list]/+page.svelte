<script lang="ts">
  import ListDetail from "$boxed/lists/ListDetail.svelte";
  import { useListSummary } from "$clientRoutes/lists/official/[list]/useListSummary.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { list, isLoading } = $derived(
    useListSummary({ listId: params.list }),
  );

  const isMissing = $derived(!$isLoading && $list == null);
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={$list?.name ?? ""}
  hasDynamicContent={true}
  isIndexable={!isMissing}
>
  <ListDetail list={$list} showOwner={false} />
</TraktPage>
