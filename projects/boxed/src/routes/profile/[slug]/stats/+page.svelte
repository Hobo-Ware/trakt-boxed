<script lang="ts">
  import ProfileShell from "$boxed/profile/ProfileShell.svelte";
  import StatsView from "$boxed/stats/StatsView.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

{#key params.slug}
  <ProfileShell
    slug={params.slug}
    tab="stats"
    title={(name) => m.boxed_stats_page_title({ name })}
  >
    {#snippet children(context)}
      <StatsView {context} />
    {/snippet}
  </ProfileShell>
{/key}
