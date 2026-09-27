<script lang="ts">
  import InView from "$boxed/components/InView.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import SectionHeader from "../components/SectionHeader.svelte";
  import TriviaGrid from "./_internal/TriviaGrid.svelte";
  import TriviaLoader from "./_internal/TriviaLoader.svelte";

  type TriviaCardsProps = {
    slug: string;
    type: MediaType;
    allHref: string;
  };

  const { slug, type, allHref }: TriviaCardsProps = $props();
</script>

<section class="boxed-trivia">
  <InView>
    {#snippet placeholder()}
      <SectionHeader title={m.boxed_title_did_you_know()} />
      <TriviaGrid facts={null} />
    {/snippet}
    <TriviaLoader {slug} {type} {allHref} />
  </InView>
</section>
