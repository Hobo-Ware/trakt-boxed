<script lang="ts">
  import ProfileShell from "$boxed/profile/ProfileShell.svelte";
  import ListsView from "$boxed/profile/lists/ListsView.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

{#key params.slug}
  <ProfileShell slug={params.slug} tab="lists">
    {#snippet children(context)}
      <ListsView {context} />
    {/snippet}
  </ProfileShell>
{/key}
