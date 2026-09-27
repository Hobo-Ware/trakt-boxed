<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { useListSummary } from "$lib/sections/summary/components/lists/useListSummary.ts";
  import ListCard from "./ListCard.svelte";
  import ListCardSkeleton from "./ListCardSkeleton.svelte";

  type ListsLoaderProps = {
    slug: string;
    title: string;
    type: MediaType;
    count: number;
    paginate?: boolean;
  };

  const { slug, title, type, count, paginate = false }: ListsLoaderProps = $props();

  const { list, isLoading, hasNextPage, fetchNextPage } = $derived(
    useListSummary({ slug, type, limit: count }),
  );

  let hasSettled = $state(false);

  $effect(() => {
    if (!$isLoading) hasSettled = true;
  });

  const lists = $derived(paginate ? $list : $list.slice(0, count));
  const isFirstLoad = $derived(!hasSettled);
</script>

{#if isFirstLoad}
  {#each { length: count }, index (index)}
    <ListCardSkeleton />
  {/each}
{:else if lists.length === 0}
  <p class="boxed-lists-empty">{m.list_placeholder_popular_lists({ title })}</p>
{:else}
  {#each lists as item (item.key)}
    <ListCard list={item} />
  {/each}
  {#if paginate && $hasNextPage}
    <button
      class="boxed-lists-more"
      type="button"
      disabled={$isLoading}
      onclick={() => fetchNextPage()}
    >
      {m.button_text_load_more()}
    </button>
  {/if}
{/if}

<style>
  .boxed-lists-empty {
    margin: 0;
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }

  .boxed-lists-more {
    align-self: center;
    height: var(--ni-36);
    padding: 0 var(--ni-16);

    border: var(--border-thickness-xxs) solid var(--color-border);
    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    color: var(--color-text-primary);
    cursor: pointer;

    font: inherit;
    font-size: var(--ni-14);
  }
</style>
