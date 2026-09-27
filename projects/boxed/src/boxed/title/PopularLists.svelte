<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport.ts";
  import SectionHeader from "../components/SectionHeader.svelte";
  import ListCardSkeleton from "./_internal/ListCardSkeleton.svelte";
  import ListsLoader from "./_internal/ListsLoader.svelte";

  const COUNT = 3;

  type PopularListsProps = {
    slug: string;
    title: string;
    type: MediaType;
    moreHref: string;
  };

  const { slug, title, type, moreHref }: PopularListsProps = $props();

  let isVisible = $state(false);
</script>

<section class="boxed-popular-lists" use:whenInViewport={() => (isVisible = true)}>
  <SectionHeader title={m.list_title_popular_lists()} href={moreHref} />
  <div class="boxed-popular-lists-items">
    {#if isVisible}
      <ListsLoader {slug} {title} {type} count={COUNT} />
    {:else}
      {#each { length: COUNT }, index (index)}
        <ListCardSkeleton />
      {/each}
    {/if}
  </div>
</section>

<style>
  .boxed-popular-lists-items {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
  }
</style>
