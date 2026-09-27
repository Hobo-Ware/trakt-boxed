<script lang="ts">
  import ProfileShell from "$boxed/profile/ProfileShell.svelte";
  import WatchlistView from "$boxed/profile/watchlist/WatchlistView.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

{#key params.slug}
  <ProfileShell slug={params.slug} tab="watchlist">
    {#snippet children(context)}
      <WatchlistView {context} />
    {/snippet}
  </ProfileShell>
{/key}
