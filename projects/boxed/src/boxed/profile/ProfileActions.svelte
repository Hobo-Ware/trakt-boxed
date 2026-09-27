<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";
  import MatchPill from "$lib/sections/profile/components/MatchPill.svelte";
  import ProfileOverflowMenu from "$lib/sections/profile-banner/ProfileOverflowMenu.svelte";
  import FollowButton from "./FollowButton.svelte";

  const { profile, slug }: { profile: UserProfile; slug: string } = $props();
</script>

<RenderFor audience="authenticated">
  <div class="boxed-profile-actions">
    <span class="actions-match"><MatchPill {slug} /></span>
    <FollowButton {profile} {slug} />
    <ProfileOverflowMenu {profile} {slug} />
  </div>
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-profile-actions {
    height: var(--ni-52);
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    .actions-match {
      display: flex;
      align-items: center;
      width: var(--ni-160);
    }

    @include for-mobile {

      :global(.boxed-follow-button) {
        order: -1;
        flex: 1;
      }
    }
  }
</style>
