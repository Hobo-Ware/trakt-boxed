<script lang="ts">
  import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
  import ProfileFavoritesRow from './_internal/ProfileFavoritesRow.svelte';
  import ProfileHero from './_internal/ProfileHero.svelte';

  type Props = {
    profile: UserProfile;
    slug: string;
    isMe: boolean;
  };

  const { profile, slug, isMe }: Props = $props();
</script>

<div class="letterboxd-profile">
  <ProfileHero {profile} {isMe} />
  <div class="letterboxd-profile__shell">
    <ProfileFavoritesRow {slug} />
  </div>
</div>

<style lang="scss">
  .letterboxd-profile {
    background: var(--shade-1000);
    min-height: 100dvh;

    &__shell {
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 clamp(16px, 3vw, 32px) clamp(40px, 6vw, 80px);
    }
  }
</style>
