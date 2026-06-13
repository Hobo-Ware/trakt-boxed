<script lang="ts">
  import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
  import * as m from '$lib/features/i18n/messages.ts';

  type Props = {
    profile: UserProfile;
    isMe: boolean;
  };

  const { profile, isMe }: Props = $props();

  const displayName = $derived(profile.name?.full || `@${profile.username}`);
  const joinedYear = $derived(
    profile.joinedAt ? profile.joinedAt.getFullYear() : null,
  );
</script>

<header class="profile-hero">
  {#if profile.cover?.url}
    <div
      class="profile-hero__cover"
      style:background-image={`url(${profile.cover.url})`}
      aria-hidden="true"
    ></div>
  {/if}
  <div class="profile-hero__fade" aria-hidden="true"></div>

  <div class="profile-hero__inner">
    <div class="profile-hero__avatar">
      {#if profile.avatar?.url}
        <img src={profile.avatar.url} alt={displayName} />
      {:else}
        <span aria-hidden="true">{displayName.charAt(0)}</span>
      {/if}
    </div>

    <div class="profile-hero__meta">
      <h1 class="profile-hero__name">{displayName}</h1>
      <p class="profile-hero__handle">
        <span>@{profile.username}</span>
        {#if joinedYear}
          <span class="profile-hero__joined">
            {m.profile_joined_in({ year: String(joinedYear) })}
          </span>
        {/if}
      </p>
      {#if profile.about}
        <p class="profile-hero__bio">{profile.about}</p>
      {/if}
    </div>

    {#if isMe}
      <a class="profile-hero__cta" href="/settings">
        {m.profile_cta_edit()}
      </a>
    {:else}
      <a class="profile-hero__cta profile-hero__cta--accent" href="/social">
        {m.profile_cta_follow()}
      </a>
    {/if}
  </div>
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .profile-hero {
    position: relative;
    isolation: isolate;
    padding-top: clamp(20px, 4vw, 64px);
    padding-bottom: clamp(20px, 4vw, 48px);
    overflow: hidden;

    &__cover {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: 50% 35%;
      opacity: 0.4;
      z-index: -2;
    }

    &__fade {
      position: absolute;
      inset: 0;
      z-index: -1;
      background: linear-gradient(
        180deg,
        transparent 0%,
        color-mix(in srgb, var(--shade-1000) 70%, transparent) 60%,
        var(--shade-1000) 100%
      );
    }

    &__inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 clamp(16px, 3vw, 32px);
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: var(--gap-l);
      align-items: end;
    }

    &__avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      overflow: hidden;
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);
      border: 2px solid color-mix(in srgb, var(--shade-10) 10%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      span {
        font-family: var(--font-family-serif, Georgia, serif);
        font-size: 2.4rem;
        color: var(--color-text-secondary);
      }
    }

    &__meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__name {
      margin: 0;
      font-family: var(--font-family-serif, "Tiempos Headline", Georgia, serif);
      font-weight: 400;
      font-size: clamp(1.8rem, 3.4vw, 2.6rem);
      color: var(--color-text-primary);
    }

    &__handle {
      margin: 0;
      font-size: 0.85rem;
      color: var(--color-text-secondary);
      display: flex;
      gap: var(--gap-s);
      flex-wrap: wrap;
    }

    &__joined {
      color: color-mix(in srgb, var(--color-text-secondary) 80%, transparent);
    }

    &__bio {
      margin: 6px 0 0;
      font-size: 0.95rem;
      color: var(--color-text-primary);
      max-width: 60ch;
      line-height: 1.45;
    }

    &__cta {
      display: inline-block;
      padding: 0.55rem 1.2rem;
      border-radius: 3px;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 700;
      text-decoration: none;
      color: var(--color-text-primary);
      border: 1px solid color-mix(in srgb, var(--shade-10) 12%, transparent);

      &:hover { border-color: var(--color-text-primary); }

      &--accent {
        background: var(--color-background-green, var(--green-500));
        border-color: var(--color-background-green, var(--green-500));
        color: var(--shade-1000);

        &:hover { background: var(--green-400); }
      }
    }

    @include for-mobile {
      &__inner {
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;
      }

      &__cta {
        grid-column: 1 / -1;
        justify-self: start;
        margin-top: var(--gap-s);
      }
    }
  }
</style>
