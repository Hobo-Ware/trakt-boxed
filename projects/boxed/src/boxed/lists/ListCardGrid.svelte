<script lang="ts">
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import ListCard from "./ListCard.svelte";
  import ListCardSkeleton from "./ListCardSkeleton.svelte";

  type ListCardGridProps = {
    lists: ReadonlyArray<MediaListSummary> | null;
    skeletonCount?: number;
    emptyText: string;
    reserveItems?: number;
  };

  const {
    lists,
    skeletonCount = 4,
    emptyText,
    reserveItems = 0,
  }: ListCardGridProps = $props();
</script>

<ul
  class="boxed-list-grid"
  style:--reserve-rows-wide={Math.ceil(reserveItems / 2)}
  style:--reserve-rows-narrow={reserveItems}
>
  {#if lists === null}
    {#each { length: skeletonCount }, index (index)}
      <li><ListCardSkeleton /></li>
    {/each}
  {:else if lists.length === 0}
    <li class="boxed-list-grid-empty">
      <span class="boxed-list-grid-placeholder"><ListCardSkeleton /></span>
      <span class="boxed-list-grid-text">{emptyText}</span>
    </li>
  {:else}
    {#each lists as list (list.key)}
      <li><ListCard {list} /></li>
    {/each}
  {/if}
</ul>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-list-grid {
    margin: 0;
    padding: 0;
    list-style: none;

    --list-card-height: var(--ni-112);

    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: minmax(var(--list-card-height), auto);
    align-content: start;
    gap: var(--gap-m) var(--gap-xl);
    min-height: calc(
      var(--reserve-rows-wide) * var(--list-card-height) +
        max(var(--reserve-rows-wide) - 1, 0) * var(--gap-m)
    );

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
      min-height: calc(
        var(--reserve-rows-narrow) * var(--list-card-height) +
          max(var(--reserve-rows-narrow) - 1, 0) * var(--gap-m)
      );
    }
  }

  .boxed-list-grid-empty {
    position: relative;
    grid-column: 1 / -1;
  }

  .boxed-list-grid-placeholder {
    display: block;
    visibility: hidden;
  }

  .boxed-list-grid-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    padding-inline: var(--ni-8);
    color: var(--color-text-secondary);
  }
</style>
