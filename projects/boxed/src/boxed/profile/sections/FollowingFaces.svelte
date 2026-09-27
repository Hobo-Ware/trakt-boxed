<script lang="ts">
  import { useFollowing } from "$lib/sections/profile/stores/useFollowing.ts";
  import FacesGrid from "./FacesGrid.svelte";

  const { slug }: { slug: string } = $props();

  const { profiles, isLoading } = $derived(useFollowing(slug, "following"));
</script>

<FacesGrid profiles={$isLoading && $profiles.length === 0 ? null : $profiles} />
