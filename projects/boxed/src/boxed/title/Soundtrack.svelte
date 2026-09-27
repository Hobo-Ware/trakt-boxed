<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport.ts";
  import SoundtrackLoader from "./_internal/SoundtrackLoader.svelte";
  import SoundtrackPanel from "./_internal/SoundtrackPanel.svelte";

  type SoundtrackProps = {
    slug: string;
    type: MediaType;
    allHref: string;
  };

  const { slug, type, allHref }: SoundtrackProps = $props();

  let isVisible = $state(false);
</script>

<RenderForFeature flag={FeatureFlag.Soundtrack}>
  {#snippet enabled()}
    <section class="boxed-soundtrack-section" use:whenInViewport={() => (isVisible = true)}>
      {#if isVisible}
        <SoundtrackLoader {slug} {type} {allHref} />
      {:else}
        <SoundtrackPanel tracks={null} {allHref} />
      {/if}
    </section>
  {/snippet}
</RenderForFeature>
