<script lang="ts">
  import ProfileOverview from "$boxed/profile/ProfileOverview.svelte";
  import ProfileShell from "$boxed/profile/ProfileShell.svelte";
</script>

<ProfileShell slug="me" tab="profile" variant="full">
  {#snippet children(context)}
    <ProfileOverview {context} />
  {/snippet}
</ProfileShell>
