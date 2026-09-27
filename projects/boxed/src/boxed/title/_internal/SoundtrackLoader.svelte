<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { useSoundtrack } from "$lib/sections/summary/components/soundtrack/useSoundtrack.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import SoundtrackPanel from "./SoundtrackPanel.svelte";

  type SoundtrackLoaderProps = {
    slug: string;
    type: MediaType;
    allHref: string;
  };

  const { slug, type, allHref }: SoundtrackLoaderProps = $props();

  const { tracks, isLoading } = useSoundtrack(fromRune(() => ({ slug, type })));
</script>

<SoundtrackPanel tracks={$isLoading ? null : $tracks} {allHref} />
