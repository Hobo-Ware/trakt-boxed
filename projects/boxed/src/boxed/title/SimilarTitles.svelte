<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport.ts";
  import SectionHeader from "../components/SectionHeader.svelte";
  import PosterGrid from "../poster/PosterGrid.svelte";
  import SimilarLoader from "./_internal/SimilarLoader.svelte";

  const COUNT = 6;

  type SimilarTitlesProps = {
    title: string;
    slug: string;
    type: MediaType;
    moreHref: string;
  };

  const { title, slug, type, moreHref }: SimilarTitlesProps = $props();

  let isVisible = $state(false);
</script>

<section class="boxed-similar" use:whenInViewport={() => (isVisible = true)}>
  <SectionHeader {title} href={moreHref} />
  {#if isVisible}
    <SimilarLoader {slug} {type} count={COUNT} />
  {:else}
    <PosterGrid items={null} columns={COUNT} skeletonCount={COUNT} showUserMeta />
  {/if}
</section>
