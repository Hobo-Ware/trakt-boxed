<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport.ts";
  import SectionHeader from "../components/SectionHeader.svelte";
  import TriviaGrid from "./_internal/TriviaGrid.svelte";
  import TriviaLoader from "./_internal/TriviaLoader.svelte";

  type TriviaCardsProps = {
    slug: string;
    type: MediaType;
    allHref: string;
  };

  const { slug, type, allHref }: TriviaCardsProps = $props();

  let isVisible = $state(false);
</script>

<section class="boxed-trivia" use:whenInViewport={() => (isVisible = true)}>
  {#if isVisible}
    <TriviaLoader {slug} {type} {allHref} />
  {:else}
    <SectionHeader title={m.boxed_title_did_you_know()} />
    <TriviaGrid facts={null} />
  {/if}
</section>
