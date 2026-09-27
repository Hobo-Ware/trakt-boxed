<script lang="ts">
  import ProfileShell from "$boxed/profile/ProfileShell.svelte";
  import WatchingView from "$boxed/profile/watching/WatchingView.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

{#key params.slug}
  <ProfileShell slug={params.slug} tab="watching">
    {#snippet children(context)}
      <WatchingView {context} />
    {/snippet}
  </ProfileShell>
{/key}
