<script lang="ts">
  import type { Snippet } from "svelte";
  import InView from "./InView.svelte";
  import SectionHeader from "./SectionHeader.svelte";

  type LazySectionProps = {
    title: string;
    href?: string;
    children: Snippet;
    skeleton: Snippet;
  };

  const { title, href, children, skeleton }: LazySectionProps = $props();
</script>

<InView>
  <SectionHeader {title} {href} />
  {@render children()}
  {#snippet placeholder()}
    <SectionHeader {title} {href} />
    {@render skeleton()}
  {/snippet}
</InView>
