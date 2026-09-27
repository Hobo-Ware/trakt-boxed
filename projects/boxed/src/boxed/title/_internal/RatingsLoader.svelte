<script lang="ts">
  import {
    type MetaInfoProps,
    useMediaMetaInfo,
  } from "$lib/sections/summary/components/media/useMediaMetaInfo.ts";
  import RatingsPanel from "./RatingsPanel.svelte";

  type RatingsLoaderProps = {
    metaInfo: MetaInfoProps;
    votes: number;
    userRating: number | null;
  };

  const { metaInfo, votes, userRating }: RatingsLoaderProps = $props();

  const { ratings, isLoading } = $derived(useMediaMetaInfo(metaInfo));
</script>

<RatingsPanel ratings={$isLoading ? null : $ratings} {votes} {userRating} />
