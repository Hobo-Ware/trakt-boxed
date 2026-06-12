<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";

  const {
    type,
    src,
    colors,
  }: { type: MediaType; src: string; colors?: [string, string] } = $props();
</script>

<CoverImageSetter {src} {colors} {type} />
