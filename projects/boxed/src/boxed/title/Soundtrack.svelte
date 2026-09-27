<script lang="ts">
  import InView from "$boxed/components/InView.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import SoundtrackLoader from "./_internal/SoundtrackLoader.svelte";
  import SoundtrackPanel from "./_internal/SoundtrackPanel.svelte";

  type SoundtrackProps = {
    slug: string;
    type: MediaType;
    allHref: string;
  };

  const { slug, type, allHref }: SoundtrackProps = $props();
</script>

<RenderForFeature flag={FeatureFlag.Soundtrack}>
  {#snippet enabled()}
    <section class="boxed-soundtrack-section">
      <InView>
        {#snippet placeholder()}
          <SoundtrackPanel tracks={null} {allHref} />
        {/snippet}
        <SoundtrackLoader {slug} {type} {allHref} />
      </InView>
    </section>
  {/snippet}
</RenderForFeature>
