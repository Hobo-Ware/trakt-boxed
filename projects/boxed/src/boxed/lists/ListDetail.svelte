<script lang="ts">
  import { toProfileHref } from "$boxed/utils/toProfileHref.ts";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import ListActions from "$lib/sections/lists/user/ListActions.svelte";
  import type { SortBy } from "$lib/sections/lists/user/models/SortBy.ts";
  import type { SortDirection } from "$lib/sections/lists/user/models/SortDirection.ts";
  import { useListItems } from "$lib/sections/lists/user/useListItems.ts";
  import { DEFAULT_DRILL_SIZE } from "$lib/utils/constants.ts";
  import { map } from "rxjs";
  import ChartGrid from "../browse/ChartGrid.svelte";
  import ModeSwitch from "../browse/ModeSwitch.svelte";
  import PageContainer from "../components/PageContainer.svelte";
  import PosterGrid from "../poster/PosterGrid.svelte";
  import type { PosterMedia } from "../poster/PosterMedia.ts";
  import { toListPoster } from "./_internal/toListPoster.ts";

  type ListDetailProps = {
    list: MediaListSummary | undefined;
    editHref?: string;
    showOwner?: boolean;
  };

  const { list, editHref, showOwner = true }: ListDetailProps = $props();

  const { mode } = useDiscover();

  const items = $derived(
    list
      ? useListItems({
          list,
          type: $mode,
          sortBy: list.sortBy as SortBy,
          sortHow: list.sortHow as SortDirection,
          limit: DEFAULT_DRILL_SIZE,
        })
      : null,
  );

  const posters = $derived(
    items?.list.pipe(map(($items) => $items.map(toListPoster))) ?? null,
  );
  const rankByKey = $derived(
    items?.list.pipe(
      map(($items) =>
        new Map($items.map((item) => [item.key, item.rank]))
      ),
    ) ?? null,
  );

  const isRanked = $derived(list?.sortBy === "rank");
</script>

{#snippet rankMeta(media: PosterMedia)}
  <span class="boxed-list-rank">{$rankByKey?.get(media.key) ?? ""}</span>
{/snippet}

<PageContainer>
  <header class="boxed-list-header">
    {#if list}
      {#if showOwner}
        <a
          class="boxed-list-owner"
          href={toProfileHref(list.user)}
          data-hj-suppress
        >
          <img src={list.user.avatar.url} alt="" width="28" height="28" />
          <span>{list.user.username}</span>
        </a>
      {/if}
      <h1 title={list.name}>{list.name}</h1>
      <p class="boxed-list-description" title={list.description ?? undefined}>
        {list.description ?? ""}
      </p>
    {:else}
      {#if showOwner}
        <Skeleton width="var(--ni-120)" height="var(--ni-28)" />
      {/if}
      <h1><Skeleton width="50%" height="1em" /></h1>
      <p class="boxed-list-description" aria-hidden="true">
        <Skeleton width="80%" height="1em" />
      </p>
    {/if}
    <div class="boxed-list-bar">
      <span class="boxed-list-meta">
        {#if list}{m.label_list_item_count({ count: list.count })}{/if}
      </span>
      <div class="boxed-list-actions">
        {#if list && editHref}
          <a class="boxed-list-edit" href={editHref}>
            {m.button_text_edit_list()}
          </a>
        {/if}
        {#if list}<ListActions {list} />{/if}
        <ModeSwitch />
      </div>
    </div>
  </header>

  {#if items && posters}
    <ChartGrid
      list={posters}
      isLoading={items.isLoading}
      hasNextPage={items.hasNextPage}
      fetchNextPage={items.fetchNextPage}
      emptyText={m.text_placeholder_generic()}
      meta={isRanked ? rankMeta : undefined}
    />
  {:else}
    <PosterGrid items={null} columns={8} skeletonCount={24} showUserMeta />
  {/if}
</PageContainer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-list-header {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);

    h1 {
      min-height: 1.2em;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-40);
      font-weight: 600;
      line-height: 1.2;

      @include for-mobile {
        font-size: var(--ni-28);
      }
    }
  }

  .boxed-list-owner {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
    align-self: flex-start;
    color: var(--color-text-secondary);
    font-size: var(--ni-14);
    text-decoration: none;

    img {
      width: var(--ni-28);
      height: var(--ni-28);
      border-radius: 50%;
      object-fit: cover;
      background: var(--color-input-background);
    }
  }

  .boxed-list-description {
    margin: 0;
    max-width: 72ch;
    font-size: var(--ni-16);
    line-height: 1.6;
    color: var(--color-text-secondary);
    height: 3.2em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .boxed-list-bar {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "bar";
    align-items: center;

    > * {
      grid-area: bar;
    }

    @include for-mobile {
      grid-template-areas:
        "meta"
        "actions";
      gap: var(--gap-s);

      .boxed-list-meta {
        grid-area: meta;
      }

      .boxed-list-actions {
        grid-area: actions;
      }
    }
    padding-bottom: var(--ni-12);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);
  }

  .boxed-list-meta {
    justify-self: start;
    min-height: 1.4em;
    line-height: 1.4;
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }

  .boxed-list-actions {
    justify-self: stretch;
    min-height: var(--ni-44);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--gap-s);
  }

  .boxed-list-edit {
    @include for-mobile {
      display: none;
    }

    height: var(--ni-32);
    padding-inline: var(--ni-14);
    display: inline-flex;
    align-items: center;
    border-radius: var(--border-radius-s);
    background: var(--color-input-background);
    color: var(--color-text-primary);
    font-size: var(--ni-14);
    font-weight: 600;
    text-decoration: none;
  }

  .boxed-list-rank {
    font-size: var(--ni-16);
    font-weight: 600;
    color: var(--color-text-secondary);
  }
</style>
