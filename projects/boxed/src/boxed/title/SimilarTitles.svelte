<script lang="ts">
  import InView from "$boxed/components/InView.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
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
</script>

<section class="boxed-similar">
  <SectionHeader {title} href={moreHref} />
  <InView>
    {#snippet placeholder()}
      <PosterGrid items={null} columns={COUNT} skeletonCount={COUNT} showUserMeta />
    {/snippet}
    <SimilarLoader {slug} {type} count={COUNT} />
  </InView>
</section>
