<script lang="ts">
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";

  const {
    profile,
    size,
  }: { profile: UserProfile | Nil; size: "small" | "large" } = $props();
</script>

<span class="boxed-profile-avatar" data-size={size}>
  {#if profile}
    <img
      src={profile.avatar.url}
      alt=""
      width="128"
      height="128"
      loading="eager"
      decoding="async"
    />
  {/if}
</span>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-profile-avatar {
    --avatar-size: var(--ni-48);

    flex-shrink: 0;
    display: block;
    width: var(--avatar-size);
    height: var(--avatar-size);
    border-radius: 50%;
    overflow: hidden;
    background: var(--color-card-background);
    box-shadow: 0 0 0 var(--border-thickness-s) var(--color-background);

    &[data-size="large"] {
      --avatar-size: var(--ni-128);

      @include for-mobile {
        --avatar-size: var(--ni-88);
      }
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
