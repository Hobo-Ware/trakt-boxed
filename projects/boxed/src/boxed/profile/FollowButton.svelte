<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";
  import { useFollowUserRequest } from "$lib/sections/profile-banner/useFollowUser.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";

  const { profile, slug }: { profile: UserProfile; slug: string } = $props();

  const {
    followStatus,
    isRequestingFollow,
    followUser,
    unfollowUser,
    cancelFollowRequest,
  } = $derived(useFollowUserRequest(slug));

  const { confirm } = useConfirm();
  const username = $derived(toDisplayableName(profile));
  const confirmUnfollow = $derived(
    confirm({
      type: ConfirmationType.UnfollowUser,
      username,
      onConfirm: unfollowUser,
    }),
  );
</script>

<div class="boxed-follow-button">
  {#if $followStatus === "following"}
    <Button
      label={m.button_label_unfollow({ username })}
      color="default"
      variant="secondary"
      disabled={$isRequestingFollow}
      onclick={confirmUnfollow}
    >
      {m.button_text_following()}
    </Button>
  {:else if $followStatus === "pending"}
    <Button
      label={m.button_label_cancel_follow_request({ username })}
      color="default"
      variant="secondary"
      disabled={$isRequestingFollow}
      onclick={cancelFollowRequest}
    >
      {m.tag_text_follow_request_pending()}
    </Button>
  {:else}
    <Button
      label={m.button_label_follow({ username })}
      color="purple"
      variant="primary"
      disabled={$isRequestingFollow}
      onclick={followUser}
    >
      {m.button_text_follow()}
    </Button>
  {/if}
</div>

<style>
  .boxed-follow-button {
    display: flex;
    min-width: var(--ni-104);

    :global(.trakt-button) {
      flex: 1;
    }
  }
</style>
