<script lang="ts">
  import { getDisplayableRatings } from "$lib/components/summary/_internal/getDisplayableRatings";
  import {
    type MetaInfoProps,
    useMediaMetaInfo,
  } from "../media/useMediaMetaInfo.ts";
  import RatingsDistribution from "./_internal/RatingsDistribution.svelte";

  const props: MetaInfoProps = $props();

  const entry = $derived(
    props.type === "episode" ? props.episode : props.media,
  );

  const { ratings: rawRatings } = $derived(useMediaMetaInfo(props));

  const ratings = $derived(
    getDisplayableRatings({ ratings: $rawRatings, entry }),
  );
</script>

{#if ratings.trakt}
  <RatingsDistribution trakt={ratings.trakt} />
{/if}
