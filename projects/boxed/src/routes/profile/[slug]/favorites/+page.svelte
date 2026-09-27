<script lang="ts">
  import LikesView from "$boxed/profile/likes/LikesView.svelte";
  import ProfileShell from "$boxed/profile/ProfileShell.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

{#key params.slug}
  <ProfileShell
    slug={params.slug}
    tab="likes"
    title={(name) => m.boxed_profile_likes_title({ name })}
  >
    {#snippet children(context)}
      <LikesView {context} />
    {/snippet}
  </ProfileShell>
{/key}
