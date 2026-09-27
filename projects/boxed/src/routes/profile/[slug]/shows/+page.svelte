<script lang="ts">
  import ProfileShell from "$boxed/profile/ProfileShell.svelte";
  import WatchedView from "$boxed/profile/watched/WatchedView.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

{#key params.slug}
  <ProfileShell slug={params.slug} tab="shows">
    {#snippet children(context)}
      <WatchedView {context} type="show" />
    {/snippet}
  </ProfileShell>
{/key}
