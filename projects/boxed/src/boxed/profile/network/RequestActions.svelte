<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";
  import { useFollowUserRequest } from "$lib/sections/profile-banner/useFollowUser.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";

  const { profile, slug }: { profile: UserProfile; slug: string } = $props();

  const {
    incomingFollowRequest,
    isRequestingFollow,
    approveIncomingFollowRequest,
    denyIncomingFollowRequest,
  } = $derived(useFollowUserRequest(slug));

  const username = $derived(toDisplayableName(profile));
</script>

<div class="boxed-request-actions">
  {#if $incomingFollowRequest}
    {@const id = $incomingFollowRequest.id}
    <Button
      label={m.button_label_approve_follow_request({ username })}
      color="purple"
      variant="primary"
      size="small"
      disabled={$isRequestingFollow}
      onclick={() => approveIncomingFollowRequest(id)}
    >
      {m.button_text_approve_follow_request()}
    </Button>
    <Button
      label={m.button_label_reject_follow_request({ username })}
      color="default"
      variant="secondary"
      size="small"
      disabled={$isRequestingFollow}
      onclick={() => denyIncomingFollowRequest(id)}
    >
      {m.button_text_reject_follow_request()}
    </Button>
  {/if}
</div>

<style>
  .boxed-request-actions {
    display: flex;
    gap: var(--gap-xs);
    min-height: var(--ni-32);
  }
</style>
