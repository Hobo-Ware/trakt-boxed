<script lang="ts">
  /*
    The cinematic backdrop hero. Sits at the very top of a media page,
    fades into the page background. No text overlays the image — title
    and meta come below in a separate stack.

    Reference: ../../../letterboxd-research/notes/film-summary.md.
    Letterboxd uses a near-full-width still that fades to background;
    centred composition is preserved through the X / LinkedIn 5-10%
    edge crop because the bottom and side fades hug the safe area.
  */
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  type MediaCoverHeroProps = {
    src: string | Nil;
    alt: string;
  };

  const { src, alt }: MediaCoverHeroProps = $props();
</script>

{#if src}
  <div class="summary-hero">
    <CrossOriginImage classList="summary-hero-image" {src} {alt} />
    <div class="summary-hero-fade"></div>
  </div>
{/if}
