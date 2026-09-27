<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";
  import type { Snippet } from "svelte";
  import ProfileAvatar from "./ProfileAvatar.svelte";
  import ProfileName from "./ProfileName.svelte";

  const {
    profile,
    actions,
    showAbout = true,
  }: { profile: UserProfile | Nil; actions?: Snippet; showAbout?: boolean } =
    $props();
</script>

<div class="boxed-profile-identity">
  <ProfileAvatar {profile} size="large" />
  <div class="identity-details">
    <ProfileName {profile} size="large" />
    {#if showAbout}
      <p class="identity-about" data-hj-suppress>{profile?.about ?? ""}</p>
      <div class="identity-chips">
        {#if profile?.location}
          <span class="identity-chip" data-hj-suppress>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z" />
              <circle cx="12" cy="10" r="2" />
            </svg>
            {profile.location}
          </span>
        {/if}
        {#if profile?.joinedAt}
          <span class="identity-chip">
            {m.boxed_profile_member_since({
              year: profile.joinedAt.getFullYear(),
            })}
          </span>
        {/if}
      </div>
    {/if}
  </div>
  {#if actions}
    <div class="identity-actions">{@render actions()}</div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-profile-identity {
    position: relative;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: end;
    gap: var(--gap-l);

    margin-top: calc(-1 * var(--ni-64));

    @include for-mobile {
      grid-template-columns: minmax(0, 1fr);
      align-items: start;
      gap: var(--gap-s);
      margin-top: calc(-1 * var(--ni-44));
    }
  }

  .identity-details {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
    min-width: 0;
  }

  .identity-about {
    margin: 0;
    height: calc(2 * 1.5em);
    font-size: var(--ni-14);
    line-height: 1.5;
    color: var(--color-text-primary);

    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .identity-chips {
    height: var(--ni-28);
    display: flex;
    gap: var(--gap-xs);
    overflow: hidden;
  }

  .identity-chip {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);
    height: var(--ni-28);
    padding-inline: var(--ni-12);
    border-radius: var(--border-radius-xxl);
    background: var(--color-input-background);
    font-size: var(--ni-12);
    color: var(--color-text-secondary);

    svg {
      width: var(--ni-14);
      height: var(--ni-14);
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
    }
  }

  .identity-actions {
    min-height: var(--ni-52);
    display: flex;
    align-items: center;
  }
</style>
