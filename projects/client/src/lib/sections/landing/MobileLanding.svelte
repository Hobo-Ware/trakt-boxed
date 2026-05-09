<script lang="ts">
  /*
    Mobile reuses the same Letterboxd-flavour landing as desktop —
    Landing.svelte is responsive (single column on small viewports,
    hero fluid, feature grid 1-up). This file just re-exports for
    the existing +page.svelte's RenderFor branching.
  */
  import Landing from "./Landing.svelte";
</script>

<Landing />
