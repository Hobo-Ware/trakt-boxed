<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { useRelatedList } from "$lib/sections/lists/stores/useRelatedList.ts";
  import PosterGrid from "../../poster/PosterGrid.svelte";

  type SimilarLoaderProps = {
    slug: string;
    type: MediaType;
    count: number;
  };

  const { slug, type, count }: SimilarLoaderProps = $props();

  const { list, isLoading } = $derived(
    useRelatedList({ slug, type, limit: count }),
  );

  const items = $derived($isLoading ? null : $list.slice(0, count));
</script>

<PosterGrid {items} columns={count} skeletonCount={count} showUserMeta />
