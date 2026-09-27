<script lang="ts">
  import DiaryView from "$boxed/profile/diary/DiaryView.svelte";
  import ProfileShell from "$boxed/profile/ProfileShell.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

{#key params.slug}
  <ProfileShell
    slug={params.slug}
    tab="diary"
    title={(name) => m.boxed_profile_diary_title({ name })}
  >
    {#snippet children(context)}
      <DiaryView {context} />
    {/snippet}
  </ProfileShell>
{/key}
