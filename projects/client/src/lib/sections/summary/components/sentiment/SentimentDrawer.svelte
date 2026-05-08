<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import { fade } from "svelte/transition";
  import SentimentContent from "./_internal/SentimentContent.svelte";

  const {
    onClose,
    sentiment,
  }: {
    sentiment: SentimentAnalysis;
    onClose: () => void;
  } = $props();

  let isOpen = $state(false);
</script>

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.header_community_sentiment()}
  size="auto"
>
  {#if isOpen}
    <div transition:fade={{ duration: 150 }}>
      <SentimentContent {sentiment} />
    </div>
  {/if}
</Drawer>
