<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UpNextEntry } from "$lib/requests/models/UpNextEntry.ts";
  import { useUpNextList } from "$lib/sections/lists/progress/useUpNextList.ts";
  import UpNextCard from "../../home/UpNextCard.svelte";
  import UpNextSkeleton from "../../home/UpNextSkeleton.svelte";
  import LoadMore from "$boxed/components/LoadMore.svelte";

  const PAGE_SIZE = 24;

  const { list, isLoading, hasNextPage, fetchNextPage } = useUpNextList({
    type: "show",
    limit: PAGE_SIZE,
  });

  const entries = $derived(
    $list.filter((entry): entry is UpNextEntry => "show" in entry),
  );
  const isFirstLoad = $derived($isLoading && entries.length === 0);
</script>

<div class="boxed-up-next-tab">
  {#if isFirstLoad}
    {#each { length: 6 }, index (index)}
      <UpNextSkeleton />
    {/each}
  {:else if entries.length === 0}
    <div class="up-next-empty">
      <UpNextSkeleton hidden />
      <span>{m.boxed_profile_empty()}</span>
    </div>
  {:else}
    {#each entries as entry (entry.show.key)}
      <UpNextCard {entry} />
    {/each}
    {#if $isLoading}
      {#each { length: 3 }, index (index)}
        <UpNextSkeleton />
      {/each}
    {/if}
  {/if}
</div>

<LoadMore
  hasNextPage={$hasNextPage}
  isLoading={$isLoading}
  loadedCount={entries.length}
  onLoad={fetchNextPage}
/>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-up-next-tab {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--gap-l);

    @include for-tablet-sm-and-below {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @include for-mobile {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .up-next-empty {
    position: relative;

    span {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      color: var(--color-text-secondary);
    }
  }
</style>
