<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";

  const {
    profile,
    size,
  }: { profile: UserProfile | Nil; size: "normal" | "large" } = $props();
</script>

<div class="boxed-profile-name" data-size={size} data-hj-suppress>
  {#if profile}
    <h1>{toDisplayableName(profile)}</h1>
    {#if profile.isVip}
      <span class="profile-vip">{m.tag_text_vip()}</span>
    {/if}
    <span class="profile-handle">@{profile.username}</span>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-profile-name {
    --name-size: var(--ni-24);

    height: calc(var(--name-size) * 1.2);
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    min-width: 0;

    &[data-size="large"] {
      --name-size: var(--ni-40);

      @include for-mobile {
        --name-size: var(--ni-28);
      }
    }

    h1 {
      margin: 0;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      font-family: var(--boxed-font-title);
      font-size: var(--name-size);
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: -0.01em;
    }
  }

  .profile-vip {
    flex-shrink: 0;
    padding: var(--ni-2) var(--ni-6);
    border-radius: var(--border-radius-xs);
    background: var(--purple-500);
    color: var(--shade-10);
    font-size: var(--ni-11);
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .profile-handle {
    flex-shrink: 0;
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);

    @include for-mobile {
      display: none;
    }
  }
</style>
