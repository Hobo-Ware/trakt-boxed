<script lang="ts">
  import ActionCard from "./ActionCard.svelte";
  import TitleHeaderSkeleton from "./TitleHeaderSkeleton.svelte";
  import TitleLayout from "./TitleLayout.svelte";
  import TitlePosterSkeleton from "./TitlePosterSkeleton.svelte";
</script>

<TitleLayout cover={null} ambient={null}>
  {#snippet poster()}<TitlePosterSkeleton />{/snippet}
  {#snippet header()}<TitleHeaderSkeleton />{/snippet}
  {#snippet actions()}
    <ActionCard
      media={undefined}
      streamOn={undefined}
      whereToWatchHref=""
      activityHref=""
      shareText=""
    />
  {/snippet}
  {#snippet main()}{/snippet}
  {#snippet rail()}{/snippet}
</TitleLayout>
